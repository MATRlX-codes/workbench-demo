// lib/agents/employee-onboarding.ts
//
// Workflow: Employee onboarding
// When a new HubSpot contact is tagged as a new hire, drafts the welcome
// email and checklist tasks for owner approval. Run on demand.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  newHires: z.array(
    z.object({
      contactId: z.string(),
      name: z.string(),
      email: z.string().email(),
      startDate: z.string(), // ISO YYYY-MM-DD
      welcomeEmailDraftId: z.string(),
      welcomeEmailBody: z.string().optional(),
      checklistItems: z.array(z.string()),
    })
  ),
  skipped: z.array(
    z.object({
      contactId: z.string(),
      reason: z.string(),
    })
  ),
});

export type EmployeeOnboardingOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "employee-onboarding",
  displayName: "Employee onboarding",
  category: "hr",
  description:
    "When a new HubSpot contact is tagged as a new hire, drafts the welcome email and checklist tasks.",
  connectors: ["hubspot", "gmail"],

  // Run on demand only — no schedule
  schedule: undefined,

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the employee-onboarding workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.

Your job:
1. Use HubSpot to list contacts tagged with the lifecycle stage "new_hire" or
   a contact property "employee_status" = "onboarding" who do not yet have a
   property "onboarding_welcome_sent" = true.
2. For each new hire:
   a. Draft a warm welcome email:
      - Congratulate them on joining ${tenant.businessName}.
      - Mention their start date (from HubSpot property).
      - Outline the first-day essentials (arrival time, who to ask for, parking/access if relevant).
      - Sign off: ${tenant.signOff ?? `Many thanks, ${tenant.businessName}`}
      Use Gmail to CREATE A DRAFT. Do NOT send. Record welcomeEmailDraftId.
   b. Produce a checklistItems[] of tasks the business should complete before/on
      day one. Include at minimum:
      - "Set up email account"
      - "Add to payroll"
      - "Prepare workstation or equipment"
      - "Schedule introductory meeting with team"
      - "Share employee handbook"
      Include any additional items relevant to ${tenant.country === "IE" ? "Irish employment law (PPSN, P45, etc.)" : "UK employment requirements (NI number, P46, etc.)"}.
3. Skip contacts missing a start date or email address. Add to skipped[] with reason.

Return newHires[] and skipped[].

Hard rules:
- Never send any email.
- Never modify HubSpot contact records.
`.trim(),

  toProposedActions: (output) => {
    const { newHires } = output as EmployeeOnboardingOutput;
    return newHires.map((hire) => ({
      toolName: "employee.onboarding",
      args: {
        to: hire.email,
        subject: `Welcome to the team — starting ${hire.startDate}`,
        body: hire.welcomeEmailBody ?? `Dear ${hire.name},\n\nWelcome to the team! We look forward to having you start on ${hire.startDate}.\n\nKind regards`,
        name: hire.name,
        startDate: hire.startDate,
        checklist: hire.checklistItems,
      },
      humanSummary: `Onboard ${hire.name} — welcome email + ${hire.checklistItems.length}-item checklist`,
    }));
  },

  outputSchema,
};
