import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Mail } from 'lucide-react'

import Header from '@/components/Header'
import JsonLd from '@/components/JsonLd'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/lib/seo'
import { magnificationPriceByProduct, PRESCRIPTION_PRICE, TRAINEE_PERCENT_OFF } from '@/lib/pricing'

// Landing page for Latin American buyers. Search Console shows HeliosX
// appearing in Mexico, Brazil, Colombia and others for English queries
// ("surgical loupes"), at better positions than in the US, with no page
// speaking to shipping, payment or import costs there. English by owner's
// decision. Prices come from lib/pricing.json.

const PATH = '/surgical-loupes-latin-america'
const TITLE = 'Surgical & Dental Loupes for Latin America | HeliosX'
const DESCRIPTION =
  'Custom-fit surgical and dental loupes from a US brand, shipped to Colombia, Brazil, Venezuela, Mexico, Peru, Chile, Argentina and all of Latin America. From $695 USD, shipping included.'

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'surgical loupes Latin America',
    'surgical loupes Colombia',
    'surgical loupes Mexico',
    'surgical loupes Venezuela',
    'surgical loupes Peru',
    'surgical loupes Chile',
    'surgical loupes Argentina',
    'dental loupes Brazil',
    'affordable surgical loupes South America',
    'loupes shipping to Latin America',
  ],
})

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const from = (slug: string) => usd(Math.min(...Object.values(magnificationPriceByProduct[slug])))
const mags = (slug: string) => {
  const list = Object.keys(magnificationPriceByProduct[slug])
  return `${list[0]}–${list[list.length - 1]}`
}

const countries = [
  'Colombia', 'Brazil', 'Venezuela', 'Mexico', 'Peru', 'Chile', 'Argentina', 'Ecuador',
  'Costa Rica', 'Dominican Republic', 'Puerto Rico', 'Panama', 'Guatemala', 'Uruguay', 'Paraguay', 'Bolivia',
]

const models = [
  { slug: 'newton', name: 'Newton', type: 'Galilean', note: 'The lightest pair (40–50 g with frame). A strong first pair for dental hygiene, students and long days.' },
  { slug: 'galileo', name: 'Galileo', type: 'Galilean', note: 'Wide 110–170 mm field and generous depth of field for everyday clinical work.' },
  { slug: 'kepler', name: 'Kepler', type: 'Prismatic', note: 'Higher magnification for fine detail: vessels, nerves, tendons and microsurgery.' },
  { slug: 'apollo', name: 'Apollo', type: 'Ergonomic prismatic', note: 'Angled optics so you can operate with your head more upright, at a fixed working distance.' },
  { slug: 'medusa', name: 'Medusa', type: 'Ergonomic prismatic', note: 'Working distance adjustable from 300 to 600 mm, for surgeons who sit and stand.' },
]

const faqs = [
  {
    question: 'Do you ship loupes to Colombia, Mexico, Brazil and the rest of Latin America?',
    answer:
      'Yes. We ship to every Latin American country, including Colombia, Brazil, Venezuela, Mexico, Peru, Chile, Argentina, Ecuador, Costa Rica and the Dominican Republic. Standard international shipping is included in the price, and you get a tracking number.',
  },
  {
    question: 'How much do HeliosX loupes cost?',
    answer: `From ${from('newton')} USD for Newton to ${usd(Math.max(...Object.values(magnificationPriceByProduct.medusa)))} USD for Medusa at 8.5x, with shipping and a two-year limited warranty included. Prescription lenses add ${usd(PRESCRIPTION_PRICE)} USD.`,
  },
  {
    question: 'Will I pay import taxes?',
    answer:
      'That depends on your country. Import taxes and customs fees, where they apply, are paid when the parcel arrives and are not charged by us. Email us your country and the model you want, and we will help you estimate the total before you buy.',
  },
  {
    question: 'Can I pay in my local currency?',
    answer:
      'Prices are charged in US dollars to any international credit or debit card. Your bank converts the amount to your local currency.',
  },
  {
    question: 'Is there a discount for residents and students?',
    answer: `Yes. Residents, fellows, and medical and dental students get ${TRAINEE_PERCENT_OFF}% off. Send us proof of your program (ID card, letter or schedule) and, once we have verified it, we send you a code to use at checkout.`,
  },
  {
    question: 'Can I return the loupes from Latin America?',
    answer:
      'Yes. Non-prescription pairs come with 30-day returns from delivery for a full refund. Prescription pairs can be cancelled for a full refund until production starts. Every pair has a two-year limited warranty.',
  },
  {
    question: 'How do I get measured without a sales rep?',
    answer:
      'We only need two numbers: your pupillary distance (from a phone app or an optician) and your working distance (a tape measure, in your working posture). We review them with you before anything is made.',
  },
]

export default function LatinAmericaPage() {
  const pageUrl = absoluteUrl(PATH)
  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${pageUrl}#webpage`,
            name: TITLE,
            description: DESCRIPTION,
            url: pageUrl,
            inLanguage: 'en-US',
          },
          breadcrumbJsonLd([
            { name: 'HeliosX', path: '/' },
            { name: 'Loupes for Latin America', path: PATH },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <Header />
      <main className="hx-mobile-policy min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-10 pb-20">
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200/80">Latin America</p>
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">Surgical and dental loupes for Latin America</h1>
            <p className="text-lg leading-8 text-neutral-300">
              Custom-fit loupes from a US brand, sold to surgeons, dentists and students across Latin America, from Colombia, Brazil and Venezuela to Mexico, Peru, Chile and Argentina. Published prices from {from('newton')} USD, with shipping included. Quality optics without overpaying.
            </p>
            <ul className="grid gap-2 text-sm text-neutral-200 sm:grid-cols-2">
              {[
                'International shipping included',
                '30-day returns (non-prescription pairs)',
                'Two-year limited warranty',
                `${TRAINEE_PERCENT_OFF}% off for residents and students`,
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={16} className="shrink-0 text-emerald-300" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/product" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">
                See the models
              </Link>
              <a
                href="mailto:heliosxloupes@gmail.com?subject=Question%20from%20Latin%20America"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/50"
              >
                <Mail size={16} aria-hidden="true" /> Email us
              </a>
            </div>
          </header>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Where we ship</h2>
            <p className="text-neutral-300">
              Every HeliosX order ships with tracking, and standard international shipping is included in the price. We ship to:
            </p>
            <p className="text-neutral-200">{countries.join(' · ')}, and every other country in Latin America and the Caribbean.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Models and prices</h2>
            <p className="text-neutral-300">Each pair is built at one magnification, to your pupillary distance and working distance. Prices in US dollars, shipping included.</p>
            <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
              {models.map((model) => (
                <Link key={model.slug} href={`/product/${model.slug}`} className="flex flex-col gap-1 p-4 transition hover:bg-white/[0.04] sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div>
                    <p className="font-semibold text-white">
                      {model.name} <span className="text-sm font-normal text-emerald-200/80">· {model.type} · {mags(model.slug)}</span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-400">{model.note}</p>
                  </div>
                  <p className="shrink-0 text-sm text-neutral-200">From <strong className="text-white">{from(model.slug)} USD</strong></p>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Which magnification do I need?</h2>
            <ul className="list-disc space-y-2 pl-5 text-neutral-300">
              <li><strong className="text-white">General dentistry and dental hygiene:</strong> 2.5x to 3.0x, with a wide field across the quadrant.</li>
              <li><strong className="text-white">Dental and medical students:</strong> 2.5x is the most common first pair and the easiest to adapt to.</li>
              <li><strong className="text-white">General and orthopedic surgery:</strong> 2.5x to 3.5x.</li>
              <li><strong className="text-white">Spine and vascular surgery:</strong> 3.0x to 4.5x.</li>
              <li><strong className="text-white">Hand, plastic, endodontics and microsurgery:</strong> 4.0x and up.</li>
            </ul>
            <p className="text-neutral-300">Choose the lowest magnification that shows the hardest routine step of your work clearly. More magnification narrows the field and the depth of field.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">How to order from your country</h2>
            <ol className="list-decimal space-y-2 pl-5 text-neutral-300">
              <li>Choose a model and magnification in our store, and pay by international card in USD.</li>
              <li>Send us your pupillary distance and working distance. We walk you through it.</li>
              <li>We review your measurements with you and build your loupes in 1 to 2 weeks.</li>
              <li>We ship with tracking. Transit time and any import taxes depend on your country.</li>
            </ol>
            <p className="text-neutral-300">
              Want to know the total cost including import taxes before you buy? Email{' '}
              <a href="mailto:heliosxloupes@gmail.com" className="text-emerald-200 underline underline-offset-4">heliosxloupes@gmail.com</a>{' '}
              with your country and the model you are considering.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">{TRAINEE_PERCENT_OFF}% off for residents and students</h2>
            <p className="text-neutral-300">
              If you are a resident, fellow, or medical or dental student, send us proof of your program: an ID card, a university letter or a residency schedule. Once we have verified it, we send you a personal code to use at checkout.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Common questions</h2>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="cursor-pointer list-none font-medium text-white [&::-webkit-details-marker]:hidden">{faq.question}</summary>
                  <p className="mt-2 text-neutral-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="text-sm text-neutral-500">
            More guides: <Link href="/surgical-loupes" className="underline underline-offset-4">surgical loupes</Link>,{' '}
            <Link href="/dental-loupes" className="underline underline-offset-4">dental loupes</Link>,{' '}
            <Link href="/surgical-loupes-international-shipping" className="underline underline-offset-4">international shipping</Link>,{' '}
            <Link href="/returns" className="underline underline-offset-4">returns</Link>.
          </p>
        </article>
      </main>
    </>
  )
}
