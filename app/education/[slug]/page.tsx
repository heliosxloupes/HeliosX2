import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/JsonLd'
import EducationGuideExperience from '@/components/seo/EducationGuideExperience'
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
            src: '/workingdistance.png',
            alt: 'Diagram showing working distance from clinician eye to focal point',
          }
        : guide.slug === 'how-to-measure-pupillary-distance'
          ? {
              src: '/pupillary distance.png',
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
            datePublished: guide.datePublished ?? '2026-04-01',
            dateModified: guide.dateModified ?? guide.datePublished ?? '2026-05-23',
            image: diagram?.src,
            citations: guide.citations,
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Education', path: '/education' },
            { name: guide.title, path: `/education/${guide.slug}` },
          ]),
          faqJsonLd(guide.faqs),
        ]}
      />
      <EducationGuideExperience guide={guide} diagram={diagram} />
    </>
  )
}
