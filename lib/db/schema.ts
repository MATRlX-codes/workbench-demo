// lib/db/schema.ts
//
// Drizzle schema for Workbench. Multi-tenant — every table except the
// global `tenants` and `audit_log` (which scopes via tenantId) has a
// tenantId column and a corresponding RLS policy in lib/db/rls.sql.

import { pgTable, text, uuid, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkOrgId: text("clerk_org_id").unique().notNull(),
  businessName: text("business_name").notNull(),
  country: text("country").$type<"IE" | "GB-NIR">().default("IE").notNull(),
  currency: text("currency").$type<"EUR" | "GBP">().default("EUR").notNull(),
  vatRates: jsonb("vat_rates").$type<number[]>().default([23, 13.5, 9, 0]).notNull(),
  toneOfVoice: text("tone_of_voice"),
  signOff: text("sign_off"),
  approverIds: jsonb("approver_ids").$type<string[]>().default([]).notNull(),
  tier: text("tier").$type<"starter" | "growth" | "established">().default("starter").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const connectorGrants = pgTable("connector_grants", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  connector: text("connector").notNull(),
  grantedByUserId: text("granted_by_user_id").notNull(),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  scopes: jsonb("scopes").$type<string[]>().notNull(),
  encryptedTokens: text("encrypted_tokens").notNull(),
  expiresAt: timestamp("expires_at"),
  status: text("status").$type<"healthy" | "reauth_needed" | "revoked">()
    .default("healthy").notNull(),
});

export const workflowConfigs = pgTable("workflow_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  workflowName: text("workflow_name").notNull(),
  enabled: text("enabled").$type<"yes" | "no">().default("no").notNull(),
  scheduleCron: text("schedule_cron"),
  scheduleTimezone: text("schedule_timezone").default("Europe/Dublin"),
  promptOverrides: jsonb("prompt_overrides").$type<Record<string, string>>(),
  approvalMode: text("approval_mode").$type<"always" | "safe-auto" | "manual">()
    .default("always").notNull(),
});

export const workflowRuns = pgTable("workflow_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  workflowName: text("workflow_name").notNull(),
  triggeredBy: text("triggered_by").notNull(),
  triggeredAt: timestamp("triggered_at").defaultNow().notNull(),
  status: text("status").$type<"proposed" | "partially_approved" | "completed" | "failed">()
    .notNull(),
  plan: jsonb("plan"),
  errorMessage: text("error_message"),
});

export const pendingApprovals = pgTable("pending_approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  runId: uuid("run_id").references(() => workflowRuns.id, { onDelete: "cascade" }).notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  action: text("action").notNull(),
  toolCallSpec: jsonb("tool_call_spec").notNull(),
  proposedAt: timestamp("proposed_at").defaultNow().notNull(),
  decidedAt: timestamp("decided_at"),
  decidedByUserId: text("decided_by_user_id"),
  decision: text("decision").$type<"approved" | "rejected" | "edited" | null>(),
  editedSpec: jsonb("edited_spec"),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  runId: uuid("run_id"),
  approvalId: uuid("approval_id"),
  actor: text("actor").notNull(),
  event: text("event").notNull(),
  payload: jsonb("payload"),
  at: timestamp("at").defaultNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type WorkflowRun = typeof workflowRuns.$inferSelect;
export type PendingApproval = typeof pendingApprovals.$inferSelect;
export type AuditLogRow = typeof auditLog.$inferSelect;
