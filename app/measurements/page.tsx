import type { Metadata } from 'next'

import JsonLd from '@/components/JsonLd'
import MeasurementsExperience from '@/components/seo/MeasurementsExperience'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/lib/seo'

const faqs = [
  {
    question: 'What measurements do I need for HeliosX loupes?',
    answer:
      'Most customers need pupillary distance, working distance, and prescription information if prescription lenses are required.',
  },
  {
    question: 'Can I use a smartphone app for pupillary distance?',
    answer:
      'Smartphone apps can help, but accuracy varies. Repeat measurements and use a professional optician measurement when possible.',
  },
  {
    question: 'Which HeliosX model has adjustable working distance?',
    answer:
      'Medusa is the HeliosX ergonomic prismatic loupe system with adjustable working distance.',
  },
]

const steps = [
  {
    title: 'Measure pupillary distance',
    body:
      'Use a professional optician measurement when possible. If using an app or manual ruler method, repeat the measurement several times in good lighting.',
  },
  {
    title: 'Measure working distance',
    body:
      'Sit or stand in your natural working posture and measure from the corner of your eye to the usual focal point where your hands work.',
  },
  {
    title: 'Check posture',
    body:
      'Keep your back and neck neutral while measuring. Do not hunch toward the field just to shorten the distance.',
  },
  {
    title: 'Submit after checkout',
    body:
      'Use the customer measurement flow sent after purchase. Prescription customers should also provide a current eyeglass prescription.',
  },
]

export const metadata: Metadata = buildMetadata({
  title: 'Loupe Measurements Guide | Pupillary Distance and Working Distance',
  description:
    'Learn how to measure pupillary distance and working distance for HeliosX surgical and dental loupes, including app, manual, and posture-based measurement tips.',
  path: '/measurements',
  image: '/workingdistance.png',
  keywords: [
    'loupe measurements',
    'pupillary distance for loupes',
    'working distance for loupes',
    'how to measure PD for loupes',
  ],
})

export default function MeasurementsPage() {
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to measure for surgical and dental loupes',
    description:
      'Measure pupillary distance, working distance, posture, and prescription requirements before final loupe production.',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  }

  return (
    <>
      <JsonLd
        data={[
          howToJsonLd,
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Measurements', path: '/measurements' },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <MeasurementsExperience faqs={faqs} steps={steps} />
    </>
  )
}
