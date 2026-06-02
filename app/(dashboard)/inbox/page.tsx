"use client";

import { useState } from "react";
import {
  Search, Mail, Globe, Instagram, Phone, UserPlus,
  Archive, Clock, Flag, Sparkles, Pencil, Send, Reply, Check,
  RefreshCw, X, Link2,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { Modal } from "@/lib/ui/modal";
import { useCompany } from "@/lib/mock/company-context";
import type { InboxItem } from "@/lib/mock/companies/types";

type Filter = "all" | "unread" | "drafted" | "trade" | "retail" | "supplier";

const CHANNEL_ICON: Record<InboxItem["channel"], React.ElementType> = {
  "Email": Mail,
  "Web form": Globe,
  "Instagram DM": Instagram,
  "Voicemail": Phone,
  "HubSpot": UserPlus,
};

function ChannelChip({ channel }: { channel: InboxItem["channel"] }) {
  const Icon = CHANNEL_ICON[channel];
  return (
    <span className="pill pill-soft">
      <Icon className="w-3 h-3" /> {channel}
    </span>
  );
}

export default function InboxPage() {
  const { company } = useCompany();
  const [filter, setFilter] = useState<Filter>("all");
  const [items, setItems] = useState<InboxItem[]>(company.inbox);
  const [selectedId, setSelectedId] = useState<string>(company.inbox[0]?.id ?? "");
  const [read, setRead] = useState<Set<string>>(new Set());

  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [composingId, setComposingId] = useState<string | null>(null);
  const [composeText, setComposeText] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [draftingId, setDraftingId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItems = items.filter((it) => it.status === "active");
  const unread  = activeItems.filter((it) => it.unread && !read.has(it.id));
  const drafted = activeItems.filter((it) => !!it.draft);

  const visible = activeItems.filter((it) => {
    if (filter === "unread")   return it.unread && !read.has(it.id);
    if (filter === "drafted")  return !!it.draft;
    if (filter === "trade")    return it.kind === "trade";
    if (filter === "retail")   return it.kind === "retail";
    if (filter === "supplier") return it.kind === "supplier";
    return true;
  });

  const selected = items.find((it) => it.id === selectedId) ?? null;

  function select(id: string) {
    setSelectedId(id);
    setRead((prev) => new Set([...prev, id]));
    setEditingDraftId(null);
    setComposingId(null);
    setMobileOpen(true);
  }
  function openEdit(id: string, current: string) {
    setEditingDraftId(id); setEditText(current); setComposingId(null);
  }
  function openCompose(id: string) {
    setComposingId(id); setComposeText(""); setEditingDraftId(null);
  }
  function saveEdit(id: string) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, draft: editText } : it));
    setEditingDraftId(null);
  }
  function sendDraft(id: string) {
    setSendingId(id);
    setTimeout(() => {
      setItems((prev) => prev.map((it) => it.id === id ? { ...it, status: "sent", draft: null } : it));
      setSendingId(null); setEditingDraftId(null); setComposingId(null);
      const remaining = items.filter((it) => it.id !== id && it.status === "active");
      if (remaining.length > 0) setSelectedId(remaining[0].id);
    }, 900);
  }
  function sendCompose(id: string) {
    if (!composeText.trim()) return;
    setSendingId(id);
    setTimeout(() => {
      setItems((prev) => prev.map((it) => it.id === id ? { ...it, status: "sent", draft: null } : it));
      setSendingId(null); setComposingId(null);
      const remaining = items.filter((it) => it.id !== id && it.status === "active");
      if (remaining.length > 0) setSelectedId(remaining[0].id);
    }, 900);
  }
  function markDone(id: string) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, status: "done" } : it));
    const remaining = items.filter((it) => it.id !== id && it.status === "active");
    if (remaining.length > 0) setSelectedId(remaining[0].id);
  }
  function askClaude(id: string) {
    setDraftingId(id);
    setTimeout(() => {
      const m = company.inboxDrafts[id] ?? {
        draft: `Hi,\n\nThanks for your message. I'll get back to you shortly.\n\nBest,\n${company.name}`,
        sources: [],
      };
      setItems((prev) => prev.map((it) => it.id === id ? { ...it, draft: m.draft, sources: m.sources } : it));
      setDraftingId(null);
    }, 1600);
  }

  const FILTERS: { id: Filter; label: string; count?: number }[] = [
    { id: "all",      label: "All",       count: activeItems.length },
    { id: "unread",   label: "Unread",     count: unread.length },
    { id: "drafted",  label: "Drafted",    count: drafted.length },
    { id: "trade",    label: "Trade" },
    { id: "retail",   label: "Retail" },
    { id: "supplier", label: "Suppliers" },
  ];

  const isEditing   = editingDraftId === selectedId;
  const isComposing = composingId === selectedId;
  const isSending   = sendingId === selectedId;
  const isDrafting  = draftingId === selectedId;

  function ReplyArea() {
    if (!selected) return null;
    return selected.draft ? (
      <div className="v3-card p-5" style={{ background: "#FAFAF7" }}>
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span className="pill pill-ai">
            <Sparkles className="w-3 h-3" /> Claude&apos;s draft
          </span>
          <span className="faint-text">warm tone · matches your past replies</span>
        </div>

        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={6}
            className="w-full v3-input resize-none"
            style={{ height: "auto", padding: "10px 12px", background: "#fff" }}
            autoFocus
          />
        ) : (
          <div className="body-text" style={{ whiteSpace: "pre-wrap", color: "#191C21" }}>
            {selected.draft}
          </div>
        )}

        {selected.sources.length > 0 && !isEditing && (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid #E7E5DE" }}>
            <div
              className="faint-text mb-2"
              style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}
            >
              Based on
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selected.sources.map((s, i) => (
                <span key={i} className="src-chip">
                  <Link2 className="w-3 h-3" /> {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #E7E5DE" }}>
          <button onClick={() => openCompose(selected.id)} className="btn btn-ghost btn-sm">
            Write my own
          </button>
          <div className="flex gap-2 flex-wrap">
            {isEditing ? (
              <>
                <button onClick={() => setEditingDraftId(null)} className="btn btn-ghost btn-sm">
                  <X className="w-3 h-3" /> Cancel
                </button>
                <button onClick={() => saveEdit(selected.id)} className="btn btn-secondary btn-sm">
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
              </>
            ) : (
              <button onClick={() => openEdit(selected.id, selected.draft!)} className="btn btn-secondary btn-sm">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            <button onClick={() => sendDraft(selected.id)} disabled={isSending} className="btn btn-accent btn-sm">
              {isSending
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</>
                : <><Send className="w-3.5 h-3.5" /> Send</>
              }
            </button>
          </div>
        </div>
      </div>
    ) : isComposing ? (
      <div className="v3-card p-5" style={{ background: "#FAFAF7" }}>
        <div className="flex items-center gap-2 mb-3">
          <Reply className="w-3.5 h-3.5" style={{ color: "#727680" }} />
          <span className="muted-text" style={{ fontWeight: 500 }}>Write reply</span>
        </div>
        <textarea
          value={composeText}
          onChange={(e) => setComposeText(e.target.value)}
          placeholder="Type your reply…"
          rows={5}
          className="w-full v3-input resize-none"
          style={{ height: "auto", padding: "10px 12px", background: "#fff" }}
          autoFocus
        />
        <div className="flex items-center justify-end gap-2 mt-3 flex-wrap">
          <button onClick={() => setComposingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
          <button onClick={() => sendCompose(selected.id)} disabled={isSending || !composeText.trim()} className="btn btn-accent btn-sm">
            {isSending
              ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</>
              : <><Send className="w-3.5 h-3.5" /> Send</>
            }
          </button>
        </div>
      </div>
    ) : (
      <div className="v3-card p-5" style={{ background: "#FAFAF7" }}>
        <div className="muted-text mb-3">
          {isDrafting
            ? "Claude is drafting a reply…"
            : selected.noDraftReason
              ? selected.noDraftReason
              : "No draft yet — Claude wasn't confident enough to answer this without you."}
        </div>
        <div className="flex items-center justify-end gap-2 flex-wrap">
          <button onClick={() => markDone(selected.id)} className="btn btn-ghost btn-sm">
            <Check className="w-3 h-3" /> Mark done
          </button>
          <button onClick={() => askClaude(selected.id)} disabled={isDrafting} className="btn btn-secondary btn-sm">
            {isDrafting
              ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Drafting…</>
              : <><Sparkles className="w-3.5 h-3.5" /> Ask Claude to draft</>
            }
          </button>
          <button onClick={() => openCompose(selected.id)} className="btn btn-accent btn-sm">
            <Reply className="w-3.5 h-3.5" /> Reply
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Inbox" subtitle={`${activeItems.length} threads · ${unread.length} unread`} />

      <div className="px-4 sm:px-8 py-7 max-w-[1320px] mx-auto">
        <div className="mb-5">
          <p className="body-text">
            One thread per customer or supplier — email, web, social and voicemail in one place. Claude
            drafts when it&apos;s confident, and always shows its working.
          </p>
        </div>

        <div className="v3-card overflow-hidden" style={{ height: "calc(100vh - 230px)", minHeight: 600 }}>
          <div className="grid h-full grid-cols-1 lg:grid-cols-[348px_1fr]">

            {/* Left pane */}
            <div className="flex flex-col" style={{ borderRight: "1px solid #E7E5DE" }}>
              <div className="p-3" style={{ borderBottom: "1px solid #E7E5DE" }}>
                <div className="relative">
                  <Search className="w-4 h-4 absolute" style={{ left: 10, top: 10, color: "#727680" }} />
                  <input className="v3-input w-full" style={{ paddingLeft: 32 }} placeholder="Search messages, customers, orders…" />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`fpill ${filter === f.id ? "active" : ""}`}
                    >
                      {f.label}
                      {f.count != null && f.count > 0 && <span style={{ opacity: 0.6 }}>{f.count}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="scroll-y flex-1">
                {visible.map((it) => {
                  const isUnread = it.unread && !read.has(it.id);
                  const isSel = it.id === selectedId;
                  return (
                    <div
                      key={it.id}
                      onClick={() => select(it.id)}
                      style={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #EEEDE7",
                        cursor: "pointer",
                        background: isSel ? "#E8F0FB" : undefined,
                        boxShadow: isSel ? "inset 3px 0 0 #0066CC" : undefined,
                        transition: "background .1s",
                      }}
                      onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = "#FAFAF7"; }}
                      onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = ""; }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0"
                          style={{ background: "#EEEDE7", color: "#191C21", fontSize: 11, fontWeight: 600 }}
                        >
                          {it.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div
                              className="truncate"
                              style={{
                                fontSize: 13,
                                fontWeight: isUnread ? 600 : 500,
                                color: isUnread ? "#191C21" : "#3B414B",
                              }}
                            >
                              {it.sender}
                            </div>
                            <div className="faint-text shrink-0">{it.time}</div>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <ChannelChip channel={it.channel} />
                            {it.draft && (
                              <span className="pill pill-ai">
                                <Sparkles className="w-3 h-3" /> draft ready
                              </span>
                            )}
                          </div>
                          <div className="faint-text mt-1.5 truncate">{it.preview}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {visible.length === 0 && <div className="muted-text p-8 text-center">Nothing here.</div>}
              </div>
            </div>

            {/* Right pane (desktop only — mobile uses a popup) */}
            <div className="hidden lg:flex flex-col overflow-hidden">
              {selected ? (
                <>
                  {/* Header */}
                  <div className="px-7 pt-6 pb-4 shrink-0" style={{ borderBottom: "1px solid #E7E5DE" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-[7px] flex items-center justify-center shrink-0"
                          style={{ background: "#EEEDE7", color: "#191C21", fontSize: 12, fontWeight: 600 }}
                        >
                          {selected.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#191C21" }}>{selected.sender}</div>
                          <div className="faint-text flex items-center gap-2 mt-0.5">
                            <ChannelChip channel={selected.channel} /> <span>·</span> {selected.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => markDone(selected.id)} className="btn btn-ghost btn-sm" title="Archive">
                          <Archive className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm" title="Snooze"><Clock className="w-4 h-4" /></button>
                        <button className="btn btn-ghost btn-sm" title="Flag"><Flag className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h3 className="h3 mt-4">{selected.subject}</h3>
                  </div>

                  {/* Body */}
                  <div
                    className="px-7 py-6 body-text flex-1 overflow-y-auto min-h-0"
                    style={{ whiteSpace: "pre-wrap", color: "#191C21" }}
                  >
                    {selected.body}
                  </div>

                  {/* Reply area */}
                  <div className="px-7 pb-7 shrink-0">
                    <ReplyArea />
                  </div>
                </>
              ) : (
                <div className="muted-text p-8">Select a message.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only thread popup */}
      <div className="lg:hidden">
        <Modal
          open={mobileOpen && selected != null}
          onClose={() => setMobileOpen(false)}
          title={selected?.sender ?? "Message"}
          width="560px"
        >
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center flex-wrap gap-2">
                <ChannelChip channel={selected.channel} />
                <span className="faint-text">{selected.time}</span>
              </div>
              <h3 className="h3 resp-wrap">{selected.subject}</h3>
              <div
                className="body-text"
                style={{ whiteSpace: "pre-wrap", color: "#191C21" }}
              >
                {selected.body}
              </div>
              <ReplyArea />
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
