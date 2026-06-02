// lib/agents/invoice-chase.ts
//
// Workflow: Invoice chase
// Reads aged-receivables from QuickBooks, drafts polite reminder emails per
// customer, queues them for owner approval. Does not send.
//
// This is the canonical agent file. Copy it to build every new workflow —
// keep the four-field shape (name/description/connectors/promptTemplate)
// and the zod outputSchema.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

export const agent: AgentDefinition = {
  name: "invoice-chase",
  displayName: "Invoice chase",
  category: "finance",
  description:
    "Reads QuickBooks aged-receivables, drafts polite reminders, queues them for owner approval.",
  connectors: ["quickbooks", "gmail"],

  // Default schedule. Owner can override per-tenant.
  schedule: { cron: "0 9 * * 2,5", timezone: "Europe/Dublin" }, // Tue + Fri 09:00

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the invoice-chase workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.
Currency: ${tenant.currency}.
Sign-off line: ${tenant.signOff ?? `Many thanks, ${tenant.businessName}`}

Steps:
1. Use the QuickBooks tool to list customer invoices that are MORE than 7 days
   past their due date and not yet paid.
2. For each customer, look at the invoice history to determine whether this
   is their first, second or third reminder. If the customer's record has
   notes indicating a dispute, payment plan or hold, SKIP them and record
   the reason in "skipped".
3. Group remaining invoices by customer (one email per customer, even if
   they have multiple overdue invoices — list them in the body).
4. Draft each reminder email using the tone above:
   - Mention each invoice number, amount, and original due date.
   - Be polite. Offer to resend a copy if needed.
   - Sign off with the sign-off line.
   - Subject line: "Friendly reminder — invoice #<number>" for first reminders,
     "Reminder — invoice #<number> ${tenant.country === "IE" ? "is" : ""} overdue"
     for second, escalating tone (still polite) for third.
5. Use the Gmail tool to CREATE DRAFTS for each email. DO NOT send.

Return a structured plan containing:
- drafts[]: one entry per email you have prepared as a Gmail draft.
- skipped[]: any customers you intentionally did not chase, with reason.

Hard rules:
- Never send.
- Never modify invoices in QuickBooks.
- Never email a customer whose status is "do_not_contact".
- If a customer's email address is missing, skip and flag.
- ${tenant.country === "IE" ? "Treat VAT-registered customers identically — do not assume the chase is a credit-control issue." : ""}
`.trim(),

  toProposedActions: (output) => {
    const { drafts } = output as InvoiceChaseOutput;
    return drafts.map((draft: InvoiceChaseOutput["drafts"][number]) => {
      const totalAmount = draft.invoices
        .reduce((sum: number, inv: { amount: number }) => sum + inv.amount, 0)
        .toFixed(2);
      const invoiceList = draft.invoices
        .map((inv: { invoiceNumber: string }) => `#${inv.invoiceNumber}`)
        .join(", ");
      return {
        toolName: "gmail.create_draft",
        args: {
          to: draft.customerEmail,
          subject: draft.subject,
          body: draft.body,
        },
        humanSummary: `Email ${draft.customerName} — reminder ${draft.reminderNumber} for ${invoiceList} (${draft.invoices[0]?.currency ?? ""} ${totalAmount})`,
      };
    });
  },

  outputSchema: z.object({
    drafts: z.array(
      z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        invoices: z.array(
          z.object({
            invoiceNumber: z.string(),
            amount: z.number(),
            currency: z.string(),
            originalDueDate: z.string(), // ISO
            daysOverdue: z.number().int(),
          })
        ),
        reminderNumber: z.number().int().min(1).max(5),
        subject: z.string().max(120),
        body: z.string(),
        gmailDraftId: z.string(), // returned by the Gmail MCP draft action
      })
    ),
    skipped: z.array(
      z.object({
        customerName: z.string(),
        reason: z.string(),
      })
    ),
    summary: z.object({
      totalOverdueAmount: z.number(),
      totalCustomersChecked: z.number().int(),
      draftsPrepared: z.number().int(),
    }),
  }),
};

export type InvoiceChaseOutput = z.infer<typeof agent.outputSchema>;
