"use client";

// lib/mock/company-context.tsx
// Client context that holds the active demo company. The top-right switcher
// changes it; every page reads its mock data from useCompany(). The active id
// is persisted to localStorage so a refresh keeps the chosen tenant.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { COMPANIES, DEFAULT_COMPANY_ID, getCompany } from "./companies";
import type { CompanyProfile, FeatureKey } from "./companies/types";

const STORAGE_KEY = "workbench.activeCompany";

interface CompanyCtx {
  company: CompanyProfile;
  companyId: string;
  companies: CompanyProfile[];
  setCompanyId: (id: string) => void;
  hasFeature: (feature: FeatureKey) => boolean;
  /** True once the localStorage value has been read on the client. */
  hydrated: boolean;
}

const Ctx = createContext<CompanyCtx | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  // Start from the default so server and first client render match (no
  // hydration mismatch). The stored value is applied in useEffect.
  const [companyId, setCompanyIdState] = useState<string>(DEFAULT_COMPANY_ID);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && COMPANIES.some((c) => c.id === stored)) {
        setCompanyIdState(stored);
      }
    } catch {
      /* localStorage unavailable — stay on default */
    }
    setHydrated(true);
  }, []);

  function setCompanyId(id: string) {
    setCompanyIdState(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }

  const company = getCompany(companyId);

  const value: CompanyCtx = {
    company,
    companyId,
    companies: COMPANIES,
    setCompanyId,
    hasFeature: (feature) => company.features.includes(feature),
    hydrated,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCompany() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
