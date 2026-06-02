// lib/agents/index.ts
//
// Registry of every workflow agent in the system. When you add a new agent
// file, add it to this registry — the workflows dashboard, runner and
// scheduler all key off this map.

import type { AgentDefinition } from "@/lib/runner/types";

import { agent as invoiceChase } from "./invoice-chase";
import { agent as monthlyClose } from "./monthly-close";
import { agent as cashFlowSurfacing } from "./cash-flow-surfacing";
import { agent as marginAnalyser } from "./margin-analyser";
import { agent as taxSeasonOrganiser } from "./tax-season-organiser";
import { agent as monthEndPrepper } from "./month-end-prepper";
import { agent as leadTriager } from "./lead-triager";
import { agent as customerPulse } from "./customer-pulse";
import { agent as salesCampaignLauncher } from "./sales-campaign-launcher";
import { agent as contentStrategist } from "./content-strategist";
import { agent as campaignAttribution } from "./campaign-attribution";
import { agent as payrollPlanning } from "./payroll-planning";
import { agent as employeeOnboarding } from "./employee-onboarding";
import { agent as contractReviewer } from "./contract-reviewer";
import { agent as scheduling } from "./scheduling";

export const AGENTS: Record<string, AgentDefinition> = {
  [invoiceChase.name]: invoiceChase,
  [monthlyClose.name]: monthlyClose,
  [cashFlowSurfacing.name]: cashFlowSurfacing,
  [marginAnalyser.name]: marginAnalyser,
  [taxSeasonOrganiser.name]: taxSeasonOrganiser,
  [monthEndPrepper.name]: monthEndPrepper,
  [leadTriager.name]: leadTriager,
  [customerPulse.name]: customerPulse,
  [salesCampaignLauncher.name]: salesCampaignLauncher,
  [contentStrategist.name]: contentStrategist,
  [campaignAttribution.name]: campaignAttribution,
  [payrollPlanning.name]: payrollPlanning,
  [employeeOnboarding.name]: employeeOnboarding,
  [contractReviewer.name]: contractReviewer,
  [scheduling.name]: scheduling,
};

export function getAgent(name: string): AgentDefinition {
  const agent = AGENTS[name];
  if (!agent) throw new Error(`Unknown workflow: ${name}`);
  return agent;
}

export function listAgents(): AgentDefinition[] {
  return Object.values(AGENTS);
}
