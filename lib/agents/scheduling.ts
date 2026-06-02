// lib/agents/scheduling.ts
//
// Workflow: Schedule assistant
// Reads Gmail for meeting requests in the last 24 hours, checks Google Calendar
// availability, and drafts replies proposing times. Weekday mornings.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  meetingRequests: z.array(
    z.object({
      sender: z.string(),
      subject: z.string(),
      proposedTimes: z.array(z.string()), // ISO datetime strings
      replyDraftId: z.string(),
      replySubject: z.string().optional(),
      replyBody: z.string().optional(),
      calendarEventId: z.string().nullable(),
    })
  ),
  skipped: z.array(
    z.object({
      sender: z.string(),
      reason: z.string(),
    })
  ),
});

export type SchedulingOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "scheduling",
  displayName: "Schedule assistant",
  category: "operations",
  description:
    "Reads Gmail for meeting requests in the last 24 hours, checks Google Calendar availability, and drafts replies proposing times.",
  connectors: ["gmail", "google_calendar"],

  schedule: { cron: "0 8 * * 1-5", timezone: "Europe/Dublin" }, // weekdays 08:00

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the scheduling workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Timezone: Europe/Dublin.

Your job:
1. Use Gmail to search for emails received in the last 24 hours that appear to
   be meeting or call requests. Look for keywords like "meeting", "call",
   "catch up", "chat", "schedule", "availability", "diary".
2. For each meeting request:
   a. Identify the sender, subject, and any specific times they have proposed.
   b. Use Google Calendar to check the owner's availability for those proposed
      times. If none are suitable, find the next 3 available 30-minute slots
      in working hours (09:00–17:30 Europe/Dublin, Mon–Fri).
   c. List the proposed times as proposedTimes[] in ISO 8601 datetime format.
   d. Draft a reply email:
      - Politely confirm receipt and propose the available times.
      - Keep it warm and brief.
      - Sign off: ${tenant.signOff ?? `Many thanks, ${tenant.businessName}`}
      Use Gmail to CREATE A DRAFT. Do NOT send. Record replyDraftId.
   e. Do NOT create a calendar event yet — only propose times. Set calendarEventId = null.
3. Skip emails that:
   - Are clearly newsletters, receipts, or automated notifications
   - Are replies to existing threads you already handled
   - Are from no-reply addresses
   Add skipped[] with reason.

Return meetingRequests[] and skipped[].

Hard rules:
- Never send any email.
- Never create or modify calendar events — only read availability.
- Never accept or decline meeting invitations automatically.
`.trim(),

  toProposedActions: (output) => {
    const { meetingRequests } = output as SchedulingOutput;
    return meetingRequests.map((req) => ({
      toolName: "gmail.create_draft",
      args: {
        to: req.sender,
        subject: req.replySubject ?? `Re: ${req.subject}`,
        body: req.replyBody ?? `Re: ${req.subject}\n\nHi,\n\nThank you for your meeting request. I'll review and respond shortly.\n\nKind regards`,
      },
      humanSummary: `Reply to ${req.sender} re: '${req.subject}'`,
    }));
  },

  outputSchema,
};
