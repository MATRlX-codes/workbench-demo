import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { auditLog, workflowRuns } from "@/lib/db/schema";
import type { AuditLogRow } from "@/lib/db/schema";

export type AuditEventRow = AuditLogRow & {
  workflowName: string | null;
};

export async function listAuditEvents(
  tenantId: string,
  limit = 100
): Promise<AuditEventRow[]> {
  const rows = await db
    .select({
      log: auditLog,
      workflowName: workflowRuns.workflowName,
    })
    .from(auditLog)
    .leftJoin(workflowRuns, eq(auditLog.runId, workflowRuns.id))
    .where(eq(auditLog.tenantId, tenantId))
    .orderBy(desc(auditLog.at))
    .limit(limit);

  return rows.map((r) => ({ ...r.log, workflowName: r.workflowName ?? null }));
}
