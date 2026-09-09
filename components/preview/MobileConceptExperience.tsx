'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Globe2,
  Plus,
  Ruler,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import Header from '@/components/Header'
import { LenisProvider } from '@/components/lenis-provider'
import pricing from '@/lib/pricing.json'

/**
 * Mobile concept — preview only.
 *
 * Fuses the information architecture from the Astra mobile concept (filters,
 * two-up product grid, magnification badges, trustline, numbered fitting
 * steps, inverted closing panel) with the production HeliosX identity:
 * Syne/Manrope rather than Arial, the emerald/cyan-on-near-black palette
 * rather than Astra's mint, Framer Motion entrances, Lenis smooth scroll,
 * and next/image.
 *
 * Deliberately NOT carried over from the concept:
 * - Arial and the -0.05em display tracking (CLAUDE.md forbids unverified
 *   negative letter-spacing, and the brand faces are Syne + Manrope).
 * - Hash routing. This route is presentational; every product link points at
 *   the real production PDP so nothing here forks the purchase path.
 * - The session-only sample bag. Production already has a real cart.
 */

type ModelId = 'medusa' | 'apollo' | 'kepler' | 'galileo' | 'newton'

type Model = {
  id: ModelId
  name: string
  category: string
  group: 'Ergonomic' | 'Everyday' | 'Fine detail'
  range: string
  focus: string
  image: string
  editorial?: boolean
}

const MODELS: Model[] = [
  {
    id: 'medusa',
    name: 'Medusa',
    category: 'ERGONOMIC PRISMATIC',
    group: 'Ergonomic',
    range: '3.0×–8.5×',
    focus: 'Adjustable working distance, 300–600 mm',
    image: '/concept/medusa-editorial.png',
    editorial: true,
  },
  {
    id: 'apollo',
    name: 'Apollo',
    category: 'ERGONOMIC PRISMATIC',
    group: 'Ergonomic',
    range: '3.0×–6.0×',
    focus: 'Posture-aware optics, fitted to you',
    image: '/concept/apollo-editorial.png',
    editorial: true,
  },
  {
    id: 'kepler',
    name: 'Kepler',
    category: 'HIGH-MAGNIFICATION PRISMATIC',
    group: 'Fine detail',
    range: '4.0×–6.0×',
    focus: 'Microsurgery and anastomosis work',
    image: '/Keppler/KepplerMain.png',
  },
  {
    id: 'galileo',
    name: 'Galileo',
    category: 'EVERYDAY GALILEAN',
    group: 'Everyday',
    range: '2.5×–3.5×',
    focus: 'Wide field for daily precision work',
    image: '/concept/galileo-editorial.png',
    editorial: true,
  },
  {
    id: 'newton',
    name: 'Newton',
    category: 'LIGHTWEIGHT GALILEAN',
    group: 'Everyday',
    range: '2.5×–3.5×',
    focus: '33 g. Built for a full day',
    image: '/Newton/NewtonAsian2.png',
  },
]

const FILTERS = ['All loupes', 'Ergonomic', 'Everyday', 'Fine detail'] as const

const STEPS = [
  ['01', 'Choose your optics', 'Pick your model, magnification and frame. The price updates as you configure.'],
  ['02', 'Send your measurements', 'After checkout you share pupillary distance, working distance and any prescription. We review them with you.'],
  ['03', 'Made for your work', 'Custom production takes about 1–2 weeks after approval. Worldwide shipping is included.'],
]

const FAQS: [string, string][] = [
  [
    'Why is HeliosX more accessible?',
    'There is no dealer network, no regional reps and no showrooms. The lineup goes factory, to us, to you, and measurements happen online rather than through a fitting visit. That structure is the entire explanation for the pricing.',
  ],
  [
    'Are these customised to me?',
    'Yes. Your frame, pupillary distance, working distance and prescription — when applicable — are reviewed before custom production begins.',
  ],
  [
    'Which model has adjustable working distance?',
    'Medusa, and only Medusa. It adjusts from 300 to 600 mm in real time. Every other model is built to a single fixed working distance taken from your measurement.',
  ],
  [
    'When will my loupes arrive?',
    'Custom production typically takes 1–2 weeks after your measurements are received and approved. Standard worldwide shipping is included; transit time follows production and varies by destination.',
  ],
  [
    'What does the warranty cover?',
    'A two-year limited warranty covers manufacturer-related defects in materials and workmanship from delivery. Normal wear, accidental damage, misuse and prescription changes are excluded.',
  ],
]

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const startingPrice = (id: ModelId) =>
  Math.min(...Object.values(pricing.products[id].prices as Record<string, number>))

export default function MobileConceptExperience() {
  const [filter, setFilter] = useState<string>('All loupes')
  const reduceMotion = useReducedMotion()

  const visible = useMemo(
    () => MODELS.filter((m) => filter === 'All loupes' || m.group === filter),
    [filter],
  )

  // One motion language for the whole page: a short rise on entry. Concept
  // pages that mix effects read as noisy, and CLAUDE.md asks for one.
  const rise = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
      }

  return (
    <LenisProvider>
      <div className="min-h-screen bg-[#03050a] text-white">
        <div className="border-b border-white/10 bg-[#070d16] px-4 py-2.5 text-center text-[11px] tracking-[0.06em] text-emerald-100/80">
          Worldwide shipping included <span className="mx-2 text-emerald-200/40">·</span> Custom fit, always
        </div>

        <Header />

        <main className="pb-24">
          {/* ---------- Hero ---------- */}
          <section className="px-5 pt-8">
            <motion.div {...rise}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/70">
                Surgical &amp; dental loupes
              </p>
              <h1 className="mt-4 text-[2.6rem] font-bold leading-[1.05] text-white">
                Surgical precision.
                <br />
                <span className="text-emerald-300">Finally accessible.</span>
              </h1>
              <p className="mt-5 text-[15px] leading-6 text-neutral-300">
                Premium optics for the work that matters. No gatekeeping, just fair pricing.
              </p>
              <Link
                href="#collection"
                className="mt-6 flex min-h-[54px] w-full items-center justify-between gap-4 rounded-lg bg-emerald-200 px-6 text-sm font-semibold text-[#06231a] transition hover:bg-emerald-100"
              >
                Explore the loupes
                <ArrowRight size={19} />
              </Link>
              <p className="mt-3 text-xs text-neutral-400">
                Custom loupes from {money(startingPrice('newton'))} <span className="text-neutral-500">USD</span>
              </p>
            </motion.div>
          </section>

          {/* ---------- Hero image with caption card ---------- */}
          <motion.section {...rise} className="relative mt-8 h-[300px] overflow-hidden">
            <Image
              src="/concept/medusa-editorial.png"
              alt="Medusa ergonomic prismatic surgical loupes"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_65%]"
            />
            <Link
              href="/product/medusa"
              className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#03050add] via-[#03050a99] to-transparent px-5 pb-5 pt-16"
            >
              <span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
                  In focus
                </span>
                <span className="mt-1.5 block text-xl font-semibold text-white">
                  Medusa{' '}
                  <span className="text-xs font-normal text-neutral-300">
                    from {money(startingPrice('medusa'))}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-neutral-300">
                  Ergonomic. Adjustable. Built around you.
                </span>
              </span>
              <ArrowUpRight size={22} className="shrink-0 text-emerald-200" />
            </Link>
          </motion.section>

          {/* ---------- Trustline ---------- */}
          <div className="flex items-center justify-around gap-3 border-y border-white/10 px-4 py-4 text-[11px] text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Globe2 size={15} className="text-emerald-300/80" /> Shipping included
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-300/80" /> 2-year warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Ruler size={15} className="text-emerald-300/80" /> Made to measure
            </span>
          </div>

          {/* ---------- Collection ---------- */}
          <section id="collection" className="scroll-mt-20 px-5 pt-14">
            <motion.div {...rise}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">
                    The collection / 01
                  </p>
                  <h2 className="mt-3 text-[2rem] font-bold leading-[1.08] text-white">
                    Your work.
                    <br />
                    Your focus.
                  </h2>
                </div>
                <Link
                  href="/loupe-comparisons"
                  className="flex shrink-0 items-center gap-1.5 pb-1 text-xs text-emerald-200"
                >
                  Compare <SlidersHorizontal size={14} />
                </Link>
              </div>
              <p className="mt-5 text-[15px] leading-6 text-neutral-300">
                Five loupe systems. One belief: precision belongs to everyone who pursues it.
              </p>
            </motion.div>

            {/* Filter chips — nowrap, equal flex, 44px targets */}
            <div className="mt-6 flex gap-1.5" role="group" aria-label="Filter loupes">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`min-h-[44px] flex-1 whitespace-nowrap rounded-lg border px-2 text-xs transition ${
                    filter === f
                      ? 'border-emerald-200 bg-emerald-200 font-semibold text-[#06231a]'
                      : 'border-white/15 text-neutral-300 hover:border-white/30'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <p className="mt-5 flex justify-between text-[11px] text-neutral-400" aria-live="polite">
              <span>
                {visible.length} loupe system{visible.length === 1 ? '' : 's'}
              </span>
              <span>All prices in USD</span>
            </p>

            {/* Two-up grid: the concept's clearest win over the production stack */}
            <div className="mt-4 grid grid-cols-2 gap-x-3.5 gap-y-7">
              {visible.map((m) => (
                <motion.div
                  key={m.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={`/product/${m.id}`} className="group block">
                    <div className="relative aspect-[1.16] overflow-hidden rounded-md bg-[#0d1512]">
                      <Image
                        src={m.image}
                        alt={`${m.name} surgical loupes`}
                        fill
                        sizes="50vw"
                        className={`transition duration-500 group-hover:scale-[1.03] ${
                          m.editorial ? 'object-cover object-bottom' : 'object-cover'
                        }`}
                      />
                      <span className="absolute bottom-2 left-2 rounded border border-white/20 bg-black/75 px-2 py-1 text-[11px] text-neutral-100">
                        {m.range}
                      </span>
                    </div>
                    <p className="mt-3.5 min-h-[32px] text-[10px] leading-[1.5] tracking-[0.04em] text-emerald-200/60">
                      {m.category}
                    </p>
                    <h3 className="flex items-center justify-between text-[1.35rem] font-semibold text-white">
                      {m.name}
                      <ArrowUpRight size={18} className="text-emerald-200/70" />
                    </h3>
                    <p className="mt-2 min-h-[42px] text-[13px] leading-5 text-neutral-400">{m.focus}</p>
                    <p className="mt-2 text-[19px] font-semibold text-white">
                      <span className="mr-1 text-[11px] font-normal text-neutral-400">From</span>
                      {money(startingPrice(m.id))}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link
              href="/education/loupe-magnification-guide"
              className="mt-8 flex w-full items-center justify-between gap-4 border-y border-emerald-300/25 py-6 text-left"
            >
              <span>
                <strong className="block text-xl font-semibold text-white">First pair? Start here.</strong>
                <small className="mt-1.5 block text-[13px] leading-5 text-neutral-400">
                  Find your starting point in magnification.
                </small>
              </span>
              <ArrowUpRight size={22} className="shrink-0 text-emerald-200" />
            </Link>
          </section>

          {/* ---------- Mission ---------- */}
          <section className="mt-14 border-t border-white/10 bg-[#0a1210]">
            <motion.div {...rise} className="px-5 py-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">
                Why we exist / 02
              </p>
              <h2 className="mt-4 text-[2.15rem] font-bold leading-[1.06] text-white">
                Skill thrives
                <br />
                where <span className="text-emerald-300">access exists.</span>
              </h2>
              <p className="mt-6 text-[19px] leading-7 text-neutral-100">
                Your ambition should set the limit. The price of your loupes shouldn&apos;t.
              </p>
              <p className="mt-5 text-[15px] leading-6 text-neutral-400">
                There is no dealer network and no rep taking a cut. Premium optics and honest pricing,
                direct to clinicians — for the student building a foundation, the resident finding their
                rhythm, and the surgeon pursuing mastery.
              </p>
              <Link
                href="/how-much-do-surgical-loupes-cost"
                className="mt-6 flex min-h-[44px] items-center gap-3 text-sm text-emerald-200"
              >
                See where the money goes <ArrowRight size={17} />
              </Link>
            </motion.div>
            <div className="relative h-[320px]">
              <Image
                src="/concept/work-editorial.png"
                alt="A clinician wearing HeliosX loupes mid-procedure"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </section>

          {/* ---------- Fitting steps ---------- */}
          <section className="px-5 pt-14">
            <motion.div {...rise}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">
                Built around you / 03
              </p>
              <h2 className="mt-4 text-[2rem] font-bold leading-[1.08] text-white">
                Your loupes.
                <br />
                Your measurements.
              </h2>
              <p className="mt-5 text-[15px] leading-6 text-neutral-300">
                You choose the system. We make it yours.
              </p>
            </motion.div>

            <div className="mt-8">
              {STEPS.map(([n, heading, body], i) => (
                <motion.div
                  key={n}
                  {...rise}
                  transition={{ ...(rise.transition ?? {}), delay: reduceMotion ? 0 : i * 0.08 }}
                  className="flex gap-5 border-t border-white/12 pt-5 [&:not(:first-child)]:mt-5"
                >
                  <span className="mt-0.5 min-w-[22px] text-[13px] text-emerald-300/80">{n}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{heading}</h3>
                    <p className="mt-2 text-[14px] leading-6 text-neutral-400">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/measurements"
              className="mt-7 flex min-h-[44px] items-center gap-3 text-sm text-emerald-200"
            >
              How your fitting works <ArrowUpRight size={17} />
            </Link>
          </section>

          {/* ---------- Questions ---------- */}
          <section className="px-5 pt-14">
            <motion.div {...rise}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">
                Clarity before you choose / 04
              </p>
              <h2 className="mt-4 text-[2rem] font-bold leading-[1.08] text-white">
                Good questions.
                <br />
                Clear answers.
              </h2>
            </motion.div>

            <div className="mt-7">
              {FAQS.map(([q, a]) => (
                <details key={q} className="group border-b border-white/12">
                  <summary className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] leading-6 text-white [&::-webkit-details-marker]:hidden">
                    {q}
                    <Plus
                      size={18}
                      className="shrink-0 text-emerald-200 transition-transform group-open:rotate-45"
                    />
                  </summary>
                  <p className="pb-6 text-[14px] leading-6 text-neutral-400">{a}</p>
                </details>
              ))}
            </div>

            <div className="mt-7">
              <p className="text-[14px] text-neutral-300">Still deciding? Talk to a person.</p>
              <a
                href="mailto:heliosxloupes@gmail.com"
                className="mt-1 flex min-h-[44px] items-center gap-3 text-sm text-emerald-200"
              >
                Ask the HeliosX team <ArrowUpRight size={16} />
              </a>
            </div>
          </section>

          {/* ---------- Closing (inverted, per the concept) ---------- */}
          <motion.section {...rise} className="mt-14 bg-emerald-100 px-6 py-14 text-center text-[#0b2419]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800/70">
              No gatekeeping. Just fair pricing.
            </p>
            <h2 className="mt-4 text-[2.15rem] font-bold leading-[1.05]">
              Focus on what
              <br />
              you came here to do.
            </h2>
            <Link
              href="#collection"
              className="mx-auto mt-7 flex min-h-[54px] w-full max-w-[340px] items-center justify-between gap-4 rounded-lg bg-[#0b2419] px-6 text-sm font-semibold text-emerald-50 transition hover:bg-[#123024]"
            >
              Find your loupes
              <ArrowRight size={19} />
            </Link>
          </motion.section>

          {/* ---------- Included strip ---------- */}
          <section className="px-5 py-10">
            <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70">
              {[
                'Custom fit from your own measurements',
                'Standard worldwide shipping included',
                'Two-year limited warranty',
              ].map((line) => (
                <li key={line} className="flex items-center gap-3 px-4 py-3.5">
                  <Check size={15} className="shrink-0 text-emerald-300" />
                  <span className="text-[14px] leading-5 text-neutral-200">{line}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </LenisProvider>
  )
}
