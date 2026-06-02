// lib/agents/cash-flow-surfacing.ts
//
// Workflow: Cash flow briefing
// Reads QuickBooks bank balances and upcoming invoices/bills, produces a
// 30-day cash flow summary for owner review. Monday morning briefing.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  currentBalance: z.number(),
  upcomingInflows: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
      dueDate: z.string(), // ISO YYYY-MM-DD
    })
  ),
  upcomingOutflows: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
      dueDate: z.string(), // ISO YYYY-MM-DD
    })
  ),
  projectedBalance30Days: z.number(),
  warnings: z.array(z.string()),
});

export type CashFlowSurfacingOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "cash-flow-surfacing",
  displayName: "Cash flow briefing",
  category: "finance",
  description:
    "Reads QuickBooks bank balances and upcoming invoices/bills, produces a 30-day cash flow summary for owner review.",
  connectors: ["quickbooks"],

  schedule: { cron: "0 8 * * 1", timezone: "Europe/Dublin" }, // Monday 08:00

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the cash-flow-surfacing workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.

Your job:
1. Use QuickBooks to read the current bank account balance(s) for this business.
2. Use QuickBooks to list all outstanding sales invoices due within the next 30 days.
   These are upcoming inflows.
3. Use QuickBooks to list all outstanding bills (accounts payable) due within the
   next 30 days. These are upcoming outflows.
4. Compute projectedBalance30Days = currentBalance + sum(inflows) - sum(outflows).
5. Add a warning for each of:
   - projectedBalance30Days < 0 ("Projected balance goes negative on or before <date>")
   - Any single outflow > 20% of current balance
   - Any invoice more than 14 days overdue that is still listed as outstanding

Return currentBalance, upcomingInflows[], upcomingOutflows[], projectedBalance30Days,
and warnings[].

Hard rules:
- Never modify any QuickBooks record.
- Never send any communication.
- All monetary values in ${tenant.currency}.
- All dates in ISO 8601 (YYYY-MM-DD).
`.trim(),

  toProposedActions: (output) => {
    const { projectedBalance30Days } = output as CashFlowSurfacingOutput;
    return [
      {
        toolName: "cash-flow-surfacing",
        args: output,
        humanSummary: `Review 30-day cash flow briefing — projected balance ${projectedBalance30Days < 0 ? "⚠ " : ""}${String(projectedBalance30Days.toFixed(2))}`,
      },
    ];
  },

  outputSchema,
};
