// lib/runner/types.ts
//
// Shared types for the workflow runner. Keep this file small — anything
// agent-specific lives in the agent file itself.

import type { z } from "zod";

export type ConnectorName =
  | "quickbooks"
  | "gmail"
  | "google_calendar"
  | "google_drive"
  | "microsoft_365"
  | "hubspot"
  | "stripe"
  | "paypal"
  | "square"
  | "canva"
  | "docusign"
  | "slack"
  | "webflow"
  | "revenue_ros";

export type WorkflowCategory =
  | "finance"
  | "ops"
  | "operations"
  | "sales"
  | "marketing"
  | "people"
  | "compliance"
  | "crm"
  | "hr"
  | "legal";

export type TenantContext = {
  id: string;
  businessName: string;
  country: "IE" | "GB-NIR";
  currency: "EUR" | "GBP";
  toneOfVoice?: string;
  signOff?: string;
  vatRates: number[];
};

export type AgentDefinition = {
  name: string;
  displayName: string;
  category: WorkflowCategory;
  description: string;
  connectors: ConnectorName[];
  promptTemplate: (ctx: { tenant: TenantContext }) => string;
  outputSchema: z.ZodTypeAny;
  schedule?: { cron: string; timezone: string };
  /**
   * Maps validated agent output to the list of proposed tool calls shown in
   * the approval queue. One ProposedToolCall → one pendingApprovals row.
   *
   * If omitted, the runner creates a single "review output" action for the
   * entire run, which is appropriate for read-only / reporting workflows.
   */
  toProposedActions?: (output: unknown) => ProposedToolCall[];
};

export type ProposedToolCall = {
  toolName: string;
  args: unknown;
  humanSummary: string; // shown in the approval card
};

export type WorkflowPlan = {
  workflowName: string;
  proposedActions: ProposedToolCall[];
  agentOutput: unknown; // matched against agent.outputSchema before persistence
};
