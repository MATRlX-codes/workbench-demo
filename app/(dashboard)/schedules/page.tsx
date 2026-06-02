"use client";

import { useState } from "react";
import {
  Play, Pause, RefreshCw, Clock, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";

interface Schedule {
  id: string;
  workflowName: string;
  category: "finance" | "comms" | "payroll" | "ops";
  description: string;
  cron: string;
  cronLabel: string;
  timezone: string;
  enabled: boolean;
  lastRun?: Date;
  lastStatus?: "success" | "failed" | "partial";
  nextRun: Date;
}

const CATEGORY_COLOR: Record<string, string> = {
  finance: "#8A5A12",
  comms:   "#1E5277",
  payroll: "#0066CC",
  ops:     "#727680",
};

function nextRunFromNow(hoursOffset: number): Date {
  const d = new Date();
  d.setHours(d.getHours() + hoursOffset, 0, 0, 0);
  return d;
}

const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: "quote-followup",
    workflowName: "Quote follow-up",
    category: "comms",
    description: "Spots quotes that have gone quiet, drafts polite one-line nudges with the quote PDF re-attached",
    cron: "0 9 * * 2,5",
    cronLabel: "Tue & Fri at 09:00",
    timezone: "Europe/London",
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 52),
    lastStatus: "success",
    nextRun: nextRunFromNow(46),
  },
  {
    id: "invoice-chase",
    workflowName: "Invoice chase",
    category: "finance",
    description: "Reads aged receivables from Xero, drafts a tier-aware reminder (retail/trade) for overdue invoices",
    cron: "0 9 * * 1,4",
    cronLabel: "Mon & Thu at 09:00",
    timezone: "Europe/London",
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 90),
    lastStatus: "success",
    nextRun: nextRunFromNow(70),
  },
  {
    id: "stock-restock",
    workflowName: "Stock & PO drafting",
    category: "ops",
    description: "Watches Cin7 stock vs. open jobs, drafts purchase orders when cover drops below safe level",
    cron: "0 6 * * *",
    cronLabel: "Daily at 06:00",
    timezone: "Europe/London",
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 3),
    lastStatus: "success",
    nextRun: nextRunFromNow(22),
  },
  {
    id: "payroll",
    workflowName: "Weekly payroll",
    category: "payroll",
    description: "Pulls hours from job sheets, syncs BrightPay, auto-files PAYE/NIC to HMRC on approval",
    cron: "0 9 * * 5",
    cronLabel: "Friday at 09:00",
    timezone: "Europe/London",
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    lastStatus: "success",
    nextRun: nextRunFromNow(48),
  },
  {
    id: "cis-return",
    workflowName: "CIS monthly return",
    category: "finance",
    description: "Pulls subcontractor payments, verifies status with HMRC, prepares the CIS return for approval",
    cron: "0 9 14 * *",
    cronLabel: "14th of each month",
    timezone: "Europe/London",
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    lastStatus: "success",
    nextRun: nextRunFromNow(330),
  },
  {
    id: "reconciliation",
    workflowName: "Bank reconciliation",
    category: "finance",
    description: "Matches bank feed lines to Xero transactions, flags unmatched items for review",
    cron: "0 2 * * *",
    cronLabel: "Daily at 02:00",
    timezone: "Europe/London",
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 6),
    lastStatus: "partial",
    nextRun: nextRunFromNow(18),
  },
  {
    id: "morning-brief",
    workflowName: "Morning briefing",
    category: "comms",
    description: "Overnight summary of cash, jobs and approvals — ready when you open the app at 07:00",
    cron: "55 6 * * 1-5",
    cronLabel: "Weekdays at 06:55",
    timezone: "Europe/London",
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 8),
    lastStatus: "success",
    nextRun: nextRunFromNow(17),
  },
  {
    id: "vat-return",
    workflowName: "VAT quarterly return",
    category: "finance",
    description: "Prepares the VAT packet from Xero data, queues for approval before HMRC submission",
    cron: "0 9 25 */3 *",
    cronLabel: "25th of last month per quarter",
    timezone: "Europe/London",
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 88),
    lastStatus: "success",
    nextRun: nextRunFromNow(110),
  },
  {
    id: "social",
    workflowName: "Social scheduling",
    category: "ops",
    description: "Drafts Instagram posts of the week's finished installs for sign-off",
    cron: "0 8 * * 1",
    cronLabel: "Monday at 08:00",
    timezone: "Europe/London",
    enabled: false,
    nextRun: nextRunFromNow(115),
  },
];

function formatDate(d: Date): string {
  const mins = Math.floor((Date.now() - d.getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatNext(d: Date): string {
  const hrs = Math.floor((d.getTime() - Date.now()) / 3_600_000);
  if (hrs < 1) return "in <1h";
  if (hrs < 24) return `in ${hrs}h`;
  return `in ${Math.floor(hrs / 24)}d`;
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [runningId, setRunningId] = useState<string | null>(null);

  function toggleEnabled(id: string) {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }

  function runNow(id: string) {
    setRunningId(id);
    setTimeout(() => {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, lastRun: new Date(), lastStatus: "success" } : s
        )
      );
      setRunningId(null);
    }, 2200);
  }

  const enabled  = schedules.filter((s) => s.enabled);
  const disabled = schedules.filter((s) => !s.enabled);

  return (
    <div className="px-4 sm:px-8 py-6 min-h-screen" style={{ background: "#F6F4EE" }}>
      <PageHeader title="Schedules" subtitle="Automated workflows that run on a timer — all actions still require your approval" />

      {enabled.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[13px] font-semibold text-stone uppercase tracking-wide mb-3">Active ({enabled.length})</h3>
          <div className="flex flex-col gap-3">
            {enabled.map((s) => (
              <ScheduleRow key={s.id} schedule={s} running={runningId === s.id} onToggle={toggleEnabled} onRunNow={runNow} />
            ))}
          </div>
        </section>
      )}

      {disabled.length > 0 && (
        <section>
          <h3 className="text-[13px] font-semibold text-stone uppercase tracking-wide mb-3">Paused ({disabled.length})</h3>
          <div className="flex flex-col gap-3">
            {disabled.map((s) => (
              <ScheduleRow key={s.id} schedule={s} running={runningId === s.id} onToggle={toggleEnabled} onRunNow={runNow} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ScheduleRow({
  schedule, running, onToggle, onRunNow,
}: {
  schedule: Schedule;
  running: boolean;
  onToggle: (id: string) => void;
  onRunNow: (id: string) => void;
}) {
  function statusIcon() {
    if (!schedule.lastStatus) return null;
    if (schedule.lastStatus === "success") return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
    if (schedule.lastStatus === "partial") return <AlertTriangle className="w-3.5 h-3.5 text-warning" />;
    return <AlertTriangle className="w-3.5 h-3.5 text-danger" />;
  }

  return (
    <div className={`bg-surface-card border rounded-[20px] p-5 flex items-start gap-5 ${schedule.enabled ? "border-hairline-light" : "border-hairline-light opacity-60"}`}>
      {/* Color dot */}
      <div
        className="w-2 h-2 rounded-full mt-2 shrink-0"
        style={{ background: CATEGORY_COLOR[schedule.category] }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-ink">{schedule.workflowName}</div>
        <div className="text-[12.5px] text-stone mt-0.5 leading-snug">{schedule.description}</div>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className="flex items-center gap-1 text-[12px] text-stone">
            <Clock className="w-3 h-3" /> {schedule.cronLabel}
          </span>
          <span className="text-stone/30">·</span>
          <span className="text-[12px] text-stone">{schedule.timezone}</span>
          {schedule.lastRun && (
            <>
              <span className="text-stone/30">·</span>
              <span className="flex items-center gap-1 text-[12px] text-stone">
                {statusIcon()} Last run {formatDate(schedule.lastRun)}
              </span>
            </>
          )}
          {schedule.enabled && (
            <>
              <span className="text-stone/30">·</span>
              <span className="text-[12px] text-stone">Next {formatNext(schedule.nextRun)}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {schedule.enabled && (
          <button
            onClick={() => onRunNow(schedule.id)}
            disabled={running}
            className="flex items-center gap-1.5 h-[30px] px-3 rounded-full text-[12.5px] font-semibold bg-surface-soft text-ink hover:bg-hairline-light transition-colors disabled:opacity-50"
          >
            {running ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {running ? "Running…" : "Run now"}
          </button>
        )}
        <button
          onClick={() => onToggle(schedule.id)}
          className={[
            "flex items-center gap-1.5 h-[30px] px-3 rounded-full text-[12.5px] font-semibold transition-colors",
            schedule.enabled
              ? "text-stone hover:bg-surface-soft"
              : "bg-ink text-on-dark hover:opacity-80",
          ].join(" ")}
        >
          {schedule.enabled
            ? <><Pause className="w-3 h-3" /> Pause</>
            : <><Play className="w-3 h-3" /> Enable</>
          }
        </button>
      </div>
    </div>
  );
}
