import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { connectorGrants } from "@/lib/db/schema";
import type { ConnectorName } from "@/lib/runner/types";
import { MCP_REGISTRY } from "@/lib/mcp/registry";
import { MOCK_MODE } from "@/lib/dev/mock-mode";

export type ConnectorStatus = {
  name: ConnectorName;
  description: string;
  status: "healthy" | "reauth_needed" | "revoked" | "not_connected";
  grantedAt: Date | null;
  expiresAt: Date | null;
};

export async function listConnectorStatuses(
  tenantId: string
): Promise<ConnectorStatus[]> {
  // In mock mode every connector appears healthy so the UI is fully exercisable
  // without real OAuth tokens.
  if (MOCK_MODE) {
    const now = new Date();
    return (Object.keys(MCP_REGISTRY) as ConnectorName[]).map((name) => ({
      name,
      description: MCP_REGISTRY[name].description,
      status: "healthy",
      grantedAt: now,
      expiresAt: null,
    }));
  }

  const grants = await db
    .select()
    .from(connectorGrants)
    .where(eq(connectorGrants.tenantId, tenantId));

  const grantByConnector = new Map(grants.map((g) => [g.connector, g]));

  return (Object.keys(MCP_REGISTRY) as ConnectorName[]).map((name) => {
    const grant = grantByConnector.get(name);
    return {
      name,
      description: MCP_REGISTRY[name].description,
      status: grant ? grant.status : "not_connected",
      grantedAt: grant?.grantedAt ?? null,
      expiresAt: grant?.expiresAt ?? null,
    };
  });
}
