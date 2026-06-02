"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ApprovalStatus = "pending" | "approved" | "rejected";

/** A single line item shown inline within an approval card. */
export interface ApprovalLineItem {
  /** Customer / supplier / product name */
  primary: string;
  /** Sub-label or detail (e.g. "38m² Carrara SPC") */
  detail: string;
  /** Right-side value (e.g. "£2,940" or "60 packs") */
  value?: string;
  /** Far-right caption (e.g. "sent 4d ago") */
  caption?: string;
  /** Small tag (e.g. "Trade", "Retail") */
  tag?: string;
  /** Stock callout (e.g. "on hand 11 · need 64") for PO line items */
  stockNote?: string;
}

export interface MockApproval {
  id: string;
  workflowTag: string;
  category: "quote" | "reply" | "po" | "finance" | "comms" | "payroll" | "ops";
  meta: string;
  headline: string;
  detail: string;
  /** Inline line items shown without leaving the row — v3 proof of work. */
  lineItems?: ApprovalLineItem[];
  /** Header for the line items grid (e.g. ["Customer","Product","Value","Sent"]) */
  lineItemCols?: ("primary" | "detail" | "value" | "caption")[];
  openLabel: string;
  approveLabel: string;
  approveIcon?: "check" | "send";
  status: ApprovalStatus;
  decidedAt?: Date;
  editedContent?: string;
}

export const INITIAL_APPROVALS: MockApproval[] = [
  {
    id: "quote-followup-5",
    workflowTag: "Quote follow-up",
    category: "quote",
    meta: "drafted 06:14 · tone matches your past nudges",
    headline: "Nudge 5 quotes that have gone quiet — £11,800 of pipeline",
    detail: "Polite one-liner, re-attaches the quote PDF, offers a quick call. Each is tailored below.",
    lineItems: [
      { primary: "Halpin Builders",       detail: "38m² Carrara SPC + colour-match trims", value: "£2,940", caption: "sent 4d ago", tag: "Trade" },
      { primary: "Meadowcroft Lettings",  detail: "3 flats · LVT supply & fit",            value: "£5,600", caption: "sent 3d ago" },
      { primary: "K. Brennan Bathrooms",  detail: "Ceiling cladding · 12 packs",            value: "£1,180", caption: "sent 5d ago", tag: "Trade" },
      { primary: "The Granary Café",      detail: "Shower & splash wall panels",            value: "£1,420", caption: "sent 7d ago" },
      { primary: "Mrs P. Okafor",         detail: "Marble-effect bathroom panels",          value: "£680",   caption: "sent 6d ago" },
    ],
    openLabel: "Edit drafts",
    approveLabel: "Approve all 5",
    approveIcon: "check",
    status: "pending",
  },
  {
    id: "halpin-carrara-reply",
    workflowTag: "Customer reply",
    category: "reply",
    meta: "drafted 07:51 · Halpin Builders",
    headline: "Confirm the Carrara order & offer a fit week to Halpin Builders",
    detail: "Quotes a 5-working-day lead on the SPC, proposes the fitting team for w/c 9 June, and asks for a 30% deposit to lock stock.",
    openLabel: "Open thread",
    approveLabel: "Send reply",
    approveIcon: "send",
    status: "pending",
  },
  {
    id: "po-2214",
    workflowTag: "Purchase order",
    category: "po",
    meta: "stock cover drops below the Riverside job on Monday",
    headline: "Raise PO-2214 to Continental Flooring — £2,098",
    detail: "Tops up the three lines running low before the Riverside install. Delivery slot Tue 3 June fits the schedule.",
    lineItems: [
      { primary: "Carrara SPC flooring · 1.86m²/pack", detail: "60 packs", stockNote: "on hand 11 · need 64", value: "£1,740" },
      { primary: "Colour-match end trim · 2.6m",       detail: "40",       stockNote: "on hand 6",             value: "£196" },
      { primary: "Flexible flooring adhesive · 5kg",   detail: "18",       stockNote: "on hand 3",             value: "£162" },
    ],
    openLabel: "Adjust",
    approveLabel: "Raise PO",
    approveIcon: "check",
    status: "pending",
  },
  {
    id: "doyle-bathroom-quote",
    workflowTag: "Quote draft",
    category: "quote",
    meta: "from showroom samples · Mr & Mrs Doyle",
    headline: "Draft bathroom-panel quote for Mr & Mrs Doyle — £1,820",
    detail: "Based on their finish picks (Marble Gloss + matt charcoal trims) and the ensuite dimensions taken in the showroom. Free survey offered.",
    openLabel: "Edit",
    approveLabel: "Send quote",
    approveIcon: "send",
    status: "pending",
  },
  {
    id: "recon-flags",
    workflowTag: "Reconciliation",
    category: "finance",
    meta: "overnight run · 02:18",
    headline: "7 unmatched bank lines need review",
    detail: "5× Stripe card-machine fees (£14.20 each), 1 duplicate supplier refund (£62.00), 1 unknown transfer (£185.00). 412 of 419 transactions matched automatically.",
    openLabel: "View",
    approveLabel: "Mark resolved",
    approveIcon: "check",
    status: "pending",
  },
  {
    id: "cis-monthly",
    workflowTag: "CIS return",
    category: "finance",
    meta: "overnight run · pre-filled from BrightPay",
    headline: "CIS monthly return — 4 subcontractors, £2,180 deductions",
    detail: "Adams Tiling, Brennan Fitting, Murphy Plant Hire, Khan & Sons. Verified status checked, deductions calculated. Files to HMRC on approval.",
    openLabel: "Review",
    approveLabel: "Submit to HMRC",
    approveIcon: "check",
    status: "pending",
  },
  {
    id: "weekly-payroll",
    workflowTag: "Payroll",
    category: "payroll",
    meta: "runs Fri 09:00 · 9 staff",
    headline: "Weekly payroll — 9 staff, net £6,840",
    detail: "Gross £9,120, net £6,840. One change since last week: Mark Allerton added 6 install hrs (+£162). BrightPay synced. HMRC PAYE filing automatic on approval.",
    openLabel: "Review",
    approveLabel: "Approve payroll",
    approveIcon: "check",
    status: "pending",
  },
];

interface ApprovalCtx {
  approvals: MockApproval[];
  approve: (id: string) => void;
  reject: (id: string) => void;
  edit: (id: string, content: string) => void;
  pendingCount: number;
}

const Ctx = createContext<ApprovalCtx | null>(null);

export function ApprovalProvider({
  children,
  seed,
}: {
  children: ReactNode;
  /** Per-company approval queue. Falls back to the original Northgate set. */
  seed?: MockApproval[];
}) {
  const [approvals, setApprovals] = useState<MockApproval[]>(seed ?? INITIAL_APPROVALS);

  const approve = (id: string) =>
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "approved", decidedAt: new Date() } : a))
    );

  const reject = (id: string) =>
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "rejected", decidedAt: new Date() } : a))
    );

  const edit = (id: string, content: string) =>
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, editedContent: content } : a))
    );

  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  return <Ctx.Provider value={{ approvals, approve, reject, edit, pendingCount }}>{children}</Ctx.Provider>;
}

export function useApprovals() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApprovals outside ApprovalProvider");
  return ctx;
}
