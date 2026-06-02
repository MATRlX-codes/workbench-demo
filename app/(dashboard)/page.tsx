"use client";

import { useState } from "react";
import { PageHeader } from "@/lib/ui/page-header";
import { TodayApprovals } from "@/lib/ui/today-approvals";
import { Modal, ModalActions } from "@/lib/ui/modal";
import { useChaseList } from "@/lib/mock/chase-list";
import { useCompany } from "@/lib/mock/company-context";
import type { DiaryEntry } from "@/lib/mock/companies/types";
import {
  ArrowUpRight, AlertTriangle, Check, RefreshCw, Phone, Mail,
  Bell, X, Clock,
} from "lucide-react";

export default function TodayPage() {
  const { company } = useCompany();
  const today = company.today;
  const [diary, setDiary] = useState<DiaryEntry[]>(today.diary);
  const [confirmingEntry, setConfirmingEntry] = useState<DiaryEntry | null>(null);
  const [confirmingSending, setConfirmingSending] = useState(false);
  const [confirmingDone, setConfirmingDone] = useState(false);
  const [riskDismissed, setRiskDismissed] = useState(false);
  const [chaseLoading, setChaseLoading] = useState(false);
  const chase = useChaseList();
  const risk = today.risk;
  const riskOnList = risk ? chase.entries.find((e) => e.customer === risk.customer) : undefined;

  function openConfirm(entry: DiaryEntry) {
    setConfirmingEntry(entry);
    setConfirmingSending(false);
    setConfirmingDone(false);
  }
  function sendConfirmation() {
    setConfirmingSending(true);
    setTimeout(() => {
      setConfirmingSending(false);
      setConfirmingDone(true);
      if (confirmingEntry) {
        setDiary((prev) => prev.map((d) =>
          d.id === confirmingEntry.id ? { ...d, status: "confirmed", statusPill: "ok" } : d
        ));
      }
    }, 1200);
  }
  function closeConfirm() {
    setConfirmingEntry(null);
    setConfirmingDone(false);
  }
  function addRiskToChase() {
    if (!risk) return;
    setChaseLoading(true);
    setTimeout(() => {
      chase.add({
        customer: risk.customer,
        invoiceRef: "Next invoice — when raised",
        amount: "—",
        reason: "Flagged on Today · pre-emptive chase",
        source: "today-risk",
      });
      setChaseLoading(false);
    }, 900);
  }

  return (
    <>
      <PageHeader title="Today" subtitle={today.date} />

      <div className="px-4 sm:px-8 py-7 max-w-[1120px] mx-auto">

        {/* Greeting */}
        <div className="mb-8">
          <h2 className="apple-hero" style={{ fontSize: 36 }}>Good morning, {today.greetingName}.</h2>
          <p className="apple-lead mt-2" style={{ color: "#333333" }}>
            {today.greetingLine}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-9">
          {today.stats.map(({ label, value, sub, delta, accent }) => (
            <div
              key={label}
              className="apple-card p-5"
              style={accent ? { background: "#E8F0FB", borderColor: "rgba(0,102,204,0.16)" } : {}}
            >
              <div className="apple-fine">{label}</div>
              <div className="apple-display tnum mt-2" style={{ fontSize: 30 }}>{value}</div>
              <div className="apple-fine mt-2">
                {delta ? (
                  <span className="flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 shrink-0" style={{ color: "#2E844A" }} />
                    <span style={{ color: "#2E844A" }}>{delta}</span>
                    <span> {sub}</span>
                  </span>
                ) : (
                  sub
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Approvals (line-items shown inline, modals on click) */}
        <TodayApprovals />

        {/* Chase list */}
        <ChaseListSection />

        {/* Today's diary */}
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="section-title">Today&apos;s diary</h3>
          <span className="apple-fine">{today.diarySubtitle}</span>
        </div>
        <div className="apple-card mb-9 overflow-x-auto">
          <div className="min-w-[640px]">
          {diary.map((entry, i) => (
            <div
              key={entry.id}
              className="grid items-center"
              style={{
                gridTemplateColumns: "74px 1fr 210px 200px",
                padding: "14px 18px",
                fontSize: 14,
                borderBottom: i < diary.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <div className="tnum apple-caption-strong">{entry.time}</div>
              <div>
                <div className="apple-caption-strong">{entry.title}</div>
                <div className="apple-fine mt-0.5">{entry.detail}</div>
              </div>
              <div className="apple-fine">{entry.location}</div>
              <div className="flex justify-end">
                {entry.status === "unconfirmed" ? (
                  <button onClick={() => openConfirm(entry)} className="btn btn-pearl">
                    Confirm with customer
                  </button>
                ) : entry.statusPill === "ok" ? (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> Confirmed</span>
                ) : (
                  <span className="pill pill-info">Booked</span>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Risk card */}
        {risk && !riskDismissed && (
          <>
            <h3 className="section-title mb-3">Worth your eye this week</h3>
            <div
              className="apple-card p-5 mb-2"
              style={{ background: "#F5EAD6", borderColor: "#ecdcbb" }}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="shrink-0 w-9 h-9 rounded-[9px] flex items-center justify-center"
                    style={{ background: "#efddb6", color: "#8A5A12" }}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="apple-tagline" style={{ color: "#5e3f0c", fontSize: 17 }}>
                      {risk.title}
                    </div>
                    <div className="apple-body mt-1" style={{ color: "#6a4a13" }}>
                      {risk.body}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setRiskDismissed(true)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: "#5e3f0c" }}
                  >
                    Dismiss
                  </button>
                  {riskOnList ? (
                    <span className="btn btn-sm" style={{ background: "#2E844A", color: "#fff", cursor: "default" }}>
                      <Check className="w-3.5 h-3.5" /> On chase list
                    </span>
                  ) : (
                    <button
                      onClick={addRiskToChase}
                      disabled={chaseLoading}
                      className="btn btn-sm btn-warn"
                    >
                      {chaseLoading
                        ? <><RefreshCw className="w-3 h-3 animate-spin" /> Adding…</>
                        : "Add to chase list"
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
            <p className="apple-fine mb-4">
              Computed nightly from invoice history, deposits taken and reply latency.
            </p>
          </>
        )}
      </div>

      {/* Confirm-with-customer modal */}
      <Modal
        open={!!confirmingEntry}
        onClose={closeConfirm}
        title={confirmingDone ? "Confirmation sent" : `Confirm · ${confirmingEntry?.customer ?? ""}`}
        width="540px"
      >
        {confirmingEntry && (
          confirmingDone ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
                <Check className="w-6 h-6 text-white" />
              </div>
              <div className="apple-tagline">Confirmation sent</div>
              <div className="apple-caption text-center">
                Email to <strong>{confirmingEntry.email}</strong><br />
                SMS to <strong>{confirmingEntry.phone}</strong>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="apple-card p-4 space-y-1.5">
                <div className="flex gap-2"><span className="apple-fine w-20 shrink-0">Time</span><span className="apple-caption-strong">{confirmingEntry.time}</span></div>
                <div className="flex gap-2"><span className="apple-fine w-20 shrink-0">Location</span><span className="apple-caption">{confirmingEntry.location}</span></div>
                <div className="flex gap-2"><span className="apple-fine w-20 shrink-0">Detail</span><span className="apple-caption">{confirmingEntry.detail}</span></div>
              </div>
              <div className="space-y-2">
                <div className="apple-fine">Will send to</div>
                <div className="apple-caption flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" style={{ color: "#86868B" }} /> {confirmingEntry.email}
                </div>
                <div className="apple-caption flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" style={{ color: "#86868B" }} /> {confirmingEntry.phone}
                </div>
              </div>
              <div className="apple-card p-4">
                <div className="apple-fine mb-1.5">Claude-drafted message · warm, matches {company.ownerFirst}&apos;s style</div>
                <div className="apple-body">
                  Hi {confirmingEntry.customer?.split(" ")[0]}, quick note to confirm
                  {confirmingEntry.detail.toLowerCase().includes("survey") ? " your survey " : " your appointment "}
                  at {confirmingEntry.time} · {confirmingEntry.location}. See you then — give us a ring if
                  anything changes. {company.ownerFirst}, {company.name}.
                </div>
              </div>
            </div>
          )
        )}
        <ModalActions>
          {confirmingDone ? (
            <button onClick={closeConfirm} className="btn btn-primary btn-sm">Done</button>
          ) : (
            <>
              <button onClick={closeConfirm} className="btn btn-ghost btn-sm">Cancel</button>
              <button
                onClick={sendConfirmation}
                disabled={confirmingSending}
                className="btn btn-primary btn-sm"
              >
                {confirmingSending ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</> : "Send confirmation"}
              </button>
            </>
          )}
        </ModalActions>
      </Modal>
    </>
  );
}

/* ───────────────────────────────────────────────────────────── */

function ChaseListSection() {
  const { entries, markSent, snooze, remove } = useChaseList();
  const pending  = entries.filter((e) => e.status === "pending");
  const sent     = entries.filter((e) => e.status === "sent");
  const snoozed  = entries.filter((e) => e.status === "snoozed");

  function relative(d: Date): string {
    const ms = Date.now() - d.getTime();
    const m = Math.floor(ms / 60000);
    if (m < 60)  return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24)  return `${h}h ago`;
    return `${Math.floor(h/24)}d ago`;
  }

  return (
    <div className="mb-9">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="section-title">Chase list</h3>
        <span className="apple-fine">
          {pending.length > 0 ? `${pending.length} to action · ${sent.length} sent · ${snoozed.length} snoozed`
            : `${sent.length} sent · ${snoozed.length} snoozed`}
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="apple-card p-5 flex items-center gap-3">
          <Bell className="w-5 h-5" style={{ color: "#86868B" }} />
          <div>
            <div className="apple-caption-strong">No chase list right now</div>
            <div className="apple-fine">Customers flagged from the Money tab or risk card appear here.</div>
          </div>
        </div>
      ) : (
        <div className="apple-card overflow-x-auto">
          <div className="min-w-[720px]">
          {entries.map((e, i) => (
            <div
              key={e.id}
              className="grid items-center"
              style={{
                gridTemplateColumns: "1.4fr 110px 1.4fr 90px 90px 180px",
                padding: "12px 18px",
                borderBottom: i < entries.length - 1 ? "1px solid #F0F0F0" : "none",
                background: e.status === "sent" ? "#FAFAFC" : "transparent",
                opacity: e.status === "snoozed" ? 0.65 : 1,
              }}
            >
              <div>
                <div className="apple-caption-strong">{e.customer}</div>
                <div className="apple-fine">{e.reason}</div>
              </div>
              <div className="apple-fine tnum">{e.invoiceRef ?? "—"}</div>
              <div className="apple-caption">
                {e.source === "today-risk"      && "Flagged · Today risk card"}
                {e.source === "money-overdue"   && "Flagged · Money overdue"}
                {e.source === "money-due"       && "Flagged · Due soon"}
                {e.source === "manual"          && "Added manually"}
              </div>
              <div className="apple-caption-strong tnum text-right">{e.amount ?? "—"}</div>
              <div className="apple-fine text-right">{relative(e.addedAt)}</div>
              <div className="flex justify-end gap-1.5">
                {e.status === "pending" && (
                  <>
                    <button onClick={() => snooze(e.id)} className="btn btn-pearl" title="Snooze 3 days">
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => markSent(e.id)} className="btn btn-primary btn-sm">
                      <Mail className="w-3.5 h-3.5" /> Send chase
                    </button>
                  </>
                )}
                {e.status === "sent" && (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> Sent</span>
                )}
                {e.status === "snoozed" && (
                  <button onClick={() => markSent(e.id)} className="btn btn-pearl">Resume</button>
                )}
                <button onClick={() => remove(e.id)} className="btn btn-ghost btn-sm" style={{ color: "#9A2D24", padding: "0 8px" }} title="Remove">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
