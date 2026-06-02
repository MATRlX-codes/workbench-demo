"use client";

/**
 * A shared chase list — customers/invoices Dean has flagged for a
 * polite follow-up. Surfaced on Today, written to by Money + Today.
 */

import { createContext, useContext, useState, ReactNode } from "react";

export interface ChaseEntry {
  id: string;
  customer: string;
  invoiceRef?: string;
  amount?: string;        // e.g. "£2,180"
  reason: string;         // why it's on the list
  addedAt: Date;
  source: "today-risk" | "money-overdue" | "money-due" | "manual";
  status: "pending" | "sent" | "snoozed";
}

const INITIAL_CHASE_LIST: ChaseEntry[] = [
  {
    id: "ch1",
    customer: "Carter Joinery",
    invoiceRef: "INV-3041",
    amount: "£1,180",
    reason: "First chase escalated · 21 days overdue",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    source: "money-overdue",
    status: "sent",
  },
  {
    id: "ch2",
    customer: "Highbridge Lettings",
    invoiceRef: "INV-3076",
    amount: "£640",
    reason: "Second chase due Friday",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    source: "money-overdue",
    status: "snoozed",
  },
];

interface Ctx {
  entries: ChaseEntry[];
  add: (entry: Omit<ChaseEntry, "id" | "addedAt" | "status">) => void;
  markSent: (id: string) => void;
  snooze: (id: string) => void;
  remove: (id: string) => void;
  count: number;
}

const ChaseCtx = createContext<Ctx | null>(null);

/** Seed shape stored in company profiles (addedAt expressed as hours-ago). */
export interface SeedChaseEntry extends Omit<ChaseEntry, "addedAt"> {
  addedHoursAgo: number;
}

function seedToEntries(seed: SeedChaseEntry[]): ChaseEntry[] {
  return seed.map(({ addedHoursAgo, ...rest }) => ({
    ...rest,
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * addedHoursAgo),
  }));
}

export function ChaseProvider({
  children,
  seed,
}: {
  children: ReactNode;
  /** Per-company chase list. Falls back to the original Northgate set. */
  seed?: SeedChaseEntry[];
}) {
  const [entries, setEntries] = useState<ChaseEntry[]>(
    seed ? seedToEntries(seed) : INITIAL_CHASE_LIST
  );

  function add(entry: Omit<ChaseEntry, "id" | "addedAt" | "status">) {
    setEntries((prev) => [
      {
        ...entry,
        id: `ch-${Date.now()}`,
        addedAt: new Date(),
        status: "pending",
      },
      ...prev,
    ]);
  }
  function markSent(id: string) {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status: "sent" } : e));
  }
  function snooze(id: string) {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status: "snoozed" } : e));
  }
  function remove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <ChaseCtx.Provider value={{ entries, add, markSent, snooze, remove, count: entries.length }}>
      {children}
    </ChaseCtx.Provider>
  );
}

export function useChaseList() {
  const ctx = useContext(ChaseCtx);
  if (!ctx) throw new Error("useChaseList outside ChaseProvider");
  return ctx;
}
