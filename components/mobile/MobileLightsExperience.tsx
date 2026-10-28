'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronRight, Mail, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useContact } from '@/components/Contact/ContactProvider'
import PromoBadge from '@/components/PromoBadge'
import PhotoSwitch from '@/components/lights/PhotoSwitch'
import Sheet from '@/components/m2/Sheet'
import { money } from '@/components/m2/models'
import { BATTERIES, LIGHTS, MAG_GUIDE, lightBySlug, lightFrom, lightPrice } from '@/lib/lights'
import { LIGHT_BUNDLE_PERCENT_OFF, bundledLightPrice } from '@/lib/pricing'
import { BatteryRing, BeamFigure } from '@/components/lights/LightFigures'
import { useLightSelection } from '@/components/lights/useLightSelection'
import { useStickyBarOffset } from './useStickyBarOffset'

const EASE = [0.23, 1, 0.32, 1] as const
const fmtLux = (lux: number) => `${(lux / 1000).toLocaleString('en-US')}k`

export default function MobileLightsExperience() {
  const router = useRouter()
  const { openContact } = useContact()
  const reduceMotion = useReducedMotion()
  const barRef = useRef<HTMLDivElement>(null)
  useStickyBarOffset(barRef)

  const { photos, photo, photoIndex, setPhotoIndex, light, setSlug, chooseKind, wireless, batteryId, setBatteryId, battery, option, price, group, optionName, commit } =
    useLightSelection('(max-width: 767px)')
  const [guide, setGuide] = useState(false)
  const [guideMag, setGuideMag] = useState<number | null>(null)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(false), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const ask = (source: string) => openContact(`lights_${source}_mobile`)

  const swap = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, transform: 'translateY(6px)', filter: 'blur(3px)' },
        animate: { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
        exit: { opacity: 0, transform: 'translateY(-6px)', filter: 'blur(3px)' },
      }

  return (
    <main className="m2 min-h-screen pb-28">
      {/* STAGE: the light's name set huge, its photo crossfading beneath */}
      <section className="m2-stage h-[440px]" style={{ background: '#ffffff' }} aria-label="HeliosX LED loupe lights">
        <AnimatePresence initial={false}>
          <motion.div
            key={photo}
            className="absolute inset-x-0 bottom-[30px] top-[186px]"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Image src={photo} alt={`${light.name} LED loupe light${photoIndex ? `, photo ${photoIndex + 1}` : ''}`} fill priority sizes="100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
        <PhotoSwitch photos={photos} active={photoIndex} onChange={setPhotoIndex} name={light.name} className="absolute bottom-[52px] left-4" />
        <div className="absolute inset-x-0 top-[78px] z-[2] text-center">
          <div className="relative h-[min(21vw,6rem)] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={light.name}
                role="heading"
                aria-level={1}
                className="m2-giant"
                style={{ fontSize: 'min(21vw, 6rem)' }}
                {...swap}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {light.name}
              </motion.p>
            </AnimatePresence>
          </div>
          <span className="m2-sub mt-3 !text-[#4d5f54]">LED loupe light{wireless ? ', wireless' : ''}</span>
        </div>
        <span className="m2-chip bottom-[52px] right-4 tab">{light.lux.toLocaleString('en-US')} lux</span>
      </section>

      {/* SHEET */}
      <section className="m2-sheet">
        <PromoBadge className="mb-3" />
        <div className="m2-cap">Price</div>
        <div className="relative h-[36px] overflow-hidden" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={price} {...swap} transition={{ duration: 0.22, ease: EASE }} className="m2-price">
              {money(price)}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-1 text-[13px] text-[#4d5f54]">
          <strong className="text-[#0b6b53]">{money(bundledLightPrice(price))}</strong> with any pair of HeliosX loupes, {LIGHT_BUNDLE_PERCENT_OFF}% off.
        </p>

        {/* LIGHT PICKER */}
        <div className="mt-6 flex items-center justify-between">
          <span className="m2-cap">Light</span>
          <button type="button" onClick={() => setGuide(true)} className="flex min-h-10 items-center text-[13px] font-bold text-[#0b6b53]" aria-haspopup="dialog">
            Which light do I need?
          </button>
        </div>
        <div className="mt-1.5 grid grid-cols-2 rounded-full bg-[#e4e9e4] p-1" role="group" aria-label="Light type">
          {(['corded', 'wireless'] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              aria-pressed={light.kind === kind}
              onClick={() => chooseKind(kind)}
              className={`min-h-10 rounded-full text-[13px] font-bold capitalize transition-[background-color,box-shadow] duration-200 ${light.kind === kind ? 'bg-white shadow-[0_1px_3px_rgba(8,38,27,0.14)]' : 'text-[#4d5f54]'}`}
            >
              {kind}
            </button>
          ))}
        </div>
        <div className={`mt-2.5 grid gap-1.5 ${group.length === 4 ? 'grid-cols-4' : 'grid-cols-1'}`} role="radiogroup" aria-label="Light model">
          {group.map((entry) => {
            const active = entry.slug === light.slug
            return (
              <button
                key={entry.slug}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSlug(entry.slug)}
                className={`flex min-h-[58px] flex-col items-center justify-center rounded-[16px] border-[1.5px] px-1 transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.96] ${active ? 'border-[#08261b] bg-[#08261b] text-[#eef2ee]' : 'border-[rgba(8,38,27,0.12)]'}`}
              >
                <span className="text-[13.5px] font-extrabold">{entry.name}</span>
                <span className={`tab text-[11.5px] font-semibold ${active ? 'text-[rgba(238,242,238,0.72)]' : 'text-[#4d5f54]'}`}>{fmtLux(entry.lux)} lux</span>
              </button>
            )
          })}
        </div>
        <p className="mt-2.5 min-h-10 text-[12.5px] leading-5 text-[#4d5f54]">{light.bestFor}</p>

        {/* BEAM: what the brightness and spot look like on the field */}
        <figure className="mt-3 overflow-hidden rounded-[22px] bg-[#14231d] text-[#eef2ee]">
          <BeamFigure light={light} />
          <dl className="grid grid-cols-3 border-t border-[rgba(238,242,238,0.12)] px-1 py-3">
            {(
              [
                ['Brightness', `${fmtLux(light.lux)} lux`],
                ['Spot at 42 cm', light.spotMm ? `${light.spotMm} mm${light.spotAdjustable ? ', adj.' : ''}` : 'Not listed'],
                ['Head weight', light.headWeight.replace(' with battery', '')],
              ] as const
            ).map(([label, value], index) => (
              <div key={label} className={`px-3 ${index ? 'border-l border-[rgba(238,242,238,0.12)]' : ''}`}>
                <dt className="text-[11px] font-semibold text-[rgba(238,242,238,0.66)]">{label}</dt>
                <dd className="tab mt-0.5 text-[14.5px] font-extrabold leading-tight">{value}</dd>
              </div>
            ))}
          </dl>
          <figcaption className="sr-only">
            {light.name} gives {light.lux.toLocaleString('en-US')} lux{light.spotMm ? ` in a ${light.spotMm} mm spot at 42 cm` : ''}.
          </figcaption>
        </figure>

        {/* BATTERY */}
        <div className="mt-7 m2-cap">{wireless ? 'Batteries' : 'Battery'}</div>
        <div className="mt-2 flex items-center gap-4 rounded-[22px] bg-[#f7f9f7] p-4">
          <BatteryRing
            segments={wireless ? Array(light.wireless?.batteries ?? 1).fill(light.wireless?.hoursPerBattery ?? 1) : [battery.hours]}
          />
          <p className="min-w-0 text-[13px] leading-5 text-[#26352d]" aria-live="polite">
            {wireless ? (
              <>
                <strong className="block text-[15px] text-[#08261b]">{light.wireless?.hoursPerBattery} hr{light.wireless?.hoursPerBattery === 1 ? '' : 's'} per battery</strong>
                {light.wireless?.batteries} batteries included. Swap one in and keep working. Each recharges in {light.wireless?.chargeTime.toLowerCase()}.
              </>
            ) : (
              <>
                <strong className="block text-[15px] text-[#08261b]">Up to {battery.hours} hrs per charge</strong>
                Each mark on the ring is one hour. Charges over USB-C.
              </>
            )}
          </p>
        </div>

        {!wireless ? (
          <div className="mt-2 space-y-1.5" role="radiogroup" aria-label="Battery">
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
                  className={`m2-row min-h-[60px] pl-4 ${active ? 'shadow-[inset_0_0_0_2px_#08261b]' : ''}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-extrabold">
                      {entry.label} <span className="tab font-semibold text-[#4d5f54]">· {entry.hours} hrs</span>
                    </span>
                    <span className="block text-[12.5px] text-[#4d5f54]">{entry.detail}</span>
                  </span>
                  <span className="tab shrink-0 text-[13px] font-bold text-[#26352d]">{extra ? `+${money(extra)}` : '+$0'}</span>
                </button>
              )
            })}
          </div>
        ) : null}

        {/* ASK */}
        <div className="mt-6 rounded-[22px] bg-[#14231d] px-5 py-5 text-[#eef2ee]">
          <strong className="block text-[16px] font-extrabold tracking-[-0.02em]">Not sure how much light you need?</strong>
          <p className="mt-1.5 text-[13px] leading-5 text-[rgba(238,242,238,0.76)]">Tell us your loupes, magnification and specialty. We&apos;ll recommend a light and battery.</p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => ask('help')} className="m2-btn m2-btn--mint min-h-[48px] text-[14px]">
              <Mail size={16} /> Ask us
            </button>
          </div>
        </div>
      </section>

      <section className="px-5">
        <dl className="m2-facts mt-7 border-y border-[rgba(8,38,27,0.12)]">
          <div><dt>Fits</dt><dd>Every HeliosX frame</dd></div>
          <div><dt>Color temperature</dt><dd className="tab">5,000 K</dd></div>
          <div><dt>Brightness</dt><dd>{wireless ? `${light.wireless?.steps} steps, touch control` : 'Adjustable'}</dd></div>
          <div><dt>Spot size</dt><dd>{light.spotAdjustable ? 'Adjustable' : 'Fixed'}</dd></div>
          {!wireless ? <div><dt>LED life</dt><dd className="tab">50,000 hrs</dd></div> : null}
          <div><dt>With loupes</dt><dd>{LIGHT_BUNDLE_PERCENT_OFF}% off this light</dd></div>
        </dl>

        <div className="mt-8">
          <details className="m2-details">
            <summary>Specifications <Plus size={18} /></summary>
            <ul className="list-disc space-y-1.5 pb-6 pl-5 text-[14px] leading-6 text-[#26352d] marker:text-[#0b6b53]">
              <li>Power: {light.watts} W</li>
              <li>Brightness: {light.lux.toLocaleString('en-US')} lux</li>
              {light.spotMm ? <li>Spot diameter at 42 cm: {light.spotMm} mm</li> : null}
              <li>Head weight: {light.headWeight}</li>
              {wireless ? (
                <>
                  <li>Battery: {light.wireless?.batteries} included, {light.wireless?.hoursPerBattery} hr{light.wireless?.hoursPerBattery === 1 ? '' : 's'} each</li>
                  <li>Charge time: {light.wireless?.chargeTime}</li>
                </>
              ) : (
                <>
                  <li>Working voltage: DC 3.7 V</li>
                  <li>Charging: USB / USB-C, 100–240 V adapter</li>
                </>
              )}
            </ul>
          </details>
        </div>

        <h2 className="m2-h2 mt-12">Compare the range</h2>
        <ul className="mt-4 divide-y divide-[rgba(8,38,27,0.12)] border-y border-[rgba(8,38,27,0.12)]">
          {LIGHTS.map((entry) => (
            <li key={entry.slug}>
              <button type="button" onClick={() => { setSlug(entry.slug); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }) }} className="flex min-h-[64px] w-full items-center gap-3 text-left">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[12px] bg-white">
                  <Image src={entry.image} alt="" fill sizes="44px" className="object-contain p-0.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-extrabold">{entry.name}{entry.kind === 'wireless' ? <span className="font-semibold text-[#4d5f54]"> · wireless</span> : null}</span>
                  <span className="tab block text-[12.5px] text-[#4d5f54]">{entry.lux.toLocaleString('en-US')} lux{entry.spotMm ? ` · ${entry.spotMm} mm spot` : ''}</span>
                </span>
                <span className="tab shrink-0 text-[13px] font-bold">from {money(lightFrom(entry.slug))}</span>
              </button>
            </li>
          ))}
        </ul>

        <Link href="/product" className="mt-6 flex min-h-[56px] w-full items-center justify-between rounded-[18px] bg-[#f7f9f7] px-4 text-[14px] text-[#26352d]">
          <span>Buying loupes too? <span className="font-extrabold text-[#0b6b53]">{LIGHT_BUNDLE_PERCENT_OFF}% off your light</span></span>
          <ChevronRight size={18} className="shrink-0 text-[#0b6b53]" />
        </Link>
      </section>

      {/* GUIDE */}
      <Sheet
        open={guide}
        onOpenChange={setGuide}
        title="Which light do I need?"
        description="Higher magnification shows a darker image, so it needs more light. Start with the magnification you use most."
        footer={
          guideMag !== null ? (
            <button
              type="button"
              className="m2-btn m2-btn--ink w-full"
              onClick={() => {
                setSlug(MAG_GUIDE[guideMag].slug)
                setGuide(false)
              }}
            >
              Choose {lightBySlug(MAG_GUIDE[guideMag].slug)?.name}
            </button>
          ) : null
        }
      >
        <div className="m2-cap">Your loupe magnification</div>
        <div className="mt-2 grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Loupe magnification">
          {MAG_GUIDE.map((entry, index) => (
            <button
              key={entry.label}
              type="button"
              role="radio"
              aria-checked={guideMag === index}
              onClick={() => setGuideMag(index)}
              className={`tab min-h-12 rounded-[14px] border-[1.5px] text-[14px] font-bold transition-colors ${guideMag === index ? 'border-[#08261b] bg-[#08261b] text-[#eef2ee]' : 'border-[rgba(8,38,27,0.14)]'}`}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <div className="mt-4 min-h-[96px]" aria-live="polite">
          {guideMag !== null ? (
            <div className="flex gap-3 rounded-[18px] bg-white p-3">
              <span className="relative h-[72px] w-[72px] shrink-0">
                <Image src={lightBySlug(MAG_GUIDE[guideMag].slug)?.image ?? ''} alt="" fill sizes="72px" className="object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block text-[16px] font-extrabold">We suggest {lightBySlug(MAG_GUIDE[guideMag].slug)?.name}</span>
                <span className="block text-[13px] leading-5 text-[#4d5f54]">{MAG_GUIDE[guideMag].why}</span>
              </span>
            </div>
          ) : (
            <p className="text-[13px] leading-5 text-[#4d5f54]">Pick one above and we&apos;ll suggest a light.</p>
          )}
        </div>
        <p className="mt-4 text-[13px] leading-5 text-[#26352d]">
          Rather not have a cord? Nova is wireless, with three swappable batteries.{' '}
          <button type="button" className="font-extrabold text-[#0b6b53] underline underline-offset-4" onClick={() => { setGuide(false); ask('guide') }}>
            Or ask us
          </button>
          .
        </p>
      </Sheet>

      {toast ? (
        <div className="m2-toast bottom-[calc(96px+env(safe-area-inset-bottom,0px))]" role="status">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d1fae5] text-[#08261b]"><Check size={18} /></span>
          <span className="min-w-0 flex-1 text-[13.5px] leading-5"><strong className="block">Added to your bag</strong><span className="text-[rgba(238,242,238,0.72)]">{light.name}, {optionName}</span></span>
          <Link href="/cart" className="rounded-full bg-[#eef2ee] px-3.5 py-2 text-[13px] font-extrabold text-[#08261b]">View bag</Link>
        </div>
      ) : null}

      <div ref={barRef} className="m2-bar">
        <button type="button" className="m2-btn m2-btn--mint" onClick={() => commit() && setToast(true)} disabled={!price}>
          <ShoppingBag size={17} /> Add to bag
        </button>
        <button type="button" className="m2-btn m2-btn--ink flex-[1.2]" onClick={() => commit() && router.push('/cart')} disabled={!price}>
          Buy now <span className="soft">{money(price)}</span>
        </button>
      </div>
    </main>
  )
}
