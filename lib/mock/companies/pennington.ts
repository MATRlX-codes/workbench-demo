// lib/mock/companies/pennington.ts
// Pennington Joinery — site-survey checklist + variation-order workflow (report 3.2).

import type { CompanyProfile } from "./types";

export const pennington: CompanyProfile = {
  id: "pennington",
  name: "Pennington Joinery",
  shortName: "Pennington",
  initials: "P",
  trade: "Bespoke joinery & carpentry",
  tradeShort: "Joinery · York",
  ownerName: "Will Pennington",
  ownerFirst: "Will",
  ownerInitials: "WP",
  features: ["site-survey", "variation-orders", "cashflow-forecast", "quote-shelf-life", "auto-review"],
  overnightNote: "Logged 2 site surveys, raised 1 variation order, reconciled the bank, drafted 3 replies.",

  today: {
    date: "Thursday, 29 May",
    greetingName: "Will",
    greetingLine:
      "Five things need a yes. A £980 variation on the Aldridge staircase is ready to send, and yesterday's survey threw up an out-of-square wall that changes the fitted-wardrobe quote.",
    diarySubtitle: "4 jobs · a fit, two surveys and a workshop day",
    stats: [
      { label: "Cash on hand", value: "£29,400", delta: "+£1,180", sub: "vs last Thu" },
      { label: "Variations open", value: "£2,640", sub: "3 awaiting customer sign-off" },
      { label: "Due in this week", value: "£9,200", sub: "6 invoices · 2 overdue" },
      { label: "Approvals waiting", value: "5", sub: "oldest queued 24m ago", accent: true },
    ],
    diary: [
      { id: "d1", time: "08:30", title: "Fit — fitted wardrobes", detail: "Day 2 · Mrs Crcompton", location: "Fulford, YO10", status: "confirmed", statusPill: "ok" },
      { id: "d2", time: "10:30", title: "Site survey — staircase", detail: "Oak open-tread · with Will", location: "Bishopthorpe, YO23", status: "unconfirmed", customer: "The Aldridges", email: "aldridge.home@gmail.com", phone: "+44 7700 905221" },
      { id: "d3", time: "13:00", title: "Workshop day", detail: "Door & frame machining", location: "Workshop", status: "booked", statusPill: "info" },
      { id: "d4", time: "15:00", title: "Site survey — alcove units", detail: "Living room · with Joe", location: "Heworth, YO31", status: "unconfirmed", customer: "Mr Brookes", email: "d.brookes@gmail.com", phone: "+44 7700 905778" },
    ],
    risk: {
      title: "Crompton wardrobe wall is 22mm out of square — scribe time wasn't quoted",
      body:
        "Yesterday's survey found the back wall out by 22mm over 2.4m. Fitting square will need an extra half-day of scribing and a filler panel. Raise a variation now so it's signed before the fit finishes — don't absorb it. Open Variations.",
      customer: "Crompton wardrobes",
    },
  },

  money: {
    subtitle: "GBP · 2 connected accounts",
    cashOnHand: "£29,400",
    cashDeltaPct: "+4.2%",
    in7: "+£9,200",
    in7Count: "6 invoices",
    out7: "−£6,800",
    out7Detail: "payroll, timber merchant, workshop rent",
    cashflowDays: [
      { label: "29 Apr", in: 1800, out: 1200 }, { label: "30 Apr", in: 900, out: 1900 },
      { label: "1 May", in: 2600, out: 700 }, { label: "2 May", in: 1500, out: 3100 },
      { label: "5 May", in: 2200, out: 1100 }, { label: "6 May", in: 800, out: 1300 },
      { label: "7 May", in: 1700, out: 820 }, { label: "8 May", in: 2100, out: 760 },
      { label: "9 May", in: 2800, out: 2300 }, { label: "12 May", in: 1000, out: 1500 },
      { label: "13 May", in: 3400, out: 1000 }, { label: "14 May", in: 1400, out: 2100 },
      { label: "15 May", in: 2400, out: 680 }, { label: "16 May", in: 900, out: 3200 },
      { label: "19 May", in: 2600, out: 1300 }, { label: "20 May", in: 1600, out: 980 },
      { label: "21 May", in: 3200, out: 1600 }, { label: "22 May", in: 1200, out: 820 },
      { label: "23 May", in: 1900, out: 3400 }, { label: "26 May", in: 2900, out: 1200 },
      { label: "27 May", in: 1400, out: 1900 }, { label: "28 May", in: 2300, out: 1300 },
      { label: "29 May", in: 3300, out: 1500 },
    ],
    overdue30: [
      { id: "r1", name: "Ebor Interiors", email: "accounts@eborinteriors.co.uk", ref: "INV-9210 · fitted study (contract)", amount: "£2,640.00", age: "38 days", pill: "bad", chaseNote: "Last chase 6 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 38 },
      { id: "r2", name: "Mr & Mrs Aldridge", email: "aldridge.home@gmail.com", ref: "INV-9198 · staircase deposit balance", amount: "£1,180.00", age: "31 days", pill: "bad", chaseNote: "Last chase 3 days ago", actionLabel: "Chase politely", primary: true, daysOverdue: 31 },
    ],
    overdue30Sub: "2 invoices · £3,820 outstanding",
    overdue730: [
      { id: "r3", name: "Mrs Crompton", email: "crompton.home@gmail.com", ref: "INV-9231 · wardrobe deposit", amount: "£640.00", age: "10 days", pill: "warn", chaseNote: "No chase yet", actionLabel: "Send reminder", daysOverdue: 10 },
      { id: "r4", name: "The Snug Bar", email: "hello@thesnugbar.uk", ref: "INV-9224 · bar-top + shelving", amount: "£420.00", age: "13 days", pill: "warn", chaseNote: "Last chase 4 days ago", actionLabel: "Send reminder", daysOverdue: 13 },
    ],
    overdue730Sub: "2 invoices · £1,060 outstanding",
    dueWeek: [
      { name: "Mrs Crompton", email: "crompton.home@gmail.com", ref: "INV-9240 · wardrobe balance", amount: "£1,820.00", due: "due Fri 30 May" },
      { name: "Ebor Interiors", email: "accounts@eborinteriors.co.uk", ref: "INV-9238 · alcove units", amount: "£1,260.00", due: "due Sat 31 May" },
    ],
    dueWeekSub: "2 invoices · £3,080 expected",
    mismatches: [
      { id: "m1", desc: "SumUp card fee", amount: -1.60, date: "28 May", action: "Match to merchant fees" },
      { id: "m2", desc: "SumUp card fee", amount: -1.60, date: "27 May", action: "Match to merchant fees" },
      { id: "m3", desc: "Timber merchant refund", amount: 42.00, date: "26 May", action: "Mark as duplicate" },
      { id: "m4", desc: "Unknown transfer", amount: 110.00, date: "24 May", action: "Flag for review" },
    ],
    mismatchSummary: "Four bank lines couldn't be matched — SumUp card fees and one timber-merchant refund.",
    reconMatchedBase: 172,
    reconTotal: 176,
    reconFinished: "02:08",
    reconTook: "6 minutes",
    feesBreakdown: [
      { what: "SumUp card receipts (retail)", count: 58, value: 6240.00 },
      { what: "BACS in (contract interiors)", count: 28, value: 18400.00 },
      { what: "BACS out (timber: Arnold Laver/Travis)", count: 14, value: 6800.00 },
      { what: "Workshop rent & power", count: 6, value: 1640.00 },
      { what: "Merchant fees", count: 58, value: 168.00 },
      { what: "Refunds & adjustments", count: 4, value: -280.00 },
    ],
    csvName: "pennington-invoice-radar.csv",
    forecast: [
      { week: "wc 2 Jun", in: 10800, out: 6800 },
      { week: "wc 9 Jun", in: 8400, out: 7600 },
      { week: "wc 16 Jun", in: 12200, out: 6400 },
      { week: "wc 23 Jun", in: 6200, out: 9800 },
      { week: "wc 30 Jun", in: 10400, out: 6900 },
      { week: "wc 7 Jul", in: 11800, out: 6200 },
      { week: "wc 14 Jul", in: 7800, out: 8400 },
      { week: "wc 21 Jul", in: 12900, out: 6600 },
    ],
    forecastNote:
      "Bespoke work means cash follows fit dates. wc 23 Jun dips — the timber order and workshop rent land before the Ebor contract payment. Getting the Ebor and Aldridge invoices in protects it. Unsigned variations are also money sitting on the table.",
    staleQuotes: [
      { customer: "Mr Brookes", ref: "QU-7120", amount: "£3,400", ageDays: 15, sku: "Alcove units · painted MDF", move: "+3.4% since quote" },
      { customer: "The Snug Bar", ref: "QU-7108", amount: "£2,800", ageDays: 22, sku: "Solid oak bar top + shelving", move: "+5.1% since quote (oak)" },
    ],
  },

  calendar: {
    title: "Fits, surveys & workshop",
    weekRange: "26–31 May 2026",
    teams: {
      "Will · fit": "#0066CC",
      "Joe · fit": "#1E5277",
      "Workshop": "#8A5A12",
      "Survey": "#9A2D24",
      "Timber · goods-in": "#727680",
    },
    dayLabels: { Mon: "Mon 26 May", Tue: "Tue 27 May", Wed: "Wed 28 May", Thu: "Thu 29 May", Fri: "Fri 30 May", Sat: "Sat 31 May" },
    week: {
      Mon: [
        { id: "m1", time: "08:00", durationMins: 300, kind: "workshop", title: "Wardrobe carcasses", detail: "Crompton · machining", team: "Workshop", teamColor: "#8A5A12", location: "Workshop", status: "confirmed" },
        { id: "m2", time: "09:00", durationMins: 240, kind: "install", title: "Alcove units fit", detail: "Ebor contract · day 1", team: "Joe · fit", teamColor: "#1E5277", location: "York centre, YO1", status: "confirmed" },
      ],
      Tue: [
        { id: "t1", time: "08:30", durationMins: 300, kind: "install", title: "Crompton wardrobes — day 1", detail: "Set out + carcasses", team: "Will · fit", teamColor: "#0066CC", location: "Fulford, YO10", status: "confirmed" },
        { id: "t2", time: "13:00", durationMins: 120, kind: "survey", title: "Survey — staircase", detail: "Oak open-tread · Aldridge", team: "Survey", teamColor: "#9A2D24", location: "Bishopthorpe, YO23", status: "tentative" },
      ],
      Wed: [
        { id: "w1", time: "08:00", durationMins: 300, kind: "workshop", title: "Staircase components", detail: "Aldridge · machining", team: "Workshop", teamColor: "#8A5A12", location: "Workshop", status: "confirmed" },
        { id: "w2", time: "10:00", durationMins: 180, kind: "survey", title: "Survey — fitted wardrobes", detail: "Crompton (found out-of-square)", team: "Survey", teamColor: "#9A2D24", location: "Fulford, YO10", status: "confirmed" },
        { id: "w3", time: "15:00", durationMins: 45, kind: "delivery", title: "Arnold Laver delivery", detail: "Oak + MDF board", team: "Timber · goods-in", teamColor: "#727680", location: "Workshop · goods-in", status: "confirmed" },
      ],
      Thu: [
        { id: "th1", time: "08:30", durationMins: 300, kind: "install", title: "Crompton wardrobes — day 2", detail: "Fit + scribe (variation)", team: "Will · fit", teamColor: "#0066CC", location: "Fulford, YO10", status: "confirmed" },
        { id: "th2", time: "10:30", durationMins: 120, kind: "survey", title: "Site survey — staircase", detail: "Oak open-tread · with Will", team: "Survey", teamColor: "#9A2D24", location: "Bishopthorpe, YO23", status: "tentative" },
        { id: "th3", time: "13:00", durationMins: 240, kind: "workshop", title: "Door & frame machining", detail: "Stock + Brookes alcoves", team: "Workshop", teamColor: "#8A5A12", location: "Workshop", status: "confirmed" },
        { id: "th4", time: "15:00", durationMins: 90, kind: "survey", title: "Site survey — alcove units", detail: "Living room · with Joe", team: "Survey", teamColor: "#9A2D24", location: "Heworth, YO31", status: "tentative" },
      ],
      Fri: [
        { id: "f1", time: "08:30", durationMins: 300, kind: "install", title: "Crompton wardrobes — day 3", detail: "Doors + handover", team: "Will · fit", teamColor: "#0066CC", location: "Fulford, YO10", status: "confirmed" },
        { id: "f2", time: "09:00", durationMins: 240, kind: "install", title: "Alcove units fit", detail: "Ebor contract · day 2", team: "Joe · fit", teamColor: "#1E5277", location: "York centre, YO1", status: "confirmed" },
      ],
      Sat: [
        { id: "s1", time: "10:00", durationMins: 120, kind: "workshop", title: "Workshop catch-up", detail: "Finishing · oil & wax", team: "Workshop", teamColor: "#8A5A12", location: "Workshop", status: "confirmed" },
      ],
    },
  },

  customers: [
    {
      id: "crompton", name: "Mrs Crompton", email: "crompton.home@gmail.com", phone: "+44 7700 905110", since: "Apr 2026", kind: "retail",
      lastJob: "Survey · 28 May 2026", nextJob: "Wardrobe fit · 27–29 May", pm: "Will Pennington", totalSpend: "£640", outstanding: "£2,460",
      source: "Website", hubspotStage: "Customer", industry: "Retail customer · YO10 · fitted wardrobes",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 640], daysToPay: [],
      channelMix: [{ channel: "Email", count: 8, color: "#0066CC" }, { channel: "Web form", count: 1, color: "#2E844A" }],
      aging: { current: 1820, d30: 640, d60: 0, d90: 0 },
      notes: ["Fitted wardrobes · floor-to-ceiling.", "Survey found back wall 22mm out of square.", "Variation needed for scribing + filler."],
      jobs: [
        { date: "27–29 May 2026", type: "Install", detail: "Fitted wardrobe fit", status: "upcoming" },
        { date: "28 May 2026", type: "Survey", detail: "Pre-fit site survey", status: "completed" },
      ],
      invoices: [
        { number: "INV-9240", amount: "£1,820.00", date: "27 May 2026", status: "pending" },
        { number: "INV-9231", amount: "£640.00", date: "18 May 2026", status: "overdue", daysOverdue: 10 },
      ],
      messages: [{ date: "Today", direction: "out", channel: "Email", subject: "Small change to your wardrobes", snippet: "Quick one — the back wall's a touch out of square, here's a small variation to fit it perfectly…" }],
    },
    {
      id: "aldridge", name: "Mr & Mrs Aldridge", email: "aldridge.home@gmail.com", phone: "+44 7700 905221", since: "Mar 2026", kind: "retail",
      lastJob: "Deposit taken · 18 Apr 2026", nextJob: "Staircase survey · 29 May 10:30", pm: "Will Pennington", totalSpend: "£1,400", outstanding: "£1,180",
      source: "Word of mouth", hubspotStage: "Customer", industry: "Retail · YO23 · oak staircase",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1400, 0], daysToPay: [],
      channelMix: [{ channel: "Email", count: 7, color: "#0066CC" }],
      aging: { current: 0, d30: 1180, d60: 0, d90: 0 },
      notes: ["Bespoke oak open-tread staircase.", "Variation VO-204 raised (£980) for extra newel detail.", "Survey today to finalise dimensions."],
      jobs: [
        { date: "29 May 2026", type: "Survey", detail: "Staircase site survey", status: "upcoming" },
        { date: "18 Apr 2026", type: "Design", detail: "Deposit + design sign-off", status: "completed" },
      ],
      invoices: [{ number: "INV-9198", amount: "£1,180.00", date: "28 Apr 2026", status: "overdue", daysOverdue: 31 }],
      messages: [{ date: "Today", direction: "in", channel: "Email", subject: "Survey today + newel question", snippet: "See you at 10:30 — and yes, we'd love the chunkier newel post we discussed…" }],
    },
    {
      id: "ebor", name: "Ebor Interiors", email: "accounts@eborinteriors.co.uk", phone: "01904 555 0140", since: "Sep 2024", kind: "trade",
      lastJob: "Fitted study · 20 Apr 2026", nextJob: "Alcove units · 26–30 May", pm: "Will Pennington", totalSpend: "£42,800", outstanding: "£2,640",
      source: "Trade show", hubspotStage: "Customer", industry: "Interior design studio · contract joinery",
      monthlySpend: [0, 3200, 0, 2640, 0, 4200, 0, 0, 3800, 0, 2640, 1260], daysToPay: [38, 35, 41, 36],
      channelMix: [{ channel: "Email", count: 24, color: "#0066CC" }, { channel: "HubSpot CRM", count: 6, color: "#8A5A12" }],
      aging: { current: 0, d30: 0, d60: 2640, d90: 0 },
      notes: ["#1 account · contract joinery for interior designers.", "Pays at ~38 days — chase early.", "Frequent variations on spec changes."],
      jobs: [
        { date: "26–30 May 2026", type: "Install", detail: "Alcove units · contract", status: "upcoming" },
        { date: "20 Apr 2026", type: "Install", detail: "Fitted study", status: "completed" },
      ],
      invoices: [
        { number: "INV-9210", amount: "£2,640.00", date: "20 Apr 2026", status: "overdue", daysOverdue: 38 },
        { number: "INV-9238", amount: "£1,260.00", date: "26 May 2026", status: "pending" },
      ],
      messages: [{ date: "23 May", direction: "out", channel: "Email", subject: "Reminder · INV-9210", snippet: "Hi, nudge on the fitted-study invoice…" }],
    },
    {
      id: "brookes", name: "Mr Brookes", email: "d.brookes@gmail.com", phone: "+44 7700 905778", since: "May 2026", kind: "retail",
      lastJob: "—", nextJob: "Alcove survey · 29 May 15:00", pm: "Joe Pennington", totalSpend: "£0", outstanding: "£0",
      source: "Website", hubspotStage: "Proposal sent", industry: "Retail lead · YO31 · alcove units",
      monthlySpend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], daysToPay: [],
      channelMix: [{ channel: "Email", count: 4, color: "#0066CC" }],
      aging: { current: 0, d30: 0, d60: 0, d90: 0 },
      notes: ["Living-room alcove units · painted MDF.", "Survey today.", "Quote QU-7120 (£3,400) going stale."],
      jobs: [{ date: "29 May 2026", type: "Survey", detail: "Alcove units site survey · with Joe", status: "upcoming" }],
      invoices: [],
      messages: [{ date: "Today", direction: "in", channel: "Email", subject: "Alcove units — survey today", snippet: "Looking forward to the survey — the chimney breast's a bit wonky so worth measuring carefully…" }],
    },
  ],

  quoteTemplates: [
    {
      label: "Fitted wardrobes — supply & fit", tag: "Fitted",
      lines: [
        { id: "p1-1", desc: "Carcasses + doors (painted MDF)", qty: 1, unit: "run", unitPrice: 1640.00 },
        { id: "p1-2", desc: "Internal fit-out (rails, shelves, drawers)", qty: 1, unit: "set", unitPrice: 480.00 },
        { id: "p1-3", desc: "Set out, scribe & fit · 3 days", qty: 1, unit: "job", unitPrice: 1080.00 },
        { id: "p1-4", desc: "Spray finish (workshop)", qty: 1, unit: "job", unitPrice: 360.00 },
      ],
      notes: "Bespoke floor-to-ceiling fitted wardrobes, sprayed to any RAL.\nScribing to out-of-square walls quoted after survey (variation).\n40% deposit on order. Valid 30 days.",
    },
    {
      label: "Bespoke staircase — oak", tag: "Staircase",
      lines: [
        { id: "p2-1", desc: "Oak open-tread staircase (supply)", qty: 1, unit: "unit", unitPrice: 3200.00 },
        { id: "p2-2", desc: "Handrail + glass balustrade", qty: 1, unit: "set", unitPrice: 1100.00 },
        { id: "p2-3", desc: "Workshop machining & finishing", qty: 1, unit: "job", unitPrice: 900.00 },
        { id: "p2-4", desc: "Site survey, install & make-good · 2 days", qty: 1, unit: "job", unitPrice: 1240.00 },
      ],
      notes: "Made to survey dimensions, oiled finish.\nBuilding Regs compliant (rise/going, balustrade gaps).\n50% deposit. Variations for design changes raised separately.",
    },
  ],

  products: {
    subtitleSuffix: "lines",
    poSupplier: "Arnold Laver",
    poDraftBlurb: "Claude has drafted PO-118 for the oak and board lines needed for the Aldridge staircase and Brookes alcoves.",
    items: [
      { id: "p1", sku: "OAK-EU-PAR", name: "European oak (PAR) per m", category: "Hardwood", unit: "m", trade: "£14.20", retail: "£23.00", onHand: 64, reserved: 90, reorderAt: 80, leadTime: "2 working days", supplier: "Arnold Laver", thumbBg: "linear-gradient(135deg,#C8A878,#9A7A4C)" },
      { id: "p2", sku: "OAK-STAIR-TREAD", name: "Oak stair tread (40mm)", category: "Hardwood", unit: "each", trade: "£32", retail: "£52", onHand: 6, reserved: 14, reorderAt: 12, leadTime: "3 working days", supplier: "Arnold Laver", thumbBg: "linear-gradient(135deg,#BF9E6E,#8E6E42)" },
      { id: "p3", sku: "MDF-MR-18", name: "MR MDF 18mm (8×4)", category: "Sheet material", unit: "sheet", trade: "£28", retail: "£46", onHand: 14, reserved: 22, reorderAt: 20, leadTime: "Next day", supplier: "Travis Perkins", thumbBg: "linear-gradient(135deg,#C7B79C,#9C8A6C)" },
      { id: "p4", sku: "MDF-MR-12", name: "MR MDF 12mm (8×4)", category: "Sheet material", unit: "sheet", trade: "£22", retail: "£36", onHand: 18, reserved: 8, reorderAt: 16, leadTime: "Next day", supplier: "Travis Perkins", thumbBg: "linear-gradient(135deg,#CCBDA2,#A2906F)" },
      { id: "p5", sku: "PLY-BIRCH-18", name: "Birch ply 18mm (8×4)", category: "Sheet material", unit: "sheet", trade: "£48", retail: "£74", onHand: 9, reserved: 6, reorderAt: 10, leadTime: "2 working days", supplier: "Arnold Laver", thumbBg: "linear-gradient(135deg,#E0CFA8,#B6A074)" },
      { id: "p6", sku: "HNG-SOFT-BLM", name: "Soft-close hinge (Blum)", category: "Ironmongery", unit: "each", trade: "£2.40", retail: "£4.20", onHand: 88, reserved: 40, reorderAt: 60, leadTime: "Next day", supplier: "Häfele", thumbBg: "linear-gradient(135deg,#D7DBDF,#ABB2B9)" },
      { id: "p7", sku: "RUN-DRWR-500", name: "Drawer runner 500mm (Blum)", category: "Ironmongery", unit: "pair", trade: "£8.60", retail: "£14.50", onHand: 24, reserved: 18, reorderAt: 20, leadTime: "Next day", supplier: "Häfele", thumbBg: "linear-gradient(135deg,#D2D6DA,#A6ADB4)" },
      { id: "p8", sku: "GLU-PVA-5L", name: "PVA wood adhesive 5L", category: "Adhesives & finishes", unit: "tub", trade: "£11", retail: "£18", onHand: 6, reserved: 4, reorderAt: 6, leadTime: "Next day", supplier: "Travis Perkins", thumbBg: "linear-gradient(135deg,#E8E4DB,#C6C0B2)" },
      { id: "p9", sku: "OIL-HARDWAX-2.5", name: "Hardwax oil 2.5L (clear)", category: "Adhesives & finishes", unit: "tin", trade: "£34", retail: "£54", onHand: 4, reserved: 5, reorderAt: 6, leadTime: "2 working days", supplier: "Häfele", thumbBg: "linear-gradient(135deg,#C9A96E,#9C7E48)" },
      { id: "p10", sku: "PNT-PRIME-5L", name: "MDF primer/undercoat 5L", category: "Adhesives & finishes", unit: "tin", trade: "£26", retail: "£42", onHand: 5, reserved: 6, reorderAt: 6, leadTime: "Next day", supplier: "Travis Perkins", thumbBg: "linear-gradient(135deg,#EEEDEA,#D2D0C9)" },
    ],
  },

  compliance: {
    subtitle: "Next deadline in 5 days",
    intro: "VAT, workshop safety and the signed audit trail. Workbench keeps your dust-extraction and machine records current and files the routine returns.",
    hero: {
      pillLabel: "VAT · HMRC",
      urgentLabel: "Most urgent · in 5 days",
      title: "VAT return — Feb–Apr quarter",
      body: "Due Monday 3 June via the Government Gateway. Estimated liability £3,940.",
      pct: 90,
      pctLabel: "Return 90% prepared",
      pctNote: "awaiting 1 timber statement",
      confirmLabel: "Submit to HMRC",
      successTitle: "VAT packet filed with HMRC",
      successSub: "Receipt 2026-VAT-#GG9210 · payment scheduled for 2 Jun",
      rows: [
        { label: "Box 1 — VAT due on sales", value: "£6,440.00", ok: true },
        { label: "Box 4 — VAT reclaimed on purchases", value: "£2,500.00", ok: true },
        { label: "Box 5 — Net VAT to pay", value: "£3,940.00", ok: true },
        { label: "Arnold Laver April statement", value: "Awaiting", ok: false },
      ],
    },
    legend: [
      { color: "#8A5A12", label: "Tax & payroll" },
      { color: "#9A2D24", label: "Workshop safety" },
      { color: "#1E5277", label: "Contract / variations" },
      { color: "#727680", label: "Insurance" },
      { color: "#2E844A", label: "Data / GDPR" },
    ],
    deadlines: [
      { key: "leve", dot: "#9A2D24", title: "LEV (dust extraction) test", desc: "Statutory 14-month examination", progress: "Workshop extraction due re-test", pillCls: "pill-warn", pillTxt: "in 19 days", when: "Mon 16 Jun", actionLabel: "Book LEV test", actionType: "secondary",
        detail: { intro: "Local exhaust ventilation must be examined at least every 14 months (wood dust).", rows: [{ label: "System", value: "Workshop dust extraction" }, { label: "Last test", value: "Apr 2025" }], confirmLabel: "Book LEV test", successTitle: "LEV test booked", successSub: "Examiner booked · 12 Jun · certificate to follow" } },
      { key: "variations", dot: "#1E5277", title: "Unsigned variation orders", desc: "3 variations awaiting customer sign-off", progress: "£2,640 of agreed extras not yet signed", pillCls: "pill-bad", pillTxt: "act today", when: "Today", actionLabel: "Open variations", actionType: "secondary",
        detail: { intro: "Variations represent agreed extra work not yet signed — money on the table and disputes waiting to happen.", rows: [{ label: "Aldridge · newel detail", value: "£980", ok: false }, { label: "Crompton · scribe + filler", value: "£420", ok: false }, { label: "Ebor · spec change", value: "£1,240", ok: false }], confirmLabel: "Send for signature", successTitle: "Variations sent", successSub: "All 3 sent for e-signature · linked to their jobs" } },
      { key: "vat", dot: "#8A5A12", title: "VAT return — Feb–Apr", desc: "Due to HMRC via Government Gateway", progress: "Return 90% prepared", pillCls: "pill-soft", pillTxt: "in 5 days", when: "Mon 3 Jun", actionLabel: "Open draft", actionType: "secondary",
        detail: { rows: [{ label: "Box 5 — Net VAT", value: "£3,940" }], confirmLabel: "Submit to HMRC", successTitle: "VAT filed", successSub: "Receipt logged · payment scheduled" } },
      { key: "insurance", dot: "#727680", title: "Public liability + tools insurance", desc: "Annual renewal · £2m + tools cover", progress: "3 quotes gathered · 1 cheaper", pillCls: "pill-soft", pillTxt: "in 28 days", when: "Fri 26 Jun", actionLabel: "Compare quotes", actionType: "secondary",
        detail: { intro: "Cover ends 26 Jun.", rows: [{ label: "Current", value: "£740/yr" }, { label: "Alternative", value: "£660/yr · same cover" }], confirmLabel: "Bind cheapest", successTitle: "Renewal switched", successSub: "Bound · certificate emailed" } },
      { key: "ropa", dot: "#2E844A", title: "GDPR · RoPA review", desc: "Quarterly record of processing review", progress: "5 connectors · none changed", pillCls: "pill-soft", pillTxt: "in 33 days", when: "Tue 1 Jul", actionLabel: "Review diff", actionType: "ghost",
        detail: { intro: "No connector scope changes.", rows: [{ label: "Connectors", value: "5" }], confirmLabel: "Sign off RoPA", successTitle: "RoPA signed off", successSub: "Next due 1 Oct" } },
    ],
    connectors: [
      { initials: "Xe", name: "Xero", by: "Will Pennington", scopes: "invoices.read, contacts.write, transactions.read", last: "9 mins ago", status: "Active", statusCls: "pill-ok", iconBg: "#E7EFF5", iconFg: "#1E5277" },
      { initials: "Su", name: "SumUp", by: "Will Pennington", scopes: "transactions.read", last: "just now", status: "Active", statusCls: "pill-ok", iconBg: "#E6F2EB", iconFg: "#2E844A" },
      { initials: "HM", name: "HMRC gateway", by: "Will Pennington", scopes: "vat.submit, paye.submit", last: "today 02:06", status: "Active", statusCls: "pill-ok", iconBg: "#F5EAD6", iconFg: "#8A5A12" },
      { initials: "Si", name: "SignWell e-sign", by: "Will Pennington", scopes: "documents.send, documents.read", last: "yesterday", status: "Active", statusCls: "pill-ok", iconBg: "#EEEDE7", iconFg: "#191C21" },
      { initials: "Gm", name: "Gmail (will@)", by: "Will Pennington", scopes: "mail.read, mail.send (draft only)", last: "just now", status: "Active", statusCls: "pill-ok", iconBg: "#EEEDE7", iconFg: "#191C21" },
    ],
    audit: [
      { time: "06:45", event: "Raised", detail: "variation VO-204 · Aldridge newel detail · £980", ref: "#vo-204", actor: "from survey notes", pillCls: "pill-warn", pillTxt: "waiting" },
      { time: "06:20", event: "Logged", detail: "2 site surveys · photos + dimensions captured", ref: "#sv-88", actor: "survey sync", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "02:08", event: "Reconciled", detail: "172 of 176 bank transactions · 4 flagged", ref: "", actor: "overnight run", pillCls: "pill-ok", pillTxt: "ok" },
      { time: "yest. 16:30", event: "Sent", detail: "Ebor Interiors fitted-study reminder · £2,640", ref: "#a-9210", actor: "approved by Will", pillCls: "pill-ok", pillTxt: "ok" },
    ],
    csvName: "pennington-gdpr-audit.csv",
  },

  inbox: [
    { id: "i1", sender: "Mrs Crompton", initials: "CR", channel: "Email", kind: "retail", unread: true, time: "08:00", status: "active", subject: "Wardrobe fit — all on track?", preview: "Just checking the fit's still finishing Friday — and what was the surveyor noting yesterday?", body: "Hi Will,\n\nJust checking the wardrobe fit is still finishing Friday? Your surveyor was measuring the back wall a lot yesterday — is there a problem?\n\nThanks,\nMrs Crompton", draft: "Hi Mrs Crompton,\n\nStill finishing Friday, no problem there. The surveyor spotted the back wall is about 22mm out of square over its height — really common in older houses. To fit the wardrobes perfectly flush we'll scribe them to the wall and add a slim filler panel, which is about a half-day of extra work. I've put together a small variation (£420) so you can see exactly what it covers — no surprises. Shall I send it over to sign?\n\nBest,\nWill — Pennington Joinery", sources: ["Survey · back wall 22mm out", "Variation VO-205 · scribe + filler", "Fit calendar · finishes Fri"] },
    { id: "i2", sender: "Mr & Mrs Aldridge", initials: "AL", channel: "Email", kind: "retail", unread: true, time: "07:50", status: "active", subject: "Survey today + chunkier newel", preview: "See you at 10:30 — and yes, we'd love the chunkier newel post we discussed.", body: "Hi Will,\n\nSee you at 10:30 for the survey. And yes — we'd love the chunkier turned newel post you showed us, it really suits the hall. Whatever the extra is, that's fine.\n\nThanks,\nThe Aldridges", draft: "Hi both,\n\nGreat — see you at 10:30. Lovely choice on the newel; it'll be a real feature. The chunkier turned post and matching detailing is a £980 variation (VO-204), which I'll bring to the survey for you to sign so it's all locked in before we machine. I'll take the final dimensions today and we'll be cutting next week.\n\nWill", sources: ["Variation VO-204 · newel detail", "Survey · 29 May 10:30", "Workshop · machining w/c 2 Jun"] },
    { id: "i3", sender: "Mr Brookes", initials: "BR", channel: "Email", kind: "retail", unread: true, time: "07:38", status: "active", subject: "Alcove survey — wonky chimney breast", preview: "Looking forward to the survey — the chimney breast's a bit wonky so measure carefully.", body: "Hi,\n\nLooking forward to the survey at 3 today. Fair warning — the chimney breast's a bit wonky and the two alcoves aren't the same width, so worth measuring carefully!\n\nThanks,\nDan Brookes", draft: "Hi Dan,\n\nThanks for the heads-up — that's exactly what the survey's for. We'll measure each alcove independently top, middle and bottom (they're rarely truly square or equal) and build each unit to its own dimensions so they fit like they were always there. I'll have the firm quote to you within a couple of days of the survey.\n\nSee you at 3,\nWill", sources: ["Survey checklist · alcoves", "Quote QU-7120 · re-confirm", "Survey diary · 15:00"] },
    { id: "i4", sender: "Ebor Interiors", initials: "EB", channel: "HubSpot", kind: "trade", unread: true, time: "yesterday", status: "active", subject: "Spec change — alcove unit doors", preview: "Client wants shaker doors instead of slab on the alcove units. What's the difference?", body: "New message via HubSpot.\n\nEbor's client has changed their mind — they'd like shaker-style doors on the alcove units instead of the slab doors specified. Can you confirm the cost difference and whether it affects the timeline?", draft: null, sources: [] },
    { id: "i5", sender: "The Snug Bar", initials: "SB", channel: "Email", kind: "trade", unread: true, time: "yesterday", status: "active", subject: "Oak bar top — price went up?", preview: "Your revised quote is higher than before — what changed?", body: "Hi Will,\n\nWe were about to go ahead with the oak bar top and shelving, but the revised quote is higher than the one from a few weeks ago. What's changed?\n\nThanks,\nThe Snug Bar", draft: null, sources: [] },
    { id: "i6", sender: "HMRC", initials: "HM", channel: "Email", kind: "supplier", unread: false, time: "yesterday", status: "active", subject: "VAT return reminder · Feb–Apr", preview: "Your VAT return for Feb–Apr 2026 is due by 3 June.", body: "Reminder · Your VAT return for the period 01 Feb – 30 Apr 2026 is due by 3 June 2026.\n\n— HMRC", draft: null, sources: [] },
    { id: "i7", sender: "Arnold Laver", initials: "AR", channel: "Email", kind: "supplier", unread: false, time: "yesterday", status: "active", subject: "Invoice 22110 — oak + board", preview: "Invoice for oak and birch ply against PO-116. £780, 30-day terms.", body: "Please find attached invoice 22110 for European oak and birch ply delivered against PO-116. Amount £780.00, net 30 days.\n\nAccounts, Arnold Laver", draft: "Approve and route to Xero · matches PO-116 · code: Stock › Timber › Hardwood · 20% VAT recoverable · schedule for the Fri 30 May merchant batch.", sources: ["PO-116 · matched", "Xero code · Stock › Timber", "Supplier terms · net 30"] },
    { id: "i8", sender: "Website enquiry", initials: "WE", channel: "Web form", kind: "retail", unread: false, time: "2 days ago", status: "active", subject: "Media wall + floating shelves", preview: "Want a quote for a bespoke media wall with floating oak shelves in the lounge.", body: "Form submission\n\nName: Lauren Webb\nEnquiry: Looking for a bespoke media wall with floating oak shelves and concealed cabling, lounge in YO24. Want a designed-and-fitted price.\nPreferred contact: email.", draft: null, sources: [] },
  ],

  inboxDrafts: {
    i4: { draft: "Hi,\n\nNo problem — shaker doors instead of slab adds £1,240 across the run (more material and machining), and about two extra days in the workshop, so the fit would move a week. I've raised it as variation VO-206 so it's clear and signed before we proceed. Want me to send it through?\n\nWill", sources: ["Variation VO-206 · shaker doors", "Workshop schedule", "Contract · spec changes"] },
    i5: { draft: "Hi,\n\nGood question — the difference is the oak. The original quote was 22 days old and solid European oak has risen about 5% with our merchant since then, which is the gap you're seeing. I can hold the new price for 30 days and lock the timber in now if you're happy to proceed, so it doesn't move again.\n\nWill", sources: ["Quote QU-7108 · oak", "Price watch · +5.1% oak", "Quote shelf-life monitor"] },
  },

  approvals: [
    {
      id: "send-variations", workflowTag: "Variation orders", category: "comms", meta: "drafted 06:45 · 3 awaiting sign-off",
      headline: "Send 3 variation orders for signature — £2,640 of agreed extras",
      detail: "Each is extra work already agreed verbally but not signed. Sending for e-signature protects the money and prevents disputes at handover.",
      lineItems: [
        { primary: "Aldridge · chunkier newel post", detail: "VO-204 · agreed at survey", value: "£980", caption: "to sign", tag: "Staircase" },
        { primary: "Crompton · scribe + filler panel", detail: "VO-205 · wall 22mm out of square", value: "£420", caption: "to sign", tag: "Wardrobes" },
        { primary: "Ebor · shaker doors (spec change)", detail: "VO-206 · client changed door style", value: "£1,240", caption: "to sign", tag: "Contract" },
      ],
      openLabel: "Edit variations", approveLabel: "Send all 3", approveIcon: "send", status: "pending",
    },
    { id: "crompton-variation-reply", workflowTag: "Customer reply", category: "reply", meta: "drafted 08:01 · Mrs Crompton", headline: "Explain the out-of-square wall variation to Mrs Crompton", detail: "Reassures the fit still finishes Friday, explains the 22mm scribe + filler, and offers to send the £420 variation to sign.", openLabel: "Open thread", approveLabel: "Send reply", approveIcon: "send", status: "pending" },
    {
      id: "po-118", workflowTag: "Purchase order", category: "po", meta: "timber cover drops below next week's work",
      headline: "Raise PO-118 to Arnold Laver — £742",
      detail: "Tops up oak and board before the Aldridge staircase machining and Brookes alcoves.",
      lineItems: [
        { primary: "European oak (PAR) per m", detail: "30m", stockNote: "on hand 64 · reserved 90", value: "£426" },
        { primary: "Oak stair tread (40mm)", detail: "8", stockNote: "on hand 6 · reserved 14", value: "£256" },
        { primary: "Hardwax oil 2.5L", detail: "2", stockNote: "on hand 4 · reserved 5", value: "£68" },
      ],
      openLabel: "Adjust", approveLabel: "Raise PO", approveIcon: "check", status: "pending",
    },
    { id: "recon-flags", workflowTag: "Reconciliation", category: "finance", meta: "overnight run · 02:08", headline: "4 unmatched bank lines need review", detail: "2× SumUp card fees (£1.60 each), 1 timber refund (£42.00), 1 unknown transfer (£110.00). 172 of 176 matched automatically.", openLabel: "View", approveLabel: "Mark resolved", approveIcon: "check", status: "pending" },
    { id: "weekly-payroll", workflowTag: "Payroll", category: "payroll", meta: "runs Fri 09:00 · 4 staff", headline: "Weekly payroll — 4 staff, net £3,240", detail: "Gross £4,280, net £3,240. No changes since last week. HMRC PAYE filing automatic on approval.", openLabel: "Review", approveLabel: "Approve payroll", approveIcon: "check", status: "pending" },
  ],

  chase: [
    { id: "ch1", customer: "Ebor Interiors", invoiceRef: "INV-9210", amount: "£2,640", reason: "Fitted study · 38 days overdue", addedHoursAgo: 28, source: "money-overdue", status: "sent" },
    { id: "ch2", customer: "Mr & Mrs Aldridge", invoiceRef: "INV-9198", amount: "£1,180", reason: "Staircase deposit balance · 31 days overdue", addedHoursAgo: 50, source: "money-overdue", status: "pending" },
  ],

  siteSurvey: {
    intro:
      "On bespoke joinery, the survey is the job. A missed dimension or an out-of-square wall turns a profit into a loss. Workbench gives every survey a structured checklist, captures photos and dimensions, and turns anything unexpected straight into a priced variation.",
    checklist: [
      { section: "Access & site", items: ["Parking / unloading point", "Floor protection needed?", "Stairs / lift for delivery", "Power available on site"] },
      { section: "Dimensions", items: ["Width — top / middle / bottom", "Height — left / centre / right", "Depth & any returns", "Out-of-square check (diagonal)"] },
      { section: "Services & obstructions", items: ["Sockets / switches to work around", "Pipework / radiators", "Skirting & cornice profiles", "Floor level / fall"] },
      { section: "Finish & detail", items: ["Colour / RAL confirmed", "Handle & ironmongery choice", "Edge & scribe details", "Photos of every elevation"] },
    ],
    recent: [
      { customer: "Mrs Crompton", date: "28 May 2026", photos: 14, dims: "Back wall 22mm out of square → variation raised", status: "captured" },
      { customer: "The Aldridges", date: "29 May 2026", photos: 0, dims: "Survey today · staircase rise/going to confirm", status: "draft" },
      { customer: "Mr Brookes", date: "29 May 2026", photos: 0, dims: "Survey today · alcoves unequal width", status: "draft" },
    ],
  },

  variationOrders: [
    { id: "VO-204", job: "Aldridge staircase", customer: "Mr & Mrs Aldridge", desc: "Chunkier turned newel post + matching detailing", amount: "£980", status: "proposed", raised: "29 May" },
    { id: "VO-205", job: "Crompton wardrobes", customer: "Mrs Crompton", desc: "Scribe to out-of-square wall + slim filler panel (½ day)", amount: "£420", status: "proposed", raised: "28 May" },
    { id: "VO-206", job: "Ebor alcove units", customer: "Ebor Interiors", desc: "Shaker doors in place of slab (spec change)", amount: "£1,240", status: "proposed", raised: "28 May" },
    { id: "VO-201", job: "Ebor fitted study", customer: "Ebor Interiors", desc: "Extra shelf bay + cable management", amount: "£360", status: "approved", raised: "16 Apr" },
    { id: "VO-199", job: "Snug Bar fit-out", customer: "The Snug Bar", desc: "Upgrade to solid oak bar top from veneer", amount: "£540", status: "approved", raised: "2 Apr" },
  ],
};
