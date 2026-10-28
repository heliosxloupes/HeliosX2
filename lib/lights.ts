import { lightPriceBySlug } from './pricing'

/**
 * HeliosX LED loupe lights. Specs come from the manufacturer's 2026 sheet;
 * money lives in lib/pricing.json. Names follow real star brightness:
 * Polaris is the dimmest of the four corded lights, Sirius the brightest.
 */

export type LightSlug = 'polaris' | 'vega' | 'rigel' | 'sirius' | 'nova'

export type BatteryOption = {
  id: string
  label: string
  detail: string
  hours: number
}

export type Light = {
  slug: LightSlug
  name: string
  kind: 'corded' | 'wireless'
  watts: number
  lux: number
  /** Spot diameter at 42 cm, in mm. Null where the manufacturer does not list it. */
  spotMm: number | null
  headWeight: string
  bestFor: string
  image: string
  /** Further photos, shown after `image` in the product stage. */
  photos?: string[]
  spotAdjustable: boolean
  /** Wireless only: hours per battery and how many batteries ship. */
  wireless?: { hoursPerBattery: number; batteries: number; chargeTime: string; steps: number }
}

// Corded lights share the same four battery options.
export const BATTERIES: BatteryOption[] = [
  { id: 'clip-4h', label: 'Clip-on', detail: 'Small pack that clips to your scrubs', hours: 4 },
  { id: 'slim-6h', label: 'Slim', detail: 'Thin pack for a pocket or waistband', hours: 6 },
  { id: 'pack-10h', label: 'Extended', detail: 'Larger pack for long days in the OR', hours: 10 },
  { id: 'neck-4h', label: 'Neckband', detail: 'Rests around your neck, nothing at the waist', hours: 4 },
]

export const LIGHTS: Light[] = [
  {
    slug: 'polaris',
    name: 'Polaris',
    kind: 'corded',
    watts: 5,
    lux: 50000,
    spotMm: 140,
    headWeight: '10 g',
    bestFor: 'Everyday work up to 3.5x. The widest spot of the range.',
    image: '/lights/light-7.webp',
    spotAdjustable: false,
  },
  {
    slug: 'vega',
    name: 'Vega',
    kind: 'corded',
    watts: 7,
    lux: 70000,
    spotMm: 90,
    headWeight: '10 g',
    bestFor: 'General surgery and dentistry at 2.5x to 4x.',
    image: '/lights/light-2.webp',
    spotAdjustable: false,
  },
  {
    slug: 'rigel',
    name: 'Rigel',
    kind: 'corded',
    watts: 10,
    lux: 100000,
    spotMm: 95,
    headWeight: '11 g',
    bestFor: '4x to 6x, and deep or shadowed fields.',
    image: '/lights/light-9.webp',
    spotAdjustable: false,
  },
  {
    slug: 'sirius',
    name: 'Sirius',
    kind: 'corded',
    watts: 15,
    lux: 150000,
    spotMm: 95,
    headWeight: '12 g',
    bestFor: 'High magnification and fine work. Our brightest light, with an adjustable spot.',
    image: '/lights/sirius.webp',
    photos: ['/lights/sirius-lens.webp'],
    spotAdjustable: true,
  },
  {
    slug: 'nova',
    name: 'Nova',
    kind: 'wireless',
    watts: 5,
    lux: 50000,
    spotMm: null,
    headWeight: '29 g with battery',
    bestFor: 'No cord at all. The battery sits on the light, and you swap in a fresh one between cases.',
    image: '/lights/nova-wireless.webp',
    spotAdjustable: false,
    wireless: { hoursPerBattery: 3, batteries: 3, chargeTime: 'Under 1 hr', steps: 2 },
  },
]

export const lightBySlug = (slug: string) => LIGHTS.find((light) => light.slug === slug)

export const lightPrice = (slug: string, option: string) => lightPriceBySlug[slug]?.prices[option] ?? 0

/** Lowest catalogue price for a light, across its battery options. */
export const lightFrom = (slug: string) => Math.min(...Object.values(lightPriceBySlug[slug]?.prices ?? { x: 0 }))

/** Suggestion by loupe magnification. Higher magnification shows a darker image, so it wants more light. */
export const MAG_GUIDE: { label: string; slug: LightSlug; why: string }[] = [
  { label: '2.5x–3.5x', slug: 'polaris', why: 'Plenty of light at lower magnification, with the widest spot.' },
  { label: '4x', slug: 'vega', why: 'A step brighter, with a tighter spot that stays on the field.' },
  { label: '5x–6x', slug: 'rigel', why: 'Higher magnification darkens the view. Rigel makes up for it.' },
  { label: '8x and up', slug: 'sirius', why: 'The most light we make, and a spot you can adjust.' },
]

/**
 * The same photo with its white backdrop cut away (public/lights/cut), for glass surfaces.
 * The version suffix changes whenever the cut-outs are redone: the image optimiser caches
 * by URL for 30 days (next.config.js), so a reused name keeps serving the old picture.
 */
const CUTOUT_VERSION = 'v3'
export const cutout = (src: string) => src.replace('/lights/', '/lights/cut/').replace(/\.webp$/, `-${CUTOUT_VERSION}.webp`)
