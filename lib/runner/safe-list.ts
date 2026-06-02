// lib/runner/safe-list.ts
//
// The allowlist of tool names that are permitted in auto-execute mode.
// Only tool calls whose toolName appears in this set can be replayed without
// manual approval. Everything else requires an explicit owner decision in the
// approval queue.
//
// Add entries conservatively — only read-only operations and write operations
// that are truly reversible (e.g. creating a Gmail draft, not sending an email).

export const SAFE_LIST = new Set([
  // Gmail — read and draft only. Never send.
  "gmail.create_draft",
  "gmail.update_draft",

  // QuickBooks — read only.
  "quickbooks.read_invoices",
  "quickbooks.read_accounts",
  "quickbooks.read_transactions",

  // HubSpot — read and non-destructive writes.
  "hubspot.create_contact",
  "hubspot.update_contact",
  "hubspot.read_contacts",
  "hubspot.read_deals",

  // Stripe — read only.
  "stripe.read_payouts",
  "stripe.read_transactions",

  // PayPal — read only.
  "paypal.read_transactions",

  // Google Calendar — read and create (not delete/modify existing).
  "google_calendar.read_events",
  "google_calendar.create_event",
]);

/**
 * Returns true if the given tool name is on the auto-execute allowlist.
 * Use this check in execute.ts before replaying a tool call with
 * permissionMode: "auto".
 */
export function isSafe(toolName: string): boolean {
  return SAFE_LIST.has(toolName);
}
