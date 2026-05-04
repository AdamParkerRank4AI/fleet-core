# Module Catalog

Modules are opt-in. List them in `manifest.modules` and the build wires
them in. Skipping a module means none of its routes, components or build
steps are touched.

## Always-on (not modules)

These are baseline. Every site gets them, no manifest entry required:

- `BaseLayout` head + meta + canonical + OG + Twitter
- `SchemaGraph` (Person + Organization + WebSite + WebPage)
- `FAQ`, `AuthorBox`, `Breadcrumbs`, `AIComprehension`, `CopyForAI`,
  `CredibilityBar`, `SpeakableSchema`
- `robots.txt` (live or pre-launch variant based on `preLaunch`)
- `llms.txt` skeleton (each site customises in repo)
- Sitemap generation (Astro `@astrojs/sitemap`)
- IndexNow + Google Indexing API hooks (per-site scripts)

## Opt-in modules

### `location`

Adds `<LocationHub>` (Mapbox UK map with pinned cities), `<CityPage>`
template, and a `cities.json` data loader. Used to surface `/uk/` style
hub pages and city-by-city landers.

Manifest:
```ts
modules: ["location"],
citiesFile: "src/data/cities.json",
```

### `multilingual`

Wires Astro's i18n routing, `<LangSwitcher>`, hreflang generation, and
translated-page detection. Two scope modes:

- `landing_pages_only` (recommended): English canonical + ~12 translated
  landing pages per language. Lower maintenance, faster ship.
- `full`: every page translated. 4x maintenance burden. Only choose this
  when there is a clear cohort that needs a fully native experience.

Manifest:
```ts
modules: ["multilingual"],
multilingual: {
  languages: ["pa", "hi", "gu", "ur"],
  scope: "landing_pages_only",
  canonicalLocale: "en-GB",
}
```

### `postcode_lookup`

Adds `<PostcodeLookup>` component. Uses `postcodes.io` (free, no auth)
to resolve UK postcode to district / region. Used to gate CTAs by area,
or to route to the right partner in combi sites.

Manifest:
```ts
modules: ["postcode_lookup"],
```

### `calculators`

Adds `<Calculator>` component shell. Each site supplies its own
calculation logic and field config in `src/data/calculators/<slug>.ts`.

Manifest:
```ts
modules: ["calculators"],
```

### `review_widget`

Adds Trustpilot business widget. Requires `TRUSTPILOT_BUSINESS_UNIT` env
var. Renders nothing if missing (graceful degrade).

Manifest:
```ts
modules: ["review_widget"],
```

### `lead_form`

Adds `<LeadForm>` component shell + post handler. Requires `partnersFile`
to be set. Form posts to FormSubmit by default; can be configured to a
client CRM endpoint via manifest.

Manifest:
```ts
modules: ["lead_form"],
partnersFile: "src/data/partners.json",
```

### `newsletter`

Adds `<NewsletterSignup>` component, posting to a configured endpoint
(Mailchimp, ConvertKit, FormSubmit).

Manifest:
```ts
modules: ["newsletter"],
```

### `comparison_table`

Adds `<ComparisonTable>` component for `vs` / `alternatives` pages.
Reads from a per-page data prop or from `src/data/comparisons/<slug>.ts`.

Manifest:
```ts
modules: ["comparison_table"],
```

## Adding a module to an existing site

```bash
# Add to manifest.modules
# Then run:
/site-add-module location
```

The slash command stitches in any required components, data files, and
build steps. It will not duplicate work if a module is already wired.

## Proposing a new module

A pattern is worth adding to fleet-core when at least 2 sites need it
and the implementation is more than ~50 lines. Otherwise keep it
site-local.

For a new module, write the spec into this file first, then implement.
The spec should answer:

1. What component(s) does it add?
2. What manifest fields does it consume?
3. Does it add routes, data files, env vars, or scripts?
4. How does it degrade when env vars / data are missing?
