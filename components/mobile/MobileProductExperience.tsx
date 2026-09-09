'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, ChevronDown, Plus, Ruler, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import ProductReviews from '@/components/ProductReviews'
import { addToCart } from '@/lib/cart'
import { magnificationPriceByProduct, PRESCRIPTION_PRICE } from '@/lib/pricing'
import { getProductAggregateRating, getProductReviews } from '@/lib/reviews'
import { productFaqs } from '@/lib/product-faqs'

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
  const reduceMotion = useReducedMotion()
  const [mag, setMag] = useState(config.magnifications[0] ?? '')
  const [frameId, setFrameId] = useState(frames[0]?.id ?? '')
  const [color, setColor] = useState(frames[0]?.colors[0]?.value ?? '')
  const [prescription, setPrescription] = useState(false)
  const [galleryMode, setGalleryMode] = useState<'product' | 'frame'>('product')
  const [heroIndex, setHeroIndex] = useState(0)

  const chosenFrame = frames.find((frame) => frame.id === frameId) ?? frames[0]
  const chosenColor = chosenFrame?.colors.find((entry) => entry.value === color) ?? chosenFrame?.colors[0]
  const basePrice = magnificationPriceByProduct[config.slug]?.[mag] ?? config.basePrice ?? 0
  const total = basePrice + (prescription ? PRESCRIPTION_PRICE : 0)
  const available = config.isAvailable ?? basePrice > 0
  const rating = getProductAggregateRating(config.slug)
  const faqs = productFaqs[config.slug] ?? []

  const displayedImage = galleryMode === 'frame' ? chosenColor?.image : config.heroImages[heroIndex]
  const workingCopy =
    config.slug === 'medusa'
      ? 'Medusa is the only HeliosX model with adjustable working distance. Its adjustment range is configured for the selected magnification.'
      : 'Your fixed working distance is built from the measurements you submit after checkout.'

  const rise = useMemo(
    () =>
      reduceMotion
        ? {}
        : {
            initial: { opacity: 0, y: 18 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
          },
    [reduceMotion],
  )

  const addConfiguredPair = () => {
    if (!available || !chosenFrame || !chosenColor) return
    addToCart({
      productSlug: config.slug,
      name: `${config.shortName} Surgical Loupes`,
      shortName: config.shortName,
      price: basePrice,
      quantity: 1,
      image: config.heroImages[0] ?? null,
      selectedMagnification: mag,
      selectedFrameId: chosenFrame.id,
      selectedFrameColor: chosenColor.value,
      selectedFrameName: `${chosenFrame.label} - ${chosenColor.name}`,
      selectedFrameImage: chosenColor.image,
      hasPrescriptionLenses: prescription,
    })
    router.push('/cart')
  }

  return (
    <main className="min-h-screen bg-[#06090b] pb-32 pt-14 text-white">
      <div className="px-5 pt-3">
        <Link href="/product" className="flex min-h-11 items-center gap-2 text-xs text-emerald-200">
          <ArrowLeft size={16} /> All loupes
        </Link>
      </div>

      <motion.section {...rise}>
        <div className="relative aspect-[5/4] overflow-hidden border-y border-white/10 bg-[#e9eee9]">
          <AnimatePresence mode="wait" initial={false}>
            {displayedImage ? (
              <motion.div
                key={displayedImage}
                initial={reduceMotion ? undefined : { opacity: 0.35, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="absolute inset-0"
              >
                <Image
                  src={displayedImage}
                  alt={galleryMode === 'frame' ? `${chosenFrame?.label} frame in ${chosenColor?.name}` : `${config.shortName} loupes view ${heroIndex + 1}`}
                  fill
                  priority
                  sizes="100vw"
                  className={galleryMode === 'frame' ? 'object-contain p-3' : 'object-cover'}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <p className="absolute inset-x-0 bottom-0 bg-[#eef2ee]/90 px-4 py-2 text-center text-[11px] text-[#4d5f54] backdrop-blur-sm">
            {galleryMode === 'frame' ? `Selected frame / ${chosenColor?.name}` : 'Product photography / select a view below'}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 px-5">
          <div className="flex gap-5">
            <button type="button" aria-pressed={galleryMode === 'product'} onClick={() => setGalleryMode('product')} className={`min-h-12 border-b-2 text-xs ${galleryMode === 'product' ? 'border-emerald-200 text-emerald-100' : 'border-transparent text-neutral-400'}`}>
              Loupe system
            </button>
            <button type="button" aria-pressed={galleryMode === 'frame'} onClick={() => setGalleryMode('frame')} className={`min-h-12 border-b-2 text-xs ${galleryMode === 'frame' ? 'border-emerald-200 text-emerald-100' : 'border-transparent text-neutral-400'}`}>
              Your frame
            </button>
          </div>
          {galleryMode === 'product' && config.heroImages.length > 1 ? (
            <div className="flex gap-1.5" aria-label="Product images">
              {config.heroImages.map((image, index) => (
                <button key={image} type="button" onClick={() => setHeroIndex(index)} aria-label={`View image ${index + 1}`} aria-pressed={heroIndex === index} className={`h-11 w-5 after:block after:h-1 after:rounded-full ${heroIndex === index ? 'after:bg-emerald-200' : 'after:bg-white/20'}`} />
              ))}
            </div>
          ) : null}
        </div>
      </motion.section>

      <motion.section {...rise} className="px-5 pb-2 pt-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/75">{categoryByModel[config.slug]}</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <h1 className="font-display text-[2.8rem] font-medium leading-none tracking-[-0.055em]">{config.shortName}</h1>
          <span className="pb-1 text-sm text-neutral-400">{rangeByModel[config.slug]}</span>
        </div>
        <p className="mt-4 text-[15px] leading-6 text-neutral-300">{config.description}</p>
        {rating?.reviewCount ? (
          <p className="mt-4 text-xs text-neutral-400"><span className="text-amber-300" aria-hidden="true">★★★★★</span> {rating.ratingValue.toFixed(1)} / {rating.reviewCount} verified review{rating.reviewCount === 1 ? '' : 's'}</p>
        ) : null}
        <div className="mt-6 flex items-baseline gap-3">
          <strong className="text-[2rem] font-medium tracking-[-0.04em]" aria-live="polite">{money(total)}</strong>
          <span className="text-xs text-neutral-400">USD / Shipping included</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-300">
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-200" /> Custom fit</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-200" /> 2-year limited warranty</span>
        </div>
        <div className="mt-6 border-l-2 border-emerald-200 bg-[#14231d] px-4 py-4">
          <strong className="text-sm font-medium text-emerald-100">{config.slug === 'medusa' ? 'Working distance that moves with you.' : 'A working distance made for you.'}</strong>
          <p className="mt-2 text-xs leading-5 text-neutral-300">{workingCopy}</p>
        </div>
      </motion.section>

      <section className="px-5">
        <fieldset className="mt-7 border-t border-white/15 pt-6">
          <legend className="flex w-full items-center gap-3 text-base"><span className="text-xs text-emerald-200">01</span> Magnification <Link href="/education/loupe-magnification-guide" className="ml-auto flex min-h-11 items-center text-xs text-emerald-200 underline underline-offset-4">Help me choose</Link></legend>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {config.magnifications.map((option) => {
              const price = magnificationPriceByProduct[config.slug]?.[option] ?? 0
              return (
                <button key={option} type="button" aria-pressed={mag === option} onClick={() => setMag(option)} className={`min-h-[76px] rounded-md border px-2 py-3 ${mag === option ? 'border-emerald-200 bg-[#203b2b] text-white' : 'border-white/20 text-neutral-300'}`}>
                  <strong className="block text-base font-medium">{option}</strong>
                  <span className="mt-1 block text-xs text-neutral-400">{money(price)}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mt-7 border-t border-white/15 pt-6">
          <legend className="flex w-full items-center gap-3 text-base"><span className="text-xs text-emerald-200">02</span> Your frame <small className="ml-auto text-xs text-neutral-400">{chosenFrame?.label}</small></legend>
          <div className={`mt-4 grid gap-2 ${frames.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {frames.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={frameId === option.id}
                onClick={() => {
                  setFrameId(option.id)
                  setColor(option.colors[0]?.value ?? '')
                  setGalleryMode('frame')
                }}
                className={`overflow-hidden rounded-md border ${frameId === option.id ? 'border-emerald-200 ring-1 ring-emerald-200' : 'border-white/15'}`}
              >
                <span className="relative block h-[72px] bg-white"><Image src={option.baseImage} alt="" fill sizes="33vw" className="object-contain p-1" /></span>
                <span className="flex min-h-11 items-center justify-center px-2 text-xs">{option.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {chosenFrame?.colors.map((entry) => (
              <button key={entry.value} type="button" aria-pressed={color === entry.value} onClick={() => { setColor(entry.value); setGalleryMode('frame') }} className={`min-h-11 rounded-md border px-4 text-xs ${color === entry.value ? 'border-emerald-200 bg-[#1b3024] text-emerald-100' : 'border-white/15 text-neutral-300'}`}>
                {entry.name}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7 border-t border-white/15 pt-6">
          <legend className="flex items-center gap-3 text-base"><span className="text-xs text-emerald-200">03</span> Make it yours</legend>
          <label className={`mt-4 flex min-h-[72px] cursor-pointer items-center gap-4 rounded-md border px-4 py-3 ${prescription ? 'border-emerald-200 bg-[#14231d]' : 'border-white/15'}`}>
            <input type="checkbox" checked={prescription} onChange={(event) => setPrescription(event.target.checked)} className="h-5 w-5 accent-emerald-200" />
            <span className="min-w-0 flex-1"><strong className="block text-sm font-medium">Prescription lenses</strong><small className="mt-1 block text-xs leading-5 text-neutral-400">Submit your prescription after checkout.</small></span>
            <b className="text-sm font-medium">+{money(PRESCRIPTION_PRICE)}</b>
          </label>
        </fieldset>

        <div className="my-7 flex gap-3 border-y border-white/15 py-5">
          <Ruler size={21} className="mt-0.5 shrink-0 text-emerald-200" />
          <p className="text-xs leading-5 text-neutral-300"><strong className="mb-1 block text-sm font-medium text-white">No measurements on hand? That&apos;s okay.</strong>You can submit them after checkout. We review your fit before making your loupes.</p>
        </div>

        <details className="group border-b border-white/15">
          <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between py-4 text-base [&::-webkit-details-marker]:hidden">Specifications <ChevronDown size={18} className="text-emerald-200 transition-transform group-open:rotate-180" /></summary>
          <div className="pb-6 text-sm leading-6 text-neutral-400">
            <p>{config.specDescription}</p>
            {config.specColumns.map((column) => <div key={column.title} className="mt-5"><h2 className="font-medium text-white">{column.title}</h2><ul className="mt-2 list-disc space-y-2 pl-5">{column.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}
          </div>
        </details>
        <details className="group border-b border-white/15">
          <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between py-4 text-base [&::-webkit-details-marker]:hidden">Shipping, fit &amp; warranty <ChevronDown size={18} className="text-emerald-200 transition-transform group-open:rotate-180" /></summary>
          <div className="space-y-3 pb-6 text-sm leading-6 text-neutral-400"><p>Custom production usually takes 1-2 weeks after your measurements are approved. Standard worldwide shipping is included.</p><p>The two-year limited warranty covers manufacturer-related defects.</p><p>Orders are fully refundable before custom production begins.</p></div>
        </details>
      </section>

      {faqs.length > 0 ? (
        <section className="mt-12 border-t border-white/10 px-5 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Common questions</p>
          <h2 className="mt-3 font-display text-[2rem] leading-tight">About {config.shortName}</h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq) => <details key={faq.question} className="group"><summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm [&::-webkit-details-marker]:hidden">{faq.question}<Plus size={17} className="shrink-0 text-emerald-200 transition-transform group-open:rotate-45" /></summary><p className="pb-5 text-sm leading-6 text-neutral-400">{faq.answer}</p></details>)}
          </div>
        </section>
      ) : null}

      <ProductReviews productName={config.shortName} reviews={getProductReviews(config.slug)} aggregate={rating} />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#0c1710]/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="min-w-0 flex-1"><small className="block truncate text-[11px] text-neutral-400">{config.shortName} / {mag}</small><strong className="mt-0.5 block text-xl font-medium">{money(total)} <span className="text-[10px] font-normal text-neutral-400">USD</span></strong></div>
          <button type="button" onClick={addConfiguredPair} disabled={!available} className="flex min-h-[52px] min-w-[54%] items-center justify-between rounded-md bg-emerald-100 px-5 text-sm font-semibold text-[#08261b] disabled:opacity-50">
            Add to bag <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </main>
  )
}
