'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Globe2, Plus, Ruler, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'

import { MODELS, money, startingPrice, type M2Model } from '@/components/m2/models'
import { PhotoThumb, StagePhoto } from '@/components/m2/Photo'
import PromoBadge from '@/components/PromoBadge'
import AskSpecialistButton from '@/components/Contact/AskSpecialistButton'
import SpecialtySection from '@/components/home/SpecialtySection'
import HairlineFigure from '@/components/m2/HairlineFigure'
import CustomHairline, { type CustomHairlineName } from '@/components/m2/CustomHairline'

type Filter ='All loupes' | 'Ergonomic' | 'Everyday' | 'Fine detail'

const FILTERS: Filter[] = ['All loupes', 'Ergonomic', 'Everyday', 'Fine detail']

// Mirrors the desktop homepage's clarity and customization sections so the
// mobile page Google indexes carries the same content.
const OPTICS = [
  ['Magnification', 'Configurable magnification ranges tuned for plastics, hand, microsurgery, dentistry, and general precision work.'],
  ['Depth and field', 'Balanced depth of field that supports steady visualization without constant micro-adjustments.'],
  ['Coatings and contrast', 'Anti-reflective coatings and high-quality glass help maintain contrast under OR lighting and headlights.'],
] as const

const FIT = [
  'Multiple frame styles: modern, hipster, vintage, classic.',
  'Material choices: ultra-light polymer or premium alloy metal.',
  'Magnification options from 2.5x to 8.5x for any procedure type.',
] as const

const GUIDES = [
  ['/education/loupe-magnification-guide', 'Which magnification do I need?'],
  ['/education/galilean-vs-prismatic-loupes', 'Galilean vs prismatic loupes'],
  ['/education/working-distance-for-loupes', 'How to measure working distance'],
  ['/ergonomic-loupe-comparison', 'Ergonomic loupes compared'],
  ['/how-much-do-surgical-loupes-cost', 'What surgical loupes cost'],
  ['/student-loupe-comparison', 'Loupes for students and residents'],
] as const

const STEPS: ReadonlyArray<readonly [string, string, string, CustomHairlineName]> = [
  ['01', 'Choose your optics', 'Pick your model, magnification, and frame. Your price stays clear while you configure.', 'optics'],
  ['02', 'Send your measurements', 'After checkout, share your pupillary distance, working distance, and prescription if needed.', 'caliper'],
  ['03', 'Made for your work', 'We review your fit before production. Custom production usually takes 1–2 weeks after approval.', 'case'],
]

const FAQS = [
  ['Why is HeliosX more accessible?', 'Our direct-to-clinician model and online fitting process reduce traditional dealer overhead while keeping pricing published and clear.'],
  ['Are these customized to me?', 'Yes. Your frame, pupillary distance, working distance, and prescription information—when applicable—are reviewed before custom production.'],
  ['Which model has adjustable working distance?', 'Medusa is the only adjustable-working-distance model. Apollo, Galileo, Kepler, and Newton use a fixed working distance customized from your measurements.'],
  ['When will my loupes arrive?', 'Custom production usually takes 1–2 weeks after your measurements are approved. Standard worldwide shipping is included; transit time varies by destination.'],
  ['What does the warranty cover?', 'A limited lifetime warranty covers manufacturer-related defects in materials and workmanship. Normal wear, accidental damage, misuse, and unauthorized modifications are excluded.'],
] as const

// The collection opens the page full screen: one studio photograph per model,
// swiped like a product reel. The brand line stays put while the photos move.
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

  const current = MODELS[active] ?? MODELS[0]

  return (
    <section className="relative h-[100svh] min-h-[620px] max-h-[920px] overflow-hidden" aria-label="The HeliosX collection">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MODELS.map((model, index) => (
          <Link
            key={model.slug}
            href={`/product/${model.slug}`}
            className="relative block h-full w-full shrink-0 snap-center overflow-hidden"
            style={{ background: model.photo.tone }}
            aria-label={`${model.name}, ${model.category}, from ${money(startingPrice(model.slug))}`}
          >
            <span className="m2-kenburns absolute inset-x-0 bottom-[150px] top-[150px]">
              <StagePhoto model={model} scale={1.12} priority={index === 0} animate={index === 0} fadeBottom />
            </span>
            <span className="m2-shade" aria-hidden="true" />
            <span className="m2-name-drift absolute inset-x-0 top-[88px] z-[2] text-center">
              <span aria-hidden="true" className={`m2-giant m2-giant--light ${index === 0 ? 'm2-rise' : ''}`} style={{ fontSize: 'min(24vw, 7rem)' }}>{model.name}</span>
              <span className="m2-sub mt-3">{model.category} loupes</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Fixed over the moving photos: the promise, the price, the way in. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[300px] bg-[linear-gradient(180deg,rgba(24,19,15,0)_0%,rgba(24,19,15,0.55)_45%,rgba(24,19,15,0.82)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 z-[4] px-5 pb-[46px]">
        {/* Same heading order as the desktop hero: the eyebrow is the <h1>. */}
        <h1 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[rgba(241,244,241,0.72)]">Surgical &amp; dental loupes</h1>
        <p className="m2-rise mt-2 text-[min(2.3rem,10.6vw)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#f1f4f1]">
          Surgical precision.
          <br />
          Finally accessible.
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <Link href={`/product/${current.slug}`} className="flex min-h-[48px] items-center gap-3 rounded-full bg-[#f1f4f1] py-1.5 pl-4 pr-1.5 text-[14px] font-extrabold text-[#08261b] transition-transform active:scale-[0.97]">
            <span key={current.slug} className="tab m2-swap">{current.name} from {money(startingPrice(current.slug))}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#08261b] text-[#f1f4f1]"><ArrowUpRight size={17} /></span>
          </Link>
          <div className="flex gap-1" role="tablist" aria-label="Choose a model">
            {MODELS.map((model, index) => (
              <button key={model.slug} type="button" role="tab" aria-selected={active === index} aria-label={model.name} onClick={() => goTo(index)} className="flex h-9 items-center px-0.5">
                <span className={`block h-[5px] rounded-full transition-[width,background-color] duration-300 ${active === index ? 'w-6 bg-[#f1f4f1]' : 'w-[5px] bg-[rgba(241,244,241,0.45)]'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Brand film: a 480p silent cut (~390 KB vs 1.7 MB). preload="none" keeps it
// off the network until it scrolls into view; it then plays muted and pauses
// again when it leaves. Reduced motion or Data Saver get tap-to-play instead.
function InViewFilm() {
  const ref = useRef<HTMLVideoElement>(null)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setManual(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => setManual(true))
        else video.pause()
      },
      { threshold: 0.4 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src="/mainpagevideo2-mobile.mp4"
      poster="/mainpagevideo2-poster.jpg"
      muted
      loop
      playsInline
      preload="none"
      controls={manual}
      aria-label="HeliosX loupes brand film"
      className="h-full w-full object-cover"
    />
  )
}

const MISSION_WORDS = [
  ['Skill', false],
  ['thrives', false],
  ['where', false],
  ['access', true],
  ['exists.', true],
] as const

const MISSION_PHOTOS = [
  ['/m2/mission-surgeon.webp', 'Clinician focused on detailed work wearing HeliosX Medusa loupes', '50% 35%'],
  ['/m2/mission-2.webp', 'Surgeon operating in the OR wearing HeliosX Medusa loupes', '50% 30%'],
  ['/m2/mission-3.webp', 'Close-up of a surgeon wearing HeliosX Medusa loupes during a procedure', '50% 30%'],
] as const

// Swipeable photo strip; every photo stays in the HTML so all are indexable.
function MissionCarousel() {
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
    <div className="relative mx-3 h-[440px] overflow-hidden rounded-[24px]" aria-roledescription="carousel" aria-label="HeliosX loupes in use">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="m2-coverflow flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MISSION_PHOTOS.map(([src, alt, position]) => (
          <div key={src} className="relative h-full w-full shrink-0 snap-center">
            <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1">
        {MISSION_PHOTOS.map(([src], index) => (
          <button key={src} type="button" aria-label={`Show photo ${index + 1}`} aria-current={active === index} onClick={() => goTo(index)} className="flex h-9 items-center px-0.5">
            <span className={`block h-[5px] rounded-full transition-[width,background-color] duration-300 ${active === index ? 'w-6 bg-[#f1f4f1]' : 'w-[5px] bg-[rgba(241,244,241,0.55)]'}`} />
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
        <span className="m2-parallax absolute inset-0">
          <PhotoThumb model={model} sizes="112px" alt={`${model.name} surgical loupes`} />
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center py-1">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#4d5f54]">{model.category}</span>
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[19px] font-extrabold tracking-[-0.03em]">{model.name}</span>
          <span className="tab text-[14px] font-extrabold">{money(startingPrice(model.slug))}</span>
        </span>
        <span className="mt-0.5 line-clamp-2 text-[12.5px] leading-[1.35] text-[#26352d]"><span className="tab font-bold">{model.range.replace('-', '–')}</span> · {model.focus}</span>
      </span>
    </Link>
  )
}

// Where CSS scroll timelines are missing, play the same entrances on visibility.
function useRevealFallback(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || CSS.supports('animation-timeline: view()')) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    root.classList.add('m2-io')
    const targets = root.querySelectorAll('.m2-reveal, .m2-stagger > *, .m2-in, .m2-word, .m2-settle')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rootRef])
}

export default function MobileHomeExperience() {
  const [filter, setFilter] = useState<Filter>('All loupes')
  const reduceMotion = useReducedMotion()
  const mainRef = useRef<HTMLElement>(null)
  useRevealFallback(mainRef)
  const visible = useMemo(() => MODELS.filter((model) => filter === 'All loupes' || model.group === filter), [filter])

  return (
    <main ref={mainRef} className="m2 overflow-x-clip pb-6">
      <StageCarousel />

      {/* SHEET */}
      <section className="m2-sheet pb-2" style={{ marginTop: -24 }}>
        <p className="m2-lede text-[16px]">Premium optics for the work that matters. No gatekeeping. Just fair pricing.</p>
        <Link href="#mobile-collection" className="m2-btn m2-btn--ink mt-5 w-full justify-between">
          Explore the loupes <ArrowRight size={18} />
        </Link>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[12.5px] font-bold">
          <span className="flex min-h-[52px] items-center gap-2 rounded-[16px] bg-[#f7f9f7] px-3.5"><Globe2 size={16} className="shrink-0 text-[#0b6b53]" /> Shipping included</span>
          <span className="flex min-h-[52px] items-center gap-2 rounded-[16px] bg-[#f7f9f7] px-3.5"><ShieldCheck size={16} className="shrink-0 text-[#0b6b53]" /> Lifetime warranty</span>
        </div>
        <p className="mt-3 text-[13px] text-[#4d5f54]">
          Custom loupes from <strong className="tab font-extrabold text-[#08261b]">{money(startingPrice('newton'))}</strong> USD
        </p>
        <PromoBadge className="mt-2" />
      </section>

      {/* COLLECTION */}
      <section id="mobile-collection" className="scroll-mt-20 px-5 pt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="m2-h2 m2-reveal text-[2.1rem]">Five loupe systems.<br />One fitting standard.</h2>
          <Link href="/loupe-comparisons" className="flex min-h-11 shrink-0 items-center gap-1.5 text-[13px] font-bold text-[#0b6b53]">
            Compare <SlidersHorizontal size={14} />
          </Link>
        </div>
        <p className="m2-lede mt-3">Ergonomic prismatic and Galilean loupes for surgery and dentistry, 2.5x to 8.5x. Precision belongs to everyone who pursues it.</p>

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
                <div className="m2-in">
                  <CollectionRow model={model} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Link href="/education/loupe-magnification-guide" className="mt-3 flex min-h-[88px] items-center justify-between gap-3 rounded-[22px] bg-[#d1fae5] py-3 pl-5 pr-3 transition-transform active:scale-[0.98]">
          <span>
            <strong className="block text-[19px] font-extrabold tracking-[-0.03em]">First pair? Start here.</strong>
            <small className="mt-0.5 block text-[13px] text-[#26352d]">Find your starting point in magnification.</small>
            <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-[#0b6b53]">Magnification guide <ArrowUpRight size={14} /></span>
          </span>
          <CustomHairline name="magnifier" tone="mint" className="w-[132px] shrink-0" />
        </Link>
      </section>

      <SpecialtySection variant="mobile" />

      {/* OPTICS: the brand film lives here so the VideoObject in the homepage
          structured data points at a video that exists on mobile too. */}
      <section className="px-5 pt-14">
        <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#4d5f54]">Optical clarity</p>
        <h2 className="m2-h2 m2-reveal mt-3 text-[2.1rem]">Optical clarity.<br />Honest price.</h2>
        <p className="m2-lede mt-3">
          Built for those who pursue mastery: a clear, stable view of the field, ergonomic comfort, and elite quality at a fair price.
        </p>
        <div className="m2-settle relative mt-5 aspect-video overflow-hidden rounded-[22px] bg-[#14231d]">
          <InViewFilm />
        </div>
        <dl className="m2-stagger mt-3 grid gap-2">
          {OPTICS.map(([label, body]) => (
            <div key={label} className="rounded-[18px] bg-[#f7f9f7] p-4">
              <dt className="text-[15px] font-extrabold tracking-[-0.02em]">{label}</dt>
              <dd className="mt-1 text-[14px] leading-6 text-[#26352d]">{body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* FIT */}
      <section className="px-5 pt-14">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#4d5f54]">Customization</p>
            <h2 className="m2-h2 m2-reveal mt-3 text-[2.1rem]">Built for every specialty.<br />Tailored to you.</h2>
          </div>
          <CustomHairline name="frames" className="-mr-2 w-[112px] shrink-0" />
        </div>
        <p className="m2-lede mt-3">
          No two clinicians operate the same way. Choose your frame, material, and magnification, and we tailor the system to your anatomy and workflow.
        </p>
        <ul className="m2-stagger mt-5 grid gap-2.5">
          {FIT.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-[14px] leading-6 text-[#26352d]">
              <Check size={16} className="mt-1 shrink-0 text-[#0b6b53]" /> {line}
            </li>
          ))}
        </ul>
      </section>

      {/* MISSION */}
      <section id="mission" className="mt-14 scroll-mt-20 bg-[#14231d] pb-3 text-[#eef2ee]">
        <div className="m2-reveal px-5 pb-10 pt-14">
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[rgba(238,242,238,0.62)]">Why we exist</p>
          <h2 className="mt-4 text-[2.85rem] font-extrabold leading-[0.94] tracking-[-0.06em]">
            {MISSION_WORDS.map(([word, accent], i) => (
              <span key={i}>
                <span
                  className={`m2-word ${accent ? 'text-[#d1fae5]' : ''}`}
                  style={{ animationRange: `entry ${20 + i * 9}% cover ${38 + i * 9}%`, transitionDelay: `${i * 90}ms` }}
                >
                  {word}
                </span>{' '}
              </span>
            ))}
          </h2>
          <p className="mt-6 text-[19px] font-bold leading-7">Your ambition should set the limit. The price of your loupes shouldn&apos;t.</p>
          <p className="mt-4 text-[15px] leading-6 text-[rgba(238,242,238,0.74)]">
            HeliosX brings premium optics and honest pricing directly to clinicians—for the student building a foundation, the resident finding their rhythm, and the surgeon pursuing mastery.
          </p>
          <p className="mt-4 text-[15px] leading-6 text-[rgba(238,242,238,0.74)]">
            We watched residents delay buying loupes because rent mattered more, and students borrow gear because their budget had limits. The problem was never the craftsmanship. It was the gatekeeping. So we built an alternative.
          </p>
          <p className="mt-4 text-[13px] leading-5 text-[rgba(238,242,238,0.6)]">
            A note on the name: HeliosX Loupes is a direct-to-clinician medical-device brand for surgical and dental loupes. We are not affiliated with the UK healthtech company also called HeliosX.
          </p>
          <Link href="/how-much-do-surgical-loupes-cost" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d1fae5] px-4 text-[14px] font-extrabold text-[#08261b]">
            Why loupes cost what they do <ArrowRight size={16} />
          </Link>
        </div>
        <MissionCarousel />
      </section>

      {/* HOW IT WORKS */}
      <section className="pt-14">
        <div className="px-5">
          <h2 className="m2-h2 m2-reveal text-[2.1rem]">Custom fitted to<br />your measurements.</h2>
          <p className="m2-lede mt-3">You choose the system. We help make it yours.</p>
        </div>
        <ol className="m2-focus-strip mt-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-pl-5 px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map(([number, heading, body, figure]) => (
            <li key={number} className="flex min-h-[220px] w-[78%] shrink-0 snap-start flex-col justify-between rounded-[22px] bg-[#f7f9f7] p-5">
              <span className="flex items-start justify-between gap-3">
                <span className="tab text-[3.4rem] font-extrabold leading-none tracking-[-0.06em] text-[#cfc5bb]">{number}</span>
                <CustomHairline name={figure} tone="card" className="-mr-1 -mt-1 w-[120px]" />
              </span>
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

      {/* GUIDES */}
      <section className="px-5 pt-12">
        <div className="flex items-end justify-between gap-3">
          <h2 className="m2-h2 m2-reveal text-[2.1rem]">Loupe guides<br />before you buy.</h2>
          <CustomHairline name="shelf" className="-mr-2 w-[104px] shrink-0" />
        </div>
        <ul className="m2-stagger mt-5">
          {GUIDES.map(([href, label]) => (
            <li key={href} className="border-b border-[rgba(8,38,27,0.1)]">
              <Link href={href} className="flex min-h-[52px] items-center justify-between gap-3 text-[15px] font-bold">
                {label} <ArrowUpRight size={16} className="shrink-0 text-[#0b6b53]" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="px-5 pt-12">
        <div className="flex items-end justify-between gap-3">
          <h2 className="m2-h2 m2-reveal text-[2.1rem]">Loupe questions,<br />answered.</h2>
          <HairlineFigure name="Query" className="-mr-2 w-[96px] shrink-0" />
        </div>
        <div className="mt-5">
          {FAQS.map(([question, answer]) => (
            <details key={question} className="m2-details">
              <summary>{question} <Plus size={18} /></summary>
              <p className="pb-5 text-[14px] leading-6 text-[#26352d]">{answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-[14px] text-[#26352d]">Still deciding? Talk to a person.</p>
        <AskSpecialistButton source="mobile_home_faq" className="mt-0.5 flex min-h-11 items-center gap-2 text-[14px] font-bold text-[#0b6b53]">
          Ask the HeliosX team <ArrowUpRight size={16} />
        </AskSpecialistButton>
      </section>

      {/* CLOSE */}
      <section className="m2-stage mx-3 mt-12 rounded-[28px] px-6 pb-8 pt-11 text-center">
        <p className="m2-kicker">No gatekeeping. Just fair pricing.</p>
        <h2 className="mt-4 text-[2.3rem] font-extrabold leading-[0.98] tracking-[-0.055em]">Focus on what<br />you came here to do.</h2>
        <div className="relative mx-auto mt-5 h-[150px] w-full overflow-hidden rounded-[20px]">
          <span className="m2-parallax absolute inset-0">
            <Image src="/m2/galileo/stage.webp" alt="Galileo surgical loupes" fill sizes="(max-width: 767px) 90vw, 1px" className="object-cover" style={{ objectPosition: '48% 60%' }} />
          </span>
        </div>
        <Link href="#mobile-collection" className="m2-btn m2-btn--ink mt-4 w-full justify-between">
          Find your loupes <ArrowRight size={18} />
        </Link>
        <ul className="mt-5 grid gap-1.5 text-left">
          {['Custom fit from your measurements', 'Standard worldwide shipping included', 'Limited lifetime warranty'].map((line) => (
            <li key={line} className="flex items-center gap-2.5 text-[13.5px] font-semibold text-[#26352d]">
              <Check size={15} className="shrink-0 text-[#0b6b53]" /> {line}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
