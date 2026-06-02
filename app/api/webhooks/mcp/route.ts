// app/api/webhooks/mcp/route.ts
//
// Stub webhook handler for MCP server push notifications.
//
// TODO: When &Again-built MCP servers (e.g. Revenue/ROS) need to push
// status changes or event notifications back to Workbench, implement
// full signature verification and event routing here. For now, all
// requests return 200 OK so the sending server does not retry indefinitely.

import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  // TODO: Verify webhook signature from the MCP server.
  // TODO: Parse the event payload and route to the appropriate handler.
  // TODO: Queue any resulting workflow actions for tenant approval.
  return NextResponse.json({ ok: true }, { status: 200 });
}
