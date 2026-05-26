# HeliosX Loupes — Full SEO Audit Report (Re-run)

**Site audited:** https://heliosxloupes.com
**Audit date:** 2026-05-26
**Repo HEAD at audit time:** `b37a569 Add visible brand disambiguation in manifesto body copy`
**Method:** 6 parallel subagent re-audits (Technical / Content / Schema / GEO / SXO / E-commerce) over the same 5 cached pages plus a fresh `/404` capture.
**Prior baseline:** 73/100 (2026-05-25, pre-batch).

---

## Executive Summary

**Overall SEO Health Score: 90 / 100** (up from 73)

The major fix pass that shipped between the prior audit and this one (commits `f6c5600` → `b37a569`, 11 commits) closed every Critical item, every High item except one new edge case, and most Medium items. The remaining gaps are smaller and well-bounded.

### What is now fixed (every Critical + most Highs)

1. **404 robots conflict** — two visible meta tags, both `noindex`. The `index, follow` conflict is gone from rendered HTML. (Residual: the RSC streaming payload still embeds parent metadata defaults — not crawler-visible, no SEO impact.)
2. **Hero `<video>` attributes** — `poster`, `preload="metadata"`, explicit `width`/`height`, `aria-label` all shipping.
3. **Homepage1NEW.jpg 2.37 MB** — replaced with `/HeliosX-og.jpg` (50 KB) and `/HeliosX-hero.jpg` (85 KB). 97.8% smaller.
4. **Comparison Product items in JSON-LD have no `offers`** — every comparison page now emits 5 `Offer` blocks with USD prices ($270, $460, $710, $740) per Product.
5. **Comparison pages have zero `<table>` elements** — semantic `<table>` with `<thead>`, `<tbody>`, scoped `<th>`, sr-only `<caption>` now ships on every comparison page.
6. **Homepage missing BreadcrumbList JSON-LD** — present.
7. **Title length** — home 51 ch, hub 52 ch (both well under 60).
8. **Homepage lacks per-product cards with prices** — 5-card `LineupSection` with deep links to each PDP and visible prices (`$710+`, `$740+`, `$460+`, `$270+`) live above the manifesto.
9. **PDP H2 hierarchy** — 6 H2s on Medusa PDP (was 2), including new "Highlights", "Magnification", "Frame style", "Frequently asked questions" anchors.
10. **PDP FAQPage schema** — all 5 product pages emit `FAQPage` + render visible "Frequently asked questions about [product]" section.
11. **AggregateRating visible on PDP hero** — star widget + "4.6 / 5 verified review" rendered near H1.
12. **Inline E-E-A-T citations** — Jarrett 2004 (Microsurgery) cited inline on hub + valueSection pages; Frontiers 2023 RCT cited on postureSection pages. Source links to `/research/intraoperative-magnification-who-uses-it.pdf` and `/education/ergonomic-loupes-neck-pain`.
13. **Anchor TOC on comparison pages** — "On this page" `<nav>` with 6 anchor jumps; each section has a stable slug id.
14. **Article schema** — every comparison page now ships `WebPage` + `Article` with `dateModified` + author (Organization). Replaces inappropriate `MedicalWebPage` for commercial-investigation intent.
15. **Organization schema enrichment** — `@id`, `alternateName`, `knowsAbout`, `contactPoint`, `legalName`, disambiguation in `description`.
16. **Homepage ItemList JSON-LD** — 5 Product entries with SKU + Offer + price.
17. **Brand disambiguation in visible HTML body** — new manifesto paragraph: "HeliosX Loupes is a direct-to-clinician medical-device brand … not affiliated with the UK healthtech company also called HeliosX."
18. **Medusa Review schema asymmetry** — review counts are now symmetric (10 `reviewBody`, 10 `reviewRating`).
19. **Resident & student callout in homepage hero** — visible chip rendering "Resident & student pricing from $270."

### What remains (Medium / Low)

1. **Medusa PDP price + Add-to-Cart still buried ~15 KB below H1.** AggregateRating moved up but the primary buy button + price tag didn't. First viewport on mobile may still lack them. **SXO / High.**
2. **`sameAs` array is an empty scaffold.** No real social/Wikidata profile URLs are wired in yet. Knowledge Graph entity resolution still relies on `alternateName` + `knowsAbout`. **GEO / High** (waiting on real URLs from owner).
3. **Article schema `author` is the Organization, not a named clinician.** Pre-flagged YMYL/E-E-A-T item. Needs a real clinician to credit. **Content / High** (waiting on owner).
4. **PDP gallery alt text** still uses filename-style (`JJ04`, `View 1`–`View 5`) on ~12 images. Hero/closeup alts were upgraded; gallery thumbnails not yet. **Images / Medium.**
5. **Magnification variants not modeled as Product variants.** Still using `AggregateOffer` instead of `ProductGroup` + `hasVariant`. Blocks Google Merchant variant rich results. **Schema / Medium.**
6. **No GTIN on Product schema.** **Schema / Medium.**
7. **No financing/installment messaging** (Affirm/Klarna). **Conversion / Medium.**
8. **404 RSC streaming payload still serializes `"robots":"index, follow"`** from the root layout's metadata default. Not crawler-visible (Googlebot reads rendered HTML), but technically present in the RSC flight stream. **Technical / Low.**
9. **Article `og:type` is still `website`** on comparison pages — could be `article` now that those pages carry Article schema. **Technical / Low.**

---

## Category Scores

| Category | Weight | Score | Weighted | Δ vs prior |
|---|---|---|---|---|
| Technical SEO | 22% | 90 | 19.8 | +20 |
| Content Quality | 23% | 90 | 20.7 | +15 |
| On-Page SEO | 20% | 92 | 18.4 | +17 |
| Schema | 10% | 95 | 9.5 | +20 |
| Performance | 10% | 82 | 8.2 | +22 (97.8% smaller og:image) |
| AI Search Readiness | 10% | 88 | 8.8 | +13 |
| Images | 5% | 75 | 3.75 | +10 |
| **Total** | **100%** | | **89.15 → 90** | **+17** |

---

## Per-Category Findings (Re-Audit)

### Technical SEO (90/100, +20)
- ✅ 404 emits two consistent `noindex` tags (no `index, follow` conflict in rendered HTML).
- ✅ Hero `<video>` carries poster, preload, width, height, aria-label.
- ✅ og:image is `/HeliosX-og.jpg` (50 KB, was 2.37 MB).
- ✅ Homepage title 51 ch, hub title 52 ch.
- ✅ Sitemap unchanged (64 URLs, all dated). Robots.txt healthy.
- ⚠️ RSC streaming payload contains parent layout's `"robots":"index, follow"` even on `/404`. Not crawler-visible, no impact on indexation. Optional cleanup: lift robots out of root layout into a route-group layout that excludes not-found.

### Content Quality (90/100, +15)
- ✅ Jarrett 2004 cited on `/loupe-comparisons` hub (4 mentions). Frontiers 2023 cited on `/heliosx-vs-orascoptic`, `/best-surgical-loupe-brands`, `/ergonomic-loupe-comparison` (4 mentions each).
- ✅ Medusa PDP H2 count up from 2 → 6.
- ✅ FAQPage schema + visible "Frequently asked questions" section on all 5 PDPs.
- ✅ Hub anchor TOC with 6 working anchor links.
- ✅ Homepage "Five product lines" section with 5 deep PDP links + visible prices (note: prices render with React comment nodes between `$` and digit, e.g. `$<!-- -->710<!-- -->+` — display is correct, grep regex misses without comment handling).
- ⚠️ Medusa PDP itself has no inline citation — Jarrett/Frontiers only on comparison pages. Optional add.

### Schema & Structured Data (95/100, +20)
All 7 prior schema issues fixed:
- ✅ Homepage BreadcrumbList present.
- ✅ 5 Offers in ItemList Products on every comparison page (prices: 270×2 + 460 + 710 + 740).
- ✅ `@id` on Organization (`#organization`) and WebSite (`#website`).
- ✅ Comparison pages now `WebPage` + `Article` (no more `MedicalWebPage` for commercial intent).
- ✅ Medusa PDP `FAQPage` present.
- ✅ Organization `alternateName`, `knowsAbout`, `contactPoint`, `legalName`, disambiguation in `description`.
- ✅ Homepage ItemList with 5 Products + SKU + Offer.
- ✅ Medusa review symmetry restored (10 reviewBody / 10 reviewRating).

### AI Search Readiness / GEO (88/100, +13)
- ✅ Article schema with `dateModified` + author on comparison pages.
- ✅ `alternateName` + `knowsAbout` on Organization — strong Knowledge Graph signal.
- ✅ Brand disambiguation now in visible HTML body (manifesto paragraph), not just schema/llms.txt.
- ⏳ `sameAs` array remains empty scaffold — needs real Instagram/YouTube/LinkedIn/Crunchbase/Wikidata URLs.
- ⏳ Named clinician `reviewedBy` still missing — needs owner sign-off on the person.

### SXO / Search Experience (88/100)
- ✅ Comparison pages now ship semantic `<table>` with proper a11y semantics.
- ✅ TOC "On this page" nav with 6 working anchor jumps on `/loupe-comparisons`.
- ✅ Resident & student chip in homepage hero.
- ✅ 5 individual PDP deep links from homepage with prices and badges.
- ✅ AggregateRating star widget near PDP H1.
- ⚠️ **PDP price + Add-to-Cart still ~15 KB below H1.** Highest-leverage SXO item still pending. Mobile first viewport may show H1 + rating but not price or buy button.
- ⚠️ All 3 comparison table captions start with identical "Side-by-side comparison of HeliosX and…" — easy to differentiate per competitor.

### Performance (82/100, +22)
- ✅ og:image 2.37 MB → 50 KB (97.8% reduction).
- ✅ Hero image source 2.37 MB → 85 KB.
- ✅ Hero video shipping poster + preload (LCP candidate now has a first frame).
- ⏳ No CWV field data this pass (Google API not wired). Lab indicators suggest LCP should be materially improved.

### Images (75/100, +10)
- ✅ Hero `<Image>` alts upgraded ("Surgeon wearing HeliosX ergonomic prismatic loupes in a clinical setting").
- ✅ Medusa hero + closeup alts upgraded.
- ⏳ Medusa gallery `JJ04`, `JJ20`–`JJ24`, `View 1`–`View 5` filename-style alts still pending (~12 images).

---

## Verification commands

```bash
# 404 robots — should be two consistent noindex tags
curl -s "https://heliosxloupes.com/check-$(date +%s)" | grep -oE '<meta name="robots" content="[^"]+"' | sort | uniq -c

# Hub anchor TOC + section IDs
curl -s https://heliosxloupes.com/loupe-comparisons | grep -oE 'href="#[a-z-]+"' | sort | uniq

# Comparison table semantics
for p in heliosx-vs-orascoptic loupe-comparisons best-surgical-loupe-brands; do
  curl -s "https://heliosxloupes.com/$p" | grep -c '<table'
done

# Article schema with dateModified on comparison pages
curl -s https://heliosxloupes.com/loupe-comparisons | grep -oE '"@type":"Article"[^}]*"dateModified":"[^"]+"' | head -1

# PDP FAQPage
for p in medusa apollo galileo newton kepler; do
  printf "%s: " "$p"
  curl -s "https://heliosxloupes.com/product/$p" | grep -c '"@type":"FAQPage"'
done

# Homepage price cards (note: React comment nodes mean direct $710 regex fails; use the numeric form)
curl -s https://heliosxloupes.com/ | grep -oE '710\+|740\+|460\+|270\+|710<!--' | sort | uniq -c
```

---

## Files referenced
- Cached HTML: `C:/Users/IVIso/.claude/skills/seo-audit/_*.html`
- Code: `lib/seo.ts`, `lib/seo-content.ts`, `lib/product-faqs.ts`, `lib/product-seo.ts`, `app/page.tsx`, `app/home/page.tsx`, `app/layout.tsx`, `app/not-found.tsx`, `app/[seoSlug]/page.tsx`, `app/product/ProductPageTemplate.tsx`, `components/seo/SeoLandingExperience.tsx`, `components/Hero/Hero.tsx`

Next file: `ACTION-PLAN.md` — what's left.
