// lib/agents/customer-pulse.ts
//
// Workflow: Customer pulse
// Reviews HubSpot deal and contact activity over the last 14 days, flags
// at-risk accounts, and drafts check-in emails for owner approval.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  atRiskAccounts: z.array(
    z.object({
      contactId: z.string(),
      name: z.string(),
      company: z.string(),
      lastActivity: z.string(), // ISO date
      riskReason: z.string(),
      draftId: z.string(),
    })
  ),
  healthyAccounts: z.object({ count: z.number().int() }),
  summary: z.string(),
});

export type CustomerPulseOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "customer-pulse",
  displayName: "Customer pulse",
  category: "crm",
  description:
    "Reviews HubSpot deal and contact activity over the last 14 days, flags at-risk accounts, and drafts check-in emails.",
  connectors: ["hubspot", "gmail"],

  schedule: { cron: "0 9 * * 5", timezone: "Europe/Dublin" }, // Friday 09:00

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the customer-pulse workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.

Your job:
1. Use HubSpot to fetch all contacts and deals with activity in the last 90 days.
2. For each active account (contact with an open or recently closed deal), check:
   - Last activity date: if > 14 days ago with no touch from the business, mark at-risk.
   - Deal stage: if a deal has been stuck in the same stage for > 14 days, mark at-risk.
   - Any notes indicating dissatisfaction, complaint, or pending issue — mark at-risk.
3. For each at-risk account:
   - Record: contactId, name, company, lastActivity (ISO date), riskReason.
   - Draft a brief, warm check-in email using the tone above.
     - Reference the business relationship — don't make it feel generic.
     - Keep it under 100 words.
     - Sign off: ${tenant.signOff ?? `Many thanks, ${tenant.businessName}`}
   - Use Gmail to CREATE A DRAFT. Do NOT send. Record draftId.
4. Count accounts reviewed that are NOT at-risk as healthyAccounts.count.
5. Write a one-paragraph summary of the overall customer health picture.

Hard rules:
- Never send any email.
- Never modify any HubSpot record.
`.trim(),

  toProposedActions: (output) => {
    const { atRiskAccounts } = output as CustomerPulseOutput;
    const count = atRiskAccounts.length;
    return [{
      toolName: "customer-pulse",
      args: output as Record<string, unknown>,
      humanSummary: `Review customer pulse — ${count} at-risk account${count !== 1 ? "s" : ""} identified`,
    }];
  },

  outputSchema,
};
