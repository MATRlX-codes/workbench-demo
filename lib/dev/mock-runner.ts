// lib/dev/mock-runner.ts
//
// Drop-in replacement for lib/runner/run.ts when MOCK_MODE=true.
// Writes to the same DB tables as the real runner so the full approval
// lifecycle is exercisable without real API keys or OAuth tokens.

import { getAgent } from "@/lib/agents";
import { recordRunStart, persistPlan } from "@/lib/db/queries/runs";
import { logAudit } from "@/lib/runner/audit";
import { MOCK_OUTPUTS } from "@/lib/dev/mock-outputs";
import type { ProposedToolCall, WorkflowPlan } from "@/lib/runner/types";

export async function runWorkflowMock(opts: {
  tenantId: string;
  workflowName: string;
  triggeredBy: string;
  triggeredByUserId: string;
}): Promise<{ runId: string; plan: WorkflowPlan }> {
  const agent = getAgent(opts.workflowName);
  const mockOutput = MOCK_OUTPUTS[opts.workflowName];

  if (mockOutput === undefined) {
    throw new Error(`No mock output registered for workflow: ${opts.workflowName}`);
  }

  // Validate the mock output against the real schema so mock data stays honest.
  const validated = agent.outputSchema.parse(mockOutput);

  const runId = await recordRunStart({
    tenantId: opts.tenantId,
    workflowName: opts.workflowName,
    triggeredBy: `${opts.triggeredBy}:${opts.triggeredByUserId}`,
  });

  await logAudit({
    tenantId: opts.tenantId,
    runId,
    actor: opts.triggeredByUserId,
    event: "run.started",
    payload: { workflowName: opts.workflowName, mode: "mock" },
  });

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
    actor: opts.triggeredByUserId,
    event: "run.proposed",
    payload: { actionsCount: proposedActions.length, mode: "mock" },
  });

  return { runId, plan };
}
