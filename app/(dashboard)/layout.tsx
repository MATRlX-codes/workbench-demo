import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/lib/ui/app-shell";
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
        <AppShell>{children}</AppShell>
      </DashboardProviders>
    </CompanyProvider>
  );
}
