"use client";

import { useState } from "react";
import { Award, Check, RefreshCw, Send, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { useCompany } from "@/lib/mock/company-context";
import type { CompetencyEngineer, EicrJob } from "@/lib/mock/companies/types";

type QualStatus = CompetencyEngineer["quals"][number]["status"];

const STAGE_PILL: Record<EicrJob["stage"], string> = {
  "90-day": "pill-soft",
  "60-day": "pill-soft",
  "30-day": "pill-warn",
  "overdue": "pill-bad",
  "booked": "pill-ok",
};

function qualCell(status: QualStatus, expires: string) {
  if (status === "valid") {
    return (
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "#2E844A" }} />
        <span className="apple-fine">{expires}</span>
      </div>
    );
  }
  if (status === "expiring") {
    return (
      <div className="flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" style={{ color: "#8A5A12" }} />
        <span className="apple-fine" style={{ color: "#8A5A12", fontWeight: 600 }}>{expires}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <ShieldX className="w-3.5 h-3.5 shrink-0" style={{ color: "#9A2D24" }} />
      <span className="apple-fine" style={{ color: "#9A2D24" }}>{expires}</span>
    </div>
  );
}

export default function CompetencyPage() {
  const { company } = useCompany();
  const data = company.competency;

  const [renewing, setRenewing] = useState<Set<string>>(new Set());
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchDone, setBatchDone] = useState(false);

  if (!data) {
    return (
      <>
        <PageHeader title="Competency" subtitle={company.name} />
        <div className="px-8 py-7 max-w-[1120px] mx-auto">
          <div className="apple-card p-10 text-center">
            <Award className="w-8 h-8 mx-auto mb-3" style={{ color: "#86868B" }} />
            <div className="apple-tagline">Not enabled for {company.name}</div>
            <p className="apple-fine mt-1">The competency matrix is tailored to electrical contractors.</p>
          </div>
        </div>
      </>
    );
  }

  const expiringCount = data.engineers.flatMap((e) => e.quals).filter((q) => q.status !== "valid").length;
  const dueEicr = data.eicrJobs.filter((j) => j.stage === "30-day" || j.stage === "overdue");

  function batchEicr() {
    setBatchLoading(true);
    setTimeout(() => {
      setBatchLoading(false);
      setBatchDone(true);
      setRenewing(new Set(data!.eicrJobs.map((j) => j.property)));
    }, 1400);
  }

  return (
    <>
      <PageHeader title="Competency & renewals" subtitle={`${data.engineers.length} engineers · ${expiringCount} qualifications need attention`} />

      <div className="px-8 py-7 max-w-[1180px] mx-auto">
        <div className="mb-7">
          <p className="apple-lead" style={{ color: "#333333" }}>{data.intro}</p>
        </div>

        {/* Competency matrix */}
        <h3 className="section-title mb-3">Competency matrix</h3>
        <div className="apple-card overflow-hidden mb-9">
          <div
            className="grid items-center apple-fine"
            style={{
              gridTemplateColumns: `1.4fr repeat(${data.certColumns.length}, 1fr)`,
              padding: "10px 16px",
              background: "#F5F5F7",
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <div>Engineer</div>
            {data.certColumns.map((c) => <div key={c}>{c}</div>)}
          </div>
          {data.engineers.map((eng, i) => (
            <div
              key={eng.name}
              className="grid items-center"
              style={{
                gridTemplateColumns: `1.4fr repeat(${data.certColumns.length}, 1fr)`,
                padding: "13px 16px",
                borderBottom: i < data.engineers.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <div>
                <div className="apple-caption-strong">{eng.name}</div>
                <div className="apple-fine">{eng.role}</div>
              </div>
              {data.certColumns.map((col) => {
                const q = eng.quals.find((x) => x.name === col);
                return <div key={col}>{q ? qualCell(q.status, q.expires) : <span className="apple-fine">—</span>}</div>;
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-9 px-1 flex-wrap apple-fine">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" style={{ color: "#2E844A" }} /> Valid</span>
          <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" style={{ color: "#8A5A12" }} /> Expiring soon</span>
          <span className="flex items-center gap-1.5"><ShieldX className="w-3.5 h-3.5" style={{ color: "#9A2D24" }} /> Expired / not held</span>
        </div>

        {/* EICR pipeline */}
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="section-title">EICR renewal pipeline</h3>
          {dueEicr.length > 0 && (
            batchDone ? (
              <span className="pill pill-ok"><Check className="w-3 h-3" /> Renewals queued</span>
            ) : (
              <button onClick={batchEicr} disabled={batchLoading} className="btn btn-primary btn-sm">
                {batchLoading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</> : <><Send className="w-3.5 h-3.5" /> Nudge all due ({dueEicr.length})</>}
              </button>
            )
          )}
        </div>
        <p className="apple-fine mb-3">{data.eicrIntro}</p>

        <div className="apple-card overflow-hidden">
          <div
            className="grid items-center apple-fine"
            style={{ gridTemplateColumns: "1.6fr 1.2fr 1fr 0.9fr 1fr", padding: "10px 16px", background: "#F5F5F7", borderBottom: "1px solid #E0E0E0" }}
          >
            <div>Property</div><div>Landlord</div><div>Expires</div><div>Stage</div><div className="text-right">Action</div>
          </div>
          {data.eicrJobs.map((j, i) => {
            const done = renewing.has(j.property);
            return (
              <div
                key={j.property}
                className="grid items-center"
                style={{
                  gridTemplateColumns: "1.6fr 1.2fr 1fr 0.9fr 1fr",
                  padding: "13px 16px",
                  fontSize: 13,
                  borderBottom: i < data.eicrJobs.length - 1 ? "1px solid #F0F0F0" : "none",
                }}
              >
                <div className="apple-caption-strong">{j.property}</div>
                <div className="apple-caption">{j.landlord}</div>
                <div>
                  <div className="apple-caption">{j.expires}</div>
                  <div className="apple-fine">{j.daysOut < 0 ? `${Math.abs(j.daysOut)}d overdue` : `in ${j.daysOut}d`}</div>
                </div>
                <div><span className={`pill ${STAGE_PILL[j.stage]}`}>{j.stage}</span></div>
                <div className="flex justify-end">
                  {done ? (
                    <span className="pill pill-ok"><Check className="w-3 h-3" /> Nudged · {j.channel}</span>
                  ) : (
                    <button onClick={() => setRenewing((p) => new Set([...p, j.property]))} className="btn btn-secondary btn-sm">
                      <Send className="w-3.5 h-3.5" /> Nudge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
