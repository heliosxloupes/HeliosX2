import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import Header from '@/components/Header'
import JsonLd from '@/components/JsonLd'
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
  image: '/working distance.png',
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
      <Header />
      <main className="min-h-screen bg-black pt-20 text-neutral-100">
        <section className="border-b border-white/10 px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr,0.9fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                Measurements
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
                How to measure for HeliosX loupes.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-neutral-300">
                Accurate pupillary distance and working distance help your loupes align with
                your eyes, your posture, and the way you actually work.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/product"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Shop loupes
                </Link>
                <Link
                  href="/education/how-to-measure-pupillary-distance"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
                >
                  Read PD guide
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
              <Image
                src="/working distance.png"
                alt="Clinician measuring working distance for loupes"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Visual guide
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              The two measurements that drive fit.
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
                <Image
                  src="/diagrams/pupillary-distance.svg"
                  alt="Diagram showing pupillary distance measured between pupil centers"
                  width={1200}
                  height={760}
                  className="h-auto w-full"
                />
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
                <Image
                  src="/diagrams/working-distance.svg"
                  alt="Diagram showing working distance from eye to focal point"
                  width={1200}
                  height={760}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            {steps.map((step, index) => (
              <article key={step.title} className="border-t border-white/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  Step {index + 1}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{step.title}</h2>
                <p className="mt-4 text-sm leading-7 text-neutral-300">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-neutral-950/70 px-4 py-14 md:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr,1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Evidence note
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Smartphone PD apps can help, but measure carefully.
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-7 text-neutral-300">
              <p>
                A 2023 peer-reviewed study compared smartphone pupillary distance
                applications against a digital pupilometer and found that app accuracy
                varies. Use apps as a helpful tool, not as a reason to rush the measurement.
              </p>
              <Link
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10389117/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-sm font-semibold text-emerald-200 hover:text-white"
              >
                Read the PubMed Central study
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold text-white">Measurement FAQ</h2>
            <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {faqs.map((faq) => (
                <details key={faq.question} className="py-5">
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
