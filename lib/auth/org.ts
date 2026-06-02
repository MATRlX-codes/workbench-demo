import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";
import type { TenantContext } from "@/lib/runner/types";

export async function getCurrentOrg(): Promise<{
  orgId: string;
  userId: string;
  tenantId: string;
}> {
  const { orgId, userId } = await auth();
  if (!orgId || !userId) throw new Error("Not authenticated");
  const tenantId = await getOrgIdToTenantId(orgId);
  return { orgId, userId, tenantId };
}

export async function getOrgIdToTenantId(orgId: string): Promise<string> {
  const [existing] = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.clerkOrgId, orgId));
  if (existing) return existing.id;

  // Tenant doesn't exist yet — provision it now.
  // This handles local dev (webhooks don't fire on localhost) and
  // any race where the webhook arrived before the first page load.
  const client = await clerkClient();
  const org = await client.organizations.getOrganization({ organizationId: orgId });
  const [created] = await db
    .insert(tenants)
    .values({ clerkOrgId: orgId, businessName: org.name })
    .onConflictDoNothing()
    .returning({ id: tenants.id });

  if (created) return created.id;

  // Handle the rare case where a concurrent request inserted it first.
  const [row] = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.clerkOrgId, orgId));
  if (!row) throw new Error(`Failed to provision tenant for org ${orgId}`);
  return row.id;
}

export async function getTenantContext(tenantId: string): Promise<TenantContext> {
  const [row] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.id, tenantId));
  if (!row) throw new Error(`Tenant not found: ${tenantId}`);
  return {
    id: row.id,
    businessName: row.businessName,
    country: row.country,
    currency: row.currency,
    toneOfVoice: row.toneOfVoice ?? undefined,
    signOff: row.signOff ?? undefined,
    vatRates: row.vatRates,
  };
}
