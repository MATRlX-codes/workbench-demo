"use client";

import { useState } from "react";
import {
  Play, CheckCircle2, XCircle, Pencil, AlertTriangle,
  Settings, Zap, Download, Clock,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";

type EventFilter = "all" | "approvals" | "runs" | "system";

interface AuditEvent {
  id: string;
  event: string;
  actor: string;
  description: string;
  at: Date;
  meta?: string;
}

const MOCK_EVENTS: AuditEvent[] = [
  { id: "1",  event: "approval.approved", actor: "Dean Holloway", description: "Approved 5 quote follow-ups · pipeline £11,800",                at: new Date(Date.now() - 1000 * 60 * 8),  meta: "Quote follow-up" },
  { id: "2",  event: "action.executed",   actor: "system",        description: "5 quote-nudge emails sent via Gmail",                            at: new Date(Date.now() - 1000 * 60 * 7),  meta: "Quote follow-up" },
  { id: "3",  event: "approval.approved", actor: "Dean Holloway", description: "Approved reply to Halpin Builders re: Carrara lead time",        at: new Date(Date.now() - 1000 * 60 * 35), meta: "Customer reply" },
  { id: "4",  event: "action.executed",   actor: "system",        description: "Reply sent to paul@halpinbuilders.co.uk via Gmail",              at: new Date(Date.now() - 1000 * 60 * 34), meta: "Customer reply" },
  { id: "5",  event: "approval.approved", actor: "Dean Holloway", description: "Confirmed Janet Cole's survey via SMS reminder",                  at: new Date(Date.now() - 1000 * 60 * 52), meta: "Survey confirm" },
  { id: "6",  event: "run.started",       actor: "schedule",      description: "Stock & PO drafting overnight run (06:00)",                       at: new Date(Date.now() - 1000 * 60 * 60 * 3), meta: "Stock & PO" },
  { id: "7",  event: "run.completed",     actor: "system",        description: "PO-2214 drafted to Continental Flooring · £2,098",               at: new Date(Date.now() - 1000 * 60 * 60 * 3 + 1000 * 65), meta: "Stock & PO" },
  { id: "8",  event: "approval.edited",   actor: "Dean Holloway", description: "Edited & approved bathroom quote for Mr & Mrs Doyle (£1,820)",   at: new Date(Date.now() - 1000 * 60 * 80), meta: "Quote draft" },
  { id: "9",  event: "approval.rejected", actor: "Dean Holloway", description: "Held auto-refund to Tom Reilly · over £150 threshold",            at: new Date(Date.now() - 1000 * 60 * 60 * 16), meta: "Customer reply" },
  { id: "10", event: "run.started",       actor: "schedule",      description: "Bank reconciliation overnight run (02:18)",                       at: new Date(Date.now() - 1000 * 60 * 60 * 6), meta: "Reconciliation" },
  { id: "11", event: "run.completed",     actor: "system",        description: "412 of 419 bank transactions matched · 7 flagged",                at: new Date(Date.now() - 1000 * 60 * 60 * 6 + 1000 * 120), meta: "Reconciliation" },
  { id: "12", event: "run.started",       actor: "schedule",      description: "CIS monthly return drafted from BrightPay subcontractor data",   at: new Date(Date.now() - 1000 * 60 * 60 * 8), meta: "CIS return" },
  { id: "13", event: "system.connector",  actor: "system",        description: "Shopify token refresh required in 14 days",                       at: new Date(Date.now() - 1000 * 60 * 60 * 9), meta: "Connectors" },
  { id: "14", event: "run.completed",     actor: "system",        description: "Morning briefing generated for Dean",                              at: new Date(Date.now() - 1000 * 60 * 60 * 10), meta: "Morning briefing" },
  { id: "15", event: "system.connector",  actor: "system",        description: "Xero sync · aged receivables refreshed (£18,900 due in 7 days)", at: new Date(Date.now() - 1000 * 60 * 60 * 11), meta: "Connectors" },
];

function eventIcon(event: string) {
  if (event.startsWith("approval.approved")) return <CheckCircle2 className="w-4 h-4 text-success" />;
  if (event.startsWith("approval.rejected")) return <XCircle className="w-4 h-4 text-danger" />;
  if (event.startsWith("approval.edited"))   return <Pencil className="w-4 h-4 text-info" />;
  if (event.startsWith("run.started"))       return <Play className="w-4 h-4 text-stone" />;
  if (event.startsWith("run.completed"))     return <Zap className="w-4 h-4 text-warning" />;
  if (event.startsWith("action.executed"))   return <CheckCircle2 className="w-4 h-4 text-info" />;
  if (event.startsWith("system"))            return <Settings className="w-4 h-4 text-stone" />;
  return <AlertTriangle className="w-4 h-4 text-stone" />;
}

function eventCategory(event: string): EventFilter {
  if (event.startsWith("approval") || event.startsWith("action")) return "approvals";
  if (event.startsWith("run"))      return "runs";
  return "system";
}

function relativeTime(date: Date): string {
  const ms = Date.now() - date.getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function mockDownloadCSV() {
  const rows = ["timestamp,event,actor,description,workflow"];
  MOCK_EVENTS.forEach((e) => {
    rows.push([e.at.toISOString(), e.event, e.actor, `"${e.description}"`, e.meta ?? ""].join(","));
  });
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "workbench-audit-log.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<EventFilter>("all");

  const filters: { key: EventFilter; label: string }[] = [
    { key: "all",       label: "All" },
    { key: "approvals", label: "Approvals & actions" },
    { key: "runs",      label: "Workflow runs" },
    { key: "system",    label: "System" },
  ];

  const visible = MOCK_EVENTS.filter(
    (e) => filter === "all" || eventCategory(e.event) === filter
  );

  return (
    <div className="px-4 sm:px-8 py-6 min-h-screen" style={{ background: "#F6F4EE" }}>
      <PageHeader title="Activity" subtitle="Audit log of every action taken by Claude and your approvals" />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={[
                "h-[30px] px-3 rounded-full text-[12.5px] font-medium transition-colors",
                filter === key
                  ? "bg-ink text-on-dark"
                  : "bg-surface-soft text-ink hover:bg-hairline-light",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={mockDownloadCSV}
          className="flex items-center gap-1.5 h-[30px] px-4 rounded-full text-[12.5px] font-semibold bg-surface-card border border-hairline-light text-ink hover:bg-surface-soft transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="bg-surface-card border border-hairline-light rounded-[20px] overflow-hidden">
        <div className="divide-y divide-hairline-light">
          {visible.map((ev) => (
            <div key={ev.id} className="flex items-start gap-4 px-6 py-4 hover:bg-surface-soft transition-colors">
              <div className="w-7 h-7 rounded-full bg-surface-soft flex items-center justify-center shrink-0 mt-0.5">
                {eventIcon(ev.event)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium text-ink leading-snug">{ev.description}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11.5px] text-stone">{ev.actor}</span>
                  {ev.meta && (
                    <>
                      <span className="text-stone/40">·</span>
                      <span className="text-[11.5px] text-stone">{ev.meta}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 text-[12px] text-stone whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {relativeTime(ev.at)}
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <div className="px-6 py-12 text-center text-stone text-[13.5px]">
              No events in this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
