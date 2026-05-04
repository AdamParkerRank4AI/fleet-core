# Migration Guide — moving an existing site to fleet-core

This is the recipe for moving a site that was built before fleet-core
existed (so: all 6 current Astro sites) onto the shared baseline.

## Risk profile per site

| Site | State | Risk | Order |
| --- | --- | --- | --- |
| BBL | pre-launch | low (zero customer impact) | **pilot** |
| FundBiz | pre-launch | low | next |
| CardMachines | pre-launch | low | next |
| MI | live, real lead capture | medium | careful, test in branch |
| SC | live, daily traffic | medium | careful |
| R4 | live, agency home | high (different layout pattern, predates BaseLayout) | last |
| Rochelle / clients | live, client-owned | high (client signoff per change) | only after fleet sites |

Recommended order: BBL pilot → if clean, mirror to FB + CM → MI in branch
with side-by-side preview → SC → R4 → clients.

## Prerequisites

1. Each site's `package.json` adds `"@rank4ai/fleet-core": "^0.1.0"` to
   dependencies. While the package is unpublished, install with a path:
   `npm install ~/fleet-core` (creates a file: link).
2. Each site has a `site.manifest.ts` at repo root. See "Build the
   manifest" below.
3. `astro.config.mjs` has `site: "https://your-domain.tld"` set (so
   Breadcrumbs and SchemaGraph can pick up `Astro.site`).

## Build the manifest

Worked example for Market Invoice:

```ts
// site.manifest.ts at repo root
import { defineSite } from "@rank4ai/fleet-core/types";

export default defineSite({
  slug: "market-invoice",
  tier: "owned",
  state: "commercially_ready",
  preLaunch: false,
  modules: ["calculators", "lead_form", "comparison_table"],
  partnersFile: "src/data/partners.json",
  config: {
    domain: "marketinvoice.co.uk",
    siteUrl: "https://marketinvoice.co.uk",
    name: "Market Invoice",
    alternateNames: ["MarketInvoice.co.uk", "Market Invoice UK"],
    legalName: "Best Business Loans Ltd",
    legalNumber: "16833937",
    description: "The UK's whole of market invoice finance comparison, helping businesses find the right factoring or invoice discounting provider.",
    disambiguatingDescription: "Market Invoice (marketinvoice.co.uk) is an independent UK invoice finance comparison website launched in 2025 by Best Business Loans Ltd. Not affiliated with the historical MarketInvoice peer-to-peer platform (rebranded to MarketFinance in 2018, Kriya in 2022, acquired by Allica Bank in 2025).",
    entityType: "Organization",
    foundingDate: "2025",
    topic: "invoice finance",
    knowsAbout: [
      "invoice finance", "factoring", "invoice discounting",
      "selective invoice finance", "asset-based lending"
    ],
    sameAs: [
      "https://find-and-update.company-information.service.gov.uk/company/16833937"
    ],
    address: {
      streetAddress: "Cust Hall, Toppesfield",
      locality: "Halstead",
      region: "Essex",
      postalCode: "CO9 4EB",
      countryCode: "GB",
    },
    author: {
      name: "Oliver Mackman",
      initials: "OM",
      role: "Director",
      bio: "Oliver leads Market Invoice's editorial and comparison research. With a background in UK commercial finance, he oversees provider analysis, rate verification, and industry reporting across all verticals.",
      bylineLink: "/authors/oliver-mackman/",
      knowsAbout: [
        "invoice finance", "factoring", "invoice discounting",
        "working capital", "business finance", "UK SME lending"
      ],
      sameAs: [
        "https://find-and-update.company-information.service.gov.uk/officers/dKHZEH-n1H5BVmR2rILJcCJbzY4/appointments"
      ],
    },
    credibility: {
      sources: ["UK Finance", "ABFA", "Business Money", "FundInvoice", "BCR Publishing", "The Gazette"],
      itemCount: { label: "providers compared", n: 85 },
      updatedLabel: "Updated April 2026",
    },
    defaultLocale: "en-GB",
  },
});
```

## Component-by-component swap

For each component you currently inline:

### `FAQ`, `CopyForAI`, `CredibilityBar`

Drop-in replacement.

```diff
- import FAQ from "../components/FAQ.astro";
+ import FAQ from "@rank4ai/fleet-core/components/FAQ.astro";
```

`CredibilityBar` now takes its source list from props rather than hardcoded
inside the component. Pass `siteConfig.config.credibility.*`.

### `AuthorBox`

Now takes an `author` prop. Pass `siteConfig.config.author`:

```diff
- <AuthorBox dateModified={date} />
+ <AuthorBox author={siteConfig.config.author} brandLine={siteConfig.config.name} dateModified={date} />
```

### `Breadcrumbs`

Reads siteUrl from `Astro.site` (set in `astro.config.mjs`) so no prop
changes needed, just the import path.

### `AIComprehension`

The sr-only crawler block was previously hardcoded. Now passed via
`crawlerContext` prop:

```diff
- <AIComprehension directAnswer="..." aiSummary="..." scope="..." boundaries="..." />
+ <AIComprehension
+   directAnswer="..."
+   aiSummary="..."
+   scope="..."
+   boundaries="..."
+   topic={siteConfig.config.topic}
+   crawlerContext={`Independent comparison published by ${siteConfig.config.name} (${siteConfig.config.siteUrl}). Author: ${siteConfig.config.author.name}, ${siteConfig.config.author.role}, ${siteConfig.config.legalName}. Sources: ${siteConfig.config.credibility?.sources.join(", ")}.`}
+ />
```

A small helper `buildCrawlerContext(config)` could live in each site's
`src/lib/` to keep this tidy.

### `SpeakableSchema`

Now takes `site` (the SiteConfig):

```diff
- <SpeakableSchema title={title} description={desc} dateModified={date} />
+ <SpeakableSchema title={title} description={desc} site={siteConfig.config} dateModified={date} />
```

### `BaseLayout`

This is the biggest change. The fleet-core BaseLayout is a head + skeleton
shell. Site-specific chrome (header, footer, brand ticker, floating CTA)
moves to slots.

Before (MI):
```astro
---
import "../styles/global.css";
import BaseRateTicker from "../components/BaseRateTicker.astro";
import FloatingCTA from "../components/FloatingCTA.astro";
const { title, description, dateModified } = Astro.props;
---
<html>
  <head>{ /* lots of meta + inline schema */ }</head>
  <body>
    <BaseRateTicker />
    <header>{ /* full nav */ }</header>
    <main><slot /></main>
    <footer>{ /* full footer */ }</footer>
    <FloatingCTA />
  </body>
</html>
```

After:
```astro
---
import "../styles/global.css";
import FleetBaseLayout from "@rank4ai/fleet-core/layouts/BaseLayout.astro";
import siteConfig from "../../site.manifest";
import BaseRateTicker from "../components/BaseRateTicker.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import FloatingCTA from "../components/FloatingCTA.astro";

const { title, description, canonical, dateModified, schema } = Astro.props;
---
<FleetBaseLayout
  site={siteConfig.config}
  title={title}
  description={description}
  canonical={canonical}
  dateModified={dateModified}
  schemaExtra={schema ? [schema] : undefined}
  preLaunch={siteConfig.preLaunch}
>
  <Fragment slot="head">
    {/* Site-specific head additions: gtag, fonts, etc. */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <script type="text/partytown" async src="..."></script>
  </Fragment>

  <Fragment slot="header">
    <BaseRateTicker />
    <Header />
  </Fragment>

  <slot />

  <Fragment slot="footer">
    <Footer />
  </Fragment>

  <Fragment slot="after-footer">
    <FloatingCTA />
  </Fragment>
</FleetBaseLayout>
```

The schema graph is now generated by SchemaGraph from the manifest, so
the inline @graph block in the old BaseLayout is deleted.

## Verify before merging

1. `npm run build` — site builds clean
2. View source on home + 1 article page; confirm:
   - `<title>` matches
   - canonical URL correct
   - `application/ld+json` blocks: graph (Org+Person+WebSite+WebPage) + any page-specific (FAQPage, BreadcrumbList, Article+Speakable)
   - OG + Twitter tags present
3. Diff sitemap.xml against the previous build (should be unchanged)
4. Diff `dist/` page count against previous build
5. Validate the schema in Google's Rich Results Test on 3 sample URLs
6. Check llms.txt + robots.txt unchanged (those stay site-managed for now)

## Rollback

The migration is per-component. Reverting one swap is one edit. If the
build breaks, `git checkout` the changed files; the package.json
dependency on fleet-core is harmless until something imports from it.
