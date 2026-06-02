// lib/agents/lead-triager.ts
//
// Workflow: Lead triage
// Reads new HubSpot contacts from the last 48 hours, scores them by fit,
// and drafts personalised outreach emails for owner approval.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  leads: z.array(
    z.object({
      contactId: z.string(),
      name: z.string(),
      email: z.string().email(),
      company: z.string(),
      fitScore: z.number().int().min(1).max(10),
      fitScoreRationale: z.string(),
      outreachSubject: z.string().max(120),
      outreachBody: z.string(),
      draftId: z.string(),
    })
  ),
  skipped: z.array(
    z.object({
      contactId: z.string(),
      reason: z.string(),
    })
  ),
});

export type LeadTriagerOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "lead-triager",
  displayName: "Lead triage",
  category: "crm",
  description:
    "Reads new HubSpot contacts from the last 48 hours, scores them by fit, and drafts personalised outreach emails.",
  connectors: ["hubspot", "gmail"],

  schedule: { cron: "0 8 * * 1,3,5", timezone: "Europe/Dublin" }, // Mon/Wed/Fri 08:00

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the lead-triager workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.

Your job:
1. Use HubSpot to list contacts created or updated in the last 48 hours.
2. For each contact, assign a fit score from 1–10 based on:
   - Company size and industry (if available)
   - Whether they have an email address
   - Any notes or form submission content
   - Proximity to ${tenant.country === "IE" ? "Irish" : "Northern Irish"} market
   A score of 1 = very poor fit; 10 = ideal prospect.
3. For each lead with fitScore >= 6:
   - Draft a personalised outreach email using the tone above.
   - Personalise to what you know about them (company, industry, how they arrived).
   - Keep it concise — no more than 150 words.
   - Sign off: ${tenant.signOff ?? `Many thanks, ${tenant.businessName}`}
   - Use Gmail to CREATE A DRAFT. Do NOT send.
   - Record the draftId.
4. For leads with fitScore < 6, add them to skipped[] with reason "Below fit threshold (score: <N>)".
5. Skip any lead missing an email address — add to skipped[] with reason "No email address".

Return leads[] (only those with fitScore >= 6 for whom a draft was created) and skipped[].

Hard rules:
- Never send any email.
- Never modify any HubSpot record.
- Always create Gmail drafts, not send them.
`.trim(),

  toProposedActions: (output) => {
    const { leads } = output as LeadTriagerOutput;
    return leads.map((lead) => ({
      toolName: "lead.outreach_email",
      args: {
        to: lead.email,
        subject: lead.outreachSubject,
        body: lead.outreachBody,
        fitScore: lead.fitScore,
        fitScoreRationale: lead.fitScoreRationale,
        company: lead.company,
      },
      humanSummary: `Send outreach to ${lead.name} (${lead.company}) — fit score ${String(lead.fitScore)}/10`,
    }));
  },

  outputSchema,
};
