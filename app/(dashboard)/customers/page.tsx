"use client";

import { useEffect, useState } from "react";
import {
  Search, Phone, Mail, ChevronRight,
  CheckCircle2, Clock, AlertCircle, MessageSquare,
  TrendingUp, TrendingDown, Building2, Globe, Instagram, UserPlus,
  CreditCard, FileText, Plus, X, Send, RefreshCw, Check, Sparkles,
  ClipboardCheck, Camera, FilePlus, Ruler,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { Modal, ModalActions } from "@/lib/ui/modal";
import { useCompany } from "@/lib/mock/company-context";
import type {
  Customer, CustomerInvoice, QuoteLine, QuoteTemplate,
  SiteSurveyData, VariationOrder, PatternQuotingData,
} from "@/lib/mock/companies/types";

const MONTHS = ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"];

/* ───────────────────── Inline charts ───────────────────── */

function MonthlySpendChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height: 80 }}>
        {data.map((v, i) => {
          const h = Math.max(2, Math.round((v / max) * 76));
          return (
            <div key={i} className="flex-1 group relative">
              <div
                className="w-full rounded-t-[3px] transition-opacity group-hover:opacity-80"
                style={{ height: h, background: v > 0 ? "#0066CC" : "#E0E0E0" }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center z-10">
                <div className="text-[10.5px] font-medium px-2 py-0.5 rounded-[6px] whitespace-nowrap" style={{ background: "#1D1D1F", color: "#fff" }}>
                  {MONTHS[i]} · £{v.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        {MONTHS.map((m, i) => (
          <div key={i} className="apple-fine" style={{ fontSize: 10, flex: 1, textAlign: "center" }}>{m}</div>
        ))}
      </div>
    </div>
  );
}

function PaymentBehaviourChart({ days, terms }: { days: number[]; terms: number }) {
  if (days.length === 0) {
    return <div className="apple-fine">No invoice history yet.</div>;
  }
  const max = Math.max(...days, terms + 10);
  return (
    <div>
      <div className="flex items-end gap-3 relative" style={{ height: 88 }}>
        {/* terms line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed"
          style={{ top: `${88 - Math.round((terms / max) * 80) - 4}px`, borderColor: "#86868B" }}
        />
        {days.map((d, i) => {
          const h = Math.max(2, Math.round((d / max) * 80));
          const over = d > terms;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group relative" style={{ height: 84 }}>
              <div
                className="w-7 rounded-t-[3px]"
                style={{ height: h, background: over ? "#9A2D24" : "#2E844A" }}
              />
              <div className="apple-fine tnum mt-1" style={{ fontSize: 10 }}>{d}d</div>
              <div className="absolute bottom-full mb-1 hidden group-hover:flex">
                <div className="text-[10.5px] font-medium px-2 py-0.5 rounded-[6px] whitespace-nowrap" style={{ background: "#1D1D1F", color: "#fff" }}>
                  Invoice {i + 1} · {d} days
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="apple-fine mt-1">Dashed line = your standard {terms}-day terms</div>
    </div>
  );
}

function AgingBars({ aging, total }: { aging: Customer["aging"]; total: number }) {
  const buckets = [
    { label: "Current",   value: aging.current, color: "#2E844A" },
    { label: "1–30 days", value: aging.d30,     color: "#E0A04A" },
    { label: "31–60",     value: aging.d60,     color: "#9A2D24" },
    { label: "61+",       value: aging.d90,     color: "#5C2117" },
  ];
  return (
    <div className="space-y-1.5">
      {buckets.map(({ label, value, color }) => {
        const pct = total > 0 ? Math.max((value / total) * 100, value > 0 ? 4 : 0) : 0;
        return (
          <div key={label} className="flex items-center gap-3">
            <div className="apple-fine" style={{ width: 80 }}>{label}</div>
            <div className="flex-1 progress-track" style={{ background: "#F0F0F0", height: 8 }}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div className="apple-caption-strong tnum" style={{ width: 80, textAlign: "right" }}>
              £{value.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChannelMix({ data }: { data: Customer["channelMix"] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return <div className="apple-fine">No interactions logged.</div>;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden mb-3" style={{ background: "#F0F0F0" }}>
        {data.map((d) => (
          <div
            key={d.channel}
            title={`${d.channel} · ${d.count}`}
            style={{ width: `${(d.count / total) * 100}%`, background: d.color }}
          />
        ))}
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.channel} className="flex items-center justify-between apple-caption">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              {d.channel}
            </div>
            <div className="apple-caption-strong tnum">{d.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status, days }: { status: CustomerInvoice["status"]; days?: number }) {
  if (status === "paid")    return <span className="pill pill-ok">Paid</span>;
  if (status === "overdue") return <span className="pill pill-bad">{days}d overdue</span>;
  return <span className="pill pill-soft">Pending</span>;
}

function sourceIcon(s: Customer["source"]) {
  if (s === "Website")        return <Globe className="w-3.5 h-3.5" style={{ color: "#0066CC" }} />;
  if (s === "Instagram")      return <Instagram className="w-3.5 h-3.5" style={{ color: "#9A2D24" }} />;
  if (s === "Trade show")     return <Building2 className="w-3.5 h-3.5" style={{ color: "#8A5A12" }} />;
  if (s === "Direct call")    return <Phone className="w-3.5 h-3.5" style={{ color: "#86868B" }} />;
  return <UserPlus className="w-3.5 h-3.5" style={{ color: "#86868B" }} />;
}

/* ───────────────────────────────────────────────────────────── */

export default function CustomersPage() {
  const { company } = useCompany();
  const CUSTOMERS = company.customers;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "trade" | "retail">("all");
  const [selected, setSelected] = useState<Customer>(CUSTOMERS[0]);
  const [detailTab, setDetailTab] = useState<"overview" | "jobs" | "invoices" | "messages">("overview");
  const [quoteOpen, setQuoteOpen] = useState(false);

  const filtered = CUSTOMERS.filter((c) => {
    if (filter !== "all" && c.kind !== filter) return false;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const totalOutstanding = CUSTOMERS.reduce((s, c) => s + parseFloat(c.outstanding.replace(/[^0-9.]/g, "")), 0);
  const ytdSpend = CUSTOMERS.reduce((s, c) => s + c.monthlySpend.reduce((a, b) => a + b, 0), 0);
  const trade = CUSTOMERS.filter((c) => c.kind === "trade").length;
  const retail = CUSTOMERS.filter((c) => c.kind === "retail").length;

  const selOutstanding = parseFloat(selected.outstanding.replace(/[^0-9.]/g, ""));
  const ytdSelected   = selected.monthlySpend.reduce((a, b) => a + b, 0);
  const avgPay        = selected.daysToPay.length > 0
    ? Math.round(selected.daysToPay.reduce((a, b) => a + b, 0) / selected.daysToPay.length) : 0;
  const trendUp       = (() => {
    const recent = selected.daysToPay.slice(-2);
    const earlier = selected.daysToPay.slice(0, -2);
    if (recent.length < 2 || earlier.length === 0) return null;
    const r = recent.reduce((a,b)=>a+b,0)/recent.length;
    const e = earlier.reduce((a,b)=>a+b,0)/earlier.length;
    return r > e + 2;
  })();

  return (
    <>
      <PageHeader title="Customers & trade" subtitle={`${CUSTOMERS.length} accounts · ${trade} trade · ${retail} retail · £${totalOutstanding.toLocaleString()} outstanding`} />

      <div className="flex flex-col md:flex-row md:h-[calc(100vh-60px)]">

        {/* ─────────── LEFT PANE ─────────── */}
        <div className="w-full md:w-[340px] shrink-0 flex flex-col" style={{ borderRight: "1px solid #E0E0E0", background: "#FFFFFF" }}>
          <div className="p-3" style={{ borderBottom: "1px solid #E0E0E0" }}>
            <div className="relative mb-3">
              <Search className="absolute w-3.5 h-3.5" style={{ left: 14, top: 13, color: "#86868B" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers, emails…"
                className="apple-input w-full"
                style={{ paddingLeft: 36 }}
              />
            </div>
            <div className="flex gap-1.5">
              {(["all", "trade", "retail"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`fpill ${filter === f ? "active" : ""}`}>
                  {f === "all" ? "All" : f === "trade" ? "Trade" : "Retail"}
                </button>
              ))}
            </div>
          </div>

          {/* roll-up */}
          <div className="px-3 pt-3 pb-2">
            <div className="apple-card p-3" style={{ background: "#FAFAFC" }}>
              <div className="apple-fine">Year-to-date book of business</div>
              <div className="tnum apple-display mt-0.5" style={{ fontSize: 22 }}>£{ytdSpend.toLocaleString()}</div>
              <div className="apple-fine">£{totalOutstanding.toLocaleString()} currently owed</div>
            </div>
          </div>

          <div className="scroll-y flex-1 max-h-[50vh] md:max-h-none">
            {filtered.map((c) => {
              const out = parseFloat(c.outstanding.replace(/[^0-9.]/g, ""));
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelected(c); setDetailTab("overview"); }}
                  className="w-full text-left flex items-center gap-3 transition-colors"
                  style={{
                    padding: "12px 18px",
                    borderBottom: "1px solid #F0F0F0",
                    background: selected.id === c.id ? "#E8F0FB" : undefined,
                    boxShadow: selected.id === c.id ? "inset 3px 0 0 #0066CC" : undefined,
                  }}
                  onMouseEnter={(e) => { if (selected.id !== c.id) e.currentTarget.style.background = "#FAFAFC"; }}
                  onMouseLeave={(e) => { if (selected.id !== c.id) e.currentTarget.style.background = ""; }}
                >
                  <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center" style={{ background: "#1D1D1F", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                    {c.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="apple-caption-strong truncate">{c.name}</span>
                      {c.kind === "trade" && <span className="pill pill-line">Trade</span>}
                    </div>
                    <div className="apple-fine truncate mt-0.5">
                      {out > 0
                        ? <span style={{ color: "#9A2D24" }}>£{out.toLocaleString()} outstanding</span>
                        : c.lastJob !== "—" ? `Last: ${c.lastJob}` : "New customer"}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: "#86868B" }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────── DETAIL PANE ─────────── */}
        <div className="flex-1 md:overflow-y-auto px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1D1D1F", color: "#fff", fontSize: 15, fontWeight: 700 }}>
                  {selected.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <h2 className="apple-display resp-wrap" style={{ fontSize: 24 }}>{selected.name}</h2>
                    <span className={`pill ${selected.kind === "trade" ? "pill-info" : "pill-soft"}`}>{selected.kind === "trade" ? "Trade account" : "Retail"}</span>
                    <span className="pill pill-soft">{selected.hubspotStage}</span>
                  </div>
                  <div className="apple-fine resp-wrap">{selected.industry} · since {selected.since} · owner {selected.pm}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {sourceIcon(selected.source)}
                <span className="apple-caption">Acquired via {selected.source}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap shrink-0">
              <a href={`mailto:${selected.email}`} className="btn btn-pearl">
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
              <a href={`tel:${selected.phone}`} className="btn btn-pearl">
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <button onClick={() => setQuoteOpen(true)} className="btn btn-primary btn-sm">
                <Plus className="w-3.5 h-3.5" /> New quote
              </button>
            </div>
          </div>

          {/* Headline KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="apple-card p-4">
              <div className="apple-fine">Lifetime spend</div>
              <div className="tnum apple-display mt-1" style={{ fontSize: 22 }}>{selected.totalSpend}</div>
              <div className="apple-fine">£{ytdSelected.toLocaleString()} in last 12m</div>
            </div>
            <div
              className="apple-card p-4"
              style={selOutstanding > 0 ? { background: "#F7E8E5", borderColor: "rgba(154,45,36,0.18)" } : {}}
            >
              <div className="apple-fine">Outstanding</div>
              <div
                className="tnum apple-display mt-1"
                style={{ fontSize: 22, color: selOutstanding > 0 ? "#9A2D24" : "#1D1D1F" }}
              >
                {selected.outstanding}
              </div>
              <div className="apple-fine">{selected.invoices.filter(i => i.status === "overdue").length} overdue · {selected.invoices.filter(i => i.status === "pending").length} pending</div>
            </div>
            <div className="apple-card p-4">
              <div className="apple-fine">Avg days to pay</div>
              <div className="tnum apple-display mt-1 flex items-center gap-1.5" style={{ fontSize: 22 }}>
                {avgPay > 0 ? `${avgPay}d` : "—"}
                {trendUp === true  && <TrendingUp   className="w-4 h-4" style={{ color: "#9A2D24" }} />}
                {trendUp === false && <TrendingDown className="w-4 h-4" style={{ color: "#2E844A" }} />}
              </div>
              <div className="apple-fine">
                {selected.daysToPay.length > 0
                  ? `Across ${selected.daysToPay.length} paid invoices`
                  : "No invoice history yet"}
              </div>
            </div>
            <div className="apple-card p-4">
              <div className="apple-fine">Next interaction</div>
              <div className="apple-caption-strong mt-1">{selected.nextJob ?? "Nothing scheduled"}</div>
              <div className="apple-fine">{selected.lastJob === "—" ? "" : `Last: ${selected.lastJob}`}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5" style={{ background: "#F0F0F0", padding: 4, borderRadius: 9999, width: "fit-content" }}>
            {(["overview", "jobs", "invoices", "messages"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDetailTab(t)}
                className="px-4 apple-caption-strong capitalize transition-colors"
                style={{
                  height: 30,
                  borderRadius: 9999,
                  background: detailTab === t ? "#FFFFFF" : "transparent",
                  color: detailTab === t ? "#1D1D1F" : "#86868B",
                  boxShadow: detailTab === t ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ─────── OVERVIEW ─────── */}
          {detailTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Spend chart */}
              <div className="apple-card p-5 lg:col-span-2">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <div className="apple-caption-strong">Spend over the last 12 months</div>
                    <div className="apple-fine">Sourced from Xero · invoices marked paid</div>
                  </div>
                  <div className="apple-fine">£{ytdSelected.toLocaleString()} total</div>
                </div>
                <MonthlySpendChart data={selected.monthlySpend} />
              </div>

              {/* Channel mix */}
              <div className="apple-card p-5">
                <div className="apple-caption-strong mb-1">Channel mix · 90 days</div>
                <div className="apple-fine mb-3">Via Gmail, HubSpot, Instagram &amp; Voicemail</div>
                <ChannelMix data={selected.channelMix} />
              </div>

              {/* Payment behavior */}
              <div className="apple-card p-5 lg:col-span-2">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <div className="apple-caption-strong">Payment behaviour</div>
                    <div className="apple-fine">Days from issue to paid · last {selected.daysToPay.length} invoices</div>
                  </div>
                  <div className="apple-fine">
                    {trendUp === true  ? <span style={{ color: "#9A2D24" }}>Slowing</span>
                     : trendUp === false ? <span style={{ color: "#2E844A" }}>Improving</span>
                     : "Stable"}
                  </div>
                </div>
                <PaymentBehaviourChart days={selected.daysToPay} terms={selected.kind === "trade" ? 30 : 7} />
              </div>

              {/* AR aging */}
              <div className="apple-card p-5">
                <div className="apple-caption-strong mb-3">AR aging</div>
                <AgingBars aging={selected.aging} total={selOutstanding} />
              </div>

              {/* Contact + account */}
              <div className="apple-card p-5">
                <div className="apple-caption-strong mb-3">Contact</div>
                <div className="space-y-2 apple-caption">
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" style={{ color: "#86868B" }} /><span>{selected.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" style={{ color: "#86868B" }} /><span>{selected.phone}</span></div>
                  <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" style={{ color: "#86868B" }} /><span>{selected.industry}</span></div>
                </div>
              </div>
              <div className="apple-card p-5">
                <div className="apple-caption-strong mb-3">Account terms</div>
                <div className="space-y-2 apple-caption">
                  <div className="flex"><span className="apple-fine w-36 shrink-0">Payment terms</span><span>{selected.kind === "trade" ? "Net 30" : "Pro-forma · upfront"}</span></div>
                  <div className="flex"><span className="apple-fine w-36 shrink-0">Deposit required</span><span>{selected.kind === "trade" ? "30% of order" : "50% of order"}</span></div>
                  <div className="flex"><span className="apple-fine w-36 shrink-0">Pricing</span><span>{selected.kind === "trade" ? "Trade tier 2" : "Retail RRP"}</span></div>
                  <div className="flex"><span className="apple-fine w-36 shrink-0">Credit limit</span><span className="tnum">£{selected.kind === "trade" ? "15,000" : "0"}</span></div>
                </div>
              </div>

              {/* Notes */}
              <div className="apple-card p-5">
                <div className="apple-caption-strong mb-3">Notes &amp; signals</div>
                <ul className="space-y-2">
                  {selected.notes.map((n, i) => (
                    <li key={i} className="apple-caption flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "#0066CC" }} />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connector sources */}
              <div className="apple-card p-5 lg:col-span-3" style={{ background: "#FAFAFC" }}>
                <div className="apple-fine mb-2">Data pulled live from</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="src-chip"><FileText className="w-3 h-3" /> Xero · invoices, payments, aging</span>
                  <span className="src-chip"><UserPlus className="w-3 h-3" /> HubSpot · contacts, deal stage, notes</span>
                  <span className="src-chip"><CreditCard className="w-3 h-3" /> Stripe · card payments, refunds</span>
                  <span className="src-chip"><Mail className="w-3 h-3" /> Gmail · thread history, subjects</span>
                  <span className="src-chip"><Instagram className="w-3 h-3" /> Instagram · DM thread</span>
                  <span className="src-chip"><Phone className="w-3 h-3" /> Aircall · voicemail transcripts</span>
                </div>
              </div>
            </div>
          )}

          {detailTab === "jobs" && (
            <div className="apple-card overflow-hidden">
              {selected.jobs.length === 0 ? (
                <div className="p-8 text-center apple-caption">No jobs yet.</div>
              ) : selected.jobs.map((j, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4"
                  style={{ padding: "14px 18px", borderBottom: i < selected.jobs.length - 1 ? "1px solid #F0F0F0" : "none" }}
                >
                  {j.status === "completed" ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#2E844A" }} />
                    : j.status === "upcoming" ? <Clock className="w-4 h-4 shrink-0" style={{ color: "#0066CC" }} />
                    : <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#86868B" }} />}
                  <div className="flex-1">
                    <div className="apple-caption-strong">{j.type} — {j.detail}</div>
                  </div>
                  <div className="apple-fine">{j.date}</div>
                </div>
              ))}
            </div>
          )}

          {detailTab === "invoices" && (
            <div className="apple-card overflow-hidden">
              {selected.invoices.length === 0 ? (
                <div className="p-8 text-center apple-caption">No invoices yet.</div>
              ) : selected.invoices.map((inv, i) => (
                <div
                  key={inv.number}
                  className="flex items-center gap-4"
                  style={{ padding: "14px 18px", borderBottom: i < selected.invoices.length - 1 ? "1px solid #F0F0F0" : "none" }}
                >
                  <div className="flex-1">
                    <div className="apple-caption-strong">{inv.number}</div>
                    <div className="apple-fine">{inv.date}{inv.daysToPay ? ` · paid in ${inv.daysToPay} days` : ""}</div>
                  </div>
                  <div className="tnum apple-caption-strong" style={{ fontSize: 14 }}>{inv.amount}</div>
                  <StatusBadge status={inv.status} days={inv.daysOverdue} />
                </div>
              ))}
            </div>
          )}

          {detailTab === "messages" && (
            <div className="apple-card overflow-hidden">
              {selected.messages.length === 0 ? (
                <div className="p-8 text-center apple-caption">No messages yet.</div>
              ) : selected.messages.map((m, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4"
                  style={{ padding: "14px 18px", borderBottom: i < selected.messages.length - 1 ? "1px solid #F0F0F0" : "none" }}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" style={{ color: m.direction === "out" ? "#0066CC" : "#86868B" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="apple-caption-strong">{m.subject}</span>
                      <span className="pill pill-soft" style={{ fontSize: 10 }}>{m.channel}</span>
                    </div>
                    <div className="apple-fine mt-0.5 truncate">{m.snippet}</div>
                  </div>
                  <div className="apple-fine shrink-0">{m.date}</div>
                </div>
              ))}
            </div>
          )}

          {/* Joinery tools — site survey + variation orders (feature-gated) */}
          {(company.siteSurvey || (company.variationOrders && company.variationOrders.length > 0)) && (
            <div className="mt-8 space-y-6">
              {company.siteSurvey && <SiteSurveyPanel data={company.siteSurvey} />}
              {company.variationOrders && company.variationOrders.length > 0 && (
                <VariationOrdersPanel orders={company.variationOrders} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─────── New quote modal ─────── */}
      <NewQuoteModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        customer={selected}
        templates={company.quoteTemplates}
        patternQuoting={company.patternQuoting}
      />
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   New quote — opens pre-filled for the selected customer,
   editable lines, totals, send via Xero.
   ──────────────────────────────────────────────────────────── */

function NewQuoteModal({
  open, onClose, customer, templates, patternQuoting,
}: {
  open: boolean;
  onClose: () => void;
  customer: Customer;
  templates: QuoteTemplate[];
  patternQuoting?: PatternQuotingData;
}) {
  const TEMPLATES = templates;
  const [templateIdx, setTemplateIdx] = useState<number>(0);
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [siteAddress, setSiteAddress] = useState("");
  const [validDays, setValidDays] = useState(30);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [stage, setStage] = useState<"build" | "preview">("build");
  const [patternIdx, setPatternIdx] = useState(0);
  const [addedPrep, setAddedPrep] = useState<Set<string>>(new Set());

  // Reset whenever the modal opens for a new customer
  useEffect(() => {
    if (open) {
      const tpl = TEMPLATES[0];
      setTemplateIdx(0);
      setLines(tpl.lines.map((l) => ({ ...l })));
      setNotes(tpl.notes);
      setDiscount(0);
      setSiteAddress(customer.industry.replace(/^[^·]*·\s*/, ""));
      setValidDays(30);
      setSent(false);
      setStage("build");
      setPatternIdx(0);
      setAddedPrep(new Set());
    }
  }, [open, customer]);

  function togglePrep(label: string, price: string) {
    const id = `prep-${label}`;
    if (addedPrep.has(label)) {
      setAddedPrep((prev) => { const s = new Set(prev); s.delete(label); return s; });
      setLines((prev) => prev.filter((l) => l.id !== id));
    } else {
      setAddedPrep((prev) => new Set([...prev, label]));
      const unitPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
      setLines((prev) => [...prev, { id, desc: label, qty: 1, unit: "job", unitPrice }]);
    }
  }

  function loadTemplate(i: number) {
    setTemplateIdx(i);
    const tpl = TEMPLATES[i];
    setLines(tpl.lines.map((l) => ({ ...l })));
    setNotes(tpl.notes);
  }

  function updateLine(id: string, patch: Partial<QuoteLine>) {
    setLines((prev) => prev.map((l) => l.id === id ? { ...l, ...patch } : l));
  }
  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }
  function addLine() {
    setLines((prev) => [
      ...prev,
      { id: `nq-${Date.now()}`, desc: "New item", qty: 1, unit: "each", unitPrice: 0 },
    ]);
  }

  const isTrade   = customer.kind === "trade";
  const tradeDisc = isTrade ? 0.15 : 0;
  const subtotalRaw = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const tradeSavings = subtotalRaw * tradeDisc;
  const subtotal     = subtotalRaw - tradeSavings - discount;
  const vat          = subtotal * 0.20;
  const total        = subtotal + vat;
  const deposit      = total * (isTrade ? 0.30 : 0.50);

  function send() {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1300);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        sent ? "Quote sent" :
        stage === "preview" ? `Review · QU draft for ${customer.name}` :
        `New quote · ${customer.name}`
      }
      width="820px"
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="apple-tagline">Quote sent</div>
          <div className="apple-caption text-center">
            QU-2148 · £{total.toFixed(2)} · emailed to <strong>{customer.email}</strong><br />
            Logged on the {customer.name} record · HubSpot deal updated to <em>Proposal sent</em>
          </div>
        </div>
      ) : stage === "preview" ? (
        <div className="space-y-4">
          {/* Email-ready preview */}
          <div className="apple-card p-4 grid" style={{ gridTemplateColumns: "80px 1fr", rowGap: 4 }}>
            <div className="apple-fine">To</div>
            <div className="apple-caption">{customer.name} &lt;{customer.email}&gt;</div>
            <div className="apple-fine">Subject</div>
            <div className="apple-caption-strong">Quote QU-2148 · {TEMPLATES[templateIdx].label}</div>
            <div className="apple-fine">Site</div>
            <div className="apple-caption">{siteAddress || "—"}</div>
          </div>

          <div className="apple-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="apple-tagline" style={{ fontSize: 18 }}>QU-2148</div>
              <span className="pill pill-soft">draft · {TEMPLATES[templateIdx].tag}</span>
            </div>

            <div className="overflow-x-auto" style={{ borderRadius: 12, border: "1px solid #E0E0E0" }}>
              <div className="min-w-[520px]">
              <div
                className="grid apple-fine"
                style={{ gridTemplateColumns: "2.4fr 60px 70px 90px 90px", background: "#F5F5F7", padding: "8px 12px", borderBottom: "1px solid #E0E0E0" }}
              >
                <div>Description</div>
                <div className="text-right">Qty</div>
                <div>Unit</div>
                <div className="text-right">Unit £</div>
                <div className="text-right">Line £</div>
              </div>
              {lines.map((l, i) => (
                <div
                  key={l.id}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: "2.4fr 60px 70px 90px 90px",
                    padding: "10px 12px",
                    borderBottom: i < lines.length - 1 ? "1px solid #F0F0F0" : "none",
                  }}
                >
                  <div className="apple-caption">{l.desc}</div>
                  <div className="apple-caption tnum text-right">{l.qty}</div>
                  <div className="apple-fine">{l.unit}</div>
                  <div className="apple-caption tnum text-right">£{l.unitPrice.toFixed(2)}</div>
                  <div className="apple-caption-strong tnum text-right">£{(l.qty * l.unitPrice).toFixed(2)}</div>
                </div>
              ))}
              </div>
            </div>

            <div className="mt-4 ml-auto" style={{ maxWidth: 320 }}>
              <div className="flex justify-between apple-caption py-1"><span className="apple-fine">Subtotal</span><span className="tnum">£{subtotalRaw.toFixed(2)}</span></div>
              {tradeSavings > 0 && (
                <div className="flex justify-between apple-caption py-1"><span className="apple-fine">Trade discount (15%)</span><span className="tnum" style={{ color: "#2E844A" }}>−£{tradeSavings.toFixed(2)}</span></div>
              )}
              {discount > 0 && (
                <div className="flex justify-between apple-caption py-1"><span className="apple-fine">Goodwill discount</span><span className="tnum" style={{ color: "#2E844A" }}>−£{discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between apple-caption py-1"><span className="apple-fine">Net</span><span className="tnum">£{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between apple-caption py-1"><span className="apple-fine">VAT 20%</span><span className="tnum">£{vat.toFixed(2)}</span></div>
              <div className="flex justify-between apple-tagline py-1 mt-1" style={{ borderTop: "1px solid #E0E0E0", paddingTop: 8, fontSize: 18 }}>
                <span>Total inc VAT</span>
                <span className="tnum">£{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between apple-fine py-1">
                <span>Deposit on order ({isTrade ? "30%" : "50%"})</span>
                <span className="tnum">£{deposit.toFixed(2)}</span>
              </div>
            </div>

            <div className="apple-card p-3 mt-4" style={{ background: "#FAFAFC" }}>
              <div className="apple-fine mb-1">Notes shown on quote</div>
              <div className="apple-caption whitespace-pre-wrap">{notes}</div>
            </div>

            <div className="apple-fine mt-3">Valid for {validDays} days · prices inc 20% VAT</div>
          </div>

          <div className="apple-card p-3 flex items-start gap-3" style={{ background: "#E8F0FB", borderColor: "rgba(0,102,204,0.18)" }}>
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#0066CC" }} />
            <div className="apple-caption" style={{ color: "#0066CC" }}>
              On send · creates QU-2148 in Xero, posts a HubSpot note, attaches the PDF, and emails {customer.email}.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Customer band */}
          <div className="apple-card p-3 flex items-center gap-3" style={{ background: "#FAFAFC" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1D1D1F", color: "#fff", fontSize: 12, fontWeight: 600 }}>
              {customer.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="apple-caption-strong truncate">{customer.name}</div>
              <div className="apple-fine truncate">{customer.email} · {customer.kind === "trade" ? "Trade tier 2 · net 30" : "Retail · pro-forma"}</div>
            </div>
            <span className="pill pill-info">QU-2148</span>
          </div>

          {/* Templates */}
          <div>
            <div className="apple-fine mb-2">Start from a template</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TEMPLATES.map((tpl, i) => {
                const picked = i === templateIdx;
                return (
                  <button
                    key={tpl.label}
                    onClick={() => loadTemplate(i)}
                    className="text-left p-3 rounded-[12px] transition-colors"
                    style={{
                      border: "1px solid " + (picked ? "#0066CC" : "#E0E0E0"),
                      background: picked ? "#E8F0FB" : "#FFFFFF",
                      boxShadow: picked ? "0 0 0 3px rgba(0,102,204,0.12)" : "none",
                    }}
                  >
                    <span className="pill pill-soft mb-2" style={{ display: "inline-flex" }}>{tpl.tag}</span>
                    <div className="apple-caption-strong">{tpl.label}</div>
                    <div className="apple-fine mt-0.5">{tpl.lines.length} lines</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pattern & prep helper (Northgate) */}
          {patternQuoting && (
            <div className="apple-card p-4" style={{ background: "#E8F0FB", borderColor: "rgba(0,102,204,0.18)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" style={{ color: "#0066CC" }} />
                <span className="apple-caption-strong" style={{ color: "#0a3d6e" }}>Pattern &amp; prep helper</span>
              </div>
              <div className="apple-fine mb-3" style={{ color: "#0a3d6e" }}>{patternQuoting.intro}</div>

              <div className="apple-fine mb-1.5">Lay pattern · sets wastage allowance</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {patternQuoting.patterns.map((p, i) => {
                  const picked = i === patternIdx;
                  return (
                    <button
                      key={p.name}
                      onClick={() => setPatternIdx(i)}
                      className="text-left p-2.5 rounded-[10px] transition-colors"
                      style={{
                        border: "1px solid " + (picked ? "#0066CC" : "#dbe6f3"),
                        background: picked ? "#FFFFFF" : "transparent",
                        boxShadow: picked ? "0 0 0 3px rgba(0,102,204,0.12)" : "none",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="apple-caption-strong">{p.name}</span>
                        <span className="pill pill-info" style={{ height: 18 }}>{p.wastagePct}% waste</span>
                      </div>
                      <div className="apple-fine mt-0.5">{p.cutTime} · {p.note}</div>
                    </button>
                  );
                })}
              </div>

              <div className="apple-fine mb-1.5">Prep lines a verbal quote forgets · tap to add</div>
              <div className="flex flex-wrap gap-2">
                {patternQuoting.prepLines.map((pl) => {
                  const on = addedPrep.has(pl.label);
                  return (
                    <button
                      key={pl.label}
                      onClick={() => togglePrep(pl.label, pl.price)}
                      className="px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                      style={{
                        border: "1px solid " + (on ? "#2E844A" : "#dbe6f3"),
                        background: on ? "#E6F2EB" : "#FFFFFF",
                        fontSize: 12,
                      }}
                    >
                      {on ? <Check className="w-3 h-3" style={{ color: "#2E844A" }} /> : <Plus className="w-3 h-3" style={{ color: "#0066CC" }} />}
                      <span style={{ color: "#191C21" }}>{pl.label}</span>
                      <span className="tnum apple-fine">{pl.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Site + validity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="apple-fine mb-1">Site / location</div>
              <input
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                className="apple-input w-full"
                placeholder="e.g. Headingley, LS6"
              />
            </div>
            <div>
              <div className="apple-fine mb-1">Quote valid for</div>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={1} max={90}
                  value={validDays}
                  onChange={(e) => setValidDays(parseInt(e.target.value, 10) || 30)}
                  className="apple-input tnum"
                  style={{ width: 90, paddingLeft: 14, paddingRight: 8 }}
                />
                <span className="apple-caption">days</span>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="apple-card overflow-x-auto">
            <div className="min-w-[560px]">
            <div
              className="grid items-center px-4 py-2.5 apple-fine"
              style={{ gridTemplateColumns: "2.4fr 60px 80px 90px 90px 36px", background: "#F5F5F7", borderBottom: "1px solid #E0E0E0" }}
            >
              <div>Description</div>
              <div className="text-right">Qty</div>
              <div>Unit</div>
              <div className="text-right">Unit £</div>
              <div className="text-right">Line £</div>
              <div></div>
            </div>
            {lines.map((l, i) => (
              <div
                key={l.id}
                className="grid items-center px-3 py-2"
                style={{
                  gridTemplateColumns: "2.4fr 60px 80px 90px 90px 36px",
                  borderBottom: i < lines.length - 1 ? "1px solid #F0F0F0" : "none",
                }}
              >
                <input
                  value={l.desc}
                  onChange={(e) => updateLine(l.id, { desc: e.target.value })}
                  className="apple-input"
                  style={{ height: 30, padding: "0 10px", border: "1px solid transparent", background: "transparent", fontSize: 13 }}
                />
                <input
                  type="number" min={0}
                  value={l.qty}
                  onChange={(e) => updateLine(l.id, { qty: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  className="apple-input tnum text-right"
                  style={{ height: 30, padding: "0 10px", width: 56, fontSize: 13 }}
                />
                <input
                  value={l.unit}
                  onChange={(e) => updateLine(l.id, { unit: e.target.value })}
                  className="apple-input"
                  style={{ height: 30, padding: "0 10px", width: 74, fontSize: 13 }}
                />
                <input
                  type="number" step="0.01" min={0}
                  value={l.unitPrice}
                  onChange={(e) => updateLine(l.id, { unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="apple-input tnum text-right"
                  style={{ height: 30, padding: "0 10px", width: 84, fontSize: 13 }}
                />
                <div className="tnum apple-caption-strong text-right">£{(l.qty * l.unitPrice).toFixed(2)}</div>
                <button
                  onClick={() => removeLine(l.id)}
                  className="text-[#9A2D24] hover:opacity-70 transition-opacity flex items-center justify-center"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            </div>
          </div>

          <button onClick={addLine} className="btn btn-pearl">
            <Plus className="w-3.5 h-3.5" /> Add line
          </button>

          {/* Notes */}
          <div>
            <div className="apple-fine mb-1">Notes shown on the quote</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="apple-input-rect"
            />
          </div>

          {/* Totals */}
          <div className="apple-card p-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <div className="apple-fine">Goodwill discount £</div>
                <input
                  type="number" min={0} step="1"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="apple-input tnum mt-1"
                  style={{ height: 32, padding: "0 10px", width: "100%", fontSize: 13 }}
                />
              </div>
              <div>
                <div className="apple-fine">Subtotal</div>
                <div className="tnum apple-caption-strong mt-1">£{subtotalRaw.toFixed(2)}</div>
                {tradeSavings > 0 && (
                  <div className="apple-fine" style={{ color: "#2E844A" }}>−£{tradeSavings.toFixed(2)} trade</div>
                )}
              </div>
              <div>
                <div className="apple-fine">Net</div>
                <div className="tnum apple-caption-strong mt-1">£{subtotal.toFixed(2)}</div>
              </div>
              <div>
                <div className="apple-fine">VAT 20%</div>
                <div className="tnum apple-caption-strong mt-1">£{vat.toFixed(2)}</div>
              </div>
              <div>
                <div className="apple-fine">Total inc VAT</div>
                <div className="tnum apple-tagline mt-1" style={{ fontSize: 19 }}>£{total.toFixed(2)}</div>
                <div className="apple-fine">Deposit £{deposit.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalActions>
        {sent ? (
          <button onClick={onClose} className="btn btn-primary btn-sm">Done</button>
        ) : stage === "preview" ? (
          <>
            <button onClick={() => setStage("build")} className="btn btn-ghost btn-sm">Back to edit</button>
            <button
              onClick={send}
              disabled={sending}
              className="btn btn-primary btn-sm"
            >
              {sending
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</>
                : <><Send className="w-3.5 h-3.5" /> Send quote to {customer.name.split(" ")[0]}</>}
            </button>
          </>
        ) : (
          <>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
            <button
              onClick={() => setStage("preview")}
              disabled={lines.length === 0}
              className="btn btn-primary btn-sm"
            >
              Review &amp; send <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </ModalActions>
    </Modal>
  );
}

/* ────────────────────────────────────────────────────────────
   Joinery — site-survey checklist + variation-order workflow
   ──────────────────────────────────────────────────────────── */

function SiteSurveyPanel({ data }: { data: SiteSurveyData }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <ClipboardCheck className="w-4 h-4" style={{ color: "#0066CC" }} />
        <h3 className="section-title">Site-survey checklist</h3>
      </div>
      <p className="apple-fine mb-3" style={{ maxWidth: 760 }}>{data.intro}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {data.checklist.map((sec) => (
          <div key={sec.section} className="apple-card p-4">
            <div className="apple-caption-strong mb-2 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5" style={{ color: "#86868B" }} /> {sec.section}
            </div>
            <ul className="space-y-1.5">
              {sec.items.map((it) => (
                <li key={it} className="apple-caption flex items-start gap-2">
                  <span className="w-3.5 h-3.5 rounded-[4px] mt-0.5 shrink-0" style={{ border: "1.5px solid #C7CDD4" }} />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="apple-card resp-table">
        <div className="min-w-[560px] resp-min">
        <div className="px-4 py-2.5 apple-fine" style={{ background: "#F5F5F7", borderBottom: "1px solid #E0E0E0", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>
          Recent surveys
        </div>
        {data.recent.map((r, i) => (
          <div
            key={r.customer}
            className="grid items-center resp-row"
            style={{
              gridTemplateColumns: "1.2fr 0.8fr 2fr 0.9fr",
              padding: "12px 16px",
              borderBottom: i < data.recent.length - 1 ? "1px solid #F0F0F0" : "none",
            }}
          >
            <div className="apple-caption-strong resp-wrap">{r.customer}</div>
            <div className="apple-fine">{r.date}</div>
            <div className="apple-fine flex items-center gap-1.5">
              <Camera className="w-3 h-3" /> {r.photos} photos · {r.dims}
            </div>
            <div className="flex justify-end resp-actions">
              {r.status === "captured"
                ? <span className="pill pill-ok"><Check className="w-3 h-3" /> Captured</span>
                : <span className="pill pill-warn">Today</span>}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

function VariationOrdersPanel({ orders }: { orders: VariationOrder[] }) {
  const [decided, setDecided] = useState<Record<string, "approved" | "declined">>({});
  const proposedCount = orders.filter((o) => o.status === "proposed" && !decided[o.id]).length;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <FilePlus className="w-4 h-4" style={{ color: "#0066CC" }} />
        <h3 className="section-title">Variation orders</h3>
        {proposedCount > 0 && <span className="pill pill-warn ml-1">{proposedCount} awaiting customer</span>}
      </div>
      <p className="apple-fine mb-3" style={{ maxWidth: 760 }}>
        Anything the survey or build turns up becomes a priced variation — sent to the customer, tracked to a yes or no, never absorbed for free.
      </p>

      <div className="apple-card resp-table">
        <div className="min-w-[640px] resp-min">
        {orders.map((o, i) => {
          const status = decided[o.id] ?? o.status;
          return (
            <div
              key={o.id}
              className="grid items-center resp-row"
              style={{
                gridTemplateColumns: "0.7fr 1.5fr 1.8fr 0.8fr 1.1fr",
                padding: "13px 16px",
                borderBottom: i < orders.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <div className="apple-caption-strong tnum">{o.id}</div>
              <div>
                <div className="apple-caption-strong resp-wrap">{o.job}</div>
                <div className="apple-fine resp-wrap">{o.customer} · raised {o.raised}</div>
              </div>
              <div className="apple-fine resp-wrap">{o.desc}</div>
              <div className="apple-caption-strong tnum">{o.amount}</div>
              <div className="flex justify-end resp-actions">
                {status === "approved" ? (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> Approved</span>
                ) : status === "declined" ? (
                  <span className="pill pill-bad">Declined</span>
                ) : (
                  <div className="flex gap-1.5">
                    <button onClick={() => setDecided((p) => ({ ...p, [o.id]: "declined" }))} className="btn btn-ghost btn-sm" style={{ color: "#9A2D24" }}>Decline</button>
                    <button onClick={() => setDecided((p) => ({ ...p, [o.id]: "approved" }))} className="btn btn-secondary btn-sm">Mark approved</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
