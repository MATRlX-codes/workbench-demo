"use client";

import { useState, useTransition } from "react";
import { saveScheduleAction } from "@/app/actions/schedules";
import { parseCron, formatSchedule, ALL_DAYS } from "@/lib/utils/cron";

type Props = {
  workflowName: string;
  displayName: string;
  cron: string;
  timezone: string;
  enabled: boolean;
};

export function ScheduleEditor({ workflowName, displayName, cron, timezone, enabled }: Props) {
  const parsed = parseCron(cron);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await saveScheduleAction(workflowName, formData);
      setOpen(false);
    });
  }

  return (
    <div className="bg-surface-card border border-hairline-light rounded-[20px] p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{displayName}</p>
          <p className="text-xs text-stone mt-0.5">{formatSchedule(parsed)} · {timezone}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              enabled ? "bg-surface-elevated text-on-dark" : "bg-surface-soft text-stone"
            }`}
          >
            {enabled ? "Active" : "Inactive"}
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-xs font-semibold text-ink bg-surface-soft hover:bg-hairline-light transition-colors rounded-full px-3 py-1.5"
          >
            {open ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {open && (
        <form action={handleSubmit} className="mt-5 pt-5 border-t border-hairline-light space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone uppercase tracking-wider" htmlFor={`time-${workflowName}`}>
              Time
            </label>
            <input
              id={`time-${workflowName}`}
              name="time"
              type="time"
              defaultValue={parsed.time}
              required
              className="w-40 rounded-[12px] border border-hairline-light bg-canvas-light px-3 h-10 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-hairline-strong"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-stone uppercase tracking-wider">Days</p>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => (
                <label key={day.value} className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="days"
                    value={day.value}
                    defaultChecked={parsed.days.length === 0 || parsed.days.includes(day.value)}
                    className="sr-only peer"
                  />
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border border-hairline-light bg-surface-soft text-stone peer-checked:bg-canvas-dark peer-checked:text-on-dark peer-checked:border-canvas-dark transition-colors select-none">
                    {day.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-stone">Leave all unchecked to run every day.</p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-canvas-dark text-on-dark rounded-full h-10 px-6 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save schedule"}
          </button>
        </form>
      )}
    </div>
  );
}
