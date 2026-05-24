import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/JsonLd'
import EducationGuideExperience, {
  type RelatedGuide,
  type ShopByLink,
} from '@/components/seo/EducationGuideExperience'
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  howToJsonLd,
  medicalWebPageJsonLd,
} from '@/lib/seo'
import { educationGuides, getEducationGuide } from '@/lib/seo-content'

const shopByLinks: ShopByLink[] = [
  {
    label: 'Surgical loupes',
    href: '/surgical-loupes',
    description: 'Ergonomic prismatic systems built for surgeons, residents, and procedural specialists.',
  },
  {
    label: 'Dental loupes',
    href: '/dental-loupes',
    description: 'Posture-forward optics for dentists, hygienists, and dental students.',
  },
  {
    label: 'Best loupes shortlist',
    href: '/best-loupes',
    description: 'Compare HeliosX models side by side and find the right fit for your work.',
  },
  {
    label: 'Loupes for residents',
    href: '/loupes-for-residents',
    description: 'Trainee-budget options that still deliver attending-grade optical performance.',
  },
  {
    label: 'Loupes for microsurgery',
    href: '/loupes-for-microsurgery',
    description: 'High-magnification builds for hand, plastic, ophthalmic, and reconstructive work.',
  },
  {
    label: 'Submit measurements',
    href: '/measurements',
    description: 'Pupillary distance, working distance, and the steps that ship your custom build.',
  },
]

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
    image: null,
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

  const isHowToGuide = guide.slug === 'how-to-measure-pupillary-distance'

  const relatedGuides: RelatedGuide[] = educationGuides
    .filter((candidate) => candidate.slug !== guide.slug)
    .slice(0, 6)
    .map((candidate) => ({
      slug: candidate.slug,
      title: candidate.title,
      description: candidate.description,
      kicker: candidate.kicker,
    }))

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
          medicalWebPageJsonLd({
            title: guide.title,
            description: guide.description,
            path: `/education/${guide.slug}`,
            audienceType: guide.audience,
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Education', path: '/education' },
            { name: guide.title, path: `/education/${guide.slug}` },
          ]),
          faqJsonLd(guide.faqs),
          ...(isHowToGuide
            ? [
                howToJsonLd({
                  name: guide.title,
                  description: guide.description,
                  path: `/education/${guide.slug}`,
                  image: diagram?.src,
                  totalTime: 'PT5M',
                  steps: guide.sections.map((section) => ({
                    name: section.title,
                    text: [section.body, ...section.bullets].join(' '),
                  })),
                }),
              ]
            : []),
        ]}
      />
      <EducationGuideExperience
        guide={guide}
        diagram={diagram}
        relatedGuides={relatedGuides}
        shopByLinks={shopByLinks}
      />
    </>
  )
}
