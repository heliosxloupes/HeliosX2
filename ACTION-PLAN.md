# HeliosX SEO Action Plan (Post-Fix Re-run)

**Generated:** 2026-05-26
**Source audit:** `FULL-AUDIT-REPORT.md` (90/100, was 73)
**Baseline score:** 73/100 → current 90/100 → target 95+/100 after the remaining items below

11 commits shipped between the prior audit and this re-run (`f6c5600` → `b37a569`). Every Critical and most High items are now resolved. What's left is mostly bounded follow-ups, several of which need owner input (real `sameAs` URLs, a named clinician).

---

## High (fix this week — has measurable revenue/visibility impact)

### 1. PDP price + Add-to-Cart still ~15 KB below the H1
**Where:** `app/product/ProductPageTemplate.tsx` — the hero column currently shows H1 → rating widget → description → risk-free copy → highlights card → magnification chooser → frame selector → price block far down.
**Why:** Mobile first viewport now shows H1 + 4.6/5 rating but not the price tag or buy button. Highest-impact unfinished SXO item.
**Fix:** Reorder the right-column to surface `Starting at $XYZ` directly under the rating, with the primary CTA ("Add to cart" or "Configure") within the first viewport. Keep the configurator below.
**Effort:** M

### 2. Populate `sameAs` with real profile URLs
**Where:** `lib/seo.ts` — the `organizationSameAs` array is an empty scaffold.
**Why:** Strongest single signal for entity disambiguation against the UK healthtech HeliosX. Knowledge Graph and LLMs use `sameAs` URLs (Instagram, YouTube, LinkedIn, Crunchbase, Wikidata) to confirm "HeliosX" → surgical loupes brand.
**Fix:** Drop verified profile URLs into the array. Even 2–3 is enough to ship.
**Owner:** needs URLs from you. The code is wired.
**Effort:** S (once URLs exist)

### 3. Add named clinician `reviewedBy` to comparison + education schema
**Where:** `lib/seo.ts` `articleJsonLd` helper already supports `author` with name/jobTitle/url. Wire into `[seoSlug]/page.tsx` and the education routes.
**Why:** YMYL-adjacent surgical/dental content benefits materially from a Person `author` or `reviewedBy` (DDS/MD). Currently all editorial schema lists `Organization` author only.
**Owner:** needs the clinician name + credentials.
**Effort:** S (once owner picks)

### 4. Rewrite remaining filename-style PDP gallery alts
**Where:** Medusa + other PDP image gallery — `JJ04`, `JJ20`–`JJ24`, `JJ23 Grey`, `View 1`–`View 5`.
**Why:** ~12 images. Hero/closeup alts already upgraded; gallery thumbnails still SKU-stub.
**Fix:** Each alt should describe what's depicted, e.g. "Medusa 4.0x prismatic loupes JJ20 frame, front view in black titanium".
**Effort:** M

### 5. Add inline citation to Medusa PDP body
**Where:** PDP body content — currently zero Jarrett/Frontiers mentions on `/product/medusa` even though it's the flagship.
**Why:** Comparison + education pages cite peer-reviewed work; the flagship PDP doesn't. AI engines that ground on the PDP itself miss the research anchor.
**Fix:** Add a one-sentence reference under the "Magnification" section or the spec section: "Medusa's 3.0x–8.5x range covers the intraoperative magnification ranges Jarrett's 2004 survey of 148 specialists documented across surgical specialties." Link to `/education/intraoperative-magnification-by-specialty`.
**Effort:** S

---

## Medium (fix within 1 month)

### 6. Model magnification variants as `ProductGroup` + `hasVariant`
**Where:** `lib/seo.ts` `productJsonLd`. Currently uses `AggregateOffer` with `offerCount`.
**Why:** Google Merchant + variant rich results require per-variant Offers with unique SKU per magnification. Blocks Shopping listings showing each magnification separately.
**Fix:** Restructure: parent `ProductGroup` with one `Product` per magnification, each with its own `sku` and `Offer.price`. Existing `magnificationPriceByProduct` map in `ProductPageTemplate.tsx` already has the data.
**Effort:** L

### 7. Add `gtin13` to Product schema
**Where:** Product schema generator.
**Why:** Google deprioritizes Merchant listings without GTIN.
**Owner:** needs GTINs from manufacturer/owner.
**Effort:** S (once GTINs exist)

### 8. Differentiate comparison table captions per competitor
**Where:** `components/seo/SeoLandingExperience.tsx`. Currently every caption starts "Side-by-side comparison of HeliosX and…".
**Why:** Identical opening text on every table caption is weak for screen readers and SERP caption surfacing.
**Fix:** Use `page.competitorName` directly in the caption opening, e.g. "Side-by-side comparison: HeliosX vs Orascoptic across 10 positioning factors."
**Effort:** S

### 9. Set `og:type` to `article` on comparison pages
**Where:** `lib/seo.ts` `buildMetadata`. Currently hardcoded to `'website'` for everything.
**Why:** Comparison pages now carry Article schema; `og:type=article` is the matching social signal.
**Fix:** Plumb `ogType?: 'article' | 'website'` through `SeoMetadataInput` and pass `'article'` from `[seoSlug]/page.tsx` when slug is in the comparison set.
**Effort:** S

### 10. Build `/residents` + `/protection` backing pages
**Where:** New routes.
**Why:** Comparison content references resident discounts and the optional protection plan extensively. Both need authoritative link targets.
**Fix:** Two short pages — `/residents` with eligibility + how-to-apply; `/protection` (or a `/warranty` subsection) describing the coverage. Update comparison content to link to them.
**Effort:** M each

### 11. Add financing/installment messaging
**Where:** PDPs + checkout.
**Why:** $710+ medical device with resident audience — Affirm/Klarna typically lifts CR materially. Not currently surfaced.
**Owner:** business decision (which provider).
**Effort:** M

### 12. Lift `robots` out of root layout (optional cleanup)
**Where:** `app/layout.tsx` + every page-level metadata export.
**Why:** Eliminates the residual `"robots":"index, follow"` in the 404 RSC streaming payload. Not crawler-visible — but cleaner.
**Fix:** Remove `robots` from `buildMetadata` calls in root layout; ensure each public page calls `buildMetadata` itself (most already do).
**Effort:** M (broad blast radius — verify no page is left without robots)

---

## Low (backlog)

- Add `VideoObject` schema to Medusa PDP (homepage has one; PDPs don't).
- Surface "Risk-free. Fully refundable before measurements are provided" as a visible trust badge near the PDP CTA.
- Split mixed `unitText:"mm (adjustable)"` PropertyValue into separate `unitText:"mm"` + a separate "Adjustable: yes" PropertyValue.
- Confirm `priceValidUntil` rolls forward continuously (currently 1 year from build time — should be automatic via `oneYearFromTodayISO()`).
- Mirror the Jarrett 2004 citation inside `/llms.txt` so AI engines see the research anchor when grounding from the discovery file.
- Add `BreadcrumbList` schema on `/loupe-comparisons` hub (Quick lookups list is great human UX but isn't a typed breadcrumb).

---

## Final measurement plan

Once Items 1–5 ship:

```bash
# 1. PDP price visible above first scroll (target: present)
curl -s https://heliosxloupes.com/product/medusa | head -c 25000 | grep -oE 'Starting at|\$710|Add to cart' | sort | uniq -c

# 2. sameAs populated
curl -s https://heliosxloupes.com/ | grep -oE '"sameAs":\[[^]]+\]' | head -1

# 3. Named author in editorial schema
curl -s https://heliosxloupes.com/loupe-comparisons | grep -oE '"author":\{[^}]*"name":"[^"]+"' | head -1

# 5. Medusa PDP citation
curl -s https://heliosxloupes.com/product/medusa | grep -c 'Jarrett'
```

**Target after Items 1–5:** 95/100.
**Target after Items 6–11:** 97/100.

---

## What this audit did NOT cover
- CWV field data (CrUX) — no Google API credentials available.
- Visual / mobile screenshots — no Playwright pass this run.
- DataForSEO live SERP ranks — MCP not connected.
- Common Crawl backlink profile — Moz/Bing API not connected.

These are optional enrichments; nothing in them is blocking the core score.
