"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ChevronsUpDown, Check } from "lucide-react";
import { useCompany } from "@/lib/mock/company-context";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const { company, companies, companyId, setCompanyId } = useCompany();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <header
      className="apple-subnav flex items-center justify-between px-8 sticky top-0 z-30"
      style={{ height: 64 }}
    >
      <div className="flex items-baseline gap-3">
        <h1 className="apple-tagline" style={{ fontSize: 21 }}>
          {title}
        </h1>
        <span className="apple-fine">{subtitle}</span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          className="flex items-center justify-center rounded-full transition-colors"
          style={{ width: 36, height: 36, color: "#1D1D1F" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Company switcher */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 px-3 rounded-full cursor-pointer transition-colors"
            style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", height: 36 }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.16)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; }}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#1D1D1F", color: "#FFFFFF", fontSize: 10, fontWeight: 700 }}
            >
              {company.initials}
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: "#1D1D1F", letterSpacing: "-0.005em" }}>
              {company.name}
            </span>
            <ChevronsUpDown className="w-3.5 h-3.5" style={{ color: "#86868B" }} />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 rounded-[16px] overflow-hidden"
              style={{
                width: 320,
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
                zIndex: 50,
              }}
              role="listbox"
            >
              <div className="px-4 pt-3 pb-2 apple-fine" style={{ borderBottom: "1px solid #F0F0F0" }}>
                Switch company
              </div>
              {companies.map((c) => {
                const isActive = c.id === companyId;
                return (
                  <button
                    key={c.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => { setCompanyId(c.id); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{ background: isActive ? "#F5F5F7" : "transparent" }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#FAFAFC"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#1D1D1F", color: "#FFFFFF", fontSize: 12, fontWeight: 700 }}
                    >
                      {c.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="apple-caption-strong truncate">{c.name}</div>
                      <div className="apple-fine truncate">{c.trade}</div>
                    </div>
                    {isActive && <Check className="w-4 h-4 shrink-0" style={{ color: "#0066CC" }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="rounded-full flex items-center justify-center shrink-0"
          style={{ width: 32, height: 32, background: "#1D1D1F", color: "#FFFFFF", fontSize: 11, fontWeight: 600 }}
          title={company.ownerName}
        >
          {company.ownerInitials}
        </div>
      </div>
    </header>
  );
}
