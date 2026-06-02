# UK Trades SMB — pain-point research report

**Scope.** Operational pain points across small-business UK trades comparable to Northgate Surfaces (the flooring & wall-panel example in the current dashboard): plumbing, carpentry / joinery, bathroom fit-out, large-scale bathroom & kitchen installs, tiling, roofing, electrical, HVAC / heating engineers, painters & decorators, and the general SMB-builder category that overlaps with these trades.

**Why this matters for Workbench.** Each pain point below maps to a concrete workflow we could automate. Anything tagged **[Already covered]** is in the current dashboard; **[Gap]** is a candidate for the roadmap.

---

## 1. Executive summary

The five themes that surface in *every* trade vertical we researched:

1. **Cash flow is the existential pressure.** ~70% of contractors report regular late payments; payment delays cost the UK economy ~£11bn/yr and are the leading cause of small-trade insolvency. Construction was the single most-distressed sector in Q1 2026 with 1,159 insolvency cases.
2. **The owner is the bottleneck.** Across joinery, plumbing and roofing the same pattern recurs: the owner does quoting, scheduling, ordering, fitting, snagging and chasing. Scaling is blocked because no one else can do those things.
3. **Quoting is undisciplined and leaky.** Verbal quotes, missed change-orders ("variations"), no follow-up on dormant quotes, and conversion rates ruined by slow response (>5 min reply = 8× drop).
4. **Compliance 2026 is a wall of new admin.** CIS reforms, electrical Level 3 competency, EICR renewals, VAT reverse-charge enforcement, NICEIC/Gas Safe annual cycles, MTD VAT — all of these land between Apr–Oct 2026.
5. **Materials are now a *weekly* price-volatility problem.** Subcontractors are being forced to re-check prices weekly; steel +13.3%, groundworks +6.3%, concrete frames +5.9% in Q1 2026. Stale quotes silently destroy margin.

---

## 2. Cross-cutting pain points (apply to every trade)

### 2.1 Late payment & cash flow
- **70%+ of contractors are paid late** on a regular basis (Feb 2026 data).
- **17.48m overdue invoices** in UK Q1 2026 (+3% YoY).
- **40% of plumbers** report customer payments arrive 45–90 days after work, vs payroll being weekly.
- **Reverse-charge VAT** has removed the historic VAT "cash float" — a £1.8m-turnover subcontractor used to hold £25–35k of VAT in-hand at any point; that's gone.
- **One-day delay on invoicing = days extra to pay.** The "Friday-night invoicing rush" is a profit killer because un-billed parts get forgotten.

→ **[Already covered]** Invoice radar (Money), Chase politely / Send reminder / Schedule chase modals, Chase list on Today.
→ **[Gap]** *Cash-flow forecast* showing committed-out vs expected-in over the next 8 weeks; *Auto-invoice on completion* (trigger an invoice as soon as a job is marked done on the calendar).

### 2.2 Owner-is-the-bottleneck syndrome
- Joinery owners stay small "because everything depends on the owner". Same true for plumbers (where "feast or famine" is the #1 stated frustration), and roofers.
- The unread-handwriting trope: techs scribble part numbers, the office under-bills.

→ **[Already covered]** Today inbox + approval queue; the whole approve/edit/send pattern delegates execution to Claude.
→ **[Gap]** *Voice-note / photo capture from the van* with auto-transcription into the day's job sheet; *Snag-list photo capture* attached to the job/invoice.

### 2.3 Quoting & lead conversion
- B2B average lead-to-meeting rate is 2.9%. Trades do worse than average because they pick up the phone slowly and quote slowly.
- **Reply in <1h = 7× more likely to qualify the lead. Wait >5 min = 8× drop.**
- 60–70% of B2B leads are never contacted by sales — the same is true for tradespeople inboxes.
- Joinery best-practice quoting has three parts: site survey → written scope → fixed price with explicit exclusions. Most SMBs skip the exclusions and absorb scope creep.
- "Variations" (scope creep mid-job) eat the margin if not priced as they happen.

→ **[Already covered]** Quote draft & Quote follow-up modals; New Quote on the Customer page with templates and trade-pricing autodiscount.
→ **[Gap]** *Auto-reply to a new web-form lead within 60 seconds* with a "I'll send a slot today" message; *Variation order workflow* (mid-job add-on with customer approval before the work happens); *Quote-expired auto-nudge* (re-issue a fresh price when the quote validity lapses).

### 2.4 Materials price volatility & supplier risk
- Construction material prices rose **2.0% in the 12 months to Jan 2026**, but the *spread* by category is enormous (steel +13.3%, brick volumes –11%).
- Contractors are now doing **weekly price checks** because monthly pricing isn't safe.
- Imported timber (MDF, OSB, plywood) is the most volatile.
- Steel tariff from July 2026 expected to add £300/tonne by Q3.
- Kitchen-fitter case studies repeatedly cite supplier insolvency — deposits paid, units missing, customers blame the fitter.

→ **[Already covered]** Products & stock page; PO builder; "low stock" call-out; Add-to-PO from approval queue.
→ **[Gap]** *Quote-shelf-life warning* (flag any open quote >X days when key SKU price has moved >2%); *Supplier-risk score* per supplier (lead-time variance, late deliveries, last credit-check); *Auto-relock pricing* with the customer if a quote is going stale.

### 2.5 Scheduling & job dispatch
- HVAC + plumbing repeatedly cite "juggling maintenance schedules with emergency callouts" while invoices/quotes/customer enquiries pile up.
- Joinery best-practice: schedule by **phase**, not task — every workshop has a bottleneck (spraying, machining) that sets throughput.
- Bathroom fitters lose days when one team member quits suddenly and the multi-person job becomes a one-person job (overreach injuries cited).

→ **[Already covered]** Surveys & installs calendar (week + day view, confirm/cancel, fitting-team colours).
→ **[Gap]** *Bottleneck view* (which team / which day is over-booked), *Material-arrival vs install-start gating* (don't show an install as confirmable until materials have landed on the goods-in calendar).

### 2.6 Customer communication & expectation setting
- Bathroom-fitter complaints to small-claims court overwhelmingly cite: date changes, wrong materials, fitters not explaining compliance work.
- Re-shaped: customers don't punish the *problem*; they punish the *surprise*.
- One repeating recommendation across roofing, kitchen-fitting and bathroom-fitting: regular update cadence (even when nothing has changed).

→ **[Already covered]** Confirm-with-customer modal (Today); Customer reply with thread view + preview before send.
→ **[Gap]** *Job heartbeat* — Claude auto-drafts a "we're on track / one-day slip / here's a photo" update on the schedule the customer agreed to at quote time.

### 2.7 Reviews & reputation
- UK homeowners pick a trade "in minutes, not days" — mobile, top-3 Google Map, glance at stars, ring the one that feels safest.
- Checkatrade leads are widely complained about ("most don't respond / tiny jobs / fees high"). Trades feel locked-in but resentful.
- Reviews-after-job is the highest-leverage win — but rarely done because everyone is too busy when the job finishes.

→ **[Gap]** *Auto-review request* 48h after Calendar marks the job complete, with the customer's preferred channel (Google / Trustpilot / Facebook).

---

## 3. Vertical-by-vertical

### 3.1 Plumbing & heating
- **Feast or famine** is the stated #1 frustration. Jul–Aug is dead; the VAT bill lands in the dead season.
- Emergency vs scheduled jobs collide.
- Customer payments at 45–90 days; weekly payroll.
- Cited solutions: service-contract / planned-maintenance offerings to flatten the cash curve; faster invoicing.

→ **[Gap]** A *service-contract module* (recurring annual boiler service + reminders); seasonality dashboard showing the cash trough vs the VAT calendar.

### 3.2 Carpentry & joinery
- Quoting from a phone call without a site survey is the cardinal sin.
- Scope-creep (variations) without a charge mechanism quietly eats margin.
- Phase-based scheduling (cut → machine → assemble → spray → QC) is more effective than task-based.

→ **[Gap]** A *site-survey checklist app* (photos + dimensions captured on-site, auto-attached to the quote draft); *Variation order* template.

### 3.3 Bathroom fit-outs
- **Bathroom fitting is unregulated in the UK** — no licensing body, no register, no qualification minimum. Customers can't tell good from bad.
- Multi-trade coordination (plumber + tiler + electrician + plasterer + decorator) is where small fitters lose control.
- G3 (unvented cylinders) certification gaps lead to uninsured work and Building Regs breaches.
- The two repeat causes of small-claims actions: incorrect materials arriving, and date changes communicated late.

→ **[Gap]** *Multi-trade Gantt* (one bathroom job → 5 trades on a single schedule); *G3 / Part P certificate tracker* (who's qualified to sign off what); *Customer-facing project page* (read-only schedule + photo log + payment status).

### 3.4 Tilers & flooring installers
- Underestimating wastage is the #1 cause of margin loss.
- Industry rule-of-thumb: 10% waste for simple, 10–15% for complex patterns, **15% minimum for diagonals**, herringbone adds **+50% cutting time**.
- Hidden costs constantly forgotten: subfloor prep, latex levelling, old-tile removal, waterproofing, waste disposal.

→ **[Gap]** *Pattern-aware quoting helper* — Claude takes m², pattern, condition notes → recommends wastage % and adds prep lines automatically.

### 3.5 Roofing
- Material costs up dramatically (shingle prices +41% since 2020 in US data; UK steel up 13.3% in Q1 alone).
- Weather variability + scaffold cost = scheduling nightmare.
- Skills shortage: 439,000+ construction-worker gap forecast.
- Retrofit / EPC re-roofing is a growth wave — but only well-organised contractors capture it.

→ **[Gap]** *Weather-aware re-scheduling* (push installs that depend on dry days into the right window automatically).

### 3.6 Electrical
- **Three regulatory hits land in 2026:**
  - **April:** mass EICR renewals (first wave from 2021 all expiring at once).
  - **Oct:** new Level 3 competency rules — "employed person" must hold qualification + 2yr experience for affected categories.
  - **Oct:** new edition of wiring regs (BS 7671 update).
- Social rented sector (~4m properties) now under mandatory 5-yr EICR (Nov 2025).
- "Employed engineers + CIS subcontractors" both affected by the competency rule.

→ **[Already covered]** Compliance calendar.
→ **[Gap]** *Per-engineer competency-matrix view* (who can sign off what, when their qual / experience window expires); EICR renewal reminders to landlord/customer with 90/60/30-day cadence.

### 3.7 HVAC / heating engineers
- Preventative-maintenance contracts are the lever for cash-flow stability but the *reminder cycle* is hard to maintain.
- Asset / parts tracking is a major time sink.
- UK skills shortage — multi-skilled engineers in particular demand.

→ **[Gap]** *Annual-service auto-reminder* per customer asset, batched into a weekly "ready to schedule" list.

### 3.8 Painters & decorators
- Payment disputes are the modal admin event (quality claims withholding final payment).
- Recovery path: informal → letter before action → Money Claim Online (< £10k small claims).
- Legal-expenses insurance covers this, but most don't realise.

→ **[Gap]** *Final-payment workflow* with a customer sign-off photo gallery (each room, before & after) and a recorded "snag list approved" timestamp.

### 3.9 Kitchen fitters
- Supplier insolvency repeatedly cited — deposits paid, units missing, customers angry at the fitter.
- Multiple delivery dates per job (worktops separate, appliances separate).
- Measurement errors → costly re-orders.

→ **[Gap]** *Supplier deposit ledger* (visible at-risk amount per supplier); *Multi-delivery tracker* with a single customer-facing ETA.

---

## 4. The 2026 compliance wall

This single list explains the most predictable revenue opportunity for Workbench — anyone in trades is going to want help with these, all landing in the same 6-month window.

| When | What | Who | Workbench surface |
|---|---|---|---|
| **Apr 2026** | CIS reforms — verification rules tightened, *contractors liable for shortfall even if subcontractor lied*, monthly nil returns now mandatory, 5-yr waiting period for Gross Payment Status reapplication | Anyone hiring CIS subbies | **[Already covered]** CIS return modal |
| **Apr 2026** | Mass EICR renewals (5-yr cycle from 2021) | Landlords, agents, electricians | **[Gap]** EICR renewal pipeline |
| **Apr 2026** | HMRC powers to cancel Gross Payment Status immediately on fraud suspicion | CIS contractors | **[Gap]** GPS status monitor |
| **Jul 2026** | Steel import tariffs lift prices | Roofers, metal-frame trades | **[Gap]** Quote re-pricing prompt |
| **Oct 2026** | New Level 3 competency rule (electrical) | Electricians | **[Gap]** Competency matrix |
| **Oct 2026** | New BS 7671 wiring regs | Electricians | **[Gap]** Compliance calendar |
| **Ongoing** | VAT reverse charge enforcement stepped up; ~40% of builders say it materially hits cash flow | All construction subcontractors | **[Gap]** Reverse-charge cash forecast |
| **Annual** | NICEIC re-assessment cycle (12-monthly); Gas Safe renewal; PI / PL insurance renewals | Electricians, gas engineers | **[Gap]** Cert renewal calendar |

→ **Workbench recommendation:** elevate the *Compliance* tab from a list into a 12-month rolling calendar with at-risk filters ("90 days out") and one-click "draft the renewal email / book the assessment".

---

## 5. Translating to Workbench roadmap

### Tier 1 — high-value, fits the existing chassis
1. **Cash-flow forecast widget on Money** — 8-week committed-out vs expected-in chart.
2. **Auto-invoice on job completion** — when Calendar marks a job done, Claude drafts the invoice from the quote + any approved variations.
3. **Variation-order workflow** — mid-job change captured via the customer-reply modal, priced, approved before the work happens.
4. **Quote-shelf-life monitor** — material price feed flags quotes >14 days old where SKU price has moved >2%, prompts a re-quote.
5. **Auto-review request** — 48h after job-complete, sends a Google/Trustpilot link.
6. **EICR / cert renewal pipeline** — for electrical-heavy customers, surfaces 90/60/30-day nudges with pre-drafted customer outreach.

### Tier 2 — bigger build, real differentiation
7. **Multi-trade Gantt** for bathroom & kitchen fit-outs — coordinate plumber + tiler + electrician on the same job timeline.
8. **Customer-facing project page** — read-only schedule, photo log, payment status. Reduces "are we still on Friday?" calls 80%.
9. **Site-survey checklist app** for joinery / tiling — phone-first photo + dimension capture that drops straight into a quote draft.
10. **Competency matrix** per engineer — who's qualified for what, expiry tracking.
11. **Supplier-risk score** — lead-time variance, late deliveries, deposit at risk per supplier.
12. **Job heartbeat updates** — Claude auto-drafts a "on track / 1-day slip / here's a photo" message at the cadence agreed at quote time.

### Tier 3 — adjacent verticals worth tailoring for
- **Plumbing & heating** — service-contract module + seasonality dashboard.
- **Roofers** — weather-aware re-scheduling.
- **HVAC** — annual-service reminder batching.
- **Bathroom fit-outs** — multi-trade Gantt is the headline.

---

## 6. Sources

- [Tackling the biggest financial challenges in the plumbing & heating industry — Together We Count](https://togetherwecount.co.uk/tackling-the-biggest-financial-challenges-in-the-plumbing-and-heating-industry/)
- [Plumbing Business Cash Flow — FieldEdge](https://fieldedge.com/blog/plumbing-business-cash-flow/)
- [How to Grow Your Plumbing Business in 2026 (UK) — Pro Playbooks](https://proplaybooks.co.uk/blog/grow-plumbing-business-uk)
- [Grow Carpentry Business — DevelopCoaching](https://developcoaching.co.uk/grow-carpentry-business/)
- [The Complete Guide to Running a Joinery Business in 2026 — Joinery Core](https://joinerycore.com/blog/complete-guide-joinery-business.html)
- [How to Price Custom Carpentry Work — Tradesman Saver](https://www.tradesmansaver.co.uk/tradesman-insights/how-to-price-custom-carpentry-work-without-underselling-yourself/)
- [UK Bathroom Renovation Timeline & Trade Order — BookaBuilderUK](https://www.bookabuilderuk.com/blog/uk-bathroom-renovation-timeline-lead-times)
- [Bathroom Fitter Qualifications UK — Digital Tradies](https://digitaltradies.com/blog/bathroom-fitter-qualifications-uk/)
- [One in five builders say late payments threaten their business — UK Construction Online](https://www.ukconstructionmedia.co.uk/features/one-in-five-builders-say-late-payments-threaten-their-business/)
- [Late payments increase as overdue invoices grow by 3% — Credit Connect](https://www.credit-connect.co.uk/news/late-payments-increase-as-overdue-invoices-grow-by-3/)
- [Late Payments and Retentions: What the 2025 Reforms Mean for 2026 — Ascend Broking](https://ascendbroking.co.uk/late-payments-and-retentions-2026)
- [Three Compliance Deadlines Every Electrical Contractor Needs to Know — Fieldmotion](https://fieldmotion.com/blog/electrical-contractor-deadlines/)
- [Is 2026 the year electricians can no longer afford to stand still? — Electrical Review](https://electricalreview.co.uk/2026/05/15/is-2026-the-year-electricians-can-no-longer-afford-to-stand-still/)
- [Roofing Challenges in 2026 and How to Overcome Them — Fixr](https://www.fixr.com/pros/roofing-challenges)
- [2026 State of the Roofing Industry — Roofing Contractor](https://www.roofingcontractor.com/articles/101643-2026-state-of-the-roofing-industry-report)
- [Kitchen Supplier Insolvency — Sprintlaw UK](https://sprintlaw.co.uk/articles/kitchen-supplier-goes-bust-protect-contracts-deposits-and-deadlines/)
- [UK Tile Installation Cost 2026 — Elliren Tiles](https://ellirentiles.co.uk/blogs/news/tile-installation-cost-uk-explained)
- [Construction Quotation Software UK — Builder Expert](https://builderexpert.uk/construction-quotation-software-uk-flooring/)
- [The Guide To HVAC Business Software In 2026 — BDR](https://www.bdrco.com/blog/hvac-business-software-guide/)
- [Best HVAC Apps UK — BigChange](https://www.bigchange.com/blog/best-hvac-apps-uk)
- [CIS changes from April 2026 — Rouse Partners](https://www.rousepartners.co.uk/cis-changes-from-april-2026/)
- [A Summary of the CIS Reforms (April 2026) — SBGRP](https://www.sbgrp.co.uk/post/a-summary-of-the-cis-reforms-april-2026)
- [Construction Industry Scheme (CIS) changes for April 2026 — Simply Business](https://www.simplybusiness.co.uk/knowledge/trades/construction-industry-scheme-cis-changes-april-2026/)
- [Lead Generation for Tradespeople and Contractors UK — Aimpro Digital](https://aimpro.co.uk/lead-generation-for-tradespeople-uk/)
- [Conversion Rate Benchmarks 2026 — Ruler Analytics](https://www.ruleranalytics.com/blog/insight/conversion-rate-by-industry/)
- [Painter & Decorator client won't pay — JustAnswer UK](https://www.justanswer.co.uk/law/eq0um-painter-decorator-client-will-not-pay-bill.html)
- [A painter and decorators guide to business insurance — Painting and Decorating Association](https://paintingdecoratingassociation.co.uk/2025/08/a-painter-and-decorators-guide-to-business-insurance/)
- [Contractors forced into weekly price checks as volatility grows — Construction Enquirer](https://www.constructionenquirer.com/2026/05/21/contractors-forced-into-weekly-price-checks-as-volatility-grows/)
- [UK Construction Supply Chain Updates & Material Prices 2026 — Frank Key](https://www.frank-key.co.uk/material-price-inflation-2026)
- [Latest building materials and components statistics — BCIS](https://www.bcis.co.uk/news/latest-building-materials-and-components-statistics/)
- [Reverse Charge VAT Explained — Thomas Emlyn](https://www.thomasemlyn.co.uk/resources/blog/reverse-charge-vat-explained-what-it-really-means-for-construction-cashflow-and-margins/)
- [UK construction VAT domestic reverse charge guide 2026 — Invoice Mama](https://invoicemama.com/guides/uk/vat-domestic-reverse-charge-construction)
- [HMRC Steps Up Pressure on VAT Reverse Charge — Apex Accountants](https://apexaccountants.tax/hmrc-steps-up-pressure-on-vat-reverse-charge-in-the-construction-industry/)
- [Tradesman Insurance UK 2026 — Kael Tripton](https://www.kaeltripton.com/tradesman-insurance-uk-2026/)
- [NICEIC certification overview](https://niceic.com/for-the-trades-1/)
- [Checkatrade Review for Tradespeople — Tradespeople Online](https://tradespeopleonline.com/checkatrade-review/)
- [Checkatrade Trustpilot reviews](https://www.trustpilot.com/review/www.checkatrade.com)
