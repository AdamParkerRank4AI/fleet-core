/**
 * Hreflang generator. Returns an array of <link> tag attribute objects
 * for the current page across all configured languages, plus an
 * x-default that points to the canonical locale.
 *
 * Use in BaseLayout:
 *   import { hreflangsFor } from "@rank4ai/fleet-core/lib/hreflang";
 *   const tags = hreflangsFor(siteUrl, currentPath, languages, canonicalLocale);
 */

export interface HreflangLanguage {
  code: string;
  /** Optional explicit URL; otherwise constructed as siteUrl + /<code>/ + currentPath */
  url?: string;
}

export interface HreflangTag {
  rel: "alternate";
  hreflang: string;
  href: string;
}

export function hreflangsFor(
  siteUrl: string,
  currentPath: string,
  languages: HreflangLanguage[],
  canonicalLocale: string,
): HreflangTag[] {
  const base = siteUrl.replace(/\/$/, "");
  const path = currentPath.startsWith("/") ? currentPath : "/" + currentPath;
  const tags: HreflangTag[] = languages.map((l) => {
    const href = l.url ?? (l.code === canonicalLocale ? `${base}${path}` : `${base}/${l.code}${path}`);
    return { rel: "alternate", hreflang: l.code, href };
  });
  const canonical = languages.find((l) => l.code === canonicalLocale);
  if (canonical) {
    const canonicalHref = canonical.url ?? `${base}${path}`;
    tags.push({ rel: "alternate", hreflang: "x-default", href: canonicalHref });
  }
  return tags;
}
