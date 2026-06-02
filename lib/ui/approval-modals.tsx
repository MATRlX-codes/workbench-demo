"use client";

/**
 * Dedicated, category-specific modals for the Today approval queue.
 *
 * Each modal mounts when its corresponding approval card opens — they
 * show the exact draft email / line items / data, let the user edit,
 * and produce a final "approve & send" action.
 */

import { useState, useEffect } from "react";
import {
  Check, X, Send, Pencil, RefreshCw, Plus, Mail, ArrowLeft,
  AlertTriangle, FileText, ChevronRight,
} from "lucide-react";
import { Modal, ModalActions } from "@/lib/ui/modal";
import type { MockApproval } from "@/lib/mock/approvals";

/* ───────────────────────────────────────────────────────────────
   1. Quote follow-up modal
   Shows the 5 quote rows. Clicking one drills into an editable
   email draft. "Approve all" sends every draft as a batch.
   ─────────────────────────────────────────────────────────────── */

interface QuoteDraft {
  id: string;
  customer: string;
  product: string;
  value: string;
  sent: string;
  subject: string;
  body: string;
  selected?: boolean;
}

const QUOTE_DRAFTS: QuoteDraft[] = [
  {
    id: "q1",
    customer: "Halpin Builders",
    product: "38m² Carrara SPC + colour-match trims",
    value: "£2,940",
    sent: "4d ago",
    subject: "Carrara SPC quote — happy to talk through anything",
    body:
`Hi Paul,

Just a gentle nudge on the Carrara SPC quote (SO-4471) I sent over earlier in the week — happy to walk through any of it, change the spec, or pencil in a fitting slot the moment you're ready.

If timing's the question, w/c 9 June is still open for the install team.

Best,
Dean — Northgate Surfaces`,
  },
  {
    id: "q2",
    customer: "Meadowcroft Lettings",
    product: "3 flats · LVT supply & fit",
    value: "£5,600",
    sent: "3d ago",
    subject: "3-flat LVT package — anything you'd like to adjust?",
    body:
`Hi Greg,

Following up on the three-flat LVT package — any feedback or changes you'd like? I can split the schedule across two visits if it's easier for the tenants, and the trade price stands at the same rate for the next four flats too.

Best,
Dean`,
  },
  {
    id: "q3",
    customer: "K. Brennan Bathrooms",
    product: "Ceiling cladding · 12 packs",
    value: "£1,180",
    sent: "5d ago",
    subject: "Ceiling cladding · 12 packs",
    body:
`Hi Kevin,

Quick check-in on the ceiling cladding order. Stock's healthy at the moment so I can hold it for you for another week. Want me to set aside?

Cheers,
Dean`,
  },
  {
    id: "q4",
    customer: "The Granary Café",
    product: "Shower & splash wall panels",
    value: "£1,420",
    sent: "7d ago",
    subject: "Splash panels for The Granary",
    body:
`Hi Sam,

Hope the café's busy! Just nudging the panel quote — fully waterproof, no tile maintenance, and the white-marble finish you liked is in stock.

Happy to drop in with the sample board again if helpful.

Dean`,
  },
  {
    id: "q5",
    customer: "Mrs P. Okafor",
    product: "Marble-effect bathroom panels",
    value: "£680",
    sent: "6d ago",
    subject: "Marble bathroom panels · still happy to help",
    body:
`Hi Mrs Okafor,

Just a friendly nudge on the marble-effect bathroom panels. No pressure — and if you'd like a free home measure rather than working from the dimensions you gave us, I can have Mark out next week.

Warm regards,
Dean`,
  },
];

export function QuoteFollowUpModal({
  open, onClose, onApproveAll,
}: { open: boolean; onClose: () => void; onApproveAll: () => void }) {
  const [drafts, setDrafts] = useState<QuoteDraft[]>(QUOTE_DRAFTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      setDrafts(QUOTE_DRAFTS);
      setEditingId(null);
      setSent(false);
      setSkipped(new Set());
    }
  }, [open]);

  const editing = drafts.find((d) => d.id === editingId);
  const activeCount = drafts.length - skipped.size;

  function openEdit(d: QuoteDraft) {
    setEditingId(d.id);
    setEditBody(d.body);
    setEditSubject(d.subject);
  }
  function saveEdit() {
    setDrafts((prev) => prev.map((d) => d.id === editingId ? { ...d, body: editBody, subject: editSubject } : d));
    setEditingId(null);
  }
  function toggleSkip(id: string) {
    setSkipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function sendAll() {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1300);
  }
  function done() {
    onApproveAll();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? `Edit · ${editing.customer}` : sent ? "Sent" : "Quote follow-ups · 5 drafts"}
      width="720px"
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="apple-tagline">{activeCount} nudges sent</div>
          <div className="apple-caption">Tracking replies in Inbox · auto-archive in 14 days if no response</div>
        </div>
      ) : editing ? (
        <div className="space-y-4">
          <button
            onClick={() => setEditingId(null)}
            className="apple-caption flex items-center gap-1.5 hover:underline"
            style={{ color: "#0066CC" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all 5
          </button>
          <div className="apple-card p-3 space-y-1">
            <div className="apple-fine">To</div>
            <div className="apple-caption-strong">{editing.customer}</div>
            <div className="apple-fine mt-2">Re</div>
            <div className="apple-caption">{editing.product} · {editing.value} · sent {editing.sent}</div>
          </div>
          <div>
            <div className="apple-fine mb-1">Subject</div>
            <input
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              className="apple-input w-full"
            />
          </div>
          <div>
            <div className="apple-fine mb-1">Body</div>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={10}
              className="apple-input-rect"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="apple-caption">{activeCount} of 5 will go now. Skip any you'd rather hold back, click any row to edit the draft.</div>
          {drafts.map((d) => {
            const isSkipped = skipped.has(d.id);
            return (
              <div
                key={d.id}
                className="rounded-[12px] flex items-center gap-3 p-3"
                style={{
                  background: isSkipped ? "#F5F5F7" : "#FFFFFF",
                  border: "1px solid " + (isSkipped ? "#E0E0E0" : "rgba(0,102,204,0.16)"),
                  opacity: isSkipped ? 0.55 : 1,
                }}
              >
                <button
                  onClick={() => toggleSkip(d.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: isSkipped ? "transparent" : "#0066CC",
                    border: "1px solid " + (isSkipped ? "#86868B" : "#0066CC"),
                    color: "#fff",
                  }}
                  title={isSkipped ? "Include in send" : "Skip this one"}
                >
                  {!isSkipped && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openEdit(d)}>
                  <div className="apple-caption-strong">{d.customer}</div>
                  <div className="apple-fine truncate">{d.product} · {d.value} · sent {d.sent}</div>
                </div>
                <button
                  onClick={() => openEdit(d)}
                  className="btn btn-pearl"
                  style={{ height: 30 }}
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ModalActions>
        {sent ? (
          <button onClick={done} className="btn btn-primary btn-sm">Done</button>
        ) : editing ? (
          <>
            <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
            <button onClick={saveEdit} className="btn btn-primary btn-sm"><Check className="w-3.5 h-3.5" /> Save changes</button>
          </>
        ) : (
          <>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
            <button
              onClick={sendAll}
              disabled={sending || activeCount === 0}
              className="btn btn-primary btn-sm"
            >
              {sending
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</>
                : <><Send className="w-3.5 h-3.5" /> Send {activeCount} {activeCount === 1 ? "nudge" : "nudges"}</>
              }
            </button>
          </>
        )}
      </ModalActions>
    </Modal>
  );
}

/* ───────────────────────────────────────────────────────────────
   2. Customer reply modal — Halpin Builders thread
   Shows the prior thread + the proposed reply preview.
   ─────────────────────────────────────────────────────────────── */

interface ThreadMsg {
  from: string;
  email: string;
  to: string;
  date: string;
  body: string;
  inbound?: boolean;
}

const HALPIN_THREAD: ThreadMsg[] = [
  {
    from: "Dean Foster",
    email: "dean@northgate-surfaces.co.uk",
    to: "Paul Halpin <paul@halpin-builders.co.uk>",
    date: "Mon 26 May · 14:22",
    body:
`Hi Paul,

As discussed on site, here's the formal quote (SO-4471):

· 38m² Carrara Marble SPC flooring (20 packs)
· Colour-match end & corner trims (12 lengths)
· Acoustic underlay
· Supply & fit, 2 days, fitting team B

All-in: £2,940 + VAT. Standard 5-working-day lead on the stock.

Let me know if you'd like to proceed or change anything.

Dean`,
  },
  {
    from: "Paul Halpin",
    email: "paul@halpin-builders.co.uk",
    to: "Dean Foster <dean@northgate-surfaces.co.uk>",
    date: "Wed 28 May · 16:48",
    body:
`Dean,

That all looks good. Client's happy with the Carrara and the price. Two questions:

1) What's the lead time on the actual stock — we're tight on the wider programme.
2) Could your team fit it the week commencing 9 June? That'd dovetail with the plasterers finishing on the 6th.

Cheers,
Paul`,
    inbound: true,
  },
];

const HALPIN_DRAFT_INITIAL =
`Hi Paul,

Great news. The Carrara SPC is a 5-working-day lead, so ordering today lands it with us well before the 9th — comfortably.

I can pencil fitting team B in for Tue 10–Wed 11 June. That gives you Mon 9 for any tile/skirting prep and leaves the back end of the week clean.

To lock the stock and the slot, could we take the usual 30% deposit (£882)? I'll send the order confirmation the moment that's in.

Best,
Dean — Northgate Surfaces`;

export function CustomerReplyModal({
  open, onClose, onSend,
}: { open: boolean; onClose: () => void; onSend: () => void }) {
  const [view, setView] = useState<"thread" | "preview" | "edit">("thread");
  const [draft, setDraft] = useState(HALPIN_DRAFT_INITIAL);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setView("thread");
      setDraft(HALPIN_DRAFT_INITIAL);
      setSent(false);
    }
  }, [open]);

  function send() {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1100);
  }
  function done() { onSend(); onClose(); }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        sent ? "Reply sent" :
        view === "edit" ? "Edit reply" :
        view === "preview" ? "Send reply · review" :
        "Halpin Builders · thread"
      }
      width="720px"
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="apple-tagline">Reply sent to Paul Halpin</div>
          <div className="apple-caption">Logged on the Halpin Builders record · linked to SO-4471</div>
        </div>
      ) : view === "thread" ? (
        <div className="space-y-3">
          <div className="apple-caption">
            <Mail className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            2 messages with Paul Halpin · linked to quote SO-4471
          </div>
          {HALPIN_THREAD.map((m, i) => (
            <div
              key={i}
              className="rounded-[12px] p-4"
              style={{
                background: m.inbound ? "#FFFFFF" : "#F5F5F7",
                border: "1px solid #E0E0E0",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="apple-caption-strong">{m.from}</div>
                <div className="apple-fine">{m.date}</div>
              </div>
              <div className="apple-fine mb-2">To: {m.to}</div>
              <div className="apple-body whitespace-pre-wrap">{m.body}</div>
            </div>
          ))}
          <div
            className="rounded-[12px] p-4"
            style={{ background: "rgba(0,102,204,0.04)", border: "1px dashed #0066CC" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="pill pill-ai"><Pencil className="w-3 h-3" /> Claude's draft reply</span>
              <span className="apple-fine">17 lines · matches Dean's tone in past Halpin replies</span>
            </div>
            <div className="apple-body whitespace-pre-wrap" style={{ color: "#1D1D1F" }}>
              {draft.slice(0, 220)}{draft.length > 220 ? "…" : ""}
            </div>
          </div>
        </div>
      ) : view === "edit" ? (
        <div className="space-y-3">
          <div className="apple-caption">Edit the reply body. Subject, signature and recipient stay as-is.</div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={14}
            className="apple-input-rect"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      ) : (
        // preview
        <div className="space-y-4">
          <div className="apple-card p-3 space-y-1">
            <div className="grid" style={{ gridTemplateColumns: "70px 1fr", rowGap: 4 }}>
              <div className="apple-fine">From</div>
              <div className="apple-caption">Dean Foster &lt;dean@northgate-surfaces.co.uk&gt;</div>
              <div className="apple-fine">To</div>
              <div className="apple-caption">Paul Halpin &lt;paul@halpin-builders.co.uk&gt;</div>
              <div className="apple-fine">Subject</div>
              <div className="apple-caption-strong">Re: Carrara SPC quote (SO-4471)</div>
            </div>
          </div>
          <div className="apple-card p-4">
            <div className="apple-body whitespace-pre-wrap">{draft}</div>
          </div>
          <div className="apple-fine">
            On send: logged to Inbox · attached to SO-4471 · auto-creates a deposit-pending task.
          </div>
        </div>
      )}

      <ModalActions>
        {sent ? (
          <button onClick={done} className="btn btn-primary btn-sm">Done</button>
        ) : view === "thread" ? (
          <>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Close</button>
            <button onClick={() => setView("edit")} className="btn btn-pearl"><Pencil className="w-3.5 h-3.5" /> Edit reply</button>
            <button onClick={() => setView("preview")} className="btn btn-primary btn-sm">Review &amp; send <ChevronRight className="w-3.5 h-3.5" /></button>
          </>
        ) : view === "edit" ? (
          <>
            <button onClick={() => setView("thread")} className="btn btn-ghost btn-sm">Cancel</button>
            <button onClick={() => setView("preview")} className="btn btn-primary btn-sm"><Check className="w-3.5 h-3.5" /> Save &amp; review</button>
          </>
        ) : (
          <>
            <button onClick={() => setView("edit")} className="btn btn-pearl"><Pencil className="w-3.5 h-3.5" /> Edit</button>
            <button onClick={() => setView("thread")} className="btn btn-ghost btn-sm">Back to thread</button>
            <button onClick={send} disabled={sending} className="btn btn-primary btn-sm">
              {sending ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</> : <><Send className="w-3.5 h-3.5" /> Send reply</>}
            </button>
          </>
        )}
      </ModalActions>
    </Modal>
  );
}

/* ───────────────────────────────────────────────────────────────
   3. Purchase Order modal — PO-2214
   Editable line items + qty/price + total.
   ─────────────────────────────────────────────────────────────── */

interface POLine {
  id: string;
  sku: string;
  name: string;
  onHand: number;
  qty: number;
  unitPrice: number;
}

const PO_INITIAL: POLine[] = [
  { id: "po-1", sku: "FLR-CARRARA-SPC", name: "Carrara SPC flooring · 1.86m²/pack",  onHand: 11, qty: 60, unitPrice: 29.00 },
  { id: "po-2", sku: "TR-EM-WH-2.6",    name: "Colour-match end trim · 2.6m",        onHand: 6,  qty: 40, unitPrice: 4.90 },
  { id: "po-3", sku: "ADH-FLEX-5KG",    name: "Flexible flooring adhesive · 5kg",    onHand: 3,  qty: 18, unitPrice: 9.00 },
];

const PO_AVAILABLE_ADD: POLine[] = [
  { id: "po-add-1", sku: "UND-ACOU-15M", name: "Acoustic underlay roll · 15m²", onHand: 22, qty: 8, unitPrice: 18.00 },
  { id: "po-add-2", sku: "TR-CC-WH-2.6", name: "Colour-match corner trim · 2.6m", onHand: 22, qty: 20, unitPrice: 5.40 },
];

export function PurchaseOrderModal({
  open, onClose, onRaise,
}: { open: boolean; onClose: () => void; onRaise: () => void }) {
  const [lines, setLines] = useState<POLine[]>(PO_INITIAL);
  const [adding, setAdding] = useState(false);
  const [raised, setRaised] = useState(false);
  const [raising, setRaising] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("Tue 3 Jun");

  useEffect(() => {
    if (open) {
      setLines(PO_INITIAL.map((l) => ({ ...l })));
      setRaised(false);
      setAdding(false);
    }
  }, [open]);

  function updateQty(id: string, qty: number) {
    setLines((prev) => prev.map((l) => l.id === id ? { ...l, qty: Math.max(0, qty) } : l));
  }
  function updatePrice(id: string, price: number) {
    setLines((prev) => prev.map((l) => l.id === id ? { ...l, unitPrice: Math.max(0, price) } : l));
  }
  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }
  function addLine(l: POLine) {
    setLines((prev) => [...prev, { ...l, id: `po-${Date.now()}` }]);
    setAdding(false);
  }
  function raise() {
    setRaising(true);
    setTimeout(() => { setRaising(false); setRaised(true); }, 1200);
  }
  function done() { onRaise(); onClose(); }

  const subtotal = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const vat = subtotal * 0.20;
  const total = subtotal + vat;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={raised ? "PO raised" : "Adjust PO-2214 · Continental Flooring"}
      width="780px"
    >
      {raised ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="apple-tagline">PO-2214 raised &amp; emailed</div>
          <div className="apple-caption text-center">
            £{total.toFixed(2)} · {lines.length} lines · delivery {deliveryDate}<br />
            Goods-in calendar updated · supplier notified
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="apple-card p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="apple-fine">Supplier</div>
                <div className="apple-caption-strong mt-0.5">Continental Flooring</div>
                <div className="apple-fine">net 30 terms</div>
              </div>
              <div>
                <div className="apple-fine">Delivery slot</div>
                <input
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="apple-input mt-0.5"
                  style={{ height: 30, padding: "0 12px", width: "100%", fontSize: 13 }}
                />
              </div>
              <div>
                <div className="apple-fine">Reference</div>
                <div className="apple-caption-strong mt-0.5">PO-2214</div>
                <div className="apple-fine">draft</div>
              </div>
            </div>
          </div>

          {/* Lines */}
          <div className="apple-card overflow-x-auto">
            <div
              className="grid items-center px-4 py-2.5 apple-fine min-w-[620px]"
              style={{ gridTemplateColumns: "1.8fr 80px 90px 100px 110px 40px", background: "#F5F5F7", borderBottom: "1px solid #E0E0E0" }}
            >
              <div>Product</div>
              <div className="text-right">On hand</div>
              <div className="text-right">Qty</div>
              <div className="text-right">Unit £</div>
              <div className="text-right">Line £</div>
              <div></div>
            </div>
            {lines.length === 0 && (
              <div className="apple-caption p-6 text-center">No lines yet. Add a product below.</div>
            )}
            {lines.map((l, i) => (
              <div
                key={l.id}
                className="grid items-center px-4 py-3 min-w-[620px]"
                style={{
                  gridTemplateColumns: "1.8fr 80px 90px 100px 110px 40px",
                  borderBottom: i < lines.length - 1 ? "1px solid #F0F0F0" : "none",
                }}
              >
                <div>
                  <div className="apple-caption-strong">{l.name}</div>
                  <div className="apple-fine tnum">{l.sku}</div>
                </div>
                <div className="apple-caption tnum text-right">{l.onHand}</div>
                <div className="text-right">
                  <input
                    type="number"
                    min={0}
                    value={l.qty}
                    onChange={(e) => updateQty(l.id, parseInt(e.target.value, 10) || 0)}
                    className="apple-input tnum text-right"
                    style={{ height: 30, padding: "0 10px", width: 70, fontSize: 13 }}
                  />
                </div>
                <div className="text-right">
                  <input
                    type="number"
                    step="0.01" min={0}
                    value={l.unitPrice}
                    onChange={(e) => updatePrice(l.id, parseFloat(e.target.value) || 0)}
                    className="apple-input tnum text-right"
                    style={{ height: 30, padding: "0 10px", width: 84, fontSize: 13 }}
                  />
                </div>
                <div className="apple-caption-strong tnum text-right">£{(l.qty * l.unitPrice).toFixed(2)}</div>
                <div className="text-right">
                  <button
                    onClick={() => removeLine(l.id)}
                    className="text-[#9A2D24] hover:opacity-70 transition-opacity"
                    title="Remove line"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add */}
          {adding ? (
            <div className="apple-card p-3 space-y-2">
              <div className="apple-fine">Add a line</div>
              {PO_AVAILABLE_ADD.filter((p) => !lines.some((l) => l.sku === p.sku)).map((p) => (
                <button
                  key={p.id}
                  onClick={() => addLine(p)}
                  className="w-full flex items-center gap-3 p-2 rounded-[8px] hover:bg-[rgba(0,0,0,0.04)] text-left"
                >
                  <Plus className="w-3.5 h-3.5" style={{ color: "#0066CC" }} />
                  <div className="flex-1">
                    <div className="apple-caption-strong">{p.name}</div>
                    <div className="apple-fine">{p.sku} · default qty {p.qty} · £{p.unitPrice.toFixed(2)}</div>
                  </div>
                </button>
              ))}
              <button onClick={() => setAdding(false)} className="btn btn-ghost btn-sm">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} className="btn btn-pearl">
              <Plus className="w-3.5 h-3.5" /> Add line
            </button>
          )}

          {/* Totals */}
          <div className="apple-card p-4">
            <div className="grid grid-cols-3 gap-4 apple-body">
              <div>
                <div className="apple-fine">Subtotal</div>
                <div className="tnum apple-caption-strong">£{subtotal.toFixed(2)}</div>
              </div>
              <div>
                <div className="apple-fine">VAT 20%</div>
                <div className="tnum apple-caption-strong">£{vat.toFixed(2)}</div>
              </div>
              <div>
                <div className="apple-fine">Total</div>
                <div className="tnum apple-tagline">£{total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalActions>
        {raised ? (
          <button onClick={done} className="btn btn-primary btn-sm">Done</button>
        ) : (
          <>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
            <button onClick={raise} disabled={raising || lines.length === 0} className="btn btn-primary btn-sm">
              {raising ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Raising…</> : <><Send className="w-3.5 h-3.5" /> Raise &amp; email PO</>}
            </button>
          </>
        )}
      </ModalActions>
    </Modal>
  );
}

/* ───────────────────────────────────────────────────────────────
   4. Quote draft modal — Mr & Mrs Doyle bathroom
   Editable line items, totals, send.
   ─────────────────────────────────────────────────────────────── */

interface QuoteLine {
  id: string;
  desc: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

const DOYLE_INITIAL: QuoteLine[] = [
  { id: "ql-1", desc: "Marble Gloss wall panel · 2.4m × 1m",        qty: 4, unit: "panel",  unitPrice: 89.00 },
  { id: "ql-2", desc: "Matt Charcoal trim · 2.6m",                  qty: 6, unit: "length", unitPrice: 8.20 },
  { id: "ql-3", desc: "Flexible adhesive · 5kg tub",                qty: 2, unit: "tub",    unitPrice: 14.50 },
  { id: "ql-4", desc: "Survey & fit · 1 fitter, ½ day",             qty: 1, unit: "visit",  unitPrice: 285.00 },
  { id: "ql-5", desc: "Removal & disposal of existing tiles",        qty: 1, unit: "visit",  unitPrice: 180.00 },
];

const DOYLE_NOTES_INITIAL =
`Quote covers the family-bathroom finish picks from the showroom on 28 May.
Includes free survey, all trims, adhesive and disposal of the existing tiles.
Valid for 30 days. 30% deposit on order acceptance; balance on completion.`;

export function QuoteEditModal({
  open, onClose, onSend,
}: { open: boolean; onClose: () => void; onSend: () => void }) {
  const [lines, setLines] = useState<QuoteLine[]>(DOYLE_INITIAL);
  const [notes, setNotes] = useState(DOYLE_NOTES_INITIAL);
  const [discount, setDiscount] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      setLines(DOYLE_INITIAL.map((l) => ({ ...l })));
      setNotes(DOYLE_NOTES_INITIAL);
      setDiscount(0);
      setSent(false);
    }
  }, [open]);

  function updateQty(id: string, qty: number) {
    setLines((prev) => prev.map((l) => l.id === id ? { ...l, qty: Math.max(0, qty) } : l));
  }
  function updatePrice(id: string, price: number) {
    setLines((prev) => prev.map((l) => l.id === id ? { ...l, unitPrice: Math.max(0, price) } : l));
  }
  function updateDesc(id: string, desc: string) {
    setLines((prev) => prev.map((l) => l.id === id ? { ...l, desc } : l));
  }
  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }
  function addLine() {
    setLines((prev) => [...prev, { id: `ql-${Date.now()}`, desc: "New item", qty: 1, unit: "each", unitPrice: 0 }]);
  }
  function send() {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1100);
  }
  function done() { onSend(); onClose(); }

  const subtotal = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0) - discount;
  const vat = subtotal * 0.20;
  const total = subtotal + vat;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={sent ? "Quote sent" : "Edit quote · Mr & Mrs Doyle"}
      width="800px"
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="apple-tagline">Quote sent</div>
          <div className="apple-caption">Quote QU-2147 · £{total.toFixed(2)} sent to doyle.home@gmail.com</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="apple-card p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="apple-fine">Customer</div>
                <div className="apple-caption-strong mt-0.5">Mr & Mrs Doyle</div>
                <div className="apple-fine">doyle.home@gmail.com</div>
              </div>
              <div>
                <div className="apple-fine">Site</div>
                <div className="apple-caption mt-0.5">Roundhay, LS8</div>
                <div className="apple-fine">~6m² ensuite</div>
              </div>
              <div>
                <div className="apple-fine">Quote ref</div>
                <div className="apple-caption-strong mt-0.5">QU-2147 (draft)</div>
                <div className="apple-fine">valid 30 days</div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="apple-card overflow-x-auto">
            <div
              className="grid items-center px-4 py-2.5 apple-fine min-w-[620px]"
              style={{ gridTemplateColumns: "2.6fr 70px 90px 100px 100px 40px", background: "#F5F5F7", borderBottom: "1px solid #E0E0E0" }}
            >
              <div>Description</div>
              <div className="text-right">Qty</div>
              <div>Unit</div>
              <div className="text-right">Unit £</div>
              <div className="text-right">Line £</div>
              <div></div>
            </div>
            {lines.map((l, i) => (
              <div
                key={l.id}
                className="grid items-center px-4 py-2.5 min-w-[620px]"
                style={{
                  gridTemplateColumns: "2.6fr 70px 90px 100px 100px 40px",
                  borderBottom: i < lines.length - 1 ? "1px solid #F0F0F0" : "none",
                }}
              >
                <input
                  value={l.desc}
                  onChange={(e) => updateDesc(l.id, e.target.value)}
                  className="apple-input"
                  style={{ height: 30, padding: "0 10px", border: "1px solid transparent", background: "transparent", fontSize: 13 }}
                />
                <input
                  type="number" min={0}
                  value={l.qty}
                  onChange={(e) => updateQty(l.id, parseInt(e.target.value, 10) || 0)}
                  className="apple-input tnum text-right"
                  style={{ height: 30, padding: "0 10px", width: 60, fontSize: 13 }}
                />
                <div className="apple-fine">{l.unit}</div>
                <input
                  type="number" step="0.01" min={0}
                  value={l.unitPrice}
                  onChange={(e) => updatePrice(l.id, parseFloat(e.target.value) || 0)}
                  className="apple-input tnum text-right"
                  style={{ height: 30, padding: "0 10px", width: 84, fontSize: 13 }}
                />
                <div className="tnum apple-caption-strong text-right">£{(l.qty * l.unitPrice).toFixed(2)}</div>
                <div className="text-right">
                  <button onClick={() => removeLine(l.id)} className="text-[#9A2D24] hover:opacity-70" title="Remove">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addLine} className="btn btn-pearl">
            <Plus className="w-3.5 h-3.5" /> Add line
          </button>

          {/* Notes */}
          <div>
            <div className="apple-fine mb-1">Notes shown on the quote</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="apple-input-rect"
            />
          </div>

          {/* Totals */}
          <div className="apple-card p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="apple-fine">Discount £</div>
                <input
                  type="number" min={0} step="1"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="apple-input tnum mt-0.5"
                  style={{ height: 32, padding: "0 10px", width: "100%", fontSize: 13 }}
                />
              </div>
              <div>
                <div className="apple-fine">Subtotal</div>
                <div className="tnum apple-caption-strong mt-1">£{subtotal.toFixed(2)}</div>
              </div>
              <div>
                <div className="apple-fine">VAT 20%</div>
                <div className="tnum apple-caption-strong mt-1">£{vat.toFixed(2)}</div>
              </div>
              <div>
                <div className="apple-fine">Total inc VAT</div>
                <div className="tnum apple-tagline mt-1">£{total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalActions>
        {sent ? (
          <button onClick={done} className="btn btn-primary btn-sm">Done</button>
        ) : (
          <>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
            <button onClick={send} disabled={sending || lines.length === 0} className="btn btn-primary btn-sm">
              {sending ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending…</> : <><Send className="w-3.5 h-3.5" /> Send quote</>}
            </button>
          </>
        )}
      </ModalActions>
    </Modal>
  );
}

/* ───────────────────────────────────────────────────────────────
   5. Reconciliation modal — 7 unmatched bank lines
   ─────────────────────────────────────────────────────────────── */

interface BankLine {
  id: string;
  date: string;
  desc: string;
  amount: number;
  suggested: string;
  confidence: "high" | "medium" | "low";
}

const RECON_LINES: BankLine[] = [
  { id: "b1", date: "28 May", desc: "STRIPE PAYMENTS UK LTD",     amount: -14.20, suggested: "Stripe card-machine fee · Bank charges", confidence: "high" },
  { id: "b2", date: "28 May", desc: "STRIPE PAYMENTS UK LTD",     amount: -14.20, suggested: "Stripe card-machine fee · Bank charges", confidence: "high" },
  { id: "b3", date: "27 May", desc: "STRIPE PAYMENTS UK LTD",     amount: -14.20, suggested: "Stripe card-machine fee · Bank charges", confidence: "high" },
  { id: "b4", date: "27 May", desc: "STRIPE PAYMENTS UK LTD",     amount: -14.20, suggested: "Stripe card-machine fee · Bank charges", confidence: "high" },
  { id: "b5", date: "26 May", desc: "STRIPE PAYMENTS UK LTD",     amount: -14.20, suggested: "Stripe card-machine fee · Bank charges", confidence: "high" },
  { id: "b6", date: "25 May", desc: "CONTINENTAL FLOORING REFUND", amount:  62.00, suggested: "Duplicate of refund on 22 May · mark as duplicate", confidence: "medium" },
  { id: "b7", date: "24 May", desc: "TRANSFER IN · REF UNKNOWN",   amount: 185.00, suggested: "Flag for review · no matching invoice or PO", confidence: "low" },
];

export function ReconciliationModal({
  open, onClose, onResolve,
}: { open: boolean; onClose: () => void; onResolve: () => void }) {
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) { setResolved(new Set()); setDone(false); }
  }, [open]);

  function resolve(id: string) {
    setResolved((prev) => new Set([...prev, id]));
  }
  function resolveAll() {
    setResolved(new Set(RECON_LINES.map((l) => l.id)));
  }
  function finishAndClose() {
    setDone(true);
    onResolve();
    setTimeout(onClose, 900);
  }

  const remaining = RECON_LINES.filter((l) => !resolved.has(l.id)).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={done ? "Marked resolved" : "Reconciliation · 7 unmatched bank lines"}
      width="820px"
    >
      {done ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="apple-tagline">All matched</div>
          <div className="apple-caption">419 of 419 transactions reconciled · Xero updated</div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Matched auto",  value: "412", tone: "ok" },
              { label: "Unmatched",     value: String(remaining), tone: remaining > 0 ? "warn" : "ok" },
              { label: "Net effect",    value: "−£3.40", tone: "neutral" },
              { label: "Run finished",  value: "02:18", tone: "neutral" },
            ].map(({ label, value, tone }) => (
              <div key={label} className="apple-card p-3">
                <div className="apple-fine">{label}</div>
                <div
                  className="apple-display tnum mt-0.5"
                  style={{ fontSize: 22, color: tone === "ok" ? "#2E844A" : tone === "warn" ? "#8A5A12" : "#1D1D1F" }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Lines */}
          <div className="apple-card overflow-x-auto">
            <div
              className="grid items-center px-4 py-2.5 apple-fine min-w-[680px]"
              style={{ gridTemplateColumns: "70px 2fr 110px 1.4fr 130px", background: "#F5F5F7", borderBottom: "1px solid #E0E0E0" }}
            >
              <div>Date</div>
              <div>Description</div>
              <div className="text-right">Amount</div>
              <div>Suggested match</div>
              <div className="text-right">Action</div>
            </div>
            {RECON_LINES.map((l, i) => {
              const isResolved = resolved.has(l.id);
              return (
                <div
                  key={l.id}
                  className="grid items-center px-4 py-3 min-w-[680px]"
                  style={{
                    gridTemplateColumns: "70px 2fr 110px 1.4fr 130px",
                    borderBottom: i < RECON_LINES.length - 1 ? "1px solid #F0F0F0" : "none",
                    opacity: isResolved ? 0.5 : 1,
                  }}
                >
                  <div className="apple-fine tnum">{l.date}</div>
                  <div>
                    <div className="apple-caption-strong">{l.desc}</div>
                    <div className="apple-fine">confidence: {l.confidence}</div>
                  </div>
                  <div
                    className="apple-caption-strong tnum text-right"
                    style={{ color: l.amount < 0 ? "#9A2D24" : "#2E844A" }}
                  >
                    {l.amount < 0 ? "−" : "+"}£{Math.abs(l.amount).toFixed(2)}
                  </div>
                  <div className="apple-caption">{l.suggested}</div>
                  <div className="text-right">
                    {isResolved ? (
                      <span className="pill pill-ok"><Check className="w-3 h-3" /> matched</span>
                    ) : (
                      <button onClick={() => resolve(l.id)} className="btn btn-pearl">Accept</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="apple-caption">
              {remaining === 0 ? "Everything matched ✓" : `${remaining} still to action`}
            </div>
            <button onClick={resolveAll} disabled={remaining === 0} className="btn btn-pearl">
              <Check className="w-3.5 h-3.5" /> Accept all suggestions
            </button>
          </div>
        </div>
      )}

      <ModalActions>
        {done ? null : (
          <>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Close</button>
            <button onClick={finishAndClose} disabled={remaining > 0} className="btn btn-primary btn-sm">
              <Check className="w-3.5 h-3.5" /> Mark resolved &amp; push to Xero
            </button>
          </>
        )}
      </ModalActions>
    </Modal>
  );
}

/* ───────────────────────────────────────────────────────────────
   6. CIS return modal — 4 subcontractors
   ─────────────────────────────────────────────────────────────── */

interface CISRow {
  id: string;
  name: string;
  utr: string;
  verified: string;
  gross: number;
  materials: number;
  taxable: number;
  rate: number;       // 0 / 20 / 30
  deduction: number;
}

const CIS_INITIAL: CISRow[] = [
  { id: "cis1", name: "Adams Tiling Ltd",     utr: "1234567890", verified: "Gross",  gross: 4200, materials:  680, taxable: 3520, rate:  0, deduction: 0 },
  { id: "cis2", name: "Brennan Fitting",       utr: "2233445566", verified: "Net 20", gross: 5800, materials: 1100, taxable: 4700, rate: 20, deduction: 940 },
  { id: "cis3", name: "Murphy Plant Hire",     utr: "9988776655", verified: "Net 20", gross: 3200, materials:    0, taxable: 3200, rate: 20, deduction: 640 },
  { id: "cis4", name: "Khan & Sons Joinery",   utr: "5544332211", verified: "Net 20", gross: 3950, materials:  950, taxable: 3000, rate: 20, deduction: 600 },
];

export function CISReturnModal({
  open, onClose, onSubmit,
}: { open: boolean; onClose: () => void; onSubmit: () => void }) {
  const [rows] = useState<CISRow[]>(CIS_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  function submit() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
  }
  function done() { onSubmit(); onClose(); }

  const totalGross   = rows.reduce((s, r) => s + r.gross, 0);
  const totalMats    = rows.reduce((s, r) => s + r.materials, 0);
  const totalTaxable = rows.reduce((s, r) => s + r.taxable, 0);
  const totalDed     = rows.reduce((s, r) => s + r.deduction, 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={submitted ? "Submitted" : "CIS monthly return · May 2026"}
      width="860px"
    >
      {submitted ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="apple-tagline">Filed with HMRC</div>
          <div className="apple-caption text-center">
            CIS300 · period ending 5 Jun 2026<br />
            4 subcontractors · £{totalDed.toLocaleString()} deductions · receipt 96A4-EB2F
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Subcontractors", value: String(rows.length) },
              { label: "Gross paid",     value: `£${totalGross.toLocaleString()}` },
              { label: "Materials",      value: `£${totalMats.toLocaleString()}` },
              { label: "Tax to HMRC",    value: `£${totalDed.toLocaleString()}`, accent: true },
            ].map(({ label, value, accent }) => (
              <div key={label} className="apple-card p-3" style={accent ? { background: "#E8F0FB", borderColor: "rgba(0,102,204,0.18)" } : {}}>
                <div className="apple-fine">{label}</div>
                <div className="apple-display tnum mt-0.5" style={{ fontSize: 22, color: accent ? "#0066CC" : "#1D1D1F" }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="apple-card overflow-x-auto">
            <div
              className="grid items-center px-4 py-2.5 apple-fine min-w-[760px]"
              style={{ gridTemplateColumns: "1.6fr 110px 90px 90px 100px 80px 100px", background: "#F5F5F7", borderBottom: "1px solid #E0E0E0" }}
            >
              <div>Subcontractor</div>
              <div>UTR</div>
              <div>Verified</div>
              <div className="text-right">Gross</div>
              <div className="text-right">Materials</div>
              <div className="text-right">Rate</div>
              <div className="text-right">Deduction</div>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.id}
                className="grid items-center px-4 py-3 min-w-[760px]"
                style={{
                  gridTemplateColumns: "1.6fr 110px 90px 90px 100px 80px 100px",
                  borderBottom: i < rows.length - 1 ? "1px solid #F0F0F0" : "none",
                }}
              >
                <div>
                  <div className="apple-caption-strong">{r.name}</div>
                  <div className="apple-fine">verified via HMRC API · today</div>
                </div>
                <div className="apple-fine tnum">{r.utr}</div>
                <div>
                  <span className={`pill ${r.verified === "Gross" ? "pill-info" : "pill-soft"}`}>{r.verified}</span>
                </div>
                <div className="apple-caption tnum text-right">£{r.gross.toLocaleString()}</div>
                <div className="apple-caption tnum text-right">£{r.materials.toLocaleString()}</div>
                <div className="apple-caption tnum text-right">{r.rate}%</div>
                <div className="apple-caption-strong tnum text-right" style={{ color: r.deduction > 0 ? "#9A2D24" : "#2E844A" }}>
                  {r.deduction > 0 ? `£${r.deduction.toLocaleString()}` : "—"}
                </div>
              </div>
            ))}
          </div>

          <div className="apple-card p-4 flex items-start gap-3" style={{ background: "#F5EAD6", borderColor: "#ecdcbb" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#8A5A12" }} />
            <div className="apple-caption" style={{ color: "#6a4a13" }}>
              On approve, files CIS300 to HMRC via the BrightPay link and queues the £{totalDed.toLocaleString()} payment for the 19 June due date.
            </div>
          </div>
        </div>
      )}

      <ModalActions>
        {submitted ? (
          <button onClick={done} className="btn btn-primary btn-sm">Done</button>
        ) : (
          <>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
            <button onClick={submit} disabled={submitting} className="btn btn-primary btn-sm">
              {submitting ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Filing…</> : <><FileText className="w-3.5 h-3.5" /> Submit to HMRC</>}
            </button>
          </>
        )}
      </ModalActions>
    </Modal>
  );
}

/* ───────────────────────────────────────────────────────────────
   7. Payroll modal — 9 staff
   ─────────────────────────────────────────────────────────────── */

interface StaffRow {
  id: string;
  name: string;
  role: string;
  hours: number;
  rate: number;
  gross: number;
  paye: number;
  ni: number;
  pension: number;
  net: number;
  change?: string;
}

const STAFF_INITIAL: StaffRow[] = [
  { id: "s1", name: "Dean Foster",      role: "Director",          hours: 0,   rate: 0,    gross: 1200, paye: 188, ni: 96,  pension: 60, net: 856 },
  { id: "s2", name: "Mark Allerton",    role: "Lead fitter · Team A", hours: 44, rate: 24, gross: 1056, paye: 124, ni: 72,  pension: 53, net: 807, change: "+6 install hrs (+£162)" },
  { id: "s3", name: "Jamie Akin",       role: "Fitter · Team A",   hours: 38,  rate: 20,   gross: 760,  paye: 70,  ni: 48,  pension: 38, net: 604 },
  { id: "s4", name: "Connor Bell",      role: "Lead fitter · Team B", hours: 40, rate: 24, gross: 960,  paye: 105, ni: 64,  pension: 48, net: 743 },
  { id: "s5", name: "Tom Whittaker",    role: "Fitter · Team B",   hours: 38,  rate: 20,   gross: 760,  paye: 70,  ni: 48,  pension: 38, net: 604 },
  { id: "s6", name: "Leah Maynard",     role: "Showroom & sales",  hours: 30,  rate: 18,   gross: 540,  paye: 32,  ni: 26,  pension: 27, net: 455 },
  { id: "s7", name: "Mark Eccleston",   role: "Surveyor",          hours: 40,  rate: 22,   gross: 880,  paye: 92,  ni: 56,  pension: 44, net: 688 },
  { id: "s8", name: "Sasha Patel",      role: "Office & accounts", hours: 25,  rate: 19,   gross: 475,  paye: 22,  ni: 22,  pension: 24, net: 407 },
  { id: "s9", name: "Aaron Briggs",     role: "Apprentice fitter", hours: 35,  rate: 12.50,gross: 437.50, paye: 16, ni: 18, pension: 22, net: 381.50 },
];

export function PayrollModal({
  open, onClose, onApprove,
}: { open: boolean; onClose: () => void; onApprove: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  function submit() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
  }
  function done() { onApprove(); onClose(); }

  const totalGross   = STAFF_INITIAL.reduce((s, r) => s + r.gross, 0);
  const totalPaye    = STAFF_INITIAL.reduce((s, r) => s + r.paye, 0);
  const totalNi      = STAFF_INITIAL.reduce((s, r) => s + r.ni, 0);
  const totalPension = STAFF_INITIAL.reduce((s, r) => s + r.pension, 0);
  const totalNet     = STAFF_INITIAL.reduce((s, r) => s + r.net, 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={submitted ? "Payroll approved" : "Payroll · week ending Fri 30 May"}
      width="900px"
    >
      {submitted ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2E844A" }}>
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="apple-tagline">Payslips issued · BACS scheduled</div>
          <div className="apple-caption text-center">
            9 staff · £{totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })} net · paid Fri 30 May at 09:00<br />
            PAYE filed to HMRC · pension to NEST
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Gross",   value: `£${totalGross.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
              { label: "PAYE",    value: `£${totalPaye.toLocaleString()}` },
              { label: "NI",      value: `£${totalNi.toLocaleString()}` },
              { label: "Pension", value: `£${totalPension.toLocaleString()}` },
              { label: "Net pay", value: `£${totalNet.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, accent: true },
            ].map(({ label, value, accent }) => (
              <div key={label} className="apple-card p-3" style={accent ? { background: "#E8F0FB", borderColor: "rgba(0,102,204,0.18)" } : {}}>
                <div className="apple-fine">{label}</div>
                <div className="apple-display tnum mt-0.5" style={{ fontSize: 20, color: accent ? "#0066CC" : "#1D1D1F" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Change banner */}
          <div className="apple-card p-3 flex items-center gap-3" style={{ background: "#FAFAFC" }}>
            <span className="pill pill-info">1 change</span>
            <div className="apple-caption flex-1">Mark Allerton +6 install hours this week (+£162) — Riverside Units 3–4.</div>
          </div>

          {/* Table */}
          <div className="apple-card overflow-x-auto">
            <div
              className="grid items-center px-4 py-2.5 apple-fine min-w-[840px]"
              style={{ gridTemplateColumns: "1.5fr 1.2fr 65px 70px 90px 70px 70px 80px 100px", background: "#F5F5F7", borderBottom: "1px solid #E0E0E0" }}
            >
              <div>Name</div>
              <div>Role</div>
              <div className="text-right">Hrs</div>
              <div className="text-right">Rate</div>
              <div className="text-right">Gross</div>
              <div className="text-right">PAYE</div>
              <div className="text-right">NI</div>
              <div className="text-right">Pension</div>
              <div className="text-right">Net</div>
            </div>
            {STAFF_INITIAL.map((r, i) => (
              <div
                key={r.id}
                className="grid items-center px-4 py-2.5 min-w-[840px]"
                style={{
                  gridTemplateColumns: "1.5fr 1.2fr 65px 70px 90px 70px 70px 80px 100px",
                  borderBottom: i < STAFF_INITIAL.length - 1 ? "1px solid #F0F0F0" : "none",
                  background: r.change ? "rgba(0,102,204,0.04)" : "transparent",
                }}
              >
                <div>
                  <div className="apple-caption-strong">{r.name}</div>
                  {r.change && <div className="apple-fine" style={{ color: "#0066CC" }}>{r.change}</div>}
                </div>
                <div className="apple-fine">{r.role}</div>
                <div className="apple-caption tnum text-right">{r.hours || "—"}</div>
                <div className="apple-caption tnum text-right">{r.rate ? `£${r.rate.toFixed(2)}` : "—"}</div>
                <div className="apple-caption tnum text-right">£{r.gross.toFixed(0)}</div>
                <div className="apple-fine tnum text-right">£{r.paye}</div>
                <div className="apple-fine tnum text-right">£{r.ni}</div>
                <div className="apple-fine tnum text-right">£{r.pension}</div>
                <div className="apple-caption-strong tnum text-right">£{r.net.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="apple-fine">
            On approve: BrightPay submits FPS to HMRC, NEST pension contribution scheduled, BACS payment file generated for Friday 09:00.
          </div>
        </div>
      )}

      <ModalActions>
        {submitted ? (
          <button onClick={done} className="btn btn-primary btn-sm">Done</button>
        ) : (
          <>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
            <button onClick={submit} disabled={submitting} className="btn btn-primary btn-sm">
              {submitting ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Approving…</> : <><Check className="w-3.5 h-3.5" /> Approve payroll</>}
            </button>
          </>
        )}
      </ModalActions>
    </Modal>
  );
}

/* ───────────────────────────────────────────────────────────────
   Wrapper: opens the right modal for a given approval id.
   Returns null when nothing's open.
   ─────────────────────────────────────────────────────────────── */

export type ApprovalKind =
  | "quote-followup-5"
  | "halpin-carrara-reply"
  | "po-2214"
  | "doyle-bathroom-quote"
  | "recon-flags"
  | "cis-monthly"
  | "weekly-payroll";

export function CategoryModal({
  approval, onClose, onApprove,
}: {
  approval: MockApproval | null;
  onClose: () => void;
  onApprove: (id: string) => void;
}) {
  const id = approval?.id ?? "";
  const open = !!approval;
  function handle() { if (approval) onApprove(approval.id); }

  return (
    <>
      <QuoteFollowUpModal   open={open && id === "quote-followup-5"}     onClose={onClose} onApproveAll={handle} />
      <CustomerReplyModal   open={open && id === "halpin-carrara-reply"} onClose={onClose} onSend={handle} />
      <PurchaseOrderModal   open={open && id === "po-2214"}              onClose={onClose} onRaise={handle} />
      <QuoteEditModal       open={open && id === "doyle-bathroom-quote"} onClose={onClose} onSend={handle} />
      <ReconciliationModal  open={open && id === "recon-flags"}          onClose={onClose} onResolve={handle} />
      <CISReturnModal       open={open && id === "cis-monthly"}          onClose={onClose} onSubmit={handle} />
      <PayrollModal         open={open && id === "weekly-payroll"}       onClose={onClose} onApprove={handle} />
    </>
  );
}
