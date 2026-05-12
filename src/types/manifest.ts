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
  email?: string;
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

export interface ContactPointConfig {
  contactType: string;
  email?: string;
  telephone?: string;
  url?: string;
  availableLanguage?: string;
}

export interface OpeningHoursConfig {
  dayOfWeek: string[];
  opens: string;
  closes: string;
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
  /** Additional schema.org types to combine with entityType. Use for sites
   *  whose Organization is also a LocalBusiness + ProfessionalService etc. */
  additionalEntityTypes?: string[];
  /** Logo URL, absolute or site-relative (resolved against siteUrl). */
  logoUrl?: string;
  contactPoint?: ContactPointConfig;
  priceRange?: string;
  openingHours?: OpeningHoursConfig;
  foundingDate?: string;

  author: AuthorConfig;
  /** Optional additional people (co-founders, named contributors). The primary
   *  author is the founder; additional authors are emitted as Person entities
   *  in the @graph alongside the primary, all linked to the Organization via
   *  worksFor. Use for multi-founder sites like Rank4AI. */
  additionalAuthors?: AuthorConfig[];
  /** Optional named expert reviewer with credentials. Renders as a Person on
   *  the WebPage's reviewedBy property. Per the 2026 NerdWallet/Wirecutter
   *  pattern: 96% of AI Overview citations come from sources with strong
   *  E-E-A-T signals + credentialed expert reviewers. */
  reviewedBy?: AuthorConfig;
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
