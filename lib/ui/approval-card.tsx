import { approveAction, rejectAction } from "@/app/actions/approve";
import type { ApprovalWithRun } from "@/lib/db/queries/approvals";

type Props = { approval: ApprovalWithRun };

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatEur(amount: number): string {
  return amount.toLocaleString("en-IE", { style: "currency", currency: "EUR" });
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}

function humanKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(key: string, value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return `${value.length} items`;
  if (value !== null && typeof value === "object") return "See detail";
  if (typeof value === "number") {
    const lk = key.toLowerCase();
    if (
      lk.includes("amount") || lk.includes("price") || lk.includes("total") ||
      lk.includes("balance") || lk.includes("revenue") || lk.includes("payroll") ||
      lk.includes("shortfall")
    ) {
      return formatEur(value);
    }
    return value.toLocaleString("en-IE");
  }
  if (typeof value === "string") {
    // ISO date detection
    if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) return formatDate(value);
    return value;
  }
  return String(value);
}

function sourceName(source: string): string {
  const map: Record<string, string> = {
    quickbooks: "QuickBooks",
    stripe: "Stripe",
    paypal: "PayPal",
  };
  return map[source.toLowerCase()] ?? source;
}

function sourceBadge(source: string): string {
  const map: Record<string, string> = {
    quickbooks: "bg-green-100 text-green-800",
    stripe: "bg-purple-100 text-purple-800",
    paypal: "bg-blue-100 text-blue-800",
  };
  return map[source.toLowerCase()] ?? "bg-stone-100 text-stone-700";
}

// ---------------------------------------------------------------------------
// Type guards for each renderer
// ---------------------------------------------------------------------------

type ToolSpec = {
  toolName: string;
  args: Record<string, unknown>;
};

function hasStr(obj: Record<string, unknown>, ...keys: string[]): boolean {
  return keys.every((k) => typeof obj[k] === "string");
}

function isEmailSpec(spec: ToolSpec): spec is ToolSpec & {
  args: { to: string; subject: string; body: string };
} {
  return hasStr(spec.args, "to", "subject", "body");
}

interface MismatchArgs {
  id: string;
  source: string;
  amount: number;
  note: string;
}

function isMismatchSpec(spec: ToolSpec): spec is ToolSpec & { args: MismatchArgs } {
  return (
    hasStr(spec.args, "id", "source", "note") &&
    typeof spec.args.amount === "number"
  );
}

interface ReconciliationSummary {
  totalMatched: number;
  totalUnmatched: number;
  netDifference: number;
  period: { month: number; year: number } | string;
}

interface ReconciliationItem {
  source: string;
  matched: number;
  unmatched: number;
}

interface MismatchItem {
  id: string;
  source: string;
  amount: number;
  note: string;
}

interface ReconciliationArgs {
  summary: ReconciliationSummary;
  reconciliationItems: ReconciliationItem[];
  mismatches: MismatchItem[];
}

function isReconciliationSpec(spec: ToolSpec): spec is ToolSpec & { args: ReconciliationArgs } {
  return (
    Array.isArray(spec.args.reconciliationItems) &&
    Array.isArray(spec.args.mismatches) &&
    spec.args.summary !== null &&
    typeof spec.args.summary === "object"
  );
}

interface CashFlowArgs {
  currentBalance: number;
  projectedBalance30Days: number;
  warnings: string[];
  upcomingInflows?: Array<{ label: string; amount: number }>;
  upcomingOutflows?: Array<{ label: string; amount: number }>;
}

function isCashFlowSpec(spec: ToolSpec): spec is ToolSpec & { args: CashFlowArgs } {
  return (
    typeof spec.args.currentBalance === "number" &&
    typeof spec.args.projectedBalance30Days === "number" &&
    Array.isArray(spec.args.warnings)
  );
}

interface MarginLine {
  name: string;
  margin?: number;
  marginPct?: number;
}

interface MarginArgs {
  topMarginLines: MarginLine[];
  bottomMarginLines: MarginLine[];
  observations?: string[];
}

function isMarginSpec(spec: ToolSpec): spec is ToolSpec & { args: MarginArgs } {
  return Array.isArray(spec.args.topMarginLines) && Array.isArray(spec.args.bottomMarginLines);
}

interface PayrollArgs {
  estimatedPayroll: number;
  sufficient: boolean;
  payrollDate: string;
  currentBalance?: number;
  shortfall?: number;
}

function isPayrollSpec(spec: ToolSpec): spec is ToolSpec & { args: PayrollArgs } {
  return (
    typeof spec.args.estimatedPayroll === "number" &&
    typeof spec.args.sufficient === "boolean" &&
    typeof spec.args.payrollDate === "string"
  );
}

interface ContentIdea {
  title: string;
  format: string;
  rationale: string;
  keyPoints?: string[];
}

function isContentIdeasSpec(spec: ToolSpec): spec is ToolSpec & { args: { ideas: ContentIdea[] } } {
  return Array.isArray(spec.args.ideas);
}

interface ContractArgs {
  subject: string;
  sender: string;
  keyTerms: string[];
  recommendation: "Approve" | "Negotiate" | "Reject";
  unusualClauses?: string[];
}

function isContractSpec(spec: ToolSpec): spec is ToolSpec & { args: ContractArgs } {
  return (
    hasStr(spec.args, "subject", "sender") &&
    Array.isArray(spec.args.keyTerms) &&
    typeof spec.args.recommendation === "string"
  );
}

interface AttributionRow {
  campaignName: string;
  dealsCount: number;
  totalRevenue: number;
  avgDealSize?: number;
}

interface CampaignArgs {
  attributionRows: AttributionRow[];
  period: { startDate: string; endDate: string } | string;
  unattributed?: { totalRevenue: number; dealsCount: number };
  unattributedRevenue?: number;
}

function isCampaignSpec(spec: ToolSpec): spec is ToolSpec & { args: CampaignArgs } {
  return Array.isArray(spec.args.attributionRows);
}

interface ChecklistItem {
  label: string;
  count?: number;
  urgency?: "high" | "medium" | "low";
}

interface ChecklistArgs {
  items: ChecklistItem[];
  unreconciledCount?: number;
  missingReceipts?: number;
  unpaidBills?: number;
}

function isChecklistSpec(spec: ToolSpec): spec is ToolSpec & { args: ChecklistArgs } {
  return Array.isArray(spec.args.items);
}

interface MonthEndChecklistItem {
  category: string;
  count: number;
  urgency: "high" | "medium" | "low";
}

interface MonthEndArgs {
  to: string;
  subject: string;
  body: string;
  unreconciledCount: number;
  missingReceiptsCount: number;
  unpaidBillsTotal: number;
  items: MonthEndChecklistItem[];
}

function isMonthEndSpec(spec: ToolSpec): spec is ToolSpec & { args: MonthEndArgs } {
  return spec.toolName === "month-end.checklist";
}

interface LeadOutreachArgs {
  to: string;
  subject: string;
  body: string;
  fitScore: number;
  fitScoreRationale: string;
  company: string;
}

function isLeadOutreachSpec(spec: ToolSpec): spec is ToolSpec & { args: LeadOutreachArgs } {
  return spec.toolName === "lead.outreach_email";
}

interface AtRiskAccount {
  contactId: string;
  name: string;
  company: string;
  lastActivity: string;
  riskReason: string;
  draftId: string;
}

interface CustomerPulseArgs {
  atRiskAccounts: AtRiskAccount[];
  healthyAccounts: { count: number };
  summary: string;
}

function isCustomerPulseSpec(spec: ToolSpec): spec is ToolSpec & { args: CustomerPulseArgs } {
  return Array.isArray(spec.args.atRiskAccounts);
}

interface OnboardingArgs {
  to: string;
  subject: string;
  body: string;
  name: string;
  startDate: string;
  checklist: string[];
}

function isOnboardingSpec(spec: ToolSpec): spec is ToolSpec & { args: OnboardingArgs } {
  return spec.toolName === "employee.onboarding";
}

// ---------------------------------------------------------------------------
// Individual renderers
// ---------------------------------------------------------------------------

function EmailDetail({ args }: { args: { to: string; subject: string; body: string } }) {
  const lines = args.body.split("\n");
  return (
    <div className="mt-3 rounded-[16px] border border-hairline-light overflow-hidden text-sm">
      <div className="bg-surface-soft border-b border-hairline-light divide-y divide-hairline-light">
        <div className="flex gap-3 px-4 py-2.5">
          <span className="text-stone w-14 shrink-0">To</span>
          <span className="text-ink">{args.to}</span>
        </div>
        <div className="flex gap-3 px-4 py-2.5">
          <span className="text-stone w-14 shrink-0">Subject</span>
          <span className="text-ink font-medium">{args.subject}</span>
        </div>
      </div>
      <div className="px-4 py-4 bg-white text-ink leading-relaxed space-y-3">
        {lines.map((line, i) =>
          line.trim() === "" ? (
            <div key={i} className="h-1" />
          ) : (
            <p key={i}>{line}</p>
          )
        )}
      </div>
    </div>
  );
}

function MismatchDetail({ args }: { args: MismatchArgs }) {
  return (
    <div className="mt-3 rounded-[16px] border border-hairline-light p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sourceBadge(args.source)}`}>
          {sourceName(args.source)}
        </span>
        <span className="text-stone font-mono text-xs">{args.id}</span>
      </div>
      <p className="text-2xl font-semibold text-ink tabular-nums">{formatEur(args.amount)}</p>
      <p className="text-sm text-ink">{args.note}</p>
    </div>
  );
}

function formatPeriod(period: ReconciliationSummary["period"]): string {
  if (typeof period === "string") return period;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[(period.month ?? 1) - 1]} ${period.year}`;
}

function ReconciliationDetail({ args }: { args: ReconciliationArgs }) {
  const { summary, reconciliationItems, mismatches } = args;
  return (
    <div className="mt-3 space-y-4">
      {/* Summary bar */}
      <div className="rounded-[16px] border border-hairline-light bg-surface-soft px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span className="text-green-700 font-medium">✓ {summary.totalMatched} matched</span>
        <span className="text-amber-700 font-medium">⚠ {summary.totalUnmatched} unmatched</span>
        <span className="text-stone">Net difference: {formatEur(summary.netDifference)}</span>
        <span className="text-stone">Period: {formatPeriod(summary.period)}</span>
      </div>

      {/* Source table */}
      {reconciliationItems.length > 0 && (
        <div className="rounded-[16px] border border-hairline-light overflow-hidden text-sm">
          <div className="grid grid-cols-3 bg-surface-soft px-4 py-2 text-xs text-stone font-medium border-b border-hairline-light">
            <span>Source</span>
            <span className="text-right">Matched</span>
            <span className="text-right">Unmatched</span>
          </div>
          {reconciliationItems.map((row) => (
            <div key={row.source} className="grid grid-cols-3 px-4 py-2.5 border-b border-hairline-light last:border-0">
              <span className="text-ink">{sourceName(row.source)}</span>
              <span className="text-right text-green-700 font-medium">{row.matched}</span>
              <span className={`text-right font-medium ${row.unmatched > 0 ? "text-amber-700" : "text-stone"}`}>
                {row.unmatched}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Mismatches */}
      {mismatches.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-stone font-medium px-1">Unmatched items</p>
          {mismatches.map((m) => (
            <MismatchDetail key={m.id} args={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function CashFlowDetail({ args }: { args: CashFlowArgs }) {
  const projLow = args.projectedBalance30Days < 5000;
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-[16px] border border-hairline-light p-4 space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-stone">Current balance</span>
          <span className="text-2xl font-semibold text-ink tabular-nums">{formatEur(args.currentBalance)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-stone">Projected in 30 days</span>
          <span className={`text-xl font-semibold tabular-nums ${projLow ? "text-red-600" : "text-green-700"}`}>
            {formatEur(args.projectedBalance30Days)}
          </span>
        </div>
      </div>

      {((args.upcomingInflows?.length ?? 0) > 0 || (args.upcomingOutflows?.length ?? 0) > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {args.upcomingInflows && args.upcomingInflows.length > 0 && (
            <div className="rounded-[12px] border border-hairline-light p-3">
              <p className="text-xs text-stone mb-2 font-medium">Incoming</p>
              <ul className="space-y-1.5">
                {args.upcomingInflows.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-stone">{item.label}</span>
                    <span className="text-green-700 font-medium tabular-nums">{formatEur(item.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {args.upcomingOutflows && args.upcomingOutflows.length > 0 && (
            <div className="rounded-[12px] border border-hairline-light p-3">
              <p className="text-xs text-stone mb-2 font-medium">Outgoing</p>
              <ul className="space-y-1.5">
                {args.upcomingOutflows.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-stone">{item.label}</span>
                    <span className="text-red-600 font-medium tabular-nums">{formatEur(item.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {args.warnings.length > 0 && (
        <div className="space-y-2">
          {args.warnings.map((w, i) => (
            <div key={i} className="rounded-[12px] bg-amber-50 border border-amber-200 px-4 py-3 flex gap-2 text-sm text-amber-800">
              <span>⚠</span>
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MarginDetail({ args }: { args: MarginArgs }) {
  return (
    <div className="mt-3 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[12px] border border-hairline-light overflow-hidden">
          <div className="bg-green-50 px-4 py-2 text-xs font-medium text-green-800 border-b border-hairline-light">
            Best performing
          </div>
          {args.topMarginLines.map((line, i) => (
            <div key={i} className="flex justify-between px-4 py-2.5 text-sm border-b border-hairline-light last:border-0">
              <span className="text-ink">{line.name}</span>
              <span className="text-green-700 font-semibold tabular-nums">{(line.marginPct ?? line.margin ?? 0).toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <div className="rounded-[12px] border border-hairline-light overflow-hidden">
          <div className="bg-red-50 px-4 py-2 text-xs font-medium text-red-800 border-b border-hairline-light">
            Needs attention
          </div>
          {args.bottomMarginLines.map((line, i) => (
            <div key={i} className="flex justify-between px-4 py-2.5 text-sm border-b border-hairline-light last:border-0">
              <span className="text-ink">{line.name}</span>
              <span className="text-red-600 font-semibold tabular-nums">{(line.marginPct ?? line.margin ?? 0).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
      {args.observations && args.observations.length > 0 && (
        <ul className="space-y-1 pl-4 list-disc text-sm text-stone">
          {args.observations.map((obs, i) => (
            <li key={i}>{obs}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PayrollDetail({ args }: { args: PayrollArgs }) {
  const date = formatDate(args.payrollDate);
  const shortfall = args.shortfall ?? (args.currentBalance !== undefined ? args.estimatedPayroll - args.currentBalance : 0);
  return (
    <div className="mt-3 rounded-[16px] border border-hairline-light p-4 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-stone">Payroll date</span>
        <span className="text-ink font-medium">{date}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-stone">Estimated payroll</span>
        <span className="text-ink font-semibold tabular-nums">{formatEur(args.estimatedPayroll)}</span>
      </div>
      {args.currentBalance !== undefined && (
        <div className="flex justify-between text-sm">
          <span className="text-stone">Current balance</span>
          <span className="text-ink font-semibold tabular-nums">{formatEur(args.currentBalance)}</span>
        </div>
      )}
      <div className={`rounded-[12px] px-4 py-3 flex gap-2 text-sm font-medium ${args.sufficient ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
        {args.sufficient ? (
          <span>✓ Sufficient funds confirmed</span>
        ) : (
          <span>⚠ Shortfall of {formatEur(shortfall)} — action needed before payroll</span>
        )}
      </div>
    </div>
  );
}

function formatBadge(format: string): string {
  const map: Record<string, string> = {
    blog: "bg-blue-100 text-blue-800",
    email: "bg-green-100 text-green-800",
    social: "bg-purple-100 text-purple-800",
  };
  return map[format.toLowerCase()] ?? "bg-stone-100 text-stone-700";
}

function ContentIdeasDetail({ args }: { args: { ideas: ContentIdea[] } }) {
  return (
    <div className="mt-3 space-y-3">
      {args.ideas.map((idea, i) => (
        <div key={i} className="rounded-[16px] border border-hairline-light p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">{idea.title}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${formatBadge(idea.format)}`}>
              {idea.format}
            </span>
          </div>
          <p className="text-sm text-stone">{idea.rationale}</p>
          {idea.keyPoints && idea.keyPoints.length > 0 && (
            <ul className="space-y-1 pl-4 list-disc text-sm text-stone">
              {idea.keyPoints.map((pt, j) => (
                <li key={j}>{pt}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function recommendationBadge(rec: string): string {
  const map: Record<string, string> = {
    Approve: "bg-green-100 text-green-800",
    Negotiate: "bg-amber-100 text-amber-800",
    Reject: "bg-red-100 text-red-700",
  };
  return map[rec] ?? "bg-stone-100 text-stone-700";
}

function ContractDetail({ args }: { args: ContractArgs }) {
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-[16px] border border-hairline-light overflow-hidden text-sm divide-y divide-hairline-light">
        <div className="flex gap-3 px-4 py-2.5">
          <span className="text-stone w-20 shrink-0">From</span>
          <span className="text-ink">{args.sender}</span>
        </div>
        <div className="flex gap-3 px-4 py-2.5">
          <span className="text-stone w-20 shrink-0">Subject</span>
          <span className="text-ink font-medium">{args.subject}</span>
        </div>
        <div className="flex gap-3 px-4 py-2.5 items-center">
          <span className="text-stone w-20 shrink-0">Recommendation</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${recommendationBadge(args.recommendation)}`}>
            {args.recommendation}
          </span>
        </div>
      </div>
      {args.keyTerms.length > 0 && (
        <div className="rounded-[12px] border border-hairline-light p-4">
          <p className="text-xs text-stone font-medium mb-2">Key terms</p>
          <ul className="space-y-1 pl-4 list-disc text-sm text-ink">
            {args.keyTerms.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      {args.unusualClauses && args.unusualClauses.length > 0 && (
        <div className="rounded-[12px] bg-amber-50 border border-amber-200 p-4">
          <p className="text-xs font-medium text-amber-800 mb-2">Unusual clauses</p>
          <ul className="space-y-1 pl-4 list-disc text-sm text-amber-800">
            {args.unusualClauses.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CampaignDetail({ args }: { args: CampaignArgs }) {
  const totalRevenue = args.attributionRows.reduce((s, r) => s + r.totalRevenue, 0);
  const unattributedRevenue = args.unattributed?.totalRevenue ?? args.unattributedRevenue;
  const period = typeof args.period === "object"
    ? `${formatDate(args.period.startDate)} – ${formatDate(args.period.endDate)}`
    : args.period;

  return (
    <div className="mt-3 space-y-3">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[12px] bg-surface-soft px-4 py-3">
          <p className="text-xs text-stone">Total attributed</p>
          <p className="text-base font-semibold text-ink tabular-nums mt-0.5">{formatEur(totalRevenue)}</p>
        </div>
        <div className="rounded-[12px] bg-surface-soft px-4 py-3">
          <p className="text-xs text-stone">Campaigns</p>
          <p className="text-base font-semibold text-ink mt-0.5">{args.attributionRows.length}</p>
        </div>
        {unattributedRevenue !== undefined && unattributedRevenue > 0 && (
          <div className="rounded-[12px] bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-xs text-amber-700">Unattributed</p>
            <p className="text-base font-semibold text-amber-800 tabular-nums mt-0.5">{formatEur(unattributedRevenue)}</p>
          </div>
        )}
      </div>

      {/* Per-campaign table */}
      <div className="rounded-[16px] border border-hairline-light overflow-hidden text-sm">
        <div className="grid grid-cols-[1fr_auto_auto_auto] bg-surface-soft px-4 py-2 text-xs text-stone font-medium border-b border-hairline-light gap-4">
          <span>Campaign</span>
          <span className="text-right">Deals</span>
          <span className="text-right">Avg deal</span>
          <span className="text-right">Revenue</span>
        </div>
        {args.attributionRows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] px-4 py-3 border-b border-hairline-light last:border-0 gap-4 items-center">
            <span className="text-ink">{row.campaignName}</span>
            <span className="text-right text-stone tabular-nums">{row.dealsCount}</span>
            <span className="text-right text-stone tabular-nums">{row.avgDealSize !== undefined ? formatEur(row.avgDealSize) : "—"}</span>
            <span className="text-right text-ink font-semibold tabular-nums">{formatEur(row.totalRevenue)}</span>
          </div>
        ))}
      </div>

      {period && <p className="text-xs text-stone px-1">Period: {period}</p>}
    </div>
  );
}

function urgencyBadge(urgency: string | undefined): string {
  const map: Record<string, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-stone-100 text-stone-600",
  };
  return map[urgency ?? "low"] ?? "bg-stone-100 text-stone-600";
}

const URGENCY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

function ChecklistDetail({ args }: { args: ChecklistArgs }) {
  const sorted = [...args.items].sort(
    (a, b) => (URGENCY_ORDER[a.urgency ?? "low"] ?? 2) - (URGENCY_ORDER[b.urgency ?? "low"] ?? 2)
  );
  return (
    <div className="mt-3 space-y-4">
      {(args.unreconciledCount !== undefined ||
        args.missingReceipts !== undefined ||
        args.unpaidBills !== undefined) && (
        <div className="grid grid-cols-3 gap-3">
          {args.unreconciledCount !== undefined && (
            <div className="rounded-[12px] border border-hairline-light p-4 text-center">
              <p className="text-2xl font-bold text-ink">{args.unreconciledCount}</p>
              <p className="text-xs text-stone mt-1">Unreconciled</p>
            </div>
          )}
          {args.missingReceipts !== undefined && (
            <div className="rounded-[12px] border border-hairline-light p-4 text-center">
              <p className="text-2xl font-bold text-ink">{args.missingReceipts}</p>
              <p className="text-xs text-stone mt-1">Missing receipts</p>
            </div>
          )}
          {args.unpaidBills !== undefined && (
            <div className="rounded-[12px] border border-hairline-light p-4 text-center">
              <p className="text-xl font-bold text-ink tabular-nums">{formatEur(args.unpaidBills)}</p>
              <p className="text-xs text-stone mt-1">Unpaid bills</p>
            </div>
          )}
        </div>
      )}
      <div className="space-y-2">
        {sorted.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-[12px] border border-hairline-light px-4 py-2.5 text-sm">
            <span className="text-ink">{item.label}</span>
            <div className="flex items-center gap-2">
              {item.count !== undefined && (
                <span className="text-stone tabular-nums">{item.count}</span>
              )}
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${urgencyBadge(item.urgency)}`}>
                {item.urgency ?? "low"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthEndDetail({ args }: { args: MonthEndArgs }) {
  const urgencyClass = (u: string) => u === "high" ? "bg-red-100 text-red-700" : u === "medium" ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-600";
  const sorted = [...args.items].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.urgency] ?? 2) - (order[b.urgency] ?? 2);
  });
  const emailLines = args.body.split("\n");

  return (
    <div className="mt-3 space-y-4">
      {/* Quick-glance summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[12px] border-2 border-red-200 bg-red-50 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{args.unreconciledCount}</p>
          <p className="text-xs text-red-600 mt-1">Unreconciled transactions</p>
        </div>
        <div className="rounded-[12px] border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{args.missingReceiptsCount}</p>
          <p className="text-xs text-amber-600 mt-1">Missing receipts</p>
        </div>
        <div className="rounded-[12px] border-2 border-red-200 bg-red-50 p-4 text-center">
          <p className="text-xl font-bold text-red-700 tabular-nums">{formatEur(args.unpaidBillsTotal)}</p>
          <p className="text-xs text-red-600 mt-1">Unpaid bills due</p>
        </div>
      </div>

      {/* Items by priority */}
      <div className="space-y-1.5">
        {sorted.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-[12px] border border-hairline-light px-4 py-2.5 text-sm">
            <span className="text-ink">{item.category}</span>
            <div className="flex items-center gap-3">
              <span className="text-stone tabular-nums font-medium">
                {item.category.toLowerCase().includes("bill")
                  ? formatEur(args.unpaidBillsTotal)
                  : `${item.count} item${item.count !== 1 ? "s" : ""}`}
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${urgencyClass(item.urgency)}`}>
                {item.urgency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Draft email */}
      <div>
        <p className="text-xs font-medium text-stone mb-2 px-1">Draft checklist email</p>
        <div className="rounded-[16px] border border-hairline-light overflow-hidden text-sm">
          <div className="bg-surface-soft border-b border-hairline-light divide-y divide-hairline-light">
            <div className="flex gap-3 px-4 py-2.5">
              <span className="text-stone w-14 shrink-0">To</span>
              <span className="text-ink">{args.to}</span>
            </div>
            <div className="flex gap-3 px-4 py-2.5">
              <span className="text-stone w-14 shrink-0">Subject</span>
              <span className="text-ink font-medium">{args.subject}</span>
            </div>
          </div>
          <div className="px-4 py-4 bg-white text-ink leading-relaxed space-y-2">
            {emailLines.map((line, i) =>
              line === "" ? <div key={i} className="h-1" /> : <p key={i}>{line}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function fitScoreBadgeColour(score: number): string {
  if (score >= 8) return "bg-green-100 text-green-800";
  if (score >= 6) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-700";
}

function LeadOutreachDetail({ args }: { args: LeadOutreachArgs }) {
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-[16px] border border-hairline-light p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${fitScoreBadgeColour(args.fitScore)}`}>
            Fit score {args.fitScore}/10
          </span>
          <span className="text-sm text-stone">{args.company}</span>
        </div>
        <p className="text-sm text-ink">{args.fitScoreRationale}</p>
      </div>
      <EmailDetail args={args} />
    </div>
  );
}

function CustomerPulseDetail({ args }: { args: CustomerPulseArgs }) {
  const count = args.atRiskAccounts.length;
  return (
    <div className="mt-3 space-y-3">
      <p className="text-sm font-semibold text-ink px-1">
        {count} account{count !== 1 ? "s" : ""} flagged at-risk
      </p>
      {args.atRiskAccounts.map((account) => (
        <div key={account.contactId} className="rounded-[16px] border border-hairline-light p-4 space-y-2">
          <div>
            <span className="text-sm font-semibold text-ink">{account.name}</span>
            <span className="text-sm text-stone"> · {account.company}</span>
          </div>
          <p className="text-xs text-stone">Last activity: {formatDate(account.lastActivity)}</p>
          <div className="rounded-[12px] bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
            {account.riskReason}
          </div>
        </div>
      ))}
      <p className="text-xs text-stone px-1">✓ {args.healthyAccounts.count} accounts healthy</p>
      <p className="text-sm text-stone px-1">{args.summary}</p>
    </div>
  );
}

function OnboardingDetail({ args }: { args: OnboardingArgs }) {
  return (
    <div className="mt-3 space-y-4">
      <EmailDetail args={args} />
      <div className="rounded-[16px] border border-hairline-light overflow-hidden">
        <div className="bg-surface-soft px-4 py-2.5 border-b border-hairline-light">
          <p className="text-xs font-medium text-stone">Onboarding checklist</p>
        </div>
        <ul className="divide-y divide-hairline-light">
          {args.checklist.map((item, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink">
              <span className="text-stone shrink-0">○</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GenericDetail({ args }: { args: Record<string, unknown> }) {
  const entries = Object.entries(args).filter(([, v]) => v !== null && typeof v !== "object");
  const nested = Object.entries(args).filter(([, v]) => v !== null && typeof v === "object" && !Array.isArray(v));
  return (
    <div className="mt-3 rounded-[16px] border border-hairline-light overflow-hidden text-sm">
      <div className="divide-y divide-hairline-light">
        {entries.map(([key, value]) => (
          <div key={key} className="flex gap-3 px-4 py-2.5">
            <span className="text-stone w-40 shrink-0">{humanKey(key)}</span>
            <span className="text-ink break-all">{formatValue(key, value)}</span>
          </div>
        ))}
        {Object.entries(args)
          .filter(([, v]) => Array.isArray(v))
          .map(([key, value]) => (
            <div key={key} className="flex gap-3 px-4 py-2.5">
              <span className="text-stone w-40 shrink-0">{humanKey(key)}</span>
              <span className="text-stone">{formatValue(key, value)}</span>
            </div>
          ))}
        {nested.map(([key]) => (
          <div key={key} className="flex gap-3 px-4 py-2.5 bg-surface-soft">
            <span className="text-stone w-40 shrink-0">{humanKey(key)}</span>
            <span className="text-stone italic text-xs">See full detail above</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

function SpecDetail({ spec }: { spec: ToolSpec }) {
  if (isLeadOutreachSpec(spec)) return <LeadOutreachDetail args={spec.args} />;
  if (isOnboardingSpec(spec)) return <OnboardingDetail args={spec.args} />;
  if (isMonthEndSpec(spec)) return <MonthEndDetail args={spec.args} />;
  if (isCustomerPulseSpec(spec)) return <CustomerPulseDetail args={spec.args} />;
  if (isReconciliationSpec(spec)) return <ReconciliationDetail args={spec.args} />;
  if (isMismatchSpec(spec)) return <MismatchDetail args={spec.args} />;
  if (isCashFlowSpec(spec)) return <CashFlowDetail args={spec.args} />;
  if (isMarginSpec(spec)) return <MarginDetail args={spec.args} />;
  if (isPayrollSpec(spec)) return <PayrollDetail args={spec.args} />;
  if (isContentIdeasSpec(spec)) return <ContentIdeasDetail args={spec.args} />;
  if (isContractSpec(spec)) return <ContractDetail args={spec.args} />;
  if (isCampaignSpec(spec)) return <CampaignDetail args={spec.args} />;
  if (isChecklistSpec(spec)) return <ChecklistDetail args={spec.args} />;
  if (isEmailSpec(spec)) return <EmailDetail args={spec.args} />;
  return <GenericDetail args={spec.args} />;
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function ApprovalCard({ approval }: Props) {
  const proposed = new Date(approval.proposedAt).toLocaleString("en-IE", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const spec = approval.toolCallSpec as ToolSpec;

  return (
    <div className="bg-surface-card border border-hairline-light rounded-[20px] p-6 space-y-4">
      <div className="space-y-1">
        <p className="text-xs text-stone">
          {approval.run.workflowName.replace(/-/g, " ")} · proposed {proposed}
        </p>
        <p className="text-sm font-medium text-ink">{approval.action}</p>
      </div>

      <details className="group">
        <summary className="text-xs text-stone cursor-pointer select-none hover:text-ink transition-colors list-none flex items-center gap-1.5">
          <span className="group-open:hidden">▶ Show detail</span>
          <span className="hidden group-open:inline">▼ Hide detail</span>
        </summary>
        <SpecDetail spec={spec} />
      </details>

      <div className="flex gap-2">
        <form action={approveAction.bind(null, approval.id)} className="flex-1">
          <button
            type="submit"
            className="w-full bg-canvas-dark text-on-dark rounded-full h-12 font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Approve
          </button>
        </form>
        <form action={rejectAction.bind(null, approval.id)}>
          <button
            type="submit"
            className="bg-surface-soft text-ink rounded-full h-12 font-semibold text-sm px-6 hover:opacity-80 transition-opacity"
          >
            Reject
          </button>
        </form>
      </div>
    </div>
  );
}
