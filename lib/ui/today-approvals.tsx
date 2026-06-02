"use client";

import { useState } from "react";
import { Sparkles, Check, Send, X, Pencil } from "lucide-react";
import { useApprovals, MockApproval, ApprovalLineItem } from "@/lib/mock/approvals";
import { CategoryModal } from "@/lib/ui/approval-modals";

export function TodayApprovals() {
  const { approvals, approve, reject, pendingCount } = useApprovals();
  const [openId, setOpenId] = useState<string | null>(null);

  const pending  = approvals.filter((a) => a.status === "pending");
  const resolved = approvals.filter((a) => a.status !== "pending");

  const openApproval = approvals.find((a) => a.id === openId) ?? null;

  return (
    <div className="mb-9">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="section-title">Needs your approval</h3>
        <span className="faint-text">
          {pendingCount > 0
            ? "Everything below is ready to send — open any to review the detail, then approve."
            : "All clear ✓"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {pending.map((ap) => (
          <ApprovalCard
            key={ap.id}
            ap={ap}
            onApprove={() => approve(ap.id)}
            onReject={() => reject(ap.id)}
            onOpen={() => setOpenId(ap.id)}
          />
        ))}

        {pending.length === 0 && (
          <div
            className="apple-card p-5 flex items-center gap-3"
            style={{ background: "#E6F2EB", borderColor: "rgba(46,132,74,0.18)" }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#2E844A" }}>
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="apple-tagline" style={{ color: "#2E844A" }}>Queue is clear</div>
              <div className="apple-caption">All {approvals.length} actions have been reviewed today.</div>
            </div>
          </div>
        )}
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="mt-8">
          <h3 className="section-title mb-3">Just resolved</h3>
          <div className="flex flex-col gap-2">
            {resolved.map((ap) => (
              <div
                key={ap.id}
                className="apple-card p-3 flex items-center gap-3"
                style={{ background: "#FAFAFC" }}
              >
                {ap.status === "approved" ? (
                  <span className="pill pill-ok"><Check className="w-3 h-3" /> done</span>
                ) : (
                  <span className="pill pill-bad"><X className="w-3 h-3" /> rejected</span>
                )}
                <span className="apple-caption flex-1">{ap.workflowTag} · {ap.headline}</span>
                <span className="apple-fine ml-auto shrink-0">
                  {ap.decidedAt ? ap.decidedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "just now"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category-specific modal */}
      <CategoryModal
        approval={openApproval}
        onClose={() => setOpenId(null)}
        onApprove={(id) => approve(id)}
      />
    </div>
  );
}

function ApprovalCard({
  ap, onApprove, onReject, onOpen,
}: {
  ap: MockApproval;
  onApprove: () => void;
  onReject: () => void;
  onOpen: () => void;
}) {
  const Icon = ap.approveIcon === "send" ? Send : Check;
  return (
    <div className="apple-card p-5">
      <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6 ${ap.lineItems ? "mb-3" : ""}`}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="pill pill-ai">
              <Sparkles className="w-3 h-3" /> {ap.workflowTag}
            </span>
            <span className="apple-fine">{ap.meta}</span>
          </div>
          <div className="apple-tagline resp-wrap" style={{ fontSize: 17 }}>{ap.headline}</div>
          <div className="apple-body mt-1 resp-wrap" style={{ color: "#333333" }}>{ap.detail}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button onClick={onReject} className="btn btn-ghost btn-sm" style={{ color: "#9A2D24" }} title="Reject">
            <X className="w-3.5 h-3.5" />
          </button>
          <button onClick={onOpen} className="btn btn-secondary btn-sm">
            <Pencil className="w-3.5 h-3.5" /> {ap.openLabel}
          </button>
          <button onClick={onApprove} className="btn btn-primary btn-sm">
            <Icon className="w-3.5 h-3.5" /> {ap.approveLabel}
          </button>
        </div>
      </div>

      {ap.lineItems && (
        <div
          className="rounded-[12px] px-4 py-1"
          style={{ background: "#FAFAFC", border: "1px solid #E0E0E0" }}
        >
          {ap.lineItems.map((li, i) => (
            <LineItemRow
              key={i}
              li={li}
              isPO={ap.category === "po"}
              isFirst={i === 0}
              onClick={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LineItemRow({
  li, isPO, isFirst, onClick,
}: { li: ApprovalLineItem; isPO: boolean; isFirst: boolean; onClick: () => void }) {
  if (isPO) {
    return (
      <div
        className="grid items-center py-[10px] cursor-pointer resp-row"
        style={{
          gridTemplateColumns: "2fr 0.9fr 0.9fr 0.8fr",
          borderTop: isFirst ? "none" : "1px solid #F0F0F0",
        }}
        onClick={onClick}
      >
        <div className="apple-caption-strong resp-wrap">{li.primary}</div>
        <div className="apple-fine">{li.stockNote}</div>
        <div className="apple-fine text-right">{li.detail}</div>
        <div className="apple-caption-strong tnum text-right">{li.value}</div>
      </div>
    );
  }
  return (
    <div
      className="grid items-center py-[10px] cursor-pointer hover:bg-[rgba(0,0,0,0.02)] -mx-2 px-2 rounded-[6px] transition-colors resp-row"
      style={{
        gridTemplateColumns: "1.5fr 1.7fr 0.8fr 0.8fr",
        borderTop: isFirst ? "none" : "1px solid #F0F0F0",
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="apple-caption-strong resp-wrap">{li.primary}</span>
        {li.tag && <span className="pill pill-line">{li.tag}</span>}
      </div>
      <div className="apple-fine resp-wrap">{li.detail}</div>
      <div className="apple-caption-strong tnum">{li.value}</div>
      <div className="apple-fine text-right">{li.caption}</div>
    </div>
  );
}
