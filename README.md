# Workbench

Multi-tenant SaaS dashboard wrapping Claude for Small Business in a click-driven UI for Irish SMBs.

Owner clicks "Run weekly close". Claude proposes the actions. Owner approves. Workbench executes via the granted MCP connectors. Every step is audited.

This repo is the working build. The product plan lives in `../workbench-plan.md`. The visual prototype lives in `../workbench-prototype.html`.

## Quick start

```bash
# 1. Install
pnpm install

# 2. Set up env
cp .env.example .env.local
# Fill in: ANTHROPIC_API_KEY, CLERK keys, DATABASE_URL, MCP server URLs

# 3. Database
pnpm db:generate
pnpm db:migrate
pnpm db:seed   # creates &Again's own tenant + a demo tenant

# 4. Run
pnpm dev
```

Open <http://localhost:3000>. Sign in with Clerk (use a personal email for the &Again admin account).

## What's wired vs not

| Area | Status |
|---|---|
| Next.js 15 App Router | ✅ scaffolded |
| Clerk auth + Organizations | ✅ scaffolded |
| Drizzle schema (tenants, runs, approvals, audit) | ✅ stub |
| One workflow agent (invoice-chase) | ✅ stub — needs Anthropic SDK wiring |
| Workflow runner (build → run → persist) | 🟡 stubbed, needs implementation |
| Approval queue UI | 🟡 page exists, components stubbed |
| Connector OAuth flows | ❌ each connector needs its own route handler |
| MCP server wiring | ❌ depends on which MCPs you adopt |
| Scheduling (Inngest) | ❌ Phase 2 |
| Email digests (Resend) | ❌ Phase 2 |

The hand-off point for Claude Code is: read `CLAUDE.md`, then pick the next 🟡 or ❌ item and ask Claude Code to implement it following the contract in that file.

## Folder layout

See `CLAUDE.md`.

## Why a no-chat UI

See the parent `workbench-plan.md`. Short version: SMB owners don't want to learn prompting, they want to click "Chase invoices" and approve what comes out.

## Important conventions

- **Sentence case** everywhere.
- **No bullets in marketing copy.** Use prose.
- **Strict TypeScript.** No `any`.
- **Tenant-scope every query.** Use `getCurrentOrg()`.
- **Audit every action.** Never bypass `lib/runner/execute.ts`.

## License

UNLICENSED — proprietary to & Again.
