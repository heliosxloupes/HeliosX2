# HeliosX SEO Action Plan

**Generated:** 2026-05-25
**Source audit:** `FULL-AUDIT-REPORT.md`
**Score baseline:** 73/100 → target 85/100 after Critical + High items closed

Items are grouped by priority and effort. "Effort" is rough: S = under 30 min, M = 30 min to 2 h, L = half-day, XL = multi-day.

---

## Critical (fix this week)

### 1. 404 page emits conflicting robots meta tags
**Where:** `app/not-found.tsx` and `app/layout.tsx`
**Why:** Live curl of any 404 URL returns BOTH `<meta name="robots" content="noindex"/>` and `<meta name="robots" content="noindex, nofollow"/>` in `<head>`, plus a streamed `index, follow` injection. Crawlers receive ambiguous signals.
**Fix:** Audit which file emits each robots meta. Collapse to one `noindex, nofollow` declaration emitted only from `not-found.tsx` segment metadata. Suppress the root layout's `index, follow` for the not-found segment (or move the root robots into a `app/(site)/layout.tsx` route group that excludes 404).
**Verify:** `curl -s https://heliosxloupes.com/this-page-does-not-exist | grep -E '<meta name="robots"' | sort | uniq -c` should return exactly 1 line, 1 occurrence.
**Effort:** M
**Owner:** dev

### 2. Hero `<video>` missing poster, preload, width, height
**Where:** the component rendering `<video src="/mainpagevideo2.mp4">` on the homepage (NOT `components/Hero/Hero.tsx` device2Video — search for the class string `h-full w-full object-cover` to locate the actual component)
**Why:** Affects LCP and CLS on slow connections; no first-frame poster image for crawlers or data-save users.
**Fix:** Add `poster="/mainpagevideo2-poster.jpg"` (file already exists in `/public`), `preload="metadata"`, explicit `width={1920} height={1080}`, and `aria-hidden="true"` if decorative.
**Verify:** `curl -s https://heliosxloupes.com/ | grep -E '<video' | grep -oE 'poster|preload|width|height' | sort | uniq -c` should show all 4.
**Effort:** S
**Owner:** dev

### 3. `Homepage1NEW.jpg` 2.37 MB raw
**Where:** wherever `/Homepage1NEW.jpg` is referenced as `<img>` or `background-image` in homepage components
**Why:** 2.37 MB unoptimized; not routed through `next/image`; LCP risk.
**Fix:** Either (a) replace `<img src="/Homepage1NEW.jpg">` with `<Image src="/Homepage1NEW.jpg" width=… height=… alt=…/>` from `next/image`, or (b) run the existing `scripts/compress-public-images.mjs` against this file and re-export as `Homepage1NEW.webp`/`Homepage1NEW.avif` under 250 KB.
**Verify:** `curl -s https://heliosxloupes.com/ | grep Homepage1NEW` — desired result includes `/_next/image?url=`.
**Effort:** M

### 4. Comparison-page Product items in JSON-LD have no `offers`
**Where:** `lib/seo.ts` or wherever ItemList Product JSON-LD is generated for comparison pages
**Why:** Every `/heliosx-vs-*` and `/loupe-comparisons` page lists 5 HeliosX Products (Medusa/Apollo/Kepler/Galileo/Newton) with `brand` but no `offers`/`price`. Will trip "Invalid Product" warnings in Search Console.
**Fix:** Add a lightweight `offers` block to each Product in the ItemList: `{ "@type": "Offer", "url": "https://heliosxloupes.com/product/<slug>", "priceCurrency": "USD", "price": "<starting>", "availability": "https://schema.org/InStock" }`. OR downgrade these items to plain `ListItem` with `name` + `url` + `image` only, dropping the Product `@type`.
**Verify:** Run the page through Google's Rich Results Test — no "Missing field: offers" warnings.
**Effort:** S–M

### 5. Comparison pages have zero `<table>` elements
**Where:** `components/seo/SeoLandingExperience.tsx` — the comparison-row renderer that currently emits `<div className="grid grid-cols-3 ...">`
**Why:** Commercial-investigation queries (`heliosx vs orascoptic`) expect a side-by-side `<table>`. Google's SXO ranking signals reward comparison pages that visually mirror the query intent. Also affects screen-reader accessibility.
**Fix:** Convert the comparison-rows block to semantic `<table>` with `<thead>` (Feature | HeliosX | <competitor>), `<tbody>`, `<tr>`, `<td>`, plus an accessible `<caption>`. Keep the existing Tailwind styling — Tailwind supports table classes directly. Sticky `<thead>` on scroll is a nice-to-have.
**Verify:** `curl -s https://heliosxloupes.com/heliosx-vs-orascoptic | grep -c '<table'` should return ≥ 1.
**Effort:** M

### 6. Homepage missing `BreadcrumbList` JSON-LD
**Where:** `app/layout.tsx` or `app/page.tsx`
**Why:** Even a single-item breadcrumb (`Home`) helps SERP sitelinks. Every other surveyed page carries it; the homepage doesn't.
**Fix:** Emit `BreadcrumbList` with one `ListItem` (position 1, name "Home", item `https://heliosxloupes.com/`).
**Effort:** S

### 7. Homepage lacks per-product cards with prices
**Where:** `app/page.tsx` or the homepage hero/features components
**Why:** "Shop Medusa" appears 3x; Apollo, Galileo, Newton, Kepler are nav-only with no featured cards, no prices, no individual `/product/{slug}` deep links. Every product CTA points to generic `/product`. Kills home→PDP equity flow.
**Fix:** Add a "Meet the lineup" section with 5 cards — each showing product name, starting price ($270 / $460 / $710 / $740 / $270), one-line positioning, hero image, and a `View Medusa →` CTA pointing to `/product/<slug>`. Add `ItemList` schema with `Product` entries linking to PDPs.
**Effort:** M–L

---

## High (fix within 2 weeks)

### 8. Add inline brand disambiguation to homepage
**Where:** homepage hero or about block; Organization schema `description`
**Why:** LLMs ground on rendered HTML, not on llms.txt. Without an inline disambiguation, AI engines may confuse HeliosX Loupes with the unrelated UK healthtech company HeliosX.
**Fix:** Add a single visible sentence: *"HeliosX Loupes — surgical and dental loupes for clinicians, residents, and students. Not to be confused with the UK healthtech company HeliosX."* Mirror in Organization schema `description`.
**Effort:** S

### 9. Populate `sameAs` on Organization schema with real profiles
**Where:** `lib/seo.ts` Organization JSON-LD
**Why:** Current `sameAs: ["https://heliosxloupes.com"]` is self-referential. LLMs and Knowledge Graph need external profiles (Instagram, YouTube, LinkedIn, Crunchbase, Wikidata Q-ID) to disambiguate the entity. Single biggest GEO improvement.
**Fix:** Populate with verified URLs. Add `@id: "https://heliosxloupes.com/#organization"`, `foundingDate`, `founder` (if appropriate).
**Effort:** S (once profile URLs are gathered)

### 10. Fix Medusa PDP H2 hierarchy
**Where:** `app/product/ProductPageTemplate.tsx` and any per-product sections it renders
**Why:** `_medusa.html` (8,170 words) has only 2 H2s (one literal "Medusa product specifications.", one decorative wrapper with empty inner text). Body sits under 4 H3s with no parent H2. Hurts AI extraction and on-page hierarchy.
**Fix:** Add 4–6 descriptive H2s: "Why ergonomic prismatic", "Working-distance options", "Who Medusa fits", "Reviews", "FAQs".
**Effort:** M

### 11. Add `FAQPage` schema to `/product/medusa` (and the other 4 PDPs)
**Where:** `lib/seo.ts` / `app/product/ProductPageTemplate.tsx`
**Why:** Medusa has visible Q-style content but no `FAQPage` JSON-LD. Hub, Orascoptic, and surgical-brands each emit `FAQPage`. PDPs are missing.
**Fix:** Extract the existing PDP FAQ array and emit `FAQPage` schema with `mainEntity` of `Question`/`Answer` pairs.
**Effort:** S

### 12. Fix `_medusa.html` Review schema asymmetry
**Where:** `lib/product-seo.ts` or wherever the review array is generated
**Why:** Grep counts 10 `reviewBody` + 10 `author` but 20 `reviewRating`. The extra 10 `reviewRating` keys without matching body/author are likely rich-result-ineligible stubs.
**Fix:** Either complete those 10 reviews (body + author + rating) or drop them. Each `Review` needs `author`, `reviewRating`, ideally `reviewBody` and `datePublished`.
**Effort:** S

### 13. Switch comparison pages from `MedicalWebPage` to `WebPage` + `Article`
**Where:** comparison-page schema generator (likely `lib/seo.ts`)
**Why:** `MedicalWebPage` implies clinical/diagnostic content; Google may demote it for commercial intent. Comparison pages are commercial-investigation. Keep `MedicalWebPage` only for `/education/*`.
**Fix:** Emit `WebPage` for hub + alternatives, `Article` (with `author`, `datePublished`, `dateModified`) for `/heliosx-vs-*` head-to-heads.
**Effort:** M

### 14. Add named clinician `author` / `reviewedBy` to YMYL pages
**Where:** schema generators for `/education/*` guides and comparison pages
**Why:** Currently only generic `author: { @type: Organization }` — no named expertise signal. YMYL-adjacent surgical/dental content benefits from a named DDS/MD reviewer.
**Fix:** Add `reviewedBy: { @type: Person, name: "...", jobTitle: "DDS", affiliation: "..." }` to education and comparison schemas. If no clinician is on retainer, partner with one and credit them.
**Effort:** M (organizationally), S (code)

### 15. Trim home and hub titles to ≤60 chars
**Where:** `lib/seo-content.ts` (hub `metaTitle`) and `app/page.tsx` (home metadata)
**Why:** Home = 64ch, hub = 67ch. Both truncate in SERP.
**Fix:**
- Home: drop a word — e.g., "HeliosX Loupes | Ergonomic Surgical & Dental Loupes" (52ch)
- Hub: shorten — e.g., "Loupe Brand Comparisons | HeliosX vs LumaDent & More" (52ch)
**Effort:** S

### 16. Add resident/student callout above the fold on homepage
**Where:** homepage hero or sub-hero
**Why:** Comparison pages surface "Galileo/Newton from $270 for residents" but homepage doesn't mention `discount` anywhere in body. Primary acquisition persona under-served.
**Fix:** Add a visible callout in the hero or directly under it: "Resident & student pricing from $270 — discounts documented across the lineup."
**Effort:** S

### 17. Surface AggregateRating in PDP hero
**Where:** `app/product/ProductPageTemplate.tsx`
**Why:** Schema has 4.6/5 (10 reviews); UI does not mirror it near H1.
**Fix:** Render a star widget + "4.6/5 from 10 verified clinicians" near the product title, above the price.
**Effort:** S

---

## Medium (fix within 1 month)

### 18. Model Medusa magnification variants as Product variants
**Where:** `lib/seo.ts` Product schema
**Why:** `AggregateOffer` declares `offerCount: 6` but no `hasVariant` / `ProductGroup` parent. `sku` and `mpn` both `heliosx-medusa`. Blocks Google Merchant variant rich results.
**Fix:** Restructure as `ProductGroup` with 6 variant `Product` children (3.0x, 4.0x, 5.0x, 6.0x, 8.0x, 8.5x), each with its own `sku`, `mpn`, and `offers`. Add `gtin13` if/when GTINs are assigned.
**Effort:** L

### 19. Rewrite weak PDP image alts
**Where:** Medusa product gallery
**Why:** Filename-style alts (`JJ04`, `JJ20`–`JJ24`, `View 1`–`View 5`).
**Fix:** Replace with descriptive alts: "Medusa 4.0x prismatic loupes JJ20 frame, front view", "Medusa 5.0x prismatic loupes JJ23 grey frame, side profile", etc.
**Effort:** M

### 20. Surface E-E-A-T citations inline on hub + brand shortlists + head-to-heads
**Where:** Comparison-page section bodies (`lib/seo-content.ts`)
**Why:** Jarrett 2004 and Frontiers RCT exist on education routes but are not surfaced where AI engines need them. Zero grep hits for `Jarrett` / `Frontiers` / `pubmed` on the 5 cached pages.
**Fix:** Inline citation pattern (already used on education pages): one sentence like "A 2004 peer-reviewed survey of 148 specialists (Jarrett, *Microsurgery*) documented intraoperative magnification ranges by specialty." with anchor link to `/education/intraoperative-magnification-by-specialty` and an outbound DOI/PubMed URL.
**Effort:** M

### 21. Add anchor TOC / jump-links to long comparison pages
**Where:** `components/seo/SeoLandingExperience.tsx`
**Why:** Hub, orascoptic, surgical-brands have 12 H2 sections each but 0 `href="#anchor"` links. Hurts passage-ranking and bounce risk.
**Fix:** Auto-emit a "Jump to:" anchor list at the top of every comparison page from the section titles, plus `id` slugs on each H2.
**Effort:** M

### 22. De-duplicate boilerplate H2 cluster across comparison pages
**Where:** `lib/seo-content.ts` shared section helpers
**Why:** SXO subagent flagged H2s 7–12 ("Choose by work, posture, and fit" / "Comparison snapshot" / "The HeliosX lineup" / "Related buyer searches" / "Learn the fit variables" / "Quick answers") render verbatim on `_orascoptic.html`, `_hub.html`, and `_surgical-brands.html`. Template-thinning risk.
**Fix:** Either move these to a true footer component (so they're not in the page-content area for ranking purposes), OR differentiate per page-type (head-to-head vs alternatives vs hub) so the page-specific sections lead.
**Effort:** M

### 23. Add `Content-Security-Policy` and `X-Frame-Options` headers
**Where:** `next.config.js` `headers()` or `vercel.json`
**Why:** Site-quality audits and clickjacking risk.
**Fix:** Conservative CSP starter + `X-Frame-Options: SAMEORIGIN`. Test in report-only mode first.
**Effort:** M

### 24. Build collection/category landing pages
**Where:** new routes `/student-loupes`, `/specialty` (hub), individual `/specialty/<name>` (some already exist)
**Why:** No "Student" or "By Specialty" hubs despite the brand positioning. Missing faceted entry points.
**Fix:** A `/student-loupes` page already implied by the comparison cluster — make it a real CollectionPage with the 2 entry-tier products plus links to all student-specific comparison and education resources.
**Effort:** L

---

## Low (backlog)

- Mirror Jarrett 2004 reference inside `/llms.txt` so AI engines see the research anchor when grounding.
- Move the homepage's "$499" Helios reference — verify it's not a stale/dead price string.
- Surface "Risk-free. Fully refundable before measurements are provided" as a trust badge near the PDP CTA (currently buried in body).
- Add `VideoObject` schema to Medusa PDP (homepage has one, PDPs don't). Surgical loupes convert better with demo video.
- Add financing/installment messaging (Affirm/Klarna) for $710+ transactions.
- Split mixed `unitText:"mm (adjustable)"` PropertyValue into separate `unitText:"mm"` + a separate "Adjustable" PropertyValue.
- Confirm `priceValidUntil:"2027-05-25"` rolls forward continuously rather than drifting via a static template.
- Consider adding `BreadcrumbList` (typed) to the comparison hub (Quick lookups list is great UX but isn't a typed breadcrumb).
- Build dedicated `/residents` and `/protection` pages so comparison content has authoritative link targets for the resident-discount and insurance-plan claims.
- Add a small homepage "About" section anchored on the disambiguation sentence (mirrors Organization schema description for crawlers + humans).

---

## Backing pages flagged by the comparison cluster

These were referenced in the just-shipped comparison content but don't have dedicated public pages yet:

1. **Resident / student discount eligibility** — referenced on every comparison page. Needs either a `/residents` section, an FAQ entry under `/faq`, or a sub-section of an existing page that explicitly describes eligibility + how to apply. Until then comparison content mentions "contact support for eligibility."
2. **Optional protection coverage for loss / damage / drops** — referenced as available at order. Needs either a `/protection` page or a section on `/warranty`. Until then comparison content describes it generically.

Both are short pages — 1–2 hours each.

---

## Measurement plan

After implementing Critical + High items, re-run:

```bash
# Verify 404 robots meta singleton
curl -s https://heliosxloupes.com/this-page-does-not-exist | grep -E '<meta name="robots"' | sort | uniq -c

# Verify video attrs
curl -s https://heliosxloupes.com/ | grep -E '<video' | grep -oE 'poster|preload|width|height'

# Verify image routing
curl -s https://heliosxloupes.com/ | grep -oE '_next/image[^"]*Homepage1NEW[^"]*'

# Verify table semantics on comparison pages
for p in heliosx-vs-orascoptic loupe-comparisons best-surgical-loupe-brands; do
  printf "%s: " "$p"
  curl -s https://heliosxloupes.com/$p | grep -c '<table'
done

# Re-run /seo-audit after the deploy and compare scores
```

Target after Critical+High pass: **85/100**. Target after Medium pass: **90/100**.
