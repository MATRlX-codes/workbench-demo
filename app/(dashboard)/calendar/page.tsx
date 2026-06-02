"use client";

import { useState, type ReactNode } from "react";
import {
  ChevronLeft, ChevronRight, Phone, X, Check, MapPin, Truck,
  Sun, CloudRain, Cloud, Wind, Droplets, CalendarClock, Send,
  Clock, Users, CloudDrizzle,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { Modal, ModalActions } from "@/lib/ui/modal";
import { useCompany } from "@/lib/mock/company-context";
import type { CalJob, DayKey, WeatherData } from "@/lib/mock/companies/types";

const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function jobLabel(kind: string) {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

export default function CalendarPage() {
  const { company } = useCompany();
  const cal = company.calendar;
  const TEAMS = cal.teams;
  const DAY_LABELS = cal.dayLabels;

  const [view, setView] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState<DayKey>("Thu");
  const [jobs, setJobs] = useState<Record<DayKey, CalJob[]>>(cal.week);
  const [openJob, setOpenJob] = useState<{ day: DayKey; id: string } | null>(null);

  function confirmJob(day: DayKey, id: string) {
    setJobs((prev) => ({ ...prev, [day]: prev[day].map((j) => j.id === id ? { ...j, status: "confirmed" } : j) }));
  }
  function cancelJob(day: DayKey, id: string) {
    setJobs((prev) => ({ ...prev, [day]: prev[day].map((j) => j.id === id ? { ...j, status: "cancelled" } : j) }));
  }

  const activeJob = openJob ? jobs[openJob.day].find((j) => j.id === openJob.id) ?? null : null;

  const totalWeek = Object.values(jobs).flat().filter((j) => j.status !== "cancelled").length;
  const todayCount = jobs[selectedDay].filter((j) => j.status !== "cancelled").length;

  return (
    <>
      <PageHeader title={cal.title} subtitle={`Week of ${cal.weekRange} · ${totalWeek} jobs`} />

      <div className="px-8 py-7 max-w-[1320px] mx-auto">

        {/* Weather-aware rescheduling (roofing) */}
        {company.weather && <WeatherSection data={company.weather} />}

        {/* Controls */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-sm" aria-label="Previous week"><ChevronLeft className="w-4 h-4" /></button>
            <span style={{ fontSize: 14, fontWeight: 500, padding: "0 8px" }}>{cal.weekRange} 2026</span>
            <button className="btn btn-secondary btn-sm" aria-label="Next week"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex gap-1.5">
            {(["week", "day"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`fpill ${view === v ? "active" : ""}`}>
                {v === "week" ? "Week view" : "Day view"}
              </button>
            ))}
          </div>
        </div>

        {/* Team legend */}
        <div className="flex flex-wrap gap-3 mb-5">
          {Object.entries(TEAMS).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5">
              <span className="dot" style={{ background: color }} />
              <span className="faint-text">{name}</span>
            </div>
          ))}
        </div>

        {view === "week" ? (
          <div className="grid grid-cols-6 gap-3">
            {DAYS.map((day) => (
              <div key={day} className="min-w-0">
                <div
                  className="muted-text mb-2 cursor-pointer hover:text-[#191C21]"
                  style={{ fontWeight: 600 }}
                  onClick={() => { setSelectedDay(day); setView("day"); }}
                >
                  {DAY_LABELS[day]}
                  <span className="ml-1 faint-text">({jobs[day].filter((j) => j.status !== "cancelled").length})</span>
                </div>
                <div className="flex flex-col gap-2">
                  {jobs[day].map((j) => (
                    <div
                      key={j.id}
                      onClick={() => setOpenJob({ day, id: j.id })}
                      className="v3-card rounded-[8px] p-2.5 cursor-pointer transition-shadow hover:shadow-md"
                      style={{
                        borderLeft: `3px solid ${j.teamColor}`,
                        opacity: j.status === "completed" ? 0.55 : j.status === "cancelled" ? 0.4 : 1,
                        textDecoration: j.status === "cancelled" ? "line-through" : "none",
                      }}
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="pill pill-soft" style={{ height: 18, fontSize: 10 }}>{jobLabel(j.kind)}</span>
                        {j.status === "tentative" && <span className="faint-text" style={{ color: "#8A5A12" }}>unconfirmed</span>}
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: "#191C21" }} className="truncate">{j.title}</div>
                      <div className="faint-text mt-0.5">{j.time} · {j.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex gap-1.5 mb-5 flex-wrap">
              {DAYS.map((d) => (
                <button key={d} onClick={() => setSelectedDay(d)} className={`fpill ${selectedDay === d ? "active" : ""}`}>
                  {d} <span style={{ opacity: 0.6 }}>({jobs[d].filter((j) => j.status !== "cancelled").length})</span>
                </button>
              ))}
            </div>

            <div className="muted-text mb-3" style={{ fontWeight: 500 }}>{DAY_LABELS[selectedDay]} · {todayCount} jobs</div>

            <div className="flex flex-col gap-3">
              {jobs[selectedDay].map((j) => (
                <div
                  key={j.id}
                  onClick={() => setOpenJob({ day: selectedDay, id: j.id })}
                  className="v3-card p-5 cursor-pointer transition-shadow hover:shadow-md"
                  style={{
                    borderLeft: `4px solid ${j.teamColor}`,
                    opacity: j.status === "completed" ? 0.55 : j.status === "cancelled" ? 0.4 : 1,
                    textDecoration: j.status === "cancelled" ? "line-through" : "none",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="pill pill-soft">{jobLabel(j.kind)}</span>
                        {j.status === "tentative" && <span className="pill pill-warn">unconfirmed</span>}
                        {j.status === "completed" && <span className="pill pill-ok"><Check className="w-3 h-3" /> done</span>}
                      </div>
                      <div className="h3">{j.title}</div>
                      <div className="muted-text mt-0.5">{j.detail}</div>
                      <div className="faint-text mt-1.5 flex items-center gap-3">
                        <span>{j.time} · {j.durationMins} min</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {j.location}</span>
                        <span>· {j.team}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {j.phone && <a href={`tel:${j.phone}`} className="btn btn-secondary btn-sm"><Phone className="w-3 h-3" /> Call</a>}
                      {j.kind === "delivery" && <button className="btn btn-secondary btn-sm"><Truck className="w-3 h-3" /> Track</button>}
                      {j.status === "tentative" && (
                        <>
                          <button onClick={() => cancelJob(selectedDay, j.id)} className="btn btn-ghost btn-sm" style={{ color: "#9A2D24" }}>
                            <X className="w-3 h-3" /> Cancel
                          </button>
                          <button onClick={() => confirmJob(selectedDay, j.id)} className="btn btn-accent btn-sm">
                            <Check className="w-3 h-3" /> Confirm
                          </button>
                        </>
                      )}
                      {j.status === "confirmed" && (
                        <button onClick={() => cancelJob(selectedDay, j.id)} className="btn btn-ghost btn-sm" style={{ color: "#9A2D24" }}>
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <JobDetailModal
        job={activeJob}
        dayLabel={openJob ? DAY_LABELS[openJob.day] : ""}
        onClose={() => setOpenJob(null)}
        onConfirm={() => { if (openJob) confirmJob(openJob.day, openJob.id); }}
        onCancel={() => { if (openJob) cancelJob(openJob.day, openJob.id); }}
      />
    </>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Booking detail modal                                           */

const STATUS_META: Record<CalJob["status"], { cls: string; label: string }> = {
  confirmed: { cls: "pill-ok", label: "Confirmed" },
  tentative: { cls: "pill-warn", label: "Unconfirmed" },
  cancelled: { cls: "pill-bad", label: "Cancelled" },
  completed: { cls: "pill-soft", label: "Completed" },
};

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0" style={{ color: "#86868B" }}>{icon}</div>
      <div className="min-w-0">
        <div className="apple-fine" style={{ fontSize: 11 }}>{label}</div>
        <div className="apple-caption-strong">{value}</div>
      </div>
    </div>
  );
}

function JobDetailModal({
  job, dayLabel, onClose, onConfirm, onCancel,
}: {
  job: CalJob | null;
  dayLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const status = job ? STATUS_META[job.status] : null;
  return (
    <Modal open={job != null} onClose={onClose} title={job ? jobLabel(job.kind) + " booking" : ""} width="540px">
      {job && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="pill pill-soft">{jobLabel(job.kind)}</span>
              {status && <span className={`pill ${status.cls}`}>{status.label}</span>}
              {job.weatherDep && (
                <span className="pill pill-warn"><CloudDrizzle className="w-3 h-3" /> Weather-dependent</span>
              )}
            </div>
            <div className="h3">{job.title}</div>
            <div className="muted-text mt-0.5">{job.detail}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <Fact icon={<CalendarClock className="w-4 h-4" />} label="When" value={`${dayLabel} · ${job.time}`} />
            <Fact icon={<Clock className="w-4 h-4" />} label="Duration" value={`${job.durationMins} min`} />
            <Fact icon={<Users className="w-4 h-4" />} label="Team" value={
              <span className="flex items-center gap-1.5">
                <span className="dot" style={{ background: job.teamColor }} /> {job.team}
              </span>
            } />
            <Fact icon={<MapPin className="w-4 h-4" />} label="Location" value={job.location} />
            {job.phone && <Fact icon={<Phone className="w-4 h-4" />} label="Contact" value={job.phone} />}
          </div>
        </div>
      )}
      <ModalActions>
        {job?.phone && (
          <a href={`tel:${job.phone}`} className="btn btn-secondary btn-sm"><Phone className="w-3 h-3" /> Call</a>
        )}
        {job?.kind === "delivery" && (
          <button className="btn btn-secondary btn-sm"><Truck className="w-3 h-3" /> Track delivery</button>
        )}
        {job && (job.status === "tentative" || job.status === "confirmed") && (
          <button onClick={() => { onCancel(); onClose(); }} className="btn btn-ghost btn-sm" style={{ color: "#9A2D24" }}>
            <X className="w-3 h-3" /> Cancel job
          </button>
        )}
        {job?.status === "tentative" && (
          <button onClick={() => { onConfirm(); onClose(); }} className="btn btn-accent btn-sm">
            <Check className="w-3 h-3" /> Confirm
          </button>
        )}
        <button onClick={onClose} className="btn btn-secondary btn-sm">Close</button>
      </ModalActions>
    </Modal>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* Weather-aware rescheduling (roofing)                           */

function weatherIcon(condition: string, suitable: boolean) {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("shower")) return <CloudRain className="w-5 h-5" style={{ color: "#9A2D24" }} />;
  if (c.includes("cloud")) return <Cloud className="w-5 h-5" style={{ color: "#727680" }} />;
  return <Sun className="w-5 h-5" style={{ color: suitable ? "#E0A04A" : "#727680" }} />;
}

function WeatherSection({ data }: { data: WeatherData }) {
  const [moved, setMoved] = useState<Set<string>>(new Set());
  const toMove = data.jobs.filter((j) => j.action === "move");

  return (
    <div className="mb-7">
      <div className="apple-card p-5 mb-4">
        <div className="flex items-baseline justify-between mb-1">
          <div className="apple-tagline flex items-center gap-1.5" style={{ fontSize: 17 }}>
            <CloudRain className="w-4 h-4" style={{ color: "#0066CC" }} /> Weather watch · 7-day
          </div>
          <div className="apple-fine">Met Office · pulled 06:00</div>
        </div>
        <div className="apple-fine mb-4">{data.intro}</div>

        <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${data.forecast.length}, 1fr)` }}>
          {data.forecast.map((d) => (
            <div
              key={d.date}
              className="rounded-[12px] p-3 text-center"
              style={{
                border: "1px solid " + (d.suitable ? "rgba(46,132,74,0.25)" : "rgba(154,45,36,0.22)"),
                background: d.suitable ? "#F1F8F3" : "#FCF3F1",
              }}
            >
              <div className="apple-caption-strong">{d.day}</div>
              <div className="apple-fine">{d.date}</div>
              <div className="flex justify-center my-2">{weatherIcon(d.condition, d.suitable)}</div>
              <div className="apple-fine" style={{ fontSize: 10.5 }}>{d.condition}</div>
              <div className="flex items-center justify-center gap-2 mt-1.5 apple-fine" style={{ fontSize: 10.5 }}>
                <span>{d.tempC}°</span>
                <span className="flex items-center gap-0.5"><Droplets className="w-2.5 h-2.5" />{d.rainPct}%</span>
                <span className="flex items-center gap-0.5"><Wind className="w-2.5 h-2.5" />{d.windMph}</span>
              </div>
              <div className="mt-2">
                {d.suitable
                  ? <span className="pill pill-ok" style={{ height: 18, fontSize: 10 }}>Dry</span>
                  : <span className="pill pill-bad" style={{ height: 18, fontSize: 10 }}>No-go</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs affected */}
      <div className="apple-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#F5EAD6", borderBottom: "1px solid #ecdcbb" }}>
          <span className="pill pill-warn"><CalendarClock className="w-3 h-3" /> Weather-sensitive jobs</span>
          <span className="apple-caption" style={{ color: "#8A5A12" }}>{toMove.length} need moving · {data.jobs.length - toMove.length} fine as scheduled</span>
        </div>
        {data.jobs.map((j, i) => {
          const done = moved.has(j.title);
          return (
            <div
              key={j.title}
              className="grid items-center"
              style={{
                gridTemplateColumns: "1.6fr 0.9fr 1.6fr 1fr",
                padding: "14px 18px",
                borderBottom: i < data.jobs.length - 1 ? "1px solid #F0F0F0" : "none",
              }}
            >
              <div>
                <div className="apple-caption-strong">{j.title}</div>
                <div className="apple-fine">{j.customer}{j.needsDry ? " · needs a dry day" : " · weather not a blocker"}</div>
              </div>
              <div className="apple-fine">{j.scheduled}</div>
              <div className="apple-fine">{j.suggestion}</div>
              <div className="flex justify-end">
                {j.action === "ok" ? (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> Keep</span>
                ) : done ? (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> Moved &amp; messaged</span>
                ) : (
                  <button onClick={() => setMoved((p) => new Set([...p, j.title]))} className="btn btn-warn btn-sm">
                    <Send className="w-3.5 h-3.5" /> Move &amp; tell customer
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
