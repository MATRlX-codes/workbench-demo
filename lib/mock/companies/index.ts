// lib/mock/companies/index.ts
// Registry of all demo companies, one per major trade vertical.

import type { CompanyProfile, FeatureKey } from "./types";
import { northgate } from "./northgate";
import { calderwood } from "./calderwood";
import { brightwire } from "./brightwire";
import { hartley } from "./hartley";
import { summit } from "./summit";
import { pennington } from "./pennington";

export const COMPANIES: CompanyProfile[] = [
  northgate,
  calderwood,
  brightwire,
  hartley,
  summit,
  pennington,
];

export const DEFAULT_COMPANY_ID = "northgate";

export function getCompany(id: string): CompanyProfile {
  return COMPANIES.find((c) => c.id === id) ?? northgate;
}

export function hasFeature(company: CompanyProfile, feature: FeatureKey): boolean {
  return company.features.includes(feature);
}

export type { CompanyProfile, FeatureKey } from "./types";
