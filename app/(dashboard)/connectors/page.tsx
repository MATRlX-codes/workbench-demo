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
    <div className="px-8 py-6 min-h-screen" style={{ background: "#F6F4EE" }}>
      <PageHeader title="Connectors" subtitle="Manage the services Claude can act on your behalf" />

      {needsReauth.length > 0 && (
        <div className="flex items-start gap-3 bg-warning-bg border border-warning/20 rounded-[16px] p-4 mb-6">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div>
            <div className="text-[13.5px] font-semibold text-warning">
              {needsReauth.length} connector{needsReauth.length > 1 ? "s need" : " needs"} re-authorisation
            </div>
            <div className="text-[12.5px] text-stone mt-0.5">
              {needsReauth.map((c) => c.name).join(", ")} — some workflows may be paused until you reconnect.
            </div>
          </div>
        </div>
      )}

      {/* Connected */}
      {connected.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[13px] font-semibold text-stone uppercase tracking-wide mb-3">Connected ({connected.length})</h3>
          <div className="grid grid-cols-2 gap-4">
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

      {/* Needs re-auth */}
      {needsReauth.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[13px] font-semibold text-warning uppercase tracking-wide mb-3">Needs re-auth ({needsReauth.length})</h3>
          <div className="grid grid-cols-2 gap-4">
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

      {/* Disconnected */}
      {disconnected.length > 0 && (
        <section>
          <h3 className="text-[13px] font-semibold text-stone uppercase tracking-wide mb-3">Available to connect ({disconnected.length})</h3>
          <div className="grid grid-cols-2 gap-4">
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

      {/* Disconnect confirm modal */}
      <Modal open={!!disconnectId} onClose={() => setDisconnectId(null)} title={`Disconnect ${disconnectTarget?.name ?? ""}`}>
        <div className="space-y-3">
          <p className="text-[14px] text-ink">
            Disconnecting <strong>{disconnectTarget?.name}</strong> will pause any workflows that depend on it.
            {disconnectTarget?.usedBy && ` Affected: ${disconnectTarget.usedBy.join(", ")}.`}
          </p>
          <p className="text-[13px] text-stone">You can reconnect at any time.</p>
        </div>
        <ModalActions>
          <button onClick={() => setDisconnectId(null)} className="h-[36px] px-4 rounded-full text-[13.5px] font-semibold text-ink hover:bg-surface-soft transition-colors">Cancel</button>
          <button onClick={() => handleDisconnect(disconnectId!)} className="h-[36px] px-4 rounded-full text-[13.5px] font-semibold bg-danger text-white hover:opacity-80 transition-opacity">Disconnect</button>
        </ModalActions>
      </Modal>

      {/* Re-auth modal */}
      <Modal open={!!reauthId} onClose={() => setReauthId(null)} title={`Re-authorise ${reauthTarget?.name ?? ""}`}>
        <div className="space-y-3">
          <p className="text-[14px] text-ink">
            <strong>{reauthTarget?.name}</strong> needs you to re-authorise access. This usually means the OAuth token expired.
          </p>
          <p className="text-[13px] text-stone">You'll be redirected to {reauthTarget?.name} to grant access, then returned here.</p>
        </div>
        <ModalActions>
          <button onClick={() => setReauthId(null)} className="h-[36px] px-4 rounded-full text-[13.5px] font-semibold text-ink hover:bg-surface-soft transition-colors">Cancel</button>
          <button onClick={() => handleReauth(reauthId!)} className="h-[36px] px-4 rounded-full text-[13.5px] font-semibold bg-ink text-on-dark hover:opacity-80 transition-opacity">
            <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" /> Re-authorise
          </button>
        </ModalActions>
      </Modal>
    </div>
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
    <div className="bg-surface-card border border-hairline-light rounded-[20px] p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-ink flex items-center justify-center text-[11px] font-bold text-on-dark shrink-0">
            {connector.logo}
          </div>
          <div>
            <div className="text-[14px] font-semibold text-ink">{connector.name}</div>
            <div className="text-[12px] text-stone">{connector.description}</div>
          </div>
        </div>
        {statusBadge(connector.status)}
      </div>

      {connector.status !== "disconnected" && (
        <div className="flex items-center gap-4 text-[11.5px] text-stone mb-3">
          {connector.connectedAt && <span>Connected {connector.connectedAt}</span>}
          {connector.lastSync && <span>· Synced {connector.lastSync}</span>}
        </div>
      )}

      {connector.usedBy && connector.usedBy.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {connector.usedBy.map((w) => (
            <span key={w} className="h-[20px] px-2 rounded-full bg-surface-soft text-[10.5px] text-stone font-medium">
              {w}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {connector.status === "disconnected" && (
          <button
            onClick={() => onConnect(connector.id)}
            disabled={connecting}
            className="flex items-center gap-1.5 h-[30px] px-3 rounded-full text-[12.5px] font-semibold bg-ink text-on-dark hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {connecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            {connecting ? "Connecting…" : "Connect"}
          </button>
        )}
        {connector.status === "reauth" && (
          <button
            onClick={onReauth}
            disabled={connecting}
            className="flex items-center gap-1.5 h-[30px] px-3 rounded-full text-[12.5px] font-semibold bg-warning text-white hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {connecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            {connecting ? "Reconnecting…" : "Re-authorise"}
          </button>
        )}
        {connector.status === "connected" && (
          <button
            onClick={onDisconnect}
            className="flex items-center gap-1.5 h-[30px] px-3 rounded-full text-[12.5px] font-semibold text-stone hover:bg-surface-soft hover:text-danger transition-colors"
          >
            <Unlink className="w-3 h-3" /> Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
