import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Mail, Plus } from 'lucide-react'

import Header from '@/components/Header'
import JsonLd from '@/components/JsonLd'
import LanguageSwitcher from '@/components/intl/LanguageSwitcher'
import { hreflangFor, localeHome } from '@/lib/i18n'
import {
  formatUsd,
  magnificationRange,
  modelCopy,
  modelOrder,
  ui,
  type IntlPageContent,
  type IntlSection,
} from '@/lib/intl/pages'
import { magnificationPriceByProduct } from '@/lib/pricing'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, faqJsonLd, supportEmail } from '@/lib/seo'

export function intlMetadata(content: IntlPageContent): Metadata {
  return buildMetadata({
    title: content.title,
    description: content.description,
    path: content.path,
    keywords: content.keywords,
    image: content.image.src === '/share/medusa.jpg' ? '/share/medusa.jpg' : undefined,
  })
}

const modelNames: Record<string, string> = {
  newton: 'Newton',
  galileo: 'Galileo',
  kepler: 'Kepler',
  apollo: 'Apollo',
  medusa: 'Medusa',
}

function Section({ section, content }: { section: IntlSection; content: IntlPageContent }) {
  const { locale } = content
  switch (section.kind) {
    case 'prose':
      return (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-balance md:text-3xl">{section.title}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="leading-7 text-neutral-300">{p}</p>
          ))}
        </section>
      )
    case 'models':
      return (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-balance md:text-3xl">{section.title}</h2>
          <p className="leading-7 text-neutral-300">{section.intro}</p>
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
            {modelOrder.map((slug) => {
              const model = modelCopy[locale][slug]
              const from = Math.min(...Object.values(magnificationPriceByProduct[slug]))
              return (
                <Link
                  key={slug}
                  href={`/product/${slug}`}
                  className="group flex flex-col gap-1 p-4 transition hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {modelNames[slug]}{' '}
                      <span className="text-sm font-normal text-emerald-200/80">
                        · {model.type} · {locale === 'pt' ? magnificationRange(slug).replace(/\./g, ',') : magnificationRange(slug)}
                      </span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-400">{model.note}</p>
                  </div>
                  <p className="shrink-0 text-sm text-neutral-300 tabular-nums">
                    {ui[locale].from} <strong className="text-white">{formatUsd(locale, from)}</strong>
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )
    case 'list':
      return (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-balance md:text-3xl">{section.title}</h2>
          <ul className="list-disc space-y-2 pl-5 text-neutral-300 marker:text-emerald-300/70">
            {section.items.map((item) => (
              <li key={item.lead} className="leading-7">
                <strong className="font-semibold text-white">{item.lead}</strong> {item.text}
              </li>
            ))}
          </ul>
          {section.after ? <p className="leading-7 text-neutral-300">{section.after}</p> : null}
        </section>
      )
    case 'steps':
      return (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-balance md:text-3xl">{section.title}</h2>
          <ol className="list-decimal space-y-2 pl-5 text-neutral-300 marker:text-emerald-300/70">
            {section.items.map((item) => (
              <li key={item} className="leading-7">{item}</li>
            ))}
          </ol>
          {section.after ? <p className="leading-7 text-neutral-300">{section.after}</p> : null}
        </section>
      )
    case 'cta':
      return (
        <section className="rounded-2xl border border-emerald-200/20 bg-emerald-200/[0.06] p-6">
          <h2 className="text-xl font-semibold text-white">{section.title}</h2>
          <p className="mt-2 leading-7 text-neutral-300">{section.text}</p>
          <Link
            href={section.link.href}
            className="mt-4 inline-flex items-center gap-2 font-semibold text-emerald-200 underline-offset-4 hover:underline"
          >
            {section.link.label} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      )
  }
}

export default function IntlPage({ content }: { content: IntlPageContent }) {
  const t = ui[content.locale]
  const pageUrl = absoluteUrl(content.path)
  const lang = hreflangFor[content.locale]
  const isHome = content.path === localeHome[content.locale]
  const portrait = content.image.height > content.image.width

  const crumbs = isHome
    ? [{ name: content.breadcrumb, path: content.path }]
    : [
        { name: t.homeLabel, path: localeHome[content.locale] },
        { name: content.breadcrumb, path: content.path },
      ]

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${pageUrl}#webpage`,
            name: content.title,
            description: content.description,
            url: pageUrl,
            inLanguage: lang,
            isPartOf: { '@id': `${absoluteUrl('/')}#website` },
            publisher: { '@id': `${absoluteUrl('/')}#organization` },
          },
          breadcrumbJsonLd(crumbs),
          faqJsonLd(content.faqs),
        ]}
      />
      <Header />
      <main className="hx-mobile-policy min-h-screen bg-black px-4 pt-28 text-white md:px-8">
        <div className="mx-auto max-w-6xl pb-20">
          <header className="grid items-center gap-10 pb-16 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:pb-24">
            <div className="space-y-6">
              <LanguageSwitcher className="-ml-3" />
              <h1 className="font-display text-[clamp(2.25rem,5.2vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.03em] text-balance">
                {content.h1}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-neutral-300">{content.lead}</p>
              <ul className="grid max-w-xl gap-2 text-sm text-neutral-200 sm:grid-cols-2">
                {content.points.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={content.primaryCta.href}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                >
                  {content.primaryCta.label}
                </Link>
                <a
                  href={`mailto:${supportEmail}?subject=${encodeURIComponent(content.emailCta.subject)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                >
                  <Mail size={16} aria-hidden="true" /> {content.emailCta.label}
                </a>
              </div>
            </div>
            <div
              className={
                portrait
                  ? 'relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[28px] border border-white/10'
                  : 'relative aspect-[1200/630] w-full overflow-hidden rounded-[28px] border border-white/10'
              }
            >
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                priority
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </header>

          <article className="mx-auto max-w-3xl space-y-14">
            {content.sections.map((section) => (
              <Section key={section.title} section={section} content={content} />
            ))}

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold md:text-3xl">{t.faqTitle}</h2>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {content.faqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-white [&::-webkit-details-marker]:hidden">
                      {faq.question}
                      <Plus size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-300 transition-transform group-open:rotate-45" />
                    </summary>
                    <p className="mt-2 leading-7 text-neutral-300">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <nav aria-label={t.moreTitle} className="text-sm text-neutral-400">
              <span className="text-neutral-500">{t.moreTitle}: </span>
              {content.related.map((link, i) => (
                <span key={link.href}>
                  {i > 0 ? ' · ' : null}
                  <Link href={link.href} className="underline underline-offset-4 hover:text-white">
                    {link.label}
                  </Link>
                </span>
              ))}
            </nav>
          </article>
        </div>
      </main>
    </>
  )
}
