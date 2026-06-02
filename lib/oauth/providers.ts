// lib/oauth/providers.ts
//
// OAuth2 provider config for every connector that requires OAuth.
// revenue_ros is an internal connector and has no OAuth entry.

import type { ConnectorName } from "@/lib/runner/types";
import { MCP_REGISTRY } from "@/lib/mcp/registry";

export type OAuthProvider = {
  authorizationUrl: string;
  tokenUrl: string;
  clientIdEnv: string;
  clientSecretEnv: string;
  scopes: string[];
  extraAuthParams?: Record<string, string>;
};

export const OAUTH_PROVIDERS: Partial<Record<ConnectorName, OAuthProvider>> = {
  quickbooks: {
    authorizationUrl: "https://appcenter.intuit.com/connect/oauth2",
    tokenUrl: "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
    clientIdEnv: "QB_CLIENT_ID",
    clientSecretEnv: "QB_CLIENT_SECRET",
    scopes: MCP_REGISTRY.quickbooks.scopes,
  },

  gmail: {
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
    scopes: MCP_REGISTRY.gmail.scopes,
    extraAuthParams: {
      access_type: "offline",
      prompt: "consent",
    },
  },

  google_calendar: {
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
    scopes: MCP_REGISTRY.google_calendar.scopes,
    extraAuthParams: {
      access_type: "offline",
      prompt: "consent",
    },
  },

  google_drive: {
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
    scopes: MCP_REGISTRY.google_drive.scopes,
    extraAuthParams: {
      access_type: "offline",
      prompt: "consent",
    },
  },

  microsoft_365: {
    authorizationUrl:
      "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl:
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    clientIdEnv: "MICROSOFT_CLIENT_ID",
    clientSecretEnv: "MICROSOFT_CLIENT_SECRET",
    scopes: MCP_REGISTRY.microsoft_365.scopes,
  },

  hubspot: {
    authorizationUrl: "https://app.hubspot.com/oauth/authorize",
    tokenUrl: "https://api.hubapi.com/oauth/v1/token",
    clientIdEnv: "HUBSPOT_CLIENT_ID",
    clientSecretEnv: "HUBSPOT_CLIENT_SECRET",
    scopes: MCP_REGISTRY.hubspot.scopes,
  },

  stripe: {
    authorizationUrl: "https://connect.stripe.com/oauth/authorize",
    tokenUrl: "https://connect.stripe.com/oauth/token",
    clientIdEnv: "STRIPE_CLIENT_ID",
    clientSecretEnv: "STRIPE_CLIENT_SECRET",
    scopes: MCP_REGISTRY.stripe.scopes,
    extraAuthParams: {
      response_type: "code",
      scope: "read_write",
    },
  },

  paypal: {
    authorizationUrl: "https://www.paypal.com/signin/authorize",
    tokenUrl: "https://api.paypal.com/v1/oauth2/token",
    clientIdEnv: "PAYPAL_CLIENT_ID",
    clientSecretEnv: "PAYPAL_CLIENT_SECRET",
    scopes: MCP_REGISTRY.paypal.scopes,
  },

  square: {
    authorizationUrl: "https://connect.squareup.com/oauth2/authorize",
    tokenUrl: "https://connect.squareup.com/oauth2/token",
    clientIdEnv: "SQUARE_CLIENT_ID",
    clientSecretEnv: "SQUARE_CLIENT_SECRET",
    scopes: MCP_REGISTRY.square.scopes,
  },

  canva: {
    authorizationUrl: "https://www.canva.com/api/oauth/authorize",
    tokenUrl: "https://api.canva.com/rest/v1/oauth/token",
    clientIdEnv: "CANVA_CLIENT_ID",
    clientSecretEnv: "CANVA_CLIENT_SECRET",
    scopes: MCP_REGISTRY.canva.scopes,
  },

  docusign: {
    authorizationUrl: "https://account.docusign.com/oauth/auth",
    tokenUrl: "https://account.docusign.com/oauth/token",
    clientIdEnv: "DOCUSIGN_CLIENT_ID",
    clientSecretEnv: "DOCUSIGN_CLIENT_SECRET",
    scopes: MCP_REGISTRY.docusign.scopes,
  },

  slack: {
    authorizationUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    clientIdEnv: "SLACK_CLIENT_ID",
    clientSecretEnv: "SLACK_CLIENT_SECRET",
    scopes: MCP_REGISTRY.slack.scopes,
  },

  webflow: {
    authorizationUrl: "https://webflow.com/oauth/authorize",
    tokenUrl: "https://api.webflow.com/oauth/access_token",
    clientIdEnv: "WEBFLOW_CLIENT_ID",
    clientSecretEnv: "WEBFLOW_CLIENT_SECRET",
    scopes: MCP_REGISTRY.webflow.scopes,
  },

  // revenue_ros is an internal connector (&Again-built MCP server) — no OAuth.
};
