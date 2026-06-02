// lib/mock/companies/types.ts
//
// Central data model for the multi-company demo. Every dashboard page reads
// its data from the active CompanyProfile (see lib/mock/company-context.tsx).
// All data here is mock — there is no backend in demo mode.

import type { MockApproval } from "@/lib/mock/approvals";

export type { MockApproval, ApprovalLineItem } from "@/lib/mock/approvals";

/* ─────────────── Feature flags ─────────────── */

export type FeatureKey =
  | "service-contracts"
  | "seasonality"
  | "competency"
  | "projects"
  | "weather-scheduling"
  | "site-survey"
  | "variation-orders"
  | "pattern-quoting"
  | "cashflow-forecast"
  | "quote-shelf-life"
  | "auto-review";

/* ─────────────── Today ─────────────── */

export interface TodayStat {
  label: string;
  value: string;
  /** Optional green delta shown with an up-arrow before `sub`. */
  delta?: string;
  sub: string;
  accent?: boolean;
}

export interface DiaryEntry {
  id: string;
  time: string;
  title: string;
  detail: string;
  location: string;
  status: "unconfirmed" | "confirmed" | "booked";
  statusPill?: "ok" | "info";
  customer?: string;
  email?: string;
  phone?: string;
}

export interface RiskCard {
  title: string;
  body: string;
  customer: string;
}

export interface TodayData {
  date: string;
  greetingName: string;
  greetingLine: string;
  diarySubtitle: string;
  stats: TodayStat[];
  diary: DiaryEntry[];
  risk?: RiskCard;
}

/* ─────────────── Money ─────────────── */

export interface InvoiceRow {
  id: string;
  name: string;
  email: string;
  ref: string;
  amount: string;
  age: string;
  pill: "bad" | "warn" | "info";
  chaseNote: string;
  actionLabel: string;
  primary?: boolean;
  daysOverdue?: number;
}

export interface DueWeekRow {
  name: string;
  email: string;
  ref: string;
  amount: string;
  due: string;
}

export interface Mismatch {
  id: string;
  desc: string;
  amount: number;
  date: string;
  action: string;
}

export interface CashflowDay {
  label: string;
  in: number;
  out: number;
}

export interface FeeBreakdown {
  what: string;
  count: number;
  value: number;
}

export interface ForecastWeek {
  week: string;
  in: number;
  out: number;
}

export interface StaleQuote {
  customer: string;
  ref: string;
  amount: string;
  ageDays: number;
  sku: string;
  move: string;
}

export interface MoneyData {
  subtitle: string;
  cashOnHand: string;
  cashDeltaPct: string;
  in7: string;
  in7Count: string;
  out7: string;
  out7Detail: string;
  cashflowDays: CashflowDay[];
  overdue30: InvoiceRow[];
  overdue30Sub: string;
  overdue730: InvoiceRow[];
  overdue730Sub: string;
  dueWeek: DueWeekRow[];
  dueWeekSub: string;
  mismatches: Mismatch[];
  mismatchSummary: string;
  reconMatchedBase: number;
  reconTotal: number;
  reconFinished: string;
  reconTook: string;
  feesBreakdown: FeeBreakdown[];
  csvName: string;
  /** Tier-1: 8-week committed-out vs expected-in forecast. */
  forecast: ForecastWeek[];
  forecastNote: string;
  /** Tier-1: quote shelf-life monitor. */
  staleQuotes: StaleQuote[];
}

/* ─────────────── Calendar ─────────────── */

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export interface CalJob {
  id: string;
  time: string;
  durationMins: number;
  kind: string; // survey | install | delivery | showroom | callout | service | snag | inspection
  title: string;
  detail: string;
  team: string;
  teamColor: string;
  location: string;
  status: "confirmed" | "tentative" | "cancelled" | "completed";
  phone?: string;
  /** Roofing: job depends on dry weather. */
  weatherDep?: boolean;
}

export interface CalendarData {
  title: string;
  weekRange: string;
  teams: Record<string, string>;
  dayLabels: Record<DayKey, string>;
  week: Record<DayKey, CalJob[]>;
}

/* ─────────────── Customers ─────────────── */

export interface CustomerJob {
  date: string;
  type: string;
  detail: string;
  status: "completed" | "upcoming" | "cancelled";
}

export interface CustomerInvoice {
  number: string;
  amount: string;
  date: string;
  status: "paid" | "overdue" | "pending";
  daysOverdue?: number;
  daysToPay?: number;
}

export interface CustomerMessage {
  date: string;
  direction: "in" | "out";
  channel: string;
  subject: string;
  snippet: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  since: string;
  kind: "trade" | "retail";
  lastJob: string;
  nextJob?: string;
  pm: string;
  totalSpend: string;
  outstanding: string;
  source: "Website" | "Word of mouth" | "Instagram" | "Trade show" | "Direct call";
  hubspotStage: "Customer" | "Qualified lead" | "Proposal sent" | "Negotiation";
  industry: string;
  monthlySpend: number[];
  daysToPay: number[];
  channelMix: { channel: string; count: number; color: string }[];
  aging: { current: number; d30: number; d60: number; d90: number };
  notes: string[];
  jobs: CustomerJob[];
  invoices: CustomerInvoice[];
  messages: CustomerMessage[];
}

export interface QuoteLine {
  id: string;
  desc: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

export interface QuoteTemplate {
  label: string;
  tag: string;
  lines: QuoteLine[];
  notes: string;
}

/* ─────────────── Products ─────────────── */

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  trade: string;
  retail: string;
  onHand: number;
  reserved: number;
  reorderAt: number;
  leadTime: string;
  supplier: string;
  thumbBg: string;
}

export interface ProductsData {
  subtitleSuffix: string; // e.g. "SKUs · N need restocking" computed, this is the noun
  items: Product[];
  poSupplier: string;
  poDraftBlurb: string;
}

/* ─────────────── Compliance ─────────────── */

export interface ComplianceDetailRow {
  label: string;
  value: string;
  ok?: boolean;
}

export interface ComplianceDetail {
  intro?: string;
  rows?: ComplianceDetailRow[];
  note?: string;
  confirmLabel: string;
  successTitle: string;
  successSub: string;
}

export interface ComplianceDeadline {
  key: string;
  dot: string;
  title: string;
  desc: string;
  progress: string;
  pillCls: string;
  pillTxt: string;
  when: string;
  actionLabel: string;
  actionType: "secondary" | "ghost";
  detail?: ComplianceDetail;
}

export interface ComplianceConnector {
  initials: string;
  name: string;
  by: string;
  scopes: string;
  last: string;
  status: string;
  statusCls: string;
  iconBg: string;
  iconFg: string;
}

export interface AuditRow {
  time: string;
  event: string;
  detail: string;
  ref: string;
  actor: string;
  pillCls: string;
  pillTxt: string;
}

export interface ComplianceData {
  subtitle: string;
  intro: string;
  hero: {
    pillLabel: string;
    urgentLabel: string;
    title: string;
    body: string;
    pct: number;
    pctLabel: string;
    pctNote: string;
    confirmLabel: string;
    successTitle: string;
    successSub: string;
    rows: ComplianceDetailRow[];
  };
  legend: { color: string; label: string }[];
  deadlines: ComplianceDeadline[];
  connectors: ComplianceConnector[];
  audit: AuditRow[];
  csvName: string;
}

/* ─────────────── Inbox ─────────────── */

export interface InboxItem {
  id: string;
  sender: string;
  initials: string;
  channel: "Email" | "Web form" | "Instagram DM" | "Voicemail" | "HubSpot";
  preview: string;
  time: string;
  unread: boolean;
  kind: "trade" | "retail" | "supplier";
  subject: string;
  body: string;
  draft: string | null;
  sources: string[];
  status: "active" | "done" | "sent";
  /** Shown when there is no draft to explain why Claude held back. */
  noDraftReason?: string;
}

/* ─────────────── Chase list seed ─────────────── */

export interface SeedChaseEntry {
  id: string;
  customer: string;
  invoiceRef?: string;
  amount?: string;
  reason: string;
  addedHoursAgo: number;
  source: "today-risk" | "money-overdue" | "money-due" | "manual";
  status: "pending" | "sent" | "snoozed";
}

/* ─────────────── Signature features ─────────────── */

export interface ServiceContractPlan {
  id: string;
  customer: string;
  address: string;
  plan: string;
  asset: string;
  monthly: string;
  lastService: string;
  nextService: string;
  daysToService: number;
  status: "active" | "due" | "overdue" | "lapsed";
}

export interface ServiceContractsData {
  summaryMrr: string;
  summaryActive: number;
  summaryDue: number;
  summaryRenewalRate: string;
  intro: string;
  plans: ServiceContractPlan[];
  readyToSchedule: { customer: string; asset: string; due: string; channel: string }[];
}

export interface SeasonalityMonth {
  month: string;
  revenue: number;
  costs: number;
  vat?: number;
}

export interface SeasonalityData {
  intro: string;
  months: SeasonalityMonth[];
  troughNote: string;
  recommendation: string;
  smoothedNote: string;
}

export interface CompetencyEngineer {
  name: string;
  role: string;
  quals: { name: string; status: "valid" | "expiring" | "expired"; expires: string }[];
}

export interface EicrJob {
  property: string;
  landlord: string;
  expires: string;
  daysOut: number;
  stage: "90-day" | "60-day" | "30-day" | "overdue" | "booked";
  channel: string;
}

export interface CompetencyData {
  intro: string;
  certColumns: string[];
  engineers: CompetencyEngineer[];
  eicrIntro: string;
  eicrJobs: EicrJob[];
}

export interface ProjectTradeBar {
  trade: string;
  team: string;
  startDay: number; // 0-based day index in the project window
  span: number; // number of days
  color: string;
  status: "done" | "active" | "upcoming";
}

export interface ProjectDelivery {
  supplier: string;
  item: string;
  eta: string;
  status: "delivered" | "in-transit" | "ordered" | "at-risk";
  deposit: string;
  atRisk?: boolean;
}

export interface ProjectRecord {
  id: string;
  name: string;
  customer: string;
  windowLabel: string;
  dayLabels: string[];
  progressPct: number;
  trades: ProjectTradeBar[];
  deliveries: ProjectDelivery[];
  customerNote: string;
}

export interface ProjectsData {
  intro: string;
  depositAtRisk: string;
  projects: ProjectRecord[];
}

export interface WeatherDay {
  day: string;
  date: string;
  condition: string;
  tempC: number;
  windMph: number;
  rainPct: number;
  suitable: boolean;
}

export interface WeatherJob {
  title: string;
  customer: string;
  needsDry: boolean;
  scheduled: string;
  suggestion: string;
  action: "ok" | "move";
}

export interface WeatherData {
  intro: string;
  forecast: WeatherDay[];
  jobs: WeatherJob[];
}

export interface SiteSurveyData {
  intro: string;
  checklist: { section: string; items: string[] }[];
  recent: { customer: string; date: string; photos: number; dims: string; status: "captured" | "draft" }[];
}

export interface VariationOrder {
  id: string;
  job: string;
  customer: string;
  desc: string;
  amount: string;
  status: "proposed" | "approved" | "declined";
  raised: string;
}

export interface PatternQuotingData {
  intro: string;
  patterns: { name: string; wastagePct: number; cutTime: string; note: string }[];
  prepLines: { label: string; price: string; when: string }[];
}

/* ─────────────── The profile ─────────────── */

export interface CompanyProfile {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  trade: string;
  tradeShort: string;
  ownerName: string;
  ownerFirst: string;
  ownerInitials: string;
  features: FeatureKey[];
  overnightNote: string;

  today: TodayData;
  money: MoneyData;
  calendar: CalendarData;
  customers: Customer[];
  quoteTemplates: QuoteTemplate[];
  products: ProductsData;
  compliance: ComplianceData;
  inbox: InboxItem[];
  inboxDrafts: Record<string, { draft: string; sources: string[] }>;
  approvals: MockApproval[];
  chase: SeedChaseEntry[];

  serviceContracts?: ServiceContractsData;
  seasonality?: SeasonalityData;
  competency?: CompetencyData;
  projects?: ProjectsData;
  weather?: WeatherData;
  siteSurvey?: SiteSurveyData;
  variationOrders?: VariationOrder[];
  patternQuoting?: PatternQuotingData;
}
