// lib/runner/execute.ts
//
// Replays a single approved tool call for a pending approval row.
// Called after an owner approves (or edits) an action in the approval queue.
//
// Lifecycle:
//   1. Fetch the pending_approvals row; verify tenantId + undecided state.
//   2. Fetch the workflow_run to determine the agent.
//   3. Get connector clients for the agent's connectors.
//   4. Call the Agent SDK with permissionMode: "auto" and the tool call spec
//      as the prompt, so the model executes exactly that one action.
//   5. Update the approval row with the decision.
//   6. Write an audit log entry.
//   7. If all approvals for the run are now resolved, mark run as "completed".

import { and, count, eq, isNull } from "drizzle-orm";
import { query } from "@anthropic-ai/claude-agent-sdk";
import type { SDKMessage } from "@anthropic-ai/claude-agent-sdk";

import { db } from "@/lib/db/client";
import { pendingApprovals, workflowRuns } from "@/lib/db/schema";
import { getAgent } from "@/lib/agents";
import { getConnectorClients } from "@/lib/mcp/registry";
import { logAudit } from "@/lib/runner/audit";
import { isSafe } from "@/lib/runner/safe-list";

export async function executeApproval(
  approvalId: string,
  tenantId: string,
  userId: string
): Promise<void> {
  // 1. Fetch the approval row — enforce tenant scoping.
  const [approval] = await db
    .select()
    .from(pendingApprovals)
    .where(
      and(
        eq(pendingApprovals.id, approvalId),
        eq(pendingApprovals.tenantId, tenantId)
      )
    );

  if (!approval) {
    throw new Error(`Approval ${approvalId} not found for tenant ${tenantId}`);
  }
  if (approval.decision !== null) {
    throw new Error(
      `Approval ${approvalId} has already been decided (${approval.decision})`
    );
  }

  // 2. Get the workflow run to find the agent.
  const [run] = await db
    .select()
    .from(workflowRuns)
    .where(
      and(
        eq(workflowRuns.id, approval.runId),
        eq(workflowRuns.tenantId, tenantId)
      )
    );

  if (!run) {
    throw new Error(`Workflow run ${approval.runId} not found`);
  }

  const agent = getAgent(run.workflowName);

  // 3. Use editedSpec if the owner edited the action, otherwise use toolCallSpec.
  const spec = (approval.editedSpec ?? approval.toolCallSpec) as {
    toolName: string;
    args: unknown;
  };

  if (!isSafe(spec.toolName)) {
    throw new Error(
      `Tool "${spec.toolName}" is not on the safe list. Cannot auto-execute.`
    );
  }

  // 4. Get connector clients scoped to this tenant.
  const mcpServers = await getConnectorClients({
    tenantId,
    connectors: agent.connectors,
  });

  // Build a minimal prompt that instructs the model to execute the single tool call.
  const replayPrompt = `
Execute this single approved action and nothing else:

Tool: ${spec.toolName}
Arguments: ${JSON.stringify(spec.args, null, 2)}

Invoke the tool once with exactly those arguments. Do not perform any other actions.
Return a brief confirmation of what was executed.
`.trim();

  // 5. Run the Agent SDK in auto mode for this one call.
  const messages: SDKMessage[] = [];
  for await (const message of query({
    prompt: replayPrompt,
    options: {
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      permissionMode: "auto",
      mcpServers,
    },
  })) {
    messages.push(message);
  }

  const resultMessage = messages.find(
    (m): m is SDKMessage & { type: "result" } => m.type === "result"
  );

  if (!resultMessage || resultMessage.subtype !== "success") {
    const subtype = resultMessage?.subtype ?? "no result message";
    throw new Error(
      `Tool execution did not complete successfully (${subtype}). Approval not recorded.`
    );
  }

  // 6. Update the approval row.
  await db
    .update(pendingApprovals)
    .set({
      decision: "approved",
      decidedAt: new Date(),
      decidedByUserId: userId,
    })
    .where(eq(pendingApprovals.id, approvalId));

  // 7. Audit log.
  await logAudit({
    tenantId,
    runId: run.id,
    approvalId,
    actor: userId,
    event: "action.executed",
    payload: {
      toolName: spec.toolName,
      args: spec.args,
      wasEdited: approval.editedSpec !== null,
    },
  });

  // 8. Check whether all approvals for this run are now resolved.
  const [{ pendingCount }] = await db
    .select({ pendingCount: count() })
    .from(pendingApprovals)
    .where(
      and(
        eq(pendingApprovals.runId, run.id),
        isNull(pendingApprovals.decision)
      )
    );

  if (pendingCount === 0) {
    await db
      .update(workflowRuns)
      .set({ status: "completed" })
      .where(eq(workflowRuns.id, run.id));

    await logAudit({
      tenantId,
      runId: run.id,
      actor: userId,
      event: "run.completed",
      payload: { resolvedBy: userId },
    });
  }
}
