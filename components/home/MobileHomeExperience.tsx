'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Globe2, GraduationCap, Plus, Ruler, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { MODELS, money, startingPrice, type M2Model } from '@/components/m2/models'
import { PhotoThumb, StagePhoto } from '@/components/m2/Photo'

type Filter = 'All loupes' | 'Ergonomic' | 'Everyday' | 'Fine detail'

const FILTERS: Filter[] = ['All loupes', 'Ergonomic', 'Everyday', 'Fine detail']

const STEPS = [
  ['01', 'Choose your optics', 'Pick your model, magnification, and frame. Your price stays clear while you configure.'],
  ['02', 'Send your measurements', 'After checkout, share your pupillary distance, working distance, and prescription if needed.'],
  ['03', 'Made for your work', 'We review your fit before production. Custom production usually takes 1–2 weeks after approval.'],
] as const

const FAQS = [
  ['Why is HeliosX more accessible?', 'Our direct-to-clinician model and online fitting process reduce traditional dealer overhead while keeping pricing published and clear.'],
  ['Are these customized to me?', 'Yes. Your frame, pupillary distance, working distance, and prescription information—when applicable—are reviewed before custom production.'],
  ['Which model has adjustable working distance?', 'Medusa is the only adjustable-working-distance model. Apollo, Galileo, Kepler, and Newton use a fixed working distance customized from your measurements.'],
  ['When will my loupes arrive?', 'Custom production usually takes 1–2 weeks after your measurements are approved. Standard worldwide shipping is included; transit time varies by destination.'],
  ['What does the warranty cover?', 'A two-year limited warranty covers manufacturer-related defects in materials and workmanship. Normal wear, accidental damage, misuse, and unauthorized modifications are excluded.'],
] as const

// The collection opens the page: one studio stage per model, swiped like a product reel.
function StageCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const el = trackRef.current
    if (!el || !el.clientWidth) return
    const next = Math.round(el.scrollLeft / el.clientWidth)
    setActive((prev) => (prev === next ? prev : next))
  }

  const goTo = (index: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="The HeliosX collection"
        role="region"
      >
        {MODELS.map((model, index) => (
          <Link
            key={model.slug}
            href={`/product/${model.slug}`}
            className="block w-full shrink-0 snap-center px-3"
            aria-label={`${model.name}, ${model.category}, from ${money(startingPrice(model.slug))}`}
          >
            <span className="relative block h-[420px] overflow-hidden rounded-[28px]" style={{ background: model.photo.tone }}>
              <StagePhoto model={model} scale={1.02} priority={index === 0} animate={index === 0} />
              <span className="m2-shade" aria-hidden="true" />
              <span className="absolute inset-x-0 top-7 z-[2] text-center">
                <span aria-hidden="true" className={`m2-giant m2-giant--light ${index === 0 ? 'm2-rise' : ''}`} style={{ fontSize: 'min(22vw, 6.6rem)' }}>{model.name}</span>
                <span className="m2-sub mt-2.5">{model.category} loupes</span>
              </span>
              <span className="m2-chip bottom-4 left-4 tab">From {money(startingPrice(model.slug))}</span>
              <span className="m2-icon m2-icon--ink absolute bottom-3.5 right-4 z-[4]" aria-hidden="true">
                <ArrowUpRight size={19} />
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-1.5 pb-12" role="tablist" aria-label="Choose a model">
        {MODELS.map((model, index) => (
          <button
            key={model.slug}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-label={model.name}
            onClick={() => goTo(index)}
            className="flex h-8 items-center"
          >
            <span className={`block h-[5px] rounded-full transition-[width,background-color] duration-300 ${active === index ? 'w-7 bg-[#08261b]' : 'w-[5px] bg-[rgba(8,38,27,0.25)]'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

function CollectionRow({ model }: { model: M2Model }) {
  return (
    <Link href={`/product/${model.slug}`} className="m2-row items-stretch p-2 pr-4">
      <span className="relative block h-[84px] w-[112px] shrink-0 overflow-hidden rounded-[14px]" style={{ background: model.photo.tone }}>
        <PhotoThumb model={model} sizes="112px" alt={`${model.name} surgical loupes`} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center py-1">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#4d5f54]">{model.category}</span>
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[19px] font-extrabold tracking-[-0.03em]">{model.name}</span>
          <span className="tab text-[14px] font-extrabold">{money(startingPrice(model.slug))}</span>
        </span>
        <span className="mt-0.5 line-clamp-2 text-[12.5px] leading-[1.35] text-[#26352d]">{model.focus}</span>
      </span>
    </Link>
  )
}

export default function MobileHomeExperience() {
  const [filter, setFilter] = useState<Filter>('All loupes')
  const reduceMotion = useReducedMotion()
  const visible = useMemo(() => MODELS.filter((model) => filter === 'All loupes' || model.group === filter), [filter])

  return (
    <main className="m2 overflow-x-clip pb-6">
      {/* STAGE */}
      <section className="m2-stage pt-[84px]">
        <div className="px-5">
          {/* Same heading order as the desktop hero: the eyebrow is the <h1>. */}
          <h1 className="m2-kicker">Surgical &amp; dental loupes</h1>
          <p className="m2-rise mt-3 text-[min(2.45rem,11.2vw)] font-extrabold leading-[0.98] tracking-[-0.055em]">
            Surgical precision.
            <br />
            Finally accessible.
          </p>
        </div>
        <div className="mt-6">
          <StageCarousel />
        </div>
      </section>

      {/* SHEET */}
      <section className="m2-sheet pb-2">
        <p className="m2-lede text-[16px]">Premium optics for the work that matters. No gatekeeping. Just fair pricing.</p>
        <div className="mt-5 flex gap-2">
          <Link href="#mobile-collection" className="m2-btn m2-btn--ink flex-[1.4] justify-between">
            Explore the loupes <ArrowRight size={18} />
          </Link>
          <Link href="/student-loupe-comparison" className="m2-btn m2-btn--mint">
            <GraduationCap size={17} /> Students
          </Link>
        </div>
        <p className="mt-3 text-[13px] text-[#4d5f54]">
          Custom loupes from <strong className="tab font-extrabold text-[#08261b]">{money(startingPrice('newton'))}</strong> USD
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 text-[12.5px] font-bold">
          <span className="flex min-h-[52px] items-center gap-2 rounded-[16px] bg-[#f7f9f7] px-3.5"><Globe2 size={16} className="shrink-0 text-[#0b6b53]" /> Shipping included</span>
          <span className="flex min-h-[52px] items-center gap-2 rounded-[16px] bg-[#f7f9f7] px-3.5"><ShieldCheck size={16} className="shrink-0 text-[#0b6b53]" /> 2-year warranty</span>
        </div>
      </section>

      {/* COLLECTION */}
      <section id="mobile-collection" className="scroll-mt-20 px-5 pt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="m2-h2 text-[2.1rem]">Your work.<br />Your focus.</h2>
          <Link href="/loupe-comparisons" className="flex min-h-11 shrink-0 items-center gap-1.5 text-[13px] font-bold text-[#0b6b53]">
            Compare <SlidersHorizontal size={14} />
          </Link>
        </div>
        <p className="m2-lede mt-3">Five loupe systems. One belief: precision belongs to everyone who pursues it.</p>

        <div className="m2-pills mt-5" role="group" aria-label="Filter loupes">
          {FILTERS.map((item) => (
            <button key={item} type="button" className="m2-pill" aria-pressed={filter === item} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
        <p className="mt-3 flex justify-between text-[12px] font-semibold text-[#4d5f54]" aria-live="polite">
          <span>{visible.length} loupe system{visible.length === 1 ? '' : 's'}</span>
          <span>All prices in USD</span>
        </p>

        <motion.div layout={!reduceMotion} className="mt-3 grid gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((model) => (
              <motion.div
                layout={!reduceMotion}
                key={model.slug}
                initial={reduceMotion ? undefined : { opacity: 0, transform: 'scale(0.97)' }}
                animate={reduceMotion ? undefined : { opacity: 1, transform: 'scale(1)' }}
                exit={reduceMotion ? undefined : { opacity: 0, transform: 'scale(0.97)' }}
                transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              >
                <CollectionRow model={model} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Link href="/education/loupe-magnification-guide" className="mt-3 flex min-h-[88px] items-center justify-between gap-4 rounded-[22px] bg-[#d1fae5] px-5 transition-transform active:scale-[0.98]">
          <span>
            <strong className="block text-[19px] font-extrabold tracking-[-0.03em]">First pair? Start here.</strong>
            <small className="mt-0.5 block text-[13px] text-[#26352d]">Find your starting point in magnification.</small>
          </span>
          <span className="m2-icon m2-icon--ink shrink-0"><ArrowUpRight size={19} /></span>
        </Link>
      </section>

      {/* MISSION */}
      <section id="mission" className="mt-14 scroll-mt-20 bg-[#14231d] pb-3 text-[#eef2ee]">
        <div className="m2-reveal px-5 pb-10 pt-14">
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[rgba(238,242,238,0.62)]">Why we exist</p>
          <h2 className="mt-4 text-[2.85rem] font-extrabold leading-[0.94] tracking-[-0.06em]">
            Skill thrives where <span className="text-[#d1fae5]">access exists.</span>
          </h2>
          <p className="mt-6 text-[19px] font-bold leading-7">Your ambition should set the limit. The price of your loupes shouldn&apos;t.</p>
          <p className="mt-4 text-[15px] leading-6 text-[rgba(238,242,238,0.74)]">
            HeliosX brings premium optics and honest pricing directly to clinicians—for the student building a foundation, the resident finding their rhythm, and the surgeon pursuing mastery.
          </p>
          <Link href="/how-much-do-surgical-loupes-cost" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d1fae5] px-4 text-[14px] font-extrabold text-[#08261b]">
            Why loupes cost what they do <ArrowRight size={16} />
          </Link>
        </div>
        <div className="relative mx-3 h-[380px] overflow-hidden rounded-[24px]">
          <Image src="/mobile-home/work-editorial-v2.png" alt="Clinician wearing HeliosX loupes" fill sizes="100vw" className="object-cover" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="pt-14">
        <div className="px-5">
          <h2 className="m2-h2 text-[2.1rem]">Your loupes.<br />Your measurements.</h2>
          <p className="m2-lede mt-3">You choose the system. We help make it yours.</p>
        </div>
        <ol className="mt-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-pl-5 px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map(([number, heading, body]) => (
            <li key={number} className="flex min-h-[220px] w-[78%] shrink-0 snap-start flex-col justify-between rounded-[22px] bg-[#f7f9f7] p-5">
              <span className="tab text-[3.4rem] font-extrabold leading-none tracking-[-0.06em] text-[#cfc5bb]">{number}</span>
              <span>
                <h3 className="text-[19px] font-extrabold tracking-[-0.03em]">{heading}</h3>
                <p className="mt-1.5 text-[14px] leading-6 text-[#26352d]">{body}</p>
              </span>
            </li>
          ))}
        </ol>
        <Link href="/measurements" className="mx-5 mt-3 flex min-h-11 items-center gap-2.5 text-[14px] font-bold text-[#0b6b53]">
          <Ruler size={17} /> How your fitting works <ArrowUpRight size={16} />
        </Link>
      </section>

      {/* FAQ */}
      <section className="px-5 pt-12">
        <h2 className="m2-h2 text-[2.1rem]">Good questions.<br />Clear answers.</h2>
        <div className="mt-5">
          {FAQS.map(([question, answer]) => (
            <details key={question} className="m2-details">
              <summary>{question} <Plus size={18} /></summary>
              <p className="pb-5 text-[14px] leading-6 text-[#26352d]">{answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-[14px] text-[#26352d]">Still deciding? Talk to a person.</p>
        <a href="mailto:heliosxloupes@gmail.com" className="mt-0.5 flex min-h-11 items-center gap-2 text-[14px] font-bold text-[#0b6b53]">
          Ask the HeliosX team <ArrowUpRight size={16} />
        </a>
      </section>

      {/* CLOSE */}
      <section className="m2-stage mx-3 mt-12 rounded-[28px] px-6 pb-8 pt-11 text-center">
        <p className="m2-kicker">No gatekeeping. Just fair pricing.</p>
        <h2 className="mt-4 text-[2.3rem] font-extrabold leading-[0.98] tracking-[-0.055em]">Focus on what<br />you came here to do.</h2>
        <div className="relative mx-auto mt-5 h-[150px] w-full overflow-hidden rounded-[20px]">
          <Image src="/m2/galileo/stage.webp" alt="" fill sizes="(max-width: 767px) 90vw, 1px" className="object-cover" style={{ objectPosition: '48% 60%' }} />
        </div>
        <Link href="#mobile-collection" className="m2-btn m2-btn--ink mt-4 w-full justify-between">
          Find your loupes <ArrowRight size={18} />
        </Link>
        <ul className="mt-5 grid gap-1.5 text-left">
          {['Custom fit from your measurements', 'Standard worldwide shipping included', 'Two-year limited warranty'].map((line) => (
            <li key={line} className="flex items-center gap-2.5 text-[13.5px] font-semibold text-[#26352d]">
              <Check size={15} className="shrink-0 text-[#0b6b53]" /> {line}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
