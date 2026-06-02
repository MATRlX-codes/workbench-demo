"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Inbox, Banknote, ShieldCheck,
  Users, Package, CalendarRange, Plug, Settings, Moon,
  Repeat, TrendingUp, Award, GanttChartSquare,
} from "lucide-react";
import { useApprovals } from "@/lib/mock/approvals";
import { useCompany } from "@/lib/mock/company-context";
import type { FeatureKey } from "@/lib/mock/companies/types";

type NavDef = { href: string; label: string; icon: typeof LayoutDashboard; count?: number | null };

// Signature features that get their own nav entry, in display order.
const FEATURE_NAV: { feature: FeatureKey; href: string; label: string; icon: typeof LayoutDashboard }[] = [
  { feature: "service-contracts", href: "/service-contracts", label: "Service contracts", icon: Repeat },
  { feature: "seasonality",       href: "/seasonality",       label: "Seasonality",       icon: TrendingUp },
  { feature: "competency",        href: "/competency",        label: "Competency",        icon: Award },
  { feature: "projects",          href: "/projects",          label: "Projects",          icon: GanttChartSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { pendingCount } = useApprovals();
  const { company } = useCompany();

  const PRIMARY: NavDef[] = [
    { href: "/",           label: "Today",      icon: LayoutDashboard, count: pendingCount > 0 ? pendingCount : null },
    { href: "/inbox",      label: "Inbox",      icon: Inbox,           count: company.inbox.filter((i) => i.status === "active").length },
    { href: "/money",      label: "Money",      icon: Banknote,        count: null },
    { href: "/compliance", label: "Compliance", icon: ShieldCheck,     count: null },
  ];

  const featureNav = FEATURE_NAV.filter((f) => company.features.includes(f.feature));

  const WORKSPACE: NavDef[] = [
    { href: "/customers",  label: "Customers & trade",   icon: Users },
    { href: "/products",   label: "Products & stock",    icon: Package },
    { href: "/calendar",   label: company.calendar.title, icon: CalendarRange },
    ...featureNav.map((f) => ({ href: f.href, label: f.label, icon: f.icon })),
    { href: "/connectors", label: "Connectors",          icon: Plug },
  ];

  function active(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function NavItem({
    href, label, icon: Icon, count,
  }: NavDef) {
    const isActive = active(href);
    return (
      <Link
        href={href}
        className="relative flex items-center gap-[10px] px-3 py-2 rounded-[10px] transition-colors"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: "-0.008em",
          background: isActive ? "#272729" : "transparent",
          color: isActive ? "#FFFFFF" : "#86868B",
        }}
        onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "#232325"; e.currentTarget.style.color = "#F5F5F7"; } }}
        onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#86868B"; } }}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="flex-1">{label}</span>
        {count != null && count > 0 && (
          <span
            className="tabular-nums shrink-0"
            style={{
              fontSize: 11,
              padding: "2px 7px",
              borderRadius: 9999,
              background: isActive ? "#0066CC" : "transparent",
              color: isActive ? "#fff" : "#86868B",
            }}
          >
            {count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <aside
      className="w-[232px] shrink-0 px-3.5 py-5 flex flex-col h-screen sticky top-0"
      style={{ background: "#1D1D1F" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-7">
        <div
          className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
          style={{ background: "#FFFFFF", color: "#1D1D1F", fontWeight: 700, fontSize: 17, letterSpacing: "-.02em" }}
        >
          {company.initials}
        </div>
        <div className="leading-tight min-w-0">
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14, fontWeight: 600, color: "#F5F5F7",
              letterSpacing: "-0.015em",
            }}
            className="truncate"
          >
            {company.name}
          </div>
          <div style={{ fontSize: 11.5, color: "#86868B", letterSpacing: "-0.003em" }} className="truncate">Workbench</div>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5">
        {PRIMARY.map((p) => <NavItem key={p.href} {...p} />)}
      </nav>

      {/* Workspace section */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "-0.003em",
          color: "#86868B",
          padding: "18px 12px 8px",
        }}
      >
        Workspace
      </div>
      <nav className="flex flex-col gap-0.5 overflow-y-auto scroll-y">
        {WORKSPACE.map((w) => <NavItem key={w.href} {...w} />)}
      </nav>

      {/* Bottom: overnight run + settings */}
      <div className="mt-auto pt-5">
        <div
          className="rounded-[14px] px-3.5 py-3 mb-3"
          style={{ background: "#272729" }}
        >
          <div
            className="flex items-center gap-1.5"
            style={{ fontSize: 11, color: "#86868B", letterSpacing: "-0.003em" }}
          >
            <Moon className="w-3 h-3" /> Overnight run · 02:00
          </div>
          <div style={{ fontSize: 12.5, color: "#F5F5F7", lineHeight: 1.45, marginTop: 5, letterSpacing: "-0.005em" }}>
            {company.overnightNote}
          </div>
        </div>
        <NavItem href="/settings" label="Settings" icon={Settings} />
      </div>
    </aside>
  );
}
