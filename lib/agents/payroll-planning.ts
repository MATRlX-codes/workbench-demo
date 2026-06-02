// lib/agents/payroll-planning.ts
//
// Workflow: Payroll planning
// Reads the upcoming payroll schedule and current QuickBooks bank balance,
// checks whether funds are sufficient, and drafts an alert if not.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  payrollDate: z.string(), // ISO YYYY-MM-DD
  estimatedPayroll: z.number(),
  currentBalance: z.number(),
  sufficient: z.boolean(),
  shortfall: z.number().nullable(),
  alertDraftId: z.string().nullable(),
});

export type PayrollPlanningOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "payroll-planning",
  displayName: "Payroll planning",
  category: "hr",
  description:
    "Reads the upcoming payroll schedule and current QuickBooks bank balance, checks whether funds are sufficient, and drafts an alert if not.",
  connectors: ["quickbooks"],

  schedule: { cron: "0 9 20 * *", timezone: "Europe/Dublin" }, // 20th of each month 09:00

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the payroll-planning workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.

Your job:
1. Use QuickBooks to read the payroll schedule and determine the next payroll date
   and estimated payroll total (gross payroll amount).
2. Use QuickBooks to read the current bank account balance.
3. Check: is currentBalance >= estimatedPayroll?
   - If yes: sufficient = true, shortfall = null, alertDraftId = null.
   - If no: sufficient = false, shortfall = estimatedPayroll - currentBalance.
     Draft a brief internal alert (not a Gmail draft — return it as a text string
     in the alertDraftId field noting "INTERNAL_ALERT: <message>").
4. Return payrollDate (ISO), estimatedPayroll, currentBalance, sufficient,
   shortfall (null if sufficient), alertDraftId (null if sufficient).

Hard rules:
- Never modify any QuickBooks record.
- Never run or approve payroll — only read and report.
`.trim(),

  toProposedActions: (output) => {
    const { sufficient, shortfall } = output as PayrollPlanningOutput;
    if (!sufficient && shortfall !== null) {
      return [
        {
          toolName: "payroll-planning",
          args: output,
          humanSummary: `Alert: payroll shortfall of €${shortfall.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} — review funding`,
        },
      ];
    }
    return [
      {
        toolName: "payroll-planning",
        args: output,
        humanSummary: "Review payroll readiness check — sufficient funds confirmed",
      },
    ];
  },

  outputSchema,
};
