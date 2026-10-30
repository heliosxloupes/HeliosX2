'use client'

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useEffect } from 'react'

import { ALL_LIGHTS, type Light } from '@/lib/lights'

const EASE = [0.23, 1, 0.32, 1] as const
const MAX_G = 240

// Another brand's headlight, shown for scale. Weight as supplied by the HeliosX team (2026-10-29).
const REFERENCE = { name: 'RoninX7 Series', grams: 233 }

// The reference reads as a ghost: a hatched outline of the weight we take away.
const HATCH = 'repeating-linear-gradient(135deg, rgba(238,242,238,0.16) 0 2px, transparent 2px 7px)'

const GROUPS = [
  {
    title: 'On your loupes',
    lights: ALL_LIGHTS.filter((entry) => entry.kind !== 'head'),
    reference: false,
  },
  {
    title: 'On a headband',
    lights: ALL_LIGHTS.filter((entry) => entry.kind === 'head'),
    reference: true,
  },
].map((group) => ({
  ...group,
  lights: [...group.lights].sort((a, b) => a.grams - b.grams),
}))

// The chosen light measured against a heavier headlight from another brand: our
// bar fills from the left, and the hatched ghost past its end is the weight saved.
// The bars below compare the whole range and pick a light on tap.
// `surface` is the panel the figure sits in: mobile draws its own dark card; desktop
// passes its smoked-glass classes so the figure reads as one of the page's panels.
export default function WeightScale({ light, onPick, surface }: { light: Light; onPick: (slug: Light['slug']) => void; surface?: string }) {
  const reduceMotion = useReducedMotion()
  const grams = useMotionValue(light.grams)
  const readout = useTransform(grams, (value) => Math.round(Math.max(0, value)).toString())
  const saved = REFERENCE.grams - light.grams
  const t = { duration: reduceMotion ? 0 : 0.6, ease: EASE }

  useEffect(() => {
    const controls = animate(grams, light.grams, t)
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grams, light.grams, reduceMotion])

  return (
    <figure className={`overflow-hidden text-[#eef2ee] ${surface ?? 'rounded-[22px] bg-[#14231d]'}`}>
      <div className="px-4 pb-5 pt-5">
        <div className="flex items-end justify-between gap-3">
          <span className="tab text-[44px] font-extrabold leading-none tracking-[-0.03em]">
            <motion.span>{readout}</motion.span>
            <span className="ml-1 text-[18px] font-bold text-[rgba(238,242,238,0.66)]">g</span>
          </span>
          <span className="pb-1 text-right text-[12.5px] leading-4 text-[rgba(238,242,238,0.7)]">
            {light.name}
            <br />
            {light.kind === 'head' ? 'on a headband' : 'on your loupes'}
          </span>
        </div>

        {/* Our headlight against the reference: the hatched remainder is what you don't carry.
            Loupe lights skip it, since their battery rides at the waist and isn't in the figure. */}
        {light.kind === 'head' ? (
          <>
            <div
              className="relative mt-5 h-11 overflow-hidden rounded-[12px]"
              style={{
                backgroundImage: HATCH,
                boxShadow: 'inset 0 0 0 1px rgba(238,242,238,0.22)',
              }}
            >
              <motion.div
                className={`absolute inset-y-0 left-0 w-full origin-left rounded-[12px] ${light.kind === 'head' ? 'bg-[#ffa33a]' : 'bg-[#34d399]'}`}
                initial={false}
                animate={{
                  transform: `scaleX(${light.grams / REFERENCE.grams})`,
                }}
                transition={t}
              />
              <span className="absolute inset-y-0 right-3 flex items-center">
                <motion.span
                  key={light.slug}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.25 }}
                  className={`tab rounded-full px-2.5 py-1 text-[12.5px] font-extrabold text-[#34d399] ${surface ? 'bg-black/60 backdrop-blur-md' : 'bg-[#14231d]'}`}
                >
                  {saved} g lighter
                </motion.span>
              </span>
            </div>
            <div className="mt-2 flex justify-between text-[11.5px] font-semibold text-[rgba(238,242,238,0.66)]">
              <span>{light.name}</span>
              <span className="tab">
                {REFERENCE.name}, {REFERENCE.grams} g
              </span>
            </div>
          </>
        ) : (
          <p className="mt-3 text-[13px] leading-5 text-[rgba(238,242,238,0.72)]">
            {light.kind === 'wireless'
              ? `All ${light.grams} g sits on your loupes, battery included. Nothing at the waist, no cord.`
              : `Adds ${light.grams} g to your loupes. The battery rides at your waist or neck, on a thin cord.`}
          </p>
        )}
      </div>

      <div className="space-y-4 border-t border-white/[0.08] px-4 py-4">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <div className="text-[11px] font-semibold text-[rgba(238,242,238,0.66)]">{group.title}</div>
            <ul className="mt-1.5 space-y-0.5">
              {group.lights.map((entry, index) => {
                const active = entry.slug === light.slug
                return (
                  <li key={entry.slug}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => onPick(entry.slug)}
                      className="flex min-h-9 w-full items-center gap-3 rounded-[10px] text-left transition-transform duration-150 active:scale-[0.98]"
                    >
                      <span className={`w-[84px] shrink-0 text-[13px] font-bold transition-colors duration-200 ${active ? 'text-[#eef2ee]' : 'text-[rgba(238,242,238,0.6)]'}`}>{entry.name}</span>
                      <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-[rgba(238,242,238,0.08)]">
                        <motion.span
                          className={`absolute inset-y-0 left-0 w-full origin-left rounded-full transition-colors duration-200 ${
                            active ? (entry.kind === 'head' ? 'bg-[#ffa33a]' : 'bg-[#34d399]') : 'bg-[rgba(238,242,238,0.32)]'
                          }`}
                          initial={reduceMotion ? false : { transform: 'scaleX(0)' }}
                          animate={{
                            transform: `scaleX(${entry.grams / MAX_G})`,
                          }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.7,
                            ease: EASE,
                            delay: reduceMotion ? 0 : index * 0.05,
                          }}
                        />
                      </span>
                      <span className={`tab w-[46px] shrink-0 text-right text-[13px] font-extrabold ${active ? 'text-[#eef2ee]' : 'text-[rgba(238,242,238,0.6)]'}`}>{entry.grams} g</span>
                    </button>
                  </li>
                )
              })}
              {group.reference ? (
                <li
                  className="mt-1.5 flex min-h-11 items-center gap-3 rounded-[10px] px-2 -mx-2"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(238,242,238,0.22)',
                  }}
                >
                  <span className="w-[76px] shrink-0 leading-tight">
                    <span className="block text-[13px] font-bold text-[#eef2ee]">RoninX7</span>
                    <span className="block text-[10.5px] font-semibold text-[rgba(238,242,238,0.6)]">Other brand</span>
                  </span>
                  <span className="relative h-2 flex-1 rounded-full bg-[rgba(238,242,238,0.08)]">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${(REFERENCE.grams / MAX_G) * 100}%`,
                        backgroundImage: HATCH,
                        boxShadow: 'inset 0 0 0 1px rgba(238,242,238,0.45)',
                      }}
                    />
                  </span>
                  <span className="tab w-[46px] shrink-0 text-right text-[13px] font-extrabold text-[#eef2ee]">{REFERENCE.grams} g</span>
                </li>
              ) : null}
            </ul>
          </div>
        ))}
      </div>
      <figcaption className="border-t border-white/[0.08] px-4 py-3.5 text-[12.5px] leading-5 text-[rgba(238,242,238,0.72)]">
        A loupe light adds its grams to your loupes, on the bridge of your nose. A headlight spreads its weight around a padded band.
        <span className="sr-only" aria-live="polite">
          {' '}
          {light.name} weighs {light.grams} grams
          {light.kind === 'head' ? `, ${saved} grams less than the ${REFERENCE.name}` : ''}.
        </span>
      </figcaption>
    </figure>
  )
}
