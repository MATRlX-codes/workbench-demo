// app/actions/run-workflow.ts
//
// Server action: owner clicks "Run now" on a workflow card. Triggers the
// runner under their tenant context. Returns the runId so the UI can
// redirect to the queue.
//
// "use server" file — never import from "use client" components.

"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { runWorkflow } from "@/lib/runner/run";
import { runWorkflowMock } from "@/lib/dev/mock-runner";
import { MOCK_MODE } from "@/lib/dev/mock-mode";
import { getOrgIdToTenantId } from "@/lib/auth/org";

export async function runWorkflowAction(workflowName: string) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) throw new Error("Not authenticated");

  const tenantId = await getOrgIdToTenantId(orgId);

  const { runId } = MOCK_MODE
    ? await runWorkflowMock({
        tenantId,
        workflowName,
        triggeredBy: "owner",
        triggeredByUserId: userId,
      })
    : await runWorkflow({
        tenantId,
        workflowName,
        triggeredBy: "owner",
        triggeredByUserId: userId,
      });

  redirect(`/queue?highlight=${runId}`);
}
