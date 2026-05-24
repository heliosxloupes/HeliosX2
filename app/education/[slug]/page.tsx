import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import Header from '@/components/Header'
import JsonLd from '@/components/JsonLd'
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
} from '@/lib/seo'
import { educationGuides, getEducationGuide } from '@/lib/seo-content'

type EducationGuideProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return educationGuides.map((guide) => ({ slug: guide.slug }))
}

export function generateMetadata({ params }: EducationGuideProps): Metadata {
  const guide = getEducationGuide(params.slug)
  if (!guide) return {}

  return buildMetadata({
    title: guide.metaTitle,
    description: guide.description,
    path: `/education/${guide.slug}`,
    keywords: [guide.title.toLowerCase(), 'surgical loupes', 'dental loupes', 'ergonomic loupes'],
  })
}

export default function EducationGuidePage({ params }: EducationGuideProps) {
  const guide = getEducationGuide(params.slug)
  if (!guide) notFound()
  const diagram =
    guide.slug === 'galilean-vs-prismatic-loupes'
      ? {
          src: '/diagrams/galilean-vs-prismatic.svg',
          alt: 'Diagram comparing Galilean and prismatic loupe optical paths',
        }
      : guide.slug === 'working-distance-for-loupes'
        ? {
            src: '/diagrams/working-distance.svg',
            alt: 'Diagram showing working distance from clinician eye to focal point',
          }
        : guide.slug === 'how-to-measure-pupillary-distance'
          ? {
              src: '/diagrams/pupillary-distance.svg',
              alt: 'Diagram showing pupillary distance measured between pupil centers',
            }
          : null

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            title: guide.title,
            description: guide.description,
            path: `/education/${guide.slug}`,
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Education', path: '/education' },
            { name: guide.title, path: `/education/${guide.slug}` },
          ]),
          faqJsonLd(guide.faqs),
        ]}
      />
      <Header />
      <main className="min-h-screen bg-black pt-20 text-neutral-100">
        <article className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
          <Link href="/education" className="text-sm font-semibold text-emerald-200 hover:text-white">
            Back to education
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
            {guide.kicker}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
            {guide.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-neutral-300">{guide.intro}</p>
          <p className="mt-4 text-sm text-neutral-400">Built for {guide.audience}.</p>

          {diagram ? (
            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
              <Image
                src={diagram.src}
                alt={diagram.alt}
                width={1200}
                height={760}
                className="h-auto w-full"
                priority
              />
            </div>
          ) : null}

          <div className="mt-12 space-y-10">
            {guide.sections.map((section) => (
              <section key={section.title} className="border-t border-white/10 pt-8">
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-neutral-300">{section.body}</p>
                <ul className="mt-5 space-y-2 text-sm text-neutral-300">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {guide.citations?.length ? (
            <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold text-white">References</h2>
              <div className="mt-4 space-y-3 text-sm">
                {guide.citations.map((citation) => (
                  <Link
                    key={citation.href}
                    href={citation.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-emerald-200 hover:text-white"
                  >
                    {citation.label}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-semibold text-white">FAQ</h2>
            <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {guide.faqs.map((faq) => (
                <details key={faq.question} className="py-5">
                  <summary className="cursor-pointer list-none text-base font-semibold text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </article>
      </main>
    </>
  )
}
