"use client";

import { useState } from "react";
import {
  Download, Check, RefreshCw, AlertTriangle, Flame, FileCheck,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { Modal, ModalActions } from "@/lib/ui/modal";
import { useCompany } from "@/lib/mock/company-context";
import type { ComplianceDetail, ComplianceDetailRow } from "@/lib/mock/companies/types";

const HERO_KEY = "__hero__";

export default function CompliancePage() {
  const { company } = useCompany();
  const c = company.compliance;

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());

  function open(key: string) { setOpenKey(key); setLoading(false); }
  function close() { setOpenKey(null); setLoading(false); }
  function complete(key: string) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone((prev) => new Set([...prev, key]));
    }, 1400);
  }
  const isDone = (key: string) => done.has(key);

  function mockExportGDPR() {
    const rows = ["connector,granted_by,scopes,last_used,status"];
    c.connectors.forEach((cn) => rows.push([cn.name, cn.by, `"${cn.scopes}"`, cn.last, cn.status].join(",")));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = c.csvName;
    a.click();
    URL.revokeObjectURL(url);
  }

  // The hero rendered as a generic detail too.
  const heroDetail: ComplianceDetail = {
    intro: c.hero.body,
    rows: c.hero.rows,
    confirmLabel: c.hero.confirmLabel,
    successTitle: c.hero.successTitle,
    successSub: c.hero.successSub,
  };

  const activeDeadline = c.deadlines.find((d) => d.key === openKey);
  const activeDetail: ComplianceDetail | undefined =
    openKey === HERO_KEY ? heroDetail : activeDeadline?.detail;
  const activeTitle =
    openKey === HERO_KEY ? c.hero.title : activeDeadline?.title ?? "";

  return (
    <>
      <PageHeader title="Compliance" subtitle={c.subtitle} />

      <div className="px-4 sm:px-8 py-7 max-w-[1120px] mx-auto">
        <div className="mb-7">
          <p className="body-text">{c.intro}</p>
        </div>

        {/* HERO — most urgent, with progress bar */}
        <div className="v3-card mb-3 overflow-hidden" style={{ borderColor: "#cfe0d9" }}>
          <div className="grid" style={{ gridTemplateColumns: "5px 1fr" }}>
            <div style={{ background: "#0066CC" }} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="pill pill-warn">{c.hero.pillLabel}</span>
                    <span className="pill pill-ai">
                      <Flame className="w-3 h-3" /> {c.hero.urgentLabel}
                    </span>
                  </div>
                  <div className="page-title" style={{ fontSize: 19 }}>{c.hero.title}</div>
                  <div className="body-text mt-1">{c.hero.body}</div>
                  <div className="mt-4" style={{ maxWidth: 520 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="muted-text" style={{ fontWeight: 600, color: "#3B414B" }}>{c.hero.pctLabel}</span>
                      <span className="faint-text">{c.hero.pctNote}</span>
                    </div>
                    <div className="progress-track"><span className="progress-fill" style={{ width: `${c.hero.pct}%` }} /></div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {isDone(HERO_KEY) ? (
                    <span className="pill pill-ok"><Check className="w-3 h-3" /> Filed</span>
                  ) : (
                    <button onClick={() => open(HERO_KEY)} className="btn btn-accent btn-sm">
                      <FileCheck className="w-3.5 h-3.5" /> {c.hero.confirmLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-3 px-1 flex-wrap">
          {c.legend.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 faint-text">
              <span className="dot" style={{ background: l.color }} /> {l.label}
            </span>
          ))}
          <span className="faint-text ml-auto">Sorted by what&apos;s due next</span>
        </div>

        {/* Ordered list of the rest */}
        <div className="v3-card mb-9 overflow-x-auto">
          <div className="min-w-[640px]">
          {c.deadlines.map((d, i) => {
            const completed = isDone(d.key);
            return (
              <div
                key={d.key}
                className="grid items-center"
                style={{
                  gridTemplateColumns: "14px 1.6fr 1.5fr 130px 160px",
                  padding: "12px 15px",
                  fontSize: 13,
                  borderBottom: i < c.deadlines.length - 1 ? "1px solid #EEEDE7" : "none",
                }}
              >
                <div><span className="dot" style={{ background: d.dot }} /></div>
                <div>
                  <div style={{ fontWeight: 600, color: "#191C21" }}>{d.title}</div>
                  <div className="muted-text">{d.desc}</div>
                </div>
                <div className="muted-text">{d.progress}</div>
                <div>
                  <span className={`pill ${d.pillCls}`}>{d.pillTxt}</span>
                  <div className="faint-text mt-0.5">{d.when}</div>
                </div>
                <div className="flex justify-end">
                  {completed ? (
                    <span className="pill pill-ok"><Check className="w-3 h-3" /> Done</span>
                  ) : (
                    <button
                      onClick={() => open(d.key)}
                      className={`btn btn-sm ${d.actionType === "ghost" ? "btn-ghost" : "btn-secondary"}`}
                    >
                      {d.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* RoPA / connectors */}
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="section-title">Connected systems · data access</h3>
          <button onClick={mockExportGDPR} className="btn btn-secondary btn-sm">
            <Download className="w-3.5 h-3.5" /> Export GDPR audit pack
          </button>
        </div>
        <div className="v3-card mb-9 overflow-x-auto">
          <div className="min-w-[720px]">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1.3fr 1.1fr 1.5fr 0.9fr 0.8fr",
              padding: "10px 15px",
              background: "#FAFAF7",
              borderBottom: "1px solid #EEEDE7",
              fontSize: 10.5,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              color: "#9A9DA4",
              fontWeight: 600,
            }}
          >
            <div>Connector</div><div>Granted by</div><div>Scopes</div><div>Last used</div><div className="text-right">Status</div>
          </div>
          {c.connectors.map((cn, i) => (
            <div
              key={cn.name}
              className="grid items-center"
              style={{
                gridTemplateColumns: "1.3fr 1.1fr 1.5fr 0.9fr 0.8fr",
                padding: "12px 15px",
                fontSize: 13,
                borderBottom: i < c.connectors.length - 1 ? "1px solid #EEEDE7" : "none",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: cn.iconBg, color: cn.iconFg, fontSize: 10, fontWeight: 700 }}>
                  {cn.initials}
                </div>
                <span style={{ fontWeight: 500 }}>{cn.name}</span>
              </div>
              <div>{cn.by}</div>
              <div className="muted-text">{cn.scopes}</div>
              <div className="muted-text">{cn.last}</div>
              <div className="flex justify-end"><span className={`pill ${cn.statusCls}`}>{cn.status}</span></div>
            </div>
          ))}
          </div>
        </div>

        {/* Audit log */}
        <h3 className="section-title mb-3">Audit log · last 24 hours</h3>
        <div className="v3-card overflow-x-auto">
          <div className="min-w-[640px]">
          {c.audit.map((row, i) => (
            <div
              key={i}
              className="grid items-center"
              style={{
                gridTemplateColumns: "120px 1fr 170px 90px",
                padding: "12px 15px",
                fontSize: 13,
                borderBottom: i < c.audit.length - 1 ? "1px solid #EEEDE7" : "none",
              }}
            >
              <div className="muted-text tnum">{row.time}</div>
              <div style={{ color: "#191C21" }}>
                <span style={{ fontWeight: 500 }}>{row.event}</span> {row.detail}
                {row.ref && <span className="muted-text tnum ml-1">{row.ref}</span>}
              </div>
              <div className="muted-text">{row.actor}</div>
              <div className="flex justify-end"><span className={`pill ${row.pillCls}`}>{row.pillTxt}</span></div>
            </div>
          ))}
          </div>
        </div>
        <p className="faint-text mt-3">
          Every signed action is hash-chained and exportable. If a record is altered, the chain breaks.
        </p>
      </div>

      {/* Generic detail modal */}
      <Modal open={openKey != null} onClose={close} title={activeTitle} width="640px">
        {activeDetail && (
          isDone(openKey ?? "") ? (
            <SuccessPane title={activeDetail.successTitle} sub={activeDetail.successSub} />
          ) : (
            <div className="space-y-4">
              {activeDetail.intro && <div className="muted-text">{activeDetail.intro}</div>}
              {openKey === HERO_KEY && (
                <ReadinessBar pct={c.hero.pct} label={c.hero.pctLabel} />
              )}
              {activeDetail.rows && activeDetail.rows.length > 0 && (
                <div className="space-y-2">
                  {activeDetail.rows.map((r: ComplianceDetailRow) => (
                    <div key={r.label} className="flex items-center justify-between p-3 rounded-[8px]" style={{ border: "1px solid #E7E5DE" }}>
                      <div className="flex items-center gap-2">
                        {r.ok === false
                          ? <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#8A5A12" }} />
                          : r.ok === true
                            ? <Check className="w-3.5 h-3.5" style={{ color: "#2E844A" }} />
                            : null}
                        <span style={{ fontSize: 13.5, color: "#191C21" }}>{r.label}</span>
                      </div>
                      <span className="tnum" style={{ fontSize: 13.5, fontWeight: 600, color: r.ok === false ? "#8A5A12" : "#191C21" }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeDetail.note && (
                <div className="rounded-[8px] p-4 muted-text" style={{ background: "#FAFAF7", border: "1px solid #E7E5DE", lineHeight: 1.5 }}>
                  {activeDetail.note}
                </div>
              )}
            </div>
          )
        )}
        <ModalActions>
          <button onClick={close} className="btn btn-ghost btn-sm">Close</button>
          {activeDetail && !isDone(openKey ?? "") && (
            <button onClick={() => complete(openKey!)} disabled={loading} className="btn btn-accent btn-sm">
              {loading ? <Spinner /> : activeDetail.confirmLabel}
            </button>
          )}
        </ModalActions>
      </Modal>
    </>
  );
}

/* ── Shared sub-components ── */

function Spinner() {
  return <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing…</>;
}

function SuccessPane({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="w-10 h-10 rounded-[8px] flex items-center justify-center" style={{ background: "#2E844A" }}>
        <Check className="w-5 h-5 text-white" />
      </div>
      <div className="h3" style={{ color: "#2E844A" }}>{title}</div>
      <div className="muted-text text-center">{sub}</div>
    </div>
  );
}

function ReadinessBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between muted-text">
        <span>{label}</span>
        <span style={{ fontWeight: 600, color: "#191C21" }}>{pct}%</span>
      </div>
      <div className="progress-track"><span className="progress-fill" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
