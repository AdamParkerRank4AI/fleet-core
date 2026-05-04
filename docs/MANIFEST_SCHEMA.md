# Site Manifest Schema

Every site has a `site.manifest.ts` at repo root. It is the single source
of truth for who the site is, what tier it's on, what bolt-on modules
are wired in, and where it sits in the readiness state machine.

## Top-level shape

```ts
import { defineSite } from "@rank4ai/fleet-core/types";

export default defineSite({
  slug: string,                  // url-safe identifier, matches dashboard clients.json
  tier: "main" | "owned" | "leadgen" | "client" | "idea",
  state: SiteState,              // see "Readiness states" below
  preLaunch: boolean,            // true = noindex robots, no llms.txt, dashboard skips fetchers
  config: SiteConfig,            // see "SiteConfig" below
  modules: ModuleName[],         // bolt-ons to wire in (see MODULE_CATALOG.md)
  multilingual?: MultilingualConfig,
  partnersFile?: string,         // path to partners.json (combi sites)
  citiesFile?: string,           // path to cities.json (location module)
});
```

## SiteConfig fields

### Identity

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `domain` | string | yes | e.g. `marketinvoice.co.uk` |
| `siteUrl` | string | yes | full canonical URL with `https://`, no trailing slash |
| `name` | string | yes | brand name as shown to users |
| `alternateNames` | string[] | no | alternate spellings the AI graph should know about |
| `legalName` | string | yes | the trading entity (Companies House) |
| `legalNumber` | string | no | Companies House number |
| `description` | string | yes | one-paragraph site description (used in OG, schema) |
| `disambiguatingDescription` | string | no | longer disambiguating note when the brand collides with a known entity (Market Invoice = not the old MarketInvoice/MarketFinance/Kriya) |

### Entity type

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `entityType` | `"Organization" \| "Person" \| "LocalBusiness"` | yes | drives the schema graph type |
| `foundingDate` | string | no | year only, e.g. `"2025"` |

### Author / face

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `author.name` | string | yes | full name, used in byline + Person schema |
| `author.initials` | string | yes | for the AuthorBox avatar circle |
| `author.role` | string | yes | e.g. `"Director"`, `"Therapist"` |
| `author.bio` | string | yes | one-paragraph bio |
| `author.bylineLink` | string | no | local link to author page |
| `author.knowsAbout` | string[] | no | semantic tags for E-E-A-T |
| `author.sameAs` | string[] | no | external profile URLs (LinkedIn, X, Companies House officer URL) |

### Address

Optional. Required only for `LocalBusiness` entityType, recommended for
`Organization` to anchor in Google KG.

| Field | Type | Notes |
| --- | --- | --- |
| `address.streetAddress` | string | |
| `address.locality` | string | town / city |
| `address.region` | string | county / state |
| `address.postalCode` | string | |
| `address.countryCode` | string | ISO-3166-1 alpha-2, e.g. `"GB"` |

### Topic and entity links

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `topic` | string | yes | the central topic for AI comprehension blocks |
| `knowsAbout` | string[] | yes | top-level semantic tags for the Organization |
| `sameAs` | string[] | no | external entity profile URLs (Wikidata, Wikipedia, Companies House) |

### Trust signals

| Field | Type | Notes |
| --- | --- | --- |
| `credibility.sources` | string[] | data sources for the CredibilityBar |
| `credibility.itemCount` | `{ label, n }` | e.g. `{ label: "providers compared", n: 85 }` |
| `credibility.updatedLabel` | string | e.g. `"Updated April 2026"` |
| `credibility.bullets` | string[] | overrides default tick bullets if set |

### Defaults

| Field | Type | Notes |
| --- | --- | --- |
| `brandColorClass` | string | tailwind class, e.g. `"text-brand"`. Site sets the brand color in its own tailwind config |
| `defaultLocale` | string | BCP-47 locale, defaults to `"en-GB"` |
| `defaultDateModified` | string | ISO date used as fallback when a page doesn't pass its own |

## Readiness states

| State | What's true | Dashboard behaviour |
| --- | --- | --- |
| `scaffolded` | Skeleton + manifest + topic + 1 page | Tile renders, fetchers skipped |
| `content_complete` | 50-80 pages live, schema valid, all CTAs wired | Fetchers run, internal review |
| `partner_ready` | CTA wired to real partner URL or form, leads tracked | Outreach starts, lead reporting on |
| `commercially_ready` | Trust signals live, 30-day data, ready for sale or production traffic | Domain swap allowed, full reporting |

`preLaunch: true` is independent of state. Common combination:
- `state: "scaffolded"` + `preLaunch: true` (default for new leadgen)
- `state: "content_complete"` + `preLaunch: true` (private review)
- `state: "commercially_ready"` + `preLaunch: false` (live)

## Modules

See `MODULE_CATALOG.md` for the full list. Modules are opt-in and only
wired when listed in `manifest.modules`.

## Multilingual

```ts
multilingual: {
  languages: ["pa", "hi", "gu", "ur"],   // ISO 639-1 codes
  scope: "landing_pages_only",            // or "full"
  canonicalLocale: "en-GB",
}
```

`landing_pages_only` is recommended unless the site has reason to ship
full translation. See MODULE_CATALOG.md `multilingual` for the wiring
recipe.

## Worked example

See `docs/MIGRATION_GUIDE.md` for a complete `site.manifest.ts` based on
Market Invoice's current production config.
