import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/lib/ui/sidebar";
import { CompanyProvider } from "@/lib/mock/company-context";
import { DashboardProviders } from "@/lib/mock/dashboard-providers";
import { DEMO_MODE } from "@/lib/dev/demo-mode";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Demo deploys have no auth — land straight in the dashboard.
  if (!DEMO_MODE) {
    const { userId, orgId } = await auth();
    if (!userId) redirect("/sign-in");
    if (!orgId) redirect("/onboarding/select-tenant");
  }

  return (
    <CompanyProvider>
      <DashboardProviders>
        <div className="flex min-h-screen" style={{ background: "#1D1D1F" }}>
          <Sidebar />
          <main
            className="flex-1 min-w-0 overflow-y-auto"
            style={{ background: "#F5F5F7", color: "#1D1D1F", minHeight: "100vh" }}
          >
            {children}
          </main>
        </div>
      </DashboardProviders>
    </CompanyProvider>
  );
}
