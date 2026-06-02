// lib/agents/monthly-close.ts
//
// Workflow: Monthly close
// Reconciles QuickBooks + Stripe + PayPal transactions for the prior calendar
// month, flags mismatches, and drafts a summary report for owner review.

import { z } from "zod";
import type { AgentDefinition, ProposedToolCall, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  reconciliationItems: z.array(
    z.object({
      source: z.enum(["quickbooks", "stripe", "paypal"]),
      matched: z.number().int(),
      unmatched: z.number().int(),
    })
  ),
  mismatches: z.array(
    z.object({
      id: z.string(),
      source: z.enum(["quickbooks", "stripe", "paypal"]),
      amount: z.number(),
      note: z.string(),
    })
  ),
  summary: z.object({
    totalMatched: z.number().int(),
    totalUnmatched: z.number().int(),
    netDifference: z.number(),
    period: z.object({ startDate: z.string(), endDate: z.string() }),
  }),
});

export type MonthlyCloseOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "monthly-close",
  displayName: "Monthly close",
  category: "finance",
  description:
    "Reconciles QuickBooks + Stripe + PayPal transactions for the month, flags mismatches, and drafts a summary report.",
  connectors: ["quickbooks", "stripe", "paypal"],

  schedule: { cron: "0 9 1 * *", timezone: "Europe/Dublin" }, // 1st of each month 09:00

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the monthly-close workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.

Your job is to reconcile the previous calendar month:

1. Use QuickBooks to list all income entries for the prior calendar month.
2. Use Stripe to list all payout and transaction records for the same period.
3. Use PayPal to list all settled transaction records for the same period.
4. Match Stripe and PayPal records to QuickBooks income entries by:
   - Date within ±2 days, AND
   - Amount within 0.01 (to allow for rounding).
5. Produce a reconciliation summary:
   - For each source (quickbooks, stripe, paypal): count of matched and unmatched records.
   - For each unmatched record: ID, source, amount, and a brief note explaining why it could not be matched.
   - Overall summary: totalMatched, totalUnmatched, netDifference (sum of unmatched amounts).

Hard rules:
- Never modify any record in QuickBooks, Stripe or PayPal.
- Never send any email.
- If a source returns an error, record it as a mismatch with note "Source unavailable: <error>".
- Report the period startDate and endDate in ISO 8601 (YYYY-MM-DD).
`.trim(),

  toProposedActions: (output) => {
    const { summary } = output as MonthlyCloseOutput;
    return [
      {
        toolName: "monthly-close",
        args: output as Record<string, unknown>,
        humanSummary: `Review monthly close — ${summary.totalMatched} matched, ${summary.totalUnmatched} unmatched, net difference ${String(summary.netDifference.toFixed(2))}`,
      },
    ];
  },

  outputSchema,
};
