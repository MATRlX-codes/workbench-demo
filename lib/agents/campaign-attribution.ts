// lib/agents/campaign-attribution.ts
//
// Workflow: Campaign attribution
// Matches HubSpot deal sources to Stripe revenue, showing which campaigns
// drove the most closed revenue this month.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  attributionRows: z.array(
    z.object({
      campaignName: z.string(),
      dealsCount: z.number().int(),
      totalRevenue: z.number(),
      avgDealSize: z.number(),
    })
  ),
  unattributed: z.object({
    totalRevenue: z.number(),
    dealsCount: z.number().int(),
  }),
  period: z.object({
    startDate: z.string(), // ISO YYYY-MM-DD
    endDate: z.string(),
  }),
});

export type CampaignAttributionOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "campaign-attribution",
  displayName: "Campaign attribution",
  category: "marketing",
  description:
    "Matches HubSpot deal sources to Stripe revenue, showing which campaigns drove the most closed revenue this month.",
  connectors: ["hubspot", "stripe"],

  schedule: { cron: "0 9 1 * *", timezone: "Europe/Dublin" }, // 1st of each month

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the campaign-attribution workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.

Your job:
1. Determine the prior calendar month period (startDate, endDate in ISO 8601).
2. Use HubSpot to list all deals closed-won in that period.
   For each deal, read the "original source" and any UTM campaign data.
3. Use Stripe to list all payments received in that period.
4. Match HubSpot deals to Stripe payments by:
   - Amount (within 1% tolerance)
   - Date (within ±3 days)
   If a deal cannot be matched to a Stripe payment, still include it — use the
   HubSpot deal value.
5. Group matched and unmatched deals by campaign name (or "Organic / Direct" if
   no campaign is set). For each group calculate:
   - dealsCount, totalRevenue, avgDealSize
6. Deals with no campaign attribution go into unattributed{}.

Return attributionRows[] sorted by totalRevenue descending, plus unattributed and period.

Hard rules:
- Never modify any HubSpot or Stripe record.
- Never send any communication.
- All monetary values in ${tenant.currency}.
`.trim(),

  toProposedActions: (output) => {
    const { period } = output as CampaignAttributionOutput;
    return [
      {
        toolName: "campaign-attribution",
        args: output,
        humanSummary: `Review campaign attribution — ${period.startDate} to ${period.endDate}`,
      },
    ];
  },

  outputSchema,
};
