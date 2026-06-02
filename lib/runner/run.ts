import { query } from "@anthropic-ai/claude-agent-sdk";
import type { SDKMessage } from "@anthropic-ai/claude-agent-sdk";

import { getAgent } from "@/lib/agents";
import { getTenantContext } from "@/lib/auth/org";
import { getConnectorClients } from "@/lib/mcp/registry";
import { persistPlan, recordRunStart, recordRunFailure } from "@/lib/db/queries/runs";
import { logAudit } from "@/lib/runner/audit";
import type { ProposedToolCall, WorkflowPlan } from "./types";

type RunOpts = {
  tenantId: string;
  workflowName: string;
  triggeredBy: "owner" | "schedule" | "admin";
  triggeredByUserId?: string;
};

/**
 * Run a workflow in PLAN mode — produces a proposed-action plan,
 * persists it, and returns the run ID. Does NOT execute anything
 * that would write to a third-party system; that happens later in
 * lib/runner/execute.ts after owner approval.
 */
export async function runWorkflow(opts: RunOpts): Promise<{ runId: string; plan: WorkflowPlan }> {
  const agent = getAgent(opts.workflowName);
  const tenant = await getTenantContext(opts.tenantId);

  const triggeredBy =
    opts.triggeredBy === "owner"
      ? `owner:${opts.triggeredByUserId}`
      : opts.triggeredBy;

  const runId = await recordRunStart({
    tenantId: opts.tenantId,
    workflowName: opts.workflowName,
    triggeredBy,
  });

  await logAudit({
    tenantId: opts.tenantId,
    runId,
    actor: opts.triggeredByUserId ?? "system",
    event: "run.started",
    payload: { workflowName: opts.workflowName },
  });

  try {
    const prompt = agent.promptTemplate({ tenant });
    const mcpServers = await getConnectorClients({
      tenantId: opts.tenantId,
      connectors: agent.connectors,
    });

    // Collect every message emitted by the SDK so we can find the result.
    const messages: SDKMessage[] = [];
    for await (const message of query({
      prompt,
      options: {
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
        permissionMode: "plan",
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
      throw new Error(`Agent run did not complete successfully (${subtype})`);
    }

    // Validate the structured output against the workflow's schema.
    // parse() throws a ZodError with field-level detail on mismatch.
    const validated = agent.outputSchema.parse(resultMessage.structured_output);

    // Map the validated output to approval-queue items.
    // agent.toProposedActions is set on write-heavy workflows (e.g. invoice-chase).
    // Read-only / reporting workflows omit it and get a single "review output" row.
    const proposedActions: ProposedToolCall[] =
      agent.toProposedActions != null
        ? agent.toProposedActions(validated)
        : [
            {
              toolName: opts.workflowName,
              args: validated,
              humanSummary: `Review ${agent.displayName} output`,
            },
          ];

    const plan: WorkflowPlan = {
      workflowName: opts.workflowName,
      proposedActions,
      agentOutput: validated,
    };

    await persistPlan({ runId, tenantId: opts.tenantId, plan });

    await logAudit({
      tenantId: opts.tenantId,
      runId,
      actor: opts.triggeredByUserId ?? "system",
      event: "run.proposed",
      payload: {
        actionCount: proposedActions.length,
        costUsd: resultMessage.total_cost_usd,
        durationMs: resultMessage.duration_ms,
      },
    });

    return { runId, plan };
  } catch (err) {
    await recordRunFailure({ runId, error: String(err) });
    await logAudit({
      tenantId: opts.tenantId,
      runId,
      actor: opts.triggeredByUserId ?? "system",
      event: "run.failed",
      payload: { error: String(err) },
    });
    throw err;
  }
}
