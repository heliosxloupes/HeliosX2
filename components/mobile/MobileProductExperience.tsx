'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, ChevronDown, Plus, Ruler, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import ProductReviews from '@/components/ProductReviews'
import { useContact } from '@/components/Contact/ContactProvider'
import { addToCart, getCartEditTarget, replaceCartItem } from '@/lib/cart'
import TraineePricing from '@/components/product/TraineePricing'
import { magnificationPriceByProduct, PRESCRIPTION_PRICE } from '@/lib/pricing'
import { getProductAggregateRating, getProductReviews } from '@/lib/reviews'
import { productFaqs } from '@/lib/product-faqs'
import { useStickyBarOffset } from './useStickyBarOffset'

type FrameConfig = {
  id: string
  label: string
  baseImage: string
  colors: { name: string; value: string; image: string }[]
}

type MobileProductConfig = {
  slug: string
  name: string
  shortName: string
  description: string
  highlights: string[]
  heroImages: string[]
  magnifications: string[]
  basePrice?: number
  priceLabel?: string
  isAvailable?: boolean
  specTitle: string
  specDescription: string
  specColumns: { title: string; items: string[] }[]
  specImages: { src: string; alt: string }[]
}

const categoryByModel: Record<string, string> = {
  medusa: 'Ergonomic prismatic',
  apollo: 'Ergonomic prismatic',
  kepler: 'High-magnification prismatic',
  galileo: 'Everyday Galilean',
  newton: 'Lightweight Galilean',
}

const rangeByModel: Record<string, string> = {
  medusa: '3.0x-8.5x',
  apollo: '3.0x-6.0x',
  kepler: '4.0x-6.0x',
  galileo: '2.5x-3.5x',
  newton: '2.5x-3.5x',
}

// Studio cut-outs live in /public/mobile; the hero plane colour is tuned to each photo.
const cutoutModels = ['medusa', 'apollo', 'kepler', 'galileo', 'newton']

const swatchHex: Record<string, string> = {
  black: '#1b1c1e',
  grey: '#8c9196',
  blue: '#1f3a66',
  red: '#9b2a2a',
  gold: '#c9a55a',
  steel: '#a7adb3',
  silver: '#cdd0d4',
  rose: '#d8a49b',
  pink: '#e3a7b8',
  default: '#2a2b2d',
}

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export default function MobileProductExperience({
  config,
  frames,
}: {
  config: MobileProductConfig
  frames: FrameConfig[]
}) {
  const router = useRouter()
  const { openContact, setProductContext } = useContact()
  const reduceMotion = useReducedMotion()
  const buyBarRef = useRef<HTMLDivElement>(null)
  useStickyBarOffset(buyBarRef)
  const [mag, setMag] = useState(config.magnifications[0] ?? '')
  const [frameId, setFrameId] = useState(frames[0]?.id ?? '')
  const [color, setColor] = useState(frames[0]?.colors[0]?.value ?? '')
  const [prescription, setPrescription] = useState(false)
  // Index of the bagged line being edited (opened from the cart with ?edit=N).
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editQuantity, setEditQuantity] = useState(1)

  useEffect(() => {
    const target = getCartEditTarget(config.slug)
    if (!target) return
    const { item } = target
    if (item.selectedMagnification && config.magnifications.includes(item.selectedMagnification)) {
      setMag(item.selectedMagnification)
    }
    const frame = frames.find((entry) => entry.id === item.selectedFrameId)
    if (frame) {
      setFrameId(frame.id)
      if (frame.colors.some((entry) => entry.value === item.selectedFrameColor)) {
        setColor(item.selectedFrameColor as string)
      }
    }
    setPrescription(Boolean(item.hasPrescriptionLenses))
    setEditQuantity(Math.max(1, item.quantity))
    setEditIndex(target.index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.slug])
  const [galleryMode, setGalleryMode] = useState<'product' | 'frame'>('product')
  const [heroIndex, setHeroIndex] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)

  const chosenFrame = frames.find((frame) => frame.id === frameId) ?? frames[0]
  const chosenColor = chosenFrame?.colors.find((entry) => entry.value === color) ?? chosenFrame?.colors[0]
  const basePrice = magnificationPriceByProduct[config.slug]?.[mag] ?? config.basePrice ?? 0
  const total = basePrice + (prescription ? PRESCRIPTION_PRICE : 0)
  const available = config.isAvailable ?? basePrice > 0
  const rating = getProductAggregateRating(config.slug)
  const faqs = productFaqs[config.slug] ?? []
  const cutout = cutoutModels.includes(config.slug) ? `/mobile/${config.slug}.webp` : config.heroImages[0]
  const workingCopy =
    config.slug === 'medusa'
      ? 'Medusa is the only HeliosX model with adjustable working distance. Its adjustment range is configured for the selected magnification.'
      : 'Your fixed working distance is built from the measurements you submit after checkout.'

  const pickColor = (value: string) => {
    setColor(value)
    setGalleryMode('frame')
  }

  // The photo strip is native scroll-snap; the counter follows the scroll position.
  const handleStripScroll = () => {
    const el = stripRef.current
    if (!el) return
    const slide = el.firstElementChild as HTMLElement | null
    const step = slide ? slide.offsetWidth + 10 : el.clientWidth
    const idx = Math.round(el.scrollLeft / step)
    setHeroIndex((prev) => (prev !== idx ? Math.min(idx, config.heroImages.length - 1) : prev))
  }

  const addConfiguredPair = () => {
    if (!available || !chosenFrame || !chosenColor) return
    const item = {
      productSlug: config.slug,
      name: `${config.shortName} Surgical Loupes`,
      shortName: config.shortName,
      price: basePrice,
      quantity: editIndex !== null ? editQuantity : 1,
      image: config.heroImages[0] ?? null,
      selectedMagnification: mag,
      selectedFrameId: chosenFrame.id,
      selectedFrameColor: chosenColor.value,
      selectedFrameName: `${chosenFrame.label} - ${chosenColor.name}`,
      selectedFrameImage: chosenColor.image,
      hasPrescriptionLenses: prescription,
    }
    // Editing a bagged pair replaces that line rather than adding a second pair.
    const replaced = editIndex !== null && replaceCartItem(editIndex, item)
    if (!replaced) addToCart(item)
    router.push('/cart')
  }

  const swap = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 4, filter: 'blur(2px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -4, filter: 'blur(2px)' },
      }

  return (
    <main className="min-h-screen bg-[#eef0ec] pb-36 pt-14 text-[#08261b]">
      {/* HERO: greige studio plane, the model name set huge, the loupes floating over it */}
      <section className="mv2-plane relative overflow-hidden" aria-label={`${config.shortName} product view`}>
        <div className="relative z-[3] flex items-center justify-between px-5 pt-3">
          <Link href="/product" className="flex min-h-11 items-center gap-1.5 text-[13px] font-semibold">
            <ArrowLeft size={16} /> All loupes
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4b5a52]">{rangeByModel[config.slug]}</span>
        </div>

        <div className="relative h-[388px]">
          <p className="mv2-eyebrow absolute inset-x-5 top-1 z-[1] text-[11px] font-bold uppercase tracking-[0.24em] text-[#4b5a52]">
            {categoryByModel[config.slug]}
          </p>
          {/* The desktop template renders the page's single <h1>; both layouts are in the
              DOM, so this one is a level-1 heading for assistive tech only. */}
          <p role="heading" aria-level={1} className="mv2-giant mv2-rise absolute inset-x-0 top-7 z-[1] text-center uppercase">
            {config.shortName}
          </p>

          <AnimatePresence mode="wait" initial={false}>
            {galleryMode === 'frame' && chosenColor ? (
              <motion.div
                key={`frame-${chosenColor.image}`}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-x-6 top-[120px] z-[2] h-[190px] overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_rgba(60,45,30,0.18)]"
              >
                <Image
                  src={chosenColor.image}
                  alt={`${chosenFrame?.label} frame in ${chosenColor.name}`}
                  fill
                  sizes="(max-width: 767px) 90vw, 1px"
                  className="object-contain p-3"
                />
              </motion.div>
            ) : (
              <motion.div
                key="cutout"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, rotate: -6, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, rotate: -4, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-x-4 top-[116px] z-[2] h-[214px]"
              >
                <Image src={cutout} alt={`${config.shortName} surgical loupes`} fill priority sizes="(max-width: 767px) 92vw, 1px" className="object-contain drop-shadow-[0_22px_24px_rgba(55,40,28,0.28)]" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-3 left-5 z-[3] flex rounded-full bg-[rgba(238,240,236,0.72)] p-1 backdrop-blur-sm" role="group" aria-label="Hero view">
            <button type="button" aria-pressed={galleryMode === 'product'} onClick={() => setGalleryMode('product')} className={`min-h-9 rounded-full px-3.5 text-[12px] font-bold transition ${galleryMode === 'product' ? 'bg-[#08261b] text-[#eef0ec]' : 'text-[#2b3a32]'}`}>
              Loupe system
            </button>
            <button type="button" aria-pressed={galleryMode === 'frame'} onClick={() => setGalleryMode('frame')} className={`min-h-9 rounded-full px-3.5 text-[12px] font-bold transition ${galleryMode === 'frame' ? 'bg-[#08261b] text-[#eef0ec]' : 'text-[#2b3a32]'}`}>
              Your frame
            </button>
          </div>
        </div>
      </section>

      {/* PRICE + FINISH: the AURA row */}
      <section className="relative z-[2] -mt-5 rounded-t-[24px] bg-[#eef0ec] px-5 pt-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#56665d]">Price at {mag}</p>
            <div className="relative mt-1 h-[2.6rem] overflow-hidden" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.strong key={total} {...swap} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} className="block text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
                  {money(total)}
                </motion.strong>
              </AnimatePresence>
            </div>
          </div>
          {chosenFrame && chosenFrame.colors.length > 0 ? (
            <div className="flex shrink-0 gap-2.5" role="group" aria-label="Frame colour">
              {chosenFrame.colors.slice(0, 4).map((entry) => (
                <button key={entry.value} type="button" onClick={() => pickColor(entry.value)} aria-pressed={color === entry.value} aria-label={`${entry.name} frame`} className="flex min-w-11 flex-col items-center gap-1.5">
                  <span
                    className={`block h-8 w-8 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)] transition ${color === entry.value ? 'ring-2 ring-[#08261b] ring-offset-2 ring-offset-[#eef0ec]' : ''}`}
                    style={{ background: swatchHex[entry.value] ?? '#888' }}
                  />
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#2b3a32]">{entry.name}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <p className="mt-2 text-[12px] text-[#56665d]">USD. Shipping included.</p>
        <TraineePricing model={config.shortName} magnification={mag} price={basePrice} />

        <p className="mt-5 text-[15px] leading-6 text-[#2b3a32]">{config.description}</p>
        {rating?.reviewCount ? (
          <p className="mt-3 text-[13px] text-[#56665d]"><span className="text-[#b7791f]" aria-hidden="true">★★★★★</span> {rating.ratingValue.toFixed(1)} / {rating.reviewCount} verified review{rating.reviewCount === 1 ? '' : 's'}</p>
        ) : null}

        <ul className="mt-5 grid grid-cols-2 gap-2 text-[12.5px] font-semibold">
          {['30-day returns (non-prescription)', 'Custom fit', '2-year limited warranty', 'Affirm & Klarna at checkout'].map((line) => (
            <li key={line} className="flex items-start gap-1.5 rounded-[12px] bg-[#e5e8e2] px-3 py-2.5 leading-4">
              <Check size={14} className="mt-[1px] shrink-0 text-[#0b6b53]" /> {line}
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-[18px] bg-[#14231d] px-5 py-5 text-[#eef0ec]" data-tone="dark">
          <strong className="block text-[15px] font-bold">{config.slug === 'medusa' ? 'Working distance that moves with you.' : 'A working distance made for you.'}</strong>
          <p className="mt-1.5 text-[13px] leading-5 text-[rgba(238,240,236,0.78)]">{workingCopy}</p>
        </div>
      </section>

      {/* PHOTOS: native swipe strip */}
      {config.heroImages.length > 0 ? (
        <section className="mt-8" aria-label={`${config.shortName} photos`}>
          <div className="flex items-baseline justify-between px-5">
            <h2 className="text-[1.15rem] tracking-[-0.03em]">In the studio</h2>
            <span className="text-[12px] font-semibold tabular-nums text-[#56665d]">{heroIndex + 1} / {config.heroImages.length}</span>
          </div>
          <div
            ref={stripRef}
            onScroll={handleStripScroll}
            className="mt-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain scroll-pl-5 px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {config.heroImages.map((src, index) => (
              <div key={`${src}-${index}`} className="relative h-[300px] w-[78%] shrink-0 snap-start overflow-hidden rounded-[22px] bg-[#d9d0c7]">
                <Image src={src} alt={`${config.shortName} loupes view ${index + 1}`} fill sizes="(max-width: 767px) 78vw, 1px" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* CONFIGURE */}
      <section className="px-5">
        <fieldset className="mt-10">
          <legend className="flex w-full items-center gap-3 text-[1.15rem] font-bold tracking-[-0.03em]">
            Magnification
            <Link href="/education/loupe-magnification-guide" className="ml-auto flex min-h-11 items-center text-[13px] font-semibold text-[#0b6b53] underline underline-offset-4">Help me choose</Link>
          </legend>
          <p className="mt-1 text-[13px] leading-5 text-[#56665d]">
            {config.slug === 'medusa'
              ? 'Each pair is built at one magnification. What Medusa adjusts is working distance (300–600 mm), so choose the magnification you will use most.'
              : 'Each pair is built at one magnification, so choose the one you will use most.'}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {config.magnifications.map((option) => {
              const price = magnificationPriceByProduct[config.slug]?.[option] ?? 0
              const active = mag === option
              return (
                <button key={option} type="button" aria-pressed={active} onClick={() => setMag(option)} className={`min-h-[64px] rounded-[14px] border-[1.5px] px-2 py-2.5 transition-colors ${active ? 'border-[#08261b] bg-[#08261b] text-[#eef0ec]' : 'border-[rgba(8,38,27,0.14)] text-[#08261b]'}`}>
                  <strong className="block text-[15px] font-extrabold">{option}</strong>
                  <span className={`mt-0.5 block text-[12px] font-semibold tabular-nums ${active ? 'text-[rgba(238,240,236,0.72)]' : 'text-[#56665d]'}`}>{money(price)}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mt-9">
          <legend className="flex w-full items-center gap-3 text-[1.15rem] font-bold tracking-[-0.03em]">Your frame <small className="ml-auto text-[13px] font-semibold text-[#56665d]">{chosenFrame?.label} / {chosenColor?.name}</small></legend>
          <div className={`mt-4 grid gap-2 ${frames.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {frames.map((option) => {
              const active = frameId === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setFrameId(option.id)
                    setColor(option.colors[0]?.value ?? '')
                    setGalleryMode('frame')
                  }}
                  className={`overflow-hidden rounded-[14px] border-[1.5px] bg-white transition-colors ${active ? 'border-[#08261b]' : 'border-[rgba(8,38,27,0.1)]'}`}
                >
                  <span className="relative block h-[64px]"><Image src={option.baseImage} alt={`${option.label} frame`} fill sizes="33vw" className="object-contain p-1.5" /></span>
                  <span className={`flex min-h-10 items-center justify-center px-2 text-[12px] font-bold ${active ? 'bg-[#08261b] text-[#eef0ec]' : 'text-[#2b3a32]'}`}>{option.label}</span>
                </button>
              )
            })}
          </div>
          {chosenFrame && chosenFrame.colors.length > 4 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {chosenFrame.colors.map((entry) => (
                <button key={entry.value} type="button" aria-pressed={color === entry.value} onClick={() => pickColor(entry.value)} className={`flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-3.5 text-[12px] font-bold ${color === entry.value ? 'border-[#08261b]' : 'border-[rgba(8,38,27,0.14)]'}`}>
                  <span className="h-4 w-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)]" style={{ background: swatchHex[entry.value] ?? '#888' }} />
                  {entry.name}
                </button>
              ))}
            </div>
          ) : null}
        </fieldset>

        <fieldset className="mt-9">
          <legend className="text-[1.15rem] font-bold tracking-[-0.03em]">Make it yours</legend>
          <label className={`mt-3 flex min-h-[72px] cursor-pointer items-center gap-4 rounded-[16px] border-[1.5px] px-4 py-3 transition-colors ${prescription ? 'border-[#08261b] bg-[#e2f3ea]' : 'border-[rgba(8,38,27,0.14)]'}`}>
            <input type="checkbox" checked={prescription} onChange={(event) => setPrescription(event.target.checked)} className="h-5 w-5 accent-[#08261b]" />
            <span className="min-w-0 flex-1"><strong className="block text-sm font-bold">Prescription lenses</strong><small className="mt-0.5 block text-xs leading-5 text-[#56665d]">Submit your prescription after checkout.</small></span>
            <b className="text-sm font-extrabold tabular-nums">+{money(PRESCRIPTION_PRICE)}</b>
          </label>
        </fieldset>

        <div className="my-8 flex gap-3 rounded-[16px] bg-[#e5e8e2] px-4 py-4">
          <Ruler size={20} className="mt-0.5 shrink-0 text-[#0b6b53]" />
          <p className="text-[13px] leading-5 text-[#2b3a32]"><strong className="mb-1 block text-sm font-bold text-[#08261b]">No measurements on hand? That&apos;s okay.</strong>You can submit them after checkout. We review your fit before making your loupes.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setProductContext({
              slug: config.slug,
              name: config.shortName,
              magnification: mag,
              frame: chosenFrame?.label,
              color: chosenColor?.name,
            })
            openContact(`product_${config.slug}_purchase_mobile`)
          }}
          className="mb-3 flex min-h-14 w-full items-center justify-between border-y border-[rgba(8,38,27,0.12)] py-3 text-left text-sm text-[#2b3a32]"
        >
          <span>
            Questions before ordering? <span className="font-bold text-[#0b6b53]">Email a loupe specialist</span>
          </span>
          <span aria-hidden="true">↗</span>
        </button>

        <details className="group border-b border-[rgba(8,38,27,0.12)]">
          <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between py-4 text-base font-bold [&::-webkit-details-marker]:hidden">Specifications <ChevronDown size={18} className="text-[#0b6b53] transition-transform group-open:rotate-180" /></summary>
          <div className="pb-6 text-sm leading-6 text-[#2b3a32]">
            <p>{config.specDescription}</p>
            {config.specColumns.map((column) => <div key={column.title} className="mt-5"><h2 className="text-[15px] font-bold text-[#08261b]">{column.title}</h2><ul className="mt-2 list-disc space-y-2 pl-5 marker:text-[#0b6b53]">{column.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}
          </div>
        </details>
        <details className="group border-b border-[rgba(8,38,27,0.12)]">
          <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between py-4 text-base font-bold [&::-webkit-details-marker]:hidden">Shipping, fit &amp; warranty <ChevronDown size={18} className="text-[#0b6b53] transition-transform group-open:rotate-180" /></summary>
          <div className="space-y-3 pb-6 text-sm leading-6 text-[#2b3a32]"><p>Custom production usually takes 1-2 weeks after your measurements are approved. Standard worldwide shipping is included.</p><p>The two-year limited warranty covers manufacturer-related defects.</p><p>Non-prescription pairs can be returned within 30 days of delivery for a full refund. Prescription pairs are fully refundable until custom production begins.</p></div>
        </details>
      </section>

      {faqs.length > 0 ? (
        <section className="mt-12 px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#56665d]">Common questions</p>
          <h2 className="mt-2 text-[2rem] leading-tight tracking-[-0.045em]">About {config.shortName}</h2>
          <div className="mt-5 divide-y divide-[rgba(8,38,27,0.12)] border-y border-[rgba(8,38,27,0.12)]">
            {faqs.map((faq) => <details key={faq.question} className="group"><summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">{faq.question}<Plus size={17} className="shrink-0 text-[#0b6b53] transition-transform group-open:rotate-45" /></summary><p className="pb-5 text-sm leading-6 text-[#2b3a32]">{faq.answer}</p></details>)}
          </div>
        </section>
      ) : null}

      <ProductReviews productName={config.shortName} reviews={getProductReviews(config.slug)} aggregate={rating} />

      {/* BUY BAR: one deep green bar, action left, live price right */}
      <div ref={buyBarRef} className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-[#eef0ec] via-[#eef0ec] to-[rgba(238,240,236,0)] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-5">
        <p className="mx-auto mb-1.5 max-w-lg truncate px-1 text-[11px] font-semibold text-[#56665d]">{config.shortName} / {mag} / {chosenFrame?.label} {chosenColor?.name}{prescription ? ' / Rx' : ''}</p>
        <button
          type="button"
          onClick={addConfiguredPair}
          disabled={!available}
          className="mx-auto flex min-h-[58px] w-full max-w-lg items-center justify-between rounded-[18px] bg-[#14231d] px-5 text-[#eef0ec] transition active:scale-[0.98] disabled:opacity-50"
        >
          <span className="flex items-center gap-2.5 text-[15px] font-extrabold"><ShoppingBag size={18} /> {editIndex !== null ? 'Update bag' : 'Add to bag'}</span>
          <span className="text-[15px] font-semibold tabular-nums text-[rgba(238,240,236,0.78)]">{money(total)}</span>
        </button>
      </div>
    </main>
  )
}
