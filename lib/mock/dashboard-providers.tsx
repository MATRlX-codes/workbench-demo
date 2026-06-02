"use client";

// lib/mock/dashboard-providers.tsx
// Bridges the active company into the Approval and Chase providers. Both are
// re-mounted (via `key`) whenever the company changes so their internal state
// reseeds from the new tenant's mock data.

import { ReactNode } from "react";
import { useCompany } from "@/lib/mock/company-context";
import { ApprovalProvider } from "@/lib/mock/approvals";
import { ChaseProvider } from "@/lib/mock/chase-list";

export function DashboardProviders({ children }: { children: ReactNode }) {
  const { company, companyId } = useCompany();

  return (
    <ApprovalProvider key={`ap-${companyId}`} seed={company.approvals}>
      <ChaseProvider key={`ch-${companyId}`} seed={company.chase}>
        {children}
      </ChaseProvider>
    </ApprovalProvider>
  );
}
