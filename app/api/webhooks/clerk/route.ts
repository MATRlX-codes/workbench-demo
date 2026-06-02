import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";

type ClerkOrgCreatedEvent = {
  type: "organization.created";
  data: {
    id: string;
    name: string;
    slug: string;
  };
};

type ClerkEvent = ClerkOrgCreatedEvent | { type: string; data: unknown };

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook secret not configured", { status: 500 });

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(secret);

  let event: ClerkEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "organization.created") {
    const { id: clerkOrgId, name } = (event as ClerkOrgCreatedEvent).data;
    await db
      .insert(tenants)
      .values({ clerkOrgId, businessName: name })
      .onConflictDoNothing();
  }

  return new Response(null, { status: 200 });
}
