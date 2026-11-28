# 28 Nov 2026: Swiss redesign of all 90 SEO guide pages

Git tag: `seo-swiss-redesign-2026-11-28` (the commit that switched the template).
Use this date as the marker when reading Search Console, GA4 and Clarity.

## What changed (presentation only)

- Every page served by `app/[seoSlug]/page.tsx` (90 guides) now renders with
  `components/seo/swiss/SwissGuide.tsx` instead of `components/seo/SeoLandingExperience.tsx`.
- New look: dark photo hero that fades into a light Swiss-grid page (Inter Tight,
  heavy rules, numbered sections, one green accent), chapter rail and top progress
  bar, phone chapter sheet, fade-up on scroll, price and weight charts drawn from
  the tables, posture study photos on /ergonomic-loupes.
- Each page gets a lifestyle hero photo chosen by topic (`components/seo/swiss/heroPhotos.ts`).
  New crawlable text added: only that photo's alt text, plus the CC BY credit line
  for the Fan et al. (2024) posture figure on /ergonomic-loupes.
- Mobile: native scroll, no hidden content waiting on animations, full-width
  buttons, 44px+ tap targets, hover effects only on mouse devices.

## What did NOT change

- Words: every word, heading (same order and level) and link on all 90 pages was
  checked against the old template before shipping. 90 of 90 matched.
- Titles, meta descriptions, canonicals, robots, JSON-LD, sitemap, URLs, internal links.
- `dateModified` was NOT bumped: no content changed, so no page claims a new update.
- Analytics event attributes (`data-seo-event`, `data-cta`) kept on the same controls.

## Read this before blaming or crediting the redesign

Other changes in the same window:
- 26 Nov: cannibalization fix (commits f49a04f to 5fe20f5); re-check planned 10 to 17 Dec.
- 27 Nov: /loupes-for-dental-hygiene and /ergonomic-loupes copy rewrite (0078aeb, dateModified 27 Nov).
- The Oct 28 format test's 12 control pages are among the 90, so from 28 Nov the
  control group also has the new design. Compare control vs test only on data
  before 28 Nov.

Suggested reads at 2 and 4 weeks (around 12 Dec and 26 Dec):
- GSC: clicks, impressions, average position for the 90 URLs, 28 days before vs after 28 Nov.
- Core Web Vitals (LCP and CLS on mobile): the hero is now a large photo.
- GA4 / Clarity: scroll depth, `guide_see_models` and `guide_fit_email` events, product-page clicks.

## Rollback

In `app/[seoSlug]/page.tsx`, render `SeoLandingExperience` again (it is still in
the repo) with the `modelRows` it needs, or `git revert` the tagged commit.
