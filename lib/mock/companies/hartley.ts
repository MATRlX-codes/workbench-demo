// lib/mock/companies/hartley.ts
// Hartley Bathrooms & Kitchens — multi-trade Gantt + customer project page + supplier
// deposit / multi-delivery tracker (report 3.3 / 3.9).

import type { CompanyProfile } from "./types";

export const hartley: CompanyProfile = {
  id: "hartley",
  name: "Hartley Bathrooms & Kitchens",
  shortName: "Hartley",
  initials: "H",
  trade: "Bathroom & kitchen fit-outs",
  tradeShort: "Bathrooms & kitchens · Harrogate",
  ownerName: "Claire Hartley",
  ownerFirst: "Claire",
  ownerInitials: "CH",
  features: ["projects", "cashflow-forecast", "quote-shelf-life", "auto-review"],
  overnightNote: "Updated 4 project timelines, flagged 1 supplier deposit at risk, reconciled the bank.",

  today: {
    date: "Thursday, 29 May",
    greetingName: "Claire",
    greetingLine:
      "Five things need a yes. The Ashworth kitchen worktop slipped a week, and a £1,800 supplier deposit is at risk on a delivery that hasn't shipped.",
    diarySubtitle: "4 jobs · two installs, a design appointment and a snagging visit",
    stats: [
      { label: "Cash on hand", value: "£51,300", delta: "+£2,940", sub: "vs last Thu" },
      { label: "Live projects", value: "4", sub: "2 on track · 1 slipping" },
      { label: "Deposits out", value: "£8,600", sub: "with 3 suppliers" },
      { label: "Approvals waiting", value: "5", sub: "oldest queued 31m ago", accent: true },
    ],
    diary: [
      { id: "d1", time: "08:30", title: "Kitchen install — day 3", detail: "Carcasses + worktop · Ashworth", location: "Knaresborough, HG5", status: "confirmed", statusPill: "ok" },
      { id: "d2", time: "10:00", title: "Bathroom install — day 1", detail: "Strip-out + first fix · Voss", location: "Ripon, HG4", status: "confirmed", statusPill: "ok" },
      { id: "d3", time: "13:00", title: "Design appointment", detail: "Kitchen · ~£24k · with Tom", location: "Showroom", status: "unconfirmed", customer: "The Bennetts", email: "bennett.home@gmail.com", phone: "+44 7700 903221" },
      { id: "d4", time: "15:30", title: "Snagging visit", detail: "Bathroom · door alignment · Patel", location: "Harrogate, HG2", status: "unconfirmed", customer: "Mrs Patel", email: "r.patel@gmail.com", phone: "+44 7700 903778" },
    ],
    risk: {
      title: "Ashworth kitchen: the worktop template slipped and the tiler arrives Monday",
      body:
        "The stone template was delayed to next Tuesday, but the tiler is booked for Monday and can't start until the worktop's templated. Re-sequence the trades or move the tiler — both customer and tiler need telling today. Open the project view.",
      customer: "Ashworth kitchen",
    },
  },

  money: {
    subtitle: "GBP · 2 connected accounts",
    cashOnHand: "£51,300",
    cashDeltaPct: "+6.1%",
    in7: "+£21,400",
    in7Count: "5 milestone payments",
    out7: "−£14,800",
    out7Detail: "payroll, supplier deposits, sub-trades",
    cashflowDays: [
      { label: "29 Apr", in: 3800, out: 2100 }, { label: "30 Apr", in: 1200, out: 3400 },
      { label: "1 May", in: 6200, out: 1100 }, { label: "2 May", in: 2400, out: 5800 },
      { label: "5 May", in: 4800, out: 1900 }, { label: "6 May", in: 1100, out: 2200 },
      { label: "7 May", in: 3200, out: 1400 }, { label: "8 May", in: 5600, out: 980 },
      { label: "9 May", in: 4900, out: 4200 }, { label: "12 May", in: 1800, out: 2400 },
      { label: "13 May", in: 7400, out: 1600 }, { label: "14 May", in: 2200, out: 3800 },
      { label: "15 May", in: 5200, out: 980 }, { label: "16 May", in: 1500, out: 6400 },
      { label: "19 May", in: 4400, out: 2100 }, { label: "20 May", in: 2800, out: 1600 },
      { label: "21 May", in: 6900, out: 3200 }, { label: "22 May", in: 1900, out: 1400 },
      { label: "23 May", in: 3400, out: 7100 }, { label: "26 May", in: 5800, out: 2200 },
      { label: "27 May", in: 2300, out: 3600 }, { label: "28 May", in: 4900, out: 2400 },
      { label: "29 May", in: 6700, out: 2900 },
    ],
    overdue30: [
      { id: "r1", name: "Mr & Mrs Calloway", email: "calloway.home@gmail.com", ref: "INV-7710 · kitchen final 30%", amount: "£7,200.00", age: "37 days", pill: "bad", chaseNote: "Last chase 5 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 37 },
      { id: "r2", name: "Harrogate Homes", email: "ap@harrogatehomes.co.uk", ref: "INV-7688 · 2 show-home bathrooms", amount: "£5,400.00", age: "33 days", pill: "bad", chaseNote: "Last chase 2 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 33 },
    ],
    overdue30Sub: "2 invoices · £12,600 outstanding",
    overdue730: [
      { id: "r3", name: "Mrs Patel", email: "r.patel@gmail.com", ref: "INV-7731 · bathroom balance", amount: "£1,840.00", age: "11 days", pill: "warn", chaseNote: "No chase yet", actionLabel: "Send reminder", daysOverdue: 11 },
      { id: "r4", name: "The Voss family", email: "voss.home@gmail.com", ref: "INV-7724 · bathroom deposit", amount: "£980.00", age: "8 days", pill: "warn", chaseNote: "Last chase 3 days ago", actionLabel: "Send reminder", daysOverdue: 8 },
    ],
    overdue730Sub: "2 invoices · £2,820 outstanding",
    dueWeek: [
      { name: "Ashworth", email: "ashworth.home@gmail.com", ref: "INV-7740 · kitchen stage 2 (40%)", amount: "£9,600.00", due: "due Fri 30 May" },
      { name: "The Bennetts", email: "bennett.home@gmail.com", ref: "INV-7742 · design deposit", amount: "£500.00", due: "due Sat 31 May" },
    ],
    dueWeekSub: "2 invoices · £10,100 expected",
    mismatches: [
      { id: "m1", desc: "Stripe deposit fee", amount: -18.40, date: "28 May", action: "Match to merchant fees" },
      { id: "m2", desc: "Stripe deposit fee", amount: -12.20, date: "27 May", action: "Match to merchant fees" },
      { id: "m3", desc: "Howdens credit note", amount: 84.00, date: "26 May", action: "Mark as duplicate" },
      { id: "m4", desc: "Unknown transfer", amount: 260.00, date: "24 May", action: "Flag for review" },
    ],
    mismatchSummary: "Four bank lines couldn't be matched — Stripe deposit fees and one supplier credit note.",
    reconMatchedBase: 244,
    reconTotal: 248,
    reconFinished: "02:16",
    reconTook: "7 minutes",
    feesBreakdown: [
      { what: "Stripe deposit & milestone receipts", count: 64, value: 84200.00 },
      { what: "BACS in (developers)", count: 22, value: 38600.00 },
      { what: "BACS out (suppliers: Howdens, stone, tiles)", count: 18, value: 41200.00 },
      { what: "Sub-trade payments (tilers, sparks, plumbers)", count: 26, value: 18400.00 },
      { what: "Merchant fees", count: 64, value: 940.00 },
      { what: "Refunds & adjustments", count: 4, value: -620.00 },
    ],
    csvName: "hartley-invoice-radar.csv",
    forecast: [
      { week: "wc 2 Jun", in: 22400, out: 16800 },
      { week: "wc 9 Jun", in: 14200, out: 19600 },
      { week: "wc 16 Jun", in: 26800, out: 14200 },
      { week: "wc 23 Jun", in: 11200, out: 22400 },
      { week: "wc 30 Jun", in: 19800, out: 15600 },
      { week: "wc 7 Jul", in: 24600, out: 13800 },
      { week: "wc 14 Jul", in: 13400, out: 18200 },
      { week: "wc 21 Jul", in: 28900, out: 14600 },
    ],
    forecastNote:
      "Lumpy by nature — milestone payments arrive in chunks while supplier deposits go out ahead of them. wc 23 Jun is tight: three supplier deposits land before the Ashworth stage-3 payment. Chasing the Calloway final 30% covers it.",
    staleQuotes: [
      { customer: "The Bennetts", ref: "QU-5210", amount: "£24,000", ageDays: 17, sku: "Full kitchen · in-frame Shaker", move: "+3.9% since quote" },
      { customer: "Mr Dunn", ref: "QU-5198", amount: "£11,400", ageDays: 24, sku: "Bathroom · wetroom conversion", move: "+2.6% since quote" },
    ],
  },

  calendar: {
    title: "Installs & design",
    weekRange: "26–31 May 2026",
    teams: {
      "Fit team A": "#0066CC",
      "Fit team B": "#1E5277",
      "Tiler (sub)": "#8A5A12",
      "Design · Tom": "#9A2D24",
      "Supplier · goods-in": "#727680",
    },
    dayLabels: { Mon: "Mon 26 May", Tue: "Tue 27 May", Wed: "Wed 28 May", Thu: "Thu 29 May", Fri: "Fri 30 May", Sat: "Sat 31 May" },
    week: {
      Mon: [
        { id: "m1", time: "08:00", durationMins: 240, kind: "install", title: "Ashworth kitchen — day 1", detail: "Strip-out + first fix", team: "Fit team A", teamColor: "#0066CC", location: "Knaresborough, HG5", status: "confirmed" },
        { id: "m2", time: "08:30", durationMins: 240, kind: "install", title: "Calloway snag + handover", detail: "Final fixes", team: "Fit team B", teamColor: "#1E5277", location: "Harrogate, HG1", status: "confirmed" },
      ],
      Tue: [
        { id: "t1", time: "08:00", durationMins: 240, kind: "install", title: "Ashworth kitchen — day 2", detail: "Carcasses + units", team: "Fit team A", teamColor: "#0066CC", location: "Knaresborough, HG5", status: "confirmed" },
        { id: "t2", time: "09:00", durationMins: 180, kind: "delivery", title: "Stone template", detail: "Worktop template (slipped → Tue)", team: "Supplier · goods-in", teamColor: "#727680", location: "Knaresborough, HG5", status: "tentative" },
      ],
      Wed: [
        { id: "w1", time: "08:00", durationMins: 240, kind: "install", title: "Ashworth kitchen — day 3", detail: "Worktop + splashback", team: "Fit team A", teamColor: "#0066CC", location: "Knaresborough, HG5", status: "confirmed" },
        { id: "w2", time: "10:00", durationMins: 180, kind: "install", title: "Tiling — Ashworth", detail: "Sub-trade · floor + splash", team: "Tiler (sub)", teamColor: "#8A5A12", location: "Knaresborough, HG5", status: "tentative" },
      ],
      Thu: [
        { id: "th1", time: "08:30", durationMins: 240, kind: "install", title: "Ashworth kitchen — day 4", detail: "Worktop fit + appliances", team: "Fit team A", teamColor: "#0066CC", location: "Knaresborough, HG5", status: "confirmed" },
        { id: "th2", time: "10:00", durationMins: 240, kind: "install", title: "Voss bathroom — day 1", detail: "Strip-out + first fix", team: "Fit team B", teamColor: "#1E5277", location: "Ripon, HG4", status: "confirmed" },
        { id: "th3", time: "13:00", durationMins: 90, kind: "showroom", title: "Design appointment", detail: "Kitchen ~£24k · The Bennetts", team: "Design · Tom", teamColor: "#9A2D24", location: "Showroom", status: "tentative" },
        { id: "th4", time: "15:30", durationMins: 60, kind: "snag", title: "Snagging — Patel bathroom", detail: "Door alignment", team: "Fit team B", teamColor: "#1E5277", location: "Harrogate, HG2", status: "tentative" },
      ],
      Fri: [
        { id: "f1", time: "08:00", durationMins: 240, kind: "install", title: "Ashworth kitchen — day 5", detail: "Snag + handover", team: "Fit team A", teamColor: "#0066CC", location: "Knaresborough, HG5", status: "confirmed" },
        { id: "f2", time: "08:30", durationMins: 300, kind: "install", title: "Voss bathroom — day 2", detail: "Tiling + second fix", team: "Fit team B", teamColor: "#1E5277", location: "Ripon, HG4", status: "confirmed" },
      ],
      Sat: [
        { id: "s1", time: "10:00", durationMins: 120, kind: "showroom", title: "Showroom — design drop-ins", detail: "Saturday opening · Tom", team: "Design · Tom", teamColor: "#9A2D24", location: "Showroom", status: "confirmed" },
      ],
    },
  },

  customers: [
    {
      id: "ashworth", name: "The Ashworths", email: "ashworth.home@gmail.com", phone: "+44 7700 903110", since: "Mar 2026", kind: "retail",
      lastJob: "Design sign-off · 2 May 2026", nextJob: "Kitchen install · 26–30 May", pm: "Claire Hartley", totalSpend: "£14,400", outstanding: "£0",
      source: "Website", hubspotStage: "Customer", industry: "Retail customer · HG5 · £24k kitchen",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 4800, 9600, 0], daysToPay: [3, 1],
      channelMix: [{ channel: "Email", count: 14, color: "#0066CC" }, { channel: "Web form", count: 1, color: "#2E844A" }],
      aging: { current: 0, d30: 0, d60: 0, d90: 0 },
      notes: ["£24k in-frame Shaker kitchen.", "Worktop template slipped — re-sequencing needed.", "Stage payments: 30/40/30."],
      jobs: [
        { date: "26–30 May 2026", type: "Install", detail: "Kitchen fit-out · team A", status: "upcoming" },
        { date: "2 May 2026", type: "Design", detail: "Final design sign-off", status: "completed" },
      ],
      invoices: [
        { number: "INV-7740", amount: "£9,600.00", date: "26 May 2026", status: "pending" },
        { number: "INV-7700", amount: "£4,800.00", date: "2 May 2026", status: "paid", daysToPay: 3 },
      ],
      messages: [{ date: "Today", direction: "out", channel: "Email", subject: "Worktop timing update", snippet: "Quick heads-up — the stone template slipped to Tuesday, here's how we'll keep the rest on track…" }],
    },
    {
      id: "calloway", name: "Mr & Mrs Calloway", email: "calloway.home@gmail.com", phone: "+44 7700 903442", since: "Jan 2026", kind: "retail",
      lastJob: "Kitchen handover · 22 Apr 2026", pm: "Claire Hartley", totalSpend: "£24,000", outstanding: "£7,200",
      source: "Word of mouth", hubspotStage: "Customer", industry: "Retail customer · HG1 · completed kitchen",
      monthlySpend: [0, 0, 7200, 9600, 7200, 0, 0, 0, 0, 0, 0, 0], daysToPay: [4, 2, 37],
      channelMix: [{ channel: "Email", count: 11, color: "#0066CC" }],
      aging: { current: 0, d30: 0, d60: 7200, d90: 0 },
      notes: ["Final 30% outstanding since handover.", "Happy with the work — payment just slow.", "Snag list closed 28 Apr."],
      jobs: [{ date: "22 Apr 2026", type: "Install", detail: "Kitchen handover + snag", status: "completed" }],
      invoices: [{ number: "INV-7710", amount: "£7,200.00", date: "22 Apr 2026", status: "overdue", daysOverdue: 37 }],
      messages: [{ date: "24 May", direction: "out", channel: "Email", subject: "Final balance · INV-7710", snippet: "Hi both, hope you're loving the kitchen — just a nudge on the final balance…" }],
    },
    {
      id: "bennett", name: "The Bennetts", email: "bennett.home@gmail.com", phone: "+44 7700 903221", since: "May 2026", kind: "retail",
      lastJob: "—", nextJob: "Design appointment · 29 May 13:00", pm: "Tom Hartley", totalSpend: "£0", outstanding: "£0",
      source: "Instagram", hubspotStage: "Proposal sent", industry: "Retail lead · HG3 · £24k kitchen",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], daysToPay: [],
      channelMix: [{ channel: "Instagram DM", count: 4, color: "#9A2D24" }, { channel: "Email", count: 3, color: "#0066CC" }],
      aging: { current: 0, d30: 0, d60: 0, d90: 0 },
      notes: ["Came via Instagram (kitchen reel).", "Design appointment today.", "Quote QU-5210 (£24k) going stale — re-confirm."],
      jobs: [{ date: "29 May 2026", type: "Showroom", detail: "Kitchen design appointment · with Tom", status: "upcoming" }],
      invoices: [{ number: "INV-7742", amount: "£500.00", date: "29 May 2026", status: "pending" }],
      messages: [{ date: "Today", direction: "in", channel: "Instagram DM", subject: "DM · still keen on the kitchen", snippet: "Hi! Still really keen — can we lock in the design appointment this week?" }],
    },
    {
      id: "harrogate-homes", name: "Harrogate Homes", email: "ap@harrogatehomes.co.uk", phone: "01423 555 0220", since: "Oct 2024", kind: "trade",
      lastJob: "2 show-home bathrooms · 18 Apr 2026", pm: "Claire Hartley", totalSpend: "£68,400", outstanding: "£5,400",
      source: "Trade show", hubspotStage: "Customer", industry: "House builder · show homes",
      monthlySpend: [0, 8400, 0, 5400, 0, 12200, 0, 0, 9600, 0, 5400, 0], daysToPay: [33, 38, 35],
      channelMix: [{ channel: "Email", count: 26, color: "#0066CC" }, { channel: "HubSpot CRM", count: 6, color: "#8A5A12" }],
      aging: { current: 0, d30: 0, d60: 5400, d90: 0 },
      notes: ["Repeat developer · show-home bathrooms & kitchens.", "Net 30 but pays ~35 days.", "Phase 4 enquiry pending."],
      jobs: [{ date: "18 Apr 2026", type: "Install", detail: "2 show-home bathrooms", status: "completed" }],
      invoices: [{ number: "INV-7688", amount: "£5,400.00", date: "18 Apr 2026", status: "overdue", daysOverdue: 33 }],
      messages: [{ date: "27 May", direction: "out", channel: "Email", subject: "Reminder · INV-7688", snippet: "Hi, nudge on the show-home bathrooms invoice…" }],
    },
  ],

  quoteTemplates: [
    {
      label: "Full kitchen — supply & fit", tag: "Kitchen",
      lines: [
        { id: "h1-1", desc: "In-frame Shaker units (supply)", qty: 1, unit: "set", unitPrice: 9800.00 },
        { id: "h1-2", desc: "Quartz worktop + template & fit", qty: 1, unit: "job", unitPrice: 3200.00 },
        { id: "h1-3", desc: "Appliances package", qty: 1, unit: "set", unitPrice: 3600.00 },
        { id: "h1-4", desc: "Install · 5 days · 2 fitters", qty: 1, unit: "job", unitPrice: 4200.00 },
        { id: "h1-5", desc: "Tiling, plumbing & electrics (sub-trades)", qty: 1, unit: "job", unitPrice: 3200.00 },
      ],
      notes: "Project-managed end to end — one point of contact.\nStage payments 30/40/30. Lead time 6–8 weeks.\nValid 30 days.",
    },
    {
      label: "Bathroom — supply & fit", tag: "Bathroom",
      lines: [
        { id: "h2-1", desc: "Sanitaryware + brassware suite", qty: 1, unit: "set", unitPrice: 2400.00 },
        { id: "h2-2", desc: "Tiling + waterproofing", qty: 1, unit: "job", unitPrice: 2200.00 },
        { id: "h2-3", desc: "First & second fix plumbing + electrics", qty: 1, unit: "job", unitPrice: 2600.00 },
        { id: "h2-4", desc: "Strip-out & disposal", qty: 1, unit: "job", unitPrice: 480.00 },
      ],
      notes: "Typical 6–8 day programme, trades sequenced by us.\n40% deposit on order, balance on completion.\nValid 30 days.",
    },
  ],

  products: {
    subtitleSuffix: "lines",
    poSupplier: "Howdens",
    poDraftBlurb: "Claude has drafted PO-330 for the Howdens lines and tiles needed for the Voss bathroom next week.",
    items: [
      { id: "p1", sku: "KIT-SHAKER-IF", name: "In-frame Shaker door (painted)", category: "Kitchen units", unit: "door", trade: "£64", retail: "£98", onHand: 12, reserved: 28, reorderAt: 20, leadTime: "10 working days", supplier: "Howdens", thumbBg: "linear-gradient(135deg,#EDEAE2,#CFC8B8)" },
      { id: "p2", sku: "WT-QUARTZ-CALM", name: "Quartz worktop (Calacatta)", category: "Worktops", unit: "m²", trade: "£210", retail: "£320", onHand: 0, reserved: 6, reorderAt: 0, leadTime: "Template + 7 days", supplier: "Stoneworks", thumbBg: "linear-gradient(135deg,#F2F1ED,#D8D4C8)" },
      { id: "p3", sku: "BATH-SUITE-MOD", name: "Sanitaryware suite (modern)", category: "Bathroom suites", unit: "set", trade: "£640", retail: "£980", onHand: 2, reserved: 3, reorderAt: 2, leadTime: "Next day", supplier: "City Plumbing", thumbBg: "linear-gradient(135deg,#F0F2F3,#D4D9DC)" },
      { id: "p4", sku: "SHWR-THERMO", name: "Thermostatic shower + screen", category: "Bathroom suites", unit: "set", trade: "£280", retail: "£440", onHand: 3, reserved: 4, reorderAt: 3, leadTime: "Next day", supplier: "City Plumbing", thumbBg: "linear-gradient(135deg,#E9EDEF,#C8CFD3)" },
      { id: "p5", sku: "TILE-PORC-600", name: "Porcelain tile 600×600 (matt)", category: "Tiles", unit: "m²", trade: "£18", retail: "£32", onHand: 24, reserved: 40, reorderAt: 30, leadTime: "3 working days", supplier: "Tile Mountain", thumbBg: "linear-gradient(135deg,#E4E2DD,#C2BEB3)" },
      { id: "p6", sku: "TILE-MET-SUB", name: "Metro tile (sage green)", category: "Tiles", unit: "m²", trade: "£22", retail: "£38", onHand: 16, reserved: 8, reorderAt: 12, leadTime: "3 working days", supplier: "Tile Mountain", thumbBg: "linear-gradient(135deg,#9DB39A,#6E8A6B)" },
      { id: "p7", sku: "APP-OVEN-PYRO", name: "Pyrolytic single oven", category: "Appliances", unit: "unit", trade: "£320", retail: "£480", onHand: 4, reserved: 6, reorderAt: 4, leadTime: "Next day", supplier: "Howdens", thumbBg: "linear-gradient(135deg,#2A2E32,#16191C)" },
      { id: "p8", sku: "APP-HOB-IND", name: "Induction hob (4-zone)", category: "Appliances", unit: "unit", trade: "£260", retail: "£400", onHand: 5, reserved: 6, reorderAt: 4, leadTime: "Next day", supplier: "Howdens", thumbBg: "linear-gradient(135deg,#26292C,#121416)" },
      { id: "p9", sku: "SINK-UNDR-15", name: "Undermount 1.5-bowl sink", category: "Sinks & taps", unit: "unit", trade: "£96", retail: "£148", onHand: 6, reserved: 5, reorderAt: 5, leadTime: "Next day", supplier: "Howdens", thumbBg: "linear-gradient(135deg,#D9DDE0,#AEB4BA)" },
      { id: "p10", sku: "TAP-PULL-BR", name: "Pull-out kitchen tap (brushed)", category: "Sinks & taps", unit: "unit", trade: "£78", retail: "£124", onHand: 7, reserved: 4, reorderAt: 5, leadTime: "Next day", supplier: "Howdens", thumbBg: "linear-gradient(135deg,#C8B89C,#9A8868)" },
    ],
  },

  compliance: {
    subtitle: "Next deadline in 5 days",
    intro: "VAT, sub-trade CIS and the signed audit trail. Workbench tracks supplier deposits and sub-trade payments so a developer-style retention never catches you out.",
    hero: {
      pillLabel: "VAT · HMRC",
      urgentLabel: "Most urgent · in 5 days",
      title: "VAT return — Feb–Apr quarter",
      body: "Due Monday 3 June via the Government Gateway. Estimated liability £9,840 — lumpy because milestone payments and supplier deposits straddle the quarter end.",
      pct: 84,
      pctLabel: "Return 84% prepared",
      pctNote: "awaiting 2 supplier statements",
      confirmLabel: "Submit to HMRC",
      successTitle: "VAT packet filed with HMRC",
      successSub: "Receipt 2026-VAT-#GG7012 · payment scheduled for 2 Jun",
      rows: [
        { label: "Box 1 — VAT due on sales", value: "£13,840.00", ok: true },
        { label: "Box 4 — VAT reclaimed on purchases", value: "£4,000.00", ok: true },
        { label: "Box 5 — Net VAT to pay", value: "£9,840.00", ok: true },
        { label: "Stoneworks April statement", value: "Awaiting", ok: false },
        { label: "Howdens April statement", value: "Awaiting", ok: false },
      ],
    },
    legend: [
      { color: "#8A5A12", label: "Tax & payroll" },
      { color: "#9A2D24", label: "Health & safety" },
      { color: "#1E5277", label: "Supplier deposits" },
      { color: "#727680", label: "Insurance" },
      { color: "#2E844A", label: "Data / GDPR" },
    ],
    deadlines: [
      { key: "deposit-risk", dot: "#1E5277", title: "Supplier deposit at risk", desc: "Stoneworks worktop · £1,800 paid, not shipped", progress: "Delivery slipped · template not yet booked", pillCls: "pill-bad", pillTxt: "act today", when: "Today", actionLabel: "Review deposit", actionType: "secondary",
        detail: { intro: "£1,800 deposit paid to Stoneworks; the worktop template slipped and nothing has shipped.", rows: [{ label: "Supplier", value: "Stoneworks" }, { label: "Deposit paid", value: "£1,800 · 12 May" }, { label: "Promised", value: "template 26 May (slipped)" }, { label: "Project impact", value: "Ashworth tiler blocked" }], confirmLabel: "Chase supplier + re-sequence", successTitle: "Supplier chased", successSub: "Stoneworks chased for a firm template date; tiler provisionally moved to Thu" } },
      { key: "cis", dot: "#8A5A12", title: "CIS monthly return", desc: "Sub-trades: tiler, plumber, electrician", progress: "3 subcontractors · £1,640 deductions · pre-filled", pillCls: "pill-warn", pillTxt: "in 21 days", when: "Thu 19 Jun", actionLabel: "Open draft", actionType: "secondary",
        detail: { rows: [{ label: "Subcontractors", value: "3" }, { label: "Total gross", value: "£8,200" }, { label: "CIS deduction", value: "£1,640" }], confirmLabel: "Submit CIS to HMRC", successTitle: "CIS return submitted", successSub: "Reference 2026-CIS-#HK7012 · statements emailed" } },
      { key: "vat", dot: "#8A5A12", title: "VAT return — Feb–Apr", desc: "Due to HMRC via Government Gateway", progress: "Return 84% prepared", pillCls: "pill-soft", pillTxt: "in 5 days", when: "Mon 3 Jun", actionLabel: "Open draft", actionType: "secondary",
        detail: { rows: [{ label: "Box 5 — Net VAT", value: "£9,840" }], confirmLabel: "Submit to HMRC", successTitle: "VAT filed", successSub: "Receipt logged · payment scheduled" } },
      { key: "insurance", dot: "#727680", title: "Public liability insurance", desc: "Annual renewal · £5m cover", progress: "3 quotes gathered · 1 cheaper", pillCls: "pill-soft", pillTxt: "in 29 days", when: "Sat 27 Jun", actionLabel: "Compare quotes", actionType: "secondary",
        detail: { intro: "Cover ends 27 Jun.", rows: [{ label: "Current", value: "£1,240/yr" }, { label: "Alternative", value: "£1,090/yr" }], confirmLabel: "Bind cheapest", successTitle: "Renewal switched", successSub: "Bound · certificate emailed" } },
      { key: "ropa", dot: "#2E844A", title: "GDPR · RoPA review", desc: "Quarterly record of processing review", progress: "5 connectors · 1 changed since last review", pillCls: "pill-soft", pillTxt: "in 33 days", when: "Tue 1 Jul", actionLabel: "Review diff", actionType: "ghost",
        detail: { intro: "1 connector scope changed.", rows: [{ label: "Stripe", value: "customers.read added" }], confirmLabel: "Sign off RoPA", successTitle: "RoPA signed off", successSub: "Next due 1 Oct" } },
    ],
    connectors: [
      { initials: "Xe", name: "Xero", by: "Claire Hartley", scopes: "invoices.read, contacts.write, transactions.read", last: "7 mins ago", status: "Active", statusCls: "pill-ok", iconBg: "#E7EFF5", iconFg: "#1E5277" },
      { initials: "St", name: "Stripe", by: "Claire Hartley", scopes: "charges.read, payouts.read", last: "just now", status: "Active", statusCls: "pill-ok", iconBg: "#E6F2EB", iconFg: "#2E844A" },
      { initials: "HM", name: "HMRC gateway", by: "Claire Hartley", scopes: "vat.submit, cis.submit, paye.submit", last: "today 02:13", status: "Active", statusCls: "pill-ok", iconBg: "#F5EAD6", iconFg: "#8A5A12" },
      { initials: "Tr", name: "Tradify projects", by: "Tom Hartley", scopes: "jobs.read, schedules.write", last: "18 mins ago", status: "Active", statusCls: "pill-ok", iconBg: "#EEEDE7", iconFg: "#191C21" },
      { initials: "Ig", name: "Instagram DM", by: "Tom Hartley", scopes: "messages.read, messages.write", last: "yesterday", status: "Re-auth in 12d", statusCls: "pill-warn", iconBg: "#EEEDE7", iconFg: "#191C21" },
    ],
    audit: [
      { time: "06:50", event: "Flagged", detail: "Stoneworks deposit £1,800 at risk · delivery slipped", ref: "#dp-71", actor: "deposit tracker", pillCls: "pill-warn", pillTxt: "waiting" },
      { time: "06:30", event: "Updated", detail: "4 project timelines re-sequenced after worktop slip", ref: "#pj-44", actor: "schedule sync", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "02:16", event: "Reconciled", detail: "244 of 248 bank transactions · 4 flagged", ref: "", actor: "overnight run", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "yest. 15:40", event: "Sent", detail: "Calloway final-balance reminder · £7,200", ref: "#a-7710", actor: "approved by Claire", pillCls: "pill-ok", pillTxt: "ok" },
    ],
    csvName: "hartley-gdpr-audit.csv",
  },

  inbox: [
    { id: "i1", sender: "The Ashworths", initials: "AS", channel: "Email", kind: "retail", unread: true, time: "08:02", status: "active", subject: "Worktop — will the kitchen still finish on time?", preview: "We heard the worktop's delayed — does that push the whole job back?", body: "Hi Claire,\n\nOne of your team mentioned the worktop template is running late. Does that mean the whole kitchen finishes later? We've got family staying from the 6th and were hoping to be straight by then.\n\nThanks,\nThe Ashworths", draft: "Hi both,\n\nGood question — and no, you'll still be straight before the 6th. The stone template slipped to Tuesday, so I've re-sequenced: the team will fit carcasses and units Mon–Wed, the tiler moves to Thursday, and the worktop fits Thursday with appliances and snagging Friday. You lose nothing on the finish date.\n\nI'll send the updated plan to your inbox today so you can see it.\n\nBest,\nClaire — Hartley Bathrooms & Kitchens", sources: ["Project · Ashworth kitchen", "Re-sequenced schedule", "Stoneworks template · Tue"] },
    { id: "i2", sender: "Stoneworks", initials: "SW", channel: "Email", kind: "supplier", unread: true, time: "07:48", status: "active", subject: "Worktop template — date slip", preview: "Apologies — the template visit has moved to Tuesday 27 May. Fabrication 7 days after.", body: "Hi Claire,\n\nApologies for the short notice — our templater is off sick this week, so the Ashworth worktop template moves to Tuesday 27 May. Fabrication is 7 working days from template, so fit would be w/c 9 June.\n\nRegards,\nStoneworks", draft: null, sources: [] },
    { id: "i3", sender: "The Bennetts", initials: "BN", channel: "Instagram DM", kind: "retail", unread: true, time: "07:35", status: "active", subject: "DM · still keen on the kitchen", preview: "Still really keen — can we lock in the design appointment this week?", body: "Hi! We're still really keen on the kitchen quote you sent — life got busy 😅. Can we lock in the design appointment this week? Thursday afternoon would be ideal.", draft: "Hi! Lovely to hear from you — Thursday at 1pm is free with Tom in the showroom, shall I hold it? I'll re-confirm the quote on the day; a couple of the appliance prices have nudged up since March so we'll lock current pricing once you're ready to proceed.\n\nSee you Thursday?", sources: ["Quote QU-5210 · kitchen", "Design diary · Thu 13:00", "Price watch · appliances"] },
    { id: "i4", sender: "Mrs Patel", initials: "RP", channel: "Email", kind: "retail", unread: true, time: "yesterday", status: "active", subject: "Bathroom — cabinet door not closing", preview: "The vanity door isn't sitting flush since the install. Could someone look?", body: "Hi,\n\nThe new bathroom looks lovely, thank you — one small thing, the vanity cabinet door isn't sitting flush and catches slightly. Could someone pop back and adjust it?\n\nThanks,\nRina Patel", draft: "Hi Rina,\n\nGlad you're happy with it! That'll just be a hinge that's settled — a two-minute adjustment. I've put a snagging visit in for Thursday at 3:30; the fitter will sort the door and check the rest while he's there. No charge, it's covered.\n\nBest,\nClaire", sources: ["Job · Patel bathroom", "Snag calendar · Thu 15:30", "Warranty · workmanship"] },
    { id: "i5", sender: "Calloway", initials: "CA", channel: "Email", kind: "retail", unread: false, time: "yesterday", status: "active", subject: "Re: final balance", preview: "Sorry for the delay — paying the balance this week, kitchen's superb.", body: "Hi Claire,\n\nApologies for the delay on the final balance — cashflow at our end. We'll get it paid this week. The kitchen's superb, we've had loads of compliments.\n\nBest,\nThe Calloways", draft: "Hi both,\n\nThank you — that's kind, and no problem at all. I'll keep an eye out for it this week. If a card payment is easier than a transfer just let me know and I'll send a secure link.\n\nReally glad you're enjoying it.\n\nClaire", sources: ["Invoice INV-7710 · £7,200", "Payment link · Stripe", "Customer record"] },
    { id: "i6", sender: "HMRC", initials: "HM", channel: "Email", kind: "supplier", unread: false, time: "yesterday", status: "active", subject: "VAT return reminder · Feb–Apr", preview: "Your VAT return for Feb–Apr 2026 is due by 3 June.", body: "Reminder · Your VAT return for the period 01 Feb – 30 Apr 2026 is due by 3 June 2026.\n\n— HMRC", draft: null, sources: [] },
    { id: "i7", sender: "Howdens", initials: "Ho", channel: "Email", kind: "supplier", unread: false, time: "2 days ago", status: "active", subject: "Invoice 41220 — Voss bathroom", preview: "Invoice for the Voss sanitaryware + tiles against PO-328. £1,420, 30-day terms.", body: "Please find attached invoice 41220 for sanitaryware and tiles delivered against PO-328. Amount £1,420.00, net 30 days.\n\nAccounts, Howdens", draft: "Approve and route to Xero · matches PO-328 · code: Stock › Bathrooms · 20% VAT recoverable · allocate to the Voss project · schedule for the Fri 30 May supplier batch.", sources: ["PO-328 · matched", "Project · Voss bathroom", "Supplier terms · net 30"] },
    { id: "i8", sender: "Harrogate Homes", initials: "HH", channel: "HubSpot", kind: "trade", unread: false, time: "2 days ago", status: "active", subject: "Phase 4 — 6 plots enquiry", preview: "Can you quote bathrooms + kitchens across 6 plots for the autumn phase?", body: "New message via HubSpot.\n\nHarrogate Homes would like a quote for bathrooms and kitchens across 6 plots for the autumn phase, staged delivery Sept–Dec. Same spec as the show homes.", draft: null, sources: [] },
  ],

  inboxDrafts: {
    i2: { draft: "Hi,\n\nThanks for the heads-up. Fit w/c 9 June is too late for this job — the customer has family from the 6th. Could you prioritise the template for first thing Tuesday and push fabrication to 5 working days? If not, I'll need to know today so I can re-plan the trades and we'll discuss the deposit.\n\nClaire", sources: ["Deposit · £1,800 paid", "Project deadline · 6 Jun", "Supplier terms"] },
    i8: { draft: "Hi,\n\nGreat to hear phase 4 is moving — happy to quote the 6 plots at the show-home spec. Given the Sept–Dec staging I'll build it as a programme with milestone deliveries so we lock material prices early and keep your retention cash predictable. I'll have it over by Friday.\n\nClaire", sources: ["Show-home spec · on file", "Programme template", "Material price watch"] },
  },

  approvals: [
    {
      id: "ashworth-resequence", workflowTag: "Project update", category: "comms", meta: "drafted 06:35 · Ashworth kitchen",
      headline: "Tell the Ashworths & the tiler the worktop slipped — and the fix",
      detail: "Stone template moved to Tuesday. Re-sequenced plan keeps the finish date: tiler moves to Thursday, worktop fits Thursday. Two messages, one to the customer, one to the tiler.",
      lineItems: [
        { primary: "The Ashworths", detail: "Reassure finish date holds + send revised plan", value: "customer", caption: "email", tag: "Project" },
        { primary: "Dapper Tiling (sub)", detail: "Move from Mon → Thu, confirm availability", value: "sub-trade", caption: "SMS" },
      ],
      openLabel: "Edit messages", approveLabel: "Send both", approveIcon: "send", status: "pending",
    },
    { id: "patel-snag-reply", workflowTag: "Customer reply", category: "reply", meta: "drafted 07:10 · Mrs Patel", headline: "Book the snagging visit for Mrs Patel's vanity door", detail: "Confirms a no-charge snagging visit Thursday 15:30 under workmanship warranty, reassures it's a quick hinge adjustment.", openLabel: "Open thread", approveLabel: "Send reply", approveIcon: "send", status: "pending" },
    {
      id: "po-330", workflowTag: "Purchase order", category: "po", meta: "Voss bathroom starts Thursday",
      headline: "Raise PO-330 to Howdens — £1,016",
      detail: "Tops up the tile and suite lines for the Voss bathroom. Next-day slot lands before Thursday's first fix.",
      lineItems: [
        { primary: "Porcelain tile 600×600 (matt)", detail: "20m²", stockNote: "on hand 24 · reserved 40", value: "£360" },
        { primary: "Sanitaryware suite (modern)", detail: "1 set", stockNote: "on hand 2 · reserved 3", value: "£640" },
        { primary: "Undermount sink", detail: "1", stockNote: "on hand 6", value: "£96" },
      ],
      openLabel: "Adjust", approveLabel: "Raise PO", approveIcon: "check", status: "pending",
    },
    { id: "recon-flags", workflowTag: "Reconciliation", category: "finance", meta: "overnight run · 02:16", headline: "4 unmatched bank lines need review", detail: "2× Stripe deposit fees, 1 Howdens credit note (£84.00), 1 unknown transfer (£260.00). 244 of 248 matched automatically.", openLabel: "View", approveLabel: "Mark resolved", approveIcon: "check", status: "pending" },
    { id: "weekly-payroll", workflowTag: "Payroll", category: "payroll", meta: "runs Fri 09:00 · 6 staff", headline: "Weekly payroll — 6 staff, net £5,210", detail: "Gross £6,920, net £5,210. One change: overtime on the Ashworth push (+£240). HMRC PAYE filing automatic on approval.", openLabel: "Review", approveLabel: "Approve payroll", approveIcon: "check", status: "pending" },
  ],

  chase: [
    { id: "ch1", customer: "Mr & Mrs Calloway", invoiceRef: "INV-7710", amount: "£7,200", reason: "Kitchen final 30% · 37 days overdue", addedHoursAgo: 24, source: "money-overdue", status: "sent" },
    { id: "ch2", customer: "Harrogate Homes", invoiceRef: "INV-7688", amount: "£5,400", reason: "Show-home bathrooms · 33 days overdue", addedHoursAgo: 48, source: "money-overdue", status: "pending" },
  ],

  projects: {
    intro:
      "Bathroom and kitchen fit-outs are a juggle of trades and deliveries — when one slips, everything downstream moves. Workbench shows every live project as a multi-trade timeline, tracks supplier deposits against deliveries, and gives the customer a read-only view of their own job.",
    depositAtRisk: "£1,800 (Stoneworks · Ashworth worktop, delivery slipped)",
    projects: [
      {
        id: "pr1", name: "Ashworth kitchen", customer: "The Ashworths", windowLabel: "Mon 26 – Fri 30 May", progressPct: 55,
        dayLabels: ["Mon 26", "Tue 27", "Wed 28", "Thu 29", "Fri 30"],
        trades: [
          { trade: "Strip-out + first fix", team: "Fit team A", startDay: 0, span: 1, color: "#0066CC", status: "done" },
          { trade: "Carcasses + units", team: "Fit team A", startDay: 1, span: 2, color: "#0066CC", status: "active" },
          { trade: "Tiling", team: "Dapper Tiling (sub)", startDay: 3, span: 1, color: "#8A5A12", status: "upcoming" },
          { trade: "Worktop fit + appliances", team: "Fit team A", startDay: 3, span: 1, color: "#1E5277", status: "upcoming" },
          { trade: "Snag + handover", team: "Fit team A", startDay: 4, span: 1, color: "#2E844A", status: "upcoming" },
        ],
        deliveries: [
          { supplier: "Howdens", item: "In-frame Shaker units", eta: "delivered 23 May", status: "delivered", deposit: "£4,800" },
          { supplier: "Stoneworks", item: "Quartz worktop (template slipped)", eta: "template Tue 27 May", status: "at-risk", deposit: "£1,800", atRisk: true },
          { supplier: "Howdens", item: "Oven + induction hob", eta: "in transit · Thu 29", status: "in-transit", deposit: "£600" },
        ],
        customerNote: "Re-sequenced after the worktop slip — finish date still Fri 30 May, ahead of the family visit on the 6th.",
      },
      {
        id: "pr2", name: "Voss bathroom", customer: "The Voss family", windowLabel: "Thu 29 May – Fri 6 Jun", progressPct: 10,
        dayLabels: ["Thu 29", "Fri 30", "Mon 2", "Tue 3", "Wed 4", "Thu 5", "Fri 6"],
        trades: [
          { trade: "Strip-out + first fix", team: "Fit team B", startDay: 0, span: 2, color: "#1E5277", status: "active" },
          { trade: "Tiling + waterproofing", team: "Dapper Tiling (sub)", startDay: 2, span: 2, color: "#8A5A12", status: "upcoming" },
          { trade: "Second fix + sanitaryware", team: "Fit team B", startDay: 4, span: 2, color: "#0066CC", status: "upcoming" },
          { trade: "Snag + handover", team: "Fit team B", startDay: 6, span: 1, color: "#2E844A", status: "upcoming" },
        ],
        deliveries: [
          { supplier: "City Plumbing", item: "Sanitaryware suite", eta: "delivered 28 May", status: "delivered", deposit: "£640" },
          { supplier: "Tile Mountain", item: "Porcelain + metro tiles", eta: "ordered · ETA Mon 2 Jun", status: "ordered", deposit: "£0" },
        ],
        customerNote: "Strip-out underway. On track for handover Fri 6 June.",
      },
      {
        id: "pr3", name: "Calloway kitchen", customer: "Mr & Mrs Calloway", windowLabel: "Completed 22 Apr", progressPct: 100,
        dayLabels: ["Wk 1", "Wk 2", "Wk 3"],
        trades: [
          { trade: "Full fit-out", team: "Fit team A", startDay: 0, span: 2, color: "#0066CC", status: "done" },
          { trade: "Snag + handover", team: "Fit team A", startDay: 2, span: 1, color: "#2E844A", status: "done" },
        ],
        deliveries: [
          { supplier: "Howdens", item: "Units + appliances", eta: "delivered", status: "delivered", deposit: "£0" },
        ],
        customerNote: "Complete and signed off. Final balance (£7,200) outstanding.",
      },
      {
        id: "pr4", name: "Bennett kitchen (design)", customer: "The Bennetts", windowLabel: "Design stage", progressPct: 5,
        dayLabels: ["Design", "Order", "Build"],
        trades: [
          { trade: "Design appointment", team: "Design · Tom", startDay: 0, span: 1, color: "#9A2D24", status: "active" },
        ],
        deliveries: [],
        customerNote: "Design appointment Thursday. Quote QU-5210 to be re-confirmed at current pricing.",
      },
    ],
  },
};
