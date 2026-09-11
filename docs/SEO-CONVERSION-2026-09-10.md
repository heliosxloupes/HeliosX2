# HeliosX search and conversion improvement report

## What the data says

Fresh Search Console API export, using the latest **complete 28 days: August 11–September 7, 2026**. Comparison: July 14–August 10. Final data was available through September 7 when checked on September 10.

| Property metric | Latest 28 days | Previous 28 days |
|---|---:|---:|
| Search clicks | 84 | 23 |
| Search impressions | 15,587 | 6,612 |
| CTR | 0.54% | 0.35% |
| Average position | 31.5 | 34.7 |

Mobile supplied 54 of 84 clicks (64%). Traffic is growing, but 84 organic clicks is still a small sample for diagnosing a high-consideration purchase. Search Console does not show product views, cart abandonment, leads, or purchases. It cannot establish why visitors have not bought.

### Pages prioritized

www and non-www rows were combined below. Page-level impressions use a different aggregation from property totals and should not be added to the property total.

| Page | Clicks | Impressions | Average position | Decision |
|---|---:|---:|---:|---|
| /best-loupes | 3 | 3,748 | 51.8 | Give readers a usable model-selection framework |
| /best-dental-loupe-brands | 10 | 3,663 | 43.9 | Replace broad rankings with sourced brand distinctions |
| /best-surgical-loupe-brands | 17 | 3,467 | 30.0 | Main commercial entry point; clearer shortlist and next steps |
| /loupes-for-dental-hygiene | 0 | 2,771 | 44.7 | Answer hygiene-specific fit, magnification, and lighting questions |
| /surgical-loupes | 0 | 1,294 | 58.0 | Explain the product range and show current prices |
| /education/best-loupes-for-residents | 1 | 1,101 | 58.4 | Rewrite first-pair guidance around actual training requirements |
| /are-surgical-loupes-worth-it | 0 | 1,007 | 40.4 | Explain when buying helps and when waiting makes sense |
| /student-loupe-comparison | 1 | 952 | 43.1 | Compare real student benefits and final costs |
| /how-much-do-surgical-loupes-cost | 3 | 682 | 9.0 | Stronger near-page-one opportunity; answer the price question immediately |
| /examvision-alternatives | 5 | 490 | 26.4 | Correct the switchable-magnification comparison |
| /education/working-distance-for-loupes | 2 | 340 | 15.4 | Practical measurement instructions and relevant product paths |
| /heliosx-vs-surgitel | 2 | 265 | 19.4 | Specific buying criteria rather than invented price comparisons |

Many broad terms still rank well below the first page. Low CTR at those positions is not proof of bad snippets. Content, authority, indexing, and useful product paths all need attention; rewriting titles alone will not solve the sales problem.

## Completed implementation

- [x] Rebuilt the shared layout across **52 commercial guides and 12 education guides**.
- [x] Removed oversized promotional hero treatments, repeated generic buying sections, and scroll-dependent content visibility.
- [x] Added readable article widths, real section navigation, responsive comparisons, and native FAQ controls.
- [x] Added product photographs, visible starting prices, model limitations, and direct product links.
- [x] Added contextual email help with a prefilled specialty/workflow question outline on buying guides.
- [x] Kept consent-aware CTA tracking; added tracking to education-page paths. Email clicks are not represented as completed leads.
- [x] Rewrote **34 commercial pages**, including the main brand comparisons, pricing, student, hygiene, ergonomic, and general buying guides.
- [x] Removed unverifiable comparison tables against unnamed “legacy” products on **10 specialty pages**.
- [x] Rewrote working-distance, resident, and ergonomics evidence guides.
- [x] Corrected return-policy language in FAQs, including the main FAQ and remaining specialty answers.
- [x] Removed universal FAQ padding and blanket savings / identical-optics claims from the revised guides.
- [x] Corrected the ergonomics research attribution and explained that the study did not test HeliosX products.
- [x] Disclosed that commercial comparisons are authored by HeliosX, rather than presenting them as independent reviews.
- [x] Derived product-card and schema starting prices from the checkout price list.
- [x] Added Article/WebPage metadata matching the buying guides, relevant images, and source citations. Product offer markup remains on product pages.
- [x] Fixed automatic internal links incorrectly interpreting ordinary slash-separated words as URLs.
- [x] Restored contextual links so every guide is reachable from the homepage.

### Less copy, more useful detail

Counts include the introduction, section prose/bullets, and FAQs; they exclude navigation and shared product cards.

| Guide | Before | After |
|---|---:|---:|
| Best surgical loupe brands | 1,059 words | 721 words |
| Surgical loupe cost | 1,213 | 471 |
| HeliosX vs LumaDent | 754 | 505 |
| Dental hygiene loupes | 1,027 | 434 |

## Evidence behind the comparison corrections

- [LumaDent Ergo Air Ti](https://www.lumadent.com/products/ergo-air-ti-ttl-loupes): published 3.0x entry price of $1,995 and variable working distance. Adjustment is not exclusive to HeliosX.
- [Orascoptic student program](https://www.orascoptic.com/en-us/students): trial and service benefits have eligibility conditions; compare an actual student offer.
- [SurgiTel product range](https://www.surgitel.com/loupes/): multiple ergonomic families; no invented general US retail price.
- [Q-Optics ErgoAngle](https://q-optics.com/products/ergoangle): individualized fitting is a meaningful comparison criterion.
- [ExamVision Kepler Advanced](https://examvision.com/loupes-lights/loupes/kepler-advanced/): four magnifications in one loupe. Medusa's working-distance adjustment is a different feature.
- [Admetec Ergo V](https://www.admetec.com/ergo-v-loupes/): switchable magnification; not equivalent to selecting one HeliosX magnification at purchase.
- [Fan et al., simulated surgical tasks](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2023.1257365/full): published January 2024; evidence about tested designs and short tasks, not proof of long-term pain prevention or HeliosX-specific benefits.

Manufacturer pages checked September 10, 2026. Prices and programs can change; refresh these comparisons before using them in a new promotion.

## Validation

- Production build, TypeScript, and build-time lint passed.
- All 64 guides checked for one H1, correct canonical, valid JSON-LD, FAQ/visible-content agreement, duplicate IDs, and section anchors.
- All 76 unique internal destinations returned HTTP 200 locally.
- Every guide is reachable through the site's internal link graph.
- Twenty browser checks across 320, 390, 768, and 1440px widths passed without horizontal overflow or page JavaScript exceptions.
- Additional checks covered final mobile product cards, jump navigation, FAQ controls, and CTA event dispatch.
- Guide content is readable with JavaScript disabled.
- Both guide route families build at approximately 147 kB First Load JS. This is a build measurement, not a field Core Web Vitals claim.

## Open work that content changes cannot finish

### 1. Product indexing

Fresh URL Inspection results on September 10:

- Medusa: submitted and indexed; last crawl September 5.
- Apollo, Newton, Galileo, Kepler: crawled, currently not indexed; Google's recorded last crawl remains May 28.

The new guide links strengthen the routes to these product pages, but Google must recrawl and reassess them. Do not describe this as resolved until inspection results change. Sitemap submission is not an indexing guarantee. Request indexing in the Search Console UI where available; the general URL Inspection API does not submit indexing requests.

### 2. GA4 funnel access

Search Console access works. Google Analytics Admin API discovery returned **403 because the API is disabled in the connected Google Cloud project**. No GA4 property ID is configured. Enable the Analytics Admin/Data APIs, grant the connected account access to the GA4 property, and configure its property ID before claiming a funnel diagnosis.

Then measure organic landing page → product view → add to cart → checkout → purchase. Separate email CTA clicks from successfully received inquiries and completed sales. Account for consent-related undercount. Preserve source/landing-page context when reviewing real inquiries; do not send patient or sensitive information to analytics.

### 3. Merchant Center

The website's defect-only returns and authorized exchange terms have been aligned. Merchant Center feed connection, approval, and free-listing eligibility still need account-level verification; this content pass does not establish those statuses.

### 4. Trust and demand generation

- Obtain permission to publish real clinician experiences, configurations, photos, and limitations. Do not turn generated imagery or anonymous quotes into customer evidence.
- Create a small number of documented model demonstrations: actual working-distance adjustment, what ships in the box, fitting, and illumination compatibility.
- Build a useful school/residency information pack with actual prices, fitting steps, and current purchase terms. Pursue appropriate program relationships; no outreach was sent during this pass.
- Develop independent, relevant mentions through real clinical evaluation and professional relationships. Avoid purchased links or a new batch of near-duplicate SEO pages.

## Review schedule

After deployment, monitor indexing and technical failures first. At 14 days, review query/page movement as an early signal. At 28 days, compare complete periods by page, device, and intent; inspect the funnel if GA4 access is ready. Judge content changes on qualified visits, product engagement, inquiries, and purchases—not impressions alone.

Raw exports, before/after content snapshots, screenshots, and verification outputs are stored locally in `heliosxvision.com-audit/`. They are not part of the public website.
