// Mobile storefront (m2) model data. Prices are never written here: they come
// from lib/pricing.json through magnificationPriceByProduct. Optics are the
// figures published in lib/fallback-products.ts.

import { magnificationPriceByProduct } from '@/lib/pricing'

export type ModelSlug = 'medusa' | 'apollo' | 'kepler' | 'galileo' | 'newton'

export type MagOptics = { field?: string; depth?: string; weight?: string }

export type M2Model = {
  slug: ModelSlug
  name: string
  category: string
  range: string
  chip: string
  focus: string
  group: 'Ergonomic' | 'Everyday' | 'Fine detail'
  cutout: string
  /** Full studio photo used as the stage, with the wall tone it fades into. */
  photo?: { src: string; tone: string; shift: string; width: string }
  /** Studio photos and the product film, newest shoots first. Empty means use the CMS hero images. */
  gallery: string[]
  film?: string
  facts: [string, string][]
  optics: Record<string, MagOptics>
}

export const MODELS: M2Model[] = [
  {
    slug: 'medusa',
    name: 'Medusa',
    category: 'Ergonomic prismatic',
    range: '3.0x-8.5x',
    chip: '300 to 600 mm adjustable',
    focus: 'Adjustable working distance, 300 to 600 mm',
    group: 'Ergonomic',
    cutout: '/m2/medusa/cut.webp',
    photo: { src: '/m2/medusa/stage.webp', tone: '#8a786c', shift: '-50%', width: '124%' },
    gallery: ['/m2/medusa/g1.webp', '/m2/medusa/g2.webp', '/m2/medusa/g3.webp', '/m2/medusa/g4.webp', '/m2/medusa/g5.webp', '/m2/medusa/g6.webp'],
    film: '/m2/medusa/film.mp4',
    facts: [
      ['Working distance', '300 to 600 mm, adjustable'],
      ['Weight', '56 to 65 g with frame'],
      ['Optics', 'Ergonomic prismatic'],
    ],
    optics: {
      '3.0x': { field: '80 mm', depth: '110 mm', weight: '56 g' },
      '4.0x': { field: '80 mm', depth: '110 mm', weight: '56 g' },
      '5.0x': { field: '75 mm', depth: '70 mm', weight: '58 g' },
      '6.0x': { field: '75 mm', depth: '70 mm', weight: '58 g' },
      '8.0x': { field: '50 mm', depth: '40 mm', weight: '65 g' },
      '8.5x': { field: '50 mm', depth: '40 mm', weight: '65 g' },
    },
  },
  {
    slug: 'apollo',
    name: 'Apollo',
    category: 'Ergonomic prismatic',
    range: '3.0x-6.0x',
    chip: 'Fixed working distance',
    focus: 'Fixed working distance, fitted to you',
    group: 'Ergonomic',
    cutout: '/m2/apollo/cut.webp',
    gallery: [],
    facts: [
      ['Working distance', '420, 450, 500 or 550 mm'],
      ['Field of view', '50 to 105 mm'],
      ['Weight', '55 to 58.2 g with frame'],
    ],
    optics: {},
  },
  {
    slug: 'kepler',
    name: 'Kepler',
    category: 'High-magnification prismatic',
    range: '4.0x-6.0x',
    chip: 'Up to 6.0x',
    focus: 'High magnification for fine-detail work',
    group: 'Fine detail',
    cutout: '/m2/kepler/cut.webp',
    photo: { src: '/m2/kepler/stage.webp', tone: '#a69489', shift: '-47%', width: '150%' },
    gallery: ['/m2/kepler/g1.webp', '/m2/kepler/g2.webp', '/m2/kepler/g3.webp', '/m2/kepler/g4.webp', '/m2/kepler/g5.webp'],
    film: '/m2/kepler/film.mp4',
    facts: [
      ['Working distance', '280 to 600 mm, fitted to you'],
      ['Depth of field', '80 mm'],
      ['Weight', '68 to 85 g with frame'],
    ],
    optics: {
      '4.0x': { field: '60 to 75 mm', depth: '80 mm', weight: '68 g' },
      '5.0x': { field: '55 to 70 mm', depth: '80 mm', weight: '75 g' },
      '6.0x': { field: '50 to 65 mm', depth: '80 mm', weight: '85 g' },
    },
  },
  {
    slug: 'galileo',
    name: 'Galileo',
    category: 'Everyday Galilean',
    range: '2.5x-3.5x',
    chip: '110 to 170 mm field',
    focus: 'Wide field for daily precision work',
    group: 'Everyday',
    cutout: '/m2/galileo/cut.webp',
    photo: { src: '/m2/galileo/stage.webp', tone: '#ae9c8f', shift: '-49%', width: '150%' },
    gallery: ['/m2/galileo/g1.webp', '/m2/galileo/g2.webp', '/m2/galileo/g3.webp', '/m2/galileo/g4.webp', '/m2/galileo/g5.webp', '/m2/galileo/g6.webp'],
    film: '/m2/galileo/film.mp4',
    facts: [
      ['Working distance', '300 to 580 mm'],
      ['Depth of field', '200 mm'],
      ['Pupil distance range', '54 to 72 mm'],
    ],
    optics: {
      '2.5x': { field: '150 to 170 mm', depth: '200 mm' },
      '3.0x': { field: '130 to 150 mm', depth: '200 mm' },
      '3.5x': { field: '110 to 130 mm', depth: '200 mm' },
    },
  },
  {
    slug: 'newton',
    name: 'Newton',
    category: 'Lightweight Galilean',
    range: '2.5x-3.5x',
    chip: 'From 40 g',
    focus: 'Ultra-light comfort for long clinical days',
    group: 'Everyday',
    cutout: '/m2/newton/cut.webp',
    gallery: [],
    facts: [
      ['Working distance', '300 to 550 mm'],
      ['Depth of field', '200 mm'],
      ['Weight', '40 to 50 g with frame'],
    ],
    optics: {
      '2.5x': { field: '80 to 120 mm', depth: '200 mm', weight: '40 g' },
      '3.0x': { field: '70 to 100 mm', depth: '200 mm', weight: '45 g' },
      '3.5x': { field: '60 to 100 mm', depth: '200 mm', weight: '50 g' },
    },
  },
]

export const modelBySlug = (slug: string) => MODELS.find((model) => model.slug === slug)

export const startingPrice = (slug: string) => {
  const prices = Object.values(magnificationPriceByProduct[slug] ?? {})
  return prices.length ? Math.min(...prices) : 0
}

export const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export const swatchHex: Record<string, string> = {
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
