"use client";

import { useState } from "react";
import {
  CheckCircle2, AlertTriangle, XCircle, Plus, RefreshCw, Unlink,
} from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";
import { Modal, ModalActions } from "@/lib/ui/modal";

type ConnectorStatus = "connected" | "reauth" | "disconnected";

interface Connector {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: ConnectorStatus;
  connectedAt?: string;
  lastSync?: string;
  scopes?: string[];
  usedBy?: string[];
}

const INITIAL_CONNECTORS: Connector[] = [
  {
    id: "xero",
    name: "Xero",
    description: "Accounting — invoices, bank feeds, VAT, supplier batch",
    logo: "Xe",
    status: "connected",
    connectedAt: "12 Mar 2026",
    lastSync: "6 minutes ago",
    scopes: ["invoices.read", "contacts.write", "transactions.read"],
    usedBy: ["Invoice chase", "VAT return", "Reconciliation"],
  },
  {
    id: "cin7",
    name: "Cin7 stock",
    description: "Inventory & purchase orders — flooring, panels, trims",
    logo: "Cn",
    status: "connected",
    connectedAt: "14 Mar 2026",
    lastSync: "just now",
    scopes: ["stock.read", "purchase-orders.write"],
    usedBy: ["Purchase order", "Stock alerts"],
  },
  {
    id: "hmrc",
    name: "HMRC gateway",
    description: "Government Gateway — VAT, CIS, PAYE submissions",
    logo: "HM",
    status: "connected",
    connectedAt: "12 Mar 2026",
    lastSync: "today 02:09",
    scopes: ["vat.submit", "cis.submit", "paye.submit"],
    usedBy: ["VAT return", "CIS return", "PAYE filing"],
  },
  {
    id: "gmail",
    name: "Gmail (sales@)",
    description: "Email — send, draft and read sales correspondence",
    logo: "Gm",
    status: "connected",
    connectedAt: "12 Mar 2026",
    lastSync: "just now",
    scopes: ["mail.read", "mail.send (draft only)"],
    usedBy: ["Quote follow-up", "Customer reply", "Supplier batch"],
  },
  {
    id: "shopify",
    name: "Shopify store",
    description: "Online store — orders, customers, fulfilment",
    logo: "Sh",
    status: "reauth",
    connectedAt: "20 Apr 2026",
    lastSync: "22 minutes ago",
    scopes: ["orders.read", "customers.read"],
    usedBy: ["Lead response", "Customer pulse"],
  },
  {
    id: "instagram",
    name: "Instagram DM",
    description: "Social — DM management for the @northgatesurfaces account",
    logo: "Ig",
    status: "reauth",
    connectedAt: "5 Mar 2026",
    lastSync: "Yesterday",
    scopes: ["messages.read", "messages.write"],
    usedBy: ["Customer reply", "Lead response"],
  },
  {
    id: "brightpay",
    name: "BrightPay",
    description: "Payroll — payslips, PAYE, NIC, RTI submissions",
    logo: "Bp",
    status: "connected",
    connectedAt: "14 Mar 2026",
    lastSync: "today 02:14",
    scopes: ["payroll.read", "payroll.submit"],
    usedBy: ["Payroll run", "CIS return"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Card payments — terminal & online, payout reconciliation",
    logo: "St",
    status: "connected",
    connectedAt: "20 Mar 2026",
    lastSync: "4 minutes ago",
    scopes: ["charges.read", "payouts.read", "refunds.read"],
    usedBy: ["Reconciliation", "Refund handling"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM — leads, deals and trade pipeline",
    logo: "Hs",
    status: "disconnected",
    usedBy: ["Lead response", "Customer pulse"],
  },
];

function statusBadge(status: ConnectorStatus) {
  if (status === "connected") return <span className="pill pill-ok"><CheckCircle2 className="w-3 h-3" /> Connected</span>;
  if (status === "reauth")    return <span className="pill pill-warn"><AlertTriangle className="w-3 h-3" /> Re-auth needed</span>;
  return <span className="pill pill-soft"><XCircle className="w-3 h-3" /> Not connected</span>;
}

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<Connector[]>(INITIAL_CONNECTORS);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnectId, setDisconnectId] = useState<string | null>(null);
  const [reauthId, setReauthId] = useState<string | null>(null);

  function handleConnect(id: string) {
    setConnecting(id);
    setTimeout(() => {
      setConnectors((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, status: "connected", connectedAt: "Today", lastSync: "just now" }
            : c
        )
      );
      setConnecting(null);
    }, 1800);
  }

  function handleReauth(id: string) {
    setReauthId(null);
    setConnecting(id);
    setTimeout(() => {
      setConnectors((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "connected", lastSync: "just now" } : c))
      );
      setConnecting(null);
    }, 1500);
  }

  function handleDisconnect(id: string) {
    setConnectors((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "disconnected", connectedAt: undefined, lastSync: undefined } : c
      )
    );
    setDisconnectId(null);
  }

  const disconnectTarget = connectors.find((c) => c.id === disconnectId);
  const reauthTarget = connectors.find((c) => c.id === reauthId);

  const connected    = connectors.filter((c) => c.status === "connected");
  const needsReauth  = connectors.filter((c) => c.status === "reauth");
  const disconnected = connectors.filter((c) => c.status === "disconnected");

  return (
    <>
      <PageHeader title="Connectors" subtitle={`${connected.length} connected · ${needsReauth.length} need re-auth`} />

      <div className="px-4 sm:px-8 py-7 max-w-[1120px] mx-auto">
        <div className="mb-7">
          <p className="apple-lead" style={{ color: "#333333" }}>
            The services Claude can act on for you. Every action still goes through the approval queue — connecting only grants read and draft access.
          </p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Connected", value: String(connected.length), sub: "syncing normally" },
            { label: "Need re-auth", value: String(needsReauth.length), sub: "token expired" },
            { label: "Available", value: String(disconnected.length), sub: "not yet linked" },
          ].map((k) => (
            <div key={k.label} className="apple-card p-4">
              <div className="apple-fine">{k.label}</div>
              <div className="apple-display tnum mt-2" style={{ fontSize: 28 }}>{k.value}</div>
              <div className="apple-fine mt-2">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Re-auth banner */}
        {needsReauth.length > 0 && (
          <div className="apple-card p-4 mb-8 flex items-start gap-3" style={{ background: "#F5EAD6", borderColor: "#ecdcbb" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#8A5A12" }} />
            <div>
              <div className="apple-caption-strong" style={{ color: "#8A5A12" }}>
                {needsReauth.length} connector{needsReauth.length > 1 ? "s need" : " needs"} re-authorisation
              </div>
              <div className="apple-fine mt-0.5" style={{ color: "#8A5A12" }}>
                {needsReauth.map((c) => c.name).join(", ")} — some workflows may be paused until you reconnect.
              </div>
            </div>
          </div>
        )}

        {/* Needs re-auth */}
        {needsReauth.length > 0 && (
          <section className="mb-8">
            <h3 className="section-title mb-3">Needs re-auth ({needsReauth.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {needsReauth.map((c) => (
                <ConnectorCard
                  key={c.id}
                  connector={c}
                  connecting={connecting === c.id}
                  onConnect={handleConnect}
                  onDisconnect={() => setDisconnectId(c.id)}
                  onReauth={() => setReauthId(c.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Connected */}
        {connected.length > 0 && (
          <section className="mb-8">
            <h3 className="section-title mb-3">Connected ({connected.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {connected.map((c) => (
                <ConnectorCard
                  key={c.id}
                  connector={c}
                  connecting={connecting === c.id}
                  onConnect={handleConnect}
                  onDisconnect={() => setDisconnectId(c.id)}
                  onReauth={() => setReauthId(c.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Disconnected */}
        {disconnected.length > 0 && (
          <section>
            <h3 className="section-title mb-3">Available to connect ({disconnected.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {disconnected.map((c) => (
                <ConnectorCard
                  key={c.id}
                  connector={c}
                  connecting={connecting === c.id}
                  onConnect={handleConnect}
                  onDisconnect={() => setDisconnectId(c.id)}
                  onReauth={() => setReauthId(c.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Disconnect confirm modal */}
      <Modal open={!!disconnectId} onClose={() => setDisconnectId(null)} title={`Disconnect ${disconnectTarget?.name ?? ""}`}>
        <div className="space-y-3">
          <p className="apple-body">
            Disconnecting <strong>{disconnectTarget?.name}</strong> will pause any workflows that depend on it.
            {disconnectTarget?.usedBy && ` Affected: ${disconnectTarget.usedBy.join(", ")}.`}
          </p>
          <p className="apple-fine">You can reconnect at any time.</p>
        </div>
        <ModalActions>
          <button onClick={() => setDisconnectId(null)} className="btn btn-ghost btn-sm">Cancel</button>
          <button onClick={() => handleDisconnect(disconnectId!)} className="btn btn-sm" style={{ background: "#9A2D24", color: "#fff" }}>Disconnect</button>
        </ModalActions>
      </Modal>

      {/* Re-auth modal */}
      <Modal open={!!reauthId} onClose={() => setReauthId(null)} title={`Re-authorise ${reauthTarget?.name ?? ""}`}>
        <div className="space-y-3">
          <p className="apple-body">
            <strong>{reauthTarget?.name}</strong> needs you to re-authorise access. This usually means the OAuth token expired.
          </p>
          <p className="apple-fine">You&apos;ll be redirected to {reauthTarget?.name} to grant access, then returned here.</p>
        </div>
        <ModalActions>
          <button onClick={() => setReauthId(null)} className="btn btn-ghost btn-sm">Cancel</button>
          <button onClick={() => handleReauth(reauthId!)} className="btn btn-primary btn-sm">
            <RefreshCw className="w-3.5 h-3.5" /> Re-authorise
          </button>
        </ModalActions>
      </Modal>
    </>
  );
}

function ConnectorCard({
  connector, connecting, onConnect, onDisconnect, onReauth,
}: {
  connector: Connector;
  connecting: boolean;
  onConnect: (id: string) => void;
  onDisconnect: () => void;
  onReauth: () => void;
}) {
  return (
    <div className="apple-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: "#191C21", color: "#FFFFFF", fontSize: 11, fontWeight: 700 }}
          >
            {connector.logo}
          </div>
          <div className="min-w-0">
            <div className="apple-caption-strong">{connector.name}</div>
            <div className="apple-fine">{connector.description}</div>
          </div>
        </div>
        {statusBadge(connector.status)}
      </div>

      {connector.status !== "disconnected" && (
        <div className="flex items-center gap-3 apple-fine mb-3">
          {connector.connectedAt && <span>Connected {connector.connectedAt}</span>}
          {connector.lastSync && <span>· Synced {connector.lastSync}</span>}
        </div>
      )}

      {connector.usedBy && connector.usedBy.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {connector.usedBy.map((w) => (
            <span key={w} className="pill pill-soft" style={{ height: 20, fontSize: 10.5 }}>
              {w}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {connector.status === "disconnected" && (
          <button onClick={() => onConnect(connector.id)} disabled={connecting} className="btn btn-primary btn-sm">
            {connecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            {connecting ? "Connecting…" : "Connect"}
          </button>
        )}
        {connector.status === "reauth" && (
          <button onClick={onReauth} disabled={connecting} className="btn btn-warn btn-sm">
            <RefreshCw className={`w-3 h-3${connecting ? " animate-spin" : ""}`} />
            {connecting ? "Reconnecting…" : "Re-authorise"}
          </button>
        )}
        {connector.status === "connected" && (
          <button onClick={onDisconnect} className="btn btn-ghost btn-sm" style={{ color: "#727680" }}>
            <Unlink className="w-3 h-3" /> Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
