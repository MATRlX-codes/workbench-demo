import { db } from "@/lib/db/client";
import { auditLog } from "@/lib/db/schema";

export async function logAudit(opts: {
  tenantId: string;
  runId?: string;
  approvalId?: string;
  actor: string;
  event: string;
  payload?: unknown;
}): Promise<void> {
  await db.insert(auditLog).values({
    tenantId: opts.tenantId,
    runId: opts.runId,
    approvalId: opts.approvalId,
    actor: opts.actor,
    event: opts.event,
    payload: opts.payload as Record<string, unknown> | undefined,
  });
}
