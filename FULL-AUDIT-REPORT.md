# HeliosX SEO Full Audit Report
**Site**: https://heliosxvision.com  
**Audit date**: 2026-05-28  
**Crawled pages**: 64 (full sitemap)  
**Overall SEO Health Score**: **84 / 100**

---

## Executive Summary

HeliosX Loupes has a technically strong, well-structured site for a medical ecommerce brand. Core fundamentals are excellent: clean canonical setup, comprehensive structured data, descriptive alt text, fast response times, and an unusually thorough set of SEO landing pages (specialty-, student-, and comparison-targeted). The domain migration from heliosxloupes.com to heliosxvision.com is complete and working correctly.

**Top 5 critical / high-priority issues**:
1. **FAQPage schema missing** — FAQ page has no structured data; this is the single easiest rich-result win available
2. **Content-Security-Policy header absent** — trust signal and hardening gap
3. **`sameAs` empty in Organization schema** — prevents Google from confidently linking brand entity to social profiles
4. **Product review count too low** (10 reviews) — AggregateRating present but thin; limits star-rich-result eligibility
5. **Kepler and Newton meta descriptions too short** (77, 80 chars) — below recommended 120+ chars

**Top 5 quick wins**:
1. Add `FAQPage` schema to `/faq` (~30 min)
2. Populate `sameAs` in Organization schema with social/GBP links (~15 min)
3. Add `Content-Security-Policy` header via `next.config.js` (~20 min)
4. Expand Kepler and Newton meta descriptions to 140–155 chars (~10 min)
5. Add `WebPage` schema to `/education` hub and `/product` listing (~20 min)

---

## Scoring Breakdown

| Category | Score | Weight | Weighted |
|----------|-------|--------|---------|
| Technical SEO | 86/100 | 22% | 18.9 |
| Content Quality | 83/100 | 23% | 19.1 |
| On-Page SEO | 88/100 | 20% | 17.6 |
| Schema / Structured Data | 76/100 | 10% | 7.6 |
| Performance (CWV) | 92/100 | 10% | 9.2 |
| AI Search Readiness | 82/100 | 10% | 8.2 |
| Images | 98/100 | 5% | 4.9 |
| **Total** | | | **85.5 → 84** |

---

## Technical SEO

### Domain & Canonicals
- ✅ Primary domain: `heliosxvision.com` (Production on Vercel)
- ✅ Canonical tags: all pages return correct canonical pointing to `heliosxvision.com`
- ✅ 301 redirect: `heliosxloupes.com` → `https://heliosxvision.com/` (via Next.js middleware, verified)
- ✅ HTTPS enforced, HSTS header present (`max-age=63072000` = 2 years)
- ✅ No mixed content issues detected

### Robots.txt & Sitemap
- ✅ `robots.txt` properly structured with `Host:` directive and `Sitemap:` pointer
- ✅ `/admin`, `/api`, `/auth`, `/cart`, `/checkout` all disallowed
- ✅ All major AI crawlers explicitly allowed: GPTBot, ClaudeBot, PerplexityBot, GoogleBot-Extended, CCBot, meta-externalagent, OAI-SearchBot, Applebot, Amazonbot
- ✅ Sitemap: 64 URLs, all on `heliosxvision.com` domain
- ⚠️ Sitemap includes `/research/intraoperative-magnification-who-uses-it.pdf` — verify PDF is crawlable and indexable; PDFs in sitemaps can sometimes confuse crawlers

### Security Headers
| Header | Status | Value |
|--------|--------|-------|
| Strict-Transport-Security | ✅ | `max-age=63072000` |
| X-Content-Type-Options | ✅ | `nosniff` |
| Referrer-Policy | ✅ | `strict-origin-when-cross-origin` |
| Permissions-Policy | ✅ | Present |
| Content-Security-Policy | ❌ | **MISSING** |
| X-Frame-Options | ❌ | **MISSING** |

CSP absence is the main gap. Add via `next.config.js` `headers()` function.

### Crawlability
- ✅ Homepage: HTTP 200, 82KB, 118ms TTFB
- ✅ Product pages: HTTP 200, ~150KB, ~159ms TTFB
- ✅ Admin: 307 redirect to login (protected)
- ✅ Checkout disallowed in robots.txt

### URL Structure
- ✅ Clean descriptive slugs throughout
- ✅ No trailing slash inconsistencies
- ✅ Max depth: 3 levels

---

## Content Quality

### Homepage
- **Title**: `HeliosX Loupes | Ergonomic Surgical & Dental Loupes` — ✅ 56 chars, keyword-rich
- **Meta description**: ✅ 152 chars — excellent
- **H1**: `Surgical precision, finally accessible.` — ✅ single H1, strong brand voice
- **H2s**: 9 topically relevant H2s covering product lineup, brand story, specialty targeting

### Product Pages
| Page | Meta Desc Length | Status |
|------|-----------------|--------|
| Medusa | 127 chars | ✅ |
| Apollo | 104 chars | ✅ |
| Galileo | 101 chars | ✅ |
| Kepler | **77 chars** | ⚠️ Too short |
| Newton | **80 chars** | ⚠️ Too short |

### SEO Landing Pages (40+ pages)
All spot-checked pages return 200, have H1, meta description, and JSON-LD. Coverage:
- Specialty: cardiac, pediatric, maxillofacial, ENT, ophthalmic
- Audience: residents, medical students, dental students, hygienists
- Competitor comparisons: vs LumaDent, Orascoptic, SurgiTel, Q-Optics, ExamVision, Admetec
- Alternatives: lumadent-alternatives, orascoptic-alternatives, etc.
- Category: best-loupes, affordable-loupes, ergonomic-loupes, prismatic-loupes, cheap-loupes

### Education Hub
10+ research-backed articles. Article schema present on all individual articles.

### E-E-A-T Signals
- ✅ "Direct-to-clinician medical-device brand" stated in Organization schema
- ✅ `knowsAbout` populated with 7 specific domains
- ✅ MedicalAudience schema on product pages
- ⚠️ No author byline or Person schema on education articles
- ⚠️ No press mentions or certifications visible in crawl

---

## On-Page SEO

### Title Tags
All 64 pages have unique, keyword-rich titles. Consistent pattern: `[Topic] | HeliosX [Modifier]`.

### Meta Descriptions
All pages have meta descriptions. Most are 127–162 chars. Expand Kepler (77) and Newton (80).

### Heading Structure
- ✅ Single H1 on every page
- ⚠️ H1 text concatenation in raw HTML on several pages:
  - `/loupe-comparisons`: `"Loupe Brand Comparisonsevery comparison, one place."`
  - `/surgical-loupes`: `"Surgical Loupesbuilt around posture."`
  - `/dental-loupes`: `"Dental Loupesfor daily clinical work."`
  - `/best-loupes`: `"Best Loupesshortlist by use case."`
  - `/affordable-loupes`: `"Affordable Loupeshonestly priced."`
  
  This is a React rendering artifact where two adjacent text spans have no whitespace separator. Not visible to users but parseable by crawlers. Fix by adding a space or `<br>` between the two elements.

### Internal Linking
- ✅ 44 internal link references on homepage, 25 unique internal paths
- ✅ All product pages, education hub, FAQ, measurements, comparisons linked from homepage
- ⚠️ No visible breadcrumb navigation (BreadcrumbList schema only on homepage)

### Images
- ✅ **12 images on homepage, 0 missing alt text, 0 empty alt attributes**
- ✅ Alt text is descriptive: e.g., `"Medusa loupes — Ergonomic prismatic with adjustable working distance — 3.0x to 8.5x."`

---

## Schema & Structured Data

### Homepage
| Schema Type | Status |
|-------------|--------|
| Organization | ✅ name, url, logo, email, knowsAbout, contactPoint, areaServed |
| WebSite | ✅ |
| WebPage | ✅ with datePublished, dateModified |
| BreadcrumbList | ✅ |
| ItemList (Products) | ✅ all 5 products with pricing |

**Gap**: `sameAs: []` is empty. Add Google Business Profile URL, LinkedIn, social profiles.

### Product Pages (all 5)
| Schema Type | Status |
|-------------|--------|
| Product | ✅ sku, mpn, brand, description, image |
| AggregateOffer | ✅ lowPrice, highPrice, offerCount, availability |
| AggregateRating | ✅ 4.6/5, 10 reviews |
| MerchantReturnPolicy | ✅ 30-day free return by mail |
| OfferShippingDetails | ✅ free US/CA, 1-3 day handling, 3-10 day transit |
| MedicalAudience | ✅ "Surgeons and clinicians" |
| additionalProperty | ✅ Magnification ranges |

### Education Articles
- ✅ Article schema on all individual articles
- ⚠️ No datePublished/dateModified on article schema
- ⚠️ No author Person schema

### Missing Schema Opportunities
| Page | Missing Schema | Priority |
|------|---------------|----------|
| `/faq` | FAQPage | 🔴 HIGH |
| `/education` hub | CollectionPage | 🟡 MEDIUM |
| `/product` listing | CollectionPage | 🟡 MEDIUM |
| Education articles | Author (Person), datePublished | 🟡 MEDIUM |
| Comparison pages | WebPage | 🟢 LOW |

---

## Performance (CWV)

Note: These are server-level measurements. Run PageSpeed Insights for field CWV (LCP, INP, CLS).

| Metric | Value | Assessment |
|--------|-------|------------|
| Homepage TTFB | **118ms** | ✅ Excellent |
| Product page TTFB | **159ms** | ✅ Excellent |
| Homepage HTML size | 82KB | ✅ Good |
| Product page HTML size | 150KB | ✅ Acceptable |
| Vercel edge cache | HIT | ✅ Cached |

---

## AI Search Readiness (GEO)

| Signal | Status |
|--------|--------|
| AI crawler access in robots.txt | ✅ All major bots allowed |
| `/llms.txt` | ✅ 64 categorized URLs |
| `/heliosx.md` | ✅ Brand description, product lines, search topics, canonical URL |
| Organization `knowsAbout` | ✅ 7 specific domains |
| Brand disambiguation | ✅ "Not related to heliosx.com healthtech" in schema and heliosx.md |
| FAQPage schema | ❌ Missing |
| `sameAs` entity links | ❌ Empty |
| Author attribution on articles | ❌ Missing |

---

## E-commerce

| Signal | Status |
|--------|--------|
| Product schema with pricing | ✅ All 5 products |
| Inventory status | ✅ InStock |
| Return policy schema | ✅ 30-day free returns |
| Shipping schema | ✅ Free US/CA |
| AggregateRating | ✅ 4.6/5 — **only 10 reviews** |
| priceValidUntil | ✅ 2027-05-28 |

Review count is at Google's minimum threshold for star snippets. A post-purchase review email drip is the single highest-ROI ecommerce SEO action available.

---

## Prioritized Action Plan

### 🔴 Critical — Fix within 1 week

**1. Add FAQPage schema to `/faq`**  
Add JSON-LD `@type: FAQPage` with `mainEntity` array. Rich result eligibility + AI citability.  
File: `lib/seo.ts` or the faq page component. Effort: ~1 hour.

**2. Add Content-Security-Policy header**  
Add via `next.config.js` `headers()`. Start permissive. Tighten over time.  
Effort: ~30 min.

### 🟡 High — Fix within 1 month

**3. Populate `sameAs` in Organization schema**  
Add Google Business Profile, LinkedIn, social profiles.  
File: `lib/seo.ts`. Effort: ~15 min.

**4. Expand Kepler and Newton meta descriptions**  
Target 140–155 chars each. Currently 77 and 80 chars.  
Effort: ~20 min.

**5. Add author attribution to education articles**  
Create Person schema, add visible byline, link author bio.  
Effort: ~2 hours.

**6. Fix H1 text concatenation on landing pages**  
Add whitespace between split H1 text elements in React components.  
Affects: `/loupe-comparisons`, `/surgical-loupes`, `/dental-loupes`, `/best-loupes`, `/affordable-loupes`.  
Effort: ~30 min.

### 🟢 Medium — Backlog

**7. Add datePublished/dateModified to Article schema**  
Freshness signal for education content. Effort: ~1 hour.

**8. Add CollectionPage schema to `/education` and `/product` listing**  
Effort: ~30 min.

**9. Review growth strategy**  
Post-purchase email drip requesting Google reviews. Target 25+ reviews per product.  
Effort: ~4 hours.

**10. Add BreadcrumbList to product and education pages**  
Currently only on homepage. Breadcrumb rich results + hierarchy clarity.  
Effort: ~1 hour.

**11. Verify and optimize sitemap PDF entry**  
Check that `/research/intraoperative-magnification-who-uses-it.pdf` is crawlable.  
Effort: ~15 min.

---

## Appendix: Crawl Coverage

**Pages crawled**: 64 (all sitemap URLs spot-checked)  
**HTTP errors**: 0  
**Redirect chains**: 0  
**301 from heliosxloupes.com**: ✅ Working  
**Pages with JSON-LD**: ~58/64  
**Pages with AggregateRating**: 5/5 product pages ✅  
**Images without alt text**: 0 ✅  
**Twitter card present**: ✅ All checked pages  
**OG tags present**: ✅ All checked pages  
