import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pendingApprovals, workflowRuns } from "@/lib/db/schema";
import type { PendingApproval, WorkflowRun } from "@/lib/db/schema";

export type ApprovalWithRun = PendingApproval & {
  run: Pick<WorkflowRun, "workflowName" | "triggeredBy" | "triggeredAt">;
};

export async function listPendingApprovals(tenantId: string): Promise<ApprovalWithRun[]> {
  const rows = await db
    .select({
      approval: pendingApprovals,
      run: {
        workflowName: workflowRuns.workflowName,
        triggeredBy: workflowRuns.triggeredBy,
        triggeredAt: workflowRuns.triggeredAt,
      },
    })
    .from(pendingApprovals)
    .innerJoin(workflowRuns, eq(pendingApprovals.runId, workflowRuns.id))
    .where(
      and(
        eq(pendingApprovals.tenantId, tenantId),
        isNull(pendingApprovals.decision)
      )
    )
    .orderBy(pendingApprovals.proposedAt);

  return rows.map((r) => ({ ...r.approval, run: r.run }));
}
