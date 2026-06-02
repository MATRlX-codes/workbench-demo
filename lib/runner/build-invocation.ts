// lib/runner/build-invocation.ts
//
// Builds the prompt and MCP server map for a given agent + tenant.
// Called by run.ts before passing to the Agent SDK.

import { getConnectorClients } from "@/lib/mcp/registry";
import type { AgentDefinition, TenantContext } from "./types";

type SseMcpServer = {
  type: "sse";
  url: string;
  requestHeaders: Record<string, string>;
};

export type AgentInvocation = {
  prompt: string;
  mcpServers: Record<string, SseMcpServer>;
};

/**
 * Builds the agent invocation payload from the agent definition and the
 * resolved tenant context. Does not call the Agent SDK — that is run.ts's job.
 *
 * @param agent  - The agent definition from lib/agents/
 * @param tenant - The resolved tenant context (id, businessName, country, etc.)
 */
export async function buildInvocation(
  agent: AgentDefinition,
  tenant: TenantContext
): Promise<AgentInvocation> {
  const prompt = agent.promptTemplate({ tenant });
  const mcpServers = await getConnectorClients({
    tenantId: tenant.id,
    connectors: agent.connectors,
  });
  return { prompt, mcpServers };
}
