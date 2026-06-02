import { runWorkflowAction } from "@/app/actions/run-workflow";
import type { AgentDefinition } from "@/lib/runner/types";

type Props = {
  agent: AgentDefinition;
  enabled: boolean;
  schedule?: string;
};

export function WorkflowCard({ agent, enabled, schedule }: Props) {
  return (
    <div className="bg-surface-card border border-hairline-light rounded-[20px] p-8 flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-surface-soft text-ink rounded-full px-3 py-1 text-xs font-semibold">
            {agent.category}
          </span>
          {!enabled && (
            <span className="text-xs text-stone">disabled</span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-ink leading-snug">
          {agent.displayName}
        </h3>
      </div>

      <p className="text-sm text-mute leading-relaxed flex-1">
        {agent.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {agent.connectors.map((c) => (
          <span
            key={c}
            className="bg-surface-soft text-stone text-xs rounded-full px-2.5 py-1"
          >
            {c}
          </span>
        ))}
      </div>

      {schedule && (
        <p className="text-xs text-stone">
          Scheduled: <code className="font-mono">{schedule}</code>
        </p>
      )}

      <form action={runWorkflowAction.bind(null, agent.name)}>
        <button
          type="submit"
          disabled={!enabled}
          className="w-full bg-canvas-dark text-on-dark rounded-full h-12 font-semibold text-sm hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          Run now
        </button>
      </form>
    </div>
  );
}
