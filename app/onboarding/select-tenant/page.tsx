import { redirect } from "next/navigation";
import { CreateOrganization } from "@clerk/nextjs";
import { DEMO_MODE } from "@/lib/dev/demo-mode";

export default function SelectTenantPage() {
  if (DEMO_MODE) redirect("/");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-muted/40 px-4">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold">Create your business</h1>
        <p className="text-sm text-muted-foreground">
          Each business is a separate workspace. You can switch between them later.
        </p>
      </div>
      <CreateOrganization afterCreateOrganizationUrl="/" />
    </div>
  );
}
