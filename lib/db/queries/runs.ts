import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pendingApprovals, workflowRuns } from "@/lib/db/schema";
import type { WorkflowPlan } from "@/lib/runner/types";

export async function recordRunStart(opts: {
  tenantId: string;
  workflowName: string;
  triggeredBy: string;
}): Promise<string> {
  const [row] = await db
    .insert(workflowRuns)
    .values({
      tenantId: opts.tenantId,
      workflowName: opts.workflowName,
      triggeredBy: opts.triggeredBy,
      status: "proposed",
    })
    .returning({ id: workflowRuns.id });
  return row.id;
}

export async function recordRunFailure(opts: {
  runId: string;
  error: string;
}): Promise<void> {
  await db
    .update(workflowRuns)
    .set({ status: "failed", errorMessage: opts.error })
    .where(eq(workflowRuns.id, opts.runId));
}

export async function persistPlan(opts: {
  runId: string;
  tenantId: string;
  plan: WorkflowPlan;
}): Promise<void> {
  await db
    .update(workflowRuns)
    .set({ plan: opts.plan as Record<string, unknown> })
    .where(eq(workflowRuns.id, opts.runId));

  if (opts.plan.proposedActions.length === 0) return;

  await db.insert(pendingApprovals).values(
    opts.plan.proposedActions.map((action) => ({
      runId: opts.runId,
      tenantId: opts.tenantId,
      action: action.humanSummary,
      toolCallSpec: { toolName: action.toolName, args: action.args } as Record<string, unknown>,
    }))
  );
}
