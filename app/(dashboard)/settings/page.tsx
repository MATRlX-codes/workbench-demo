"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { PageHeader } from "@/lib/ui/page-header";

type Tab = "business" | "tone" | "approvers" | "notifications" | "thresholds";

interface Approver {
  id: string;
  name: string;
  email: string;
  role: string;
}

const INITIAL_APPROVERS: Approver[] = [
  { id: "a1", name: "Dean Holloway", email: "dean@northgatesurfaces.co.uk",  role: "Owner" },
  { id: "a2", name: "Leah Brooks",    email: "leah@northgatesurfaces.co.uk", role: "Showroom Manager" },
  { id: "a3", name: "Mark Allerton",   email: "mark@northgatesurfaces.co.uk", role: "Lead Surveyor" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("business");
  const [saved, setSaved] = useState(false);

  // Business
  const [businessName, setBusinessName] = useState("Northgate Surfaces");
  const [country, setCountry] = useState("GB");
  const [currency, setCurrency] = useState("GBP");
  const [timezone, setTimezone] = useState("Europe/London");

  // Tone
  const [tone, setTone] = useState("warm professional, plain English, no jargon");
  const [signOff, setSignOff] = useState("Best,\nDean — Northgate Surfaces");

  // Approvers
  const [approvers, setApprovers] = useState<Approver[]>(INITIAL_APPROVERS);
  const [newEmail, setNewEmail] = useState("");

  // Notifications
  const [emailDigest, setEmailDigest] = useState(true);
  const [digestTime, setDigestTime] = useState("07:30");
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [urgentAlerts, setUrgentAlerts] = useState(true);

  // Thresholds
  const [autoApproveBelow, setAutoApproveBelow] = useState("150");
  const [payrollThreshold, setPayrollThreshold] = useState("9000");
  const [rejectOnUnknown, setRejectOnUnknown] = useState(true);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function removeApprover(id: string) {
    setApprovers((prev) => prev.filter((a) => a.id !== id));
  }

  function addApprover() {
    if (!newEmail.trim()) return;
    setApprovers((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newEmail.split("@")[0], email: newEmail.trim(), role: "Approver" },
    ]);
    setNewEmail("");
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "business",      label: "Business" },
    { key: "tone",          label: "Tone & voice" },
    { key: "approvers",     label: "Approvers" },
    { key: "notifications", label: "Notifications" },
    { key: "thresholds",    label: "Thresholds" },
  ];

  return (
    <div className="px-4 sm:px-8 py-6 min-h-screen" style={{ background: "#F6F4EE" }}>
      <PageHeader title="Settings" subtitle="Configure how Workbench operates for your business" />

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 bg-surface-soft rounded-full p-1 w-fit">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              "h-[32px] px-4 rounded-full text-[13px] font-medium transition-colors",
              tab === key
                ? "bg-surface-card text-ink shadow-sm"
                : "text-stone hover:text-ink",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-surface-card border border-hairline-light rounded-[20px] p-8 max-w-2xl">
        {tab === "business" && (
          <div className="space-y-6">
            <Field label="Business name">
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Country">
                <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="IE">Ireland (IE)</option>
                </select>
              </Field>
              <Field label="Currency">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
                  <option value="GBP">Pound (£)</option>
                  <option value="EUR">Euro (£)</option>
                </select>
              </Field>
            </div>
            <Field label="Timezone">
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputCls}>
                <option value="Europe/London">Europe/London</option>
                <option value="Europe/Dublin">Europe/Dublin</option>
              </select>
            </Field>
            <Field label="VAT rates" hint="Comma-separated. Standard UK rates: 20, 5, 0">
              <input defaultValue="20, 5, 0" className={inputCls} />
            </Field>
            <Field label="Companies House number" hint="Your registered company number">
              <input defaultValue="08832441" className={inputCls} />
            </Field>
            <Field label="HMRC VRN" hint="VAT registration number">
              <input defaultValue="GB 218 4421 02" className={inputCls} />
            </Field>
            <Field label="CIS reference">
              <input defaultValue="623/N1124" className={inputCls} />
            </Field>
          </div>
        )}

        {tab === "tone" && (
          <div className="space-y-6">
            <Field label="Tone of voice" hint="Used in all outbound emails and replies drafted by Claude">
              <input value={tone} onChange={(e) => setTone(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Default sign-off">
              <textarea
                value={signOff}
                onChange={(e) => setSignOff(e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field label="Avoid phrases" hint="Claude will not use these in drafts">
              <input defaultValue="ASAP, kindly, please be advised" className={inputCls} />
            </Field>
            <div className="bg-surface-soft rounded-[12px] p-4 text-[13px] text-stone leading-relaxed">
              <strong className="text-ink">Preview:</strong> "Hi Paul, great news on signing off SO-4471. The Carrara SPC is a 5-working-day lead, so ordering today lands it before the 9th. To lock the slot, could we take the usual 30% deposit (£882)? Best, Dean — Northgate Surfaces."
            </div>
          </div>
        )}

        {tab === "approvers" && (
          <div className="space-y-4">
            <p className="text-[13px] text-stone">Approvers receive the daily digest and can approve or reject queued actions.</p>
            <div className="flex flex-col gap-2">
              {approvers.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-[12px] border border-hairline-light">
                  <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-[12px] font-semibold text-on-dark shrink-0">
                    {a.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-ink">{a.name}</div>
                    <div className="text-[12px] text-stone">{a.email} · {a.role}</div>
                  </div>
                  {approvers.length > 1 && (
                    <button onClick={() => removeApprover(a.id)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-danger-bg text-stone hover:text-danger transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addApprover()}
                placeholder="Email address"
                className={`${inputCls} flex-1`}
              />
              <button
                onClick={addApprover}
                className="flex items-center gap-1 h-[38px] px-4 rounded-full text-[12.5px] font-semibold bg-ink text-on-dark hover:opacity-80 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div className="space-y-5">
            <Toggle label="Morning email digest" description="Daily summary of pending approvals, delivered at your chosen time" checked={emailDigest} onChange={setEmailDigest} />
            {emailDigest && (
              <Field label="Digest delivery time">
                <input type="time" value={digestTime} onChange={(e) => setDigestTime(e.target.value)} className={inputCls} />
              </Field>
            )}
            <Toggle label="Urgent alerts by email" description="Immediate notification for flagged items above your approval threshold" checked={urgentAlerts} onChange={setUrgentAlerts} />
            <Toggle label="Slack notifications" description="Post approval requests to your connected Slack workspace" checked={slackEnabled} onChange={setSlackEnabled} />
            {slackEnabled && (
              <Field label="Slack channel" hint="e.g. #workbench-approvals">
                <input defaultValue="#workbench-approvals" className={inputCls} />
              </Field>
            )}
          </div>
        )}

        {tab === "thresholds" && (
          <div className="space-y-6">
            <Field label="Auto-approve below (£)" hint="Actions below this value are approved automatically without requiring your review. Set to 0 to require approval for all actions.">
              <input type="number" value={autoApproveBelow} onChange={(e) => setAutoApproveBelow(e.target.value)} className={inputCls} min="0" />
            </Field>
            <Field label="Payroll approval threshold (£)" hint="Payroll runs above this net amount require explicit owner approval">
              <input type="number" value={payrollThreshold} onChange={(e) => setPayrollThreshold(e.target.value)} className={inputCls} />
            </Field>
            <Toggle label="Reject on unknown bank line" description="Automatically reject reconciliation runs containing unidentified transfers above €100" checked={rejectOnUnknown} onChange={setRejectOnUnknown} />
            <Field label="Invoice chase delay (days)" hint="Only chase invoices overdue by at least this many days">
              <input type="number" defaultValue="7" className={inputCls} min="1" max="30" />
            </Field>
          </div>
        )}

        {/* Save */}
        <div className="mt-8 pt-6 border-t border-hairline-light flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-[13px] text-success font-medium">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
          <button
            onClick={save}
            className="h-[36px] px-6 rounded-full text-[13.5px] font-semibold bg-ink text-on-dark hover:opacity-80 transition-opacity"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-[10px] border border-hairline-light bg-surface-soft px-3 py-2 text-[14px] text-ink outline-none focus:border-ink transition-colors h-[38px]";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-medium text-ink">{label}</label>
      {hint && <p className="text-[11.5px] text-stone">{hint}</p>}
      {children}
    </div>
  );
}

function Toggle({
  label, description, checked, onChange,
}: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-[13.5px] font-medium text-ink">{label}</div>
        <div className="text-[12px] text-stone mt-0.5">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-ink" : "bg-hairline-light",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
