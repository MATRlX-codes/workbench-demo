// lib/agents/content-strategist.ts
//
// Workflow: Content ideas
// Reads recent HubSpot deal notes and customer feedback, then drafts 5
// content ideas tailored to the business. Run on demand or monthly.

import { z } from "zod";
import type { AgentDefinition, TenantContext } from "@/lib/runner/types";

const outputSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      format: z.enum(["blog", "email", "social"]),
      rationale: z.string(),
      keyPoints: z.array(z.string()),
    })
  ),
});

export type ContentStrategistOutput = z.infer<typeof outputSchema>;

export const agent: AgentDefinition = {
  name: "content-strategist",
  displayName: "Content ideas",
  category: "marketing",
  description:
    "Reads recent HubSpot deal notes and customer feedback, then drafts 5 content ideas tailored to the business.",
  connectors: ["hubspot"],

  schedule: { cron: "0 10 1 * *", timezone: "Europe/Dublin" }, // monthly

  promptTemplate: ({ tenant }: { tenant: TenantContext }) => `
You are running the content-strategist workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.

Your job:
1. Use HubSpot to fetch recent (last 30 days) deal notes, contact notes, and
   any form submissions or feedback logged against contacts.
2. Identify themes: what questions are customers asking? What objections come up?
   What topics come up repeatedly in sales conversations?
3. Propose exactly 5 content ideas. For each idea:
   - title: a compelling, specific working title (sentence case)
   - format: "blog", "email", or "social" — choose the best fit for the topic
   - rationale: 1–2 sentences explaining why this topic will resonate with
     ${tenant.businessName}'s customers based on the HubSpot data
   - keyPoints: 3–5 bullet points for the content creator to cover

Return ideas[] with exactly 5 entries.

Hard rules:
- Never modify any HubSpot record.
- Never send any communication.
- Tailor ideas specifically to ${tenant.businessName}'s market and
  ${tenant.country === "IE" ? "Irish" : "Northern Irish"} audience. Avoid generic advice.
`.trim(),

  toProposedActions: (output) => {
    const { ideas } = output as ContentStrategistOutput;
    return [
      {
        toolName: "content-strategist",
        args: output,
        humanSummary: `Review ${String(ideas.length)} content ideas`,
      },
    ];
  },

  outputSchema,
};
