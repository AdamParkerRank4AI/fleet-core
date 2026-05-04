# @rank4ai/fleet-core

Shared baseline for every Rank4AI fleet site. One package, one source of truth.

## Who consumes this

| Tier | Examples | Notes |
| --- | --- | --- |
| Main | rank4ai.co.uk | The agency. |
| Fleet (owned) | seocompare.co.uk, marketinvoice.co.uk | Sites Rank4AI Ltd keeps. |
| Fleet leadgen | bestbusinessloans.co.uk, fundbiz.co.uk, cardmachines.co.uk | Built to sell or run. |
| Fleet client | rochellemarashi.com, mymortgagebroker.co.uk | Owned by the client. Care: branding + compliance overrides. |
| Fleet ideas | (research only) | No site yet. Lives in `niches.md`. |

## What it provides

- Generic, AI-search-ready components: `FAQ`, `AuthorBox`, `Breadcrumbs`, `AIComprehension`, `CopyForAI`, `CredibilityBar`, `SpeakableSchema`
- A `BaseLayout` shell that consumes a per-site `SiteConfig` and emits a full schema graph
- Templates: `robots-live.txt`, `robots-prelaunch.txt`, `llms.txt`, `llms-full.txt`
- `SiteConfig` and `SiteManifest` TypeScript types
- `MANIFEST_SCHEMA.md`, `MODULE_CATALOG.md`, `MIGRATION_GUIDE.md`

## What it deliberately does NOT provide

- Per-site components (e.g. MI's `BaseRateTicker`, BBL's `LenderReviewCard`, Rochelle's `BookingForm`)
- Deploy / indexing / audit scripts. Those stay per-site.
- Content. Pages, blog posts, data files all live in each site repo.
- Site-specific data (`partners.json`, `cities.json`, `page-dates.json`).

## How a site uses it

Each site has a `site.manifest.ts` at repo root:

```ts
import { defineSite } from "@rank4ai/fleet-core/types";

export default defineSite({
  slug: "market-invoice",
  tier: "owned",
  config: {
    domain: "marketinvoice.co.uk",
    siteUrl: "https://marketinvoice.co.uk",
    name: "Market Invoice",
    legalName: "Best Business Loans Ltd",
    legalNumber: "16833937",
    entityType: "Organization",
    topic: "invoice finance",
    author: { /* ... */ },
    /* ... */
  },
  modules: [],
  state: "commercially_ready",
});
```

Components are imported from the package:

```astro
---
import FAQ from "@rank4ai/fleet-core/components/FAQ.astro";
import AuthorBox from "@rank4ai/fleet-core/components/AuthorBox.astro";
import siteConfig from "../site.manifest";
---

<AuthorBox author={siteConfig.config.author} />
<FAQ items={[/* ... */]} />
```

Site-specific overrides go in the site's own `src/components/`. The fleet-core component is the default; the site wraps or replaces it where needed.

## Drift control

Each site tracks the fleet-core version it's on in package.json. The Monday weekly review surfaces sites that have lagged. Bug fixes ship as a fleet-core minor release; sites update via `npm update @rank4ai/fleet-core`.

## Status

`v0.1.0` (initial). Components lifted from MI's canonical versions. Migration of live sites is gated on per-site approval. See `docs/MIGRATION_GUIDE.md`.
