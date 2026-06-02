"use client";

import { useState } from "react";
import { Repeat, Check, RefreshCw, CalendarPlus, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { useCompany } from "@/lib/mock/company-context";
import type { ServiceContractPlan } from "@/lib/mock/companies/types";

const STATUS_PILL: Record<ServiceContractPlan["status"], { cls: string; label: string }> = {
  active:  { cls: "pill-ok",   label: "Active" },
  due:     { cls: "pill-warn", label: "Due now" },
  overdue: { cls: "pill-bad",  label: "Overdue" },
  lapsed:  { cls: "pill-bad",  label: "Lapsed" },
};

export default function ServiceContractsPage() {
  const { company } = useCompany();
  const data = company.serviceContracts;

  const [scheduled, setScheduled] = useState<Set<string>>(new Set());
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchDone, setBatchDone] = useState(false);

  if (!data) {
    return (
      <>
        <PageHeader title="Service contracts" subtitle={company.name} />
        <div className="px-4 sm:px-8 py-7 max-w-[1120px] mx-auto">
          <div className="apple-card p-10 text-center">
            <Repeat className="w-8 h-8 mx-auto mb-3" style={{ color: "#86868B" }} />
            <div className="apple-tagline">Not enabled for {company.name}</div>
            <p className="apple-fine mt-1">Recurring service plans are a plumbing &amp; heating feature. Switch to a company that runs them.</p>
          </div>
        </div>
      </>
    );
  }

  function scheduleOne(customer: string) {
    setScheduled((p) => new Set([...p, customer]));
  }
  function batchAll() {
    setBatchLoading(true);
    setTimeout(() => {
      setBatchLoading(false);
      setBatchDone(true);
      setScheduled(new Set(data!.readyToSchedule.map((r) => r.customer)));
    }, 1400);
  }

  return (
    <>
      <PageHeader title="Service contracts" subtitle={`${data.summaryActive} active plans · ${data.summaryDue} due`} />

      <div className="px-4 sm:px-8 py-7 max-w-[1120px] mx-auto">
        <div className="mb-7">
          <p className="apple-lead" style={{ color: "#333333" }}>{data.intro}</p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Recurring income", value: data.summaryMrr, sub: "per month · direct debit" },
            { label: "Active plans",     value: String(data.summaryActive), sub: "Gold & Silver" },
            { label: "Due to service",   value: String(data.summaryDue), sub: "next 30 days" },
            { label: "Renewal rate",     value: data.summaryRenewalRate, sub: "last 12 months" },
          ].map((k) => (
            <div key={k.label} className="apple-card p-4">
              <div className="apple-fine">{k.label}</div>
              <div className="apple-display tnum mt-2" style={{ fontSize: 28 }}>{k.value}</div>
              <div className="apple-fine mt-2">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Ready to schedule (batch) */}
        <div className="apple-card p-5 mb-8" style={{ background: "#E8F0FB", borderColor: "rgba(0,102,204,0.18)" }}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
            <div>
              <div className="apple-tagline" style={{ fontSize: 17, color: "#0a3d6e" }}>
                {data.readyToSchedule.length} service reminders ready to send
              </div>
              <div className="apple-body mt-1" style={{ color: "#0a3d6e" }}>
                Claude has drafted reminders for every plan due now or overdue, picking the channel each customer responds to.
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.readyToSchedule.map((r) => (
                  <span key={r.customer} className="pill pill-soft">
                    {r.customer} · {r.due} · {r.channel}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              {batchDone ? (
                <span className="btn btn-sm" style={{ background: "#2E844A", color: "#fff", cursor: "default" }}>
                  <Check className="w-3.5 h-3.5" /> Reminders queued
                </span>
              ) : (
                <button onClick={batchAll} disabled={batchLoading} className="btn btn-primary btn-sm">
                  {batchLoading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</> : <><CalendarPlus className="w-3.5 h-3.5" /> Send all &amp; book in</>}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Plan table */}
        <h3 className="section-title mb-3">All plans</h3>
        <div className="apple-card resp-table">
          <div className="min-w-[720px] resp-min">
            <div
              className="grid items-center px-4 py-2.5 apple-fine resp-head"
              style={{ gridTemplateColumns: "1.4fr 1fr 0.8fr 0.7fr 1fr 1.1fr", background: "#F5F5F7", borderBottom: "1px solid #E0E0E0" }}
            >
              <div>Customer</div><div>Asset</div><div>Plan</div><div className="text-right">MRR</div><div>Next service</div><div className="text-right">Status</div>
            </div>
            {data.plans.map((p, i) => {
              const pill = STATUS_PILL[p.status];
              const isScheduled = scheduled.has(p.customer);
              const needs = p.status === "due" || p.status === "overdue" || p.status === "lapsed";
              return (
                <div
                  key={p.id}
                  className="grid items-center resp-row"
                  style={{
                    gridTemplateColumns: "1.4fr 1fr 0.8fr 0.7fr 1fr 1.1fr",
                    padding: "13px 16px",
                    fontSize: 13,
                    borderBottom: i < data.plans.length - 1 ? "1px solid #F0F0F0" : "none",
                  }}
                >
                  <div>
                    <div className="apple-caption-strong resp-wrap">{p.customer}</div>
                    <div className="apple-fine resp-wrap">{p.address}</div>
                  </div>
                  <div className="apple-caption resp-wrap">{p.asset}</div>
                  <div><span className="pill pill-soft">{p.plan}</span></div>
                  <div className="apple-caption-strong tnum text-right">{p.monthly}</div>
                  <div>
                    <div className="apple-caption">{p.nextService}</div>
                    <div className="apple-fine">
                      {p.daysToService === 0 ? "today"
                        : p.daysToService < 0 ? `${Math.abs(p.daysToService)}d overdue`
                        : `in ${p.daysToService}d`}
                    </div>
                  </div>
                  <div className="flex justify-end items-center gap-2 resp-actions">
                    <span className={`pill ${pill.cls}`}>{pill.label}</span>
                    {needs && (
                      isScheduled ? (
                        <span className="pill pill-ok"><Check className="w-3 h-3" /> Booked</span>
                      ) : (
                        <button onClick={() => scheduleOne(p.customer)} className="btn btn-secondary btn-sm">Book</button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="apple-fine mt-3 flex items-center gap-3">
          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> reminders via Gmail</span>
          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> phone fallback for non-responders</span>
        </p>
      </div>
    </>
  );
}
