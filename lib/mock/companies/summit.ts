// lib/mock/companies/summit.ts
// Summit Roofing — weather-aware re-scheduling (report 3.5).

import type { CompanyProfile } from "./types";

export const summit: CompanyProfile = {
  id: "summit",
  name: "Summit Roofing",
  shortName: "Summit",
  initials: "S",
  trade: "Roofing contractors",
  tradeShort: "Roofing · Bristol",
  ownerName: "Gary Mercer",
  ownerFirst: "Gary",
  ownerInitials: "GM",
  features: ["weather-scheduling", "cashflow-forecast", "quote-shelf-life", "auto-review"],
  overnightNote: "Checked the 7-day forecast, flagged 2 jobs to move off the wet days, reconciled the bank.",

  today: {
    date: "Thursday, 29 May",
    greetingName: "Gary",
    greetingLine:
      "Four things need a yes. Heavy rain is forecast Friday and Saturday — two open-roof jobs need moving, and the customers told before they ring you.",
    diarySubtitle: "4 jobs · two re-roofs, a survey and a gutter repair",
    stats: [
      { label: "Cash on hand", value: "£36,700", delta: "+£1,520", sub: "vs last Thu" },
      { label: "Weather risk", value: "2 jobs", sub: "Fri–Sat · heavy rain" },
      { label: "Due in this week", value: "£12,800", sub: "7 invoices · 2 overdue" },
      { label: "Approvals waiting", value: "4", sub: "oldest queued 19m ago", accent: true },
    ],
    diary: [
      { id: "d1", time: "08:00", title: "Re-roof — day 2", detail: "Concrete tile · Mr Probert", location: "Bishopston, BS7", status: "confirmed", statusPill: "ok" },
      { id: "d2", time: "08:30", title: "Flat-roof recover", detail: "EPDM · garage · Mrs Doyle", location: "Horfield, BS7", status: "confirmed", statusPill: "ok" },
      { id: "d3", time: "11:30", title: "Roof survey — storm damage", detail: "Insurance job · with Lee", location: "Redland, BS6", status: "unconfirmed", customer: "The Hardings", email: "harding.home@gmail.com", phone: "+44 7700 904221" },
      { id: "d4", time: "14:00", title: "Gutter & fascia repair", detail: "½ day · Mr Singh", location: "Fishponds, BS16", status: "unconfirmed", customer: "Mr Singh", email: "j.singh@gmail.com", phone: "+44 7700 904778" },
    ],
    risk: {
      title: "Heavy rain Fri–Sat clashes with two open-roof jobs",
      body:
        "The Probert re-roof and the Calloway strip both have the roof open over the weekend. With 90% rain forecast, the felt's at risk and the customers will worry. Move them to early next week and tell them now. Open the Weather view.",
      customer: "Weather",
    },
  },

  money: {
    subtitle: "GBP · 2 connected accounts",
    cashOnHand: "£36,700",
    cashDeltaPct: "+4.3%",
    in7: "+£12,800",
    in7Count: "7 invoices",
    out7: "−£9,400",
    out7Detail: "payroll, merchant batch, skip hire",
    cashflowDays: [
      { label: "29 Apr", in: 2200, out: 1500 }, { label: "30 Apr", in: 1100, out: 2100 },
      { label: "1 May", in: 3400, out: 800 }, { label: "2 May", in: 1900, out: 3900 },
      { label: "5 May", in: 2800, out: 1300 }, { label: "6 May", in: 1000, out: 1500 },
      { label: "7 May", in: 2100, out: 980 }, { label: "8 May", in: 2600, out: 900 },
      { label: "9 May", in: 3600, out: 2900 }, { label: "12 May", in: 1200, out: 1800 },
      { label: "13 May", in: 4400, out: 1200 }, { label: "14 May", in: 1700, out: 2600 },
      { label: "15 May", in: 3100, out: 820 }, { label: "16 May", in: 1100, out: 4100 },
      { label: "19 May", in: 3300, out: 1600 }, { label: "20 May", in: 2000, out: 1200 },
      { label: "21 May", in: 4200, out: 2000 }, { label: "22 May", in: 1500, out: 1000 },
      { label: "23 May", in: 2400, out: 4400 }, { label: "26 May", in: 3700, out: 1500 },
      { label: "27 May", in: 1800, out: 2400 }, { label: "28 May", in: 2900, out: 1600 },
      { label: "29 May", in: 4100, out: 1900 },
    ],
    overdue30: [
      { id: "r1", name: "Bristol Property Co", email: "ap@bristolproperty.co.uk", ref: "INV-6610 · communal roof repair", amount: "£2,840.00", age: "41 days", pill: "bad", chaseNote: "Last chase 7 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 41 },
      { id: "r2", name: "Mr & Mrs Probert", email: "probert.home@gmail.com", ref: "INV-6598 · re-roof deposit balance", amount: "£1,960.00", age: "32 days", pill: "bad", chaseNote: "Last chase 3 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 32 },
    ],
    overdue30Sub: "2 invoices · £4,800 outstanding",
    overdue730: [
      { id: "r3", name: "Mr Singh", email: "j.singh@gmail.com", ref: "INV-6631 · gutter clearance", amount: "£280.00", age: "9 days", pill: "warn", chaseNote: "No chase yet", actionLabel: "Send reminder", daysOverdue: 9 },
      { id: "r4", name: "Horfield Tennis Club", email: "treasurer@horfieldtc.uk", ref: "INV-6624 · clubhouse felt repair", amount: "£640.00", age: "12 days", pill: "warn", chaseNote: "Last chase 4 days ago", actionLabel: "Send reminder", daysOverdue: 12 },
    ],
    overdue730Sub: "2 invoices · £920 outstanding",
    dueWeek: [
      { name: "Mrs Doyle", email: "doyle.bs7@gmail.com", ref: "INV-6640 · EPDM garage recover", amount: "£1,480.00", due: "due Fri 30 May" },
      { name: "Redland Lettings", email: "greg@redland-lets.uk", ref: "INV-6638 · 2× ridge re-bed", amount: "£760.00", due: "due Sat 31 May" },
    ],
    dueWeekSub: "2 invoices · £2,240 expected",
    mismatches: [
      { id: "m1", desc: "Zettle card fee", amount: -2.40, date: "28 May", action: "Match to merchant fees" },
      { id: "m2", desc: "Zettle card fee", amount: -2.40, date: "27 May", action: "Match to merchant fees" },
      { id: "m3", desc: "SIG roofing refund", amount: 38.00, date: "26 May", action: "Mark as duplicate" },
      { id: "m4", desc: "Unknown transfer", amount: 150.00, date: "24 May", action: "Flag for review" },
    ],
    mismatchSummary: "Four bank lines couldn't be matched — Zettle card fees and one merchant refund.",
    reconMatchedBase: 198,
    reconTotal: 202,
    reconFinished: "02:09",
    reconTook: "6 minutes",
    feesBreakdown: [
      { what: "Zettle card receipts", count: 86, value: 7240.00 },
      { what: "BACS in (commercial / lettings)", count: 34, value: 22400.00 },
      { what: "BACS out (merchant · SIG/Jewson)", count: 12, value: 9400.00 },
      { what: "Skip hire & disposal", count: 9, value: 1840.00 },
      { what: "Merchant fees", count: 86, value: 206.00 },
      { what: "Refunds & adjustments", count: 4, value: -340.00 },
    ],
    csvName: "summit-invoice-radar.csv",
    forecast: [
      { week: "wc 2 Jun", in: 14200, out: 9600 },
      { week: "wc 9 Jun", in: 11800, out: 10400 },
      { week: "wc 16 Jun", in: 16400, out: 8800 },
      { week: "wc 23 Jun", in: 8200, out: 13200 },
      { week: "wc 30 Jun", in: 13800, out: 9600 },
      { week: "wc 7 Jul", in: 15200, out: 8400 },
      { week: "wc 14 Jul", in: 10800, out: 11200 },
      { week: "wc 21 Jul", in: 16900, out: 9200 },
    ],
    forecastNote:
      "Weather drives the curve — a wet fortnight pushes work (and payment) right. wc 23 Jun is tight if the Probert and Bristol Property invoices haven't landed. Chase those two first.",
    staleQuotes: [
      { customer: "The Hardings", ref: "QU-4120", amount: "£6,800", ageDays: 16, sku: "Storm-damage re-roof (insurance)", move: "+3.2% since quote" },
      { customer: "Horfield Tennis Club", ref: "QU-4108", amount: "£4,200", ageDays: 23, sku: "Clubhouse flat-roof recover", move: "+2.7% since quote" },
    ],
  },

  calendar: {
    title: "Roof jobs & surveys",
    weekRange: "26–31 May 2026",
    teams: {
      "Crew A · re-roof": "#0066CC",
      "Crew B · flat roof": "#1E5277",
      "Survey · Lee": "#8A5A12",
      "Repairs · Dan": "#2E844A",
      "Merchant · goods-in": "#727680",
    },
    dayLabels: { Mon: "Mon 26 May", Tue: "Tue 27 May", Wed: "Wed 28 May", Thu: "Thu 29 May", Fri: "Fri 30 May", Sat: "Sat 31 May" },
    week: {
      Mon: [
        { id: "m1", time: "08:00", durationMins: 300, kind: "install", title: "Probert re-roof — day 1", detail: "Strip + felt + batten", team: "Crew A · re-roof", teamColor: "#0066CC", location: "Bishopston, BS7", status: "confirmed", weatherDep: true },
        { id: "m2", time: "08:30", durationMins: 240, kind: "install", title: "Ridge re-bed × 2", detail: "Redland Lettings", team: "Repairs · Dan", teamColor: "#2E844A", location: "Redland, BS6", status: "confirmed", weatherDep: true },
      ],
      Tue: [
        { id: "t1", time: "08:00", durationMins: 300, kind: "install", title: "Probert re-roof — day 2", detail: "Tiling", team: "Crew A · re-roof", teamColor: "#0066CC", location: "Bishopston, BS7", status: "confirmed", weatherDep: true },
        { id: "t2", time: "09:00", durationMins: 240, kind: "install", title: "EPDM garage recover", detail: "Mrs Doyle", team: "Crew B · flat roof", teamColor: "#1E5277", location: "Horfield, BS7", status: "confirmed", weatherDep: true },
      ],
      Wed: [
        { id: "w1", time: "08:00", durationMins: 300, kind: "install", title: "Calloway re-roof — day 1", detail: "Strip + felt (roof open)", team: "Crew A · re-roof", teamColor: "#0066CC", location: "Bedminster, BS3", status: "confirmed", weatherDep: true },
        { id: "w2", time: "10:00", durationMins: 120, kind: "callout", title: "Leak callout", detail: "Flashing · Mr Owen", team: "Repairs · Dan", teamColor: "#2E844A", location: "St George, BS5", status: "confirmed", weatherDep: false },
        { id: "w3", time: "15:00", durationMins: 45, kind: "delivery", title: "SIG delivery", detail: "Concrete tiles + felt", team: "Merchant · goods-in", teamColor: "#727680", location: "Yard · goods-in", status: "confirmed", weatherDep: false },
      ],
      Thu: [
        { id: "th1", time: "08:00", durationMins: 300, kind: "install", title: "Probert re-roof — day 2", detail: "Tiling + ridge", team: "Crew A · re-roof", teamColor: "#0066CC", location: "Bishopston, BS7", status: "confirmed", weatherDep: true },
        { id: "th2", time: "08:30", durationMins: 240, kind: "install", title: "EPDM garage recover", detail: "Garage · Mrs Doyle", team: "Crew B · flat roof", teamColor: "#1E5277", location: "Horfield, BS7", status: "confirmed", weatherDep: true },
        { id: "th3", time: "11:30", durationMins: 90, kind: "survey", title: "Storm-damage survey", detail: "Insurance job · with Lee", team: "Survey · Lee", teamColor: "#8A5A12", location: "Redland, BS6", status: "tentative", weatherDep: false },
        { id: "th4", time: "14:00", durationMins: 180, kind: "callout", title: "Gutter & fascia repair", detail: "Mr Singh", team: "Repairs · Dan", teamColor: "#2E844A", location: "Fishponds, BS16", status: "tentative", weatherDep: true },
      ],
      Fri: [
        { id: "f1", time: "08:00", durationMins: 300, kind: "install", title: "Probert re-roof — day 3", detail: "Roof open — RAIN RISK", team: "Crew A · re-roof", teamColor: "#0066CC", location: "Bishopston, BS7", status: "tentative", weatherDep: true },
        { id: "f2", time: "08:00", durationMins: 300, kind: "install", title: "Calloway re-roof — day 2", detail: "Roof open — RAIN RISK", team: "Crew B · flat roof", teamColor: "#1E5277", location: "Bedminster, BS3", status: "tentative", weatherDep: true },
      ],
      Sat: [
        { id: "s1", time: "09:00", durationMins: 120, kind: "callout", title: "Emergency leak rota", detail: "On-call · Dan", team: "Repairs · Dan", teamColor: "#2E844A", location: "Citywide", status: "confirmed", weatherDep: false },
      ],
    },
  },

  customers: [
    {
      id: "probert", name: "Mr & Mrs Probert", email: "probert.home@gmail.com", phone: "+44 7700 904110", since: "Apr 2026", kind: "retail",
      lastJob: "Survey · 30 Apr 2026", nextJob: "Re-roof · 26–30 May", pm: "Gary Mercer", totalSpend: "£3,200", outstanding: "£1,960",
      source: "Website", hubspotStage: "Customer", industry: "Retail customer · BS7 · full re-roof",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1240, 1960], daysToPay: [],
      channelMix: [{ channel: "Email", count: 9, color: "#0066CC" }, { channel: "Web form", count: 1, color: "#2E844A" }],
      aging: { current: 0, d30: 1960, d60: 0, d90: 0 },
      notes: ["Full concrete-tile re-roof.", "Job has roof open over the weekend — weather risk.", "Balance due on completion."],
      jobs: [
        { date: "26–30 May 2026", type: "Install", detail: "Re-roof · concrete tile", status: "upcoming" },
        { date: "30 Apr 2026", type: "Survey", detail: "Roof condition survey", status: "completed" },
      ],
      invoices: [{ number: "INV-6598", amount: "£1,960.00", date: "26 Apr 2026", status: "overdue", daysOverdue: 32 }],
      messages: [{ date: "Today", direction: "out", channel: "Email", subject: "Weather update · your re-roof", snippet: "Heads-up — heavy rain Friday means we'll cover up and finish Monday to protect the felt…" }],
    },
    {
      id: "bristol-property", name: "Bristol Property Co", email: "ap@bristolproperty.co.uk", phone: "0117 555 0140", since: "Jun 2024", kind: "trade",
      lastJob: "Communal roof repair · 15 Apr 2026", pm: "Gary Mercer", totalSpend: "£28,600", outstanding: "£2,840",
      source: "Direct call", hubspotStage: "Customer", industry: "Block management · communal roofs",
      monthlySpend: [0, 3200, 0, 2840, 0, 4600, 0, 0, 2840, 0, 0, 2840], daysToPay: [41, 38, 44, 40],
      channelMix: [{ channel: "Email", count: 18, color: "#0066CC" }, { channel: "HubSpot CRM", count: 4, color: "#8A5A12" }],
      aging: { current: 0, d30: 0, d60: 2840, d90: 0 },
      notes: ["Communal roof maintenance across blocks.", "Slow payer — chase at 30 days.", "Reactive repairs + planned works."],
      jobs: [{ date: "15 Apr 2026", type: "Install", detail: "Communal roof repair", status: "completed" }],
      invoices: [{ number: "INV-6610", amount: "£2,840.00", date: "15 Apr 2026", status: "overdue", daysOverdue: 41 }],
      messages: [{ date: "22 May", direction: "out", channel: "Email", subject: "Reminder · INV-6610", snippet: "Hi, nudge on the communal roof repair invoice…" }],
    },
    {
      id: "harding", name: "The Hardings", email: "harding.home@gmail.com", phone: "+44 7700 904221", since: "May 2026", kind: "retail",
      lastJob: "—", nextJob: "Storm-damage survey · 29 May 11:30", pm: "Gary Mercer", totalSpend: "£0", outstanding: "£0",
      source: "Website", hubspotStage: "Qualified lead", industry: "Retail · BS6 · insurance claim",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], daysToPay: [],
      channelMix: [{ channel: "Email", count: 4, color: "#0066CC" }],
      aging: { current: 0, d30: 0, d60: 0, d90: 0 },
      notes: ["Storm-damage insurance survey today.", "Quote QU-4120 (£6,800) to follow.", "Insurer wants photo report."],
      jobs: [{ date: "29 May 2026", type: "Survey", detail: "Storm-damage survey · insurance", status: "upcoming" }],
      invoices: [],
      messages: [{ date: "Today", direction: "in", channel: "Email", subject: "Storm damage — can you survey today?", snippet: "We lost tiles in the storm and the insurer needs a report — are you still coming today?" }],
    },
    {
      id: "doyle-bs7", name: "Mrs Doyle", email: "doyle.bs7@gmail.com", phone: "+44 7700 904552", since: "Mar 2026", kind: "retail",
      lastJob: "—", nextJob: "EPDM garage recover · 27–29 May", pm: "Gary Mercer", totalSpend: "£0", outstanding: "£1,480",
      source: "Word of mouth", hubspotStage: "Customer", industry: "Retail · BS7 · garage flat roof",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1480], daysToPay: [],
      channelMix: [{ channel: "Email", count: 6, color: "#0066CC" }, { channel: "Voicemail", count: 1, color: "#86868B" }],
      aging: { current: 1480, d30: 0, d60: 0, d90: 0 },
      notes: ["EPDM rubber recover on the garage.", "Balance due on completion (INV-6640)."],
      jobs: [{ date: "27–29 May 2026", type: "Install", detail: "EPDM garage recover", status: "upcoming" }],
      invoices: [{ number: "INV-6640", amount: "£1,480.00", date: "27 May 2026", status: "pending" }],
      messages: [{ date: "26 May", direction: "out", channel: "Email", subject: "Your garage roof · this week", snippet: "Hi Mrs Doyle, we'll be with you Tuesday for the EPDM recover, weather permitting…" }],
    },
  ],

  quoteTemplates: [
    {
      label: "Full re-roof — concrete tile", tag: "Re-roof",
      lines: [
        { id: "s1-1", desc: "Strip existing + dispose (skip)", qty: 1, unit: "job", unitPrice: 680.00 },
        { id: "s1-2", desc: "Breathable membrane + battens", qty: 1, unit: "job", unitPrice: 920.00 },
        { id: "s1-3", desc: "Concrete interlocking tiles (supply)", qty: 1, unit: "job", unitPrice: 1640.00 },
        { id: "s1-4", desc: "Dry ridge + verge system", qty: 1, unit: "job", unitPrice: 540.00 },
        { id: "s1-5", desc: "Labour · 2 roofers · 3 days", qty: 1, unit: "job", unitPrice: 1980.00 },
      ],
      notes: "Includes scaffold liaison, full strip, membrane, dry-fix ridge.\n10-year workmanship guarantee. Weather-dependent scheduling.\nValid 30 days.",
    },
    {
      label: "Flat-roof recover — EPDM", tag: "Flat roof",
      lines: [
        { id: "s2-1", desc: "Strip + insulation board", qty: 1, unit: "job", unitPrice: 620.00 },
        { id: "s2-2", desc: "EPDM membrane (single-ply) + adhesive", qty: 1, unit: "job", unitPrice: 740.00 },
        { id: "s2-3", desc: "Trims + drip edge", qty: 1, unit: "job", unitPrice: 220.00 },
        { id: "s2-4", desc: "Labour · 2 roofers · 1.5 days", qty: 1, unit: "job", unitPrice: 680.00 },
      ],
      notes: "20-year membrane warranty. Single dry day required.\nValid 30 days.",
    },
  ],

  products: {
    subtitleSuffix: "lines",
    poSupplier: "SIG Roofing",
    poDraftBlurb: "Claude has drafted PO-220 for the SIG tile and membrane lines needed for next week's re-roofs.",
    items: [
      { id: "p1", sku: "TILE-CONC-INT", name: "Concrete interlocking tile", category: "Tiles & slates", unit: "each", trade: "£0.96", retail: "£1.60", onHand: 220, reserved: 480, reorderAt: 400, leadTime: "Next day", supplier: "SIG Roofing", thumbBg: "linear-gradient(135deg,#8A8E92,#5A5E62)" },
      { id: "p2", sku: "SLATE-NAT-500", name: "Natural slate 500×250", category: "Tiles & slates", unit: "each", trade: "£1.80", retail: "£2.90", onHand: 120, reserved: 40, reorderAt: 80, leadTime: "3 working days", supplier: "SIG Roofing", thumbBg: "linear-gradient(135deg,#41464C,#22262B)" },
      { id: "p3", sku: "MEM-BREATH-50", name: "Breathable membrane roll 50m²", category: "Membranes & felt", unit: "roll", trade: "£42", retail: "£68", onHand: 4, reserved: 8, reorderAt: 6, leadTime: "Next day", supplier: "SIG Roofing", thumbBg: "linear-gradient(135deg,#3C4A55,#1E2730)" },
      { id: "p4", sku: "EPDM-MEM-1.2", name: "EPDM membrane 1.2mm (per m²)", category: "Membranes & felt", unit: "m²", trade: "£9.40", retail: "£15.50", onHand: 18, reserved: 24, reorderAt: 30, leadTime: "Next day", supplier: "SIG Roofing", thumbBg: "linear-gradient(135deg,#2A2E32,#141618)" },
      { id: "p5", sku: "BAT-TREAT-25", name: "Treated batten 25×50 (per m)", category: "Timber & battens", unit: "m", trade: "£0.62", retail: "£1.05", onHand: 480, reserved: 200, reorderAt: 300, leadTime: "Next day", supplier: "Jewson", thumbBg: "linear-gradient(135deg,#9A7F58,#6B5638)" },
      { id: "p6", sku: "RIDGE-DRY-3M", name: "Dry-fix ridge kit 3m", category: "Ridge & verge", unit: "kit", trade: "£28", retail: "£46", onHand: 6, reserved: 4, reorderAt: 6, leadTime: "Next day", supplier: "SIG Roofing", thumbBg: "linear-gradient(135deg,#7C8086,#4E5258)" },
      { id: "p7", sku: "GUT-PVC-BLK", name: "PVC guttering 4m (black)", category: "Rainwater goods", unit: "length", trade: "£8.20", retail: "£13.50", onHand: 22, reserved: 6, reorderAt: 14, leadTime: "Next day", supplier: "Jewson", thumbBg: "linear-gradient(135deg,#2C2F33,#141618)" },
      { id: "p8", sku: "FASCIA-WH-5M", name: "uPVC fascia board 5m (white)", category: "Rainwater goods", unit: "length", trade: "£18", retail: "£29", onHand: 9, reserved: 4, reorderAt: 8, leadTime: "Next day", supplier: "Jewson", thumbBg: "linear-gradient(135deg,#F4F5F6,#DCDFE2)" },
      { id: "p9", sku: "LEAD-FLASH-450", name: "Lead flashing code 4 (450mm)", category: "Flashings", unit: "m", trade: "£14", retail: "£23", onHand: 16, reserved: 8, reorderAt: 12, leadTime: "Next day", supplier: "SIG Roofing", thumbBg: "linear-gradient(135deg,#6E7378,#43474B)" },
      { id: "p10", sku: "VENT-TILE-CONC", name: "Concrete vent tile", category: "Ventilation", unit: "each", trade: "£12", retail: "£20", onHand: 8, reserved: 5, reorderAt: 8, leadTime: "Next day", supplier: "SIG Roofing", thumbBg: "linear-gradient(135deg,#83878B,#54585C)" },
    ],
  },

  compliance: {
    subtitle: "Next deadline in 5 days",
    intro: "VAT, working-at-height safety and the signed audit trail. Workbench keeps your scaffold and method statements current and files the routine returns.",
    hero: {
      pillLabel: "VAT · HMRC",
      urgentLabel: "Most urgent · in 5 days",
      title: "VAT return — Feb–Apr quarter",
      body: "Due Monday 3 June via the Government Gateway. Estimated liability £4,620.",
      pct: 86,
      pctLabel: "Return 86% prepared",
      pctNote: "awaiting 1 merchant statement",
      confirmLabel: "Submit to HMRC",
      successTitle: "VAT packet filed with HMRC",
      successSub: "Receipt 2026-VAT-#GG6610 · payment scheduled for 2 Jun",
      rows: [
        { label: "Box 1 — VAT due on sales", value: "£7,120.00", ok: true },
        { label: "Box 4 — VAT reclaimed on purchases", value: "£2,500.00", ok: true },
        { label: "Box 5 — Net VAT to pay", value: "£4,620.00", ok: true },
        { label: "SIG April statement", value: "Awaiting", ok: false },
      ],
    },
    legend: [
      { color: "#8A5A12", label: "Tax & payroll" },
      { color: "#9A2D24", label: "Working at height" },
      { color: "#1E5277", label: "Scaffold / access" },
      { color: "#727680", label: "Insurance" },
      { color: "#2E844A", label: "Data / GDPR" },
    ],
    deadlines: [
      { key: "rams", dot: "#9A2D24", title: "RAMS — Calloway re-roof", desc: "Working-at-height risk assessment", progress: "Drafted from last re-roof · awaiting sign-off", pillCls: "pill-warn", pillTxt: "in 3 days", when: "Wed 28 May", actionLabel: "Review RAMS", actionType: "secondary",
        detail: { intro: "Working-at-height RAMS for the Bedminster re-roof.", rows: [{ label: "Access", value: "Full scaffold + edge protection" }, { label: "Key hazards", value: "Falls, dropped materials, weather" }, { label: "Weather", value: "Rain Fri–Sat — stop policy" }], confirmLabel: "Sign off RAMS", successTitle: "RAMS signed off", successSub: "Site copy issued to Crew B" } },
      { key: "scaffold", dot: "#1E5277", title: "Scaffold inspection (7-day)", desc: "Statutory weekly handover inspection", progress: "Probert scaffold due re-inspection Fri", pillCls: "pill-soft", pillTxt: "in 2 days", when: "Fri 30 May", actionLabel: "Log inspection", actionType: "secondary",
        detail: { intro: "Scaffolds in use require a documented inspection every 7 days.", rows: [{ label: "Probert (Bishopston)", value: "due 30 May", ok: false }, { label: "Calloway (Bedminster)", value: "due 4 Jun", ok: true }], confirmLabel: "Log inspection", successTitle: "Inspection logged", successSub: "Handover record filed with photo" } },
      { key: "vat", dot: "#8A5A12", title: "VAT return — Feb–Apr", desc: "Due to HMRC via Government Gateway", progress: "Return 86% prepared", pillCls: "pill-soft", pillTxt: "in 5 days", when: "Mon 3 Jun", actionLabel: "Open draft", actionType: "secondary",
        detail: { rows: [{ label: "Box 5 — Net VAT", value: "£4,620" }], confirmLabel: "Submit to HMRC", successTitle: "VAT filed", successSub: "Receipt logged · payment scheduled" } },
      { key: "insurance", dot: "#727680", title: "Public liability insurance", desc: "Annual renewal · £5m cover (height work)", progress: "3 quotes gathered · 1 cheaper", pillCls: "pill-soft", pillTxt: "in 31 days", when: "Mon 29 Jun", actionLabel: "Compare quotes", actionType: "secondary",
        detail: { intro: "Cover ends 29 Jun. Working-at-height loading applies.", rows: [{ label: "Current", value: "£1,840/yr" }, { label: "Alternative", value: "£1,680/yr" }], confirmLabel: "Bind cheapest", successTitle: "Renewal switched", successSub: "Bound · certificate emailed" } },
      { key: "ropa", dot: "#2E844A", title: "GDPR · RoPA review", desc: "Quarterly record of processing review", progress: "5 connectors · none changed", pillCls: "pill-soft", pillTxt: "in 33 days", when: "Tue 1 Jul", actionLabel: "Review diff", actionType: "ghost",
        detail: { intro: "No connector scope changes.", rows: [{ label: "Connectors", value: "5" }], confirmLabel: "Sign off RoPA", successTitle: "RoPA signed off", successSub: "Next due 1 Oct" } },
    ],
    connectors: [
      { initials: "Xe", name: "Xero", by: "Gary Mercer", scopes: "invoices.read, contacts.write, transactions.read", last: "8 mins ago", status: "Active", statusCls: "pill-ok", iconBg: "#E7EFF5", iconFg: "#1E5277" },
      { initials: "Ze", name: "Zettle", by: "Gary Mercer", scopes: "transactions.read", last: "just now", status: "Active", statusCls: "pill-ok", iconBg: "#E6F2EB", iconFg: "#2E844A" },
      { initials: "HM", name: "HMRC gateway", by: "Gary Mercer", scopes: "vat.submit, paye.submit", last: "today 02:07", status: "Active", statusCls: "pill-ok", iconBg: "#F5EAD6", iconFg: "#8A5A12" },
      { initials: "Wx", name: "Met Office DataPoint", by: "Gary Mercer", scopes: "forecast.read", last: "today 05:00", status: "Active", statusCls: "pill-ok", iconBg: "#EEEDE7", iconFg: "#191C21" },
      { initials: "Gm", name: "Gmail (info@)", by: "Gary Mercer", scopes: "mail.read, mail.send (draft only)", last: "just now", status: "Active", statusCls: "pill-ok", iconBg: "#EEEDE7", iconFg: "#191C21" },
    ],
    audit: [
      { time: "05:10", event: "Flagged", detail: "2 weather-dependent jobs at risk Fri–Sat (90% rain)", ref: "#wx-88", actor: "weather monitor", pillCls: "pill-warn", pillTxt: "waiting" },
      { time: "05:00", event: "Fetched", detail: "7-day Met Office forecast · BS postcodes", ref: "", actor: "scheduled run", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "02:09", event: "Reconciled", detail: "198 of 202 bank transactions · 4 flagged", ref: "", actor: "overnight run", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "yest. 16:00", event: "Sent", detail: "Bristol Property repair reminder · £2,840", ref: "#a-6610", actor: "approved by Gary", pillCls: "pill-ok", pillTxt: "ok" },
    ],
    csvName: "summit-gdpr-audit.csv",
  },

  inbox: [
    { id: "i1", sender: "Mr & Mrs Probert", initials: "PB", channel: "Email", kind: "retail", unread: true, time: "07:50", status: "active", subject: "Rain forecast — is our roof OK?", preview: "We've seen the weekend forecast — will the roof be watertight if it rains?", body: "Hi Gary,\n\nWe've seen heavy rain is forecast for the weekend. Our roof's half off — will it be watertight if it pours? We're a bit worried about the ceilings.\n\nThanks,\nThe Proberts", draft: "Hi both,\n\nGood timing — I was about to call. You're right that Friday looks wet, so here's the plan: the lads will get the membrane and battens fully on by Thursday evening so the roof is completely watertight before any rain, then we'll finish the tiling Monday once it's dry. Your ceilings are safe — the breathable membrane is the waterproof layer.\n\nI'll text you Thursday afternoon to confirm.\n\nGary — Summit Roofing", sources: ["Met Office · Fri 90% rain", "Job · Probert re-roof", "Method · membrane before tiling"] },
    { id: "i2", sender: "The Hardings", initials: "HD", channel: "Email", kind: "retail", unread: true, time: "07:42", status: "active", subject: "Storm damage — survey today?", preview: "We lost tiles in the storm and the insurer needs a report — still coming today?", body: "Hi,\n\nWe lost several tiles in last week's storm and there's a damp patch appearing. The insurer needs a report with photos. Are you still able to survey today?\n\nThanks,\nThe Hardings", draft: "Hi,\n\nYes — I've got Lee booked to you at 11:30 today. He'll do a full photo survey, note the storm damage and write it up in the format insurers expect, including a repair quote. We do a lot of insurance work so we'll make the claim side as painless as possible.\n\nSee you at 11:30,\nGary", sources: ["Survey diary · 11:30", "Insurance report template", "Quote QU-4120 · pending"] },
    { id: "i3", sender: "Website enquiry", initials: "WE", channel: "Web form", kind: "retail", unread: true, time: "07:30", status: "active", subject: "Moss + slipped tiles quote", preview: "Lots of moss and a couple of slipped tiles — want a quote for a clean and repair.", body: "Form submission\n\nName: Peter Maddox\nEnquiry: Roof's covered in moss and there are a couple of slipped tiles. Want a quote for a moss clean and repair. Semi-detached, BS9.\nPreferred contact: phone.", draft: "Hi Peter,\n\nHappy to help. A moss treatment plus re-bedding a few slipped tiles is usually a half-day job, typically £280–£420 depending on access and how many tiles. I'd rather quote firm after a quick look — I can send Dan to assess on his way through BS9 this week, no charge for the look. What number's best?\n\nGary", sources: ["Repair pricing · moss + tiles", "Survey diary · BS9", "Repairs · Dan"] },
    { id: "i4", sender: "Bristol Property Co", initials: "BP", channel: "Email", kind: "trade", unread: true, time: "yesterday", status: "active", subject: "Re: INV-6610 reminder", preview: "Sorry — held up in our approvals. Will be paid by end of next week.", body: "Hi Gary,\n\nApologies on INV-6610 — it's stuck in our approvals queue as usual. It'll be paid by end of next week. We've also got two more communal roofs to look at, I'll send details.\n\nRegards,\nBristol Property Co", draft: null, sources: [] },
    { id: "i5", sender: "Mrs Doyle", initials: "MD", channel: "Voicemail", kind: "retail", unread: true, time: "yesterday", status: "active", subject: "Voicemail · garage roof timing", preview: "\"Just checking you're still coming Tuesday for the garage roof?\"", body: "Transcribed automatically:\n\n\"Hi Gary, it's Mrs Doyle. Just checking you're still able to come Tuesday for the garage roof? The weather looks alright early in the week. Let me know, thanks.\"\n\nLength 00:14 · confidence high", draft: "Hi Mrs Doyle,\n\nYes — Tuesday's still on, and the early-week weather's in our favour so we'll get the EPDM down in one clean run. The crew will be with you for about 8:30. It's a day-and-a-half job so we'll be wrapped by Wednesday lunchtime.\n\nGary", sources: ["Job · Doyle EPDM", "Met Office · Tue dry", "Calendar · 27 May"] },
    { id: "i6", sender: "HMRC", initials: "HM", channel: "Email", kind: "supplier", unread: false, time: "yesterday", status: "active", subject: "VAT return reminder · Feb–Apr", preview: "Your VAT return for Feb–Apr 2026 is due by 3 June.", body: "Reminder · Your VAT return for the period 01 Feb – 30 Apr 2026 is due by 3 June 2026.\n\n— HMRC", draft: null, sources: [] },
    { id: "i7", sender: "SIG Roofing", initials: "SI", channel: "Email", kind: "supplier", unread: false, time: "yesterday", status: "active", subject: "Invoice 33110 — tiles + membrane", preview: "Invoice for concrete tiles + membrane against PO-218. £1,180, 30-day terms.", body: "Please find attached invoice 33110 for concrete tiles and breathable membrane delivered against PO-218. Amount £1,180.00, net 30 days.\n\nAccounts, SIG Roofing", draft: "Approve and route to Xero · matches PO-218 · code: Stock › Roofing › Tiles · 20% VAT recoverable · schedule for the Fri 30 May merchant batch.", sources: ["PO-218 · matched", "Xero code · Stock › Roofing", "Supplier terms · net 30"] },
    { id: "i8", sender: "Horfield Tennis Club", initials: "HT", channel: "Email", kind: "trade", unread: false, time: "2 days ago", status: "active", subject: "Clubhouse roof — go ahead?", preview: "Committee approved the flat-roof recover quote. When can you start?", body: "Hi Gary,\n\nThe committee approved your clubhouse flat-roof recover quote (QU-4108). When could you start? We'd like it done before the summer tournament in July.\n\nThanks,\nHorfield Tennis Club", draft: null, sources: [] },
  ],

  inboxDrafts: {
    i4: { draft: "Hi,\n\nNo problem, thanks for letting me know — end of next week is fine. And yes please, send over the two communal roofs whenever suits and I'll get surveys booked. Always happy to take on more of your blocks.\n\nGary", sources: ["Invoice INV-6610", "Account · Bristol Property", "Survey availability"] },
    i8: { draft: "Hi,\n\nGreat news — thanks for confirming. To beat the July tournament I can start w/c 16 June, which gives a comfortable buffer. It's a 2–3 day job weather permitting, and I'll pick a dry window so the membrane goes down in one go. Shall I pencil that in and send the start-date confirmation?\n\nGary", sources: ["Quote QU-4108", "Calendar · w/c 16 Jun", "Method · EPDM dry day"] },
  },

  approvals: [
    {
      id: "weather-reschedule", workflowTag: "Weather reschedule", category: "comms", meta: "drafted 05:15 · Met Office 7-day forecast",
      headline: "Move 2 open-roof jobs off the wet weekend — tell customers now",
      detail: "Friday–Saturday show 90% rain. Both jobs have the roof open. Plan gets each watertight before the rain and finishes early next week. Two reassuring customer messages.",
      lineItems: [
        { primary: "Probert re-roof (Bishopston)", detail: "Membrane on by Thu, tile Mon", value: "Fri → Mon", caption: "90% rain", tag: "Re-roof" },
        { primary: "Calloway re-roof (Bedminster)", detail: "Cover up Wed, resume Tue", value: "Fri → Tue", caption: "90% rain", tag: "Re-roof" },
      ],
      openLabel: "Edit messages", approveLabel: "Send both", approveIcon: "send", status: "pending",
    },
    { id: "harding-survey-reply", workflowTag: "Customer reply", category: "reply", meta: "drafted 07:43 · The Hardings", headline: "Confirm today's storm-damage survey to The Hardings", detail: "Confirms Lee's 11:30 visit, explains the insurer-format photo report and that the claim side is handled.", openLabel: "Open thread", approveLabel: "Send reply", approveIcon: "send", status: "pending" },
    {
      id: "po-220", workflowTag: "Purchase order", category: "po", meta: "tile + membrane cover drops below next week's re-roofs",
      headline: "Raise PO-220 to SIG Roofing — £648",
      detail: "Tops up tiles and membrane before the Probert and Calloway re-roofs. Next-day slot fits.",
      lineItems: [
        { primary: "Concrete interlocking tile", detail: "300", stockNote: "on hand 220 · reserved 480", value: "£288" },
        { primary: "Breathable membrane roll 50m²", detail: "6", stockNote: "on hand 4 · reserved 8", value: "£252" },
        { primary: "Dry-fix ridge kit 3m", detail: "4", stockNote: "on hand 6 · reserved 4", value: "£112" },
      ],
      openLabel: "Adjust", approveLabel: "Raise PO", approveIcon: "check", status: "pending",
    },
    { id: "recon-flags", workflowTag: "Reconciliation", category: "finance", meta: "overnight run · 02:09", headline: "4 unmatched bank lines need review", detail: "2× Zettle card fees (£2.40 each), 1 SIG refund (£38.00), 1 unknown transfer (£150.00). 198 of 202 matched automatically.", openLabel: "View", approveLabel: "Mark resolved", approveIcon: "check", status: "pending" },
  ],

  chase: [
    { id: "ch1", customer: "Bristol Property Co", invoiceRef: "INV-6610", amount: "£2,840", reason: "Communal repair · 41 days overdue", addedHoursAgo: 26, source: "money-overdue", status: "sent" },
    { id: "ch2", customer: "Mr & Mrs Probert", invoiceRef: "INV-6598", amount: "£1,960", reason: "Re-roof balance · 32 days overdue", addedHoursAgo: 50, source: "money-overdue", status: "pending" },
  ],

  weather: {
    intro:
      "Roofing lives and dies by the weather. Workbench pulls the Met Office 7-day forecast every morning, flags jobs that need a dry day, and drafts the customer messages to move them — so you tell the customer before they ring you.",
    forecast: [
      { day: "Thu", date: "29 May", condition: "Sunny spells", tempC: 18, windMph: 9, rainPct: 10, suitable: true },
      { day: "Fri", date: "30 May", condition: "Heavy rain", tempC: 14, windMph: 22, rainPct: 90, suitable: false },
      { day: "Sat", date: "31 May", condition: "Heavy rain", tempC: 13, windMph: 26, rainPct: 88, suitable: false },
      { day: "Sun", date: "1 Jun", condition: "Showers", tempC: 15, windMph: 18, rainPct: 55, suitable: false },
      { day: "Mon", date: "2 Jun", condition: "Cloudy, dry", tempC: 17, windMph: 11, rainPct: 20, suitable: true },
      { day: "Tue", date: "3 Jun", condition: "Sunny", tempC: 20, windMph: 8, rainPct: 5, suitable: true },
      { day: "Wed", date: "4 Jun", condition: "Sunny", tempC: 21, windMph: 7, rainPct: 5, suitable: true },
    ],
    jobs: [
      { title: "Probert re-roof — day 3 (tiling)", customer: "Mr & Mrs Probert", needsDry: true, scheduled: "Fri 30 May", suggestion: "Membrane watertight Thu, tile Mon 2 Jun", action: "move" },
      { title: "Calloway re-roof — day 2 (roof open)", customer: "Calloway", needsDry: true, scheduled: "Fri 30 May", suggestion: "Cover Wed, resume Tue 3 Jun", action: "move" },
      { title: "Gutter & fascia repair", customer: "Mr Singh", needsDry: true, scheduled: "Thu 29 May", suggestion: "Today is dry — keep as planned", action: "ok" },
      { title: "Storm-damage survey", customer: "The Hardings", needsDry: false, scheduled: "Thu 29 May", suggestion: "Survey only — weather not a blocker", action: "ok" },
      { title: "EPDM garage recover", customer: "Mrs Doyle", needsDry: true, scheduled: "Tue 27–Thu 29", suggestion: "Early-week dry window — keep", action: "ok" },
    ],
  },
};
