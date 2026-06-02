import { redirect } from "next/navigation";
import { listAgents } from "@/lib/agents";
import { getCurrentOrg } from "@/lib/auth/org";
import { getEnabledWorkflows, getPendingApprovalCount } from "@/lib/db/queries/workflows";
import { WorkflowCard } from "@/lib/ui/workflow-card";
import { ApprovalBanner } from "@/lib/ui/approval-banner";
import { MOCK_MODE } from "@/lib/dev/mock-mode";
import { DEMO_MODE } from "@/lib/dev/demo-mode";
import { PageHeader } from "@/lib/ui/page-header";

export default async function WorkflowsPage() {
  // This page reads from Clerk + Postgres; not part of the no-backend demo.
  if (DEMO_MODE) redirect("/");
  const org = await getCurrentOrg();
  const [enabled, pendingCount] = await Promise.all([
    getEnabledWorkflows(org.tenantId),
    getPendingApprovalCount(org.tenantId),
  ]);
  const agents = listAgents();

  return (
    <>
      <PageHeader title="Workflows" subtitle="15 automated workflows" />

      <div className="px-8 py-6 max-w-[1100px] mx-auto">
        {MOCK_MODE && (
          <div
            className="mb-6 rounded-[16px] px-4 py-3 text-[13.5px]"
            style={{ background: "#FAEEDA", border: "1px solid #f0dcb0", color: "#A26411" }}
          >
            <span className="font-semibold">Dev mode</span> — mock data only. No real API calls are made. Set{" "}
            <code className="font-mono text-xs rounded px-1" style={{ background: "#F4DFB0" }}>MOCK_MODE=false</code> in{" "}
            <code className="font-mono text-xs rounded px-1" style={{ background: "#F4DFB0" }}>.env.local</code> to use live connectors.
          </div>
        )}

        {pendingCount > 0 && <ApprovalBanner count={pendingCount} />}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {agents.map((agent) => {
            const config = enabled.find((e) => e.workflowName === agent.name);
            return (
              <WorkflowCard
                key={agent.name}
                agent={agent}
                enabled={MOCK_MODE || config?.enabled === "yes"}
                schedule={config?.scheduleCron ?? agent.schedule?.cron}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
