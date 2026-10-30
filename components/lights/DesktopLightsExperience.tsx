'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useContact } from '@/components/Contact/ContactProvider'
import PromoBadge from '@/components/PromoBadge'
import PhotoSwitch from '@/components/lights/PhotoSwitch'
import { money } from '@/components/m2/models'
import { ALL_LIGHTS, BATTERIES, LIGHTS, MAG_GUIDE, cutout, headHours, lightBySlug, lightFrom, lightPrice, type Light } from '@/lib/lights'
import { LIGHT_BUNDLE_PERCENT_OFF, bundledLightPrice } from '@/lib/pricing'
import BeamScene from './BeamScene'
import LightsBackdrop from './LightsBackdrop'
import { BatteryRing } from './LightFigures'
import styles from './lights.module.css'
import { useLightSelection } from './useLightSelection'
import WeightScale from './WeightScale'

const EASE = [0.23, 1, 0.32, 1] as const
const fmtLux = (lux: number) => `${(lux / 1000).toLocaleString('en-US')}k`
const luxWatts = (light: Light) => `${fmtLux(light.lux)} lux${light.watts ? ` · ${light.watts} W` : ''}`

// Two ways to wear a light. Loupe-mounted holds the corded range and Nova (wireless).
const MOUNTS = [
  { id: 'loupe', label: 'Loupe-mounted', kinds: ['corded', 'wireless'], first: 'corded' },
  { id: 'head', label: 'Head-mounted', kinds: ['head'], first: 'head' },
] as const

// The corded lights are matte black and need lifting on dark glass, Polaris (shot darker)
// most of all; Nova is light grey and needs taking down instead.
const STAGE_BRIGHTNESS: Partial<Record<Light['slug'], number>> = { polaris: 1.42, nova: 0.86 }
const stageFilter = (light: Light) =>
  light.kind === 'head'
    ? // White headbands glare on dark glass, so they come down; black Arcturus only a touch.
      `brightness(${light.slug === 'arcturus' ? 0.94 : 0.82}) drop-shadow(0 24px 36px rgba(0,0,0,0.55))`
    : light.slug === 'nova'
    ? `brightness(${STAGE_BRIGHTNESS.nova}) drop-shadow(0 24px 36px rgba(0,0,0,0.55))`
    : `brightness(${STAGE_BRIGHTNESS[light.slug] ?? 1.22}) contrast(1.12) drop-shadow(0 0 3px rgba(255,255,255,0.16)) drop-shadow(0 24px 36px rgba(0,0,0,0.55))`

// Smoked glass after the Charlie Riccio results-page folders: see lights.module.css.
const GLASS = styles.glass
const PANEL = `${styles.glass} ${styles.tilt}`

// Glows behind the glass, in the site's accent colors. Fixed positions, slow drift.
const GLOWS = [
  { className: 'left-[-6%] top-[60px] h-[520px] w-[620px] bg-[rgba(23,176,143,0.22)]', gx: '60px', gy: '40px' },
  { className: 'left-[18%] top-[560px] h-[380px] w-[460px] bg-[rgba(255,163,58,0.16)]', gx: '-40px', gy: '-30px' },
  { className: 'right-[-4%] top-[20px] h-[480px] w-[520px] bg-[rgba(72,136,255,0.16)]', gx: '-50px', gy: '50px' },
  { className: 'right-[12%] top-[1250px] h-[520px] w-[620px] bg-[rgba(34,197,156,0.14)]', gx: '40px', gy: '-40px' },
  { className: 'left-[8%] top-[2050px] h-[420px] w-[520px] bg-[rgba(59,130,246,0.12)]', gx: '50px', gy: '30px' },
]

export default function DesktopLightsExperience() {
  const router = useRouter()
  const { openContact } = useContact()
  const reduceMotion = useReducedMotion()
  const { photos: allPhotos, photo: anyPhoto, photoIndex, setPhotoIndex, light, setSlug, chooseKind, wireless, head, batteryId, setBatteryId, battery, price, commit } =
    useLightSelection('(min-width: 768px)')
  // Only the headlights' main photo has a cut-out, so the glass stage shows that one alone.
  const photos = head ? [light.image] : allPhotos
  const photo = head ? light.image : anyPhoto
  const mountGroup = ALL_LIGHTS.filter((entry) => (entry.kind === 'head') === head)
  const noun = head ? 'LED headlight' : 'LED loupe light'
  const [guideMag, setGuideMag] = useState<number | null>(null)
  const [added, setAdded] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  // The highlight and lean on whichever glass panel is under the cursor.
  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    const selector = `.${styles.glass}, .${styles.chip}`
    let current: HTMLElement | null = null
    let raf = 0
    let px = 0
    let py = 0
    const write = () => {
      raf = 0
      current?.style.setProperty('--px', px.toFixed(3))
      current?.style.setProperty('--py', py.toFixed(3))
    }
    const reset = (el: HTMLElement | null) => {
      el?.style.setProperty('--px', '0')
      el?.style.setProperty('--py', '0')
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const el = (event.target as Element).closest<HTMLElement>(selector)
      if (el !== current) {
        reset(current)
        current = el
      }
      if (!el) return
      const rect = el.getBoundingClientRect()
      px = ((event.clientX - rect.left) / rect.width) * 2 - 1
      py = ((event.clientY - rect.top) / rect.height) * 2 - 1
      if (!raf) raf = requestAnimationFrame(write)
    }
    const leave = () => {
      reset(current)
      current = null
    }
    main.addEventListener('pointermove', move)
    main.addEventListener('pointerleave', leave)
    return () => {
      main.removeEventListener('pointermove', move)
      main.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 2600)
    return () => window.clearTimeout(timer)
  }, [added])

  const ask = (source: string) => openContact(`lights_${source}_desktop`)
  const pick = (slug: Light['slug']) => {
    setSlug(slug)
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const swap = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, transform: 'translateY(8px)', filter: 'blur(4px)' },
        animate: { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
        exit: { opacity: 0, transform: 'translateY(-8px)', filter: 'blur(4px)' },
      }
  const suggestion = guideMag !== null ? MAG_GUIDE[guideMag] : null
  const suggested = suggestion ? lightBySlug(suggestion.slug) : null

  return (
    <main ref={mainRef} className="relative isolate min-h-screen overflow-hidden bg-[#030508] pt-16 text-neutral-100">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <LightsBackdrop />
        {GLOWS.map((glow) => (
          <span key={glow.className} className={`${styles.glow} ${glow.className}`} style={{ '--gx': glow.gx, '--gy': glow.gy } as React.CSSProperties} />
        ))}
      </div>
      {/* HERO + CONFIG */}
      <section className="relative mx-auto grid max-w-[1400px] gap-10 px-6 pb-24 pt-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14 lg:px-10 xl:px-16">
        {/* LEFT: the light itself, then what it does on the field */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div className={`rounded-[34px] p-2 ${PANEL}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[27px]">
            {/* Clear glass shows the fibers; a soft studio pool behind the product keeps the black light readable. */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(52% 46% at 50% 64%, rgba(236,248,242,0.5) 0%, rgba(236,248,242,0.16) 45%, rgba(236,248,242,0) 75%)' }}
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 top-[7%] z-[2] h-[clamp(4rem,9vw,7.5rem)] overflow-hidden text-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={light.name}
                  aria-hidden="true"
                  className="text-[clamp(4rem,9vw,7.5rem)] font-extrabold uppercase leading-none tracking-[-0.04em] text-white/90"
                  {...swap}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {light.name}
                </motion.p>
              </AnimatePresence>
            </div>
            <AnimatePresence initial={false}>
              <motion.div
                key={photo}
                className="absolute inset-x-[8%] bottom-[4%] top-[30%]"
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <Image src={cutout(photo)} alt={`${light.name} ${noun}${photoIndex && !head ? `, photo ${photoIndex + 1}` : ''}`} fill priority sizes="(min-width: 1024px) 55vw, 90vw" className="object-contain" style={{ filter: stageFilter(light) }} />
              </motion.div>
            </AnimatePresence>
            <PhotoSwitch photos={photos} active={photoIndex} onChange={setPhotoIndex} name={light.name} glass className="absolute bottom-5 left-5" />
            <span className="tab absolute bottom-5 right-5 z-[3] rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              {light.lux.toLocaleString('en-US')} lux{light.watts ? ` · ${light.watts} W` : ''}
            </span>
          </div>
          </div>

          <figure className={`grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] overflow-hidden rounded-[30px] ${PANEL}`}>
            <div className="bg-gradient-to-b from-black/35 to-black/10">
              <BeamScene light={light} />
            </div>
            <dl className="flex flex-col justify-center gap-4 border-l border-white/[0.08] px-6 py-5">
              {(
                [
                  ['Brightness', `${light.lux.toLocaleString('en-US')} lux`],
                  ['Spot at 42 cm', light.head ? `${light.head.spotRange[0]}–${light.head.spotRange[1]} mm, adjustable` : light.spotMm ? `${light.spotMm} mm${light.spotAdjustable ? ', adjustable' : ''}` : 'Not listed'],
                  [head ? 'Weight' : 'Head weight', light.headWeight],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.7rem] font-medium text-neutral-400">{label}</dt>
                  <dd className="tab mt-0.5 text-base font-semibold text-white">{value}</dd>
                </div>
              ))}
            </dl>
            <figcaption className="sr-only">
              {light.name} gives {light.lux.toLocaleString('en-US')} lux{light.spotMm ? ` in a ${light.spotMm} mm spot at 42 cm` : ''}.
            </figcaption>
          </figure>
        </div>

        {/* RIGHT: configure and buy */}
        <div className="flex flex-col gap-7">
          <div>
            <h1 className="text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white">{head ? 'LED headlights' : 'LED loupe lights'}</h1>
            <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-neutral-300">
              {head
                ? 'Wireless headlights on a padded band, worn with or without loupes. Brightness and spot size both adjust, and the battery sits at the back.'
                : 'Corded and wireless lights that clip to every HeliosX frame. Match the brightness to your magnification, then pick the battery that lasts your day.'}
            </p>
            <PromoBadge tone="dark" className="mt-4" />
          </div>

          {/* Light */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Light</h2>
              <a href="#light-guide" className="text-xs font-medium text-emerald-300 underline-offset-4 hover:underline">Which light do I need?</a>
            </div>
            <div className={`mt-3 grid grid-cols-2 rounded-full p-1 ${GLASS}`} role="group" aria-label="How the light is worn">
              {MOUNTS.map((entry) => {
                const active = (entry.kinds as readonly Light['kind'][]).includes(light.kind)
                return (
                  <button
                    key={entry.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => !active && chooseKind(entry.first)}
                    className={`min-h-10 rounded-full text-sm font-semibold transition-colors duration-200 ${active ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {entry.label}
                  </button>
                )
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4" role="radiogroup" aria-label="Light model">
              {mountGroup.map((entry) => {
                const active = entry.slug === light.slug
                const cordless = entry.kind === 'wireless'
                return (
                  <button
                    key={entry.slug}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSlug(entry.slug)}
                    className={`rounded-2xl px-4 py-3 text-left ${cordless ? 'col-span-full' : ''} ${styles.chip}`}
                  >
                    <span className="block text-[0.95rem] font-semibold text-white">
                      {entry.name}
                      {cordless ? <span className="font-normal text-neutral-400"> · wireless, no cord</span> : null}
                    </span>
                    <span className="tab block text-xs text-neutral-400">{luxWatts(entry)}</span>
                    <span className="tab mt-2 block text-xs font-medium text-neutral-300">from {money(lightFrom(entry.slug))}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 min-h-[2.5rem] text-sm leading-relaxed text-neutral-400">{light.bestFor}</p>
          </div>

          {/* Battery */}
          <div>
            <h2 className="text-sm font-semibold text-white">{wireless || (light.head?.batteries ?? 1) > 1 ? 'Batteries' : 'Battery'}</h2>
            <div className={`mt-3 flex items-center gap-5 rounded-2xl p-4 ${GLASS}`}>
              <BatteryRing
                tone="dark"
                segments={
                  light.head
                    ? Array(light.head.batteries).fill(light.head.hours[1])
                    : wireless
                      ? Array(light.wireless?.batteries ?? 1).fill(light.wireless?.hoursPerBattery ?? 1)
                      : [battery.hours]
                }
              />
              <p className="text-sm leading-relaxed text-neutral-300" aria-live="polite">
                {light.head ? (
                  <>
                    <strong className="block text-base text-white">
                      {light.head.hours[0] === light.head.hours[1] ? '' : 'Up to '}
                      {light.head.hours[1]} hrs per charge
                    </strong>
                    {light.head.batteries > 1
                      ? `${light.head.batteries} batteries included, so one charges while you work.`
                      : 'The battery sits at the back of the band, opposite the light.'}{' '}
                    Recharges over USB in {light.head.chargeTime}.
                  </>
                ) : wireless ? (
                  <>
                    <strong className="block text-base text-white">{light.wireless?.hoursPerBattery} hrs per battery</strong>
                    {light.wireless?.batteries} batteries included. Swap one in and keep working. Each recharges in {light.wireless?.chargeTime.toLowerCase()}.
                  </>
                ) : (
                  <>
                    <strong className="block text-base text-white">Up to {battery.hours} hrs per charge</strong>
                    Each mark on the ring is one hour. Charges over USB-C.
                  </>
                )}
              </p>
            </div>
            {light.kind === 'corded' ? (
              <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Battery">
                {BATTERIES.map((entry) => {
                  const active = entry.id === batteryId
                  const extra = lightPrice(light.slug, entry.id) - lightPrice(light.slug, BATTERIES[0].id)
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setBatteryId(entry.id)}
                      className={`rounded-2xl px-4 py-3 text-left ${styles.chip}`}
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-white">{entry.label} <span className="tab font-normal text-neutral-400">· {entry.hours} hrs</span></span>
                        <span className="tab shrink-0 text-xs font-medium text-neutral-300">{extra ? `+${money(extra)}` : '+$0'}</span>
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-neutral-400">{entry.detail}</span>
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Price + buy */}
          <div className={`rounded-3xl p-5 ${PANEL}`}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs text-neutral-400">{light.name}, {light.head ? light.head.band.toLowerCase() : wireless ? `${light.wireless?.batteries} batteries` : `${battery.label.toLowerCase()} battery`}</div>
                <div className="relative mt-1 h-10 overflow-hidden" aria-live="polite">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div key={price} {...swap} transition={{ duration: 0.22, ease: EASE }} className="tab text-[2rem] font-semibold leading-10 text-white">
                      {money(price)}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <p className="max-w-[15rem] text-right text-xs leading-relaxed text-neutral-400">
                <span className="tab font-semibold text-emerald-300">{money(bundledLightPrice(price))}</span> with any pair of HeliosX loupes, {LIGHT_BUNDLE_PERCENT_OFF}% off.
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => commit() && setAdded(true)}
                disabled={!price}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
              >
                {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4" aria-hidden="true" />}
                {added ? 'Added to cart' : 'Add to cart'}
              </button>
              <button
                type="button"
                onClick={() => commit() && router.push('/cart')}
                disabled={!price}
                className="min-h-12 flex-1 rounded-full border border-white/20 text-sm font-semibold text-white transition-colors hover:border-white/50 disabled:opacity-50"
              >
                Buy now
              </button>
            </div>
            <button
              type="button"
              onClick={() => ask('purchase')}
              className="mt-4 flex min-h-11 w-full items-center justify-between border-t border-white/10 pt-3 text-left text-xs text-neutral-300 transition-colors hover:text-white"
            >
              <span>Not sure how much light you need? <span className="text-emerald-300">Ask us</span></span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Weight: every light on one comparison */}
          <div>
            <h2 className="text-sm font-semibold text-white">Weight</h2>
            <div className="mt-3">
              <WeightScale light={light} onPick={setSlug} surface={`rounded-3xl ${PANEL}`} />
            </div>
          </div>
        </div>
      </section>

      {/* GUIDE: magnification in, a light out, every spot drawn to scale */}
      <section id="light-guide" className="relative scroll-mt-24 border-t border-white/[0.07] py-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:px-10 xl:px-16">
          <div>
            <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-white">How much light do you need?</h2>
            <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-neutral-300">
              Higher magnification shows a darker image, so it needs more light. Start with the magnification you use most.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Your loupe magnification">
              {MAG_GUIDE.map((entry, index) => (
                <button
                  key={entry.label}
                  type="button"
                  role="radio"
                  aria-checked={guideMag === index}
                  onClick={() => setGuideMag(index)}
                  className={`tab min-h-12 rounded-full border text-sm font-semibold transition-colors ${guideMag === index ? 'border-white bg-white text-black' : 'border-white/15 text-neutral-200 hover:border-white/40'}`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            <div className="mt-5 min-h-[7.5rem]" aria-live="polite">
              {suggestion && suggested ? (
                <div className={`rounded-2xl p-5 ring-1 ring-emerald-400/40 ${GLASS}`}>
                  <p className="text-lg font-semibold text-white">We suggest {suggested.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-300">{suggestion.why}</p>
                  <button type="button" onClick={() => pick(suggested.slug)} className="mt-3 text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline">
                    Choose {suggested.name}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Pick a magnification and we&apos;ll suggest a light.</p>
              )}
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Rather not have a cord? Nova is wireless, with three swappable batteries.{' '}
              <button type="button" onClick={() => ask('guide')} className="font-semibold text-emerald-300 underline-offset-4 hover:underline">Or ask us</button>.
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-3 self-start">
            {LIGHTS.filter((entry) => entry.kind === 'corded').map((entry) => {
              const highlighted = suggested ? suggested.slug === entry.slug : light.slug === entry.slug
              return (
                <li key={entry.slug}>
                  <button
                    type="button"
                    onClick={() => pick(entry.slug)}
                    aria-pressed={highlighted}
                    className={`block w-full overflow-hidden rounded-3xl text-left ${styles.chip}`}
                  >
                    <span className="block bg-gradient-to-b from-black/35 to-black/5">
                      <BeamScene light={entry} label={false} />
                    </span>
                    <span className="flex items-baseline justify-between gap-3 border-t border-white/10 px-5 py-4">
                      <span>
                        <span className="block text-base font-semibold text-white">{entry.name}</span>
                        <span className="tab block text-xs text-neutral-400">{entry.lux.toLocaleString('en-US')} lux · {entry.spotMm} mm spot</span>
                      </span>
                      <span className="tab text-xs font-medium text-neutral-300">from {money(lightFrom(entry.slug))}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* COMPARE + DETAIL */}
      <section className="relative border-t border-white/[0.07] py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 xl:px-16">
          <h2 className="text-[2rem] font-semibold tracking-[-0.02em] text-white">Compare the range</h2>
          <div className={`mt-6 overflow-x-auto rounded-3xl ${GLASS}`}>
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-white/[0.03] text-xs text-neutral-400">
                <tr>
                  {['Light', 'Type', 'Brightness', 'Spot at 42 cm', 'Weight', 'Runtime', 'Price'].map((head) => (
                    <th key={head} scope="col" className="px-5 py-3 font-medium">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="tab divide-y divide-white/10 text-neutral-200">
                {ALL_LIGHTS.map((entry) => (
                  <tr key={entry.slug} className={entry.slug === light.slug ? 'bg-emerald-400/[0.06]' : undefined}>
                    <th scope="row" className="px-5 py-4">
                      <button type="button" onClick={() => pick(entry.slug)} className="flex items-center gap-3 font-semibold text-white hover:text-emerald-300">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_58%,rgba(236,248,242,0.32),rgba(236,248,242,0.06)_70%)]">
                          <Image src={cutout(entry.image)} alt="" fill sizes="40px" className="object-contain p-0.5" />
                        </span>
                        {entry.name}
                      </button>
                    </th>
                    <td className="px-5 py-4">{entry.kind === 'head' ? 'Head-mounted' : entry.kind === 'wireless' ? 'Wireless' : 'Corded'}</td>
                    <td className="px-5 py-4">{entry.lux.toLocaleString('en-US')} lux</td>
                    <td className="px-5 py-4">{entry.head ? `${entry.head.spotRange[0]}–${entry.head.spotRange[1]} mm, adjustable` : entry.spotMm ? `${entry.spotMm} mm${entry.spotAdjustable ? ', adjustable' : ''}` : '—'}</td>
                    <td className="px-5 py-4">{entry.headWeight}</td>
                    <td className="px-5 py-4">
                      {entry.head
                        ? `${headHours(entry)}${entry.head.batteries > 1 ? ` × ${entry.head.batteries} batteries` : ''}`
                        : entry.wireless
                        ? `${entry.wireless.hoursPerBattery} hrs × ${entry.wireless.batteries} batteries`
                        : `${Math.min(...BATTERIES.map((b) => b.hours))}–${Math.max(...BATTERIES.map((b) => b.hours))} hrs`}
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">from {money(lightFrom(entry.slug))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Every corded light',
                items: ['Color temperature 5,000 K', 'Adjustable brightness', 'LED life 50,000 hrs', 'Working voltage DC 3.7 V', 'Charging over USB / USB-C, 100–240 V adapter'],
              },
              {
                title: 'Nova, wireless',
                items: ['Battery sits on the light, no cord', '3 batteries included, about 3 hrs each', 'Recharges in under 1 hr', '2 brightness steps, touch control', '29 g with battery'],
              },
              {
                title: 'Every headlight',
                items: ['Worn on a padded band, with or without loupes', 'Brightness and spot size both adjust', 'Battery at the back of the band, recharges over USB in 4 hrs', 'LED life 50,000 hrs'],
              },
              {
                title: 'With your loupes',
                items: ['Clips to every HeliosX frame', `${LIGHT_BUNDLE_PERCENT_OFF}% off any light bought with a pair of loupes`],
              },
            ].map((column) => (
              <div key={column.title}>
                <h3 className="text-base font-semibold text-white">{column.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                  {column.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-emerald-400" strokeWidth={3} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`mt-16 flex items-center justify-between gap-8 rounded-[28px] px-8 py-7 ${GLASS}`}>
            <div>
              <p className="text-xl font-semibold text-white">Not sure which light fits your work?</p>
              <p className="mt-1 text-sm text-neutral-400">Tell us your loupes, magnification and specialty. We&apos;ll recommend a light and battery.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => ask('band')} className="min-h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-neutral-200">
                Ask us
              </button>
              <Link href="/product" className="flex min-h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:border-white/50">
                Shop loupes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
