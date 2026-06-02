"use client";

import { useState } from "react";
import {
  GanttChartSquare, Check, Truck, AlertTriangle, Package, Eye, Share2,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { useCompany } from "@/lib/mock/company-context";
import type { ProjectDelivery, ProjectRecord } from "@/lib/mock/companies/types";

const DELIVERY_PILL: Record<ProjectDelivery["status"], { cls: string; label: string }> = {
  delivered:   { cls: "pill-ok",   label: "Delivered" },
  "in-transit":{ cls: "pill-info", label: "In transit" },
  ordered:     { cls: "pill-soft", label: "Ordered" },
  "at-risk":   { cls: "pill-bad",  label: "At risk" },
};

export default function ProjectsPage() {
  const { company } = useCompany();
  const data = company.projects;

  const [selectedId, setSelectedId] = useState<string>(data?.projects[0]?.id ?? "");
  const [shared, setShared] = useState<Set<string>>(new Set());

  if (!data) {
    return (
      <>
        <PageHeader title="Projects" subtitle={company.name} />
        <div className="px-4 sm:px-8 py-7 max-w-[1120px] mx-auto">
          <div className="apple-card p-10 text-center">
            <GanttChartSquare className="w-8 h-8 mx-auto mb-3" style={{ color: "#86868B" }} />
            <div className="apple-tagline">Not enabled for {company.name}</div>
            <p className="apple-fine mt-1">Multi-trade project timelines are a fit-out feature.</p>
          </div>
        </div>
      </>
    );
  }

  const project: ProjectRecord = data.projects.find((p) => p.id === selectedId) ?? data.projects[0];
  const cols = project.dayLabels.length;
  const isShared = shared.has(project.id);

  return (
    <>
      <PageHeader title="Projects" subtitle={`${data.projects.length} jobs · multi-trade scheduling`} />

      <div className="px-4 sm:px-8 py-7 max-w-[1280px] mx-auto">
        <div className="mb-6">
          <p className="apple-lead" style={{ color: "#333333" }}>{data.intro}</p>
        </div>

        {/* Deposit-at-risk banner */}
        <div className="apple-card p-4 mb-6 flex items-center gap-3" style={{ background: "#F7E8E5", borderColor: "rgba(154,45,36,0.18)" }}>
          <div className="shrink-0 w-9 h-9 rounded-[9px] flex items-center justify-center" style={{ background: "#f1d6d1", color: "#9A2D24" }}>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="apple-caption-strong" style={{ color: "#7a241c" }}>Deposit at risk</div>
            <div className="apple-body" style={{ color: "#7a241c" }}>{data.depositAtRisk}</div>
          </div>
        </div>

        {/* Project selector */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {data.projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`fpill ${selectedId === p.id ? "active" : ""}`}
            >
              {p.name}
              <span style={{ opacity: 0.6 }}>{p.progressPct}%</span>
            </button>
          ))}
        </div>

        <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1fr_360px]">
          {/* Gantt + deliveries */}
          <div className="min-w-0 space-y-5">
            {/* Gantt */}
            <div className="apple-card p-5">
              <div className="flex items-baseline justify-between mb-1">
                <div className="apple-tagline" style={{ fontSize: 17 }}>{project.name}</div>
                <div className="apple-fine">{project.windowLabel}</div>
              </div>
              <div className="apple-fine mb-4">{project.customer} · {project.progressPct}% complete</div>

              <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                  {/* Day header */}
                  <div
                    className="grid items-center mb-2"
                    style={{ gridTemplateColumns: `190px repeat(${cols}, 1fr)`, gap: 4 }}
                  >
                    <div />
                    {project.dayLabels.map((d) => (
                      <div key={d} className="apple-fine text-center" style={{ fontSize: 10.5 }}>{d}</div>
                    ))}
                  </div>

                  {/* Trade rows */}
                  <div className="space-y-1.5">
                    {project.trades.map((t, idx) => (
                      <div
                        key={idx}
                        className="grid items-center"
                        style={{ gridTemplateColumns: `190px repeat(${cols}, 1fr)`, gap: 4 }}
                      >
                        <div className="apple-fine pr-2 truncate" title={`${t.trade} · ${t.team}`}>
                          <span style={{ color: "#191C21", fontWeight: 500 }}>{t.trade}</span>
                          <span className="block" style={{ fontSize: 10 }}>{t.team}</span>
                        </div>
                        {/* Bar lane: render a positioned bar inside a sub-grid */}
                        <div className="relative" style={{ gridColumn: `2 / ${cols + 2}`, height: 30 }}>
                          <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
                            {Array.from({ length: cols }).map((_, c) => <div key={c} className="rounded-[4px]" style={{ background: "#F2F1ED" }} />)}
                          </div>
                          <div
                            className="absolute top-0 h-full rounded-[6px] flex items-center px-2"
                            style={{
                              left: `calc(${(t.startDay / cols) * 100}% + 2px)`,
                              width: `calc(${(t.span / cols) * 100}% - 4px)`,
                              background: t.status === "done" ? `${t.color}88` : t.color,
                              opacity: t.status === "upcoming" ? 0.5 : 1,
                            }}
                          >
                            {t.status === "done" && <Check className="w-3 h-3 text-white shrink-0" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier deposit / delivery tracker */}
            <div className="apple-card p-5">
              <div className="apple-tagline mb-3" style={{ fontSize: 16 }}>Supplier deposits &amp; deliveries</div>
              {project.deliveries.length === 0 ? (
                <div className="apple-fine">No supplier orders on this project yet.</div>
              ) : (
                <div className="space-y-2">
                  {project.deliveries.map((d, i) => {
                    const pill = DELIVERY_PILL[d.status];
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-[10px]"
                        style={{ border: d.atRisk ? "1px solid rgba(154,45,36,0.35)" : "1px solid #E7E5DE", background: d.atRisk ? "#FCF3F1" : "#fff" }}
                      >
                        <div className="w-8 h-8 rounded-[8px] shrink-0 flex items-center justify-center" style={{ background: "#F2F1ED", color: "#727680" }}>
                          {d.status === "delivered" ? <Package className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="apple-caption-strong truncate">{d.item}</div>
                          <div className="apple-fine">{d.supplier} · {d.eta}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="apple-fine">deposit</div>
                          <div className="apple-caption-strong tnum">{d.deposit}</div>
                        </div>
                        <span className={`pill ${pill.cls} shrink-0`}>{pill.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Customer-facing read-only view */}
          <div className="space-y-3">
            <div className="apple-card overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#1D1D1F" }}>
                <Eye className="w-3.5 h-3.5" style={{ color: "#F5F5F7" }} />
                <span style={{ color: "#F5F5F7", fontSize: 12.5, fontWeight: 600 }}>Customer view</span>
                <span style={{ color: "#86868B", fontSize: 11 }} className="ml-auto">read-only link</span>
              </div>
              <div className="p-5">
                <div className="apple-tagline" style={{ fontSize: 16 }}>{project.name}</div>
                <div className="apple-fine mb-3">for {project.customer}</div>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="apple-fine">Progress</span>
                  <span className="apple-caption-strong tnum">{project.progressPct}%</span>
                </div>
                <div className="progress-track mb-4"><span className="progress-fill" style={{ width: `${project.progressPct}%` }} /></div>

                <div className="space-y-2 mb-4">
                  {project.trades.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {t.status === "done"
                        ? <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#2E844A" }} />
                        : <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ border: `2px solid ${t.status === "active" ? "#0066CC" : "#C7CDD4"}`, background: t.status === "active" ? "#0066CC" : "transparent" }} />}
                      <span className="apple-caption" style={{ color: t.status === "upcoming" ? "#86868B" : "#191C21" }}>{t.trade}</span>
                    </div>
                  ))}
                </div>

                <div className="apple-card p-3" style={{ background: "#FAFAFC" }}>
                  <div className="apple-fine mb-1">A note from the team</div>
                  <div className="apple-body">{project.customerNote}</div>
                </div>
              </div>
            </div>

            {isShared ? (
              <div className="apple-card p-3 flex items-center gap-2" style={{ background: "#E6F2EB", borderColor: "rgba(46,132,74,0.2)" }}>
                <Check className="w-4 h-4" style={{ color: "#2E844A" }} />
                <span className="apple-caption" style={{ color: "#2E844A" }}>Link shared with {project.customer}</span>
              </div>
            ) : (
              <button onClick={() => setShared((p) => new Set([...p, project.id]))} className="btn btn-secondary btn-sm w-full">
                <Share2 className="w-3.5 h-3.5" /> Share this view with {project.customer}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
