import { lightPriceBySlug } from './pricing'

/**
 * HeliosX LED loupe lights and headlights. Specs come from the manufacturer's
 * 2026 sheets; money lives in lib/pricing.json. Names follow real star
 * brightness: Polaris is the dimmest of the four corded lights, Sirius the
 * brightest. Headlights do the same with Antares, Arcturus and Canopus.
 */

/** Limited warranty on the light head, LEDs, cable and mount. Batteries are wear parts. Set 2026-10-29. */
export const LIGHT_WARRANTY_YEARS = 5

export type LightSlug ='polaris' | 'vega' | 'rigel' | 'sirius' | 'nova' | 'antares' | 'arcturus' | 'canopus' | 'canopus-xl'

export type BatteryOption = {
  id: string
  label: string
  detail: string
  hours: number
}

export type Light = {
  slug: LightSlug
  name: string
  kind: 'corded' | 'wireless' | 'head'
  /** Null where the manufacturer does not list it. */
  watts: number | null
  lux: number
  /** Spot diameter at 42 cm, in mm. Null where the manufacturer does not list it. */
  spotMm: number | null
  headWeight: string
  /** Weight in grams, for the weight comparison. */
  grams: number
  bestFor: string
  image: string
  /** Further photos, shown after `image` in the product stage. */
  photos?: string[]
  spotAdjustable: boolean
  /** Wireless only: hours per battery and how many batteries ship. */
  wireless?: { hoursPerBattery: number; batteries: number; chargeTime: string; steps: number }
  /** Head-mounted only: the light sits on its own headband, battery at the back. */
  head?: { stageTone: string; spotRange: [number, number]; hours: [number, number]; batteries: number; chargeTime: string; colorTemp: string; band: string }
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
    grams: 10,
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
    grams: 10,
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
    grams: 11,
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
    grams: 12,
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
    grams: 29,
    bestFor: 'No cord at all. The battery sits on the light, and you swap in a fresh one between cases.',
    image: '/lights/nova-wireless.webp',
    spotAdjustable: false,
    wireless: { hoursPerBattery: 3, batteries: 3, chargeTime: 'Under 1 hr', steps: 2 },
  },
]

// Head-mounted lights. Not in LIGHTS: those clip to a loupe frame, and the
// desktop page, SEO tables and llms facts describe them that way.
export const HEADLIGHTS: Light[] = [
  {
    slug: 'antares',
    name: 'Antares',
    kind: 'head',
    watts: 5,
    lux: 45000,
    spotMm: 100,
    headWeight: '180 g',
    grams: 180,
    bestFor: 'Exams and general procedures. Two batteries, so one is always charging.',
    image: '/lights/head/antares-1.webp',
    photos: ['/lights/head/antares-2.webp', '/lights/head/antares-3.webp'],
    spotAdjustable: true,
    head: { stageTone: '#a5978e', spotRange: [20, 100], hours: [5, 5], batteries: 2, chargeTime: '4 hrs', colorTemp: '4,500–5,500 K', band: 'Headband with top strap' },
  },
  {
    slug: 'arcturus',
    name: 'Arcturus',
    kind: 'head',
    watts: null,
    lux: 150000,
    spotMm: 95,
    headWeight: '164 g',
    grams: 164,
    bestFor: 'Long lists. Our lightest headlight, with up to 12 hours on a charge.',
    image: '/lights/head/arcturus-1.webp',
    photos: ['/lights/head/arcturus-2.webp'],
    spotAdjustable: true,
    head: { stageTone: '#9f8d7e', spotRange: [20, 95], hours: [5, 12], batteries: 1, chargeTime: '4 hrs', colorTemp: '4,500–5,500 K', band: 'Single padded band' },
  },
  {
    slug: 'canopus',
    name: 'Canopus',
    kind: 'head',
    watts: null,
    lux: 198000,
    spotMm: 90,
    headWeight: '175 g',
    grams: 175,
    bestFor: 'Our brightest light, on a single padded band.',
    image: '/lights/head/canopus-1.webp',
    photos: ['/lights/head/canopus-2.webp'],
    spotAdjustable: true,
    head: { stageTone: '#998b82', spotRange: [10, 90], hours: [4, 4], batteries: 1, chargeTime: '4 hrs', colorTemp: '5,500–6,500 K', band: 'Single padded band' },
  },
  {
    slug: 'canopus-xl',
    name: 'Canopus XL',
    kind: 'head',
    watts: null,
    lux: 198000,
    spotMm: 90,
    headWeight: '231 g',
    grams: 231,
    bestFor: 'The same light as Canopus, with a strap over the top that holds it steady on long cases.',
    image: '/lights/head/canopus-xl-1.webp',
    photos: ['/lights/head/canopus-xl-2.webp', '/lights/head/canopus-xl-3.webp'],
    spotAdjustable: true,
    head: { stageTone: '#afa397', spotRange: [10, 90], hours: [4, 4], batteries: 1, chargeTime: '4 hrs', colorTemp: '5,500–6,500 K', band: 'Headband with top strap' },
  },
]

export const ALL_LIGHTS: Light[] = [...LIGHTS, ...HEADLIGHTS]

export const lightBySlug = (slug: string) => ALL_LIGHTS.find((light) => light.slug === slug)

/** Hours per charge as text, e.g. '4 hrs' or '5–12 hrs'. */
export const headHours = (light: Light) =>
  light.head ? (light.head.hours[0] === light.head.hours[1] ? `${light.head.hours[0]} hrs` : `${light.head.hours[0]}–${light.head.hours[1]} hrs`) : ''

/** What ships with a cordless light, for the cart and Stripe line. Corded lights name their battery instead. */
export const cordlessOptionName = (light: Light) =>
  light.head
    ? `${light.head.band}, ${light.head.batteries} batter${light.head.batteries === 1 ? 'y' : 'ies'}`
    : `${light.wireless?.batteries ?? 1} batteries included`

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
