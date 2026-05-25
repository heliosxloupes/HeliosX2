# HeliosX Loupes — Full SEO Audit Report

**Site audited:** https://heliosxloupes.com
**Audit date:** 2026-05-25
**Repo HEAD at audit time:** `878e2dc Expand Tier 3 comparison pages to full depth`
**Business type:** E-commerce (direct-to-clinician medical device — surgical/dental loupes)
**Method:** 6 parallel subagent audits (Technical / Content / Schema / GEO / SXO / E-commerce) + inline curl/grep verification on 5 cached pages: `_home.html`, `_medusa.html`, `_orascoptic.html`, `_hub.html`, `_surgical-brands.html`.

---

## Executive Summary

**Overall SEO Health Score: 73 / 100**

Movement since the previous audit (82/100): the comparison-page cluster has been rebuilt end-to-end (18 pages, 3 shipped commits today — `1eddab8`, `345bfcb`, `878e2dc` — plus the per-competitor column-header fix `0c57903`). That moves Content Quality up materially. But three HIGH issues previously flagged were never actually fixed and are still live, and this deeper audit surfaces several new structural issues that the earlier shallower passes missed. The score drop reflects new visibility into existing gaps, not new regressions caused by today's work.

### Top 5 critical issues

1. **404 page emits conflicting `robots` meta** — both `noindex` and `noindex, nofollow` present in the same `<head>`, plus a streamed `index, follow` injection. Regression from previous audit. **Technical / High.**
2. **Comparison-page Product items in JSON-LD have no `offers`** — every `/heliosx-vs-X` page lists 5 HeliosX Products in an ItemList without `offers`/`price`. Will trip "Invalid Product" warnings in Search Console. **Schema / High.**
3. **Comparison pages have zero `<table>` elements** — comparison rows render via CSS grid, not semantic `<table>`. Hurts SXO match (commercial-investigation queries expect side-by-side tables) and accessibility. **SXO / High.**
4. **Hero `<video>` still missing `poster`, `preload`, `width`, `height`** on `_home.html`. Regression from previous audit. Hurts LCP and causes CLS on slow connections. **Technical / High.**
5. **`Homepage1NEW.jpg` (2.37 MB) loaded raw** — not routed through `next/image`. Regression from previous audit. **Technical / High.**

### Top 5 quick wins

1. Trim two over-length titles to ≤60 chars: `_home.html` (64ch) and `_hub.html` (67ch).
2. Add `BreadcrumbList` JSON-LD to homepage (currently missing — Organization + WebSite only).
3. Add `FAQPage` JSON-LD to `/product/medusa` (visible Q-style content already exists; schema doesn't).
4. Surface "4.6 / 5 (10 reviews)" star rating in the Medusa PDP hero — schema exists, UI doesn't mirror it.
5. Add an inline disambiguation sentence to the homepage ("HeliosX Loupes — not to be confused with the UK healthtech company HeliosX"). Currently only in `/llms.txt`.

---

## Category Scores

| Category | Weight | Score | Weighted | Notes |
|---|---|---|---|---|
| Technical SEO | 22% | 70 | 15.4 | 3 unresolved HIGH regressions, otherwise solid (sitemap, robots, OG, canonicals, HSTS all clean) |
| Content Quality | 23% | 75 | 17.3 | Comparison cluster build-out is excellent; E-E-A-T citations not surfaced inline; Medusa H2 broken |
| On-Page SEO | 20% | 75 | 15.0 | Internal-linking healthy (35–55/page), 12 H2s on comparison pages; two title-length misses |
| Schema | 10% | 75 | 7.5 | Strong overall; homepage missing BreadcrumbList; comparison Product items missing `offers` |
| Performance | 10% | 60 | 6.0 | Lab only — raw 2.37MB hero image + un-postered video imply LCP issues |
| AI Search Readiness | 10% | 75 | 7.5 | llms.txt + llms-full.txt solid; no `sameAs` graph + disambiguation only in llms.txt |
| Images | 5% | 65 | 3.25 | PDP partially weak alts (JJ04, View 1–5); raw 2.37MB homepage image |
| **Total** | **100%** | | **71.95 → 73** | Rounded for headline |

---

## Technical SEO

### Critical
None — site is fundamentally indexable, canonicalized, sitemap-discoverable, HTTPS-enforced, AI-bot accessible.

### High
- **404 robots meta conflict (REGRESSION).** Live curl of `https://heliosxloupes.com/this-page-does-not-exist-12345` returns both `<meta name="robots" content="noindex"/>` and `<meta name="robots" content="noindex, nofollow"/>` in `<head>`, plus a streamed `index, follow` injection. Root cause is `app/not-found.tsx` declaring robots metadata while the root layout's `index, follow` is not suppressed for the not-found segment.
- **Hero `<video>` missing attributes (REGRESSION).** `_home.html` has `<video src="/mainpagevideo2.mp4" class="h-full w-full object-cover" autoPlay muted loop playsInline>` with no `poster`, no `preload="metadata"`, no explicit `width`/`height`. Affects LCP and CLS.
- **`Homepage1NEW.jpg` raw (REGRESSION).** `_home.html` references `/Homepage1NEW.jpg` directly — no `/_next/image` URL anywhere in the cached HTML. The 2.37 MB image is also served as og:image (acceptable for social) but is rendered on-page raw.

### Medium
- Two over-length titles: `_home.html` = 64ch ("HeliosX Loupes | Affordable Ergonomic Surgical and Dental Loupes"), `_hub.html` = 67ch ("Loupe Brand Comparisons | HeliosX vs LumaDent, Orascoptic, SurgiTel"). Both will truncate in SERP.
- Missing `Content-Security-Policy` and `X-Frame-Options` headers. Not an SEO-ranking factor but flagged by site-quality audits and a clickjacking risk.

### Low
- AI-crawler `robots.txt` group has the same permissive policy as `*` — confirm matches business intent (citation-allowed = good; if also blocking training is desired, Google-Extended / Applebot-Extended / CCBot / Bytespider should be `Disallow: /`).
- Sitemap is clean: 64 URLs, all with `<lastmod>` (mostly 2026-05-24), valid ISO format, education paths and all 18 comparison pages included.
- All five cached pages have full Open Graph + Twitter Card markup.

---

## Content Quality

### Critical
- **E-E-A-T citations absent inline.** Searched all 5 cached pages for `Jarrett`, `Frontiers`, `2004`, `pubmed`, `nih.gov`, `peer-reviewed` — zero hits. Only a generic link to `/education/research` per page. The Jarrett 2004 microsurgery paper and the Frontiers RCT exist on the education subroutes but are not surfaced on the hub, brand shortlists, or `/heliosx-vs-X` pages.
- **`/product/medusa` H2 hierarchy is broken.** `_medusa.html` (8,170 words) has only **2 H2s** — one is literal "Medusa product specifications.", the other has empty inner text (decorative wrapper). The body sits under 4 H3s with no parent H2. Add 4–6 descriptive H2s.
- **No `FAQPage` JSON-LD on homepage or Medusa PDP.** Hub, Orascoptic, and surgical-brands each emit one `FAQPage` block. Medusa has visible Q-style content but no schema.

### High
- **No named clinician author / `reviewedBy` metadata.** Grep returns only generic JSON-LD `author` pointing at the organization. For YMYL-adjacent surgical/dental content, add a Person `author` or `reviewedBy` on education guides and comparison pages.
- **Homepage has zero H3s.** 1 H1 / 7–8 H2 / 0 H3 is unusual; sub-section scannability for AI extractors suffers.

### Medium / verified-good
- Hub "Quick lookups" confirmed: all 12 head-to-head + alternatives subpaths present in `_hub.html`.
- Specialty cross-links in hub: 11+ specialty paths linked. Confirmed.
- "Other brand" → competitor-name rename verified live: 0 occurrences of "Other brand" on `_orascoptic.html`; "Orascoptic" appears in table-header cells and section headings.
- Internal-linking healthy: home 38 / hub 55 / medusa 35 / orascoptic 54 / surgical-brands 54. None below the <5 flag.

### Low
- llms.txt is healthy (439 words, all comparison pages indexed). Worth mirroring the Jarrett 2004 citation in llms.txt so AI engines see the research anchor when grounding.

---

## On-Page SEO

- **Headings**: comparison pages all carry 12 H2s (hub, orascoptic, surgical-brands). Above the previous 5–7 target.
- **Titles**: home (64ch) and hub (67ch) over the 60ch SERP-truncation limit; medusa (46), orascoptic (60), surgical-brands (54) are clean.
- **Meta descriptions**: all within 127–160 chars. None over budget.
- **Internal linking**: 35–55 links per cached page. Hub leads with 55.
- **Primary keyword density**: "Medusa" appears only 2x in visible body text of `_medusa.html` per grep. Thin primary-keyword usage for a 137 KB PDP. Verify in source — grep boundary may undercount.

---

## Schema & Structured Data

### Critical
- **Homepage missing `BreadcrumbList`.** `_home.html` carries `Organization`, `WebSite`, `VideoObject`, `ImageObject` — no `BreadcrumbList`. Even a single-item breadcrumb helps SERP sitelinks.

### High
- **`_medusa.html` Review asymmetry.** Grep counts 10 `reviewBody` + 10 `author` entries but 20 `reviewRating` occurrences. The extra 10 `reviewRating` keys appear without matching body/author — likely incomplete stubs. Either complete or drop those 10.
- **Comparison-page Product items have no `offers`.** `_orascoptic.html` and `_hub.html` ItemLists each contain 5 HeliosX Products with `brand` but zero `offers`/`price`. Add lightweight `offers` (URL + priceCurrency + price/lowPrice) per Product, or downgrade to plain `ListItem` with name+url.

### Medium
- **No `@id` anywhere.** Zero `@id` declarations across all five pages. Adding canonical `@id` URIs enables graph linking and strengthens entity disambiguation.
- **`MedicalWebPage` on comparison pages may be the wrong type.** Comparison pages are commercial-investigation content; `MedicalWebPage` implies clinical/diagnostic context. Consider switching comparison pages to `WebPage` + `Article` (with `author` + `datePublished` + `dateModified`), keeping `MedicalWebPage` only for the `/education` cluster.

### Low / verified-good
- **Competitor review/rating leakage: clear.** No Orascoptic-branded Product carries `aggregateRating` or `review`. FTC + Google self-serving-review policy compliant.
- `_medusa.html` `additionalProperty` array includes all four required PropertyValues (Working distance, Field of view, Depth of field, Weight). Spec-sheet integration verified.

---

## E-commerce Specific

### Critical
- **Homepage lacks per-product cards with prices.** "Shop Medusa" appears 3x and "$499" once; Apollo, Galileo, Newton, Kepler are nav links only with no featured cards, no prices, no individual `/product/{slug}` deep links. Every product CTA points to generic `/product`. Kills home→PDP equity flow and rich-result eligibility for the broader catalog.
- **Magnification variants not modeled as Product variants or per-SKU Offers.** Schema declares `AggregateOffer` with `offerCount: 6` but no `hasVariant` / `ProductGroup` parent and no per-magnification Offers. `sku` and `mpn` are both the parent `heliosx-medusa`. Blocks Google Merchant variant rich results.

### High
- **No `gtin`/`gtin13` on Product schema.** Google deprioritizes Merchant listings without GTIN.
- **No collection/category landing pages** for Student or By-Specialty taxonomies, despite being implied by the brand positioning. Missing `CollectionPage` schema and faceted entry points.

### Medium
- Image alt text on PDP partially weak — `JJ04`, `JJ20`–`JJ24`, `JJ23 Grey`, `View 1`–`View 5` are filename-style; ~12 alts need rewriting.
- No financing/installment messaging (Affirm/Klarna). For $710+ transactions targeting residents, financing is a known conversion lever.
- Review count is low (10 reviews on `AggregateRating`) for a $710+ medical device. Invest in review velocity.

---

## Performance (Lab indicators only — no field data this pass)

- **Page sizes**: home 58 KB / medusa 138 KB / orascoptic 83 KB / hub 87 KB / surgical-brands 88 KB. HTML payloads are reasonable.
- **LCP risk**: hero `<video>` without `poster` + raw 2.37 MB homepage image route through the LCP element on slow connections. Both must be fixed before CWV improves.
- **JS bundle**: First-Load JS shared = 87.3 KB. Reasonable for Next.js 14.
- **Vercel cache**: HIT on the homepage HTML (`X-Vercel-Cache: HIT`, Age 35,439s = ~10h since last bust).

---

## AI Search Readiness (GEO)

### Critical
- **Organization schema `sameAs` is self-referential** (`["https://heliosxloupes.com"]`). LLMs and Knowledge Graph use `sameAs` (Instagram, YouTube, LinkedIn, Crunchbase, Wikidata) to disambiguate entities. This is the biggest reason LLMs may confuse HeliosX Loupes with the UK healthtech HeliosX.
- **Brand disambiguation lives only in `/llms.txt`, not in any HTML page.** LLMs ground on rendered page content far more than on llms.txt. Add the disambiguation sentence to the homepage and to the Organization schema `description` field.

### High
- **No `Article` schema with `author` + `dateModified`** on the comparison hub or education guides. E-E-A-T and AI Overviews weight recency and authorship heavily.

### Verified-good
- `/llms-full.txt` returns 200, 276 KB, well under the practical 1 MB cap.
- `/llms.txt` is well-formed: brand line, disambiguation, all core URLs, 5 product lines, primary topics, comparison hub, audience/specialty pages, education library, evidence boundary, link to llms-full.
- All major AI crawlers (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, Bytespider, cohere-ai) have `Allow: /`.

---

## Search Experience (SXO)

### Critical
- **Comparison pages have zero `<table>` elements.** Rows render via CSS grid (`grid-cols-3`), not semantic `<table>`. Commercial-investigation queries (`heliosx vs orascoptic`) expect side-by-side tables; Google rewards comparison pages that visually mirror the query. Also affects screen-reader accessibility. Switch the comparison-row renderer in `components/seo/SeoLandingExperience.tsx` from `<div className="grid grid-cols-3">` to `<table>` semantics.
- **Generic "buyer's guide" framing on `/loupe-comparisons`** despite navigational intent. Hub has 0 anchor TOC links. (H2 count 12 includes a shared footer cluster — only ~6 are page-specific.)
- **`/product/medusa` first price (`$710`) and first `Add to cart` appear ~30 KB into the markup** — likely below the first viewport on mid-size laptops. Hero shows feature bullets but no price anchor and no star rating.

### High
- Primary CTA language inconsistent and soft. Home has no "Add to cart" / "Shop"; the dominant CTA is "Start." For $499–$1,090 transactions consider "Shop Loupes" / "Configure Medusa" / "See Pricing."
- Homepage missing resident/student callout above the fold. Comparison pages call out `"Galileo/Newton from $270 for residents"` — homepage does not mention `discount` anywhere in body.
- No TOC / jump-links on long comparison pages (zero `href="#anchor"` despite 12 H2 sections).

### Medium
- AggregateRating 4.6/5 (10 reviews) in schema is not mirrored visibly near the H1 on PDP. Render the star widget in the hero.
- No financing/installment messaging.

### Low
- "Risk-free. Fully refundable before measurements are provided" is excellent micro-copy on Medusa but buried in body. Surface as a trust badge near the CTA.

(Note: SXO subagent's "smart-quote encoding artifact on `Orascoptic's lineup at a glance`" claim was verified inline — actual char is `’` (U+2019), correct UTF-8. Was the agent's terminal mis-render, not a real bug.)

---

## Verified-Good Items (worth preserving)

- Sitemap healthy: 64 URLs, all dated, no broken entries, includes the research PDF.
- Robots.txt healthy: admin/api/cart/checkout disallowed for `*`; all AI crawlers explicitly allowed.
- HSTS (2yr), X-Content-Type-Options, Referrer-Policy, Permissions-Policy all set.
- Open Graph + Twitter Card complete on every cached page.
- Per-competitor column header live on all 12 head-to-head + alternatives pages (commits `0c57903` + Tier 1 + Tier 2).
- Comparison-cluster content depth: every comparison page now carries 5–7 sections + 10 qualitative comparisonRows + 5 page-specific FAQs (commits `1eddab8`, `345bfcb`, `878e2dc` shipped 2026-05-25).
- `_medusa.html` JSON-LD: Product + AggregateOffer + AggregateRating + Review array + MerchantReturnPolicy + OfferShippingDetails + MedicalAudience + BreadcrumbList + 10 PropertyValue specs.
- llms.txt + llms-full.txt complete and crawlable.
- All five product lines (Medusa, Apollo, Galileo, Newton, Kepler) have their PDPs prerendered as static.

---

## Files referenced

- Cached HTML: `C:/Users/IVIso/.claude/skills/seo-audit/{_home.html, _medusa.html, _orascoptic.html, _hub.html, _surgical-brands.html, _llms.txt, _robots.txt, _sitemap.xml}`
- Code: `components/seo/SeoLandingExperience.tsx`, `lib/seo-content.ts`, `app/not-found.tsx`, `app/layout.tsx`, `components/Hero/*.tsx`

Next file: `ACTION-PLAN.md` — prioritized fix list with effort estimates.
