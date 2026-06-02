# Workbench — project briefing for Claude Code

You are helping build **& Again Workbench**, a multi-tenant SaaS dashboard that wraps Claude for Small Business in a click-driven UI for Irish SMBs.

Read this whole file before doing anything. The patterns below are the contract — every PR follows them.

---

## What this product is (in one sentence)

A web app where the SMB owner clicks "Run weekly close" or "Chase overdue invoices" and Claude executes the workflow under their tenant's connector grants — with every action queued for approval before it sends, posts or pays.

## What it deliberately is NOT

- **Not a chat interface.** The owner never sees a prompt textbox. No `messages[]` rendering, no streaming tokens to the UI. If you start to build one, stop and re-read this section.
- **Not bespoke per client.** All clients share the same 15 workflows. Per-tenant config is restricted to: connector grants, schedules, tone-of-voice, approver list, threshold settings.
- **Not a wrapper around Claude Cowork's UI.** We use the Claude Agent SDK directly. Cowork is the consumer surface; this is a parallel productised surface for SMB ops.

## Architecture (must follow)

```
Browser
  └─ Next.js 15 (App Router, RSC + server actions)
       ├─ Clerk (auth + Organizations = tenants)
       ├─ Drizzle ORM ──► Postgres (Neon)
       └─ Workflow runner ──► @anthropic-ai/claude-agent-sdk
                                  └─ MCP servers (QuickBooks, HubSpot, Gmail, Stripe, ...)
```

Every workflow goes through this lifecycle:

1. **Trigger** — owner clicks Run, or scheduler fires (Inngest).
2. **Build agent invocation** — `lib/runner/build-invocation.ts` reads the tenant config, picks the agent definition from `lib/agents/`, attaches the MCP servers the agent declares.
3. **Run** — `lib/runner/run.ts` calls the Agent SDK with `permission_mode: "plan"` so the model returns a structured plan of proposed tool calls without executing them.
4. **Persist** — the plan is written to `workflow_runs` and one row per proposed action to `pending_approvals`.
5. **Render** — the queue page (`app/(dashboard)/queue/page.tsx`) shows pending approvals with a diff view.
6. **Approve / Reject / Edit** — owner action calls `lib/runner/execute.ts`, which replays the approved tool calls with `permission_mode: "auto"` for that specific call only.
7. **Audit** — every step is logged to `audit_log`, signed with the approving user's Clerk ID.

**Do not bypass this lifecycle.** Even read-only workflows (cash-flow briefing, customer pulse) go through it so the audit log is complete.

## File layout (must follow)

```
/app
  /(marketing)            ← public landing pages (later)
  /(auth)                 ← Clerk sign-in / sign-up routes
  /(dashboard)            ← all owner-facing pages, layout enforces auth + org
     /page.tsx            ← workflows grid (the home view)
     /queue/page.tsx      ← approval queue
     /activity/page.tsx   ← audit log
     /connectors/page.tsx ← OAuth status
     /schedules/page.tsx
     /settings/page.tsx
  /(admin)                ← & Again-only superadmin routes
     /tenants/page.tsx
  /api
     /webhooks/clerk/route.ts
     /webhooks/mcp/route.ts
     /run/[workflow]/route.ts   ← server-side run endpoint

/lib
  /agents                 ← ONE FILE PER WORKFLOW. The contract is below.
     invoice-chase.ts
     monthly-close.ts
     ...
  /runner
     build-invocation.ts
     run.ts
     execute.ts
     audit.ts
  /db
     schema.ts            ← drizzle schema for every table
     queries/             ← typed query helpers
     client.ts
  /mcp
     registry.ts          ← which MCP server URLs map to which connector name
     servers/             ← any &Again-built MCP servers (Revenue/ROS first)
  /auth
     org.ts               ← getCurrentOrg() helper, used everywhere
  /ui
     workflow-card.tsx
     approval-card.tsx
     connector-card.tsx

/drizzle                  ← migrations
/scripts                  ← one-offs (seed, repair, audit-export)
```

## The agent file contract

Every file in `lib/agents/` exports a single `agent` object. Build new workflows by copying `invoice-chase.ts` and changing the four fields.

```ts
// lib/agents/invoice-chase.ts
import { z } from "zod";
import type { AgentDefinition } from "@/lib/runner/types";

export const agent: AgentDefinition = {
  name: "invoice-chase",
  displayName: "Invoice chase",
  description: "Reads QuickBooks aged-receivables, drafts polite reminders, queues them for owner approval.",
  category: "finance",
  connectors: ["quickbooks", "gmail"], // names from lib/mcp/registry.ts
  promptTemplate: ({ tenant }) => `
You are running the invoice-chase workflow for ${tenant.businessName} (${tenant.country}).

Tone of voice: ${tenant.toneOfVoice ?? "warm professional, Irish English"}.

Your job:
1. Use the QuickBooks tool to list invoices that are >7 days overdue.
2. Group them by customer.
3. For each customer, draft a single email reminder using the tone above.
   - Reminder #1 if first chase, #2 if second, etc. (check QuickBooks notes).
   - Mention the invoice number, amount and original due date.
   - Offer to resend a copy of the invoice on request.
4. Use the Gmail tool to DRAFT (not send) each reminder.
5. Return a structured plan of the drafts you would send.

Never send. Never modify the invoice. If a customer's invoice has notes
indicating a dispute or hold, skip them and flag in the plan.
`,
  outputSchema: z.object({
    drafts: z.array(z.object({
      customerName: z.string(),
      invoiceNumber: z.string(),
      amount: z.number(),
      daysOverdue: z.number(),
      reminderNumber: z.number(),
      subject: z.string(),
      body: z.string(),
    })),
    skipped: z.array(z.object({
      customerName: z.string(),
      reason: z.string(),
    })),
  }),
  schedule: { cron: "0 9 * * 2,5", timezone: "Europe/Dublin" }, // Tue + Fri 09:00
};
```

When you build a new workflow, ALWAYS:

- Add it to `lib/agents/index.ts` (the registry).
- Add a card row in `app/(dashboard)/page.tsx`.
- Add zod-validated MCP responses in the prompt; don't trust loose JSON.
- Pin connector list explicitly — never pass `connectors: "all"`.
- Default tone to "warm professional, Irish English" if tenant has no override.

## Tenant model

```ts
// lib/db/schema.ts (excerpt)
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkOrgId: text("clerk_org_id").unique().notNull(),
  businessName: text("business_name").notNull(),
  country: text("country").default("IE"),       // IE or GB-NIR
  currency: text("currency").default("EUR"),
  vatRates: jsonb("vat_rates").$type<number[]>(), // [23, 13.5, 9, 0]
  toneOfVoice: text("tone_of_voice"),
  approverIds: jsonb("approver_ids").$type<string[]>(), // Clerk user IDs
  createdAt: timestamp("created_at").defaultNow(),
});

export const connectorGrants = pgTable("connector_grants", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  connector: text("connector").notNull(), // "quickbooks", "gmail", ...
  grantedByUserId: text("granted_by_user_id").notNull(), // Clerk
  grantedAt: timestamp("granted_at").defaultNow(),
  scopes: jsonb("scopes").$type<string[]>(),
  encryptedTokens: text("encrypted_tokens").notNull(), // AES-GCM, key in env
  expiresAt: timestamp("expires_at"),
  status: text("status").default("healthy"), // healthy | reauth_needed | revoked
});

export const workflowRuns = pgTable("workflow_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  workflowName: text("workflow_name").notNull(),
  triggeredBy: text("triggered_by").notNull(), // "owner:userId" | "schedule" | "admin"
  triggeredAt: timestamp("triggered_at").defaultNow(),
  status: text("status").notNull(), // proposed | partially_approved | completed | failed
  plan: jsonb("plan"), // raw agent output
});

export const pendingApprovals = pgTable("pending_approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  runId: uuid("run_id").references(() => workflowRuns.id).notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  action: text("action").notNull(), // human-readable summary
  toolCallSpec: jsonb("tool_call_spec").notNull(), // the exact tool call to replay on approval
  proposedAt: timestamp("proposed_at").defaultNow(),
  decidedAt: timestamp("decided_at"),
  decidedByUserId: text("decided_by_user_id"),
  decision: text("decision"), // approved | rejected | edited
  editedSpec: jsonb("edited_spec"),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  runId: uuid("run_id"),
  approvalId: uuid("approval_id"),
  actor: text("actor").notNull(), // userId or "system"
  event: text("event").notNull(),  // run.started | approval.approved | action.executed | etc
  payload: jsonb("payload"),
  at: timestamp("at").defaultNow(),
});
```

Always scope queries by tenant. `lib/auth/org.ts` exports `getCurrentOrg()` which throws if there's no Clerk org on the request — call it at the top of every server function.

Use Postgres Row-Level Security (RLS) for defence in depth — `lib/db/rls.sql` creates the policies. Run it as part of migrations.

## MCP connectors

```ts
// lib/mcp/registry.ts
export const MCP_REGISTRY = {
  quickbooks: {
    url: process.env.MCP_QUICKBOOKS_URL!,
    authType: "oauth",
    scopes: ["com.intuit.quickbooks.accounting"],
  },
  gmail: {
    url: process.env.MCP_GMAIL_URL!,
    authType: "oauth",
    scopes: ["gmail.modify", "gmail.send"],
  },
  hubspot: {
    url: process.env.MCP_HUBSPOT_URL!,
    authType: "oauth",
    scopes: ["crm.objects.contacts.read", "crm.objects.deals.read", "crm.objects.contacts.write"],
  },
  // ...
} as const;
```

When the user grants a connector in the UI, we OAuth into the underlying SaaS, encrypt the tokens with the per-tenant key, and store in `connector_grants`. At workflow-run time, the runner fetches and decrypts the tokens, attaches them to the MCP server call.

## Coding conventions

- **TypeScript strict.** No `any` — if you need to, use `unknown` and narrow.
- **Server actions over API routes** for owner-facing mutations. API routes only for webhooks and the run endpoint (which the scheduler hits).
- **Drizzle, not Prisma.** Schema lives in `lib/db/schema.ts`. Migrations in `/drizzle/`.
- **shadcn/ui** for components. `components.json` is committed.
- **Tailwind v4.** Use design tokens from `app/globals.css`. Don't add per-component CSS files.
- **No bullets in marketing copy.** Use prose. (Carry over from the &Again house style.)
- **Sentence case** everywhere — page titles, buttons, table headers. Never title-case.

## Things you'll be asked to build, in priority order

1. **Onboarding flow** — Clerk org creation, first connector grant, "Welcome, here's how this works" stepper.
2. **Workflow card** + **Run now** button + plan rendering.
3. **Approval queue** with diff view, Approve / Reject / Edit.
4. **Audit log** with CSV export.
5. **Connector status page** with re-auth flow.
6. **Schedules** UI (cron picker + timezone, default Europe/Dublin).
7. **Owner email digests** (Resend integration).
8. **More workflow agent files** — one PR each, follow the contract above.
9. **& Again admin** routes for cross-tenant operations.
10. **Revenue/ROS MCP server** in `lib/mcp/servers/` once the SMB workflows are working.

## What to push back on

If you're asked to add any of these, raise a question before implementing:

- A chat interface for the owner. (Re-read the top of this file.)
- Cross-tenant data access without superadmin role check.
- Auto-executing actions that aren't in the safe-list (`lib/runner/safe-list.ts`).
- Storing connector tokens unencrypted.
- Bypassing the approval lifecycle "just for read-only".
- Hardcoding tenant-specific config in agent files.

## Useful prompts to ask Claude Code

> "Build the approval-queue page following the contract in CLAUDE.md. Use shadcn/ui card and button components. The diff view should show before/after for edits and full content for new actions."

> "Implement `lib/runner/execute.ts` — it should look up the pending approval, decrypt the tenant's connector tokens, replay the tool call via the Agent SDK with permission_mode: auto for this call only, write the result to audit_log, and update the approval row's decision."

> "Add a new workflow agent for monthly-close following the same pattern as invoice-chase.ts. Connectors: quickbooks, stripe, paypal. The output schema should include a reconciliation summary with matched/unmatched counts."

Always check this file is still the source of truth before starting work. Update it if conventions change.
