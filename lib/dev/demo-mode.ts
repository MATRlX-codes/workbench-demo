// lib/dev/demo-mode.ts
//
// Public demo flag. When NEXT_PUBLIC_DEMO_MODE === "true" the app runs as a
// fully client-side mock with NO authentication and NO database — safe to
// deploy as a shareable link (e.g. Vercel) for prospective clients.
//
// Unlike MOCK_MODE (server-only), this is a NEXT_PUBLIC_ var so it can be read
// in the browser, middleware (edge) and server components alike. It is inlined
// at build time.
//
// Leave it unset (or "false") for normal development, which keeps Clerk auth
// and the Postgres-backed flows fully intact.

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
