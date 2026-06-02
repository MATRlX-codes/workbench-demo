import { and, count, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pendingApprovals, workflowConfigs } from "@/lib/db/schema";

export async function getEnabledWorkflows(tenantId: string) {
  return db
    .select()
    .from(workflowConfigs)
    .where(eq(workflowConfigs.tenantId, tenantId));
}

export async function getPendingApprovalCount(tenantId: string): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(pendingApprovals)
    .where(
      and(
        eq(pendingApprovals.tenantId, tenantId),
        isNull(pendingApprovals.decision)
      )
    );
  return row?.value ?? 0;
}
