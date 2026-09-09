'use client'

import { ArrowRight, Check, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { magnificationPriceByProduct } from '@/lib/pricing'

type Filter = 'all' | 'ergonomic' | 'lightweight' | 'high-mag'

const products = [
  {
    slug: 'medusa',
    name: 'Medusa',
    type: 'Ergonomic prismatic',
    range: '3.0x-8.5x',
    image: '/mobile-home/medusa-editorial.png',
    filters: ['ergonomic', 'high-mag'],
    note: 'The only HeliosX model with adjustable working distance.',
  },
  {
    slug: 'apollo',
    name: 'Apollo',
    type: 'Ergonomic prismatic',
    range: '3.0x-6.0x',
    image: '/mobile-home/apollo-editorial.png',
    filters: ['ergonomic', 'high-mag'],
    note: 'Fixed working distance with an ergonomic optical path.',
  },
  {
    slug: 'kepler',
    name: 'Kepler',
    type: 'Prismatic',
    range: '4.0x-6.0x',
    image: '/mobile-home/kepler-v2.png',
    filters: ['high-mag'],
    note: 'High magnification for detail-intensive procedures.',
  },
  {
    slug: 'galileo',
    name: 'Galileo',
    type: 'Galilean',
    range: '2.5x-3.5x',
    image: '/mobile-home/galileo-editorial.png',
    filters: ['lightweight'],
    note: 'A clear, accessible first custom loupe system.',
  },
  {
    slug: 'newton',
    name: 'Newton',
    type: 'Lightweight Galilean',
    range: '2.5x-3.5x',
    image: '/mobile-home/newton-v2.png',
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

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export default function MobileCatalogueExperience() {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = useMemo(
    () => products.filter((product) => filter === 'all' || product.filters.includes(filter as never)),
    [filter],
  )

  return (
    <main className="min-h-screen bg-[#06090b] pb-20 pt-14 text-white">
      <section className="border-b border-white/10 px-5 pb-9 pt-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-emerald-200/75">The collection / 2026</p>
        <h1 className="mt-4 max-w-[330px] font-display text-[3.4rem] font-medium leading-[0.91] tracking-[-0.065em]">
          Five systems.<br />One standard.
        </h1>
        <p className="mt-6 max-w-sm text-[15px] leading-6 text-neutral-300">
          Custom-fit surgical loupes with published prices. Choose by posture, magnification, and the work in front of you.
        </p>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter loupes">
          {filters.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-xs ${filter === option.value ? 'border-emerald-200 bg-emerald-100 text-[#08261b]' : 'border-white/20 text-neutral-300'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-live="polite">
        {visible.map((product, index) => {
          const prices = Object.values(magnificationPriceByProduct[product.slug] ?? {})
          const startingPrice = prices.length ? Math.min(...prices) : 0

          return (
            <article key={product.slug} className="border-b border-white/10">
              <Link href={`/product/${product.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#dfe7e1]">
                  <Image
                    src={product.image}
                    alt={`${product.name} surgical loupes`}
                    fill
                    sizes="100vw"
                    className="object-cover transition duration-700 group-active:scale-[1.015]"
                  />
                  <span className="absolute left-4 top-4 text-[10px] font-semibold tracking-[0.18em] text-[#183327]">0{index + 1}</span>
                </div>
                <div className="px-5 pb-8 pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/70">{product.type}</p>
                      <h2 className="mt-2 font-display text-[2.45rem] leading-none tracking-[-0.045em]">{product.name}</h2>
                    </div>
                    <ArrowRight className="mt-2 text-emerald-200 transition-transform group-active:translate-x-1" size={22} />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-neutral-400">{product.note}</p>
                  <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                    <span className="text-xs text-neutral-400">{product.range}</span>
                    <span className="text-right"><small className="block text-[10px] uppercase tracking-wider text-neutral-500">From</small><strong className="text-lg font-medium">{money(startingPrice)}</strong></span>
                  </div>
                </div>
              </Link>
            </article>
          )
        })}
      </section>

      <section className="border-b border-white/10 bg-[#e5eee7] px-5 py-12 text-[#10241a]">
        <SlidersHorizontal size={24} />
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#436052]">Not sure where to begin?</p>
        <h2 className="mt-3 font-display text-[2.65rem] leading-[0.96] tracking-[-0.055em]">Choose the optics before the extras.</h2>
        <ul className="mt-7 space-y-4 text-sm leading-6 text-[#344b40]">
          <li className="flex gap-3"><Check size={17} className="mt-1 shrink-0" />2.5x-3.5x for a broad, forgiving everyday field.</li>
          <li className="flex gap-3"><Check size={17} className="mt-1 shrink-0" />4.0x and above for smaller structures and finer detail.</li>
          <li className="flex gap-3"><Check size={17} className="mt-1 shrink-0" />Ergonomic refracted optics when neutral neck posture is the priority.</li>
        </ul>
        <Link href="/loupe-comparisons" className="mt-8 flex min-h-[52px] items-center justify-between rounded-md bg-[#0b2a1d] px-5 text-sm font-semibold text-white">
          Compare all models <ArrowRight size={18} />
        </Link>
        <Link href="/education/loupe-magnification-guide" className="mt-2 flex min-h-[52px] items-center justify-between border border-[#264437] px-5 text-sm font-semibold">
          Read the magnification guide <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  )
}
