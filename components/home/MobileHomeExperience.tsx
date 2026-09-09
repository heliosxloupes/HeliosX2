'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Globe2,
  GraduationCap,
  Plus,
  Ruler,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { useMemo, useRef, useState, type ReactNode } from 'react'

import pricing from '@/lib/pricing.json'

type ModelId = 'medusa' | 'apollo' | 'kepler' | 'galileo' | 'newton'
type Filter = 'All loupes' | 'Ergonomic' | 'Everyday' | 'Fine detail'

type Model = {
  id: ModelId
  name: string
  category: string
  group: Exclude<Filter, 'All loupes'>
  range: string
  focus: string
  image: string
}

const MODELS: Model[] = [
  {
    id: 'medusa',
    name: 'Medusa',
    category: 'ERGONOMIC PRISMATIC',
    group: 'Ergonomic',
    range: '3.0×–8.5×',
    focus: 'Adjustable working distance, 300–600 mm',
    image: '/mobile-home/medusa-editorial.png',
  },
  {
    id: 'apollo',
    name: 'Apollo',
    category: 'ERGONOMIC PRISMATIC',
    group: 'Ergonomic',
    range: '3.0×–6.0×',
    focus: 'Fixed working distance, fitted to you',
    image: '/mobile-home/apollo-editorial.png',
  },
  {
    id: 'kepler',
    name: 'Kepler',
    category: 'HIGH-MAGNIFICATION PRISMATIC',
    group: 'Fine detail',
    range: '4.0×–6.0×',
    focus: 'High magnification for fine-detail work',
    image: '/mobile-home/kepler-v2.png',
  },
  {
    id: 'galileo',
    name: 'Galileo',
    category: 'EVERYDAY GALILEAN',
    group: 'Everyday',
    range: '2.5×–3.5×',
    focus: 'Wide field for daily precision work',
    image: '/mobile-home/galileo-editorial.png',
  },
  {
    id: 'newton',
    name: 'Newton',
    category: 'LIGHTWEIGHT GALILEAN',
    group: 'Everyday',
    range: '2.5×–3.5×',
    focus: 'Ultra-light comfort for long clinical days',
    image: '/mobile-home/newton-v2.png',
  },
]

const FILTERS: Filter[] = ['All loupes', 'Ergonomic', 'Everyday', 'Fine detail']

const STEPS = [
  ['01', 'Choose your optics', 'Pick your model, magnification, and frame. Your price stays clear while you configure.'],
  ['02', 'Send your measurements', 'After checkout, share your pupillary distance, working distance, and prescription if needed.'],
  ['03', 'Made for your work', 'We review your fit before production. Custom production usually takes 1–2 weeks after approval.'],
] as const

const FAQS = [
  [
    'Why is HeliosX more accessible?',
    'Our direct-to-clinician model and online fitting process reduce traditional dealer overhead while keeping pricing published and clear.',
  ],
  [
    'Are these customized to me?',
    'Yes. Your frame, pupillary distance, working distance, and prescription information—when applicable—are reviewed before custom production.',
  ],
  [
    'Which model has adjustable working distance?',
    'Medusa is the only adjustable-working-distance model. Apollo, Galileo, Kepler, and Newton use a fixed working distance customized from your measurements.',
  ],
  [
    'When will my loupes arrive?',
    'Custom production usually takes 1–2 weeks after your measurements are approved. Standard worldwide shipping is included; transit time varies by destination.',
  ],
  [
    'What does the warranty cover?',
    'A two-year limited warranty covers manufacturer-related defects in materials and workmanship. Normal wear, accidental damage, misuse, and unauthorized modifications are excluded.',
  ],
] as const

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const startingPrice = (id: ModelId) =>
  Math.min(...Object.values(pricing.products[id].prices as Record<string, number>))

function ParallaxMedia({
  children,
  className,
  travel = 7,
}: {
  children: ReactNode
  className: string
  travel?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}%`, `${travel}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-x-0 -top-[9%] h-[118%] will-change-transform"
        style={reduceMotion ? undefined : { y }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function MobileHomeExperience() {
  const [filter, setFilter] = useState<Filter>('All loupes')
  const reduceMotion = useReducedMotion()
  const visible = useMemo(
    () => MODELS.filter((model) => filter === 'All loupes' || model.group === filter),
    [filter],
  )

  const rise = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] as const },
      }

  return (
    <main className="overflow-x-clip bg-[#03050a] pb-16 pt-14 text-white">
      <section className="px-5 pb-7 pt-9">
        <motion.div {...rise}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/75">
            Surgical &amp; dental loupes
          </p>
          <h1 className="mt-4 font-display text-[2.55rem] font-semibold leading-[1.03] text-white">
            Surgical precision.
            <br />
            <span className="bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent">
              Finally accessible.
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-6 text-neutral-300">
            Premium optics for the work that matters. No gatekeeping. Just fair pricing.
          </p>
          <Link
            href="#mobile-collection"
            className="mt-6 flex min-h-[54px] w-full items-center justify-between gap-4 rounded-lg bg-emerald-100 px-6 text-sm font-semibold text-[#06231a] transition active:scale-[0.99]"
          >
            Explore the loupes
            <ArrowRight size={19} />
          </Link>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-neutral-400">
              Custom loupes from {money(startingPrice('newton'))} <span className="text-neutral-500">USD</span>
            </p>
            <Link
              href="/student-loupes-discount"
              className="flex min-h-11 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200"
            >
              <GraduationCap size={14} /> Students
            </Link>
          </div>
        </motion.div>
      </section>

      <motion.section {...rise}>
        <ParallaxMedia className="h-[330px]" travel={6}>
          <Image
            src="/mobile-home/medusa-editorial.png"
            alt="Medusa ergonomic prismatic surgical loupes"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_63%]"
          />
        </ParallaxMedia>
        <Link
          href="/product/medusa"
          className="relative -mt-24 flex min-h-24 items-end justify-between gap-4 bg-gradient-to-t from-[#03050a] via-[#03050ae8] to-transparent px-5 pb-5 pt-12"
        >
          <span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/80">In focus</span>
            <span className="mt-1 block text-xl font-semibold">
              Medusa <small className="text-xs font-normal text-neutral-300">from {money(startingPrice('medusa'))}</small>
            </span>
            <span className="mt-1 block text-xs text-neutral-300">Ergonomic. Adjustable. Built around you.</span>
          </span>
          <ArrowUpRight size={22} className="mb-1 shrink-0 text-emerald-200" />
        </Link>
      </motion.section>

      <div className="grid grid-cols-2 border-y border-white/10 px-3 py-4 text-[11px] text-neutral-300">
        <span className="flex min-h-11 items-center justify-center gap-1.5 border-r border-white/10 px-1 text-center">
          <Globe2 size={15} className="shrink-0 text-emerald-300/80" /> Shipping included
        </span>
        <span className="flex min-h-11 items-center justify-center gap-1.5 px-1 text-center">
          <ShieldCheck size={15} className="shrink-0 text-emerald-300/80" /> 2-year warranty
        </span>
      </div>

      <section id="mobile-collection" className="scroll-mt-20 px-5 pt-14">
        <motion.div {...rise}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">The collection / 01</p>
              <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.08]">Your work.<br />Your focus.</h2>
            </div>
            <Link href="/loupe-comparisons" className="flex min-h-11 shrink-0 items-center gap-1.5 text-xs text-emerald-200">
              Compare <SlidersHorizontal size={14} />
            </Link>
          </div>
          <p className="mt-5 text-[15px] leading-6 text-neutral-300">
            Five loupe systems. One belief: precision belongs to everyone who pursues it.
          </p>
        </motion.div>

        <div className="mt-6 grid grid-cols-4 gap-1.5" role="group" aria-label="Filter loupes">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={`min-h-11 rounded-lg border px-1 text-[10px] leading-4 transition ${
                filter === item
                  ? 'border-emerald-100 bg-emerald-100 font-semibold text-[#06231a]'
                  : 'border-white/15 text-neutral-300'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-5 flex justify-between text-[11px] text-neutral-400" aria-live="polite">
          <span>{visible.length} loupe system{visible.length === 1 ? '' : 's'}</span>
          <span>All prices in USD</span>
        </p>

        <motion.div layout={!reduceMotion} className="mt-4 grid grid-cols-2 gap-x-3.5 gap-y-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((model) => (
              <motion.article
                layout={!reduceMotion}
                key={model.id}
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 10 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="min-w-0"
              >
                <Link href={`/product/${model.id}`} className="group block">
                  <ParallaxMedia className="aspect-[4/5] rounded-md bg-[#0d1512]" travel={4}>
                    <Image
                      src={model.image}
                      alt={`${model.name} surgical loupes`}
                      fill
                      sizes="(max-width: 767px) 48vw, 1px"
                      className="object-cover"
                    />
                  </ParallaxMedia>
                  <p className="mt-3 min-h-8 text-[9px] leading-4 tracking-[0.05em] text-emerald-200/65">{model.category}</p>
                  <h3 className="flex items-center justify-between gap-2 text-xl font-semibold">
                    {model.name}<ArrowUpRight size={17} className="shrink-0 text-emerald-200/70" />
                  </h3>
                  <p className="mt-2 min-h-[60px] text-[12px] leading-5 text-neutral-400">{model.focus}</p>
                  <p className="mt-1 text-lg font-semibold">
                    <span className="mr-1 text-[10px] font-normal text-neutral-400">From</span>{money(startingPrice(model.id))}
                  </p>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <Link href="/education/loupe-magnification-guide" className="mt-9 flex min-h-24 w-full items-center justify-between gap-4 border-y border-emerald-300/25 py-5 text-left">
          <span>
            <strong className="block text-xl font-semibold">First pair? Start here.</strong>
            <small className="mt-1.5 block text-[13px] leading-5 text-neutral-400">Find your starting point in magnification.</small>
          </span>
          <ArrowUpRight size={22} className="shrink-0 text-emerald-200" />
        </Link>
      </section>

      <section className="mt-14 border-t border-white/10 bg-[#0a1210]">
        <motion.div {...rise} className="px-5 py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Why we exist / 02</p>
          <h2 className="mt-4 font-display text-[2.15rem] font-semibold leading-[1.06]">
            Skill thrives<br />where <span className="text-emerald-300">access exists.</span>
          </h2>
          <p className="mt-6 text-[19px] leading-7 text-neutral-100">Your ambition should set the limit. The price of your loupes shouldn&apos;t.</p>
          <p className="mt-5 text-[15px] leading-6 text-neutral-400">
            HeliosX brings premium optics and honest pricing directly to clinicians—for the student building a foundation, the resident finding their rhythm, and the surgeon pursuing mastery.
          </p>
          <Link href="/how-much-do-surgical-loupes-cost" className="mt-6 flex min-h-11 items-center gap-3 text-sm text-emerald-200">
            Why loupes cost what they do <ArrowRight size={17} />
          </Link>
        </motion.div>
        <ParallaxMedia className="h-[365px]" travel={6}>
          <Image src="/mobile-home/work-editorial.png" alt="Clinician wearing HeliosX loupes" fill sizes="100vw" className="object-cover" />
        </ParallaxMedia>
      </section>

      <section className="px-5 pt-14">
        <motion.div {...rise}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Built around you / 03</p>
          <h2 className="mt-4 font-display text-[2rem] font-semibold leading-[1.08]">Your loupes.<br />Your measurements.</h2>
          <p className="mt-5 text-[15px] leading-6 text-neutral-300">You choose the system. We help make it yours.</p>
        </motion.div>
        <div className="mt-8">
          {STEPS.map(([number, heading, body], index) => (
            <motion.div
              key={number}
              {...rise}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-5 border-t border-white/12 pt-5 [&:not(:first-child)]:mt-5"
            >
              <span className="mt-0.5 min-w-[22px] text-[13px] text-emerald-300/80">{number}</span>
              <div><h3 className="text-lg font-semibold">{heading}</h3><p className="mt-2 text-[14px] leading-6 text-neutral-400">{body}</p></div>
            </motion.div>
          ))}
        </div>
        <Link href="/measurements" className="mt-7 flex min-h-11 items-center gap-3 text-sm text-emerald-200">
          <Ruler size={17} /> How your fitting works <ArrowUpRight size={17} />
        </Link>
      </section>

      <section className="px-5 pt-14">
        <motion.div {...rise}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Clarity before you choose / 04</p>
          <h2 className="mt-4 font-display text-[2rem] font-semibold leading-[1.08]">Good questions.<br />Clear answers.</h2>
        </motion.div>
        <div className="mt-7">
          {FAQS.map(([question, answer]) => (
            <details key={question} className="group border-b border-white/12">
              <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] leading-6 [&::-webkit-details-marker]:hidden">
                {question}<Plus size={18} className="shrink-0 text-emerald-200 transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-6 text-[14px] leading-6 text-neutral-400">{answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-7 text-sm text-neutral-300">Still deciding? Talk to a person.</p>
        <a href="mailto:heliosxloupes@gmail.com" className="mt-1 flex min-h-11 items-center gap-3 text-sm text-emerald-200">
          Ask the HeliosX team <ArrowUpRight size={16} />
        </a>
      </section>

      <motion.section {...rise} className="mt-14 bg-emerald-100 px-6 py-14 text-center text-[#0b2419]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800/70">No gatekeeping. Just fair pricing.</p>
        <h2 className="mt-4 font-display text-[2.15rem] font-semibold leading-[1.05]">Focus on what<br />you came here to do.</h2>
        <Link href="#mobile-collection" className="mx-auto mt-7 flex min-h-[54px] w-full max-w-[340px] items-center justify-between gap-4 rounded-lg bg-[#0b2419] px-6 text-sm font-semibold text-emerald-50 transition active:scale-[0.99]">
          Find your loupes <ArrowRight size={19} />
        </Link>
      </motion.section>

      <section className="px-5 py-10">
        <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70">
          {['Custom fit from your measurements', 'Standard worldwide shipping included', 'Two-year limited warranty'].map((line) => (
            <li key={line} className="flex min-h-12 items-center gap-3 px-4 py-3.5">
              <Check size={15} className="shrink-0 text-emerald-300" /><span className="text-[14px] leading-5 text-neutral-200">{line}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
