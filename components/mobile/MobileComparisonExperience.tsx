import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

import { magnificationPriceByProduct } from '@/lib/pricing'

const models = [
  { slug: 'medusa', name: 'Medusa', optics: 'Ergonomic prismatic', range: '3.0x-8.5x', distance: 'Adjustable', forWhom: 'Variable posture and the widest range' },
  { slug: 'apollo', name: 'Apollo', optics: 'Ergonomic prismatic', range: '3.0x-6.0x', distance: 'Fixed', forWhom: 'Neutral-neck posture at a set distance' },
  { slug: 'kepler', name: 'Kepler', optics: 'Prismatic', range: '4.0x-6.0x', distance: 'Fixed', forWhom: 'Fine detail and higher magnification' },
  { slug: 'galileo', name: 'Galileo', optics: 'Galilean', range: '2.5x-3.5x', distance: 'Fixed', forWhom: 'A versatile first custom system' },
  { slug: 'newton', name: 'Newton', optics: 'Lightweight Galilean', range: '2.5x-3.5x', distance: 'Fixed', forWhom: 'Long days and the lowest starting price' },
] as const

const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export default function MobileComparisonExperience() {
  return (
    <div className="bg-[#06090b] pb-16 pt-14 text-white">
      <section className="border-b border-white/10 px-5 pb-9 pt-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200/70">Compare / decide with clarity</p>
        <h1 className="mt-4 font-display text-[3.25rem] font-medium leading-[0.94] tracking-[-0.06em]">The right loupe is the one that fits the work.</h1>
        <p className="mt-6 text-sm leading-6 text-neutral-400">Start with posture and magnification. Price and frame come after.</p>
      </section>

      <section>
        {models.map((model, index) => {
          const prices = Object.values(magnificationPriceByProduct[model.slug])
          return (
            <article key={model.slug} className="border-b border-white/10 px-5 py-7">
              <div className="flex items-start justify-between gap-4">
                <div><span className="text-[10px] text-emerald-200/70">0{index + 1}</span><h2 className="mt-2 font-display text-[2.3rem] leading-none">{model.name}</h2></div>
                <div className="text-right"><small className="block text-[10px] uppercase tracking-wider text-neutral-500">From</small><strong className="text-lg font-medium">{money(Math.min(...prices))}</strong></div>
              </div>
              <dl className="mt-6 divide-y divide-white/10 border-y border-white/10 text-xs">
                <div className="flex justify-between gap-5 py-3"><dt className="text-neutral-500">Optical design</dt><dd className="text-right">{model.optics}</dd></div>
                <div className="flex justify-between gap-5 py-3"><dt className="text-neutral-500">Magnification</dt><dd>{model.range}</dd></div>
                <div className="flex justify-between gap-5 py-3"><dt className="text-neutral-500">Working distance</dt><dd>{model.distance}</dd></div>
              </dl>
              <p className="mt-4 flex gap-2 text-sm leading-6 text-neutral-300"><Check size={16} className="mt-1 shrink-0 text-emerald-200" />{model.forWhom}</p>
              <Link href={`/product/${model.slug}`} className="mt-5 flex min-h-12 items-center justify-between border border-white/20 px-4 text-sm">Configure {model.name} <ArrowRight size={17} /></Link>
            </article>
          )
        })}
      </section>

      <section className="bg-emerald-100 px-5 py-12 text-[#10241a]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-900/60">One important distinction</p>
        <h2 className="mt-3 font-display text-[2.5rem] leading-[.98] tracking-[-.055em]">Only Medusa adjusts its working distance.</h2>
        <p className="mt-5 text-sm leading-6 text-[#355044]">Apollo, Kepler, Galileo, and Newton are built to one fixed working distance from the measurements you submit.</p>
        <Link href="/measurements" className="mt-7 flex min-h-[52px] items-center justify-between rounded-md bg-[#0b2a1d] px-5 text-sm font-semibold text-white">Understand your measurements <ArrowRight size={17} /></Link>
      </section>
    </div>
  )
}
