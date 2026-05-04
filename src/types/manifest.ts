/**
 * Fleet-core types.
 *
 * Every site has a `site.manifest.ts` at repo root that exports a
 * SiteManifest. `defineSite()` is the type-safe constructor.
 */

export type FleetTier = "main" | "owned" | "leadgen" | "client" | "idea";

export type SiteState =
  | "scaffolded"
  | "content_complete"
  | "partner_ready"
  | "commercially_ready";

export type ModuleName =
  | "location"
  | "multilingual"
  | "postcode_lookup"
  | "calculators"
  | "review_widget"
  | "lead_form"
  | "newsletter"
  | "comparison_table";

export interface AuthorConfig {
  name: string;
  initials: string;
  role: string;
  bio: string;
  bylineLink?: string;
  knowsAbout?: string[];
  sameAs?: string[];
}

export interface AddressConfig {
  streetAddress?: string;
  locality: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
}

export interface CredibilityConfig {
  sources: string[];
  itemCount?: { label: string; n: number };
  updatedLabel?: string;
  bullets?: string[];
}

export interface SiteConfig {
  domain: string;
  siteUrl: string;
  name: string;
  alternateNames?: string[];
  legalName: string;
  legalNumber?: string;
  description: string;
  disambiguatingDescription?: string;

  entityType: "Organization" | "Person" | "LocalBusiness";
  foundingDate?: string;

  author: AuthorConfig;
  address?: AddressConfig;

  topic: string;
  knowsAbout: string[];
  sameAs?: string[];

  credibility?: CredibilityConfig;

  brandColorClass?: string;
  defaultLocale?: string;
  defaultDateModified?: string;
}

export interface MultilingualConfig {
  languages: string[];
  scope: "full" | "landing_pages_only";
  canonicalLocale: string;
}

export interface SiteManifest {
  slug: string;
  tier: FleetTier;
  state: SiteState;
  config: SiteConfig;
  modules: ModuleName[];
  multilingual?: MultilingualConfig;
  partnersFile?: string;
  citiesFile?: string;
  preLaunch: boolean;
}

export function defineSite(m: SiteManifest): SiteManifest {
  return m;
}
