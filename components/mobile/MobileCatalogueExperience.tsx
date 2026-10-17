'use client'

import { ArrowRight, ArrowUpRight, Check, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { magnificationPriceByProduct, TRAINEE_PERCENT_OFF } from '@/lib/pricing'

type Filter = 'all' | 'ergonomic' | 'lightweight' | 'high-mag'

// Mobile v2: each model is a small studio scene, the name set large behind the cut-out.
const products = [
  {
    slug: 'medusa',
    name: 'Medusa',
    type: 'Ergonomic prismatic',
    range: '3.0x-8.5x',
    image: '/mobile/medusa.webp',
    filters: ['ergonomic', 'high-mag'],
    note: 'The only HeliosX model with adjustable working distance.',
  },
  {
    slug: 'apollo',
    name: 'Apollo',
    type: 'Ergonomic prismatic',
    range: '3.0x-6.0x',
    image: '/mobile/apollo.webp',
    filters: ['ergonomic', 'high-mag'],
    note: 'Fixed working distance with an ergonomic optical path.',
  },
  {
    slug: 'kepler',
    name: 'Kepler',
    type: 'Prismatic',
    range: '4.0x-6.0x',
    image: '/mobile/kepler.webp',
    filters: ['high-mag'],
    note: 'High magnification for detail-intensive procedures.',
  },
  {
    slug: 'galileo',
    name: 'Galileo',
    type: 'Galilean',
    range: '2.5x-3.5x',
    image: '/mobile/galileo.webp',
    filters: ['lightweight'],
    note: 'A clear, accessible first custom loupe system.',
  },
  {
    slug: 'newton',
    name: 'Newton',
    type: 'Lightweight Galilean',
    range: '2.5x-3.5x',
    image: '/mobile/newton.webp',
    filters: ['lightweight'],
    note: 'The lightest route into custom-fit magnification.',
  },
] as const

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All five' },
  { value: 'ergonomic', label: 'Ergonomic' },
  { value: 'lightweight', label: 'Lightweight' },
  { value: 'high-mag', label: 'High magnification' },
]

// Most visitors here arrive cold from an Instagram or Facebook ad that says
// "from $695", then met a $1,695 Medusa first and left within seconds. Give
// them the price promise and a one-tap route to the model that fits their work.
const finder = [
  { need: 'Dental hygiene or student clinic', slug: 'newton', name: 'Newton' },
  { need: 'Everyday surgery and residency', slug: 'galileo', name: 'Galileo' },
  { need: 'Fine detail at 4.0x and above', slug: 'kepler', name: 'Kepler' },
  { need: 'Long cases and neck strain', slug: 'apollo', name: 'Apollo' },
  { need: 'You sit and stand during cases', slug: 'medusa', name: 'Medusa' },
] as const

const startingPrice = (slug: string) => {
  const prices = Object.values(magnificationPriceByProduct[slug] ?? {})
  return prices.length ? Math.min(...prices) : 0
}

const magnificationCount = (slug: string) => Object.keys(magnificationPriceByProduct[slug] ?? {}).length

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const eyebrow = 'text-[11px] font-bold uppercase tracking-[0.22em] text-[#56665d]'

export default function MobileCatalogueExperience() {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = useMemo(
    () => products.filter((product) => filter === 'all' || product.filters.includes(filter as never)),
    [filter],
  )

  return (
    <main className="min-h-screen bg-[#eef0ec] pb-20 pt-14 text-[#08261b]">
      <section className="px-5 pb-8 pt-10">
        <p className={eyebrow}>The collection / 2026</p>
        {/* /product renders its <h1> in the desktop layout; see MobileProductExperience. */}
        <p role="heading" aria-level={1} className="mt-4 max-w-[330px] text-[3.25rem] font-extrabold leading-[0.92] tracking-[-0.06em]">
          Five systems.<br />One standard.
        </p>
        <p className="mt-5 max-w-sm text-[15px] leading-6 text-[#2b3a32]">
          Custom-fit surgical and dental loupes from {money(startingPrice('newton'))}, shipping included. Choose by posture, magnification, and the work in front of you.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2 text-[12px] font-semibold text-[#2b3a32]">
          <li className="flex min-h-9 items-center gap-1.5 rounded-full bg-[#e5e8e2] px-3"><Check size={14} className="text-[#0b6b53]" /> 2-year limited warranty</li>
          <li className="flex min-h-9 items-center gap-1.5 rounded-full bg-[#e5e8e2] px-3"><Check size={14} className="text-[#0b6b53]" /> 30-day returns</li>
          <li className="flex min-h-9 items-center gap-1.5 rounded-full bg-[#e2f3ea] px-3 text-[#0b6b53]"><Check size={14} /> Residents &amp; students save {TRAINEE_PERCENT_OFF}%</li>
        </ul>

        <div className="mt-8 rounded-[20px] bg-[#f8f9f6] px-4 pb-2 pt-4">
          <p className={eyebrow}>Find your starting point</p>
          <ul className="mt-2 divide-y divide-[rgba(8,38,27,0.1)]">
            {finder.map((row) => (
              <li key={row.slug}>
                <Link href={`/product/${row.slug}`} className="flex min-h-[52px] items-center justify-between gap-3 py-2.5 text-[14px]">
                  <span className="text-[#2b3a32]">{row.need}</span>
                  <span className="flex shrink-0 items-center gap-2 font-bold">
                    {row.name} <span className="text-[12px] font-semibold text-[#56665d]">from {money(startingPrice(row.slug))}</span>
                    <ArrowRight size={15} className="text-[#0b6b53]" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter loupes">
          {filters.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`min-h-11 shrink-0 rounded-full border-[1.5px] px-4 text-[13px] font-bold transition-colors ${filter === option.value ? 'border-[#08261b] bg-[#08261b] text-[#eef0ec]' : 'border-[rgba(8,38,27,0.14)] text-[#2b3a32]'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-live="polite" className="grid gap-4 px-3">
        {visible.map((product) => {
          const fromPrice = startingPrice(product.slug)

          return (
            <article key={product.slug}>
              <Link href={`/product/${product.slug}`} className="group block overflow-hidden rounded-[26px] bg-[#f8f9f6]">
                <div className="mv2-plane relative h-[248px] overflow-hidden">
                  <span className="absolute inset-x-4 top-4 z-[1] flex justify-between text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#4b5a52]">
                    <span>{product.type}</span>
                    <span>{product.range}</span>
                  </span>
                  <span aria-hidden="true" className="absolute inset-x-0 top-9 z-[1] block text-center text-[min(21vw,6.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.055em] text-[rgba(8,38,27,0.9)]">
                    {product.name}
                  </span>
                  <span className="absolute inset-x-[-4%] bottom-3 top-[78px] z-[2] block transition-transform duration-500 group-active:scale-[0.98]">
                    <Image
                      src={product.image}
                      alt={`${product.name} surgical loupes`}
                      fill
                      sizes="(max-width: 767px) 100vw, 1px"
                      className="object-contain drop-shadow-[0_18px_18px_rgba(55,40,28,0.28)]"
                    />
                  </span>
                </div>
                <div className="px-5 pb-6 pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-[1.9rem] leading-none tracking-[-0.045em]">{product.name}</h2>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#14231d] text-[#eef0ec]"><ArrowUpRight size={19} /></span>
                  </div>
                  <p className="mt-3 text-[14px] leading-6 text-[#2b3a32]">{product.note}</p>
                  <div className="mt-4 flex items-end justify-between border-t border-[rgba(8,38,27,0.1)] pt-4">
                    <span className="text-[12px] font-semibold text-[#56665d]">{magnificationCount(product.slug)} magnifications, {product.range}</span>
                    <span className="text-right"><small className="block text-[10px] font-bold uppercase tracking-wider text-[#56665d]">From</small><strong className="text-xl font-extrabold tabular-nums">{money(fromPrice)}</strong></span>
                  </div>
                </div>
              </Link>
            </article>
          )
        })}
      </section>

      <section className="mx-3 mt-6 rounded-[26px] bg-[#d1fae5] px-5 py-11 text-[#08261b]">
        <SlidersHorizontal size={22} className="text-[#0b6b53]" />
        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0b6b53]">Not sure where to begin?</p>
        <h2 className="mt-3 text-[2.4rem] leading-[0.98] tracking-[-0.055em]">Choose the optics before the extras.</h2>
        <ul className="mt-6 space-y-3.5 text-[14px] leading-6 text-[#2b3a32]">
          <li className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#0b6b53]" />2.5x-3.5x for a broad, forgiving everyday field.</li>
          <li className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#0b6b53]" />4.0x and above for smaller structures and finer detail.</li>
          <li className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#0b6b53]" />Ergonomic refracted optics when neutral neck posture is the priority.</li>
        </ul>
        <Link href="/loupe-comparisons" className="mt-8 flex min-h-[54px] items-center justify-between rounded-[16px] bg-[#14231d] px-5 text-[15px] font-bold text-[#eef0ec]">
          Compare all models <ArrowRight size={18} />
        </Link>
        <Link href="/education/loupe-magnification-guide" className="mt-2 flex min-h-[54px] items-center justify-between rounded-[16px] border-[1.5px] border-[rgba(8,38,27,0.25)] px-5 text-[15px] font-bold">
          Read the magnification guide <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  )
}
