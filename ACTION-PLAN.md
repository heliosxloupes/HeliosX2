# HeliosX SEO Action Plan

**Generated:** 2026-05-23
**Source audit:** [`FULL-AUDIT-REPORT.md`](./FULL-AUDIT-REPORT.md)
**Repo HEAD at audit time:** `5fc5adb`
**Overall site SEO Health Score:** 56 / 100

This document is the prioritized task list derived from the full audit. Priorities are defined as:

- **P0 — Critical.** Blocks indexing, rich-result eligibility, or significantly harms LCP/conversion. Fix this week.
- **P1 — High.** Significantly impacts rankings, citation eligibility, or trust. Fix within 2 weeks.
- **P2 — Medium.** Optimization opportunities. Fix within 1 month.
- **P3 — Low / Backlog.** Nice-to-have, future improvements, or external account work.

Effort estimates assume one engineer familiar with the codebase. Most P0 items are single-file changes.

---

## Open questions to resolve before executing

These shape the implementation approach and need decisions from the owner:

1. **Named medical reviewer for YMYL content.** Who is the named MD/surgeon to attribute as author or reviewer on `/education/*` and the intraoperative-magnification publication? Without a named reviewer with credentials, AI engines and Google YMYL guidelines deprioritize the content.
2. **Reviews / social proof.** Is there an existing review queue, or do we need to build a collection mechanism (Stripe-receipt-triggered email → review form → display + `aggregateRating` schema)? Even 5–10 reviews per product unlocks star eligibility.
3. **Hero video strategy.** Three options for the 20.7 MB video:
   - a) Keep desktop autoplay, ship smaller mobile cut (~3–5 MB) via `<source media="(min-width: 768px)">`, add `poster=`, fix cache headers.
   - b) Replace autoplay with `poster` image + click-to-play.
   - c) Defer with `preload="none"` for now, compress later.
4. **OG image strategy.** Use the dynamic OG route Codex built, generate static custom OG images for the top 10 SEO pages, or both?
5. **Policy pages (footer).** Do shipping / returns / warranty / privacy / terms copy exist somewhere, or do they need to be written/sourced? This may be a legal task.
6. **Execution batching.** Single PR for all P0, or split into thematic PRs (schema PR, perf PR, H1 template PR, etc.)?

---

## P0 — Critical (fix this week)

### P0-1 — Shrink and defer the 20.7 MB hero video
**Where:** Homepage hero component (likely in `components/` or `app/page.tsx`), `public/mainpagevideo2.mp4`, `vercel.json` headers.
**What:**
- Add `preload="metadata"` (or `"none"`) on the `<video>` tag.
- Add a `poster=` attribute pointing to an AVIF hero so the LCP element is the image, not the video.
- Ship a smaller mobile cut (~3–5 MB target) via `<source media="(min-width: 768px)">`.
- Add `width` and `height` attributes.
- Fix `Cache-Control` for `mainpagevideo2.mp4` from `max-age=0, must-revalidate` to `public, max-age=31536000, immutable` (or version the filename).
**Why:** 20.7 MB re-downloaded on every visit. Punishing mobile LCP.
**Estimated impact:** 15–25 MB transfer reduction, 1–3 s LCP improvement on mobile.
**Effort:** 1–2 hours.

### P0-2 — Complete Product JSON-LD for Merchant eligibility
**Where:** `lib/seo.ts` `productJsonLd()` function. Thread data from `lib/fallback-products.ts` and `lib/product-seo.ts`.
**What:**
- Add `sku` (use slug + magnification + frame combo, e.g. `apollo-3.0x-apollo1-black`).
- Add `aggregateRating` and `review` (start with at least 1–3 placeholder/seed reviews per product if no review system exists yet — see P1-6).
- Add `priceValidUntil` (one year from `dateModified`).
- Add `hasMerchantReturnPolicy` (`MerchantReturnPolicy` with `returnPolicyCategory: MerchantReturnFiniteReturnWindow`, `merchantReturnDays`, `applicableCountry`).
- Add `shippingDetails` (`OfferShippingDetails` with `shippingDestination`, `deliveryTime`, `shippingRate`).
- Convert price range from `priceSpecification.description: "$740-$1,115"` string to `AggregateOffer` with `lowPrice`, `highPrice`, `offerCount`, `priceCurrency`.
- Consider adding `additionalProperty` for magnification, working distance, frame options (Medusa's adjustable working distance is a differentiator currently invisible to schema).
- Optionally add `audience: MedicalAudience` and `gtin`/`mpn` if you have them.
**Why:** Currently zero rich-result eligibility for products. Google has been hardening shipping/return-policy requirements since 2023.
**Effort:** 2–3 hours.

### P0-3 — Fix Article schema (datePublished, image, Person author)
**Where:** `lib/seo.ts:147` `articleJsonLd()`.
**What:**
- Accept `datePublished`, `dateModified`, `image`, `author` as parameters.
- Default `author` to a real `Person` (e.g. founder or clinical reviewer) with `name`, `jobTitle`, optionally `sameAs` and `affiliation`.
- Require `image` (Google requires it for Article rich results).
- Pass real `datePublished` from each education guide's frontmatter or constant.
- Consider switching `@type` from `Article` to `MedicalWebPage` or a hybrid for clinical content.
**Why:** Every education guide currently shows the same hardcoded date (`2026-05-23`). Major freshness/trust bug. Missing `image` kills Article rich-result eligibility. `Organization` author is weaker than `Person` for YMYL.
**Effort:** 1–2 hours.

### P0-4 — Fix multiple-`<h1>` template bug
**Where:** SEO landing page components — likely `components/seo/SeoLandingExperience.tsx`, `components/seo/EducationGuideExperience.tsx`, and the homepage hero component.
**What:**
- Audit the affected pages: `/` (4 H1s), `/dental-loupes` (5), `/best-loupes`, `/affordable-loupes`, `/loupes-for-residents`, `/loupes-for-microsurgery`, `/heliosx-vs-lumadent` (3), `/orascoptic-alternatives` (2).
- Demote the page-name H1 (e.g. "Surgical Loupes") to `<h2>` or a styled non-heading element.
- Keep one H1 per page — the hero headline.
**Why:** Multiple H1s on a single page is a long-standing on-page anti-pattern and weakens topical signal. The repetitive "X without the guesswork." pattern also risks Google collapsing the SEO cluster as near-duplicates.
**Effort:** 1–2 hours.

### P0-5 — Pre-compress hero PNGs
**Where:** `public/Apollo/Apollo3xFemale2.png`, `Apollo3xFemale.png`, `public/Newton/NewtonAsian2.png`, `public/Walkinghallway2.png`, `public/Medusa/MedusaCaseOpen.png`, and similar (use the audit findings list as the starting set).
**What:**
- Script a pass with `sharp` or `cwebp`/`avifenc` to generate optimized AVIF/WebP at multiple widths (e.g. 750, 1080, 1920) in `/public`.
- Either reference compressed sources directly or keep `next/image` pointing at the smaller masters.
- Originals can move to `_saved_from_old_folders` if preserving them.
**Why:** 6.2 MB PNG transcoded on demand causes cold-cache transcode latency and origin storage bloat. Pre-compressing front-loads the work.
**Effort:** 1 hour (scripted).

### P0-6 — Audit every route for missing `buildMetadata`
**Where:** All `app/*/page.tsx` files.
**What:**
- Grep for routes that don't export `metadata` or `generateMetadata`. Known offender: `app/faq/page.tsx`. Verify all others.
- For each, add an explicit `metadata` export using `buildMetadata({ title, description, path })` from `lib/seo.ts`.
- Verify with `curl <url> | grep canonical` after fix.
**Why:** Any route without its own metadata inherits the root layout's canonical (which points to homepage). Silently consolidates SEO signals from those pages into `/`.
**Effort:** 1–2 hours (depends on how many routes are affected).

### P0-7 — Fix conflicting robots meta on 404 page
**Where:** `app/not-found.tsx`.
**What:** Export `metadata = buildMetadata({ title, description, noIndex: true })` so Next replaces (not appends) the root robots tag.
**Why:** Currently emits both `noindex` AND `index, follow`. Soft-404 risk signal.
**Effort:** 15 minutes.

**P0 total estimated effort: 8–12 hours.**

---

## P1 — High (within 2 weeks)

### P1-1 — Redirect bare product slugs
**Where:** `vercel.json` `redirects` or `middleware.ts`.
**What:** Add 301 redirects from `/apollo`, `/medusa`, `/galileo`, `/newton`, `/kepler` → `/product/<slug>`.
**Why:** Brand-name searches and any old external links are currently hitting 404s.
**Effort:** 30 minutes.

### P1-2 — Cite the Scotland survey inline
**Where:** `/surgical-loupes`, `/best-loupes`, `/loupes-for-residents`, `/education/research` (likely in `lib/seo-content.ts` or per-page content modules).
**What:** Add inline citation — *"Jarrett PM. Survey of intraoperative magnification use by surgeons in the west of Scotland. Microsurgery. 2004;24:420–422."* — and link to `/research/intraoperative-magnification-who-uses-it.pdf`.
**Why:** Currently an orphan stat across 4+ pages. AI engines won't cite unsourced statistics. The source PDF is already hosted on the site.
**Effort:** 1 hour.

### P1-3 — Named author bylines and "Medically reviewed by"
**Where:** `lib/seo.ts` `articleJsonLd()` (extended in P0-3), education guide components, and education frontmatter/data.
**What:**
- Decide on the named reviewer (see Open Question #1).
- Add a visible "Written by [Name]" and "Medically reviewed by [Name, MD]" line at the top of every `/education/*` page.
- Mirror this into the `Person` author in the JSON-LD.
- Add an `Author` page (`/about/authors/[slug]`) with credentials, optional `sameAs` to LinkedIn/PubMed.
**Why:** YMYL/medical content without named reviewer credentials is heavily deprioritized by both Google (E-E-A-T) and AI engines (citation eligibility).
**Effort:** 2–3 hours (more if writing reviewer bios).

### P1-4 — Add BreadcrumbList + Organization to product pages
**Where:** `app/product/[slug]/page.tsx`.
**What:** Invoke the existing `breadcrumbJsonLd` and `organizationJsonLd` helpers from `lib/seo.ts`. They are not currently called on product pages.
**Why:** Product pages currently emit only `Product` schema. Missing site context (Organization) and navigation context (BreadcrumbList) weakens the knowledge graph for these pages.
**Effort:** 30 minutes.

### P1-5 — Build `itemListJsonLd` helper and emit on landing/comparison/audience pages
**Where:** New helper in `lib/seo.ts`; invoke in SEO landing, comparison, and audience page templates. Data already exists in `lib/seo-content.ts` (`recommendedProducts` arrays) and `comparisonRows`.
**What:** Emit `ItemList` with positioned `Product` references for each recommended product.
**Why:** Unlocks product-carousel eligibility on category SERPs. Comparison pages are currently invisible to comparison-shopping rich results despite being literally that.
**Effort:** 1–2 hours.

### P1-6 — Reviews and aggregateRating
**Where:** New review collection workflow + display component + `aggregateRating` in `productJsonLd`.
**What (depends on chosen approach — see Open Question #2):**
- Stripe-receipt-triggered email asking customers to leave a review.
- Lightweight review form (or use Resend + a Supabase table).
- Display reviews on PDP.
- Feed `aggregateRating` into Product schema (already enabled in P0-2).
**Why:** Zero social proof anywhere on the site. For $270–$1,115 medical purchases, this is the biggest single conversion lift available. Also unlocks SERP star eligibility.
**Effort:** Depends on collection mechanism — anywhere from 1 day (basic) to 3 days (polished).

### P1-7 — Real footer with policy links
**Where:** `components/Footer.tsx` (or wherever the current footer lives).
**What:**
- Surface support email (`heliosxloupes@gmail.com` from `lib/seo.ts`).
- Link to: shipping policy, returns / warranty, privacy policy, terms of service.
- May need to write the policy pages (see Open Question #5).
**Why:** No legal/policy links anywhere is a trust deficit and likely Stripe/ToS compliance gap.
**Effort:** 2–3 hours (more if policy copy needs to be written).

### P1-8 — Wire dynamic OG images for SEO/education/measurements pages
**Where:** `lib/seo.ts` `buildMetadata`, plus the dynamic OG image routes Codex built.
**What:** Update `buildMetadata` to default the `image` to the dynamic OG route for the current path, with `/Homepage1NEW.jpg` as fallback.
**Why:** Currently 30+ SEO pages share one OG image. Custom per-page OG significantly improves social-share CTR and is a freshness signal for both Google and AI engines.
**Effort:** 1–2 hours.

### P1-9 — Set up Google Analytics and PSI key (owner task)
**Where:** Vercel project environment variables.
**What:**
- Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` so the existing `AnalyticsScripts.tsx` activates.
- Set `GOOGLE_PSI_API_KEY` (or equivalent) so future PSI runs aren't rate-limited.
- Optionally set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` for meta-tag verification.
**Why:** No analytics flowing currently. Need real user data to refine priorities by traffic, not guess.
**Effort:** 15 minutes.

### P1-10 — Submit sitemap to Search Console and Bing Webmaster Tools (owner task)
**Where:** Google Search Console, Bing Webmaster Tools.
**What:** Verify domain ownership, submit `https://heliosxloupes.com/sitemap.xml`.
**Why:** Currently no GSC verification means no impression/click data, no indexation status, no Core Web Vitals field data filtered to your property.
**Effort:** 30 minutes.

---

## P2 — Medium (within 1 month)

| # | Task | Where | Effort |
|---|---|---|---|
| 1 | Expand `/heliosx-vs-*` pages with 6-row spec tables (mag, weight, working distance, frame options, price band, warranty). Name competitors explicitly in body copy. | `lib/seo-content.ts` `comparisonRows`, comparison page components | 2–3 hr per page |
| 2 | Expand FAQ blocks to 6–10 per SEO landing page. Currently 1–2 on most. | `lib/seo-content.ts` per-page FAQ arrays | 2 hr per page |
| 3 | Rename `/heliosx.llm` → `/heliosx.md` (or fold into `llms.txt`) and add Jarrett PDF link to `llms.txt`. | `public/heliosx.llm`, `public/llms.txt` | 30 min |
| 4 | Explicit AI bot allow-list in robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, etc.). | `app/robots.ts` | 15 min |
| 5 | Modern security headers in `vercel.json`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, CSP `frame-ancestors 'self'`. | `vercel.json` | 30 min |
| 6 | Show prices on `/product` catalogue page (`priceLabel` already exists in `lib/fallback-products.ts`). Add magnification/use-case filter. | `app/product/page.tsx` or its component | 1–2 hr |
| 7 | Add `HowTo` schema to `/education/how-to-measure-pupillary-distance` and similar measurement guides. | `lib/seo.ts` (new helper) + education page invocations | 1 hr |
| 8 | Replace logo PNG (`logominimalnowriting.png`) with SVG. | `public/` + header/footer references | 30 min (have SVG) |
| 9 | Boost internal linking on education pages from 8–11 to 15–20. Add "Related guides" + "Shop by specialty" blocks. | Education page template | 1–2 hr |
| 10 | De-duplicate "X without the guesswork." pattern across H1s/titles. Vary tail per intent. | `lib/seo-content.ts` titles/headings | 1–2 hr |
| 11 | Add `X-Robots-Tag: noindex, nofollow` response header on `/cart`, `/checkout`, `/admin/*`. | `vercel.json` headers | 30 min |
| 12 | Resolve `/measurements` robots.txt wildcard inconsistency. Decide intent and update `app/robots.ts` + sitemap accordingly. | `app/robots.ts`, `app/sitemap.ts` | 15 min |
| 13 | Add `audience: MedicalAudience` to clinical pages and `MedicalWebPage` to medical content where appropriate. | `lib/seo.ts` | 1 hr |
| 14 | Normalize homepage canonical to include trailing slash (`https://heliosxloupes.com/`). | `lib/seo.ts` `absoluteUrl('/')` | 15 min |

---

## P3 — Low / Backlog

- Populate `Organization.sameAs` with real social URLs (LinkedIn, Instagram, YouTube) or remove the self-link.
- Fix `WebSite.SearchAction` (point to real search endpoint or remove — currently `/faq?search=` which isn't a real search).
- Add `ImageObject` schema for diagram SVGs in `public/diagrams/`.
- Add `VideoObject` schema for the hero video (once it's been deferred/compressed in P0-1).
- Add `Course` / `EducationalOccupationalProgram` schema on education content.
- New specialty pages: cardiac surgery, pediatric surgery, maxillofacial surgery, ENT/otolaryngology, ophthalmic surgical loupes (Codex flagged these as content opportunities).
- Customer testimonials block once collected (works in tandem with P1-6 reviews work).
- Run PSI / Lighthouse with API key once configured to capture real CWV/SEO/A11y/BP scores.
- Backlink profile analysis via Common Crawl (free) or paid DataForSEO/Moz/Ahrefs if budget allows.
- Set up baseline with the `seo-drift` skill to track changes over time.

---

## Suggested execution order

If you want sequenced PRs rather than one big sweep:

1. **PR 1 — Schema overhaul** (P0-2, P0-3, P1-4, P1-5): `lib/seo.ts` is the locus of most schema work. One focused PR.
2. **PR 2 — Perf hardening** (P0-1, P0-5, P2-8): video + image compression + logo SVG. Visible Lighthouse wins.
3. **PR 3 — Template/on-page hygiene** (P0-4, P0-6, P0-7, P1-1, P2-10): H1 dedup, metadata audit, 404 fix, bare-slug redirects, "without the guesswork" de-duplication.
4. **PR 4 — Content/E-E-A-T** (P1-2, P1-3): Scotland citation + named reviewer rollout. Depends on Open Question #1 resolution.
5. **PR 5 — Footer + trust** (P1-7, P1-8): real footer with policy links + dynamic OG images.
6. **PR 6 — Reviews infrastructure** (P1-6): standalone, larger scope.
7. **P2 batch:** Medium tasks rolled into a single sweep or addressed opportunistically.
8. **Owner tasks (parallel):** P1-9, P1-10 (analytics + GSC setup).

---

## Verification approach

After each PR, run:

1. `npm run build` — must pass.
2. `curl -sI https://heliosxloupes.com/<changed-path>` — verify headers, status, redirects.
3. `curl -s https://heliosxloupes.com/<changed-path> | grep -E '<title>|<meta name="description"|<link rel="canonical"|<meta property="og:'` — verify head metadata.
4. `curl -s https://heliosxloupes.com/<changed-path> | grep -oE '<script type="application/ld\+json">[^<]+</script>'` — verify JSON-LD blocks.
5. Run JSON-LD output through https://validator.schema.org/ and https://search.google.com/test/rich-results.
6. For perf changes: PageSpeed Insights with API key (P1-9), or Chrome DevTools Lighthouse pane.
7. For content changes: visual check in browser (`kimi-webbridge` skill is installed for headless verification).
8. After deploy: monitor Google Search Console (once P1-10 lands) for indexation and impression changes over the following 2–4 weeks.

---

## Notes

- The repo's [`CLAUDE.md`](./CLAUDE.md) is the authoritative source for brand voice and design constraints. All copy changes (P1-2, P1-3, P2-1, P2-2, P2-10) must respect the access/gatekeeping/fair-pricing message and avoid drift to generic-luxury language.
- Codex flagged image/video compression as the highest-impact remaining engineering task in the prior handoff. P0-1 and P0-5 are the direct execution of that.
- The 30+ SEO landing pages are recent work — they're the largest pool of optimization surface area. Improvements to the shared templates (H1 fix, OG image wiring, FAQ expansion, schema additions) compound across all of them.
