// app/(admin)/tenants/page.tsx
//
// Superadmin view of all tenants. Only accessible to & Again staff with the
// "venturo_admin" role set in Clerk session claims metadata.
//
// Cross-tenant read — intentionally NOT scoped to a single tenant.
// All mutations from this page must also carry the venturo_admin check.

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";
import { DEMO_MODE } from "@/lib/dev/demo-mode";

export default async function AdminTenantsPage() {
  // Cross-tenant admin view reads from Clerk + Postgres; hidden in the demo.
  if (DEMO_MODE) redirect("/");

  // Enforce venturo_admin role. Redirect non-admins rather than 403 to avoid
  // information leakage about the existence of the admin section.
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as Record<string, unknown> | undefined)
    ?.role;

  if (role !== "venturo_admin") {
    redirect("/");
  }

  const allTenants = await db
    .select({
      id: tenants.id,
      businessName: tenants.businessName,
      clerkOrgId: tenants.clerkOrgId,
      country: tenants.country,
      tier: tenants.tier,
      createdAt: tenants.createdAt,
    })
    .from(tenants)
    .orderBy(tenants.createdAt);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          All tenants
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          & Again superadmin — {String(allTenants.length)} organisations
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-hairline">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-surface-subtle text-left">
              <th className="px-4 py-3 font-medium text-ink-muted">Business name</th>
              <th className="px-4 py-3 font-medium text-ink-muted">Clerk org ID</th>
              <th className="px-4 py-3 font-medium text-ink-muted">Country</th>
              <th className="px-4 py-3 font-medium text-ink-muted">Tier</th>
              <th className="px-4 py-3 font-medium text-ink-muted">Created</th>
              <th className="px-4 py-3 font-medium text-ink-muted">ID</th>
            </tr>
          </thead>
          <tbody>
            {allTenants.map((tenant, i) => (
              <tr
                key={tenant.id}
                className={
                  i % 2 === 0 ? "bg-surface" : "bg-surface-subtle"
                }
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {tenant.businessName}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                  {tenant.clerkOrgId}
                </td>
                <td className="px-4 py-3 text-ink-muted">{tenant.country}</td>
                <td className="px-4 py-3 text-ink-muted">{tenant.tier}</td>
                <td className="px-4 py-3 text-ink-muted">
                  {tenant.createdAt.toLocaleDateString("en-IE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                  {tenant.id}
                </td>
              </tr>
            ))}
            {allTenants.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-ink-muted"
                >
                  No tenants yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
