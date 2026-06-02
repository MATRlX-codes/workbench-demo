"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { useCompany } from "@/lib/mock/company-context";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { company } = useCompany();

  return (
    <div className="flex min-h-screen" style={{ background: "#1D1D1F" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full shadow-2xl">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-3 flex items-center justify-center rounded-full"
              style={{ width: 32, height: 32, color: "#86868B" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center gap-3 px-4 shrink-0 sticky top-0 z-40"
          style={{ height: 52, background: "#1D1D1F" }}
        >
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex items-center justify-center -ml-1" style={{ width: 36, height: 36 }}>
            <Menu className="w-6 h-6" style={{ color: "#F5F5F7" }} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
              style={{ background: "#FFFFFF", color: "#1D1D1F", fontWeight: 700, fontSize: 12 }}
            >
              {company.initials}
            </div>
            <span className="truncate" style={{ color: "#F5F5F7", fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
              {company.name}
            </span>
          </div>
        </header>

        <main
          className="flex-1 min-w-0 overflow-y-auto"
          style={{ background: "#F5F5F7", color: "#1D1D1F" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
