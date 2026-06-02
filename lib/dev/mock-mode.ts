// lib/dev/mock-mode.ts
//
// Single source of truth for whether mock mode is enabled.
// Read server-side only — never import in client components or use NEXT_PUBLIC_.
//
// Usage:
//   import { MOCK_MODE } from "@/lib/dev/mock-mode";
//   if (MOCK_MODE) { ... }

export const MOCK_MODE = process.env.MOCK_MODE === "true";
