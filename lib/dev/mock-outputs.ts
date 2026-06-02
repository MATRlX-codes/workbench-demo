// lib/dev/mock-outputs.ts
//
// Realistic mock outputs for all 15 workflow agents.
// Context: O'Brien's Hardware, Dublin, EUR.
//
// Each entry key must match the agent `name` field exactly (see lib/agents/index.ts).
// Each value must satisfy the agent's outputSchema — check lib/agents/*.ts before editing.

// ---------------------------------------------------------------------------
// invoice-chase
// outputSchema: { drafts[], skipped[], summary }
// drafts[]: { customerName, customerEmail, invoices[], reminderNumber, subject, body, gmailDraftId }
// invoices[]: { invoiceNumber, amount, currency, originalDueDate, daysOverdue }
// ---------------------------------------------------------------------------
const invoiceChase = {
  drafts: [
    {
      customerName: "Murphy Construction Ltd",
      customerEmail: "accounts@murphyconstruction.ie",
      invoices: [
        {
          invoiceNumber: "INV-2024-0891",
          amount: 4750.0,
          currency: "EUR",
          originalDueDate: "2026-04-28",
          daysOverdue: 22,
        },
      ],
      reminderNumber: 1,
      subject: "Friendly reminder — invoice #INV-2024-0891",
      body: "Dear Murphy Construction,\n\nI hope this finds you well. I'm writing with a gentle reminder that invoice #INV-2024-0891 for €4,750.00 was due on 28 April and remains outstanding.\n\nIf you've already arranged payment, please disregard this message. Otherwise, we'd be grateful if you could arrange settlement at your earliest convenience. If you'd like us to resend a copy of the invoice, just say the word.\n\nMany thanks,\nO'Brien's Hardware",
      gmailDraftId: "mock-draft-001",
    },
    {
      customerName: "Fitzgerald & Sons Plumbing",
      customerEmail: "billing@fitzgeraldsons.ie",
      invoices: [
        {
          invoiceNumber: "INV-2024-0876",
          amount: 1200.0,
          currency: "EUR",
          originalDueDate: "2026-04-14",
          daysOverdue: 36,
        },
        {
          invoiceNumber: "INV-2024-0882",
          amount: 840.0,
          currency: "EUR",
          originalDueDate: "2026-04-21",
          daysOverdue: 29,
        },
      ],
      reminderNumber: 2,
      subject: "Reminder — invoices #INV-2024-0876 and #INV-2024-0882 are overdue",
      body: "Dear Fitzgerald & Sons,\n\nThis is a follow-up to our previous reminder. Two invoices remain outstanding:\n\n• #INV-2024-0876 — €1,200.00 (due 14 April, now 36 days overdue)\n• #INV-2024-0882 — €840.00 (due 21 April, now 29 days overdue)\n\nThe total outstanding balance is €2,040.00. We'd appreciate your urgent attention to this. Please don't hesitate to contact us if there's a query on either invoice.\n\nMany thanks,\nO'Brien's Hardware",
      gmailDraftId: "mock-draft-002",
    },
    {
      customerName: "Connolly Electrical",
      customerEmail: "connollyelectrical@gmail.com",
      invoices: [
        {
          invoiceNumber: "INV-2024-0821",
          amount: 390.0,
          currency: "EUR",
          originalDueDate: "2026-03-31",
          daysOverdue: 50,
        },
      ],
      reminderNumber: 3,
      subject: "Urgent: invoice #INV-2024-0821 — 50 days overdue",
      body: "Dear Connolly Electrical,\n\nDespite two previous reminders, invoice #INV-2024-0821 for €390.00 (due 31 March) remains unpaid. This account is now 50 days overdue.\n\nWe value our relationship and would like to resolve this promptly. Please contact us directly to discuss payment arrangements. If we do not hear from you by Friday, we will need to consider escalating this matter.\n\nKind regards,\nO'Brien's Hardware",
      gmailDraftId: "mock-draft-003",
    },
  ],
  skipped: [
    {
      customerName: "Brennan Civil Engineering",
      reason:
        "Invoice notes indicate payment dispute — owner requested hold pending site visit on 15 May.",
    },
    {
      customerName: "O'Sullivan Roofing",
      reason: "No email address on file for billing contact.",
    },
  ],
  summary: {
    totalOverdueAmount: 7180.0,
    totalCustomersChecked: 5,
    draftsPrepared: 3,
  },
};

// ---------------------------------------------------------------------------
// monthly-close
// outputSchema: { reconciliationItems[], mismatches[], summary }
// reconciliationItems[]: { source, matched, unmatched } — no totalAmount field
// ---------------------------------------------------------------------------
const monthlyClose = {
  reconciliationItems: [
    { source: "stripe", matched: 47, unmatched: 3 },
    { source: "paypal", matched: 12, unmatched: 1 },
    { source: "quickbooks", matched: 59, unmatched: 2 },
  ],
  mismatches: [
    {
      id: "STR-4921",
      source: "stripe",
      amount: 1200.0,
      note: "Stripe payout on 30 April — no matching QuickBooks income entry. May be bank transfer lag.",
    },
    {
      id: "STR-4898",
      source: "stripe",
      amount: 85.5,
      note: "Stripe refund not reflected in QuickBooks. Credit note likely needed.",
    },
    {
      id: "STR-4882",
      source: "stripe",
      amount: 340.0,
      note: "QuickBooks shows €340 income on 22 April — no corresponding Stripe charge found. Cash payment?",
    },
    {
      id: "PP-2291",
      source: "paypal",
      amount: 625.0,
      note: "PayPal payment received 18 April — mapped to wrong customer in QuickBooks (O'Sullivan vs Sullivan).",
    },
  ],
  summary: {
    totalMatched: 118,
    totalUnmatched: 6,
    netDifference: 2250.5,
    period: { startDate: "2026-04-01", endDate: "2026-04-30" },
  },
};

// ---------------------------------------------------------------------------
// cash-flow-surfacing
// outputSchema: { currentBalance, upcomingInflows[], upcomingOutflows[], projectedBalance30Days, warnings[] }
// ---------------------------------------------------------------------------
const cashFlowSurfacing = {
  currentBalance: 18420.0,
  upcomingInflows: [
    {
      description: "Murphy Construction — INV-2024-0891 (overdue)",
      amount: 4750.0,
      dueDate: "2026-04-28",
    },
    {
      description: "Dunnes Trade Account — INV-2024-0901",
      amount: 3200.0,
      dueDate: "2026-05-25",
    },
    {
      description: "Kildare County Council — INV-2024-0898",
      amount: 8500.0,
      dueDate: "2026-05-30",
    },
  ],
  upcomingOutflows: [
    {
      description: "Supplier: Grafton Merchants — April stock",
      amount: 9800.0,
      dueDate: "2026-05-22",
    },
    { description: "Payroll — May", amount: 12400.0, dueDate: "2026-05-28" },
    { description: "VAT3 return — Q1", amount: 3100.0, dueDate: "2026-05-31" },
    {
      description: "Rent — Unit 4, Tallaght Industrial",
      amount: 2800.0,
      dueDate: "2026-06-01",
    },
  ],
  projectedBalance30Days: 6770.0,
  warnings: [
    "Projected balance drops below €10,000 around 28 May after payroll.",
    "VAT3 return and payroll fall in the same week (28–31 May) — €15,500 outgoing. Ensure overdraft facility is confirmed.",
  ],
};

// ---------------------------------------------------------------------------
// margin-analyser
// outputSchema: { topMarginLines[], bottomMarginLines[], period, observations[] }
// marginLine: { name, revenue, cost, marginPct }
// ---------------------------------------------------------------------------
const marginAnalyser = {
  topMarginLines: [
    { name: "Power Tools — own-brand resale", revenue: 28400.0, cost: 11200.0, marginPct: 60.6 },
    { name: "Trade account membership", revenue: 4800.0, cost: 600.0, marginPct: 87.5 },
    { name: "Fixings & fasteners (bulk)", revenue: 12200.0, cost: 5100.0, marginPct: 58.2 },
    { name: "Paint & coatings", revenue: 19800.0, cost: 10400.0, marginPct: 47.5 },
    { name: "Safety PPE", revenue: 7600.0, cost: 4200.0, marginPct: 44.7 },
  ],
  bottomMarginLines: [
    { name: "Timber & sheet material", revenue: 31200.0, cost: 28900.0, marginPct: 7.4 },
    { name: "Hired equipment", revenue: 4200.0, cost: 3800.0, marginPct: 9.5 },
    { name: "Plumbing fittings (contractor rate)", revenue: 22100.0, cost: 19600.0, marginPct: 11.3 },
    { name: "Heavy aggregates (gravel, sand)", revenue: 8900.0, cost: 7600.0, marginPct: 14.6 },
    { name: "Electrical cable & conduit", revenue: 14400.0, cost: 12000.0, marginPct: 16.7 },
  ],
  period: { startDate: "2026-02-01", endDate: "2026-04-30" },
  observations: [
    "Timber margins are dangerously low at 7.4% — consider repricing or switching supplier.",
    "Trade account memberships have 87.5% margin — worth promoting at the counter.",
    "Hired equipment ROI is poor; consider discontinuing or increasing day rates.",
    "Power Tools own-brand significantly outperforms branded equivalents on margin.",
  ],
};

// ---------------------------------------------------------------------------
// tax-season-organiser
// outputSchema: { vatPeriod, salesVat, purchasesVat, netVatDue, draftEmailId }
// ---------------------------------------------------------------------------
const taxSeasonOrganiser = {
  vatPeriod: { startDate: "2026-01-01", endDate: "2026-03-31" },
  salesVat: { totalSales: 142800.0, vatCollected: 28350.0 },
  purchasesVat: { totalPurchases: 89400.0, vatReclaimable: 17820.0 },
  netVatDue: 10530.0,
  draftEmailId: "mock-draft-vat-001",
};

// ---------------------------------------------------------------------------
// lead-triager
// outputSchema: { leads[], skipped[] }
// lead: { contactId, name, email, company, fitScore, outreachSubject, outreachBody, draftId }
// ---------------------------------------------------------------------------
const leadTriager = {
  leads: [
    {
      contactId: "hs-001",
      name: "Siobhán Kelly",
      email: "s.kelly@kellybuild.ie",
      company: "Kelly Build Ltd",
      fitScore: 9,
      fitScoreRationale: "Kelly Build is a growing Dublin contractor with consistent project pipeline. Company size, location and likely volume all align. Strong online presence and recent planning approval signal active growth.",
      outreachSubject: "Trade account — Kelly Build",
      outreachBody:
        "Hi Siobhán,\n\nI came across Kelly Build online — congratulations on the Stillorgan development announcement. We supply fixings, tools and timber to a number of Dublin contractors and I thought a trade account with us might be worth a conversation.\n\nWe offer 30-day terms, a dedicated account manager, and same-day delivery within the M50. Happy to arrange a site visit or a quick call whenever suits.\n\nKind regards,\nDara O'Brien\nO'Brien's Hardware",
      draftId: "mock-draft-lead-001",
    },
    {
      contactId: "hs-002",
      name: "Tomás Ní Bhriain",
      email: "tomas@nibriaindevelopments.com",
      company: "Ní Bhriain Developments",
      fitScore: 8,
      fitScoreRationale: "Active developer with a confirmed Westmeath civils project underway. Likely to need tools, PPE and materials. No existing supplier relationship found on LinkedIn.",
      outreachSubject: "Hardware supplies for your Mullingar project?",
      outreachBody:
        "Hi Tomás,\n\nI noticed Ní Bhriain Developments recently secured planning for the Mullingar road scheme — well done. We've supplied materials to several road and civils projects in Westmeath over the past two years.\n\nIf your team needs a reliable trade supplier for PPE, fixings or tools, I'd love to have a chat. We can usually turn around orders same week for Leinster sites.\n\nMany thanks,\nDara O'Brien\nO'Brien's Hardware",
      draftId: "mock-draft-lead-002",
    },
    {
      contactId: "hs-003",
      name: "Brian Walsh",
      email: "bwalsh@homefix.ie",
      company: "HomeFix Maintenance",
      fitScore: 7,
      fitScoreRationale: "Property maintenance company — steady recurring need for consumables and tools. Smaller average order likely but reliable frequency. Good fit for trade account.",
      outreachSubject: "Trade pricing for HomeFix",
      outreachBody:
        "Hi Brian,\n\nWe work with a number of property maintenance companies in Dublin and I thought HomeFix might benefit from our trade pricing on tools and consumables.\n\nWould you be open to a quick call to see if there's a fit?\n\nKind regards,\nDara O'Brien\nO'Brien's Hardware",
      draftId: "mock-draft-lead-003",
    },
  ],
  skipped: [
    { contactId: "hs-004", reason: "Fit score 4/10 — residential DIY customer, low volume potential." },
    {
      contactId: "hs-005",
      reason: "Fit score 3/10 — based in Cork, outside our delivery radius.",
    },
  ],
};

// ---------------------------------------------------------------------------
// customer-pulse
// outputSchema: { atRiskAccounts[], healthyAccounts: { count }, summary }
// atRiskAccount: { contactId, name, company, lastActivity, riskReason, draftId }
// ---------------------------------------------------------------------------
const customerPulse = {
  atRiskAccounts: [
    {
      contactId: "hs-101",
      name: "Declan Byrne",
      company: "Byrne Plant Hire",
      lastActivity: "2026-03-28",
      riskReason:
        "No order in 52 days — previously ordered monthly. May have switched supplier.",
      draftId: "mock-draft-pulse-001",
    },
    {
      contactId: "hs-102",
      name: "Aoife Tracey",
      company: "Tracey Interiors",
      lastActivity: "2026-04-10",
      riskReason: "Deal stalled at proposal stage for 40 days. Follow-up missed.",
      draftId: "mock-draft-pulse-002",
    },
    {
      contactId: "hs-103",
      name: "Pádraig Hennessy",
      company: "Hennessy Electrical Contractors",
      lastActivity: "2026-04-22",
      riskReason:
        "Left a negative comment on a recent invoice — query about pricing not resolved in CRM.",
      draftId: "mock-draft-pulse-003",
    },
  ],
  healthyAccounts: { count: 24 },
  summary:
    "3 accounts flagged at-risk out of 27 reviewed. Main concerns: lapsed ordering (1), stalled deal (1), unresolved pricing query (1).",
};

// ---------------------------------------------------------------------------
// sales-campaign-launcher
// outputSchema: { targets[], skipped[] }
// target: { contactId, name, email, company, daysSinceContact, subject, body, draftId }
// ---------------------------------------------------------------------------
const salesCampaignLauncher = {
  targets: [
    {
      contactId: "hs-201",
      name: "Roisín McCarthy",
      email: "roisin@mccarthybuild.ie",
      company: "McCarthy Build",
      daysSinceContact: 45,
      subject: "Checking in — McCarthy Build",
      body: "Hi Roisín,\n\nIt's been a while since we've been in touch and I wanted to reach out. We have a few new product ranges coming in — including an extended Bosch Professional line and a new bulk fixings programme — that I thought might be of interest to your team.\n\nAre you still buying tools and materials for the Bray development? Happy to pop in or arrange a delivery if it's useful.\n\nKind regards,\nDara O'Brien",
      draftId: "mock-draft-campaign-001",
    },
    {
      contactId: "hs-202",
      name: "Ciarán Doyle",
      email: "c.doyle@doylecontracting.ie",
      company: "Doyle Contracting",
      daysSinceContact: 62,
      subject: "Re-engaging — Doyle Contracting",
      body: "Hi Ciarán,\n\nI hope the Portlaoise project is going well. We haven't heard from you in a couple of months and I wanted to touch base. If you have any upcoming material needs, we'd love to be on your list.\n\nMany thanks,\nDara O'Brien",
      draftId: "mock-draft-campaign-002",
    },
  ],
  skipped: [
    { contactId: "hs-203", reason: "Marked 'do not contact' in HubSpot." },
    {
      contactId: "hs-204",
      reason: "Company dissolved — LinkedIn shows no current employees.",
    },
  ],
};

// ---------------------------------------------------------------------------
// content-strategist
// outputSchema: { ideas[] }
// idea: { title, format ("blog"|"email"|"social"), rationale, keyPoints[] }
// ---------------------------------------------------------------------------
const contentStrategist = {
  ideas: [
    {
      title: "5 things contractors check before buying fixings in bulk",
      format: "blog" as const,
      rationale:
        "Recent deal notes show price-sensitivity around bulk orders — this educates and positions O'Brien's as the expert.",
      keyPoints: [
        "Price per unit vs. per box",
        "Grade/specification mismatches",
        "Lead time guarantees",
        "Return policy for unused stock",
        "Our trade account bulk pricing",
      ],
    },
    {
      title: "How to stay VAT-compliant on construction materials",
      format: "email" as const,
      rationale:
        "VAT rates on building materials are a common pain point for Irish contractors.",
      keyPoints: [
        "Zero vs. 13.5% rate thresholds",
        "When to ask for a VAT receipt",
        "How to reclaim on tools",
        "Common mistakes",
      ],
    },
    {
      title: "New in: Bosch Professional GLL3-80 line laser — is it worth it?",
      format: "blog" as const,
      rationale:
        "Product launches drive search traffic; this product is new in stock.",
      keyPoints: ["Key specs", "Comparison with previous model", "Best use cases", "Trade price"],
    },
    {
      title: "Summer site prep: the 10 essentials your team needs",
      format: "social" as const,
      rationale:
        "Seasonal content performs well and drives footfall in May–June.",
      keyPoints: [
        "PPE refresh",
        "Sun protection for outdoor teams",
        "Portable storage",
        "Hydration on site",
        "Cable management for summer builds",
      ],
    },
    {
      title: "Why your timber margins are shrinking — and what to do about it",
      format: "blog" as const,
      rationale:
        "Addresses the pain point identified in margin analysis; positions O'Brien's as an advisor not just a supplier.",
      keyPoints: [
        "Supply chain pressures post-2024",
        "Alternatives to standard C16",
        "Specification changes",
        "Volume commitment deals",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// campaign-attribution
// outputSchema: { attributionRows[], unattributed, period }
// attributionRow: { campaignName, dealsCount, totalRevenue, avgDealSize }
// ---------------------------------------------------------------------------
const campaignAttribution = {
  attributionRows: [
    {
      campaignName: "April email blast — trade accounts",
      dealsCount: 7,
      totalRevenue: 42800.0,
      avgDealSize: 6114.29,
    },
    {
      campaignName: "Google Ads — 'hardware supplier Dublin'",
      dealsCount: 12,
      totalRevenue: 28400.0,
      avgDealSize: 2366.67,
    },
    {
      campaignName: "Trade show — Buildex 2026",
      dealsCount: 3,
      totalRevenue: 18900.0,
      avgDealSize: 6300.0,
    },
    {
      campaignName: "Referral — existing trade customer",
      dealsCount: 5,
      totalRevenue: 31200.0,
      avgDealSize: 6240.0,
    },
  ],
  unattributed: { totalRevenue: 14200.0, dealsCount: 9 },
  period: { startDate: "2026-04-01", endDate: "2026-04-30" },
};

// ---------------------------------------------------------------------------
// payroll-planning
// outputSchema: { payrollDate, estimatedPayroll, currentBalance, sufficient, shortfall (nullable), alertDraftId (nullable) }
// Shortfall scenario: funds are tight after upcoming VAT + supplier payments.
// ---------------------------------------------------------------------------
const payrollPlanning = {
  payrollDate: "2026-05-28",
  estimatedPayroll: 12400.0,
  currentBalance: 8200.0,
  sufficient: false,
  shortfall: 4200.0,
  alertDraftId:
    "INTERNAL_ALERT: Payroll shortfall of €4,200.00 on 28 May. Current balance €8,200 is insufficient. Consider drawing on overdraft facility or accelerating debtor collections before payroll date.",
};

// ---------------------------------------------------------------------------
// employee-onboarding
// outputSchema: { newHires[], skipped[] }
// newHire: { contactId, name, email, startDate, welcomeEmailDraftId, checklistItems[] }
// ---------------------------------------------------------------------------
const employeeOnboarding = {
  newHires: [
    {
      contactId: "hs-301",
      name: "Liam Doherty",
      email: "liam.doherty@gmail.com",
      startDate: "2026-06-02",
      welcomeEmailDraftId: "mock-draft-onboard-001",
      welcomeEmailBody: "Dear Liam,\n\nWelcome to O'Brien's Hardware! We're absolutely delighted to have you joining the team.\n\nYour start date is Monday 2 June at 9:00am. Please come to the main entrance and ask for Dara — we'll get you sorted straight away.\n\nA few things to bring on your first day:\n• Your PPSN\n• P45 from your previous employer\n• Bank account details for payroll\n\nWe'll have everything ready for you — health and safety induction, team introductions, and a tour of the yard.\n\nIf you have any questions before then, don't hesitate to get in touch.\n\nWarm regards,\nDara O'Brien\nO'Brien's Hardware\n+353 1 234 5678",
      checklistItems: [
        "Send welcome email",
        "Add to payroll (Thesaurus)",
        "Set up email account",
        "Prepare workstation or equipment",
        "Order work boots (size 10)",
        "Health & safety induction scheduled for 2 June",
        "Key fob access granted",
        "Add to trade insurance policy",
        "Collect PPSN and P45 from previous employer",
        "Schedule introductory meeting with team",
        "Share employee handbook",
      ],
    },
  ],
  skipped: [],
};

// ---------------------------------------------------------------------------
// contract-reviewer
// outputSchema: { contracts[], skipped[] }
// contract: { subject, sender, keyTerms[], unusualClauses[], recommendation }
// ---------------------------------------------------------------------------
const contractReviewer = {
  contracts: [
    {
      subject: "RE: Supply agreement — Larkin Property Group",
      sender: "legal@larkinproperty.ie",
      keyTerms: [
        "12-month exclusive supply agreement",
        "€180,000 minimum annual spend",
        "30-day payment terms",
        "Price locked for 6 months then CPI-indexed",
        "Termination: 60 days notice either party",
      ],
      unusualClauses: [
        "Exclusivity clause prevents supplying Larkin's direct competitors — definition of 'competitor' is broad and could capture several existing trade customers.",
      ],
      recommendation: "negotiate" as const,
    },
    {
      subject: "Renewal — Grafton Merchants supply terms",
      sender: "accounts@graftonmerchants.ie",
      keyTerms: [
        "Annual renewal",
        "Standard trade terms",
        "14-day payment",
        "Volume discount tiers unchanged",
      ],
      unusualClauses: [],
      recommendation: "approve" as const,
    },
  ],
  skipped: [],
};

// ---------------------------------------------------------------------------
// month-end-prepper
// outputSchema: { unreconciledCount, missingReceiptsCount, unpaidBillsTotal, checklistDraftId, items[] }
// item: { category, count, urgency ("high"|"medium"|"low") }
// ---------------------------------------------------------------------------
const monthEndPrepper = {
  unreconciledCount: 14,
  missingReceiptsCount: 7,
  unpaidBillsTotal: 22400.0,
  checklistDraftId: "mock-draft-monthend-001",
  items: [
    { category: "Unreconciled transactions", count: 14, urgency: "high" as const },
    { category: "Missing supplier receipts", count: 7, urgency: "medium" as const },
    { category: "Unpaid bills (due before month end)", count: 4, urgency: "high" as const },
    { category: "Outstanding employee expenses", count: 3, urgency: "low" as const },
  ],
};

// ---------------------------------------------------------------------------
// scheduling
// outputSchema: { meetingRequests[], skipped[] }
// meetingRequest: { sender, subject, proposedTimes[], replyDraftId, calendarEventId (nullable) }
// ---------------------------------------------------------------------------
const scheduling = {
  meetingRequests: [
    {
      sender: "siobhan@kellybuild.ie",
      subject: "Meeting re: trade account terms",
      proposedTimes: ["2026-05-22T10:00:00", "2026-05-22T14:00:00", "2026-05-23T09:30:00"],
      replyDraftId: "mock-draft-sched-001",
      replySubject: "Re: Meeting re: trade account terms",
      replyBody: "Hi Siobhán,\n\nThanks for getting in touch — great to hear from you. I'd be happy to meet and go through our trade account terms.\n\nI have the following slots available:\n• Thursday 22 May at 10:00\n• Thursday 22 May at 14:00\n• Friday 23 May at 09:30\n\nDo any of those suit? If not, just let me know what works and I'll make it happen.\n\nKind regards,\nDara O'Brien\nO'Brien's Hardware",
      calendarEventId: null,
    },
    {
      sender: "procurement@dunnes.ie",
      subject: "Annual review — O'Brien's Hardware",
      proposedTimes: ["2026-05-27T11:00:00"],
      replyDraftId: "mock-draft-sched-002",
      replySubject: "Re: Annual review — O'Brien's Hardware",
      replyBody: "Hi,\n\nThank you for reaching out about the annual review. Tuesday 27 May at 11:00 works well for us.\n\nLooking forward to it — I'll have our account summary and any updated pricing ready to go through.\n\nKind regards,\nDara O'Brien\nO'Brien's Hardware",
      calendarEventId: null,
    },
  ],
  skipped: [
    {
      sender: "noreply@eventbrite.com",
      reason: "Automated marketing email, not a genuine meeting request.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Export
// Keys must match agent `name` fields exactly.
// ---------------------------------------------------------------------------
export const MOCK_OUTPUTS: Record<string, unknown> = {
  "invoice-chase": invoiceChase,
  "monthly-close": monthlyClose,
  "cash-flow-surfacing": cashFlowSurfacing,
  "margin-analyser": marginAnalyser,
  "tax-season-organiser": taxSeasonOrganiser,
  "lead-triager": leadTriager,
  "customer-pulse": customerPulse,
  "sales-campaign-launcher": salesCampaignLauncher,
  "content-strategist": contentStrategist,
  "campaign-attribution": campaignAttribution,
  "payroll-planning": payrollPlanning,
  "employee-onboarding": employeeOnboarding,
  "contract-reviewer": contractReviewer,
  "month-end-prepper": monthEndPrepper,
  scheduling: scheduling,
};
