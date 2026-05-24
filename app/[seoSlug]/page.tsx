import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import Header from '@/components/Header'
import JsonLd from '@/components/JsonLd'
import SeoAnalytics from '@/components/SeoAnalytics'
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  organizationJsonLd,
} from '@/lib/seo'
import { allSeoLandingPages, getSeoLandingPage, productPositioning } from '@/lib/seo-content'

type SeoPageProps = {
  params: {
    seoSlug: string
  }
}

export function generateStaticParams() {
  return allSeoLandingPages.map((page) => ({ seoSlug: page.slug }))
}

export function generateMetadata({ params }: SeoPageProps): Metadata {
  const page = getSeoLandingPage(params.seoSlug)
  if (!page) return {}

  return buildMetadata({
    title: page.metaTitle,
    description: page.description,
    path: `/${page.slug}`,
    keywords: [page.primaryKeyword, ...page.relatedKeywords],
  })
}

export default function SeoLandingPage({ params }: SeoPageProps) {
  const page = getSeoLandingPage(params.seoSlug)
  if (!page) notFound()

  const modelRows = Object.entries(productPositioning).map(([name, positioning]) => ({
    name,
    href: `/product/${name.toLowerCase()}`,
    positioning,
  }))

  const relatedGuides = [
    { href: '/education/loupe-magnification-guide', label: 'Magnification guide' },
    { href: '/education/galilean-vs-prismatic-loupes', label: 'Galilean vs prismatic' },
    { href: '/education/working-distance-for-loupes', label: 'Working distance' },
    { href: '/measurements', label: 'Measurements' },
  ]

  const highIntentLinks = [
    { href: '/best-dental-loupe-brands', label: 'Best dental loupe brands' },
    { href: '/best-surgical-loupe-brands', label: 'Best surgical loupe brands' },
    { href: '/student-loupe-comparison', label: 'Student loupe comparison' },
    { href: '/ergonomic-loupe-comparison', label: 'Ergonomic loupe comparison' },
    { href: '/prismatic-loupe-comparison', label: 'Prismatic loupe comparison' },
    { href: '/heliosx-vs-lumadent', label: 'HeliosX vs LumaDent' },
    { href: '/heliosx-vs-orascoptic', label: 'HeliosX vs Orascoptic' },
    { href: '/heliosx-vs-surgitel', label: 'HeliosX vs SurgiTel' },
  ].filter((link) => link.href !== `/${page.slug}`)

  return (
    <>
      <SeoAnalytics pageType="seo_landing" pageName={page.title} />
      <JsonLd
        data={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: page.title, path: `/${page.slug}` },
          ]),
          faqJsonLd(page.faqs),
        ]}
      />
      <Header />
      <main className="min-h-screen bg-black pt-20 text-neutral-100">
        <section className="border-b border-white/10 px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-end">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                {page.heroKicker}
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
                {page.title} built for real clinical work.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-neutral-300">
                {page.intro}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/product"
                  data-seo-event="shop_loupes_primary"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Shop HeliosX loupes
                </Link>
                <Link
                  href="/measurements"
                  data-seo-event="measurements_primary"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
                >
                  Read measurement guide
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Optimized for
              </p>
              <p className="mt-3 text-xl font-semibold text-white">{page.audience}</p>
              <div className="mt-6 space-y-3">
                {page.proofPoints.map((point) => (
                  <div key={point} className="flex gap-3 text-sm text-neutral-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            {page.sections.map((section) => (
              <article key={section.title} className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-neutral-300">{section.body}</p>
                <ul className="mt-5 space-y-2 text-sm text-neutral-300">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-black px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.82fr,1.18fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Buyer criteria
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                How to choose {page.primaryKeyword.toLowerCase()} without overbuying.
              </h2>
              <p className="mt-4 text-sm leading-7 text-neutral-300">
                Strong loupe SEO should answer the real buying question, not just repeat a
                keyword. Start with the work, then choose optics around posture, magnification,
                fit, support, and price.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Workflow', 'What procedures, appointments, or cases will these loupes support most often?'],
                ['Posture', 'Do you need ergonomic prismatic viewing or adjustable working distance?'],
                ['Magnification', 'How much detail do you need before field of view becomes too narrow?'],
                ['Fit', 'Do you have accurate pupillary distance, working distance, and prescription details?'],
                ['Budget', 'Are you buying for school, residency, practice, or a focused upgrade?'],
                ['Support', 'Can you easily get help with measurements, shipping, prescription, and setup?'],
              ].map(([label, body]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <h3 className="text-sm font-semibold text-white">{label}</h3>
                  <p className="mt-2 text-xs leading-6 text-neutral-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {page.comparisonRows?.length ? (
          <section className="px-4 py-14 md:px-8 md:py-20">
            <div className="mx-auto max-w-6xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Side-by-side
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Comparison snapshot</h2>
              <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
                <div className="min-w-[720px]">
                <div className="grid grid-cols-[0.8fr,1fr,1fr] bg-white/[0.04] text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  <div className="p-4">Feature</div>
                  <div className="p-4">HeliosX</div>
                  <div className="p-4">Other brand</div>
                </div>
                {page.comparisonRows.map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-[0.8fr,1fr,1fr] border-t border-white/10 text-sm text-neutral-300"
                  >
                    <div className="p-4 font-semibold text-white">{row.feature}</div>
                    <div className="p-4 leading-6">{row.heliosx}</div>
                    <div className="p-4 leading-6">{row.other}</div>
                  </div>
                ))}
                </div>
              </div>
              {page.verdict ? (
                <p className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5 text-sm leading-7 text-emerald-50">
                  {page.verdict}
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="border-y border-white/10 bg-neutral-950/70 px-4 py-14 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  Recommended models
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">HeliosX product path</h2>
              </div>
              <Link href="/product" className="text-sm font-semibold text-emerald-200 hover:text-white">
                Compare all loupes
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {page.recommendedProducts.map((product) => (
                <Link
                  key={product}
                  href={`/product/${product.toLowerCase()}`}
                  data-seo-event={`recommended_product_${product.toLowerCase()}`}
                  className="rounded-2xl border border-white/10 bg-black/50 p-5 transition hover:border-emerald-300/60"
                >
                  <h3 className="text-lg font-semibold text-white">{product}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-300">
                    {productPositioning[product as keyof typeof productPositioning]}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-black px-4 py-14 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  Buyer searches
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Continue comparing before you choose.
                </h2>
              </div>
              <Link href="/loupe-comparisons" className="text-sm font-semibold text-emerald-200 hover:text-white">
                Open comparison hub
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {highIntentLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-seo-event={`high_intent_${link.label.toLowerCase().replaceAll(' ', '_')}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-neutral-200 transition hover:border-emerald-300/60 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Model map
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Compare the HeliosX lineup by use case.
              </h2>
              <div className="mt-6 space-y-4">
                {modelRows.map((row) => (
                  <Link
                    key={row.name}
                    href={row.href}
                    data-seo-event={`model_map_${row.name.toLowerCase()}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-sky-300/60"
                  >
                    <h3 className="text-base font-semibold text-white">{row.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-300">{row.positioning}</p>
                  </Link>
                ))}
              </div>
            </div>
            <aside className="rounded-3xl border border-white/10 bg-neutral-950/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Keep learning
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">Related guides</h2>
              <div className="mt-5 space-y-3">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    data-seo-event={`related_${guide.label.toLowerCase().replaceAll(' ', '_')}`}
                    className="block rounded-2xl border border-white/10 px-4 py-3 text-sm text-neutral-200 transition hover:border-emerald-300/60 hover:text-white"
                  >
                    {guide.label}
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Questions
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Quick answers</h2>
            <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer list-none text-base font-semibold text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
