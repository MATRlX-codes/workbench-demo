"use client";

import { TrendingUp, AlertTriangle, Sparkles, Receipt } from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { useCompany } from "@/lib/mock/company-context";

export default function SeasonalityPage() {
  const { company } = useCompany();
  const data = company.seasonality;

  if (!data) {
    return (
      <>
        <PageHeader title="Seasonality" subtitle={company.name} />
        <div className="px-8 py-7 max-w-[1120px] mx-auto">
          <div className="apple-card p-10 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3" style={{ color: "#86868B" }} />
            <div className="apple-tagline">Not enabled for {company.name}</div>
            <p className="apple-fine mt-1">The seasonality view is tuned for trades with a strong feast/famine cycle.</p>
          </div>
        </div>
      </>
    );
  }

  const max = Math.max(...data.months.flatMap((m) => [m.revenue, m.costs]));
  const trough = data.months.reduce((lo, m) => (m.revenue < lo.revenue ? m : lo), data.months[0]);

  return (
    <>
      <PageHeader title="Seasonality" subtitle="Revenue, costs & VAT across the year" />

      <div className="px-8 py-7 max-w-[1120px] mx-auto">
        <div className="mb-7">
          <p className="apple-lead" style={{ color: "#333333" }}>{data.intro}</p>
        </div>

        {/* Chart */}
        <div className="apple-card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="apple-tagline" style={{ fontSize: 17 }}>12-month revenue vs costs</div>
            <div className="flex items-center gap-4 apple-fine">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#0066CC" }} /><span>Revenue</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#C7CDD4" }} /><span>Costs</span></div>
              <div className="flex items-center gap-1.5"><Receipt className="w-3 h-3" style={{ color: "#9A2D24" }} /><span>VAT due</span></div>
            </div>
          </div>
          <div className="flex items-end gap-2.5" style={{ height: 200 }}>
            {data.months.map((m) => {
              const revH = Math.round((m.revenue / max) * 170);
              const costH = Math.round((m.costs / max) * 170);
              const isTrough = m.month === trough.month;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="flex items-end gap-1 w-full justify-center relative" style={{ height: 176 }}>
                    {m.vat != null && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <Receipt className="w-3.5 h-3.5" style={{ color: "#9A2D24" }} />
                      </div>
                    )}
                    <div className="rounded-t-[3px]" style={{ width: 14, height: revH, background: isTrough ? "#9A2D24" : "#0066CC" }} title={`Revenue £${m.revenue.toLocaleString()}`} />
                    <div className="rounded-t-[3px]" style={{ width: 14, height: costH, background: "#C7CDD4" }} title={`Costs £${m.costs.toLocaleString()}`} />
                  </div>
                  <div className="apple-fine" style={{ fontSize: 10.5, fontWeight: isTrough ? 700 : 400, color: isTrough ? "#9A2D24" : undefined }}>{m.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trough warning */}
        <div className="apple-card p-5 mb-4" style={{ background: "#F7E8E5", borderColor: "rgba(154,45,36,0.18)" }}>
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-[9px] flex items-center justify-center" style={{ background: "#f1d6d1", color: "#9A2D24" }}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="apple-tagline" style={{ fontSize: 16, color: "#7a241c" }}>The summer trough</div>
              <div className="apple-body mt-1" style={{ color: "#7a241c" }}>{data.troughNote}</div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="apple-card p-5 mb-4" style={{ background: "#E8F0FB", borderColor: "rgba(0,102,204,0.18)" }}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#0066CC" }} />
            <div>
              <div className="apple-tagline" style={{ fontSize: 16, color: "#0a3d6e" }}>How to smooth it</div>
              <div className="apple-body mt-1" style={{ color: "#0a3d6e" }}>{data.recommendation}</div>
            </div>
          </div>
        </div>

        {/* Smoothed note */}
        <div className="apple-card p-5">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#2E844A" }} />
            <div>
              <div className="apple-tagline" style={{ fontSize: 16, color: "#2E844A" }}>Recurring income is the cushion</div>
              <div className="apple-body mt-1" style={{ color: "#333333" }}>{data.smoothedNote}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
