# HeliosX Loupes — Full SEO Audit Report

**Site audited:** https://heliosxloupes.com
**Audit date:** 2026-05-23
**Repo HEAD at audit time:** `5fc5adb Add intraoperative magnification authority content`
**Method:** Six parallel specialist agents (Technical, Schema, Content/E-E-A-T/GEO, Performance/CWV, On-Page, Ecommerce) against the live production site, with cross-reference against the local repo source of truth at `C:\Users\IVIso\OneDrive\Desktop\HeliosX2_repo`.

> Companion document: [`ACTION-PLAN.md`](./ACTION-PLAN.md) — prioritized P0/P1/P2/P3 task list with effort estimates and file references.

---

## Executive Summary

**Overall SEO Health Score: 56 / 100**

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Content Quality / E-E-A-T | 23% | 5/10 | 11.5 |
| Technical SEO | 22% | 7/10 | 15.4 |
| On-Page SEO | 20% | 6/10 | 12.0 |
| Schema / Structured Data | 10% | 4/10 | 4.0 |
| Performance / CWV | 10% | 5/10 | 5.0 |
| AI Search Readiness | 10% | 5/10 | 5.0 |
| Images | 5% | 6/10 | 3.0 |
| **Total** | | | **55.9** |

**Read of the score:** The foundation is solid — clean HTTPS canonicalization, valid sitemap, HSTS, real product imagery, lean first-party JS (255 KB, no third-party scripts), `llms.txt` convention followed, brand voice survives across SEO pages. The score is dragged down by concentrated execution gaps in five areas, most of which are single-file fixes:

1. Product JSON-LD is missing every Google Merchant requirement → zero rich-result eligibility
2. A 20.7 MB hero video with no caching or `preload` control → punishing mobile LCP
3. Article `datePublished` hardcoded in `lib/seo.ts` → every guide shows the same date
4. Multiple `<h1>` tags rendered on 7+ pages (template defect)
5. E-E-A-T authorship missing site-wide — no named medical reviewer on YMYL content

## Top 5 Critical Issues

1. **20.7 MB autoplay hero video** with `Cache-Control: max-age=0, must-revalidate` — re-downloaded on every visit. No `preload`, no `poster`, no width/height. P0 LCP killer on mobile.
2. **Product schema missing every Merchant requirement** in `lib/seo.ts` `productJsonLd()`: no `sku`/`mpn`/`gtin`, no `aggregateRating`/`review`, no `priceValidUntil`, no `shippingDetails`, no `hasMerchantReturnPolicy`. Price ranges are stuffed into a `priceSpecification.description` string instead of using `AggregateOffer` with `lowPrice`/`highPrice`.
3. **Article `datePublished` hardcoded to `2026-05-23`** in `lib/seo.ts:147` — every education guide reports the same date. Also missing `image` (required for Article rich results) and uses `Organization` as author instead of `Person` (kills YMYL E-E-A-T weighting).
4. **Multiple `<h1>` tags** on at least seven pages: homepage has 4 H1s, every `/loupes-for-*`, `/heliosx-vs-*`, and `/dental-loupes` has 2–5. Template defect where both the page title and the hero sub-heading render as `<h1>`.
5. **`/faq` (and likely other routes) self-canonicalize to `/`** because they lack an explicit `buildMetadata` export and inherit the root layout's canonical. Silently consolidates those pages' SEO signals into the homepage.

## Top 5 Quick Wins

1. Fix the `not-found.tsx` conflicting robots meta (15-minute fix that removes a soft-404 risk signal).
2. Add 301 redirects from bare slugs `/apollo`, `/medusa`, `/galileo`, `/newton`, `/kepler` → `/product/<slug>` (currently 404).
3. Add `BreadcrumbList` + `Organization` schema to `/product/[slug]` — helpers already exist in `lib/seo.ts`, just not invoked in `app/product/[slug]/page.tsx`.
4. Cite the Scotland survey (Jarrett 2004, hosted at `/research/intraoperative-magnification-who-uses-it.pdf`) inline on the 4+ pages where it appears as an orphan stat.
5. Render the `priceLabel` already in `lib/fallback-products.ts` on the `/product` catalogue cards (currently hidden, forcing an extra click).

---

## Technical SEO — 7 / 10

### Working correctly

- **HTTPS canonicalization**: `http://heliosxloupes.com` and `http://www.heliosxloupes.com` both 308 → `https://`; `https://www.` 307 → apex. Single-hop redirects, no chains.
- **HSTS**: `Strict-Transport-Security: max-age=63072000` (2 years) present on every response, including redirects.
- **Indexable pages**: Homepage, `/product/apollo`, `/product/medusa`, `/surgical-loupes`, `/heliosx-vs-orascoptic`, `/education/loupe-magnification-guide` all return `200` + `<meta name="robots" content="index, follow">` + valid self-referential canonicals.
- **Noindex on private areas**: `/cart`, `/checkout`, `/admin/login` all serve `<meta name="robots" content="noindex, nofollow">` (per `app/cart/layout.tsx`, `app/checkout/layout.tsx`, `app/admin/layout.tsx`).
- **robots.txt**: Fetchable, declares sitemap, disallows `/admin`, `/api/`, `/auth/`, `/cart`, `/checkout`, `/measurements/*`.
- **Sitemap**: Valid XML, 57 entries, every URL has `<lastmod>` (ISO 8601), no admin/cart/checkout/api/auth leaks.
- **404 status code**: `/this-page-does-not-exist-12345` returns proper `HTTP/1.1 404 Not Found` (no soft-404).
- **Trailing slash**: 308 redirect from `/path/` → `/path` (Next.js default, consistent).

### Issues

- **HIGH — `/faq` self-canonicalizes to homepage.** `curl https://heliosxloupes.com/faq` returns `<link rel="canonical" href="https://heliosxloupes.com"/>`. `app/faq` has no `buildMetadata`/`alternates` definition, so it inherits the root layout's canonical. Same risk for any sitemap'd page lacking its own metadata export. **Fix:** add `metadata` or `generateMetadata` export to `app/faq/page.tsx` and audit every route under `app/` for missing metadata exports.
- **HIGH — 404 page emits two conflicting `<meta name="robots">` tags** (`noindex` AND `index, follow`). Root-layout indexable tag leaks into `not-found.tsx`. **Fix:** in `app/not-found.tsx` export `metadata = buildMetadata({ noIndex: true })`.
- **MEDIUM — Missing modern security headers.** Homepage response has HSTS only. No `X-Content-Type-Options`, `X-Frame-Options`/CSP `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, or `Content-Security-Policy`.
- **MEDIUM — `/measurements` indexable but `Disallow: /measurements/*` blocks children.** Inconsistent — either remove the disallow or block the root too.
- **MEDIUM — Homepage canonical omits trailing slash** (`https://heliosxloupes.com`) — consistent with sitemap, but Google's preferred root form includes `/`. Low impact, worth normalizing in `lib/seo.ts` `absoluteUrl('/')`.
- **LOW — No `X-Robots-Tag` response header** on `/cart`, `/checkout`, `/admin/*`. Meta-robots in HTML works, but a response header provides defense-in-depth.

---

## Content Quality / E-E-A-T / AI Search Readiness — 5 / 10 (Content) and 5 / 10 (AI)

### AI crawler access (robots.txt)

`User-Agent: *` with `Allow: /` is the only directive. All 10 named AI bots (GPTBot, PerplexityBot, ChatGPT-User, ClaudeBot, CCBot, Google-Extended, anthropic-ai, Applebot-Extended, Bytespider, FacebookBot) default to **ALLOWED**. Pass with caveat — no explicit signal of intent and no telemetry hook for AI-specific rules later.

### llms.txt assessment

- `/llms.txt` conforms to the [llmstxt.org](https://llmstxt.org) convention: single H1, blockquote summary, 8 H2 sections, markdown link lists organized by products / education / comparisons / audiences / research.
- `/heliosx.llm` exists (1.5 KB) as a brand-positioning summary — **served as octet-stream**, so most LLM ingestors will not parse it. Either rename to `.md`/`.txt` or fold into `llms.txt`.
- `llms.txt` lists the research library page but does not deep-link to the Jarrett PDF — the single most citation-worthy asset on the site.

### E-E-A-T scorecard

| Pillar | Score | Evidence |
|---|---|---|
| Experience | 5/10 | Homepage founder narrative present but unsigned ("- Founder," no name/credentials). No surgeon testimonials, no case studies, no named users. Product photography appears authentic (not stock). |
| Expertise | 4/10 | Single peer-reviewed citation (Jarrett 2004) carries the entire authority load. Two PMC IDs on `/education/research`. No named clinical authors/reviewers anywhere on `/education/*`. |
| Authoritativeness | 5/10 | Jarrett 2004 PDF (`/research/intraoperative-magnification-who-uses-it.pdf`) is genuinely hosted and accessible. Good. But `/intraoperative-magnification-by-specialty` derives every specialty claim from this one 22-year-old paper. |
| Trust | 4/10 | No visible footer links to return, shipping, or warranty policies. No About page (story embedded in homepage). No phone/email surfaced — only "we answer within one business day." |

### AI citation readiness (GEO)

**Strengths:**
- `/education/intraoperative-magnification-by-specialty` opens with an AI-extractable summary paragraph and uses Q&A format.
- Named-entity consistency is strong: HeliosX + Medusa/Apollo/Kepler/Galileo/Newton repeated across pages, supporting knowledge-graph formation.
- `llms.txt` is properly structured and present.

**Weaknesses:**
1. **Orphaned Scotland survey claim** appears verbatim on `/surgical-loupes`, `/best-loupes`, `/loupes-for-residents`, and `/education/research` with no inline citation, link, or year. AI engines refuse to cite unsourced stats.
2. **Single-source dependency** — every specialty-frequency claim chains back to Jarrett 2004. Add 2–3 modern sources.
3. **FAQ depth too thin** — `/loupes-for-residents` has 1 Q&A; `/best-loupes` has 2. AI Overview citation pages typically need 6–10.
4. **No magnification specifics by specialty** on the magnification-by-specialty page (no 2.5x / 3.5x / 4.5x recommendations). This is exactly the citable data AI engines want.
5. **No author bylines or "Reviewed by [Name, Credential]"** anywhere — kills medical-content citation eligibility under YMYL guidelines.

### Brand voice

Survives across all spot-checked SEO pages. No drift to generic-luxury copy. Confirmed phrases: *"No gate keeping. Just fair pricing. Elite quality made truly affordable."*, *"skill thrives where access exists"*, *"precision without legacy markups"*, *"approachable systems for students, residents, and daily users."* Pass.

### Thin content flags

- `/heliosx-vs-lumadent`: ~950 words, ~35% templated, **zero hard spec comparisons** (no price, weight, magnification, working distance, warranty cited for either side). Highest thin-content risk in the `/heliosx-vs-*` family.
- `/best-loupes`: repeats the same Scotland-survey paragraph and Medusa/Apollo bullet list also found on `/surgical-loupes` and `/loupes-for-residents`. Cross-page duplication risk.
- `/heliosx-vs-orascoptic` body copy uses generic *"Other brand"* instead of naming Orascoptic — weakens topical relevance for the exact-intent query.

---

## On-Page SEO — 6 / 10

### Head metadata (verified via curl on 8 representative pages)

| URL | Title (chars) | Meta description (chars) | Canonical | OG image |
|---|---|---|---|---|
| `/` | 62 | 154 | self | `/Homepage1NEW.jpg` |
| `/surgical-loupes` | 55 | 158 | self | `/Homepage1NEW.jpg` |
| `/heliosx-vs-orascoptic` | 60 | 152 | self | `/Homepage1NEW.jpg` |
| `/education/loupe-magnification-guide` | 54 | 88 | self | `/Homepage1NEW.jpg` |
| `/product/apollo` | 46 | 113 | self | `/Apollo/ApollomainProduct(Notext).png` |
| `/loupes-for-residents` | 57 | 159 | self | `/Homepage1NEW.jpg` |
| `/best-loupes` | 50 | 154 | self | `/Homepage1NEW.jpg` |
| `/dental-loupes` | 54 | 175 | self | `/Homepage1NEW.jpg` |
| `/heliosx-vs-lumadent` | 58 | 158 | self | `/Homepage1NEW.jpg` |

**Healthy:** titles 46–62 chars (all in range), descriptions 88–175 chars (mostly in range), canonicals self-referential and correct.

**Issue:** OG image is `/Homepage1NEW.jpg` on every non-product page (8 of 9 sampled). Codex's handoff mentioned dynamic OG image routes exist for SEO/education/measurements — they're built but pages aren't pointing to them.

### Body-level findings

| URL | H1 count | First H2 | Internal links (est.) |
|---|---|---|---|
| `/` | **4** | "Ultra customizable - Worldwide shipping" | ~23 |
| `/surgical-loupes` | 1 | "Posture is part of the product" | ~21 |
| `/dental-loupes` | **5** | "Buyer criteria" | ~22 |
| `/best-loupes` | **2** | "Magnification changes by specialty" | ~20 |
| `/affordable-loupes` | **2** | "Affordable without feeling cheap" | ~25 |
| `/loupes-for-residents` | **2** | "Built for" | ~20 |
| `/loupes-for-microsurgery` | **2** | "Choose by workflow" | ~20 |
| `/heliosx-vs-lumadent` | **3** | "Where LumaDent is strong" | ~23 |
| `/orascoptic-alternatives` | **2** | "What to look for in an alternative" | ~17 |
| `/education/loupe-magnification-guide` | 1 | "Lower magnification" | ~11 |
| `/education/intraoperative-magnification-by-specialty` | 1 | "What the survey found" | ~10 |
| `/education/how-to-measure-pupillary-distance` | 1 | "Best measurement sources" | ~8 |

### Issues

- **CRITICAL — Multiple `<h1>` tags on 7+ pages.** Every category/comparison page has both a page-name H1 ("Surgical Loupes") AND a hero-style H1 ("Surgical Loupes without the guesswork."). Homepage has 4 H1s. Template defect — demote secondary headings to `<h2>`.
- **MEDIUM — Repetitive "X without the guesswork." pattern** on 7+ pages. Risks Google collapsing the SEO content cluster as near-duplicates.
- **MEDIUM — Bare-slug 404s** confirmed: `/apollo`, `/galileo` (and likely Medusa/Newton/Kepler) all return 404. Live product canonicals are `/product/<slug>`. If old external links point to bare slugs, equity is being lost.
- **MEDIUM — Education pages under-linked internally** (8–11 outbound internal links). Cornerstone education assets aren't pushing equity to commercial pages. Target 15–20 internal links via "Related guides" + "Shop by specialty" blocks.
- **MEDIUM — Generic OG image** (`/Homepage1NEW.jpg`) on all 8 non-product pages sampled.

---

## Schema / Structured Data — 4 / 10

Each page emits a single `<script type="application/ld+json">` block containing a JSON array of objects (valid, server-rendered, present in initial HTML). All schema is constructed in `lib/seo.ts` (helpers) and invoked per-route. Live HTML matches the source — **the bugs are in `lib/seo.ts`, not in rendering.**

### Per-page detection

| Page | @types detected | Score |
|---|---|---|
| `/` (homepage) | Organization, WebSite | 6/10 |
| `/product/apollo` | Product | 4/10 |
| `/product/medusa` | Product | 4/10 |
| `/surgical-loupes` | Organization, BreadcrumbList, FAQPage | 6/10 |
| `/heliosx-vs-orascoptic` | Organization, BreadcrumbList, FAQPage | 5/10 |
| `/education/loupe-magnification-guide` | Article, BreadcrumbList, FAQPage | 5/10 |
| `/loupes-for-residents` | Organization, BreadcrumbList, FAQPage | 6/10 |

### Critical gaps

- **Product schema missing every Merchant requirement:**
  - No `sku`, `mpn`, or `gtin` → Merchant Center ineligible
  - No `aggregateRating` or `review` → no SERP star eligibility
  - No `priceValidUntil` → Google warns on Offers without it
  - No `hasMerchantReturnPolicy` → ineligible for return-policy rich result
  - No `shippingDetails` → Google has been hardening this as required since 2023
  - `priceSpecification.description: "$740-$1,115"` is a string stuffed into a numeric field — should be `AggregateOffer` with `lowPrice`/`highPrice`/`offerCount`
  - No `BreadcrumbList` or `Organization` on product pages (helpers exist in `lib/seo.ts` but aren't invoked in `app/product/[slug]/page.tsx`)
- **`articleJsonLd` hardcodes `datePublished` to `2026-05-23`** in `lib/seo.ts:147` — every article reports the same publication date, killing freshness signals.
- **Article missing `image`** — required for Article rich results.
- **Article uses `Organization` author instead of `Person`** — Google strongly prefers `Person` with credentials for YMYL/medical content.
- **No `itemListJsonLd` helper exists** — comparison, landing, and audience pages never emit `ItemList` despite recommending 3–5 products each. Loses product-carousel eligibility.
- **`Organization.sameAs: [siteUrl]`** — self-link, pointless. Should be real social URLs.
- **`WebSite.SearchAction.target: '/faq?search='`** — not a real search endpoint. Google may flag.

### Missed opportunities

- `HowTo` on `/education/how-to-measure-pupillary-distance`
- `MedicalWebPage` / `audience: MedicalAudience` site-wide on clinical content
- `Course` / `EducationalOccupationalProgram` on `/education/*`
- `ImageObject` on diagram SVGs (`public/diagrams/*.svg`)
- `VideoObject` for the hero video

---

## Performance / Core Web Vitals — 5 / 10

**Lighthouse lab + CrUX field data could not be retrieved** — PageSpeed Insights public API returned HTTP 429 (anonymous quota exhausted). Recommend adding a `GOOGLE_PSI_API_KEY` env var and re-running.

Audit below uses **direct asset measurements** via HEAD/GET against the live site.

### Page composition (mobile, brotli-compressed transfer)

| URL | HTML | JS (16 chunks) | CSS | Fonts | LCP img | Lazy below-fold | Video |
|---|---|---|---|---|---|---|---|
| `/` | 10.3 KB | 255 KB | 13 KB | 58 KB (2 woff2) | 21.4 KB (AVIF) | 203 KB (5 imgs) | **21.7 MB MP4 autoplay** |
| `/surgical-loupes` | 10.3 KB | ~255 KB | ~13 KB | same | 21.4 KB | n/a | none |
| `/education/loupe-magnification-guide` | 7 KB | ~255 KB | ~13 KB | same | 21.4 KB | n/a | none |
| `/product/<slug>` | 11 KB | ~255 KB | ~13 KB | same | varies | n/a | none |

### Critical image findings

- **P0 — Homepage hero MP4 is 21,740,500 bytes (20.7 MB)** with `Cache-Control: public, max-age=0, must-revalidate`. The `<video autoPlay muted loop playsInline>` tag has no `preload="metadata"`/`"none"`, no `poster=`, and no `width`/`height`. On mobile cellular this is a ~20 MB hit on every visit; repeat visits revalidate instead of serving from cache.
- **P0 — Source PNGs in `/public` are 1.9–6.5 MB each:**
  - `Apollo3xFemale2.png` — 6.2 MB
  - `Apollo3xFemale.png` — 6.5 MB
  - `NewtonAsian2.png` — 5.4 MB
  - `Walkinghallway2.png` — 5.8 MB
  - `MedusaCaseOpen.png` — 2.4 MB
  - `next/image` transcodes on-demand to AVIF, but cold-cache transcode latency is real.
- **MINOR — Logo PNG** (`logominimalnowriting.png`, 54 KB) rendered at 26–32 px. Should be an SVG (<2 KB).

### What is working well

- All `<img>` tags use `next/image` correctly: AVIF served (verified `content-type: image/avif`), `fetchPriority="high"` on the hero, `loading="lazy"` on below-fold, explicit `width`/`height` or `data-nimg="fill"` with `sizes="100vw"`, full `srcSet` chain (640/750/828/1080/1200/1920/2048/3840 w), preload link present for LCP hero.
- JS budget is healthy: 16 chunks totaling ~255 KB brotli-compressed; all `<script>` tags are `async`. Largest chunk 55 KB. No render-blocking inline JS beyond standard Next.js RSC bootstrap.
- CSS is tiny: 13 KB total across 2 files. No render-blocking 3rd-party CSS.
- **Zero third-party scripts** on the homepage. No GA, GTM, Meta Pixel, Hotjar. All 16 `<script src>` tags are first-party `/_next/static/chunks/*.js`. Excellent — but also explains why no analytics data is flowing.
- Fonts (2 woff2, 58 KB) correctly preloaded with `crossorigin` and `type="font/woff2"`.

---

## Ecommerce — Product page scorecard (1–10)

| Product | URL | Price | CTA | Spec coverage | Photos | Warranty | Shipping | Reviews | Schema | Score |
|---|---|---|---|---|---|---|---|---|---|---|
| Apollo | `/product/apollo` | $740 | Add to cart + Order now | 3.0–6.0x, 330–600mm, Apollo 1/2 + 5 colors | Real branded | Refundable before measurements | Missing | None | Partial | 7 |
| Medusa | `/product/medusa` | $710 | Add to cart + Order now | 3.0–8.5x, 300–600mm adjustable, 6 frames JJ04–JJ24 | Real branded | Partial (refund only) | Missing | None | Partial | 7 |
| Galileo | `/product/galileo` | $270 | Add to cart | 2.5–3.5x, 300–580mm, 6 frames + 4 colors | Real lifestyle | Partial | Missing | None | Partial | 7 |
| Newton | `/product/newton` | $270 | Add to cart | 2.5–3.5x, H1/H2 frames | Real | Partial | Missing | None | Partial | 7 |
| Kepler | `/product/kepler` | $460 | Add to cart + Order now | 4.0–6.0x, 350–620mm, 6 frames | Real | Partial | Missing | None | Partial | 7 |

### Trust signals

- **Present:** Cart icon site-wide, founder narrative, "surgeon-informed" messaging, real product imagery on PDPs, HTTPS, fully-refundable-before-measurement statement on every PDP.
- **Missing:** Visible email/phone in header/footer (`heliosxloupes@gmail.com` lives in `lib/seo.ts` but isn't surfaced), shipping policy link, returns/warranty page link, privacy/terms links, testimonials/aggregateRating, named surgeon credentials, Stripe trust badge / payment icons at checkout entry.

### Conversion path

- Homepage → `/product` (catalogue) → PDP → Add to cart → Checkout. **3 clicks to "ready to buy"** — acceptable.
- `/product` catalogue **does not show prices** — `priceLabel` already exists in `lib/fallback-products.ts`, just isn't rendered on the cards. Forces an extra click to qualify.
- No filters (magnification, weight, working distance) on `/product`.
- Cart accessible site-wide. Configuration UX on PDP is clear. No forced signup. No broken CTAs observed.

### Comparison page quality

- `/heliosx-vs-orascoptic`: ~1,200–1,500 words, genuine editorial, links to all 5 product pages, clear CTAs. **But** compares against generic "Other brand" rather than naming Orascoptic in body copy. No `ItemList`/`Product` schema.
- `/orascoptic-alternatives`: ~800–900 words, real editorial, names competitors, links to PDPs. No `ItemList` schema.

Above thin-content threshold, but leaving structured-data and comparison-table value on the table.

---

## What was not measured

- **Lighthouse lab data + CrUX field data** — PSI public API quota exhausted (HTTP 429). Add a `GOOGLE_PSI_API_KEY` and re-run.
- **GA4 / GSC data** — no analytics installed, no GSC access. Once `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in Vercel and GSC is verified, we can pull real impression/click/CTR data and refine priorities by actual traffic.
- **Backlink profile** — no Moz/Ahrefs/DataForSEO keys configured. Common Crawl is a free fallback option.
- **Full route-by-route metadata audit** — only 8 representative pages were curl-checked. A complete sweep is recommended to find every route missing `buildMetadata` (the `/faq` issue may not be isolated).

---

## Appendix: source files referenced

- `app/robots.ts` — robots config (currently correct intent, see `/measurements` note)
- `app/sitemap.ts` — sitemap config (clean)
- `app/not-found.tsx` — 404 page (needs `metadata` export)
- `app/faq/page.tsx` — example of route missing metadata export
- `app/product/[slug]/page.tsx` — needs `BreadcrumbList` + `Organization` invocations
- `lib/seo.ts` — primary schema/metadata source; locus of most Schema fixes
- `lib/product-seo.ts` — passes product data to schema
- `lib/fallback-products.ts` — source of truth for product data (price ranges, magnifications, frames)
- `lib/seo-content.ts` — has `recommendedProducts` and `comparisonRows` data that isn't currently serialized as `ItemList`
- `components/JsonLd.tsx` — emits the JSON-LD `<script>` block
- `vercel.json` — needs security headers + cache headers for `mainpagevideo2.mp4`
- `public/Homepage1NEW.jpg` — generic OG image used across 30+ SEO pages
- `public/mainpagevideo2.mp4` — 20.7 MB hero video (P0)
- `public/Apollo/Apollo3xFemale*.png` — 6.2–6.5 MB hero PNGs (P0)
- `public/research/intraoperative-magnification-who-uses-it.pdf` — Jarrett 2004 publication, primary authority asset (under-cited)
