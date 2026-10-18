'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronRight, Plus, Ruler, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import ProductReviews from '@/components/ProductReviews'
import { useContact } from '@/components/Contact/ContactProvider'
import Sheet from '@/components/m2/Sheet'
import { StagePhoto } from '@/components/m2/Photo'
import { modelBySlug, money, swatchHex } from '@/components/m2/models'
import { addToCart, getCartEditTarget, getLinkedMagnification, replaceCartItem } from '@/lib/cart'
import TraineePricing from '@/components/product/TraineePricing'
import { magnificationPriceByProduct, PRESCRIPTION_PRICE, TRAINEE_PERCENT_OFF } from '@/lib/pricing'
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
  const barRef = useRef<HTMLDivElement>(null)
  useStickyBarOffset(barRef)
  const model = modelBySlug(config.slug)

  const [mag, setMag] = useState(config.magnifications[0] ?? '')
  const [frameId, setFrameId] = useState(frames[0]?.id ?? '')
  const [color, setColor] = useState(frames[0]?.colors[0]?.value ?? '')
  const [prescription, setPrescription] = useState(false)
  const [frameSheet, setFrameSheet] = useState(false)
  const [toast, setToast] = useState(false)
  // Index of the bagged line being edited (opened from the cart with ?edit=N).
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editQuantity, setEditQuantity] = useState(1)

  useEffect(() => {
    const linked = getLinkedMagnification(config.magnifications)
    if (linked) setMag(linked)
  }, [config.magnifications])

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

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(false), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const chosenFrame = frames.find((frame) => frame.id === frameId) ?? frames[0]
  const chosenColor = chosenFrame?.colors.find((entry) => entry.value === color) ?? chosenFrame?.colors[0]

  // Questions asked from the header's Ask button carry the pair being configured.
  // Deferred a tick so it lands after the (hidden) desktop template's own context.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProductContext({ slug: config.slug, name: config.shortName, magnification: mag, frame: chosenFrame?.label, color: chosenColor?.name })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [config.slug, config.shortName, mag, chosenFrame?.label, chosenColor?.name, setProductContext])
  const basePrice = magnificationPriceByProduct[config.slug]?.[mag] ?? config.basePrice ?? 0
  const total = basePrice + (prescription ? PRESCRIPTION_PRICE : 0)
  const available = config.isAvailable ?? basePrice > 0
  const rating = getProductAggregateRating(config.slug)
  const faqs = productFaqs[config.slug] ?? []
  const optics = model?.optics[mag]
  const gallery = model && model.gallery.length ? model.gallery : config.heroImages
  const workingCopy =
    config.slug === 'medusa'
      ? 'Medusa is the only HeliosX model with adjustable working distance. Its adjustment range is configured for the selected magnification.'
      : 'Your fixed working distance is built from the measurements you submit after checkout.'

  const buildItem = () => {
    if (!chosenFrame || !chosenColor) return null
    return {
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
  }

  // Editing a bagged pair replaces that line rather than adding a second pair.
  const commit = () => {
    const item = buildItem()
    if (!available || !item) return false
    const replaced = editIndex !== null && replaceCartItem(editIndex, item)
    if (!replaced) addToCart(item)
    return true
  }

  const addToBag = () => {
    if (commit()) setToast(true)
  }

  const buyNow = () => {
    if (commit()) router.push('/cart')
  }

  const swap = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, transform: 'translateY(6px)', filter: 'blur(3px)' },
        animate: { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
        exit: { opacity: 0, transform: 'translateY(-6px)', filter: 'blur(3px)' },
      }

  return (
    <main className="m2 min-h-screen pb-28">
      {/* STAGE: the name set huge, the pair floating across the letters */}
      <section
        className="m2-stage h-[500px]"
        style={model ? { background: model.photo.tone } : undefined}
        aria-label={`${config.shortName} surgical loupes`}
      >
        {/* The whole studio photograph: the pair on its block, the wall above carries the name. */}
        {model ? (
          <StagePhoto model={model} priority alt={`${config.shortName} surgical loupes on a studio block`} />
        ) : (
          <Image src={config.heroImages[0]} alt={`${config.shortName} surgical loupes`} fill priority sizes="100vw" className="object-cover" />
        )}
        <span className="m2-shade" aria-hidden="true" />
        <div className="absolute inset-x-0 top-[78px] z-[2] text-center">
          {/* The desktop template renders the page's single <h1>; both layouts are in the
              DOM, so this one is a level-1 heading for assistive tech only. */}
          <p role="heading" aria-level={1} className="m2-giant m2-giant--light m2-rise" style={{ fontSize: 'min(24vw, 7rem)' }}>
            {config.shortName}
          </p>
          <span className="m2-sub m2-rise mt-3" style={{ animationDelay: '60ms' }}>{model?.category ?? 'Surgical'} loupes</span>
        </div>
        {model ? <span className="m2-chip m2-fade bottom-[52px] right-4">{model.chip}</span> : null}
      </section>

      {/* SHEET */}
      <section className="m2-sheet">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="m2-cap">Price <span className="tab">{mag}</span></div>
            <div className="relative h-[36px] overflow-hidden" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={total} {...swap} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="m2-price">
                  {money(total)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {chosenFrame ? (
            <div className="shrink-0 text-right">
              <div className="m2-swatches justify-end" role="group" aria-label="Frame finish">
                {chosenFrame.colors.slice(0, 4).map((entry) => (
                  <button key={entry.value} type="button" className="m2-swatch" aria-pressed={color === entry.value} aria-label={`${entry.name} finish`} onClick={() => setColor(entry.value)}>
                    <i style={{ background: swatchHex[entry.value] ?? '#888' }} />
                  </button>
                ))}
              </div>
              <div className="m2-cap mt-0.5 pr-1">{chosenFrame.label} / {chosenColor?.name}</div>
            </div>
          ) : null}
        </div>

        <div className="mt-1">
          <TraineePricing model={config.shortName} magnification={mag} price={basePrice} />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="m2-cap">Magnification</span>
          <Link href="/education/loupe-magnification-guide" className="flex min-h-10 items-center text-[13px] font-bold text-[#0b6b53]">Help me choose</Link>
        </div>
        <div className="m2-pills mt-1.5" role="group" aria-label="Magnification">
          {config.magnifications.map((option) => (
            <button key={option} type="button" className="m2-pill tab" aria-pressed={mag === option} onClick={() => setMag(option)}>
              {option}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-[12.5px] leading-5 text-[#4d5f54]">
          {config.slug === 'medusa'
            ? 'Each pair is built at one magnification. What Medusa adjusts is working distance (300–600 mm), so choose the magnification you will use most.'
            : 'Each pair is built at one magnification, so choose the one you will use most.'}
        </p>

        {optics ? (
          <dl className="mt-4 grid grid-cols-3 rounded-[18px] bg-[#f7f9f7] px-1 py-3">
            {(
              [
                ['Field', optics.field],
                ['Depth', optics.depth],
                ['Weight', optics.weight],
              ] as const
            )
              .filter(([, value]) => value)
              .map(([label, value], index) => (
                <div key={label} className={`px-3 ${index ? 'border-l border-[rgba(8,38,27,0.1)]' : ''}`}>
                  <dt className="text-[11px] font-semibold text-[#4d5f54]">{label}</dt>
                  <dd className="tab mt-0.5 text-[15px] font-extrabold leading-tight">{value}</dd>
                </div>
              ))}
          </dl>
        ) : null}

        {chosenFrame ? (
          <button type="button" className="m2-row mt-3" onClick={() => setFrameSheet(true)} aria-haspopup="dialog">
            <span className="m2-thumb h-[48px] w-[76px]">
              <Image src={chosenColor?.image ?? chosenFrame.baseImage} alt="" fill sizes="76px" className="object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#4d5f54]">Frame</span>
              <span className="block truncate text-[15px] font-extrabold">{chosenFrame.label} in {chosenColor?.name}</span>
            </span>
            <span className="flex items-center gap-0.5 text-[13px] font-bold text-[#0b6b53]">
              Change <ChevronRight size={16} />
            </span>
          </button>
        ) : null}

        <button type="button" role="switch" aria-checked={prescription} onClick={() => setPrescription((value) => !value)} className="m2-row mt-2 pl-4">
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-extrabold">Prescription lenses</span>
            <span className="block text-[12.5px] text-[#4d5f54]">+{money(PRESCRIPTION_PRICE)}. Submit your prescription after checkout.</span>
          </span>
          <span className="m2-switch" aria-hidden="true" />
        </button>

        <p className="m2-lede mt-6">{config.description}</p>
        {rating?.reviewCount ? (
          <a href="#reviews-mobile" className="mt-2 inline-flex min-h-9 items-center gap-1 text-[13px] text-[#4d5f54] underline decoration-[#4d5f54]/30 underline-offset-4">
            <span className="text-[#a8650f]" aria-hidden="true">★★★★★</span> {rating.ratingValue.toFixed(1)} from {rating.reviewCount} verified review{rating.reviewCount === 1 ? '' : 's'}
          </a>
        ) : null}
      </section>

      {/* GALLERY */}
      {gallery.length ? (
        <div className="m2-gallery mt-6" aria-label={`${config.shortName} photos`}>
          {gallery.slice(0, 1).map((src) => (
            <div key={src}>
              <Image src={src} alt={`${config.shortName} loupes view 1`} fill sizes="240px" className="object-cover" />
            </div>
          ))}
          {model?.film ? (
            <div className="is-film">
              <video src={model.film} autoPlay muted loop playsInline preload="metadata" aria-label={`${config.shortName} product film`} />
            </div>
          ) : null}
          {gallery.slice(1).map((src, index) => (
            <div key={src}>
              <Image src={src} alt={`${config.shortName} loupes view ${index + 2}`} fill sizes="240px" className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      <section className="px-5">
        <dl className="m2-facts mt-7 border-y border-[rgba(8,38,27,0.12)]">
          {(model?.facts ?? []).map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
          <div><dt>Warranty</dt><dd>Limited lifetime</dd></div>
          <div><dt>Returns</dt><dd>30 days, non-prescription</dd></div>
          <div><dt>Residents and students</dt><dd>{TRAINEE_PERCENT_OFF}% off, verified</dd></div>
          <div><dt>Shipping</dt><dd>Included, worldwide</dd></div>
        </dl>

        <div className="mt-6 rounded-[22px] bg-[#14231d] px-5 py-5 text-[#eef2ee]">
          <strong className="block text-[16px] font-extrabold tracking-[-0.02em]">{config.slug === 'medusa' ? 'Working distance that moves with you.' : 'A working distance made for you.'}</strong>
          <p className="mt-1.5 text-[13px] leading-5 text-[rgba(238,242,238,0.76)]">{workingCopy}</p>
          <div className="mt-4 flex gap-3 border-t border-[rgba(238,242,238,0.14)] pt-4">
            <Ruler size={18} className="mt-0.5 shrink-0 text-[#d1fae5]" />
            <p className="text-[12.5px] leading-5 text-[rgba(238,242,238,0.76)]"><strong className="block text-[13.5px] text-[#eef2ee]">No measurements on hand? That&apos;s okay.</strong>You can submit them after checkout. We review your fit before making your loupes.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setProductContext({ slug: config.slug, name: config.shortName, magnification: mag, frame: chosenFrame?.label, color: chosenColor?.name })
            openContact(`product_${config.slug}_purchase_mobile`)
          }}
          className="mt-3 flex min-h-[56px] w-full items-center justify-between rounded-[18px] bg-[#f7f9f7] px-4 text-left text-[14px] text-[#26352d] transition-transform active:scale-[0.98]"
        >
          <span>Questions before ordering? <span className="font-extrabold text-[#0b6b53]">Ask a loupe specialist</span></span>
          <ChevronRight size={18} className="shrink-0 text-[#0b6b53]" />
        </button>

        <div className="mt-8">
          <details className="m2-details">
            <summary>Specifications <Plus size={18} /></summary>
            <div className="pb-6 text-[14px] leading-6 text-[#26352d]">
              <p>{config.specDescription}</p>
              {config.specColumns.map((column) => (
                <div key={column.title} className="mt-5">
                  <h2 className="text-[15px] font-extrabold text-[#08261b]">{column.title}</h2>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-[#0b6b53]">{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </details>
          <details className="m2-details">
            <summary>Shipping, fit &amp; warranty <Plus size={18} /></summary>
            <div className="space-y-3 pb-6 text-[14px] leading-6 text-[#26352d]">
              <p>Custom production usually takes 1-2 weeks after your measurements are approved. Standard worldwide shipping is included.</p>
              <p>The limited lifetime warranty covers manufacturer-related defects.</p>
              <p>Non-prescription pairs can be returned within 30 days of delivery for a full refund. Prescription pairs are fully refundable until custom production begins.</p>
            </div>
          </details>
        </div>

        {faqs.length > 0 ? (
          <section className="mt-12">
            <h2 className="m2-h2">About {config.shortName}</h2>
            <div className="mt-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="m2-details">
                  <summary>{faq.question} <Plus size={18} /></summary>
                  <p className="pb-5 text-[14px] leading-6 text-[#26352d]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </section>

      <div className="mt-8">
        <ProductReviews productName={config.shortName} reviews={getProductReviews(config.slug)} aggregate={rating} />
      </div>

      {/* FRAME PICKER */}
      <Sheet
        open={frameSheet}
        onOpenChange={setFrameSheet}
        title="Choose your frame"
        description="Pick a base frame, then the finish. All frames support light mounts and prescription builds."
        footer={
          <button type="button" className="m2-btn m2-btn--ink w-full" onClick={() => setFrameSheet(false)}>
            Use {chosenFrame?.label} in {chosenColor?.name}
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Frame style">
          {frames.map((option) => {
            const active = option.id === frameId
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setFrameId(option.id)
                  if (!option.colors.some((entry) => entry.value === color)) setColor(option.colors[0]?.value ?? '')
                }}
                className={`relative overflow-hidden rounded-[18px] bg-white text-left transition-[box-shadow,transform] duration-200 active:scale-[0.97] ${active ? 'shadow-[inset_0_0_0_2px_#08261b]' : 'shadow-[inset_0_0_0_1px_rgba(8,38,27,0.1)]'}`}
              >
                <span className="relative block h-[92px]">
                  <Image src={active ? (chosenColor?.image ?? option.baseImage) : option.baseImage} alt={`${option.label} frame`} fill sizes="45vw" className="object-contain p-2" />
                </span>
                <span className="flex items-center justify-between px-3 pb-3 pt-1">
                  <span className="text-[14px] font-extrabold">{option.label}</span>
                  <span className="text-[11.5px] font-semibold text-[#4d5f54]">{option.colors.length} finish{option.colors.length === 1 ? '' : 'es'}</span>
                </span>
                {active ? (
                  <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-[#08261b] text-[#eef2ee]"><Check size={14} /></span>
                ) : null}
              </button>
            )
          })}
        </div>
        {chosenFrame ? (
          <div className="mt-6">
            <div className="m2-cap">Finish</div>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Frame finish">
              {chosenFrame.colors.map((entry) => (
                <button key={entry.value} type="button" role="radio" aria-checked={color === entry.value} onClick={() => setColor(entry.value)} className={`flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-3.5 text-[13px] font-bold transition-colors ${color === entry.value ? 'border-[#08261b] bg-[#08261b] text-[#eef2ee]' : 'border-[rgba(8,38,27,0.14)]'}`}>
                  <span className="h-4 w-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]" style={{ background: swatchHex[entry.value] ?? '#888' }} />
                  {entry.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </Sheet>

      {toast ? (
        <div className="m2-toast bottom-[calc(96px+env(safe-area-inset-bottom,0px))]" role="status">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d1fae5] text-[#08261b]"><Check size={18} /></span>
          <span className="min-w-0 flex-1 text-[13.5px] leading-5"><strong className="block">Added to your bag</strong><span className="text-[rgba(238,242,238,0.72)]">{config.shortName} {mag}, {chosenFrame?.label} {chosenColor?.name}</span></span>
          <Link href="/cart" className="rounded-full bg-[#eef2ee] px-3.5 py-2 text-[13px] font-extrabold text-[#08261b]">View bag</Link>
        </div>
      ) : null}

      {/* BAR: mint adds, deep green buys */}
      <div ref={barRef} className="m2-bar">
        {editIndex !== null ? (
          <button type="button" className="m2-btn m2-btn--ink" onClick={buyNow} disabled={!available}>
            Update bag <span className="soft">{money(total)}</span>
          </button>
        ) : (
          <>
            <button type="button" className="m2-btn m2-btn--mint" onClick={addToBag} disabled={!available}>
              <ShoppingBag size={17} /> Add to bag
            </button>
            <button type="button" className="m2-btn m2-btn--ink flex-[1.2]" onClick={buyNow} disabled={!available}>
              Buy now <span className="soft">{money(total)}</span>
            </button>
          </>
        )}
      </div>
    </main>
  )
}
