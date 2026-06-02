// lib/mock/companies/calderwood.ts
// Calderwood Plumbing & Heating — service contracts + seasonality (report 3.1 / 3.7).

import type { CompanyProfile } from "./types";

export const calderwood: CompanyProfile = {
  id: "calderwood",
  name: "Calderwood Plumbing & Heating",
  shortName: "Calderwood",
  initials: "C",
  trade: "Plumbing & heating engineers",
  tradeShort: "Plumbing & heating · Sheffield",
  ownerName: "Rob Calderwood",
  ownerFirst: "Rob",
  ownerInitials: "RC",
  features: ["service-contracts", "seasonality", "cashflow-forecast", "quote-shelf-life", "auto-review"],
  overnightNote: "Batched 9 annual-service reminders, reconciled the bank, drafted 3 callout replies.",

  today: {
    date: "Thursday, 29 May",
    greetingName: "Rob",
    greetingLine:
      "Five things need a yes. Two emergency callouts came in overnight, and 9 boiler services are ready to book before the summer lull.",
    diarySubtitle: "5 jobs · two callouts, two services and a bathroom survey",
    stats: [
      { label: "Cash on hand", value: "£38,210", delta: "+£1,840", sub: "vs last Thu" },
      { label: "Service plan MRR", value: "£4,920", sub: "164 plans · +6 this month" },
      { label: "Due in this week", value: "£11,400", sub: "8 invoices · 3 at 60+ days" },
      { label: "Approvals waiting", value: "5", sub: "oldest queued 18m ago", accent: true },
    ],
    diary: [
      { id: "d1", time: "07:40", title: "Emergency callout — no hot water", detail: "Combi lockout · Mrs Ahmed", location: "Crookes, S10", status: "confirmed", statusPill: "ok" },
      { id: "d2", time: "09:30", title: "Annual service — Worcester combi", detail: "Service plan · Mr Doherty", location: "Nether Edge, S7", status: "unconfirmed", customer: "Mr Doherty", email: "j.doherty@gmail.com", phone: "+44 7700 901221" },
      { id: "d3", time: "11:30", title: "Bathroom survey — full rip-out", detail: "Quote · ~£8k · with Sam", location: "Dore, S17", status: "unconfirmed", customer: "The Pearsons", email: "pearson.home@gmail.com", phone: "+44 7700 901884" },
      { id: "d4", time: "13:30", title: "Landlord gas safety (CP12)", detail: "3 flats · Holloway Lettings", location: "Walkley, S6", status: "booked", statusPill: "info" },
      { id: "d5", time: "15:30", title: "Annual service — Vaillant system", detail: "Service plan · Mrs Whitfield", location: "Totley, S17", status: "unconfirmed", customer: "Mrs Whitfield", email: "whitfield@btinternet.com", phone: "+44 7700 901442" },
    ],
    risk: {
      title: "July–August is your cash trough — and the VAT bill lands on 7 Aug",
      body:
        "Last summer revenue dropped 41% across Jul–Aug while the £6,300 VAT payment fell in the deadest week. Booking the 9 ready service reminders now pulls roughly £1,400 of work into the trough. See the Seasonality view.",
      customer: "Seasonality",
    },
  },

  money: {
    subtitle: "GBP · 2 connected accounts",
    cashOnHand: "£38,210",
    cashDeltaPct: "+2.1%",
    in7: "+£11,400",
    in7Count: "8 invoices",
    out7: "−£9,800",
    out7Detail: "payroll, merchant batch, van lease",
    cashflowDays: [
      { label: "29 Apr", in: 2100, out: 1400 }, { label: "30 Apr", in: 900, out: 2200 },
      { label: "1 May", in: 3100, out: 800 }, { label: "2 May", in: 1800, out: 3600 },
      { label: "5 May", in: 2600, out: 1200 }, { label: "6 May", in: 1400, out: 1500 },
      { label: "7 May", in: 1900, out: 980 }, { label: "8 May", in: 2700, out: 900 },
      { label: "9 May", in: 3400, out: 2800 }, { label: "12 May", in: 1100, out: 1700 },
      { label: "13 May", in: 4200, out: 1100 }, { label: "14 May", in: 1600, out: 2400 },
      { label: "15 May", in: 2900, out: 760 }, { label: "16 May", in: 1200, out: 3900 },
      { label: "19 May", in: 3100, out: 1500 }, { label: "20 May", in: 1900, out: 1100 },
      { label: "21 May", in: 3800, out: 1900 }, { label: "22 May", in: 1400, out: 980 },
      { label: "23 May", in: 2200, out: 4100 }, { label: "26 May", in: 3400, out: 1400 },
      { label: "27 May", in: 1700, out: 2100 }, { label: "28 May", in: 2600, out: 1500 },
      { label: "29 May", in: 3900, out: 1800 },
    ],
    overdue30: [
      { id: "r1", name: "Holloway Lettings", email: "accounts@holloway-lets.co.uk", ref: "INV-2208 · 4× CP12 + 2 services", amount: "£1,340.00", age: "44 days", pill: "bad", chaseNote: "Last chase 9 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 44 },
      { id: "r2", name: "Greenoak Care Home", email: "facilities@greenoak-care.uk", ref: "INV-2196 · plant room pump swap", amount: "£3,180.00", age: "38 days", pill: "bad", chaseNote: "Last chase 3 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 38 },
    ],
    overdue30Sub: "2 invoices · £4,520 outstanding",
    overdue730: [
      { id: "r3", name: "Mr & Mrs Pearson", email: "pearson.home@gmail.com", ref: "INV-2231 · cylinder + TRVs", amount: "£640.00", age: "12 days", pill: "warn", chaseNote: "No chase yet", actionLabel: "Send reminder", daysOverdue: 12 },
      { id: "r4", name: "Crosspool Dental", email: "ops@crosspooldental.co.uk", ref: "INV-2224 · boiler repair", amount: "£420.00", age: "9 days", pill: "warn", chaseNote: "Last chase 4 days ago", actionLabel: "Send reminder", daysOverdue: 9 },
      { id: "r5", name: "Mrs Ahmed", email: "s.ahmed@gmail.com", ref: "INV-2219 · emergency callout", amount: "£180.00", age: "15 days", pill: "warn", chaseNote: "No chase yet", actionLabel: "Send reminder", daysOverdue: 15 },
    ],
    overdue730Sub: "3 invoices · £1,240 outstanding",
    dueWeek: [
      { name: "Mr Doherty", email: "j.doherty@gmail.com", ref: "INV-2240 · annual service plan", amount: "£96.00", due: "due Fri 30 May" },
      { name: "Bramall Estates", email: "greg@bramall-estates.uk", ref: "INV-2238 · 6-flat CP12 batch", amount: "£540.00", due: "due Sat 31 May" },
    ],
    dueWeekSub: "2 invoices · £636 expected",
    mismatches: [
      { id: "m1", desc: "GoCardless plan fee", amount: -2.10, date: "28 May", action: "Match to merchant fees" },
      { id: "m2", desc: "GoCardless plan fee", amount: -2.10, date: "28 May", action: "Match to merchant fees" },
      { id: "m3", desc: "GoCardless plan fee", amount: -2.10, date: "27 May", action: "Match to merchant fees" },
      { id: "m4", desc: "Wolseley refund", amount: 48.00, date: "26 May", action: "Mark as duplicate" },
      { id: "m5", desc: "Unknown transfer", amount: 120.00, date: "24 May", action: "Flag for review" },
    ],
    mismatchSummary: "Five bank lines couldn't be matched — mostly GoCardless plan fees and one merchant refund.",
    reconMatchedBase: 286,
    reconTotal: 291,
    reconFinished: "02:11",
    reconTook: "8 minutes",
    feesBreakdown: [
      { what: "GoCardless service-plan collections", count: 164, value: 4920.00 },
      { what: "Card-payment receipts (callouts)", count: 92, value: 8240.00 },
      { what: "BACS in (commercial customers)", count: 41, value: 18600.00 },
      { what: "BACS out (merchant batch · Wolseley)", count: 12, value: 9800.00 },
      { what: "Van lease & fuel cards", count: 9, value: 2140.00 },
      { what: "Refunds & adjustments", count: 4, value: -360.00 },
    ],
    csvName: "calderwood-invoice-radar.csv",
    forecast: [
      { week: "wc 2 Jun", in: 12800, out: 9600 },
      { week: "wc 9 Jun", in: 11200, out: 10400 },
      { week: "wc 16 Jun", in: 9800, out: 9200 },
      { week: "wc 23 Jun", in: 8400, out: 11800 },
      { week: "wc 30 Jun", in: 7200, out: 9600 },
      { week: "wc 7 Jul", in: 5800, out: 9200 },
      { week: "wc 14 Jul", in: 5100, out: 8800 },
      { week: "wc 21 Jul", in: 4900, out: 14200 },
    ],
    forecastNote:
      "Classic feast-or-famine: money-in falls every week into July while the VAT payment lands wc 21 Jul. Service-plan direct debits (£4,920/mo) are the only stable line — booking the 9 ready reminders lifts the trough weeks.",
    staleQuotes: [
      { customer: "The Pearsons", ref: "QU-1188", amount: "£8,200", ageDays: 16, sku: "Unvented cylinder + valves", move: "+4.2% since quote" },
      { customer: "Greenoak Care Home", ref: "QU-1179", amount: "£3,600", ageDays: 23, sku: "Circulation pump", move: "+2.8% since quote" },
    ],
  },

  calendar: {
    title: "Jobs & callouts",
    weekRange: "26–31 May 2026",
    teams: {
      "Rob · gas": "#0066CC",
      "Sam · install": "#1E5277",
      "Dan · service": "#2E844A",
      "Emergency rota": "#9A2D24",
      "Merchant · goods-in": "#727680",
    },
    dayLabels: { Mon: "Mon 26 May", Tue: "Tue 27 May", Wed: "Wed 28 May", Thu: "Thu 29 May", Fri: "Fri 30 May", Sat: "Sat 31 May" },
    week: {
      Mon: [
        { id: "m1", time: "08:00", durationMins: 90, kind: "service", title: "Annual service — Worcester", detail: "Service plan · Mr Khan", team: "Dan · service", teamColor: "#2E844A", location: "Hillsborough, S6", status: "confirmed" },
        { id: "m2", time: "10:30", durationMins: 120, kind: "install", title: "Bathroom day 1 — Pearson", detail: "First fix · cylinder + pipework", team: "Sam · install", teamColor: "#1E5277", location: "Dore, S17", status: "confirmed" },
        { id: "m3", time: "14:00", durationMins: 60, kind: "callout", title: "Radiator leak", detail: "Emergency · Mrs Booth", team: "Emergency rota", teamColor: "#9A2D24", location: "Walkley, S6", status: "confirmed" },
      ],
      Tue: [
        { id: "t1", time: "08:30", durationMins: 90, kind: "inspection", title: "CP12 batch — 3 flats", detail: "Landlord gas safety · Bramall", team: "Rob · gas", teamColor: "#0066CC", location: "Crookes, S10", status: "confirmed" },
        { id: "t2", time: "11:00", durationMins: 120, kind: "install", title: "Bathroom day 2 — Pearson", detail: "Second fix · sanitaryware", team: "Sam · install", teamColor: "#1E5277", location: "Dore, S17", status: "confirmed" },
        { id: "t3", time: "14:30", durationMins: 90, kind: "service", title: "Annual service — Vaillant", detail: "Service plan · Mrs Lund", team: "Dan · service", teamColor: "#2E844A", location: "Nether Edge, S7", status: "tentative" },
      ],
      Wed: [
        { id: "w1", time: "07:45", durationMins: 60, kind: "callout", title: "No hot water", detail: "Emergency · Crosspool Dental", team: "Emergency rota", teamColor: "#9A2D24", location: "Crosspool, S10", status: "confirmed" },
        { id: "w2", time: "10:00", durationMins: 120, kind: "install", title: "Boiler swap — combi", detail: "Worcester 30i · day 1", team: "Rob · gas", teamColor: "#0066CC", location: "Totley, S17", status: "confirmed" },
        { id: "w3", time: "13:30", durationMins: 60, kind: "service", title: "Annual service — Ideal", detail: "Service plan · Mr Doyle", team: "Dan · service", teamColor: "#2E844A", location: "Meersbrook, S8", status: "confirmed" },
        { id: "w4", time: "15:30", durationMins: 45, kind: "delivery", title: "Wolseley delivery", detail: "Cylinder + 8 TRVs", team: "Merchant · goods-in", teamColor: "#727680", location: "Yard · goods-in", status: "confirmed" },
      ],
      Thu: [
        { id: "th1", time: "07:40", durationMins: 75, kind: "callout", title: "Combi lockout — no hot water", detail: "Emergency · Mrs Ahmed", team: "Emergency rota", teamColor: "#9A2D24", location: "Crookes, S10", status: "confirmed" },
        { id: "th2", time: "09:30", durationMins: 90, kind: "service", title: "Annual service — Worcester", detail: "Service plan · Mr Doherty", team: "Dan · service", teamColor: "#2E844A", location: "Nether Edge, S7", status: "tentative" },
        { id: "th3", time: "11:30", durationMins: 60, kind: "survey", title: "Bathroom survey — rip-out", detail: "Quote ~£8k · with Sam", team: "Sam · install", teamColor: "#1E5277", location: "Dore, S17", status: "tentative" },
        { id: "th4", time: "13:30", durationMins: 90, kind: "inspection", title: "Landlord CP12 — 3 flats", detail: "Holloway Lettings", team: "Rob · gas", teamColor: "#0066CC", location: "Walkley, S6", status: "confirmed" },
        { id: "th5", time: "15:30", durationMins: 90, kind: "service", title: "Annual service — Vaillant", detail: "Service plan · Mrs Whitfield", team: "Dan · service", teamColor: "#2E844A", location: "Totley, S17", status: "tentative" },
      ],
      Fri: [
        { id: "f1", time: "08:00", durationMins: 120, kind: "install", title: "Boiler swap — combi day 2", detail: "Commission + flush", team: "Rob · gas", teamColor: "#0066CC", location: "Totley, S17", status: "confirmed" },
        { id: "f2", time: "11:00", durationMins: 90, kind: "service", title: "Annual service — Baxi", detail: "Service plan · Mr Sykes", team: "Dan · service", teamColor: "#2E844A", location: "Ecclesall, S11", status: "confirmed" },
        { id: "f3", time: "14:00", durationMins: 60, kind: "callout", title: "Booster pump fault", detail: "Greenoak Care Home", team: "Emergency rota", teamColor: "#9A2D24", location: "Fulwood, S10", status: "tentative" },
      ],
      Sat: [
        { id: "s1", time: "09:00", durationMins: 60, kind: "callout", title: "Weekend emergency rota", detail: "On-call · Dan", team: "Emergency rota", teamColor: "#9A2D24", location: "Citywide", status: "confirmed" },
      ],
    },
  },

  customers: [
    {
      id: "holloway", name: "Holloway Lettings", email: "accounts@holloway-lets.co.uk", phone: "0114 555 0188", since: "Jan 2024", kind: "trade",
      lastJob: "4× CP12 + 2 services · 15 Apr 2026", nextJob: "3-flat CP12 · 29 May", pm: "Rob Calderwood", totalSpend: "£18,600", outstanding: "£1,340",
      source: "Word of mouth", hubspotStage: "Customer", industry: "Letting agent · 60-property portfolio",
      monthlySpend: [1200, 0, 1340, 0, 980, 0, 1340, 0, 1100, 0, 1680, 1340], daysToPay: [44, 38, 41, 36, 44],
      channelMix: [{ channel: "Email", count: 22, color: "#0066CC" }, { channel: "HubSpot CRM", count: 5, color: "#8A5A12" }],
      aging: { current: 0, d30: 0, d60: 1340, d90: 0 },
      notes: ["Bulk landlord gas safety every cycle.", "Pays at 40+ days consistently — chase early.", "Interested in a portfolio service plan."],
      jobs: [
        { date: "29 May 2026", type: "Inspection", detail: "3-flat CP12 batch", status: "upcoming" },
        { date: "15 Apr 2026", type: "Inspection", detail: "4× CP12 + 2 boiler services", status: "completed" },
      ],
      invoices: [
        { number: "INV-2208", amount: "£1,340.00", date: "15 Apr 2026", status: "overdue", daysOverdue: 44 },
        { number: "INV-2150", amount: "£1,680.00", date: "12 Mar 2026", status: "paid", daysToPay: 41 },
      ],
      messages: [{ date: "20 May", direction: "out", channel: "Email", subject: "Reminder · INV-2208", snippet: "Hi, just a nudge on the April CP12 batch invoice…" }],
    },
    {
      id: "pearson", name: "Mr & Mrs Pearson", email: "pearson.home@gmail.com", phone: "+44 7700 901884", since: "May 2026", kind: "retail",
      lastJob: "—", nextJob: "Bathroom survey · 29 May 11:30", pm: "Rob Calderwood", totalSpend: "£0", outstanding: "£640",
      source: "Website", hubspotStage: "Proposal sent", industry: "Retail customer · S17",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 640], daysToPay: [],
      channelMix: [{ channel: "Email", count: 5, color: "#0066CC" }, { channel: "Web form", count: 1, color: "#2E844A" }],
      aging: { current: 0, d30: 640, d60: 0, d90: 0 },
      notes: ["Full bathroom rip-out quote in progress (~£8k).", "Already had cylinder + TRVs done (INV-2231).", "Quote QU-1188 going stale — re-price prompt raised."],
      jobs: [
        { date: "29 May 2026", type: "Survey", detail: "Full bathroom rip-out · with Sam", status: "upcoming" },
        { date: "10 May 2026", type: "Install", detail: "Cylinder + TRVs", status: "completed" },
      ],
      invoices: [{ number: "INV-2231", amount: "£640.00", date: "10 May 2026", status: "overdue", daysOverdue: 12 }],
      messages: [{ date: "Today", direction: "in", channel: "Email", subject: "Bathroom quote — keen to proceed", snippet: "We loved the design — can you confirm timings and the deposit?" }],
    },
    {
      id: "greenoak", name: "Greenoak Care Home", email: "facilities@greenoak-care.uk", phone: "0114 555 0410", since: "Sep 2023", kind: "trade",
      lastJob: "Plant room pump swap · 21 Apr 2026", nextJob: "Booster pump fault · 30 May", pm: "Rob Calderwood", totalSpend: "£32,400", outstanding: "£3,180",
      source: "Direct call", hubspotStage: "Customer", industry: "Care home · 40-bed · commercial plant",
      monthlySpend: [0, 2400, 0, 3180, 0, 1800, 0, 0, 2900, 0, 3180, 0], daysToPay: [38, 42, 40, 35],
      channelMix: [{ channel: "Email", count: 16, color: "#0066CC" }, { channel: "Voicemail", count: 4, color: "#86868B" }],
      aging: { current: 0, d30: 0, d60: 3180, d90: 0 },
      notes: ["Commercial plant maintenance contract.", "Critical hot water — prioritise callouts.", "Quote QU-1179 (pump) going stale."],
      jobs: [
        { date: "30 May 2026", type: "Callout", detail: "Booster pump fault", status: "upcoming" },
        { date: "21 Apr 2026", type: "Install", detail: "Plant room circulation pump", status: "completed" },
      ],
      invoices: [{ number: "INV-2196", amount: "£3,180.00", date: "21 Apr 2026", status: "overdue", daysOverdue: 38 }],
      messages: [{ date: "24 May", direction: "in", channel: "Voicemail", subject: "Voicemail · pump noise again", snippet: "The booster's making that noise again — can someone pop out?" }],
    },
    {
      id: "doherty", name: "Mr Doherty", email: "j.doherty@gmail.com", phone: "+44 7700 901221", since: "Feb 2024", kind: "retail",
      lastJob: "Annual service · 28 May 2025", nextJob: "Annual service · 29 May 09:30", pm: "Rob Calderwood", totalSpend: "£1,240", outstanding: "£0",
      source: "Website", hubspotStage: "Customer", industry: "Service-plan customer · S7",
      monthlySpend: [0, 0, 0, 96, 0, 0, 0, 0, 0, 0, 0, 96], daysToPay: [2, 1, 0],
      channelMix: [{ channel: "Email", count: 8, color: "#0066CC" }],
      aging: { current: 0, d30: 0, d60: 0, d90: 0 },
      notes: ["Gold service plan · £8/mo direct debit.", "Worcester combi · installed by us 2024.", "Annual service due — reminder auto-sent."],
      jobs: [
        { date: "29 May 2026", type: "Service", detail: "Annual boiler service", status: "upcoming" },
        { date: "28 May 2025", type: "Service", detail: "Annual boiler service", status: "completed" },
      ],
      invoices: [{ number: "INV-2240", amount: "£96.00", date: "29 May 2026", status: "pending" }],
      messages: [{ date: "22 May", direction: "out", channel: "Email", subject: "Your boiler service is due", snippet: "Hi Mr Doherty, your annual service is due — here are three slots…" }],
    },
    {
      id: "whitfield", name: "Mrs Whitfield", email: "whitfield@btinternet.com", phone: "+44 7700 901442", since: "Mar 2023", kind: "retail",
      lastJob: "Annual service · 1 Jun 2025", nextJob: "Annual service · 29 May 15:30", pm: "Rob Calderwood", totalSpend: "£980", outstanding: "£0",
      source: "Word of mouth", hubspotStage: "Customer", industry: "Service-plan customer · S17",
      monthlySpend: [0, 0, 0, 0, 96, 0, 0, 0, 0, 0, 0, 96], daysToPay: [3, 1],
      channelMix: [{ channel: "Email", count: 6, color: "#0066CC" }, { channel: "Voicemail", count: 1, color: "#86868B" }],
      aging: { current: 0, d30: 0, d60: 0, d90: 0 },
      notes: ["Silver service plan · £8/mo.", "Vaillant system boiler.", "Loyal — 3 years on plan."],
      jobs: [{ date: "29 May 2026", type: "Service", detail: "Annual system service", status: "upcoming" }],
      invoices: [],
      messages: [{ date: "21 May", direction: "out", channel: "Email", subject: "Service reminder", snippet: "Hi Mrs Whitfield, time for your annual service…" }],
    },
  ],

  quoteTemplates: [
    {
      label: "Boiler replacement — combi swap", tag: "Heating",
      lines: [
        { id: "c1-1", desc: "Worcester Bosch Greenstar 30i combi", qty: 1, unit: "unit", unitPrice: 1180.00 },
        { id: "c1-2", desc: "System flush (power flush)", qty: 1, unit: "job", unitPrice: 480.00 },
        { id: "c1-3", desc: "Magnetic filter + scale reducer", qty: 1, unit: "set", unitPrice: 120.00 },
        { id: "c1-4", desc: "Supply & fit · 2 days · 1 engineer", qty: 1, unit: "visit", unitPrice: 760.00 },
      ],
      notes: "10-year manufacturer warranty (registered on our behalf).\nIncludes flue, Gas Safe certificate and Building Regs notification.\nValid 30 days. Finance available.",
    },
    {
      label: "Full bathroom — supply & fit", tag: "Bathroom",
      lines: [
        { id: "c2-1", desc: "Sanitaryware suite (WC, basin, bath)", qty: 1, unit: "set", unitPrice: 1240.00 },
        { id: "c2-2", desc: "Thermostatic shower + screen", qty: 1, unit: "set", unitPrice: 680.00 },
        { id: "c2-3", desc: "First & second fix plumbing", qty: 1, unit: "job", unitPrice: 1800.00 },
        { id: "c2-4", desc: "Tiling & waterproofing (sub-trade)", qty: 1, unit: "job", unitPrice: 1600.00 },
        { id: "c2-5", desc: "Strip-out & disposal", qty: 1, unit: "job", unitPrice: 420.00 },
      ],
      notes: "Multi-trade job — tiler and electrician coordinated by us.\n5-day programme. 40% deposit on order.\nValid 30 days.",
    },
    {
      label: "Annual service plan — Gold", tag: "Service plan",
      lines: [
        { id: "c3-1", desc: "Gold cover · annual service + parts + callouts", qty: 12, unit: "month", unitPrice: 16.00 },
      ],
      notes: "Annual boiler service, unlimited callouts, parts & labour included.\nMonthly direct debit via GoCardless. 12-month rolling.",
    },
  ],

  products: {
    subtitleSuffix: "lines",
    poSupplier: "Wolseley",
    poDraftBlurb: "Claude has drafted PO-884 for the Wolseley van-stock lines running low before next week's installs.",
    items: [
      { id: "p1", sku: "BLR-WB-30I", name: "Worcester Greenstar 30i combi", category: "Boilers", unit: "unit", trade: "£820", retail: "£1,180", onHand: 2, reserved: 3, reorderAt: 3, leadTime: "Next day", supplier: "Wolseley", thumbBg: "linear-gradient(135deg,#E8ECF0,#C2CBD4)" },
      { id: "p2", sku: "BLR-VL-ECT", name: "Vaillant ecoTEC plus 832", category: "Boilers", unit: "unit", trade: "£900", retail: "£1,290", onHand: 1, reserved: 2, reorderAt: 2, leadTime: "2 working days", supplier: "City Plumbing", thumbBg: "linear-gradient(135deg,#E4E9EE,#BBC4CD)" },
      { id: "p3", sku: "CYL-UV-210", name: "Unvented cylinder 210L", category: "Cylinders", unit: "unit", trade: "£540", retail: "£780", onHand: 3, reserved: 1, reorderAt: 2, leadTime: "Next day", supplier: "Wolseley", thumbBg: "linear-gradient(135deg,#DDE3E8,#AEB8C2)" },
      { id: "p4", sku: "PMP-CIRC-15", name: "Grundfos circulation pump 15-60", category: "Pumps & controls", unit: "unit", trade: "£96", retail: "£148", onHand: 5, reserved: 2, reorderAt: 4, leadTime: "Next day", supplier: "Wolseley", thumbBg: "linear-gradient(135deg,#1E5277,#0E2C42)" },
      { id: "p5", sku: "FLT-MAG-22", name: "Magnetic system filter 22mm", category: "Pumps & controls", unit: "unit", trade: "£42", retail: "£72", onHand: 8, reserved: 3, reorderAt: 6, leadTime: "Next day", supplier: "City Plumbing", thumbBg: "linear-gradient(135deg,#3C5566,#1E2E38)" },
      { id: "p6", sku: "TRV-CHR-15", name: "Chrome TRV 15mm", category: "Valves & fittings", unit: "each", trade: "£9.40", retail: "£16.50", onHand: 6, reserved: 22, reorderAt: 24, leadTime: "Next day", supplier: "Wolseley", thumbBg: "linear-gradient(135deg,#D6DBE0,#A9B1B9)" },
      { id: "p7", sku: "VLV-ISO-22", name: "Isolation valve 22mm", category: "Valves & fittings", unit: "each", trade: "£3.80", retail: "£6.50", onHand: 40, reserved: 12, reorderAt: 20, leadTime: "Next day", supplier: "City Plumbing", thumbBg: "linear-gradient(135deg,#DEE2E6,#B4BBC2)" },
      { id: "p8", sku: "STAT-RM-WIFI", name: "Wireless room thermostat", category: "Pumps & controls", unit: "unit", trade: "£58", retail: "£96", onHand: 7, reserved: 4, reorderAt: 5, leadTime: "Next day", supplier: "Wolseley", thumbBg: "linear-gradient(135deg,#F0F2F4,#D2D7DC)" },
      { id: "p9", sku: "RAD-K2-600", name: "Type 22 radiator 600×1000", category: "Radiators", unit: "each", trade: "£64", retail: "£108", onHand: 4, reserved: 6, reorderAt: 6, leadTime: "2 working days", supplier: "Wolseley", thumbBg: "linear-gradient(135deg,#ECEEF0,#CBD0D5)" },
      { id: "p10", sku: "FLU-EXT-1M", name: "Flue extension 1m", category: "Flue & accessories", unit: "each", trade: "£34", retail: "£58", onHand: 9, reserved: 3, reorderAt: 6, leadTime: "Next day", supplier: "City Plumbing", thumbBg: "linear-gradient(135deg,#D9DEE3,#AEB6BE)" },
      { id: "p11", sku: "INH-CH-500", name: "Central heating inhibitor 500ml", category: "Chemicals", unit: "bottle", trade: "£6.20", retail: "£11.00", onHand: 14, reserved: 5, reorderAt: 10, leadTime: "Next day", supplier: "Wolseley", thumbBg: "linear-gradient(135deg,#2E844A,#1C5530)" },
    ],
  },

  compliance: {
    subtitle: "Next deadline in 5 days",
    intro: "Gas Safe, VAT and the signed audit trail. Workbench keeps the annual certification cycle visible and files the routine returns for you.",
    hero: {
      pillLabel: "VAT · HMRC",
      urgentLabel: "Most urgent · in 5 days",
      title: "VAT return — Feb–Apr quarter",
      body: "Due Monday 3 June via the Government Gateway. Estimated liability £5,140. Reverse-charge applies to your commercial subcontract work.",
      pct: 88,
      pctLabel: "Return 88% prepared",
      pctNote: "awaiting 1 merchant statement",
      confirmLabel: "Submit to HMRC",
      successTitle: "VAT packet filed with HMRC",
      successSub: "Receipt 2026-VAT-Q1-#GG4410 · payment scheduled for 2 Jun",
      rows: [
        { label: "Box 1 — VAT due on sales", value: "£7,640.00", ok: true },
        { label: "Box 4 — VAT reclaimed on purchases", value: "£2,500.00", ok: true },
        { label: "Box 5 — Net VAT to pay", value: "£5,140.00", ok: true },
        { label: "Reverse-charge supplies", value: "£3,200 noted", ok: true },
        { label: "Wolseley April statement", value: "Awaiting", ok: false },
      ],
    },
    legend: [
      { color: "#8A5A12", label: "Tax & payroll" },
      { color: "#9A2D24", label: "Gas Safe / safety" },
      { color: "#1E5277", label: "Certification" },
      { color: "#727680", label: "Insurance" },
      { color: "#2E844A", label: "Data / GDPR" },
    ],
    deadlines: [
      { key: "gassafe", dot: "#9A2D24", title: "Gas Safe registration renewal", desc: "Annual ACS re-assessment · 2 engineers", progress: "Rob due in 23 days · Dan due in 71 days", pillCls: "pill-warn", pillTxt: "in 23 days", when: "Mon 22 Jun", actionLabel: "Book re-assessment", actionType: "secondary",
        detail: { intro: "Annual Gas Safe ACS re-assessment for your registered engineers.", rows: [{ label: "Rob Calderwood (CCN1)", value: "expires 22 Jun", ok: false }, { label: "Dan Pryce (CCN1)", value: "expires 9 Aug", ok: true }], confirmLabel: "Book assessment slot", successTitle: "Assessment booked", successSub: "ACS re-assessment booked at Logic4Training · 18 Jun" } },
      { key: "cp12", dot: "#9A2D24", title: "Landlord CP12 batch", desc: "3 flats · Holloway Lettings", progress: "Certificates auto-issued after Thursday's visit", pillCls: "pill-soft", pillTxt: "in 1 day", when: "Thu 29 May", actionLabel: "View", actionType: "ghost",
        detail: { intro: "CP12 gas safety certificates issued automatically once the inspection is logged.", rows: [{ label: "Flats", value: "3" }, { label: "Issued to", value: "Holloway Lettings + tenants" }], confirmLabel: "Acknowledge", successTitle: "Noted", successSub: "Certificates issue after the visit." } },
      { key: "vat-cash", dot: "#8A5A12", title: "Reverse-charge cash forecast", desc: "Commercial subcontract VAT impact", progress: "£3,200 of supplies now reverse-charged this quarter", pillCls: "pill-soft", pillTxt: "ongoing", when: "Quarterly", actionLabel: "View", actionType: "ghost",
        detail: { intro: "Reverse charge removes the VAT cash float on commercial subcontract work.", rows: [{ label: "Reverse-charged supplies", value: "£3,200" }, { label: "Float lost vs old rules", value: "~£640" }], confirmLabel: "Acknowledge", successTitle: "Noted", successSub: "Tracked in the cash-flow forecast." } },
      { key: "insurance", dot: "#727680", title: "Public liability insurance", desc: "Annual renewal · £5m cover", progress: "3 quotes gathered · 1 cheaper, same cover", pillCls: "pill-soft", pillTxt: "in 30 days", when: "Sun 28 Jun", actionLabel: "Compare quotes", actionType: "secondary",
        detail: { intro: "3 quotes gathered. Current cover ends 28 Jun.", rows: [{ label: "Current (Tradesman)", value: "£980/yr · £5m PL" }, { label: "Alternative", value: "£860/yr · same cover" }], confirmLabel: "Bind cheapest", successTitle: "Renewal switched", successSub: "Bound · certificate emailed to you" } },
      { key: "ropa", dot: "#2E844A", title: "GDPR · RoPA review", desc: "Quarterly record of processing review", progress: "5 connectors · none changed since last review", pillCls: "pill-soft", pillTxt: "in 33 days", when: "Tue 1 Jul", actionLabel: "Review diff", actionType: "ghost",
        detail: { intro: "No connector scope changes since the last review.", rows: [{ label: "Connectors", value: "5" }, { label: "Changes", value: "0" }], confirmLabel: "Sign off RoPA", successTitle: "RoPA signed off", successSub: "Quarterly review complete · next due 1 Oct" } },
    ],
    connectors: [
      { initials: "Xe", name: "Xero", by: "Rob Calderwood", scopes: "invoices.read, contacts.write, transactions.read", last: "4 mins ago", status: "Active", statusCls: "pill-ok", iconBg: "#E7EFF5", iconFg: "#1E5277" },
      { initials: "Go", name: "GoCardless", by: "Rob Calderwood", scopes: "mandates.read, payments.create", last: "today 02:06", status: "Active", statusCls: "pill-ok", iconBg: "#E6F2EB", iconFg: "#2E844A" },
      { initials: "HM", name: "HMRC gateway", by: "Rob Calderwood", scopes: "vat.submit, paye.submit", last: "today 02:08", status: "Active", statusCls: "pill-ok", iconBg: "#F5EAD6", iconFg: "#8A5A12" },
      { initials: "Cs", name: "Commusoft jobs", by: "Sam Pryce", scopes: "jobs.read, certificates.write", last: "12 mins ago", status: "Active", statusCls: "pill-ok", iconBg: "#EEEDE7", iconFg: "#191C21" },
      { initials: "Gm", name: "Gmail (info@)", by: "Rob Calderwood", scopes: "mail.read, mail.send (draft only)", last: "just now", status: "Active", statusCls: "pill-ok", iconBg: "#EEEDE7", iconFg: "#191C21" },
    ],
    audit: [
      { time: "07:50", event: "Booked", detail: "emergency callout · Mrs Ahmed · combi lockout", ref: "#cw-8821", actor: "auto · within policy", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "06:30", event: "Sent", detail: "9 annual-service reminders · batched for booking", ref: "#sr-441", actor: "approved by Rob", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "02:11", event: "Reconciled", detail: "286 of 291 bank transactions · 5 flagged", ref: "", actor: "overnight run", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "02:04", event: "Issued", detail: "GoCardless plan collections · 164 mandates · £4,920", ref: "", actor: "overnight run", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "yest. 17:10", event: "Held", detail: "refund to Mrs Ahmed · awaiting your call", ref: "", actor: "policy · escalated", pillCls: "pill-info", pillTxt: "held" },
    ],
    csvName: "calderwood-gdpr-audit.csv",
  },

  inbox: [
    { id: "i1", sender: "Mrs Ahmed", initials: "SA", channel: "Voicemail", kind: "retail", unread: true, time: "07:12", status: "active", subject: "Voicemail · no hot water", preview: "\"No hot water this morning and the boiler's flashing — can someone come today?\"", body: "Transcribed automatically:\n\n\"Hi, it's Sarah Ahmed at Crookes. There's no hot water this morning and the boiler's showing a flashing light. The kids need to get ready — any chance someone can come today?\"\n\nLength 00:21 · confidence high · existing customer", draft: "Hi Mrs Ahmed,\n\nSorry to hear that — sounds like a combi lockout, usually quick to clear. I've slotted you in for 07:40 this morning on the emergency rota. If it's a pressure issue I'll talk you through a top-up while you wait.\n\nSee you shortly,\nRob — Calderwood Plumbing & Heating", sources: ["Customer record · Worcester combi", "Emergency rota · slot 07:40", "Fault guide · combi lockout"] },
    { id: "i2", sender: "Mr & Mrs Pearson", initials: "PP", channel: "Email", kind: "retail", unread: true, time: "08:05", status: "active", subject: "Bathroom quote — keen to proceed", preview: "We loved the design. Can you confirm timings and the deposit before we book?", body: "Hi Rob,\n\nWe loved the bathroom design and we're keen to go ahead. Could you confirm the start date and the deposit amount? We'd like it done before the in-laws visit in July.\n\nThanks,\nThe Pearsons", draft: "Hi both,\n\nDelighted you're happy with it. It's a 5-day programme — I can start Mon 16 June, which lands you well clear of July. The deposit is 40% (£3,280) to lock the slot and order the sanitaryware.\n\nI'll coordinate the tiler and electrician so you've got one point of contact throughout.\n\nBest,\nRob", sources: ["Quote QU-1188 · bathroom", "Install calendar · w/c 16 Jun", "Deposit policy · 40%"] },
    { id: "i3", sender: "Website enquiry", initials: "WE", channel: "Web form", kind: "retail", unread: true, time: "07:48", status: "active", subject: "New boiler quote request", preview: "Old boiler keeps losing pressure. Looking for a quote for a replacement combi.", body: "Form submission\n\nName: David Holt\nEnquiry: Our boiler keeps losing pressure and it's 14 years old. Looking for a quote to replace with a combi. 3-bed semi, S11.\nPreferred contact: phone, evenings.", draft: "Hi David,\n\nHappy to help — a 14-year-old boiler losing pressure is usually worth replacing rather than repairing. For a 3-bed semi a Worcester 30i combi is a solid choice; supply & fit is typically £2,500–£2,900 including a flush and filter.\n\nI can pop round for a free survey — what evening suits this week?\n\nBest,\nRob", sources: ["Quote template · combi swap", "Survey calendar", "Past S11 jobs"] },
    { id: "i4", sender: "Greenoak Care Home", initials: "GC", channel: "Voicemail", kind: "trade", unread: true, time: "06:55", status: "active", subject: "Voicemail · pump noise again", preview: "\"The booster's making that noise again — can someone pop out this week?\"", body: "Transcribed automatically:\n\n\"It's Janet at Greenoak. The booster pump's making that grinding noise again — same as last time. Can someone pop out this week? We can't have the hot water failing on the residents.\"\n\nLength 00:18 · confidence high · commercial contract", draft: null, sources: [] },
    { id: "i5", sender: "Mr Doherty", initials: "JD", channel: "Email", kind: "retail", unread: true, time: "yesterday", status: "active", subject: "Re: your boiler service is due", preview: "Thursday morning works great, thanks. See you then.", body: "Hi Rob,\n\nThursday morning works great for the annual service, thanks. The boiler's been fine all year. See you then.\n\nJohn Doherty", draft: "Hi John,\n\nGreat — you're booked for Thursday 29 May at 09:30. It'll take about an hour. Your Gold plan covers the service and any parts, so nothing to pay on the day.\n\nSee you then,\nRob", sources: ["Service plan · Gold", "Calendar · 29 May 09:30", "Asset · Worcester combi"] },
    { id: "i6", sender: "HMRC", initials: "HM", channel: "Email", kind: "supplier", unread: false, time: "yesterday", status: "active", subject: "VAT return reminder · Feb–Apr", preview: "Your VAT return for Feb–Apr 2026 is due by 3 June. File via your software.", body: "Reminder · Your VAT return for the period 01 Feb – 30 Apr 2026 is due by 3 June 2026.\n\n— HMRC", draft: null, sources: [] },
    { id: "i7", sender: "Wolseley", initials: "Wo", channel: "Email", kind: "supplier", unread: false, time: "yesterday", status: "active", subject: "Invoice 55120 — boiler + cylinder", preview: "Invoice for the Worcester combi and cylinder against PO-881. £1,360, 30-day terms.", body: "Please find attached invoice 55120 for the Worcester combi and unvented cylinder delivered against PO-881. Amount £1,360.00, net 30 days.\n\nAccounts, Wolseley", draft: "Approve and route to Xero · matches PO-881 · code: Stock › Heating › Boilers · 20% VAT recoverable · schedule for the Fri 30 May merchant batch.", sources: ["PO-881 · matched", "Xero code · Stock › Heating", "Supplier terms · net 30"] },
    { id: "i8", sender: "Bramall Estates", initials: "BE", channel: "HubSpot", kind: "trade", unread: false, time: "yesterday", status: "active", subject: "Portfolio service plan enquiry", preview: "Could you quote a service plan across our 28 rental boilers?", body: "New lead via HubSpot.\n\nCompany: Bramall Estates\nEnquiry: We have 28 rental properties and would like a single annual service + CP12 plan across all boilers. Want predictable monthly cost and one point of contact.", draft: null, sources: [] },
  ],

  inboxDrafts: {
    i4: { draft: "Hi Janet,\n\nNo problem — sounds like the bearing again. I'll get someone out Friday afternoon and bring a replacement booster pump so we can swap it on the spot if needed. As you're on the maintenance contract there's no callout charge.\n\nRob.", sources: ["Contract · commercial plant", "Stock · Grundfos pump in van", "History · bearing replaced Jan"] },
    i8: { draft: "Hi,\n\nHappy to put a portfolio plan together — for 28 boilers I'd suggest our landlord plan at £14/boiler/month, covering the annual service, CP12 and priority callouts. That's £392/mo with one renewal date and one invoice.\n\nShall I send a formal proposal?\n\nRob", sources: ["Service plan · landlord tier", "Pricing · volume discount", "CP12 batch scheduling"] },
  },

  approvals: [
    {
      id: "service-reminders", workflowTag: "Service reminders", category: "comms", meta: "batched 06:30 · ready to book before the summer lull",
      headline: "Send 9 annual-service reminders — pulls work into the cash trough",
      detail: "Each customer's boiler service is due. Reminder offers three slots and books straight into the diary on reply. Smooths the Jul–Aug dip.",
      lineItems: [
        { primary: "Mr Doherty", detail: "Worcester combi · last serviced 28 May '25", value: "£96/yr", caption: "due now", tag: "Gold" },
        { primary: "Mrs Whitfield", detail: "Vaillant system · last serviced 1 Jun '25", value: "£96/yr", caption: "due now", tag: "Silver" },
        { primary: "Mr Sykes", detail: "Baxi combi · last serviced 12 Jun '25", value: "£96/yr", caption: "due 14d" },
        { primary: "Mrs Lund", detail: "Vaillant · last serviced 20 Jun '25", value: "£96/yr", caption: "due 22d" },
        { primary: "Mr Doyle", detail: "Ideal combi · last serviced 28 Jun '25", value: "£96/yr", caption: "due 30d" },
      ],
      openLabel: "Edit drafts", approveLabel: "Send all 9", approveIcon: "send", status: "pending",
    },
    { id: "ahmed-callout-reply", workflowTag: "Customer reply", category: "reply", meta: "drafted 07:14 · Mrs Ahmed", headline: "Confirm the emergency callout slot to Mrs Ahmed", detail: "Books the 07:40 emergency slot, reassures it's likely a quick combi-lockout fix, and offers a pressure top-up walkthrough.", openLabel: "Open thread", approveLabel: "Send reply", approveIcon: "send", status: "pending" },
    {
      id: "po-884", workflowTag: "Purchase order", category: "po", meta: "van stock drops below next week's installs",
      headline: "Raise PO-884 to Wolseley — £1,284",
      detail: "Tops up the boiler and TRV lines before the Totley swap and the Pearson bathroom. Next-day slot fits the schedule.",
      lineItems: [
        { primary: "Worcester Greenstar 30i combi", detail: "2 units", stockNote: "on hand 2 · need 4", value: "£820" },
        { primary: "Chrome TRV 15mm", detail: "30", stockNote: "on hand 6 · reserved 22", value: "£282" },
        { primary: "Magnetic system filter 22mm", detail: "4", stockNote: "on hand 8", value: "£168" },
      ],
      openLabel: "Adjust", approveLabel: "Raise PO", approveIcon: "check", status: "pending",
    },
    { id: "recon-flags", workflowTag: "Reconciliation", category: "finance", meta: "overnight run · 02:11", headline: "5 unmatched bank lines need review", detail: "3× GoCardless plan fees (£2.10 each), 1 Wolseley refund (£48.00), 1 unknown transfer (£120.00). 286 of 291 matched automatically.", openLabel: "View", approveLabel: "Mark resolved", approveIcon: "check", status: "pending" },
    { id: "weekly-payroll", workflowTag: "Payroll", category: "payroll", meta: "runs Fri 09:00 · 4 staff", headline: "Weekly payroll — 4 staff, net £3,920", detail: "Gross £5,180, net £3,920. One change: Dan Pryce +on-call weekend allowance (+£120). HMRC PAYE filing automatic on approval.", openLabel: "Review", approveLabel: "Approve payroll", approveIcon: "check", status: "pending" },
  ],

  chase: [
    { id: "ch1", customer: "Greenoak Care Home", invoiceRef: "INV-2196", amount: "£3,180", reason: "Commercial · 38 days overdue", addedHoursAgo: 30, source: "money-overdue", status: "pending" },
    { id: "ch2", customer: "Holloway Lettings", invoiceRef: "INV-2208", amount: "£1,340", reason: "Landlord batch · 44 days overdue", addedHoursAgo: 52, source: "money-overdue", status: "snoozed" },
  ],

  serviceContracts: {
    summaryMrr: "£4,920",
    summaryActive: 164,
    summaryDue: 9,
    summaryRenewalRate: "92%",
    intro:
      "Recurring annual boiler-service plans are what flatten the feast-or-famine cash curve. Workbench tracks every asset's service date, batches the reminders, and books them straight into the diary.",
    plans: [
      { id: "sp1", customer: "Mr Doherty", address: "Nether Edge, S7", plan: "Gold", asset: "Worcester combi", monthly: "£16", lastService: "28 May 2025", nextService: "29 May 2026", daysToService: 0, status: "due" },
      { id: "sp2", customer: "Mrs Whitfield", address: "Totley, S17", plan: "Silver", asset: "Vaillant system", monthly: "£8", lastService: "1 Jun 2025", nextService: "29 May 2026", daysToService: 0, status: "due" },
      { id: "sp3", customer: "Mr Sykes", address: "Ecclesall, S11", plan: "Gold", asset: "Baxi combi", monthly: "£16", lastService: "12 Jun 2025", nextService: "12 Jun 2026", daysToService: 14, status: "active" },
      { id: "sp4", customer: "Mrs Lund", address: "Nether Edge, S7", plan: "Silver", asset: "Vaillant", monthly: "£8", lastService: "20 Jun 2025", nextService: "20 Jun 2026", daysToService: 22, status: "active" },
      { id: "sp5", customer: "Mr Doyle", address: "Meersbrook, S8", plan: "Gold", asset: "Ideal combi", monthly: "£16", lastService: "28 Jun 2025", nextService: "28 Jun 2026", daysToService: 30, status: "active" },
      { id: "sp6", customer: "The Hartleys", address: "Dore, S17", plan: "Gold", asset: "Worcester system", monthly: "£16", lastService: "2 Apr 2025", nextService: "2 Apr 2026", daysToService: -57, status: "overdue" },
      { id: "sp7", customer: "Mr Begum", address: "Crookes, S10", plan: "Silver", asset: "Glow-worm combi", monthly: "£8", lastService: "18 May 2024", nextService: "18 May 2025", daysToService: -376, status: "lapsed" },
      { id: "sp8", customer: "Mrs Naylor", address: "Walkley, S6", plan: "Gold", asset: "Vaillant combi", monthly: "£16", lastService: "5 Jul 2025", nextService: "5 Jul 2026", daysToService: 37, status: "active" },
    ],
    readyToSchedule: [
      { customer: "Mr Doherty", asset: "Worcester combi", due: "due now", channel: "Email + SMS" },
      { customer: "Mrs Whitfield", asset: "Vaillant system", due: "due now", channel: "Email" },
      { customer: "The Hartleys", asset: "Worcester system", due: "57 days overdue", channel: "Phone (no email reply)" },
    ],
  },

  seasonality: {
    intro:
      "Plumbing & heating is a feast-or-famine trade: winter is flat-out, summer is dead — and the VAT bill habitually lands in the deadest week. This view lines up your revenue, costs and tax calendar so you can pull planned work into the trough.",
    months: [
      { month: "Jun", revenue: 38000, costs: 31000 },
      { month: "Jul", revenue: 24000, costs: 29000, vat: 6300 },
      { month: "Aug", revenue: 22000, costs: 28000 },
      { month: "Sep", revenue: 34000, costs: 30000 },
      { month: "Oct", revenue: 46000, costs: 33000, vat: 5900 },
      { month: "Nov", revenue: 58000, costs: 38000 },
      { month: "Dec", revenue: 64000, costs: 41000 },
      { month: "Jan", revenue: 71000, costs: 44000, vat: 7400 },
      { month: "Feb", revenue: 62000, costs: 40000 },
      { month: "Mar", revenue: 54000, costs: 37000 },
      { month: "Apr", revenue: 44000, costs: 33000, vat: 6100 },
      { month: "May", revenue: 41000, costs: 32000 },
    ],
    troughNote:
      "Jul–Aug is the trough: revenue drops ~41% from the winter peak while costs stay flat. The Aug VAT payment of £6,300 lands right in it — the single most dangerous week of your year.",
    recommendation:
      "Booking the 9 ready service reminders now adds ~£1,400 of July work and £1,200 of August work. Offering a fixed-price summer boiler-swap promotion and pushing landlord CP12s into August would close the rest of the gap.",
    smoothedNote:
      "Service-plan direct debits already contribute £4,920/month of completely flat income — every new plan you sell makes the summer survivable.",
  },
};
