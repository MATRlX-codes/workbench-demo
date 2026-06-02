// lib/mcp/registry.ts
//
// Central registry of MCP server URLs and their OAuth scope requirements.
// When a workflow agent declares connectors[], the runner looks them up here
// to attach the actual MCP server to the Agent SDK call.

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { connectorGrants } from "@/lib/db/schema";
import { decryptTokens } from "@/lib/crypto/tokens";

import type { ConnectorName } from "@/lib/runner/types";

type McpServerConfig = {
  url: string;
  authType: "oauth" | "api_key" | "internal";
  scopes: string[];
  description: string;
};

export const MCP_REGISTRY: Record<ConnectorName, McpServerConfig> = {
  quickbooks: {
    url: process.env.MCP_QUICKBOOKS_URL!,
    authType: "oauth",
    scopes: ["com.intuit.quickbooks.accounting"],
    description: "Bookkeeping, invoices, payroll, tax",
  },
  gmail: {
    url: process.env.MCP_GMAIL_URL!,
    authType: "oauth",
    scopes: ["gmail.modify"],
    description: "Read + create drafts in Gmail (no auto-send)",
  },
  google_calendar: {
    url: process.env.MCP_GOOGLE_CALENDAR_URL!,
    authType: "oauth",
    scopes: ["calendar.events"],
    description: "Read + propose calendar events",
  },
  google_drive: {
    url: process.env.MCP_GOOGLE_DRIVE_URL!,
    authType: "oauth",
    scopes: ["drive.file"],
    description: "Read + create files (limited to ones it created)",
  },
  microsoft_365: {
    url: process.env.MCP_MICROSOFT_365_URL!,
    authType: "oauth",
    scopes: ["Mail.ReadWrite", "Calendars.ReadWrite", "Files.ReadWrite"],
    description: "Outlook, Calendar, OneDrive",
  },
  hubspot: {
    url: process.env.MCP_HUBSPOT_URL!,
    authType: "oauth",
    scopes: [
      "crm.objects.contacts.read",
      "crm.objects.contacts.write",
      "crm.objects.deals.read",
    ],
    description: "Contacts, deals, marketing emails",
  },
  stripe: {
    url: process.env.MCP_STRIPE_URL!,
    authType: "oauth",
    scopes: ["read"],
    description: "Read-only access to charges, payouts, customers",
  },
  paypal: {
    url: process.env.MCP_PAYPAL_URL!,
    authType: "oauth",
    scopes: ["read"],
    description: "Read-only access to settlements, transactions",
  },
  square: {
    url: process.env.MCP_SQUARE_URL!,
    authType: "oauth",
    scopes: ["read"],
    description: "POS transactions, payouts",
  },
  canva: {
    url: process.env.MCP_CANVA_URL!,
    authType: "oauth",
    scopes: ["design:write", "brand-kit:read"],
    description: "Create designs from brand kit, export assets",
  },
  docusign: {
    url: process.env.MCP_DOCUSIGN_URL!,
    authType: "oauth",
    scopes: ["envelope.create", "envelope.read"],
    description: "Send and track envelopes (signature flows)",
  },
  slack: {
    url: process.env.MCP_SLACK_URL!,
    authType: "oauth",
    scopes: ["chat:write", "channels:read"],
    description: "Post to allowed channels, read for context",
  },
  webflow: {
    url: process.env.MCP_WEBFLOW_URL!,
    authType: "oauth",
    scopes: ["cms:read", "cms:write"],
    description: "Read + write CMS collections, forms",
  },
  revenue_ros: {
    url: process.env.MCP_REVENUE_URL!,
    authType: "internal", // &Again-built MCP server, Phase 3
    scopes: [],
    description: "Read-only VAT3 + PAYE schedule. Proposes, never files.",
  },
};

type SseMcpServer = {
  type: "sse";
  url: string;
  requestHeaders: Record<string, string>;
};

/**
 * Returns a Record<connectorName, SseMcpServer> suitable for passing
 * directly to the @anthropic-ai/claude-agent-sdk `mcpServers` option.
 *
 * Throws if a required connector grant is missing or unhealthy for the tenant.
 *
 * Token storage format (AES-256-GCM, key = TENANT_ENCRYPTION_KEY as 64-char hex):
 *   base64( iv[12] + ciphertext[N] + authTag[16] )
 * Decrypted plaintext is JSON: { access_token: string, token_type: string }
 */
export async function getConnectorClients(opts: {
  tenantId: string;
  connectors: ConnectorName[];
}): Promise<Record<string, SseMcpServer>> {
  if (opts.connectors.length === 0) return {};

  const grants = await db
    .select()
    .from(connectorGrants)
    .where(
      and(
        eq(connectorGrants.tenantId, opts.tenantId),
        inArray(connectorGrants.connector, opts.connectors as string[])
      )
    );

  const grantByConnector = new Map(grants.map((g) => [g.connector, g]));

  const result: Record<string, SseMcpServer> = {};

  for (const connector of opts.connectors) {
    const grant = grantByConnector.get(connector);
    if (!grant) {
      throw new Error(
        `Connector "${connector}" is not connected for this tenant. Visit /connectors to authorise it.`
      );
    }
    if (grant.status !== "healthy") {
      throw new Error(
        `Connector "${connector}" needs re-authorisation (status: ${grant.status}). Visit /connectors.`
      );
    }
    if (grant.expiresAt && grant.expiresAt < new Date()) {
      throw new Error(
        `Connector "${connector}" token has expired. Visit /connectors to re-authorise.`
      );
    }

    const { access_token } = decryptTokens(grant.encryptedTokens);
    const serverConfig = MCP_REGISTRY[connector];

    result[connector] = {
      type: "sse",
      url: serverConfig.url,
      requestHeaders: { Authorization: `Bearer ${access_token}` },
    };
  }

  return result;
}

