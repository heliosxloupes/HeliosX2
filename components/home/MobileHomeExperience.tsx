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

// Mobile v2: studio cut-outs on greige planes (public/mobile/*.webp).
const MODELS: Model[] = [
  {
    id: 'medusa',
    name: 'Medusa',
    category: 'ERGONOMIC PRISMATIC',
    group: 'Ergonomic',
    range: '3.0×–8.5×',
    focus: 'Adjustable working distance, 300–600 mm',
    image: '/mobile/medusa.webp',
  },
  {
    id: 'apollo',
    name: 'Apollo',
    category: 'ERGONOMIC PRISMATIC',
    group: 'Ergonomic',
    range: '3.0×–6.0×',
    focus: 'Fixed working distance, fitted to you',
    image: '/mobile/apollo.webp',
  },
  {
    id: 'kepler',
    name: 'Kepler',
    category: 'HIGH-MAGNIFICATION PRISMATIC',
    group: 'Fine detail',
    range: '4.0×–6.0×',
    focus: 'High magnification for fine-detail work',
    image: '/mobile/kepler.webp',
  },
  {
    id: 'galileo',
    name: 'Galileo',
    category: 'EVERYDAY GALILEAN',
    group: 'Everyday',
    range: '2.5×–3.5×',
    focus: 'Wide field for daily precision work',
    image: '/mobile/galileo.webp',
  },
  {
    id: 'newton',
    name: 'Newton',
    category: 'LIGHTWEIGHT GALILEAN',
    group: 'Everyday',
    range: '2.5×–3.5×',
    focus: 'Ultra-light comfort for long clinical days',
    image: '/mobile/newton.webp',
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

const eyebrow = 'text-[11px] font-bold uppercase tracking-[0.22em] text-[#56665d]'

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
        transition: { duration: 0.62, ease: [0.23, 1, 0.32, 1] as const },
      }

  return (
    <main className="overflow-x-clip bg-[#eef0ec] pb-16 pt-14 text-[#08261b]">
      <section className="px-5 pb-8 pt-9">
        <motion.div {...rise}>
          {/* Same heading order as the desktop hero: the eyebrow is the <h1>. */}
          <h1 className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#56665d]">
            Surgical &amp; dental loupes
          </h1>
          <p className="mt-4 text-[2.7rem] font-extrabold leading-[0.98] tracking-[-0.05em]">
            Surgical precision.
            <br />
            <span className="text-[#0b6b53]">Finally accessible.</span>
          </p>
          <p className="mt-5 max-w-sm text-[15px] leading-6 text-[#2b3a32]">
            Premium optics for the work that matters. No gatekeeping. Just fair pricing.
          </p>
          <Link
            href="#mobile-collection"
            className="mt-6 flex min-h-[56px] w-full items-center justify-between gap-4 rounded-[16px] bg-[#14231d] px-6 text-[15px] font-bold text-[#eef0ec] transition active:scale-[0.98]"
          >
            Explore the loupes
            <ArrowRight size={19} />
          </Link>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[13px] text-[#56665d]">
              Custom loupes from <strong className="font-bold text-[#08261b]">{money(startingPrice('newton'))}</strong> USD
            </p>
            <Link
              href="/student-loupe-comparison"
              className="flex min-h-11 items-center gap-1.5 rounded-full bg-[#e2f3ea] px-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#0b6b53]"
            >
              <GraduationCap size={14} /> Students
            </Link>
          </div>
        </motion.div>
      </section>

      {/* SPOTLIGHT: the AURA moment. Greige studio plane, the name huge, the pair floating over it. */}
      <section>
        <Link href="/product/medusa" className="mv2-plane relative block h-[430px] overflow-hidden" aria-label="Medusa, from the collection">
          <span className="absolute inset-x-5 top-5 z-[1] flex justify-between text-[11px] font-bold uppercase tracking-[0.22em] text-[#4b5a52]">
            <span>In focus</span>
            <span>300–600 mm</span>
          </span>
          <span aria-hidden="true" className="mv2-giant mv2-rise absolute inset-x-0 top-12 z-[1] block text-center">MEDUSA</span>
          <motion.span
            className="absolute inset-x-3 top-[128px] z-[2] block h-[206px]"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 46, rotate: -8, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, rotate: -5, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <Image
              src="/mobile/medusa.webp"
              alt="Medusa ergonomic prismatic surgical loupes"
              fill
              priority
              sizes="(max-width: 767px) 94vw, 1px"
              className="object-contain drop-shadow-[0_24px_26px_rgba(55,40,28,0.3)]"
            />
          </motion.span>
          <span className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-4 bg-[#eef0ec] px-5 pb-5 pt-5 [border-radius:24px_24px_0_0]">
            <span>
              <span className="block text-xl font-extrabold tracking-[-0.03em]">
                Medusa <small className="text-[13px] font-semibold text-[#56665d]">from {money(startingPrice('medusa'))}</small>
              </span>
              <span className="mt-1 block text-[13px] text-[#2b3a32]">Ergonomic. Adjustable. Built around you.</span>
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#14231d] text-[#eef0ec]">
              <ArrowUpRight size={20} />
            </span>
          </span>
        </Link>
      </section>

      <div className="mx-5 grid grid-cols-2 gap-2 text-[12px] font-semibold text-[#2b3a32]">
        <span className="flex min-h-12 items-center justify-center gap-1.5 rounded-[14px] bg-[#e5e8e2] px-2 text-center">
          <Globe2 size={15} className="shrink-0 text-[#0b6b53]" /> Shipping included
        </span>
        <span className="flex min-h-12 items-center justify-center gap-1.5 rounded-[14px] bg-[#e5e8e2] px-2 text-center">
          <ShieldCheck size={15} className="shrink-0 text-[#0b6b53]" /> 2-year warranty
        </span>
      </div>

      <section id="mobile-collection" className="scroll-mt-20 px-5 pt-14">
        <motion.div {...rise}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className={eyebrow}>The collection</p>
              <h2 className="mt-3 text-[2.1rem] leading-[1.02] tracking-[-0.05em]">Your work.<br />Your focus.</h2>
            </div>
            <Link href="/loupe-comparisons" className="flex min-h-11 shrink-0 items-center gap-1.5 text-[13px] font-bold text-[#0b6b53]">
              Compare <SlidersHorizontal size={14} />
            </Link>
          </div>
          <p className="mt-4 text-[15px] leading-6 text-[#2b3a32]">
            Five loupe systems. One belief: precision belongs to everyone who pursues it.
          </p>
        </motion.div>

        <div className="mt-6 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filter loupes">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={`min-h-11 shrink-0 rounded-full border-[1.5px] px-4 text-[13px] font-bold transition-colors ${
                filter === item
                  ? 'border-[#08261b] bg-[#08261b] text-[#eef0ec]'
                  : 'border-[rgba(8,38,27,0.14)] text-[#2b3a32]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-4 flex justify-between text-[12px] text-[#56665d]" aria-live="polite">
          <span>{visible.length} loupe system{visible.length === 1 ? '' : 's'}</span>
          <span>All prices in USD</span>
        </p>

        <motion.div layout={!reduceMotion} className="mt-4 grid grid-cols-2 gap-x-3 gap-y-7">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((model, index) => (
              <motion.article
                layout={!reduceMotion}
                key={model.id}
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 10 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
                className={`min-w-0 ${index === 0 && visible.length % 2 === 1 ? 'col-span-2' : ''}`}
              >
                <Link href={`/product/${model.id}`} className="group block">
                  <span className={`mv2-plane relative block overflow-hidden rounded-[20px] ${index === 0 && visible.length % 2 === 1 ? 'aspect-[16/9]' : 'aspect-[4/5]'}`}>
                    <span aria-hidden="true" className="absolute inset-x-3 top-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4b5a52]">{model.range}</span>
                    <Image
                      src={model.image}
                      alt={`${model.name} surgical loupes`}
                      fill
                      sizes="(max-width: 767px) 48vw, 1px"
                      className="object-contain px-2 drop-shadow-[0_14px_14px_rgba(55,40,28,0.25)] transition-transform duration-500 group-active:scale-[0.97]"
                    />
                  </span>
                  <p className="mt-3 min-h-8 text-[10px] font-bold leading-4 tracking-[0.08em] text-[#56665d]">{model.category}</p>
                  <h3 className="flex items-center justify-between gap-2 text-xl tracking-[-0.03em]">
                    {model.name}<ArrowUpRight size={17} className="shrink-0 text-[#0b6b53]" />
                  </h3>
                  <p className="mt-1.5 min-h-[40px] text-[12.5px] leading-5 text-[#2b3a32]">{model.focus}</p>
                  <p className="mt-1.5 text-lg font-extrabold tabular-nums">
                    <span className="mr-1 text-[11px] font-semibold text-[#56665d]">From</span>{money(startingPrice(model.id))}
                  </p>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <Link href="/education/loupe-magnification-guide" className="mt-9 flex min-h-24 w-full items-center justify-between gap-4 rounded-[20px] bg-[#e2f3ea] px-5 py-5 text-left">
          <span>
            <strong className="block text-xl font-extrabold tracking-[-0.03em]">First pair? Start here.</strong>
            <small className="mt-1 block text-[13px] leading-5 text-[#2b3a32]">Find your starting point in magnification.</small>
          </span>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#14231d] text-[#eef0ec]"><ArrowUpRight size={20} /></span>
        </Link>
      </section>

      <section id="mission" data-tone="dark" className="mt-14 scroll-mt-20 bg-[#14231d] text-[#eef0ec]">
        <motion.div {...rise} className="px-5 pb-12 pt-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[rgba(238,240,236,0.66)]">Why we exist</p>
          <h2 className="mt-4 text-[2.3rem] leading-[1.02] tracking-[-0.05em]">
            Skill thrives<br />where <span className="text-[#d1fae5]">access exists.</span>
          </h2>
          <p className="mt-6 text-[19px] font-semibold leading-7">Your ambition should set the limit. The price of your loupes shouldn&apos;t.</p>
          <p className="mt-5 text-[15px] leading-6 text-[rgba(238,240,236,0.76)]">
            HeliosX brings premium optics and honest pricing directly to clinicians—for the student building a foundation, the resident finding their rhythm, and the surgeon pursuing mastery.
          </p>
          <Link href="/how-much-do-surgical-loupes-cost" className="mt-6 flex min-h-11 items-center gap-3 text-sm font-bold text-[#d1fae5]">
            Why loupes cost what they do <ArrowRight size={17} />
          </Link>
        </motion.div>
        <div className="px-3 pb-3">
          <ParallaxMedia className="h-[360px] rounded-[22px]" travel={6}>
            <Image src="/mobile-home/work-editorial-v2.png" alt="Clinician wearing HeliosX loupes" fill sizes="100vw" className="object-cover" />
          </ParallaxMedia>
        </div>
      </section>

      <section className="px-5 pt-14">
        <motion.div {...rise}>
          <p className={eyebrow}>Built around you</p>
          <h2 className="mt-3 text-[2.1rem] leading-[1.02] tracking-[-0.05em]">Your loupes.<br />Your measurements.</h2>
          <p className="mt-4 text-[15px] leading-6 text-[#2b3a32]">You choose the system. We help make it yours.</p>
        </motion.div>
        <ol className="mt-7 grid gap-2">
          {STEPS.map(([number, heading, body], index) => (
            <motion.li
              key={number}
              {...rise}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.07, ease: [0.23, 1, 0.32, 1] }}
              className="flex gap-4 rounded-[18px] bg-[#f8f9f6] px-4 py-5"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#08261b] text-[12px] font-extrabold text-[#eef0ec]">{number.replace('0', '')}</span>
              <div><h3 className="text-[17px] tracking-[-0.02em]">{heading}</h3><p className="mt-1.5 text-[14px] leading-6 text-[#2b3a32]">{body}</p></div>
            </motion.li>
          ))}
        </ol>
        <Link href="/measurements" className="mt-5 flex min-h-11 items-center gap-3 text-sm font-bold text-[#0b6b53]">
          <Ruler size={17} /> How your fitting works <ArrowUpRight size={17} />
        </Link>
      </section>

      <section className="px-5 pt-14">
        <motion.div {...rise}>
          <p className={eyebrow}>Clarity before you choose</p>
          <h2 className="mt-3 text-[2.1rem] leading-[1.02] tracking-[-0.05em]">Good questions.<br />Clear answers.</h2>
        </motion.div>
        <div className="mt-6 border-t border-[rgba(8,38,27,0.12)]">
          {FAQS.map(([question, answer]) => (
            <details key={question} className="group border-b border-[rgba(8,38,27,0.12)]">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold leading-6 [&::-webkit-details-marker]:hidden">
                {question}<Plus size={18} className="shrink-0 text-[#0b6b53] transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-5 text-[14px] leading-6 text-[#2b3a32]">{answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-7 text-sm text-[#2b3a32]">Still deciding? Talk to a person.</p>
        <a href="mailto:heliosxloupes@gmail.com" className="mt-1 flex min-h-11 items-center gap-3 text-sm font-bold text-[#0b6b53]">
          Ask the HeliosX team <ArrowUpRight size={16} />
        </a>
      </section>

      <motion.section {...rise} className="mx-3 mt-14 rounded-[26px] bg-[#d1fae5] px-6 py-12 text-center text-[#08261b]">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0b6b53]">No gatekeeping. Just fair pricing.</p>
        <h2 className="mt-4 text-[2.15rem] leading-[1.02] tracking-[-0.05em]">Focus on what<br />you came here to do.</h2>
        <Link href="#mobile-collection" className="mx-auto mt-7 flex min-h-[56px] w-full max-w-[340px] items-center justify-between gap-4 rounded-[16px] bg-[#14231d] px-6 text-[15px] font-bold text-[#eef0ec] transition active:scale-[0.98]">
          Find your loupes <ArrowRight size={19} />
        </Link>
      </motion.section>

      <section className="px-5 py-10">
        <ul className="grid gap-2">
          {['Custom fit from your measurements', 'Standard worldwide shipping included', 'Two-year limited warranty'].map((line) => (
            <li key={line} className="flex min-h-12 items-center gap-3 rounded-[14px] bg-[#e5e8e2] px-4 py-3.5">
              <Check size={15} className="shrink-0 text-[#0b6b53]" /><span className="text-[14px] font-semibold leading-5 text-[#2b3a32]">{line}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
