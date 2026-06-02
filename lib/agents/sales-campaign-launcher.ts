// lib/agents/sales-campaign-launcher.ts
//
// Workflow: Sales campaign
// Identifies warm HubSpot leads that haven't been contacted in 30+ days and
// drafts a re-engagement email sequence for owner approval.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  targets: z.array(
    z.object({
      contactId: z.string(),
      name: z.string(),
      email: z.string().email(),
      company: z.string(),
      daysSinceContact: z.number().int(),
      subject: z.string().max(120),
      body: z.string(),
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

export type SalesCampaignLauncherOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "sales-campaign-launcher",
  displayName: "Sales campaign",
  category: "crm",
  description:
    "Identifies warm HubSpot leads that haven't been contacted in 30+ days and drafts a re-engagement email sequence.",
  connectors: ["hubspot", "gmail"],

  schedule: { cron: "0 10 1 * *", timezone: "Europe/Dublin" }, // 1st of month 10:00

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the sales-campaign-launcher workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.

Your job:
1. Use HubSpot to list contacts who:
   - Have a lifecycle stage of "lead" or "marketing qualified lead"
   - Have NOT been contacted (no activity logged) in the last 30 or more days
   - Are not in a "do_not_contact" or "unsubscribed" state
2. For each qualifying contact:
   - Record: contactId, name, email, company, daysSinceContact.
   - Draft a re-engagement email using the tone above.
     - Reference any prior context you can see in HubSpot notes or deal history.
     - Keep it warm and non-pushy — re-open the conversation, don't hard-sell.
     - Sign off: ${tenant.signOff ?? `Many thanks, ${tenant.businessName}`}
   - Use Gmail to CREATE A DRAFT. Do NOT send. Record draftId.
3. Skip any contact who:
   - Is missing an email address (reason: "No email address")
   - Has "do_not_contact" or "unsubscribed" status (reason: "Opted out")
   - Was already targeted in a campaign this month — check HubSpot notes
     (reason: "Already contacted this month")

Return targets[] for contacts with drafts, and skipped[] for those excluded.

Hard rules:
- Never send any email.
- Never modify any HubSpot record.
`.trim(),

  toProposedActions: (output) => {
    const { targets } = output as SalesCampaignLauncherOutput;
    return targets.map((t) => ({
      toolName: "gmail.create_draft",
      args: { draftId: t.draftId, to: t.email, subject: t.subject, body: t.body },
      humanSummary: `Re-engage ${t.name} (${t.company}) — ${t.daysSinceContact} days since contact`,
    }));
  },

  outputSchema,
};
