// lib/mock/companies/brightwire.ts
// Brightwire Electrical — competency matrix + EICR renewal pipeline (report 3.6 / section 4).

import type { CompanyProfile } from "./types";

export const brightwire: CompanyProfile = {
  id: "brightwire",
  name: "Brightwire Electrical",
  shortName: "Brightwire",
  initials: "B",
  trade: "Electrical contractors",
  tradeShort: "Electrical · Manchester",
  ownerName: "Priya Anand",
  ownerFirst: "Priya",
  ownerInitials: "PA",
  features: ["competency", "cashflow-forecast", "quote-shelf-life", "auto-review"],
  overnightNote: "Flagged 2 expiring qualifications, queued 7 EICR renewals, reconciled the bank.",

  today: {
    date: "Thursday, 29 May",
    greetingName: "Priya",
    greetingLine:
      "Four things need a yes. An NICEIC assessment is booked, two engineer qualifications are about to lapse, and 7 landlord EICRs need renewing.",
    diarySubtitle: "4 jobs · an EICR, a consumer-unit swap, an EV charger and a fault-find",
    stats: [
      { label: "Cash on hand", value: "£44,900", delta: "+£2,260", sub: "vs last Thu" },
      { label: "EICRs due (90 days)", value: "7", sub: "landlord certs expiring" },
      { label: "Due in this week", value: "£14,200", sub: "9 invoices · 2 overdue" },
      { label: "Approvals waiting", value: "4", sub: "oldest queued 26m ago", accent: true },
    ],
    diary: [
      { id: "d1", time: "08:30", title: "EICR — landlord cert", detail: "3-bed rental · Marsden Lettings", location: "Didsbury, M20", status: "confirmed", statusPill: "ok" },
      { id: "d2", time: "10:30", title: "Consumer unit swap", detail: "18th-edition board · Mr Owusu", location: "Chorlton, M21", status: "unconfirmed", customer: "Mr Owusu", email: "owusu.home@gmail.com", phone: "+44 7700 902551" },
      { id: "d3", time: "13:00", title: "EV charger install", detail: "7kW Zappi · OZEV grant", location: "Sale, M33", status: "booked", statusPill: "info" },
      { id: "d4", time: "15:00", title: "Intermittent fault-find", detail: "Tripping RCD · Greenfield Café", location: "Northern Quarter, M4", status: "unconfirmed", customer: "Greenfield Café", email: "hello@greenfield-cafe.uk", phone: "+44 7700 902113" },
    ],
    risk: {
      title: "2 engineer qualifications lapse within 30 days — work would have to stop",
      body:
        "Marcus's 18th-edition cert expires in 18 days and Leon's Inspection & Testing (2391) in 27. If either lapses you can't sign off the affected work. See the Competency view to book renewals now.",
      customer: "Competency",
    },
  },

  money: {
    subtitle: "GBP · 2 connected accounts",
    cashOnHand: "£44,900",
    cashDeltaPct: "+5.3%",
    in7: "+£14,200",
    in7Count: "9 invoices",
    out7: "−£10,600",
    out7Detail: "payroll, wholesaler batch, van lease",
    cashflowDays: [
      { label: "29 Apr", in: 2400, out: 1600 }, { label: "30 Apr", in: 1200, out: 2400 },
      { label: "1 May", in: 3600, out: 900 }, { label: "2 May", in: 2100, out: 4200 },
      { label: "5 May", in: 3900, out: 1500 }, { label: "6 May", in: 1100, out: 1600 },
      { label: "7 May", in: 2300, out: 1100 }, { label: "8 May", in: 2900, out: 980 },
      { label: "9 May", in: 4100, out: 3100 }, { label: "12 May", in: 1500, out: 1900 },
      { label: "13 May", in: 5200, out: 1300 }, { label: "14 May", in: 1900, out: 2900 },
      { label: "15 May", in: 3400, out: 880 }, { label: "16 May", in: 1300, out: 4900 },
      { label: "19 May", in: 3700, out: 1700 }, { label: "20 May", in: 2300, out: 1300 },
      { label: "21 May", in: 4900, out: 2300 }, { label: "22 May", in: 1600, out: 1100 },
      { label: "23 May", in: 2800, out: 5200 }, { label: "26 May", in: 4200, out: 1600 },
      { label: "27 May", in: 1900, out: 2700 }, { label: "28 May", in: 3300, out: 1800 },
      { label: "29 May", in: 4800, out: 2100 },
    ],
    overdue30: [
      { id: "r1", name: "Marsden Lettings", email: "accounts@marsden-lets.co.uk", ref: "INV-4410 · 5× EICR batch", amount: "£1,150.00", age: "39 days", pill: "bad", chaseNote: "Last chase 6 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 39 },
      { id: "r2", name: "Pennine Construction", email: "ap@pennine-construct.uk", ref: "INV-4388 · 1st fix · phase 2", amount: "£4,820.00", age: "34 days", pill: "bad", chaseNote: "Last chase 2 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 34 },
    ],
    overdue30Sub: "2 invoices · £5,970 outstanding",
    overdue730: [
      { id: "r3", name: "Mr Owusu", email: "owusu.home@gmail.com", ref: "INV-4431 · partial board works", amount: "£380.00", age: "10 days", pill: "warn", chaseNote: "No chase yet", actionLabel: "Send reminder", daysOverdue: 10 },
      { id: "r4", name: "Greenfield Café", email: "hello@greenfield-cafe.uk", ref: "INV-4424 · emergency lighting test", amount: "£260.00", age: "13 days", pill: "warn", chaseNote: "Last chase 3 days ago", actionLabel: "Send reminder", daysOverdue: 13 },
    ],
    overdue730Sub: "2 invoices · £640 outstanding",
    dueWeek: [
      { name: "Sale Medical Centre", email: "ops@sale-medical.nhs.uk", ref: "INV-4440 · annual fixed-wire", amount: "£2,400.00", due: "due Fri 30 May" },
      { name: "Marsden Lettings", email: "accounts@marsden-lets.co.uk", ref: "INV-4438 · 3× EICR", amount: "£690.00", due: "due Sat 31 May" },
    ],
    dueWeekSub: "2 invoices · £3,090 expected",
    mismatches: [
      { id: "m1", desc: "SumUp card fee", amount: -1.80, date: "28 May", action: "Match to merchant fees" },
      { id: "m2", desc: "SumUp card fee", amount: -1.80, date: "28 May", action: "Match to merchant fees" },
      { id: "m3", desc: "SumUp card fee", amount: -1.80, date: "27 May", action: "Match to merchant fees" },
      { id: "m4", desc: "CEF refund", amount: 54.00, date: "25 May", action: "Mark as duplicate" },
      { id: "m5", desc: "Unknown transfer", amount: 200.00, date: "24 May", action: "Flag for review" },
    ],
    mismatchSummary: "Five bank lines couldn't be matched — mostly SumUp card fees and one wholesaler refund.",
    reconMatchedBase: 318,
    reconTotal: 323,
    reconFinished: "02:14",
    reconTook: "9 minutes",
    feesBreakdown: [
      { what: "SumUp card receipts", count: 142, value: 9840.00 },
      { what: "BACS in (commercial)", count: 58, value: 28600.00 },
      { what: "BACS out (wholesaler · CEF/Edmundson)", count: 14, value: 10600.00 },
      { what: "Card-machine fees", count: 142, value: 256.00 },
      { what: "Van lease & fuel cards", count: 11, value: 2640.00 },
      { what: "Refunds & adjustments", count: 5, value: -480.00 },
    ],
    csvName: "brightwire-invoice-radar.csv",
    forecast: [
      { week: "wc 2 Jun", in: 16800, out: 11200 },
      { week: "wc 9 Jun", in: 13400, out: 12800 },
      { week: "wc 16 Jun", in: 18600, out: 10400 },
      { week: "wc 23 Jun", in: 9200, out: 15800 },
      { week: "wc 30 Jun", in: 14200, out: 11100 },
      { week: "wc 7 Jul", in: 15800, out: 9600 },
      { week: "wc 14 Jul", in: 12200, out: 12800 },
      { week: "wc 21 Jul", in: 17900, out: 10400 },
    ],
    forecastNote:
      "Tightest week is wc 23 Jun — the Pennine retention and the wholesaler batch collide. Chasing INV-4388 first protects it.",
    staleQuotes: [
      { customer: "Greenfield Café", ref: "QU-3120", amount: "£3,400", ageDays: 19, sku: "Full LED relight + emergency", move: "+3.6% since quote" },
      { customer: "Mr Owusu", ref: "QU-3114", amount: "£980", ageDays: 22, sku: "Consumer unit + rewire kitchen", move: "+2.1% since quote" },
    ],
  },

  calendar: {
    title: "Jobs & inspections",
    weekRange: "26–31 May 2026",
    teams: {
      "Marcus · domestic": "#0066CC",
      "Leon · testing": "#2E844A",
      "Priya · commercial": "#1E5277",
      "EV / renewables": "#8A5A12",
      "Wholesaler · goods-in": "#727680",
    },
    dayLabels: { Mon: "Mon 26 May", Tue: "Tue 27 May", Wed: "Wed 28 May", Thu: "Thu 29 May", Fri: "Fri 30 May", Sat: "Sat 31 May" },
    week: {
      Mon: [
        { id: "m1", time: "08:30", durationMins: 120, kind: "inspection", title: "Fixed-wire test", detail: "Annual · Sale Medical Centre", team: "Leon · testing", teamColor: "#2E844A", location: "Sale, M33", status: "confirmed" },
        { id: "m2", time: "11:00", durationMins: 180, kind: "install", title: "Rewire — day 1", detail: "3-bed semi · Mr Khan", team: "Marcus · domestic", teamColor: "#0066CC", location: "Chorlton, M21", status: "confirmed" },
      ],
      Tue: [
        { id: "t1", time: "08:30", durationMins: 90, kind: "inspection", title: "EICR batch · 2 flats", detail: "Marsden Lettings", team: "Leon · testing", teamColor: "#2E844A", location: "Didsbury, M20", status: "confirmed" },
        { id: "t2", time: "11:00", durationMins: 180, kind: "install", title: "Rewire — day 2", detail: "3-bed semi · Mr Khan", team: "Marcus · domestic", teamColor: "#0066CC", location: "Chorlton, M21", status: "confirmed" },
        { id: "t3", time: "14:00", durationMins: 120, kind: "install", title: "Commercial DB upgrade", detail: "Pennine · phase 2", team: "Priya · commercial", teamColor: "#1E5277", location: "Trafford Park, M17", status: "tentative" },
      ],
      Wed: [
        { id: "w1", time: "09:00", durationMins: 120, kind: "install", title: "EV charger × 2", detail: "Zappi 7kW · OZEV", team: "EV / renewables", teamColor: "#8A5A12", location: "Sale, M33", status: "confirmed" },
        { id: "w2", time: "12:00", durationMins: 90, kind: "callout", title: "Tripping RCD", detail: "Fault-find · Mrs Patel", team: "Marcus · domestic", teamColor: "#0066CC", location: "Withington, M20", status: "confirmed" },
        { id: "w3", time: "15:00", durationMins: 45, kind: "delivery", title: "CEF delivery", detail: "Consumer units + cable", team: "Wholesaler · goods-in", teamColor: "#727680", location: "Yard · goods-in", status: "confirmed" },
      ],
      Thu: [
        { id: "th1", time: "08:30", durationMins: 90, kind: "inspection", title: "EICR — landlord cert", detail: "3-bed rental · Marsden", team: "Leon · testing", teamColor: "#2E844A", location: "Didsbury, M20", status: "confirmed" },
        { id: "th2", time: "10:30", durationMins: 150, kind: "install", title: "Consumer unit swap", detail: "18th-ed board · Mr Owusu", team: "Marcus · domestic", teamColor: "#0066CC", location: "Chorlton, M21", status: "tentative" },
        { id: "th3", time: "13:00", durationMins: 120, kind: "install", title: "EV charger install", detail: "7kW Zappi · OZEV grant", team: "EV / renewables", teamColor: "#8A5A12", location: "Sale, M33", status: "confirmed" },
        { id: "th4", time: "15:00", durationMins: 90, kind: "callout", title: "Intermittent fault-find", detail: "Tripping RCD · Greenfield Café", team: "Priya · commercial", teamColor: "#1E5277", location: "NQ, M4", status: "tentative" },
      ],
      Fri: [
        { id: "f1", time: "08:30", durationMins: 180, kind: "install", title: "Commercial relight — day 1", detail: "LED + emergency · Greenfield", team: "Priya · commercial", teamColor: "#1E5277", location: "NQ, M4", status: "confirmed" },
        { id: "f2", time: "11:00", durationMins: 90, kind: "inspection", title: "EICR · 1 flat", detail: "Marsden Lettings", team: "Leon · testing", teamColor: "#2E844A", location: "Didsbury, M20", status: "confirmed" },
      ],
      Sat: [
        { id: "s1", time: "09:00", durationMins: 60, kind: "callout", title: "Weekend call-out rota", detail: "On-call · Marcus", team: "Marcus · domestic", teamColor: "#0066CC", location: "Citywide", status: "confirmed" },
      ],
    },
  },

  customers: [
    {
      id: "marsden", name: "Marsden Lettings", email: "accounts@marsden-lets.co.uk", phone: "0161 555 0140", since: "Nov 2023", kind: "trade",
      lastJob: "5× EICR batch · 20 Apr 2026", nextJob: "EICR · 29 May", pm: "Priya Anand", totalSpend: "£22,400", outstanding: "£1,150",
      source: "Word of mouth", hubspotStage: "Customer", industry: "Letting agent · 90-property portfolio",
      monthlySpend: [690, 0, 1150, 0, 920, 0, 1150, 0, 690, 0, 1380, 1150], daysToPay: [39, 36, 41, 38],
      channelMix: [{ channel: "Email", count: 24, color: "#0066CC" }, { channel: "HubSpot CRM", count: 6, color: "#8A5A12" }],
      aging: { current: 690, d30: 0, d60: 1150, d90: 0 },
      notes: ["Rolling EICR programme across the portfolio.", "Pays at ~40 days — chase early.", "Wants a 5-year renewal schedule auto-managed."],
      jobs: [
        { date: "29 May 2026", type: "Inspection", detail: "EICR landlord cert", status: "upcoming" },
        { date: "20 Apr 2026", type: "Inspection", detail: "5× EICR batch", status: "completed" },
      ],
      invoices: [
        { number: "INV-4410", amount: "£1,150.00", date: "20 Apr 2026", status: "overdue", daysOverdue: 39 },
        { number: "INV-4438", amount: "£690.00", date: "23 May 2026", status: "pending" },
      ],
      messages: [{ date: "23 May", direction: "out", channel: "Email", subject: "Reminder · INV-4410", snippet: "Hi, nudge on the April EICR batch invoice…" }],
    },
    {
      id: "pennine", name: "Pennine Construction", email: "ap@pennine-construct.uk", phone: "0161 555 0322", since: "Feb 2024", kind: "trade",
      lastJob: "1st fix · phase 2 · 25 Apr 2026", nextJob: "DB upgrade · 27 May", pm: "Priya Anand", totalSpend: "£58,200", outstanding: "£4,820",
      source: "Trade show", hubspotStage: "Customer", industry: "Main contractor · commercial fit-out",
      monthlySpend: [0, 4200, 0, 4820, 0, 3800, 0, 6200, 0, 4820, 0, 4820], daysToPay: [34, 38, 35, 40],
      channelMix: [{ channel: "Email", count: 30, color: "#0066CC" }, { channel: "HubSpot CRM", count: 8, color: "#8A5A12" }],
      aging: { current: 0, d30: 0, d60: 4820, d90: 0 },
      notes: ["Phased commercial work · retention held.", "Application-for-payment cycle · slow.", "#1 account by value."],
      jobs: [
        { date: "27 May 2026", type: "Install", detail: "Distribution board upgrade · phase 2", status: "upcoming" },
        { date: "25 Apr 2026", type: "Install", detail: "1st fix · phase 2", status: "completed" },
      ],
      invoices: [{ number: "INV-4388", amount: "£4,820.00", date: "25 Apr 2026", status: "overdue", daysOverdue: 34 }],
      messages: [{ date: "27 May", direction: "out", channel: "Email", subject: "Reminder · INV-4388", snippet: "Hi, application 4 is overdue — could you confirm payment date?" }],
    },
    {
      id: "owusu", name: "Mr Owusu", email: "owusu.home@gmail.com", phone: "+44 7700 902551", since: "May 2026", kind: "retail",
      lastJob: "Partial board works · 18 May 2026", nextJob: "Consumer unit swap · 29 May 10:30", pm: "Priya Anand", totalSpend: "£380", outstanding: "£380",
      source: "Website", hubspotStage: "Proposal sent", industry: "Retail customer · M21",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 380], daysToPay: [],
      channelMix: [{ channel: "Email", count: 5, color: "#0066CC" }],
      aging: { current: 0, d30: 380, d60: 0, d90: 0 },
      notes: ["Quote QU-3114 for full board + kitchen rewire going stale.", "Already paid for partial board works."],
      jobs: [{ date: "29 May 2026", type: "Install", detail: "Consumer unit swap · 18th-ed board", status: "upcoming" }],
      invoices: [{ number: "INV-4431", amount: "£380.00", date: "18 May 2026", status: "overdue", daysOverdue: 10 }],
      messages: [{ date: "Today", direction: "in", channel: "Email", subject: "Board swap — confirm tomorrow?", snippet: "Can you confirm the consumer unit swap for tomorrow morning?" }],
    },
    {
      id: "greenfield", name: "Greenfield Café", email: "hello@greenfield-cafe.uk", phone: "0161 555 0610", since: "Aug 2024", kind: "trade",
      lastJob: "Emergency lighting test · 16 May 2026", nextJob: "Fault-find · 29 May 15:00", pm: "Priya Anand", totalSpend: "£6,400", outstanding: "£260",
      source: "Word of mouth", hubspotStage: "Negotiation", industry: "Hospitality · café · commercial",
      monthlySpend: [0, 0, 520, 0, 0, 0, 0, 1200, 0, 0, 260, 260], daysToPay: [13, 18, 21],
      channelMix: [{ channel: "Email", count: 9, color: "#0066CC" }, { channel: "Voicemail", count: 2, color: "#86868B" }],
      aging: { current: 0, d30: 260, d60: 0, d90: 0 },
      notes: ["Quote QU-3120 for a full LED relight (£3,400) going stale.", "Intermittent RCD trip — diagnosing.", "Emergency lighting under annual contract."],
      jobs: [
        { date: "29 May 2026", type: "Callout", detail: "Intermittent fault-find · tripping RCD", status: "upcoming" },
        { date: "16 May 2026", type: "Inspection", detail: "Emergency lighting test", status: "completed" },
      ],
      invoices: [{ number: "INV-4424", amount: "£260.00", date: "16 May 2026", status: "overdue", daysOverdue: 13 }],
      messages: [{ date: "yesterday", direction: "in", channel: "Email", subject: "RCD tripping again", snippet: "The board keeps tripping in the afternoons — can you get to the bottom of it?" }],
    },
  ],

  quoteTemplates: [
    {
      label: "Consumer unit upgrade (18th-ed board)", tag: "Domestic",
      lines: [
        { id: "b1-1", desc: "18th-edition dual-RCD consumer unit", qty: 1, unit: "unit", unitPrice: 180.00 },
        { id: "b1-2", desc: "SPD (surge protection)", qty: 1, unit: "unit", unitPrice: 64.00 },
        { id: "b1-3", desc: "Supply, fit & test · 1 day", qty: 1, unit: "visit", unitPrice: 420.00 },
        { id: "b1-4", desc: "EIC certificate + Building Regs notification", qty: 1, unit: "cert", unitPrice: 60.00 },
      ],
      notes: "Includes full circuit test, certification and NICEIC Building Regs notification.\nValid 30 days.",
    },
    {
      label: "EV charger install (7kW)", tag: "Renewables",
      lines: [
        { id: "b2-1", desc: "Zappi 7kW tethered charger", qty: 1, unit: "unit", unitPrice: 620.00 },
        { id: "b2-2", desc: "Dedicated circuit + isolator", qty: 1, unit: "job", unitPrice: 180.00 },
        { id: "b2-3", desc: "Install, commission & test", qty: 1, unit: "visit", unitPrice: 320.00 },
      ],
      notes: "OZEV grant eligible where applicable (we handle the claim).\nIncludes DNO notification and certification. Valid 30 days.",
    },
    {
      label: "Landlord EICR", tag: "Inspection",
      lines: [
        { id: "b3-1", desc: "EICR · up to 10 circuits", qty: 1, unit: "report", unitPrice: 180.00 },
        { id: "b3-2", desc: "Minor remedial works (C3)", qty: 1, unit: "allowance", unitPrice: 60.00 },
      ],
      notes: "Statutory 5-year landlord EICR. Certificate issued same day.\nVolume discount on portfolio batches.",
    },
  ],

  products: {
    subtitleSuffix: "lines",
    poSupplier: "CEF (City Electrical Factors)",
    poDraftBlurb: "Claude has drafted PO-512 for the CEF van-stock lines running low before next week's jobs.",
    items: [
      { id: "p1", sku: "CU-18ED-10W", name: "18th-ed dual-RCD consumer unit 10-way", category: "Distribution", unit: "unit", trade: "£124", retail: "£180", onHand: 2, reserved: 4, reorderAt: 4, leadTime: "Next day", supplier: "CEF", thumbBg: "linear-gradient(135deg,#ECEEF0,#C9CDD2)" },
      { id: "p2", sku: "SPD-T2", name: "Surge protection device (Type 2)", category: "Distribution", unit: "unit", trade: "£42", retail: "£64", onHand: 6, reserved: 3, reorderAt: 5, leadTime: "Next day", supplier: "CEF", thumbBg: "linear-gradient(135deg,#E2E5E9,#BCC1C7)" },
      { id: "p3", sku: "MCB-B32", name: "MCB Type B 32A", category: "Protection", unit: "each", trade: "£3.10", retail: "£5.40", onHand: 48, reserved: 12, reorderAt: 24, leadTime: "Next day", supplier: "CEF", thumbBg: "linear-gradient(135deg,#D9DDE1,#AEB4BB)" },
      { id: "p4", sku: "RCBO-B16", name: "RCBO Type B 16A 30mA", category: "Protection", unit: "each", trade: "£11.80", retail: "£19.00", onHand: 8, reserved: 18, reorderAt: 20, leadTime: "Next day", supplier: "CEF", thumbBg: "linear-gradient(135deg,#DDE1E5,#B2B9C0)" },
      { id: "p5", sku: "CAB-TE-2.5", name: "Twin & earth cable 2.5mm² (100m)", category: "Cable", unit: "drum", trade: "£68", retail: "£104", onHand: 5, reserved: 2, reorderAt: 4, leadTime: "Next day", supplier: "Edmundson", thumbBg: "linear-gradient(135deg,#6E6258,#3F372F)" },
      { id: "p6", sku: "CAB-TE-1.5", name: "Twin & earth cable 1.5mm² (100m)", category: "Cable", unit: "drum", trade: "£44", retail: "£70", onHand: 7, reserved: 3, reorderAt: 4, leadTime: "Next day", supplier: "Edmundson", thumbBg: "linear-gradient(135deg,#7A6E60,#473E34)" },
      { id: "p7", sku: "EV-ZAPPI-7", name: "Zappi 7kW EV charger (tethered)", category: "EV & renewables", unit: "unit", trade: "£420", retail: "£620", onHand: 3, reserved: 2, reorderAt: 3, leadTime: "2 working days", supplier: "CEF", thumbBg: "linear-gradient(135deg,#F0F2F4,#D4D9DD)" },
      { id: "p8", sku: "LED-PNL-600", name: "LED panel 600×600 (40W)", category: "Lighting", unit: "each", trade: "£18", retail: "£32", onHand: 14, reserved: 6, reorderAt: 12, leadTime: "Next day", supplier: "CEF", thumbBg: "linear-gradient(135deg,#F4F5F6,#DCDFE2)" },
      { id: "p9", sku: "EM-LED-3HR", name: "Emergency LED bulkhead (3hr)", category: "Lighting", unit: "each", trade: "£22", retail: "£38", onHand: 9, reserved: 8, reorderAt: 10, leadTime: "Next day", supplier: "CEF", thumbBg: "linear-gradient(135deg,#EEF0F2,#D0D4D8)" },
      { id: "p10", sku: "SOCK-DBL-USB", name: "Double socket + USB (white)", category: "Accessories", unit: "each", trade: "£8.40", retail: "£14.00", onHand: 32, reserved: 10, reorderAt: 20, leadTime: "Next day", supplier: "CEF", thumbBg: "linear-gradient(135deg,#F6F7F8,#E0E2E5)" },
    ],
  },

  compliance: {
    subtitle: "Next deadline in 18 days",
    intro: "NICEIC, engineer qualifications and the signed audit trail. Workbench tracks every competency expiry and the rolling 5-year EICR programme.",
    hero: {
      pillLabel: "Competency · NICEIC",
      urgentLabel: "Most urgent · in 18 days",
      title: "18th-edition qualification — Marcus",
      body: "Marcus's BS7671:2018 (18th edition) certificate expires in 18 days. Without it he can't sign off the affected work. Re-qualification course must be booked now.",
      pct: 60,
      pctLabel: "Renewal 60% arranged",
      pctNote: "course shortlisted · not yet booked",
      confirmLabel: "Book re-qualification",
      successTitle: "Re-qualification booked",
      successSub: "18th-ed update booked at NICEIC Direct · 9 Jun · cover arranged",
      rows: [
        { label: "Marcus Reilly — 18th edition", value: "expires 16 Jun", ok: false },
        { label: "Leon Park — 2391 Inspection & Testing", value: "expires 25 Jun", ok: false },
        { label: "Priya Anand — 18th edition", value: "valid to Mar 2028", ok: true },
        { label: "NICEIC registration", value: "valid to Nov 2026", ok: true },
        { label: "Course availability", value: "9 Jun slot held", ok: true },
      ],
    },
    legend: [
      { color: "#8A5A12", label: "Tax & payroll" },
      { color: "#9A2D24", label: "Competency / safety" },
      { color: "#1E5277", label: "Certification (2026 wall)" },
      { color: "#727680", label: "Insurance" },
      { color: "#2E844A", label: "Data / GDPR" },
    ],
    deadlines: [
      { key: "18thed", dot: "#9A2D24", title: "18th-edition cert — Marcus", desc: "BS7671:2018 re-qualification", progress: "Course shortlisted · 9 Jun slot held", pillCls: "pill-bad", pillTxt: "in 18 days", when: "Mon 16 Jun", actionLabel: "Book course", actionType: "secondary",
        detail: { intro: "Re-qualification needed to keep signing off work.", rows: [{ label: "Engineer", value: "Marcus Reilly" }, { label: "Cert", value: "18th edition (BS7671)" }, { label: "Course", value: "NICEIC Direct · 9 Jun" }], confirmLabel: "Book course", successTitle: "Course booked", successSub: "Marcus booked 9 Jun · cover arranged for the day" } },
      { key: "2391", dot: "#9A2D24", title: "2391 Inspection & Testing — Leon", desc: "Required to issue EICRs", progress: "Refresher recommended · slot available", pillCls: "pill-warn", pillTxt: "in 27 days", when: "Wed 25 Jun", actionLabel: "Book refresher", actionType: "secondary",
        detail: { intro: "Leon issues most of your EICRs — this is critical to the inspection pipeline.", rows: [{ label: "Engineer", value: "Leon Park" }, { label: "Cert", value: "City & Guilds 2391" }], confirmLabel: "Book refresher", successTitle: "Refresher booked", successSub: "Leon booked · EICR pipeline unaffected" } },
      { key: "niceic", dot: "#1E5277", title: "NICEIC annual assessment", desc: "Approved-contractor re-assessment", progress: "Assessor visit pre-booked · evidence pack 80% ready", pillCls: "pill-soft", pillTxt: "in 41 days", when: "Mon 7 Jul", actionLabel: "Prep evidence", actionType: "secondary",
        detail: { intro: "Annual NICEIC assessment of recent work and records.", rows: [{ label: "Assessor visit", value: "7 Jul" }, { label: "Evidence pack", value: "80% ready" }, { label: "Sample jobs", value: "6 selected" }], confirmLabel: "Lock evidence pack", successTitle: "Evidence pack locked", successSub: "Sample certificates and records compiled for the assessor" } },
      { key: "vat", dot: "#8A5A12", title: "VAT return — Feb–Apr", desc: "Due to HMRC via Government Gateway", progress: "Return 90% prepared · awaiting 1 statement", pillCls: "pill-soft", pillTxt: "in 5 days", when: "Mon 3 Jun", actionLabel: "Open draft", actionType: "secondary",
        detail: { rows: [{ label: "Box 5 — Net VAT to pay", value: "£6,180" }, { label: "CEF April statement", value: "Awaiting", ok: false }], confirmLabel: "Submit to HMRC", successTitle: "VAT filed", successSub: "Receipt 2026-VAT-#GG5521 · payment scheduled 2 Jun" } },
      { key: "insurance", dot: "#727680", title: "Public & professional indemnity", desc: "Annual renewal · £5m cover", progress: "3 quotes gathered · 1 cheaper", pillCls: "pill-soft", pillTxt: "in 35 days", when: "Sun 28 Jun", actionLabel: "Compare quotes", actionType: "secondary",
        detail: { intro: "3 quotes gathered. Cover ends 28 Jun.", rows: [{ label: "Current", value: "£1,480/yr" }, { label: "Alternative", value: "£1,290/yr · same cover" }], confirmLabel: "Bind cheapest", successTitle: "Renewal switched", successSub: "Bound · certificate emailed" } },
    ],
    connectors: [
      { initials: "Xe", name: "Xero", by: "Priya Anand", scopes: "invoices.read, contacts.write, transactions.read", last: "5 mins ago", status: "Active", statusCls: "pill-ok", iconBg: "#E7EFF5", iconFg: "#1E5277" },
      { initials: "NC", name: "NICEIC certs", by: "Priya Anand", scopes: "certificates.read, certificates.write", last: "today 02:10", status: "Active", statusCls: "pill-ok", iconBg: "#E6F2EB", iconFg: "#2E844A" },
      { initials: "HM", name: "HMRC gateway", by: "Priya Anand", scopes: "vat.submit, paye.submit", last: "today 02:12", status: "Active", statusCls: "pill-ok", iconBg: "#F5EAD6", iconFg: "#8A5A12" },
      { initials: "Su", name: "SumUp", by: "Marcus Reilly", scopes: "transactions.read", last: "30 mins ago", status: "Re-auth in 9d", statusCls: "pill-warn", iconBg: "#EEEDE7", iconFg: "#191C21" },
      { initials: "Gm", name: "Gmail (office@)", by: "Priya Anand", scopes: "mail.read, mail.send (draft only)", last: "just now", status: "Active", statusCls: "pill-ok", iconBg: "#EEEDE7", iconFg: "#191C21" },
    ],
    audit: [
      { time: "06:40", event: "Flagged", detail: "2 engineer qualifications expiring within 30 days", ref: "#cm-220", actor: "competency monitor", pillCls: "pill-warn", pillTxt: "waiting" },
      { time: "06:20", event: "Queued", detail: "7 landlord EICR renewals · 90-day window", ref: "#ei-118", actor: "EICR pipeline", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "02:14", event: "Reconciled", detail: "318 of 323 bank transactions · 5 flagged", ref: "", actor: "overnight run", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "yest. 16:20", event: "Issued", detail: "EICR certificate · Marsden flat 4b · signed by Leon", ref: "#c-4471", actor: "approved by Leon", pillCls: "pill-ok", pillTxt: "ok" },
    ],
    csvName: "brightwire-gdpr-audit.csv",
  },

  inbox: [
    { id: "i1", sender: "Marsden Lettings", initials: "ML", channel: "Email", kind: "trade", unread: true, time: "08:10", status: "active", subject: "EICR renewals — which are due?", preview: "Can you tell us which of our properties have EICRs expiring this year so we can budget?", body: "Hi Priya,\n\nCan you send us a list of which properties have EICRs expiring in the next 12 months? We want to budget and avoid any lapsing — last year we got caught out by two.\n\nThanks,\nMarsden Lettings", draft: "Hi,\n\nYes — I've pulled the full renewal schedule. You have 7 expiring in the next 90 days and 14 more across the rest of the year. I can batch the 7 imminent ones into two visit days (28 & 29 May) at the portfolio rate, and set the rest on an auto-reminder so nothing lapses again.\n\nSchedule attached. Shall I book the two days?\n\nBest,\nPriya", sources: ["EICR pipeline · 90-day window", "Portfolio rate · batch discount", "Calendar · 28–29 May"] },
    { id: "i2", sender: "Mr Owusu", initials: "MO", channel: "Email", kind: "retail", unread: true, time: "07:55", status: "active", subject: "Board swap — confirm tomorrow?", preview: "Can you confirm the consumer unit swap for tomorrow morning?", body: "Hi Priya,\n\nJust checking the consumer unit swap is still on for tomorrow morning? I'll make sure the meter cupboard is clear.\n\nThanks,\nJoseph Owusu", draft: "Hi Joseph,\n\nConfirmed for 10:30 tomorrow. It's about a 2.5-hour job and the power will be off for roughly an hour while we change the board over. You'll get the EIC certificate and Building Regs notification the same day.\n\nSee you then,\nPriya — Brightwire Electrical", sources: ["Quote QU-3114", "Calendar · 29 May 10:30", "Cert template · EIC"] },
    { id: "i3", sender: "Website enquiry", initials: "WE", channel: "Web form", kind: "retail", unread: true, time: "07:40", status: "active", subject: "EV charger + grant question", preview: "Want a 7kW charger fitted — do I still qualify for any grant?", body: "Form submission\n\nName: Hannah Cole\nEnquiry: Looking to get a 7kW EV charger fitted on the driveway. Do I qualify for any grants? Flat owner, M20.\nPreferred contact: email.", draft: "Hi Hannah,\n\nHappy to help. As a flat owner you may qualify for the EV chargepoint grant (up to £350) — homeowners with off-street parking in houses no longer do, but flats and rentals still can. A 7kW Zappi supplied and fitted is typically £1,120 before any grant.\n\nI can confirm eligibility on a quick call — what suits?\n\nBest,\nPriya", sources: ["OZEV grant · flat eligibility", "Quote template · EV 7kW", "Product · Zappi 7kW"] },
    { id: "i4", sender: "Greenfield Café", initials: "GC", channel: "Email", kind: "trade", unread: true, time: "yesterday", status: "active", subject: "RCD tripping again", preview: "The board keeps tripping in the afternoons — can you get to the bottom of it?", body: "Hi,\n\nThe RCD keeps tripping in the afternoons, usually when the coffee machines and the dishwasher are both going. It's costing us — can you get to the bottom of it once and for all?\n\nThanks,\nGreenfield Café", draft: null, sources: [] },
    { id: "i5", sender: "Pennine Construction", initials: "PC", channel: "HubSpot", kind: "trade", unread: true, time: "yesterday", status: "active", subject: "Phase 3 — request for quote", preview: "Can you price the phase 3 electrical package? Drawings attached.", body: "New message via HubSpot.\n\nPennine Construction would like a quote for the phase 3 electrical package (commercial fit-out, ~14 weeks). Drawings attached. Application-for-payment terms as before.", draft: null, sources: [] },
    { id: "i6", sender: "HMRC", initials: "HM", channel: "Email", kind: "supplier", unread: false, time: "yesterday", status: "active", subject: "VAT return reminder · Feb–Apr", preview: "Your VAT return for Feb–Apr 2026 is due by 3 June.", body: "Reminder · Your VAT return for the period 01 Feb – 30 Apr 2026 is due by 3 June 2026.\n\n— HMRC", draft: null, sources: [] },
    { id: "i7", sender: "CEF", initials: "CE", channel: "Email", kind: "supplier", unread: false, time: "yesterday", status: "active", subject: "Invoice 70210 — consumer units", preview: "Invoice for consumer units + cable against PO-509. £890, 30-day terms.", body: "Please find attached invoice 70210 for consumer units and cable delivered against PO-509. Amount £890.00, net 30 days.\n\nAccounts, CEF", draft: "Approve and route to Xero · matches PO-509 · code: Stock › Electrical › Distribution · 20% VAT recoverable · schedule for the Fri 30 May wholesaler batch.", sources: ["PO-509 · matched", "Xero code · Stock › Electrical", "Supplier terms · net 30"] },
    { id: "i8", sender: "NICEIC", initials: "NC", channel: "Email", kind: "supplier", unread: false, time: "2 days ago", status: "active", subject: "Annual assessment — date confirmed", preview: "Your annual assessment is confirmed for 7 July. Please have sample records ready.", body: "Your NICEIC annual assessment is confirmed for 7 July 2026. The assessor will review a sample of recent certificates and your records. Please ensure your registration and insurance documents are current.\n\n— NICEIC", draft: null, sources: [] },
  ],

  inboxDrafts: {
    i4: { draft: "Hi,\n\nThat pattern — tripping under combined load in the afternoons — points to either a deteriorating appliance or cumulative earth leakage across the kitchen circuit. I'll bring a clamp meter and insulation tester on the 29th and isolate it properly rather than just resetting. If it's one appliance we'll find it; if it's leakage across several, an RCBO split is the fix.\n\nPriya.", sources: ["Fault-find · earth leakage", "Calendar · 29 May 15:00", "Past report · emergency lighting"] },
    i5: { draft: "Hi,\n\nThanks — happy to price phase 3. I'll work through the drawings and come back with a staged quote on the same application-for-payment terms by Friday. Given the 14-week run I'll also flag the materials we'd want to buy early to beat any copper-price moves.\n\nPriya", sources: ["Drawings · phase 3", "Terms · application for payment", "Material price watch"] },
  },

  approvals: [
    {
      id: "eicr-renewals", workflowTag: "EICR pipeline", category: "comms", meta: "queued 06:20 · 90-day renewal window",
      headline: "Send 7 landlord EICR renewal offers — keeps Marsden compliant",
      detail: "Each certificate expires within 90 days. Offer batches the visits into two days at the portfolio rate and books on reply. Stops anything lapsing.",
      lineItems: [
        { primary: "12 Acer Road, flat 1", detail: "EICR expires 18 Jun", value: "£180", caption: "21 days", tag: "Marsden" },
        { primary: "12 Acer Road, flat 2", detail: "EICR expires 18 Jun", value: "£180", caption: "21 days", tag: "Marsden" },
        { primary: "4 Birch Avenue", detail: "EICR expires 2 Jul", value: "£180", caption: "35 days", tag: "Marsden" },
        { primary: "9 Cedar Close", detail: "EICR expires 14 Jul", value: "£180", caption: "47 days", tag: "Marsden" },
        { primary: "22 Elm Grove", detail: "EICR expires 28 Jul", value: "£180", caption: "61 days", tag: "Marsden" },
      ],
      openLabel: "Edit drafts", approveLabel: "Send all 7", approveIcon: "send", status: "pending",
    },
    { id: "owusu-reply", workflowTag: "Customer reply", category: "reply", meta: "drafted 07:56 · Mr Owusu", headline: "Confirm tomorrow's consumer-unit swap to Mr Owusu", detail: "Confirms the 10:30 slot, sets expectations on the power-off window, and promises same-day EIC certification.", openLabel: "Open thread", approveLabel: "Send reply", approveIcon: "send", status: "pending" },
    {
      id: "po-512", workflowTag: "Purchase order", category: "po", meta: "van stock drops below next week's jobs",
      headline: "Raise PO-512 to CEF — £806",
      detail: "Tops up the consumer-unit and RCBO lines before the Owusu swap and the Pennine DB upgrade.",
      lineItems: [
        { primary: "18th-ed consumer unit 10-way", detail: "4 units", stockNote: "on hand 2 · need 6", value: "£496" },
        { primary: "RCBO Type B 16A 30mA", detail: "20", stockNote: "on hand 8 · reserved 18", value: "£236" },
        { primary: "SPD (Type 2)", detail: "2", stockNote: "on hand 6", value: "£84" },
      ],
      openLabel: "Adjust", approveLabel: "Raise PO", approveIcon: "check", status: "pending",
    },
    { id: "recon-flags", workflowTag: "Reconciliation", category: "finance", meta: "overnight run · 02:14", headline: "5 unmatched bank lines need review", detail: "3× SumUp card fees (£1.80 each), 1 CEF refund (£54.00), 1 unknown transfer (£200.00). 318 of 323 matched automatically.", openLabel: "View", approveLabel: "Mark resolved", approveIcon: "check", status: "pending" },
  ],

  chase: [
    { id: "ch1", customer: "Pennine Construction", invoiceRef: "INV-4388", amount: "£4,820", reason: "Application 4 · 34 days overdue", addedHoursAgo: 28, source: "money-overdue", status: "pending" },
    { id: "ch2", customer: "Marsden Lettings", invoiceRef: "INV-4410", amount: "£1,150", reason: "EICR batch · 39 days overdue", addedHoursAgo: 50, source: "money-overdue", status: "snoozed" },
  ],

  competency: {
    intro:
      "Electrical work can only be signed off by someone holding the right, in-date qualification. Workbench keeps a live competency matrix and nudges renewals at 90/60/30 days so a lapse never stops you working.",
    certColumns: ["18th edition", "2391 Insp & Test", "2377 PAT", "ECS card", "First aid"],
    engineers: [
      { name: "Priya Anand", role: "Qualifying supervisor", quals: [
        { name: "18th edition", status: "valid", expires: "Mar 2028" },
        { name: "2391 Insp & Test", status: "valid", expires: "Jan 2027" },
        { name: "2377 PAT", status: "valid", expires: "Sep 2026" },
        { name: "ECS card", status: "valid", expires: "Aug 2027" },
        { name: "First aid", status: "expiring", expires: "12 Jul 2026" },
      ] },
      { name: "Marcus Reilly", role: "Approved electrician", quals: [
        { name: "18th edition", status: "expiring", expires: "16 Jun 2026" },
        { name: "2391 Insp & Test", status: "valid", expires: "May 2027" },
        { name: "2377 PAT", status: "valid", expires: "Nov 2026" },
        { name: "ECS card", status: "valid", expires: "Feb 2027" },
        { name: "First aid", status: "valid", expires: "Apr 2027" },
      ] },
      { name: "Leon Park", role: "Approved electrician", quals: [
        { name: "18th edition", status: "valid", expires: "Oct 2027" },
        { name: "2391 Insp & Test", status: "expiring", expires: "25 Jun 2026" },
        { name: "2377 PAT", status: "valid", expires: "Jul 2026" },
        { name: "ECS card", status: "valid", expires: "Jan 2027" },
        { name: "First aid", status: "valid", expires: "Mar 2027" },
      ] },
      { name: "Dale Foster", role: "Apprentice (year 3)", quals: [
        { name: "18th edition", status: "valid", expires: "Jun 2028" },
        { name: "2391 Insp & Test", status: "expired", expires: "not yet held" },
        { name: "2377 PAT", status: "valid", expires: "Oct 2026" },
        { name: "ECS card", status: "valid", expires: "Dec 2026" },
        { name: "First aid", status: "valid", expires: "May 2027" },
      ] },
    ],
    eicrIntro:
      "Statutory landlord EICRs must be renewed every 5 years. The pipeline tracks every certificate's expiry and nudges at 90, 60 and 30 days so no property in your portfolios ever lapses.",
    eicrJobs: [
      { property: "12 Acer Road, flat 1", landlord: "Marsden Lettings", expires: "18 Jun 2026", daysOut: 21, stage: "30-day", channel: "Email + SMS" },
      { property: "12 Acer Road, flat 2", landlord: "Marsden Lettings", expires: "18 Jun 2026", daysOut: 21, stage: "30-day", channel: "Email + SMS" },
      { property: "4 Birch Avenue", landlord: "Marsden Lettings", expires: "2 Jul 2026", daysOut: 35, stage: "60-day", channel: "Email" },
      { property: "9 Cedar Close", landlord: "Marsden Lettings", expires: "14 Jul 2026", daysOut: 47, stage: "60-day", channel: "Email" },
      { property: "22 Elm Grove", landlord: "Marsden Lettings", expires: "28 Jul 2026", daysOut: 61, stage: "90-day", channel: "Email" },
      { property: "7 Foxglove Way", landlord: "Hartshead Estates", expires: "9 Aug 2026", daysOut: 73, stage: "90-day", channel: "Email" },
      { property: "31 Granby Row", landlord: "Hartshead Estates", expires: "20 Aug 2026", daysOut: 84, stage: "90-day", channel: "Email" },
      { property: "5 Holly Bank", landlord: "Marsden Lettings", expires: "1 May 2026", daysOut: -28, stage: "overdue", channel: "Phone (no reply)" },
    ],
  },
};
