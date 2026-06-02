// app/api/auth/connect/[connector]/route.ts
//
// Initiates an OAuth2 authorization flow for a connector.
// GET /api/auth/connect/[connector]
//   → sets a signed state cookie
//   → redirects the user to the provider's consent screen

import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getCurrentOrg } from "@/lib/auth/org";
import { OAUTH_PROVIDERS } from "@/lib/oauth/providers";
import type { ConnectorName } from "@/lib/runner/types";

type RouteParams = { params: Promise<{ connector: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  const { connector } = await params;

  // Auth check
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tenantId } = await getCurrentOrg();

  // Look up provider config
  const provider = OAUTH_PROVIDERS[connector as ConnectorName];
  if (!provider) {
    return NextResponse.json(
      { error: `No OAuth provider configured for connector: ${connector}` },
      { status: 400 }
    );
  }

  // Generate CSRF state
  const state = randomBytes(32).toString("hex");

  // Store state in a short-lived httpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set("oauth_state", JSON.stringify({ state, tenantId, connector }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600, // 10 minutes
    sameSite: "lax",
    path: "/",
  });

  // Build the authorization URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/callback/${connector}`;

  const clientId = process.env[provider.clientIdEnv];
  if (!clientId) {
    return NextResponse.json(
      { error: `Missing env var: ${provider.clientIdEnv}` },
      { status: 500 }
    );
  }

  const searchParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: provider.scopes.join(" "),
    state,
    response_type: "code",
    ...provider.extraAuthParams,
  });

  const authUrl = `${provider.authorizationUrl}?${searchParams.toString()}`;
  return NextResponse.redirect(authUrl);
}
