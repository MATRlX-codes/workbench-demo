// lib/agents/contract-reviewer.ts
//
// Workflow: Contract review
// Reads PDF attachments from recent Gmail threads tagged 'contract-review',
// summarises key terms and flags unusual clauses. Run on demand.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  contracts: z.array(
    z.object({
      subject: z.string(),
      sender: z.string(),
      keyTerms: z.array(z.string()),
      unusualClauses: z.array(z.string()),
      recommendation: z.enum(["approve", "negotiate", "reject"]),
    })
  ),
  skipped: z.array(
    z.object({
      subject: z.string(),
      reason: z.string(),
    })
  ),
});

export type ContractReviewerOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "contract-reviewer",
  displayName: "Contract review",
  category: "legal",
  description:
    "Reads PDF attachments from recent Gmail threads tagged 'contract-review', summarises key terms and flags unusual clauses.",
  connectors: ["gmail"],

  // Run on demand — no schedule
  schedule: undefined,

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the contract-reviewer workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.

Your job:
1. Use Gmail to search for email threads with the label "contract-review" or
   threads containing an attachment with "contract" in the filename, received
   in the last 30 days and not yet reviewed (no "reviewed" label).
2. For each thread with a PDF attachment:
   a. Read the PDF content.
   b. Extract keyTerms[] — the most important contractual terms:
      - Parties involved
      - Contract duration / term
      - Payment terms and amounts
      - Termination clauses
      - Key obligations on ${tenant.businessName}
      - Liability caps or exclusions
      - Governing law (flag if not ${tenant.country === "IE" ? "Irish law" : "Northern Irish / English law"})
   c. Flag unusualClauses[] — any clause that is unusual, one-sided, or carries
      elevated risk for ${tenant.businessName}. Be specific and concise.
   d. Provide a recommendation:
      - "approve": standard terms, no significant concerns
      - "negotiate": worth reviewing with the other party or a solicitor before signing
      - "reject": contains terms that are clearly unacceptable or highly risky
3. Skip attachments that are not readable PDFs (reason: "Not a readable PDF").
   Skip threads with no PDF attachment (reason: "No PDF attachment found").

Return contracts[] and skipped[].

Hard rules:
- Never modify, archive, or send any email.
- Never sign or accept any contract.
- This is a first-pass review only — always recommend seeking legal advice
  for contracts above ${tenant.currency === "EUR" ? "€5,000" : "£5,000"} or with unusual terms.
`.trim(),

  toProposedActions: (output) => {
    const { contracts } = output as ContractReviewerOutput;
    return contracts.map((c) => ({
      toolName: "contract-reviewer",
      args: c,
      humanSummary: `Review contract from ${c.sender} — ${c.recommendation}`,
    }));
  },

  outputSchema,
};
