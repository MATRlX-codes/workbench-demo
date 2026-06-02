// app/api/run/[workflow]/route.ts
//
// POST endpoint for the Inngest scheduler to trigger a workflow run.
// Not owner-facing — called by the cron job runner, not the browser.
//
// Authentication: Bearer token checked against INNGEST_SIGNING_KEY.
// (Full Inngest webhook signature verification can replace this in production.)
//
// Body: { tenantId: string }
// Response: { runId: string }

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";
import { getAgent } from "@/lib/agents";
import { runWorkflow } from "@/lib/runner/run";

type RouteParams = { params: Promise<{ workflow: string }> };

export async function POST(req: NextRequest, { params }: RouteParams) {
  // 1. Verify the Bearer token.
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.INNGEST_SIGNING_KEY;

  if (!expectedKey) {
    return NextResponse.json(
      { error: "INNGEST_SIGNING_KEY is not configured" },
      { status: 500 }
    );
  }

  if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse and validate the request body.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).tenantId !== "string"
  ) {
    return NextResponse.json(
      { error: "Body must contain { tenantId: string }" },
      { status: 400 }
    );
  }

  const { tenantId } = body as { tenantId: string };
  const { workflow } = await params;

  // 3. Verify the tenant exists.
  const [tenant] = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.id, tenantId));

  if (!tenant) {
    return NextResponse.json(
      { error: `Tenant ${tenantId} not found` },
      { status: 404 }
    );
  }

  // 4. Verify the agent exists (throws if unknown).
  try {
    getAgent(workflow);
  } catch {
    return NextResponse.json(
      { error: `Unknown workflow: ${workflow}` },
      { status: 404 }
    );
  }

  // 5. Trigger the workflow.
  try {
    const { runId } = await runWorkflow({
      tenantId,
      workflowName: workflow,
      triggeredBy: "schedule",
    });

    return NextResponse.json({ runId }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
