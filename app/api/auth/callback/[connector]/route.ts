// app/api/auth/callback/[connector]/route.ts
//
// OAuth2 callback handler. Receives the authorization code, exchanges it for
// tokens, encrypts them, and upserts into connector_grants.
// GET /api/auth/callback/[connector]?code=...&state=...

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { connectorGrants } from "@/lib/db/schema";
import { encryptTokens } from "@/lib/crypto/tokens";
import { OAUTH_PROVIDERS } from "@/lib/oauth/providers";
import { getCurrentOrg } from "@/lib/auth/org";
import type { ConnectorName } from "@/lib/runner/types";
import { MCP_REGISTRY } from "@/lib/mcp/registry";

type RouteParams = { params: Promise<{ connector: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  const { connector } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const connectorsUrl = `${appUrl}/connectors`;

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const stateParam = url.searchParams.get("state");

    // Read and validate state cookie
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get("oauth_state")?.value;
    if (!rawCookie) {
      return NextResponse.redirect(`${connectorsUrl}?error=missing_state`);
    }

    let cookiePayload: { state: string; tenantId: string; connector: string };
    try {
      cookiePayload = JSON.parse(rawCookie) as {
        state: string;
        tenantId: string;
        connector: string;
      };
    } catch {
      return NextResponse.redirect(`${connectorsUrl}?error=invalid_state`);
    }

    if (!stateParam || stateParam !== cookiePayload.state) {
      return NextResponse.redirect(`${connectorsUrl}?error=state_mismatch`);
    }

    if (cookiePayload.connector !== connector) {
      return NextResponse.redirect(`${connectorsUrl}?error=connector_mismatch`);
    }

    if (!code) {
      const errorDesc = url.searchParams.get("error_description") ?? url.searchParams.get("error") ?? "no_code";
      return NextResponse.redirect(
        `${connectorsUrl}?error=${encodeURIComponent(errorDesc)}`
      );
    }

    // Look up provider
    const provider = OAUTH_PROVIDERS[connector as ConnectorName];
    if (!provider) {
      return NextResponse.redirect(`${connectorsUrl}?error=unknown_connector`);
    }

    const clientId = process.env[provider.clientIdEnv];
    const clientSecret = process.env[provider.clientSecretEnv];
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${connectorsUrl}?error=missing_credentials`);
    }

    // Exchange code for tokens
    const redirectUri = `${appUrl}/api/auth/callback/${connector}`;
    const tokenRes = await fetch(provider.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error(`[oauth-callback] Token exchange failed for ${connector}:`, body);
      return NextResponse.redirect(`${connectorsUrl}?error=token_exchange_failed`);
    }

    const tokenData = (await tokenRes.json()) as Record<string, unknown>;

    // Validate minimal shape
    if (typeof tokenData.access_token !== "string") {
      return NextResponse.redirect(`${connectorsUrl}?error=invalid_token_response`);
    }

    // Encrypt tokens
    const encryptedTokens = encryptTokens(JSON.stringify(tokenData));

    // Compute expiry
    let expiresAt: Date | null = null;
    if (typeof tokenData.expires_in === "number") {
      expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    }

    // Resolve tenantId and userId from the session
    const { tenantId, userId } = await getCurrentOrg();

    // Look up connector scopes
    const scopes = MCP_REGISTRY[connector as ConnectorName]?.scopes ?? [];

    // Upsert connector_grants: update if row exists, otherwise insert
    const [existing] = await db
      .select({ id: connectorGrants.id })
      .from(connectorGrants)
      .where(
        and(
          eq(connectorGrants.tenantId, tenantId),
          eq(connectorGrants.connector, connector)
        )
      );

    if (existing) {
      await db
        .update(connectorGrants)
        .set({
          encryptedTokens,
          expiresAt,
          status: "healthy",
          scopes,
          grantedByUserId: userId,
          grantedAt: new Date(),
        })
        .where(eq(connectorGrants.id, existing.id));
    } else {
      await db.insert(connectorGrants).values({
        tenantId,
        connector,
        grantedByUserId: userId,
        scopes,
        encryptedTokens,
        expiresAt,
        status: "healthy",
      });
    }

    // Clear state cookie
    cookieStore.set("oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.redirect(connectorsUrl);
  } catch (err) {
    console.error(`[oauth-callback] Unexpected error for ${connector}:`, err);
    const message =
      err instanceof Error ? encodeURIComponent(err.message) : "unexpected_error";
    return NextResponse.redirect(`${connectorsUrl}?error=${message}`);
  }
}
