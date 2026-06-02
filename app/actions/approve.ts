"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { pendingApprovals } from "@/lib/db/schema";
import { logAudit } from "@/lib/runner/audit";
import { getCurrentOrg } from "@/lib/auth/org";

async function decideApproval(
  approvalId: string,
  decision: "approved" | "rejected"
): Promise<void> {
  const { userId, tenantId } = await getCurrentOrg();

  const [approval] = await db
    .select({ id: pendingApprovals.id, runId: pendingApprovals.runId, tenantId: pendingApprovals.tenantId })
    .from(pendingApprovals)
    .where(eq(pendingApprovals.id, approvalId));

  if (!approval || approval.tenantId !== tenantId) {
    throw new Error("Approval not found");
  }

  await db
    .update(pendingApprovals)
    .set({ decision, decidedAt: new Date(), decidedByUserId: userId })
    .where(eq(pendingApprovals.id, approvalId));

  await logAudit({
    tenantId,
    runId: approval.runId,
    approvalId,
    actor: userId,
    event: `approval.${decision}`,
    payload: { approvalId },
  });

  revalidatePath("/queue");
}

export async function approveAction(approvalId: string): Promise<void> {
  await decideApproval(approvalId, "approved");
}

export async function rejectAction(approvalId: string): Promise<void> {
  await decideApproval(approvalId, "rejected");
}

export async function bulkApproveAction(runId: string): Promise<void> {
  await bulkDecide(runId, "approved");
}

export async function bulkRejectAction(runId: string): Promise<void> {
  await bulkDecide(runId, "rejected");
}

async function bulkDecide(
  runId: string,
  decision: "approved" | "rejected"
): Promise<void> {
  const { userId, tenantId } = await getCurrentOrg();

  await db
    .update(pendingApprovals)
    .set({ decision, decidedAt: new Date(), decidedByUserId: userId })
    .where(
      and(
        eq(pendingApprovals.runId, runId),
        eq(pendingApprovals.tenantId, tenantId),
        isNull(pendingApprovals.decision)
      )
    );

  await logAudit({
    tenantId,
    runId,
    actor: userId,
    event: decision === "approved" ? "run.bulk_approved" : "run.bulk_rejected",
    payload: { runId },
  });

  revalidatePath("/queue");
}
