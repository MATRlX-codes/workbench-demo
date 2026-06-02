// lib/agents/month-end-prepper.ts
//
// Workflow: Month-end prep
// Three days before month end: checks for unreconciled transactions, missing
// receipts, and unpaid bills in QuickBooks and drafts a prep checklist.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  unreconciledCount: z.number().int(),
  missingReceiptsCount: z.number().int(),
  unpaidBillsTotal: z.number(),
  checklistDraftId: z.string(),
  items: z.array(
    z.object({
      category: z.string(),
      count: z.number().int(),
      urgency: z.enum(["high", "medium", "low"]),
    })
  ),
});

export type MonthEndPrepperOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "month-end-prepper",
  displayName: "Month-end prep",
  category: "finance",
  description:
    "Three days before month end: checks for unreconciled transactions, missing receipts, and unpaid bills in QuickBooks and sends a prep checklist.",
  connectors: ["quickbooks", "gmail"],

  schedule: { cron: "0 9 28 * *", timezone: "Europe/Dublin" }, // 28th of each month

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the month-end-prepper workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.

Your job:
1. Use QuickBooks to count unreconciled bank transactions for the current month.
2. Use QuickBooks to count expense transactions that are missing receipt attachments
   (look for expenses with no attached document).
3. Use QuickBooks to total all unpaid bills (accounts payable) that are due before
   or during the current month-end.
4. Build an items[] list with category, count, and urgency:
   - "Unreconciled transactions": unreconciledCount, urgency "high" if > 10, "medium" if > 0, "low" if 0
   - "Missing receipts": missingReceiptsCount, urgency "high" if > 5, "medium" if > 0, "low" if 0
   - "Unpaid bills": count of unpaid bill items, urgency "high" if total > ${tenant.currency === "EUR" ? "5000" : "5000"}, else "medium"
5. Draft a prep checklist email:
   - To: the business owner (internal — just describe it as "owner")
   - Subject: "Month-end prep checklist — <current month name>"
   - Body: a friendly summary listing the items above with action steps.
   - Sign off: ${tenant.signOff ?? `Many thanks, the & Again Workbench`}
   Use Gmail to CREATE A DRAFT. Do NOT send. Record checklistDraftId.

Return unreconciledCount, missingReceiptsCount, unpaidBillsTotal, checklistDraftId, items[].

Hard rules:
- Never modify any QuickBooks record.
- Never send any email — only create a draft.
`.trim(),

  toProposedActions: (output) => {
    const { unreconciledCount, missingReceiptsCount, unpaidBillsTotal, items } = output as MonthEndPrepperOutput;
    const fmt = (n: number) => n.toLocaleString("en-IE", { minimumFractionDigits: 2 });
    const itemLines = items.map((item) => {
      const eurNote = item.category.toLowerCase().includes("bill") ? ` — €${fmt(unpaidBillsTotal)} outstanding` : "";
      return `• ${item.category}: ${item.count} item${item.count !== 1 ? "s" : ""}${eurNote} (${item.urgency} priority)`;
    }).join("\n");
    const body = [
      "Hi team,",
      "",
      "Here is the month-end prep checklist. Please action all high-priority items before month end.",
      "",
      itemLines,
      "",
      "Many thanks,",
      "O'Brien's Hardware",
    ].join("\n");
    return [
      {
        toolName: "month-end.checklist",
        args: {
          to: "team@obriens.ie",
          subject: "Month-end prep checklist",
          body,
          unreconciledCount,
          missingReceiptsCount,
          unpaidBillsTotal,
          items,
        },
        humanSummary: `Send month-end checklist — ${String(unreconciledCount)} unreconciled, ${String(missingReceiptsCount)} missing receipts, €${fmt(unpaidBillsTotal)} in unpaid bills`,
      },
    ];
  },

  outputSchema,
};
