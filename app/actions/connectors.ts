"use server";

// app/actions/connectors.ts
//
// Server actions for connector management.

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { connectorGrants } from "@/lib/db/schema";
import { getCurrentOrg } from "@/lib/auth/org";

/**
 * Removes a connector grant for the current tenant.
 * Called when the owner clicks "Disconnect" on the connectors page.
 */
export async function disconnectConnector(connector: string): Promise<void> {
  const { tenantId } = await getCurrentOrg();

  await db
    .delete(connectorGrants)
    .where(
      and(
        eq(connectorGrants.tenantId, tenantId),
        eq(connectorGrants.connector, connector)
      )
    );

  revalidatePath("/connectors");
}
