// lib/agents/tax-season-organiser.ts
//
// Workflow: Tax season organiser
// Gathers VAT-relevant transactions from QuickBooks for the bi-annual Irish
// VAT period and drafts a summary email for the accountant.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  vatPeriod: z.object({
    startDate: z.string(), // ISO YYYY-MM-DD
    endDate: z.string(),
  }),
  salesVat: z.object({
    totalSales: z.number(),
    vatCollected: z.number(),
  }),
  purchasesVat: z.object({
    totalPurchases: z.number(),
    vatReclaimable: z.number(),
  }),
  netVatDue: z.number(),
  draftEmailId: z.string(),
});

export type TaxSeasonOrganiserOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "tax-season-organiser",
  displayName: "Tax season organiser",
  category: "finance",
  description:
    "Gathers VAT-relevant transactions from QuickBooks and drafts a summary for the accountant.",
  connectors: ["quickbooks", "gmail"],

  // Apr 1st + Oct 1st — Irish VAT bi-annual filing
  schedule: { cron: "0 9 1 4,10 *", timezone: "Europe/Dublin" },

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the tax-season-organiser workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.
VAT rates in use: ${tenant.vatRates.join("%, ")}%.

${tenant.country === "IE" ? "This business files VAT bi-annually with Revenue. The two periods are Jan–Jun (return due late July) and Jul–Dec (return due late January)." : "This business may be subject to UK/NI VAT rules — use the relevant period."}

Your job:
1. Determine the most recent completed VAT period (Jan–Jun or Jul–Dec).
   Record startDate and endDate in ISO 8601.
2. Use QuickBooks to fetch all sales transactions in that period.
   Calculate: totalSales (gross), vatCollected (VAT portion).
3. Use QuickBooks to fetch all purchase/expense transactions in that period.
   Calculate: totalPurchases (gross), vatReclaimable (VAT reclaimable portion).
4. Calculate: netVatDue = vatCollected - vatReclaimable.
5. Use Gmail to CREATE A DRAFT email to the accountant (use the sign-off:
   ${tenant.signOff ?? `Many thanks, ${tenant.businessName}`}) summarising:
   - VAT period dates
   - totalSales and vatCollected
   - totalPurchases and vatReclaimable
   - netVatDue
   - A note asking the accountant to review and confirm before filing.
   Do NOT send the email.
6. Return the draftEmailId from Gmail.

Hard rules:
- Never modify any QuickBooks record.
- Never send the email — only create a draft.
- All monetary values in ${tenant.currency}.
`.trim(),

  toProposedActions: (output) => {
    const { vatPeriod, salesVat, purchasesVat, netVatDue } = output as TaxSeasonOrganiserOutput;
    const fmt = (n: number) => n.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const body = [
      "Dear [Accountant],",
      "",
      `Please find below the VAT summary for the period ${vatPeriod.startDate} to ${vatPeriod.endDate}.`,
      "",
      "Sales",
      `Total sales: €${fmt(salesVat.totalSales)}`,
      `VAT collected: €${fmt(salesVat.vatCollected)}`,
      "",
      "Purchases",
      `Total purchases: €${fmt(purchasesVat.totalPurchases)}`,
      `VAT reclaimable: €${fmt(purchasesVat.vatReclaimable)}`,
      "",
      `Net VAT due: €${fmt(netVatDue)}`,
      "",
      "Please confirm receipt and advise if any adjustments are needed.",
      "",
      "Kind regards,",
      "O'Brien's Hardware",
    ].join("\n");
    return [{
      toolName: "gmail.create_draft",
      args: {
        to: "your-accountant@example.ie",
        subject: `VAT3 return — ${vatPeriod.startDate} to ${vatPeriod.endDate}`,
        body,
      },
      humanSummary: `Send VAT summary to accountant — net VAT due €${fmt(netVatDue)}`,
    }];
  },

  outputSchema,
};
