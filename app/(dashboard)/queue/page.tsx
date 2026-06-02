"use client";

import { useState } from "react";
import { Check, X, Pencil, Sparkles, CheckCircle2 } from "lucide-react";
import { useApprovals } from "@/lib/mock/approvals";
import { Modal, ModalActions } from "@/lib/ui/modal";
import { PageHeader } from "@/lib/ui/page-header";

const CATEGORY_COLOR: Record<string, string> = {
  quote:   "#0066CC",
  reply:   "#1E5277",
  po:      "#727680",
  finance: "#8A5A12",
  comms:   "#1E5277",
  payroll: "#0066CC",
  ops:     "#727680",
};

const CATEGORY_LABEL: Record<string, string> = {
  quote:   "Quotes",
  reply:   "Replies",
  po:      "Purchase orders",
  finance: "Finance",
  comms:   "Comms",
  payroll: "Payroll",
  ops:     "Operations",
};

type FilterKey = "all" | "quote" | "reply" | "po" | "finance" | "payroll";

export default function QueuePage() {
  const { approvals, approve, reject, edit, pendingCount } = useApprovals();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const pending = approvals.filter((a) =>
    a.status === "pending" && (filter === "all" || a.category === filter)
  );
  const resolved = approvals.filter((a) => a.status !== "pending");

  function openEdit(id: string, current: string) {
    setEditingId(id);
    setEditText(current);
  }

  function saveEdit() {
    if (editingId) {
      edit(editingId, editText);
      approve(editingId);
    }
    setEditingId(null);
  }

  const editingApproval = approvals.find((a) => a.id === editingId);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all",     label: "All" },
    { key: "quote",   label: "Quotes" },
    { key: "reply",   label: "Replies" },
    { key: "po",      label: "Purchase orders" },
    { key: "finance", label: "Finance" },
    { key: "payroll", label: "Payroll" },
  ];

  const allPending = approvals.filter((a) => a.status === "pending");

  return (
    <div className="px-8 py-6 min-h-screen" style={{ background: "#F6F4EE" }}>
      <PageHeader
        title="Approval queue"
        subtitle={
          pendingCount > 0
            ? `${pendingCount} action${pendingCount === 1 ? "" : "s"} waiting — nothing is sent until you approve`
            : "All clear — nothing waiting for approval"
        }
      />

      {/* Filter pills + bulk actions */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {filters.map(({ key, label }) => {
            const count = key === "all"
              ? allPending.length
              : allPending.filter((a) => a.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={[
                  "h-[30px] px-3 rounded-full text-[12.5px] font-medium transition-colors",
                  filter === key
                    ? "bg-ink text-on-dark"
                    : "bg-surface-soft text-ink hover:bg-hairline-light",
                ].join(" ")}
              >
                {label}
                {count > 0 && (
                  <span className={`ml-1.5 ${filter === key ? "text-on-dark/60" : "text-stone"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {allPending.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => allPending.forEach((a) => reject(a.id))}
              className="h-[30px] px-4 rounded-full text-[12.5px] font-semibold text-danger hover:bg-danger-bg transition-colors"
            >
              Reject all
            </button>
            <button
              onClick={() => allPending.forEach((a) => approve(a.id))}
              className="h-[30px] px-4 rounded-full text-[12.5px] font-semibold bg-ink text-on-dark hover:opacity-80 transition-opacity"
            >
              Approve all {allPending.length}
            </button>
          </div>
        )}
      </div>

      {/* Pending items */}
      {pending.length > 0 ? (
        <div className="flex flex-col gap-4 mb-8">
          {pending.map((ap) => (
            <div
              key={ap.id}
              className="bg-surface-card border border-hairline-light rounded-[20px] p-5"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 h-[22px] px-[9px] rounded-full text-[11.5px] font-medium bg-surface-soft text-ink">
                      <Sparkles className="w-3 h-3" style={{ color: CATEGORY_COLOR[ap.category] }} />
                      {ap.workflowTag}
                    </span>
                    <span
                      className="inline-flex items-center h-[20px] px-2 rounded-full text-[10.5px] font-medium"
                      style={{
                        background: `${CATEGORY_COLOR[ap.category]}18`,
                        color: CATEGORY_COLOR[ap.category],
                      }}
                    >
                      {CATEGORY_LABEL[ap.category]}
                    </span>
                    <span className="text-[12.5px] text-stone">{ap.meta}</span>
                  </div>
                  <div className="text-[14px] font-semibold text-ink">{ap.headline}</div>
                  <div className="text-[13px] text-stone mt-1.5 leading-snug max-w-prose">{ap.detail}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(ap.id, ap.editedContent ?? ap.detail)}
                    className="flex items-center gap-1 h-[30px] px-3 rounded-full text-[12.5px] font-semibold bg-surface-soft text-ink hover:bg-hairline-soft transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> {ap.openLabel}
                  </button>
                  <button
                    onClick={() => reject(ap.id)}
                    className="flex items-center gap-1 h-[30px] px-3 rounded-full text-[12.5px] font-semibold text-danger hover:bg-danger-bg transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => approve(ap.id)}
                    className="flex items-center gap-1.5 h-[30px] px-4 rounded-full text-[12.5px] font-semibold bg-ink text-on-dark hover:opacity-80 transition-opacity"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {ap.approveLabel}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-success-bg border border-success/20 rounded-[20px] p-6 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-success">
              {filter === "all" ? "Queue is clear" : `No ${CATEGORY_LABEL[filter] ?? filter} items pending`}
            </div>
            <div className="text-[12.5px] text-stone mt-0.5">
              {filter === "all"
                ? `All ${approvals.length} actions reviewed today.`
                : `Switch to "All" to see other categories.`}
            </div>
          </div>
        </div>
      )}

      {/* Resolved today */}
      {resolved.length > 0 && (
        <div>
          <h3 className="text-[15px] font-semibold mb-3 text-stone">Resolved today</h3>
          <div className="flex flex-col gap-2">
            {resolved.map((ap) => (
              <div
                key={ap.id}
                className="flex items-center gap-3 rounded-[16px] p-3 border border-hairline-light bg-surface-soft"
              >
                {ap.status === "approved" ? (
                  <span className="inline-flex items-center gap-1.5 h-[22px] px-[9px] rounded-full text-[11.5px] font-medium bg-success-bg text-success shrink-0">
                    <Check className="w-3 h-3" /> approved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 h-[22px] px-[9px] rounded-full text-[11.5px] font-medium bg-danger-bg text-danger shrink-0">
                    <X className="w-3 h-3" /> rejected
                  </span>
                )}
                <span
                  className="inline-flex items-center gap-1 text-[11.5px] font-medium shrink-0"
                  style={{ color: CATEGORY_COLOR[ap.category] }}
                >
                  <Sparkles className="w-3 h-3" /> {ap.workflowTag}
                </span>
                <span className="text-[13px] text-ink font-medium truncate flex-1">— {ap.headline}</span>
                <span className="text-[12.5px] text-stone ml-auto shrink-0">
                  {ap.decidedAt
                    ? ap.decidedAt.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" })
                    : "just now"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit modal */}
      <Modal
        open={!!editingId}
        onClose={() => setEditingId(null)}
        title={`Edit · ${editingApproval?.workflowTag ?? ""}`}
        width="640px"
      >
        {editingApproval && (
          <div className="space-y-4">
            <div>
              <div className="text-[12.5px] text-stone mb-1">Action</div>
              <div className="text-[14px] font-medium text-ink">{editingApproval.headline}</div>
            </div>
            <div>
              <div className="text-[12.5px] text-stone mb-2">Edit content before approving</div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={8}
                className="w-full rounded-[12px] border border-hairline-light bg-canvas-light px-4 py-3 text-[14px] text-ink resize-none outline-none focus:border-ink"
              />
            </div>
          </div>
        )}
        <ModalActions>
          <button
            onClick={() => setEditingId(null)}
            className="h-[36px] px-4 rounded-full text-[13.5px] font-semibold text-ink hover:bg-surface-soft transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { reject(editingId!); setEditingId(null); }}
            className="h-[36px] px-4 rounded-full text-[13.5px] font-semibold text-danger hover:bg-danger-bg transition-colors"
          >
            Reject
          </button>
          <button
            onClick={saveEdit}
            className="h-[36px] px-4 rounded-full text-[13.5px] font-semibold bg-ink text-on-dark hover:opacity-80 transition-opacity"
          >
            Save &amp; approve
          </button>
        </ModalActions>
      </Modal>
    </div>
  );
}
