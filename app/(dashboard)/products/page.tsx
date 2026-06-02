"use client";

import { useState } from "react";
import {
  Search, AlertTriangle, Plus, RefreshCw, Check, ShoppingCart, Box,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { Modal, ModalActions } from "@/lib/ui/modal";
import { ProductImage } from "@/lib/ui/product-image";
import { useCompany } from "@/lib/mock/company-context";
import type { Product } from "@/lib/mock/companies/types";

type CategoryFilter = "all" | string;
type StockFilter   = "all" | "low" | "ok";

function stockState(p: Product): "ok" | "low" | "critical" {
  const free = p.onHand - p.reserved;
  if (free <= 0)            return "critical";
  if (p.onHand <= p.reorderAt) return "low";
  return "ok";
}

export default function ProductsPage() {
  const { company } = useCompany();
  const PRODUCTS = company.products.items;
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<CategoryFilter>("all");
  const [stock, setStock] = useState<StockFilter>("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [poBuilder, setPoBuilder] = useState<Record<string, number>>({});
  const [poOpen, setPoOpen] = useState(false);
  const [poSent, setPoSent] = useState(false);
  const [poLoading, setPoLoading] = useState(false);

  const cats: CategoryFilter[] = ["all", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

  const filtered = PRODUCTS.filter((p) => {
    if (cat !== "all" && p.category !== cat) return false;
    if (stock === "low" && stockState(p) === "ok") return false;
    if (stock === "ok"  && stockState(p) !== "ok") return false;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const lowStockCount = PRODUCTS.filter((p) => stockState(p) !== "ok").length;
  const totalSkus     = PRODUCTS.length;

  function addToPO(p: Product) {
    setPoBuilder((prev) => ({ ...prev, [p.sku]: (prev[p.sku] ?? 0) + Math.max(p.reorderAt - p.onHand + p.reserved, 10) }));
  }
  function removeFromPO(sku: string) {
    setPoBuilder((prev) => { const o = { ...prev }; delete o[sku]; return o; });
  }
  function updatePOQty(sku: string, qty: number) {
    setPoBuilder((prev) => ({ ...prev, [sku]: qty }));
  }
  function sendPO() {
    setPoLoading(true);
    setTimeout(() => { setPoLoading(false); setPoSent(true); }, 1400);
  }
  function closePO() {
    setPoOpen(false); setPoSent(false); setPoBuilder({});
  }

  const poEntries = Object.entries(poBuilder).map(([sku, qty]) => {
    const p = PRODUCTS.find((p) => p.sku === sku)!;
    const unitTrade = parseFloat(p.trade.replace(/[^0-9.]/g, ""));
    return { p, qty, line: unitTrade * qty };
  });
  const poTotal = poEntries.reduce((sum, e) => sum + e.line, 0);

  return (
    <>
      <PageHeader title="Products & stock" subtitle={`${totalSkus} ${company.products.subtitleSuffix} · ${lowStockCount} need restocking`} />

      <div className="px-8 py-7 max-w-[1280px] mx-auto">

        {/* Top callout — low stock */}
        {lowStockCount > 0 && (
          <div className="v3-card p-4 mb-6 flex items-center gap-4" style={{ background: "#F5EAD6", borderColor: "#ecdcbb" }}>
            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0" style={{ background: "#efddb6", color: "#8A5A12" }}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="h3" style={{ color: "#5e3f0c" }}>{lowStockCount} SKUs need restocking</div>
              <div className="body-text" style={{ color: "#6a4a13" }}>
                Claude has drafted PO-2214 for the Continental Flooring lines. Review on Today, or build your own below.
              </div>
            </div>
            <button onClick={() => setStock("low")} className="btn btn-secondary btn-sm">Show low stock</button>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="relative" style={{ width: 320 }}>
            <Search className="absolute w-3.5 h-3.5" style={{ left: 10, top: 11, color: "#727680" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or SKU…"
              className="v3-input w-full"
              style={{ paddingLeft: 30 }}
            />
          </div>
          <div className="flex items-center gap-2">
            {Object.keys(poBuilder).length > 0 && (
              <button onClick={() => setPoOpen(true)} className="btn btn-accent btn-sm">
                <ShoppingCart className="w-3.5 h-3.5" /> Build PO ({Object.keys(poBuilder).length})
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`fpill ${cat === c ? "active" : ""}`}>
              {c === "all" ? "All categories" : c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(["all", "low", "ok"] as const).map((s) => (
            <button key={s} onClick={() => setStock(s)} className={`fpill ${stock === s ? "active" : ""}`}>
              {s === "all" ? "Any stock level" : s === "low" ? "Low / out" : "In stock"}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-3 gap-3.5">
          {filtered.map((p) => {
            const state = stockState(p);
            const free = p.onHand - p.reserved;
            const inPO = !!poBuilder[p.sku];
            return (
              <div key={p.id} className="v3-card overflow-hidden flex flex-col">
                <div className="h-[140px] relative overflow-hidden" style={{ background: p.thumbBg }}>
                  <ProductImage sku={p.sku} category={p.category} />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="pill pill-soft">{p.category}</span>
                    {state === "critical" && <span className="pill pill-bad">Out</span>}
                    {state === "low"      && <span className="pill pill-warn">Low</span>}
                    {state === "ok"       && <span className="pill pill-ok">In stock</span>}
                  </div>
                  <div className="h3" style={{ fontSize: 14 }}>{p.name}</div>
                  <div className="faint-text tnum">{p.sku} · {p.unit}</div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-[12px]">
                    <div>
                      <div className="faint-text">On hand</div>
                      <div className="tnum" style={{ fontWeight: 600, color: "#191C21" }}>{p.onHand}</div>
                    </div>
                    <div>
                      <div className="faint-text">Reserved</div>
                      <div className="tnum" style={{ fontWeight: 600, color: "#191C21" }}>{p.reserved}</div>
                    </div>
                    <div>
                      <div className="faint-text">Free</div>
                      <div className="tnum" style={{ fontWeight: 600, color: free < 0 ? "#9A2D24" : "#191C21" }}>{free}</div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-3 mb-3">
                    <div className="tnum" style={{ fontSize: 13, fontWeight: 600 }}>{p.trade}</div>
                    <div className="faint-text">trade ·</div>
                    <div className="tnum faint-text">{p.retail} retail</div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => setSelected(p)} className="btn btn-secondary btn-sm flex-1">View</button>
                    {inPO ? (
                      <span className="btn btn-sm" style={{ background: "#2E844A", color: "#fff", cursor: "default" }}>
                        <Check className="w-3.5 h-3.5" /> In PO
                      </span>
                    ) : (
                      <button onClick={() => addToPO(p)} className="btn btn-accent btn-sm">
                        <Plus className="w-3.5 h-3.5" /> Add to PO
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="v3-card p-10 text-center muted-text">No products match.</div>
        )}
      </div>

      {/* Product detail */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} width="640px">
        {selected && (
          <div className="space-y-5">
            <div className="rounded-[8px] h-[180px] overflow-hidden relative" style={{ background: selected.thumbBg }}>
              <ProductImage sku={selected.sku} category={selected.category} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "SKU",          value: selected.sku },
                { label: "Category",     value: selected.category },
                { label: "Unit",         value: selected.unit },
                { label: "Supplier",     value: selected.supplier },
                { label: "Lead time",    value: selected.leadTime },
                { label: "Reorder at",   value: `${selected.reorderAt} on hand` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="faint-text">{label}</div>
                  <div className="text-[13.5px]" style={{ color: "#191C21", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="v3-card p-4">
                <div className="muted-text">Trade price</div>
                <div className="tnum mt-1" style={{ fontSize: 20, fontWeight: 600 }}>{selected.trade}</div>
              </div>
              <div className="v3-card p-4">
                <div className="muted-text">Retail price</div>
                <div className="tnum mt-1" style={{ fontSize: 20, fontWeight: 600 }}>{selected.retail}</div>
              </div>
            </div>
            <div className="v3-card p-4">
              <div className="section-title mb-2">Stock movement (last 30 days)</div>
              <div className="grid grid-cols-3 gap-3 text-[13px]">
                <div><div className="faint-text">In</div><div className="tnum" style={{ fontWeight: 600, color: "#2E844A" }}>+{Math.round(selected.onHand * 0.6 + 8)}</div></div>
                <div><div className="faint-text">Out</div><div className="tnum" style={{ fontWeight: 600, color: "#9A2D24" }}>−{Math.round(selected.onHand * 0.4 + 4)}</div></div>
                <div><div className="faint-text">Sold £</div><div className="tnum" style={{ fontWeight: 600 }}>£{(Math.round(selected.onHand * 14)).toLocaleString()}</div></div>
              </div>
            </div>
          </div>
        )}
        <ModalActions>
          <button onClick={() => setSelected(null)} className="btn btn-ghost btn-sm">Close</button>
          {selected && !poBuilder[selected.sku] && (
            <button onClick={() => { addToPO(selected); setSelected(null); }} className="btn btn-accent btn-sm">
              <Plus className="w-3.5 h-3.5" /> Add to PO
            </button>
          )}
        </ModalActions>
      </Modal>

      {/* PO builder */}
      <Modal open={poOpen} onClose={closePO} title="Build purchase order" width="680px">
        {poSent ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-10 h-10 rounded-[8px] flex items-center justify-center" style={{ background: "#2E844A" }}>
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="h3" style={{ color: "#2E844A" }}>PO raised &amp; sent</div>
            <div className="muted-text">Email to {company.products.poSupplier} · delivery slot Tue 3 Jun</div>
          </div>
        ) : poEntries.length === 0 ? (
          <div className="text-center muted-text py-6">
            <Box className="w-8 h-8 mx-auto mb-2" />
            No products added yet. Click <strong>Add to PO</strong> on any product to start.
          </div>
        ) : (
          <div className="space-y-3">
            {poEntries.map(({ p, qty, line }) => (
              <div key={p.sku} className="flex items-center gap-3 p-3 rounded-[8px]" style={{ border: "1px solid #E7E5DE" }}>
                <div className="w-10 h-10 rounded-[6px] shrink-0 overflow-hidden" style={{ background: p.thumbBg }}>
                  <ProductImage sku={p.sku} category={p.category} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: "#191C21" }} className="truncate">{p.name}</div>
                  <div className="faint-text">{p.sku} · {p.trade}</div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => updatePOQty(p.sku, parseInt(e.target.value, 10) || 0)}
                  className="v3-input tnum text-right"
                  style={{ width: 80, height: 32 }}
                />
                <div className="tnum text-right" style={{ width: 90, fontWeight: 600 }}>£{line.toFixed(0)}</div>
                <button onClick={() => removeFromPO(p.sku)} className="btn btn-ghost btn-sm" style={{ color: "#9A2D24" }}>Remove</button>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-[8px]" style={{ background: "#FAFAF7", border: "1px solid #E7E5DE" }}>
              <span style={{ fontWeight: 600, color: "#191C21" }}>Total</span>
              <span className="tnum" style={{ fontSize: 16, fontWeight: 700 }}>£{poTotal.toFixed(2)}</span>
            </div>
            <div className="muted-text" style={{ fontSize: 12 }}>
              {company.products.poDraftBlurb}
            </div>
          </div>
        )}
        <ModalActions>
          {poSent ? (
            <button onClick={closePO} className="btn btn-accent btn-sm">Done</button>
          ) : (
            <>
              <button onClick={() => setPoOpen(false)} className="btn btn-ghost btn-sm">Save draft</button>
              <button
                onClick={sendPO}
                disabled={poLoading || poEntries.length === 0}
                className="btn btn-accent btn-sm"
              >
                {poLoading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Raising PO…</> : "Raise & email PO"}
              </button>
            </>
          )}
        </ModalActions>
      </Modal>
    </>
  );
}
