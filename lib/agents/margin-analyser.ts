// lib/agents/margin-analyser.ts
//
// Workflow: Margin analysis
// Pulls last 90 days of QuickBooks P&L data and identifies the top 5 best
// and worst margin product/service lines for quarterly review.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const marginLineSchema = z.object({
  name: z.string(),
  revenue: z.number(),
  cost: z.number(),
  marginPct: z.number(),
});

const outputSchema = z.object({
  topMarginLines: z.array(marginLineSchema),
  bottomMarginLines: z.array(marginLineSchema),
  period: z.object({
    startDate: z.string(), // ISO YYYY-MM-DD
    endDate: z.string(),
  }),
  observations: z.array(z.string()),
});

export type MarginAnalyserOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "margin-analyser",
  displayName: "Margin analysis",
  category: "finance",
  description:
    "Pulls the last 90 days of QuickBooks P&L data and identifies the top 5 best and worst margin product/service lines.",
  connectors: ["quickbooks"],

  schedule: { cron: "0 9 1 */3 *", timezone: "Europe/Dublin" }, // quarterly

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the margin-analyser workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.

Your job:
1. Use QuickBooks to fetch the Profit & Loss report for the last 90 calendar days.
   Record the period startDate and endDate in ISO 8601.
2. For each product or service line in the P&L:
   - revenue = total income for that line
   - cost = total cost of goods sold (COGS) for that line (0 if not present)
   - marginPct = ((revenue - cost) / revenue) * 100, rounded to 1 decimal place
   - Skip any line with revenue = 0.
3. Sort by marginPct descending. Return the top 5 as topMarginLines and the
   bottom 5 (lowest margin, including negative) as bottomMarginLines.
4. Write 2–4 plain-English observations about the data — e.g. which line has
   improved most vs last quarter, any line with negative margin, etc.

Hard rules:
- Never modify any QuickBooks record.
- Never send any communication.
- All monetary values in ${tenant.currency}.
`.trim(),

  toProposedActions: (output) => {
    const { period } = output as MarginAnalyserOutput;
    return [
      {
        toolName: "margin-analyser",
        args: output,
        humanSummary: `Review margin analysis — ${period.startDate} to ${period.endDate}`,
      },
    ];
  },

  outputSchema,
};
