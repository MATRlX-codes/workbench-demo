"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight, Download, Plus, AlertCircle, Clock,
  Calendar, Check, RefreshCw, Send, Pencil, X, FileText, Mail,
  TrendingUp, Star, Sparkles,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { Modal, ModalActions } from "@/lib/ui/modal";
import { useChaseList } from "@/lib/mock/chase-list";
import { useCompany } from "@/lib/mock/company-context";
import type { InvoiceRow, DueWeekRow, FeeBreakdown, ForecastWeek, StaleQuote, Customer } from "@/lib/mock/companies/types";

/* ───────────────────────────────────────────────────────────── */

interface ChaseTarget {
  row: InvoiceRow | DueWeekRow;
  mode: "chase" | "reminder" | "schedule";
}

function chaseTemplate(row: ChaseTarget["row"], mode: ChaseTarget["mode"], signoff: string) {
  const name = row.name.split(" ")[0];
  const days = "daysOverdue" in row ? row.daysOverdue : undefined;

  if (mode === "schedule") {
    return {
      subject: `Friendly heads-up · ${row.ref.split("·")[0].trim()}`,
      body:
`Hi ${name},

Just a quick friendly heads-up that ${row.ref.split("·")[0].trim()} for ${row.amount} falls due ${"due" in row ? row.due : "later this week"}. No action needed if it's already in the run — this is purely so it doesn't surprise you.

Always happy to send a fresh copy of the invoice if helpful.

Best,
${signoff}`,
      scheduledFor: "Two days before due date · 09:00",
    };
  }
  if (mode === "reminder") {
    return {
      subject: `Gentle reminder · ${row.ref.split("·")[0].trim()}`,
      body:
`Hi ${name},

A gentle reminder that ${row.ref.split("·")[0].trim()} for ${row.amount} is now ${days ?? ""} days past due. I'm sure it's just slipped through — if you can drop it on the next run that'd be great.

If you need anything from our side (a fresh PDF, a statement, or a different reference) just let me know.

Best,
${signoff}`,
      scheduledFor: undefined,
    };
  }
  // chase politely
  return {
    subject: `Following up on ${row.ref.split("·")[0].trim()}`,
    body:
`Hi ${name},

I hope you're keeping well. Just following up on ${row.ref.split("·")[0].trim()} for ${row.amount}, which has now sat ${days ?? ""} days past due.

I appreciate things get busy — could you let me know roughly when this can be settled? If there's anything I can sort from this end (PO mismatch, missing PDF, alternative payment route) just shout.

Best,
${signoff}`,
    scheduledFor: undefined,
  };
}

/* ───────────────────────────────────────────────────────────── */

export default function MoneyPage() {
  const { company } = useCompany();
  const money = company.money;
  const signoff = `${company.ownerFirst} — ${company.name}`;

  const CASHFLOW_DAYS = money.cashflowDays;
  const MAX_CF = Math.max(...CASHFLOW_DAYS.flatMap((d) => [d.in, d.out]));
  const OVERDUE_30 = money.overdue30;
  const OVERDUE_730 = money.overdue730;
  const DUE_WEEK = money.dueWeek;
  const MISMATCHES = money.mismatches;

  function mockExportCSV() {
    const rows = ["name,ref,amount,age,status"];
    [...OVERDUE_30, ...OVERDUE_730].forEach((r) => {
      rows.push([r.name, r.ref, r.amount, r.age, "overdue"].join(","));
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = money.csvName;
    a.click();
    URL.revokeObjectURL(url);
  }

  const chaseList = useChaseList();
  const [chased, setChased] = useState<Set<string>>(new Set());
  const [scheduledChase, setScheduledChase] = useState<Set<string>>(new Set());
  const [reconModal, setReconModal] = useState(false);
  const [reconReport, setReconReport] = useState(false);
  const [resolvedMismatches, setResolvedMismatches] = useState<Set<string>>(new Set());
  const [newInvoiceModal, setNewInvoiceModal] = useState(false);
  const [newInvSaved, setNewInvSaved] = useState(false);

  // Chase email modal state
  const [chaseTarget, setChaseTarget] = useState<ChaseTarget | null>(null);
  const [chaseSubject, setChaseSubject] = useState("");
  const [chaseBody, setChaseBody] = useState("");
  const [chaseScheduled, setChaseScheduled] = useState<string | undefined>(undefined);
  const [chaseSending, setChaseSending] = useState(false);
  const [chaseSent, setChaseSent] = useState(false);
  const [addToList, setAddToList] = useState(true);

  function openChase(target: ChaseTarget) {
    const tpl = chaseTemplate(target.row, target.mode, signoff);
    setChaseTarget(target);
    setChaseSubject(tpl.subject);
    setChaseBody(tpl.body);
    setChaseScheduled(tpl.scheduledFor);
    setChaseSending(false);
    setChaseSent(false);
    setAddToList(target.mode !== "schedule");
  }

  function sendChase() {
    setChaseSending(true);
    setTimeout(() => {
      setChaseSending(false);
      setChaseSent(true);
      if (!chaseTarget) return;
      if ("id" in chaseTarget.row && chaseTarget.row.id) {
        const r = chaseTarget.row as InvoiceRow;
        if (chaseTarget.mode === "schedule") {
          setScheduledChase((prev) => new Set([...prev, r.name]));
        } else {
          setChased((prev) => new Set([...prev, r.id]));
        }
        if (addToList) {
          chaseList.add({
            customer: r.name,
            invoiceRef: r.ref.split("·")[0].trim(),
            amount: r.amount,
            reason: chaseTarget.mode === "chase"    ? "Politely chased · 30+ overdue" :
                    chaseTarget.mode === "reminder" ? "Gentle reminder · 7–30 days"   :
                                                      "Scheduled chase · pre-due",
            source: chaseTarget.mode === "schedule" ? "money-due" : "money-overdue",
          });
        }
      } else {
        // due week row (no id, no daysOverdue)
        const r = chaseTarget.row as { name: string };
        setScheduledChase((prev) => new Set([...prev, r.name]));
      }
    }, 1100);
  }

  function closeChase() {
    setChaseTarget(null);
    setChaseSent(false);
  }

  function resolveMismatch(id: string) {
    setResolvedMismatches((prev) => new Set([...prev, id]));
  }
  function scheduleChase(name: string, row: DueWeekRow) {
    openChase({ row, mode: "schedule" });
    void name; // referenced via row
  }

  const unresolvedCount = MISMATCHES.filter((m) => !resolvedMismatches.has(m.id)).length;
  const reconPct = Math.round((money.reconMatchedBase + (MISMATCHES.length - unresolvedCount)) / money.reconTotal * 100);

  return (
    <>
      <PageHeader title="Money" subtitle={money.subtitle} />

      <div className="px-8 py-7 max-w-[1120px] mx-auto">
        <div className="mb-7">
          <p className="apple-lead" style={{ color: "#333333" }}>
            Cash position, who owes you, and last night&apos;s reconciliation.
          </p>
        </div>

        {/* Cash hero */}
        <div className="apple-card p-6 mb-6">
          <div className="grid items-center gap-6" style={{ gridTemplateColumns: "280px 1fr 180px 180px" }}>
            <div>
              <div className="apple-fine">Cash today</div>
              <div className="tnum apple-hero mt-2" style={{ fontSize: 36 }}>{money.cashOnHand}</div>
              <div className="apple-fine mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 shrink-0" style={{ color: "#2E844A" }} />
                <span style={{ color: "#2E844A" }}>{money.cashDeltaPct}</span>&nbsp;over 30 days
              </div>
            </div>
            <div>
              <svg viewBox="0 0 300 88" width="100%" height="88" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sf" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0066CC" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#0066CC" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,60 L12,56 L24,62 L36,53 L48,49 L60,52 L72,45 L84,48 L96,41 L108,46 L120,39 L132,42 L144,35 L156,38 L168,30 L180,34 L192,27 L204,31 L216,24 L228,28 L240,20 L252,24 L264,17 L276,21 L288,14 L300,12 L300,88 L0,88 Z" fill="url(#sf)" />
                <path d="M0,60 L12,56 L24,62 L36,53 L48,49 L60,52 L72,45 L84,48 L96,41 L108,46 L120,39 L132,42 L144,35 L156,38 L168,30 L180,34 L192,27 L204,31 L216,24 L228,28 L240,20 L252,24 L264,17 L276,21 L288,14 L300,12" fill="none" stroke="#0066CC" strokeWidth="1.75" />
                <circle cx="300" cy="12" r="3" fill="#0066CC" />
              </svg>
              <div className="flex justify-between apple-fine mt-1"><span>{CASHFLOW_DAYS[0]?.label}</span><span>today</span></div>
            </div>
            <div>
              <div className="apple-fine">In · next 7 days</div>
              <div className="tnum mt-1 apple-display" style={{ fontSize: 22, color: "#2E844A" }}>{money.in7}</div>
              <div className="apple-fine">{money.in7Count}</div>
            </div>
            <div>
              <div className="apple-fine">Out · next 7 days</div>
              <div className="tnum mt-1 apple-display" style={{ fontSize: 22, color: "#9A2D24" }}>{money.out7}</div>
              <div className="apple-fine">{money.out7Detail}</div>
            </div>
          </div>
        </div>

        {/* Cash flow bar chart */}
        <div className="apple-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="apple-tagline" style={{ fontSize: 17 }}>30-day cash flow</div>
              <div className="apple-fine mt-0.5">Daily money in vs money out</div>
            </div>
            <div className="flex items-center gap-4 apple-fine">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#2E844A" }} /><span>In</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#9A2D24" }} /><span>Out</span></div>
            </div>
          </div>
          <div className="flex items-end gap-[3px]" style={{ height: 120 }}>
            {CASHFLOW_DAYS.map((d, i) => {
              const inH  = Math.round((d.in  / MAX_CF) * 110);
              const outH = Math.round((d.out / MAX_CF) * 110);
              const isToday = i === CASHFLOW_DAYS.length - 1;
              return (
                <div key={d.label} className="flex-1 flex items-end gap-[1px] group relative">
                  <div className="flex-1 rounded-t-[2px] transition-opacity group-hover:opacity-80" style={{ height: inH,  background: isToday ? "#2E844A" : "#2E844A40" }} />
                  <div className="flex-1 rounded-t-[2px] transition-opacity group-hover:opacity-80" style={{ height: outH, background: isToday ? "#9A2D24" : "#9A2D2430" }} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-10">
                    <div className="text-[11px] font-medium px-2 py-1 rounded-[8px] whitespace-nowrap shadow-lg" style={{ background: "#1D1D1F", color: "#fff" }}>
                      {d.label}<br />+£{(d.in/1000).toFixed(1)}k / −£{(d.out/1000).toFixed(1)}k
                    </div>
                    <div className="w-1.5 h-1.5 rotate-45 -mt-1" style={{ background: "#1D1D1F" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between apple-fine mt-2">
            <span>{CASHFLOW_DAYS[0]?.label}</span>
            <span>{CASHFLOW_DAYS[Math.floor(CASHFLOW_DAYS.length / 2)]?.label}</span>
            <span>{CASHFLOW_DAYS[CASHFLOW_DAYS.length - 1]?.label}</span>
          </div>
        </div>

        {/* Cash-flow forecast (Tier-1) */}
        <ForecastCard weeks={money.forecast} note={money.forecastNote} />

        {/* Invoice radar */}
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="section-title">Invoice radar</h3>
          <div className="flex items-center gap-2">
            <button onClick={mockExportCSV} className="btn btn-ghost btn-sm">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button onClick={() => setNewInvoiceModal(true)} className="btn btn-secondary btn-sm">
              <Plus className="w-3.5 h-3.5" /> New invoice
            </button>
          </div>
        </div>

        <InvoiceSection
          headerBg="#F7E8E5" headerBorder="#eed7d3"
          pillCls="pill-bad" icon={<AlertCircle className="w-3 h-3" />}
          label="Overdue 30+" sub={money.overdue30Sub} subColor="#9A2D24"
          rows={OVERDUE_30}
          chased={chased}
          onChase={(row) => openChase({ row, mode: "chase" })}
        />
        <InvoiceSection
          headerBg="#F5EAD6" headerBorder="#ecdcbb"
          pillCls="pill-warn" icon={<Clock className="w-3 h-3" />}
          label="Overdue 7–30" sub={money.overdue730Sub} subColor="#8A5A12"
          rows={OVERDUE_730}
          chased={chased}
          onChase={(row) => openChase({ row, mode: "reminder" })}
        />

        {/* Due this week */}
        <div className="apple-card mb-9 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#E8F0FB", borderBottom: "1px solid rgba(0,102,204,0.18)" }}>
            <span className="pill pill-info">
              <Calendar className="w-3 h-3" /> Due this week
            </span>
            <span className="apple-caption" style={{ color: "#0066CC" }}>{money.dueWeekSub}</span>
          </div>
          {DUE_WEEK.map((row, i) => (
            <div
              key={row.name}
              className="grid items-center"
              style={{
                gridTemplateColumns: "1.5fr 0.7fr 0.7fr 1fr 1fr",
                padding: "14px 18px",
                borderBottom: i < DUE_WEEK.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <div>
                <div className="apple-caption-strong">{row.name}</div>
                <div className="apple-fine">{row.ref}</div>
              </div>
              <div className="apple-caption-strong tnum">{row.amount}</div>
              <div className="apple-fine">{row.due}</div>
              <div className="apple-fine">—</div>
              <div className="flex justify-end">
                {scheduledChase.has(row.name) ? (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> Chase scheduled</span>
                ) : (
                  <button onClick={() => scheduleChase(row.name, row)} className="btn btn-pearl">
                    <Clock className="w-3.5 h-3.5" /> Schedule chase
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quote shelf-life monitor (Tier-1) */}
        <StaleQuotesSection quotes={money.staleQuotes} signoff={signoff} />

        {/* Auto-review requests (Tier-1) */}
        <ReviewRequestsSection customers={company.customers} ownerFirst={company.ownerFirst} businessName={company.name} />

        {/* Reconciliation */}
        <h3 className="section-title mb-3">Reconciliation</h3>
        <div className="apple-card p-5">
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <svg width="86" height="86" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E0E0E0" strokeWidth="3.4" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0066CC" strokeWidth="3.4" strokeDasharray={`${reconPct} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                <text x="18" y="21" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1D1D1F" fontFamily="var(--font-display)">{reconPct}%</text>
              </svg>
            </div>
            <div className="flex-1">
              <div className="apple-tagline" style={{ fontSize: 18 }}>
                {money.reconMatchedBase + (MISMATCHES.length - unresolvedCount)} of {money.reconTotal} transactions reconciled overnight
              </div>
              <div className="apple-body mt-1" style={{ color: "#333333" }}>
                {unresolvedCount > 0
                  ? money.mismatchSummary
                  : "All bank lines matched. Nice work."}
              </div>
              <div className="apple-fine mt-1">Run finished {money.reconFinished} · took {money.reconTook}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setReconReport(true)} className="btn btn-pearl">
                <FileText className="w-3.5 h-3.5" /> Full report
              </button>
              {unresolvedCount > 0 && (
                <button onClick={() => setReconModal(true)} className="btn btn-primary btn-sm">
                  Review {unresolvedCount} mismatches
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ───── Chase email modal ───── */}
      <Modal
        open={!!chaseTarget}
        onClose={closeChase}
        title={
          chaseSent ? (chaseTarget?.mode === "schedule" ? "Chase scheduled" : "Chase sent") :
          chaseTarget?.mode === "schedule" ? "Schedule chase" :
          chaseTarget?.mode === "reminder" ? "Send reminder" :
          "Chase politely"
        }
        width="660px"
      >
        {chaseSent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="apple-tagline">
              {chaseTarget?.mode === "schedule" ? "Scheduled" : "Sent to " + chaseTarget?.row.name}
            </div>
            <div className="apple-caption">
              {chaseTarget?.mode === "schedule"
                ? chaseScheduled
                : "Logged on the customer record · Inbox-tracked"}
            </div>
          </div>
        ) : chaseTarget ? (
          <div className="space-y-4">
            <div className="apple-card p-4 grid" style={{ gridTemplateColumns: "70px 1fr", rowGap: 4 }}>
              <div className="apple-fine">To</div>
              <div className="apple-caption">{chaseTarget.row.name} &lt;{chaseTarget.row.email}&gt;</div>
              <div className="apple-fine">Invoice</div>
              <div className="apple-caption">{chaseTarget.row.ref} · {chaseTarget.row.amount}</div>
              {chaseScheduled && (
                <>
                  <div className="apple-fine">Send when</div>
                  <div className="apple-caption-strong" style={{ color: "#0066CC" }}>{chaseScheduled}</div>
                </>
              )}
            </div>
            <div>
              <div className="apple-fine mb-1">Subject</div>
              <input
                value={chaseSubject}
                onChange={(e) => setChaseSubject(e.target.value)}
                className="apple-input w-full"
              />
            </div>
            <div>
              <div className="apple-fine mb-1">Body · edit as needed</div>
              <textarea
                value={chaseBody}
                onChange={(e) => setChaseBody(e.target.value)}
                rows={10}
                className="apple-input-rect"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addToList}
                onChange={(e) => setAddToList(e.target.checked)}
                className="w-4 h-4"
                style={{ accentColor: "#0066CC" }}
              />
              <span className="apple-caption">Also add to the chase list on Today</span>
            </label>
          </div>
        ) : null}
        <ModalActions>
          {chaseSent ? (
            <button onClick={closeChase} className="btn btn-primary btn-sm">Done</button>
          ) : (
            <>
              <button onClick={closeChase} className="btn btn-ghost btn-sm">Cancel</button>
              <button onClick={sendChase} disabled={chaseSending} className="btn btn-primary btn-sm">
                {chaseSending
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> {chaseTarget?.mode === "schedule" ? "Scheduling…" : "Sending…"}</>
                  : chaseTarget?.mode === "schedule"
                    ? <><Clock className="w-3.5 h-3.5" /> Schedule</>
                    : <><Send className="w-3.5 h-3.5" /> Send now</>}
              </button>
            </>
          )}
        </ModalActions>
      </Modal>

      {/* ───── Reconciliation mismatch modal ───── */}
      <Modal open={reconModal} onClose={() => setReconModal(false)} title="Review mismatches" width="720px">
        <div className="space-y-2">
          {MISMATCHES.map((m) => {
            const resolved = resolvedMismatches.has(m.id);
            return (
              <div
                key={m.id}
                className={`flex items-center gap-4 p-3 rounded-[12px] transition-opacity ${resolved ? "opacity-40" : ""}`}
                style={{ border: "1px solid #E0E0E0" }}
              >
                <div className="flex-1">
                  <div className="apple-caption-strong">{m.desc}</div>
                  <div className="apple-fine">{m.date} · {m.amount < 0 ? "−" : "+"}£{Math.abs(m.amount).toFixed(2)}</div>
                </div>
                {resolved ? (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> Resolved</span>
                ) : (
                  <button onClick={() => resolveMismatch(m.id)} className="btn btn-pearl">
                    <Check className="w-3 h-3" /> {m.action}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <ModalActions>
          <button onClick={() => setReconModal(false)} className="btn btn-primary btn-sm">Done</button>
        </ModalActions>
      </Modal>

      {/* ───── Recon full report ───── */}
      <ReconFullReportModal
        open={reconReport}
        onClose={() => setReconReport(false)}
        unresolved={unresolvedCount}
        reconPct={reconPct}
        fees={money.feesBreakdown}
        matchedBase={money.reconMatchedBase}
        total={money.reconTotal}
      />

      {/* ───── New invoice modal ───── */}
      <Modal open={newInvoiceModal} onClose={() => { setNewInvoiceModal(false); setNewInvSaved(false); }} title="New invoice">
        {newInvSaved ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="apple-tagline">Invoice created in Xero</div>
            <div className="apple-caption">INV-3147 sent to customer email</div>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { label: "Customer",    placeholder: "e.g. Halpin Builders" },
              { label: "Description", placeholder: "e.g. 38m² Carrara SPC + fit" },
              { label: "Amount (£)",  placeholder: "0.00" },
              { label: "Due date",    placeholder: "e.g. 12 Jun 2026" },
            ].map(({ label, placeholder }) => (
              <div key={label}>
                <label className="block apple-caption-strong mb-1.5">{label}</label>
                <input placeholder={placeholder} className="apple-input w-full" />
              </div>
            ))}
          </div>
        )}
        {!newInvSaved && (
          <ModalActions>
            <button onClick={() => setNewInvoiceModal(false)} className="btn btn-ghost btn-sm">Cancel</button>
            <button onClick={() => setNewInvSaved(true)} className="btn btn-primary btn-sm">Create in Xero</button>
          </ModalActions>
        )}
      </Modal>
    </>
  );
}

/* ───────────────────────────────────────────────────────────── */

function InvoiceSection({
  headerBg, headerBorder, pillCls, icon, label, sub, subColor, rows,
  chased, onChase,
}: {
  headerBg: string; headerBorder: string; pillCls: string; icon: React.ReactNode;
  label: string; sub: string; subColor: string;
  rows: InvoiceRow[];
  chased: Set<string>;
  onChase: (row: InvoiceRow) => void;
}) {
  return (
    <div className="apple-card mb-3 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: headerBg, borderBottom: `1px solid ${headerBorder}` }}>
        <span className={`pill ${pillCls}`}>{icon} {label}</span>
        <span className="apple-caption" style={{ color: subColor }}>{sub}</span>
      </div>
      {rows.map((row, i) => {
        const done = chased.has(row.id);
        return (
          <div
            key={row.id}
            className="grid items-center"
            style={{
              gridTemplateColumns: "1.5fr 0.7fr 0.7fr 1fr 1fr",
              padding: "14px 18px",
              borderBottom: i < rows.length - 1 ? "1px solid #F0F0F0" : "none",
            }}
          >
            <div>
              <div className="apple-caption-strong">{row.name}</div>
              <div className="apple-fine">{row.ref}</div>
            </div>
            <div className="apple-caption-strong tnum">{row.amount}</div>
            <div><span className={`pill ${row.pill === "bad" ? "pill-bad" : "pill-warn"}`}>{row.age}</span></div>
            <div className="apple-fine">{row.chaseNote}</div>
            <div className="flex justify-end">
              {done ? (
                <span className="pill pill-ok"><Check className="w-3 h-3" /> Sent · in Inbox</span>
              ) : (
                <button
                  onClick={() => onChase(row)}
                  className={`btn btn-sm ${row.primary ? "btn-primary" : "btn-secondary"}`}
                >
                  <Pencil className="w-3.5 h-3.5" /> {row.actionLabel}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */

function ReconFullReportModal({
  open, onClose, unresolved, reconPct, fees, matchedBase, total: txnTotal,
}: {
  open: boolean; onClose: () => void; unresolved: number; reconPct: number;
  fees: FeeBreakdown[]; matchedBase: number; total: number;
}) {
  const [tab, setTab] = useState<"summary" | "breakdown" | "log">("summary");
  useEffect(() => { if (open) setTab("summary"); }, [open]);

  const FEES_BREAKDOWN = fees;
  const total = FEES_BREAKDOWN.reduce((s, r) => s + r.value, 0);
  return (
    <Modal open={open} onClose={onClose} title="Reconciliation · full report · overnight 28→29 May" width="820px">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-[#E0E0E0]">
        {[
          { key: "summary",   label: "Summary" },
          { key: "breakdown", label: "Categories" },
          { key: "log",       label: "Run log" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className="px-3 py-2 apple-caption-strong"
            style={{
              color: tab === key ? "#0066CC" : "#86868B",
              borderBottom: "2px solid " + (tab === key ? "#0066CC" : "transparent"),
              marginBottom: "-1px",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Transactions",       value: String(txnTotal),  tone: "neutral" },
              { label: "Matched automatically", value: `${matchedBase + (txnTotal - matchedBase - unresolved)} · ${reconPct}%`, tone: "ok" },
              { label: "Still to match",     value: String(unresolved), tone: unresolved > 0 ? "warn" : "ok" },
            ].map(({ label, value, tone }) => (
              <div key={label} className="apple-card p-3">
                <div className="apple-fine">{label}</div>
                <div
                  className="tnum mt-1 apple-display"
                  style={{ fontSize: 22, color: tone === "ok" ? "#2E844A" : tone === "bad" ? "#9A2D24" : tone === "warn" ? "#8A5A12" : "#1D1D1F" }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div className="apple-card p-4">
            <div className="apple-caption-strong mb-2">What ran overnight</div>
            <ul className="apple-body space-y-1.5 pl-1" style={{ color: "#333333" }}>
              <li>· Pulled the connected bank feeds ({txnTotal} lines)</li>
              <li>· Pulled Xero invoices, bills, and credit notes from the last 90 days</li>
              <li>· Matched on amount + reference, then amount + supplier alias</li>
              <li>· Flagged {unresolved} line{unresolved === 1 ? "" : "s"} with no clear match — surfaced for your review</li>
              <li>· Pushed {matchedBase} confirmed matches to Xero with the &quot;reconciled&quot; status</li>
            </ul>
          </div>
        </div>
      )}

      {tab === "breakdown" && (
        <div className="apple-card overflow-hidden">
          <div
            className="grid items-center px-4 py-2.5 apple-fine"
            style={{ gridTemplateColumns: "2fr 90px 130px", background: "#F5F5F7", borderBottom: "1px solid #E0E0E0" }}
          >
            <div>Category</div>
            <div className="text-right">Count</div>
            <div className="text-right">Net £</div>
          </div>
          {FEES_BREAKDOWN.map((r, i) => (
            <div
              key={r.what}
              className="grid items-center px-4 py-3"
              style={{
                gridTemplateColumns: "2fr 90px 130px",
                borderBottom: i < FEES_BREAKDOWN.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <div className="apple-caption-strong">{r.what}</div>
              <div className="apple-caption tnum text-right">{r.count}</div>
              <div
                className="apple-caption-strong tnum text-right"
                style={{ color: r.value < 0 ? "#9A2D24" : "#1D1D1F" }}
              >
                {r.value < 0 ? "−" : ""}£{Math.abs(r.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          ))}
          <div
            className="grid items-center px-4 py-3"
            style={{ gridTemplateColumns: "2fr 90px 130px", background: "#FAFAFC", borderTop: "1px solid #E0E0E0" }}
          >
            <div className="apple-caption-strong">Total</div>
            <div></div>
            <div className="apple-tagline tnum text-right" style={{ fontSize: 17 }}>£{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      )}

      {tab === "log" && (
        <div className="apple-card overflow-hidden">
          {[
            { t: "02:07:14", e: "Bank feed pulled · HSBC current ·   292 lines" },
            { t: "02:07:38", e: "Bank feed pulled · HSBC reserve ·   127 lines" },
            { t: "02:08:02", e: "Xero · invoices, bills, credit notes synced ·   1,402 records" },
            { t: "02:08:41", e: "Pass 1 · amount + reference match · 388 lines matched" },
            { t: "02:11:09", e: "Pass 2 · amount + supplier alias match · 24 lines matched" },
            { t: "02:13:51", e: "7 lines remaining · queued for review" },
            { t: "02:14:22", e: "Pushed 412 reconciled records back to Xero · OK" },
            { t: "02:18:00", e: "Run complete · 11m 46s · 0 errors" },
          ].map((r, i, arr) => (
            <div
              key={r.t}
              className="grid items-center px-4 py-2.5"
              style={{
                gridTemplateColumns: "90px 1fr",
                borderBottom: i < arr.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <div className="apple-fine tnum">{r.t}</div>
              <div className="apple-caption">{r.e}</div>
            </div>
          ))}
        </div>
      )}

      <ModalActions>
        <button onClick={onClose} className="btn btn-ghost btn-sm">Close</button>
        <button
          onClick={() => {
            const lines = ["timestamp,event", ...["Pulled HSBC current","Pulled HSBC reserve","Pass 1 matches","Pass 2 matches","Pushed to Xero","Run complete"].map((s,i)=> `0${2+i}:0${i}:00,${s}`)];
            const blob = new Blob([lines.join("\n")], { type: "text/csv" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a");
            a.href = url; a.download = "reconciliation-report.csv"; a.click(); URL.revokeObjectURL(url);
          }}
          className="btn btn-pearl"
        >
          <Download className="w-3.5 h-3.5" /> Download report
        </button>
        <button onClick={onClose} className="btn btn-primary btn-sm">
          <Mail className="w-3.5 h-3.5" /> Email to accountant
        </button>
      </ModalActions>
    </Modal>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Tier-1 · 8-week cash-flow forecast                             */

function ForecastCard({ weeks, note }: { weeks: ForecastWeek[]; note: string }) {
  const max = Math.max(1, ...weeks.flatMap((w) => [w.in, w.out]));
  return (
    <div className="apple-card p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="apple-tagline flex items-center gap-1.5" style={{ fontSize: 17 }}>
            <TrendingUp className="w-4 h-4" style={{ color: "#0066CC" }} /> Cash-flow forecast
          </div>
          <div className="apple-fine mt-0.5">Committed money out vs expected money in · next {weeks.length} weeks</div>
        </div>
        <div className="flex items-center gap-4 apple-fine">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#2E844A" }} /><span>Expected in</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#9A2D24" }} /><span>Committed out</span></div>
        </div>
      </div>
      <div className="flex items-end gap-3" style={{ height: 132 }}>
        {weeks.map((w) => {
          const net = w.in - w.out;
          const inH  = Math.round((w.in  / max) * 110);
          const outH = Math.round((w.out / max) * 110);
          return (
            <div key={w.week} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-end gap-1 w-full justify-center" style={{ height: 112 }}>
                <div className="rounded-t-[3px]" style={{ width: 16, height: inH,  background: "#2E844A" }} />
                <div className="rounded-t-[3px]" style={{ width: 16, height: outH, background: "#9A2D24" }} />
              </div>
              <div className="apple-fine tnum" style={{ fontSize: 10.5, color: net < 0 ? "#9A2D24" : "#2E844A", fontWeight: 600 }}>
                {net < 0 ? "−" : "+"}£{Math.abs(net / 1000).toFixed(1)}k
              </div>
              <div className="apple-fine" style={{ fontSize: 10, textAlign: "center" }}>{w.week}</div>
            </div>
          );
        })}
      </div>
      <div className="apple-card p-3 mt-4 flex items-start gap-2.5" style={{ background: "#F5EAD6", borderColor: "#ecdcbb" }}>
        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#8A5A12" }} />
        <div className="apple-body" style={{ color: "#6a4a13" }}>{note}</div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Tier-1 · quote shelf-life monitor                              */

function StaleQuotesSection({ quotes, signoff }: { quotes: StaleQuote[]; signoff: string }) {
  const [nudged, setNudged] = useState<Set<string>>(new Set());
  if (quotes.length === 0) return null;
  void signoff;
  return (
    <div className="mb-9">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="section-title">Quote shelf-life</h3>
        <span className="apple-fine">Open quotes ageing past their valid-for window · prices may have moved</span>
      </div>
      <div className="apple-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#F5EAD6", borderBottom: "1px solid #ecdcbb" }}>
          <span className="pill pill-warn"><Clock className="w-3 h-3" /> Ageing</span>
          <span className="apple-caption" style={{ color: "#8A5A12" }}>{quotes.length} quotes · nudge before they go cold</span>
        </div>
        {quotes.map((q, i) => {
          const done = nudged.has(q.ref);
          return (
            <div
              key={q.ref}
              className="grid items-center"
              style={{
                gridTemplateColumns: "1.6fr 0.8fr 0.8fr 1.1fr 1fr",
                padding: "14px 18px",
                borderBottom: i < quotes.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <div>
                <div className="apple-caption-strong">{q.customer}</div>
                <div className="apple-fine">{q.ref} · {q.sku}</div>
              </div>
              <div className="apple-caption-strong tnum">{q.amount}</div>
              <div><span className="pill pill-warn">{q.ageDays}d old</span></div>
              <div className="apple-fine" style={{ color: "#8A5A12" }}>cost {q.move}</div>
              <div className="flex justify-end">
                {done ? (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> Nudged</span>
                ) : (
                  <button onClick={() => setNudged((p) => new Set([...p, q.ref]))} className="btn btn-secondary btn-sm">
                    <Send className="w-3.5 h-3.5" /> Nudge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Tier-1 · auto-review request                                   */

function ReviewRequestsSection({
  customers, ownerFirst, businessName,
}: { customers: Customer[]; ownerFirst: string; businessName: string }) {
  // Candidates: a completed job and nothing outstanding — happy, settled customers.
  const candidates = customers.filter((c) => {
    const out = parseFloat(c.outstanding.replace(/[^0-9.]/g, "")) || 0;
    const hasCompleted = c.jobs.some((j) => j.status === "completed");
    return out === 0 && hasCompleted;
  });
  const [sent, setSent] = useState<Set<string>>(new Set());
  void ownerFirst; void businessName;
  if (candidates.length === 0) return null;

  return (
    <div className="mb-9">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="section-title">Review requests</h3>
        <span className="apple-fine">Settled jobs with no money outstanding · a good moment to ask</span>
      </div>
      <div className="apple-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#E6F2EB", borderBottom: "1px solid rgba(46,132,74,0.2)" }}>
          <span className="pill pill-ok"><Star className="w-3 h-3" /> Ready</span>
          <span className="apple-caption" style={{ color: "#2E844A" }}>{candidates.length} happy customers · Claude drafts a short, on-brand ask</span>
        </div>
        {candidates.map((c, i) => {
          const done = sent.has(c.id);
          const lastCompleted = [...c.jobs].reverse().find((j) => j.status === "completed");
          return (
            <div
              key={c.id}
              className="grid items-center"
              style={{
                gridTemplateColumns: "1.6fr 1.6fr 1fr",
                padding: "14px 18px",
                borderBottom: i < candidates.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <div>
                <div className="apple-caption-strong">{c.name}</div>
                <div className="apple-fine">{c.email}</div>
              </div>
              <div className="apple-fine">{lastCompleted ? `${lastCompleted.type} · ${lastCompleted.detail}` : "Recent completed job"}</div>
              <div className="flex justify-end">
                {done ? (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> Request sent</span>
                ) : (
                  <button onClick={() => setSent((p) => new Set([...p, c.id]))} className="btn btn-secondary btn-sm">
                    <Star className="w-3.5 h-3.5" /> Request review
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
