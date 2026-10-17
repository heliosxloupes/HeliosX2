import { ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
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
    <div className="bg-[#eef0ec] pb-16 pt-14 text-[#08261b]">
      <section className="px-5 pb-8 pt-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#56665d]">Compare / decide with clarity</p>
        <h1 className="mt-4 text-[2.9rem] leading-[0.96] tracking-[-0.055em]">The right loupe is the one that fits the work.</h1>
        <p className="mt-5 text-[15px] leading-6 text-[#2b3a32]">Start with posture and magnification. Price and frame come after.</p>
      </section>

      <section className="grid gap-3 px-3">
        {models.map((model) => {
          const prices = Object.values(magnificationPriceByProduct[model.slug])
          return (
            <article key={model.slug} className="overflow-hidden rounded-[24px] bg-[#f8f9f6]">
              <div className="relative h-[170px] bg-[#d9d0c7]">
                <Image src={`/m2/${model.slug}/stage.webp`} alt="" fill sizes="(max-width: 767px) 94vw, 1px" className="object-cover" />
              </div>
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-[2rem] leading-none tracking-[-0.045em]">{model.name}</h2>
                  <div className="text-right"><small className="block text-[10px] font-bold uppercase tracking-wider text-[#56665d]">From</small><strong className="text-xl font-extrabold tabular-nums">{money(Math.min(...prices))}</strong></div>
                </div>
                <dl className="mt-5 grid grid-cols-3 gap-2 text-[12px]">
                  <div className="rounded-[12px] bg-[#e5e8e2] px-3 py-2.5"><dt className="text-[#56665d]">Optical design</dt><dd className="mt-0.5 font-bold leading-4">{model.optics}</dd></div>
                  <div className="rounded-[12px] bg-[#e5e8e2] px-3 py-2.5"><dt className="text-[#56665d]">Magnification</dt><dd className="mt-0.5 font-bold">{model.range}</dd></div>
                  <div className="rounded-[12px] bg-[#e5e8e2] px-3 py-2.5"><dt className="text-[#56665d]">Working distance</dt><dd className="mt-0.5 font-bold">{model.distance}</dd></div>
                </dl>
                <p className="mt-4 flex gap-2 text-[14px] leading-6 text-[#2b3a32]"><Check size={16} className="mt-1 shrink-0 text-[#0b6b53]" />{model.forWhom}</p>
                <Link href={`/product/${model.slug}`} className="mt-4 flex min-h-[52px] items-center justify-between rounded-[16px] bg-[#14231d] px-5 text-[15px] font-bold text-[#eef0ec]">Configure {model.name} <ArrowRight size={17} /></Link>
              </div>
            </article>
          )
        })}
      </section>

      <section className="mx-3 mt-6 rounded-[26px] bg-[#d1fae5] px-5 py-11 text-[#08261b]">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0b6b53]">One important distinction</p>
        <h2 className="mt-3 text-[2.3rem] leading-[.98] tracking-[-.055em]">Only Medusa adjusts its working distance.</h2>
        <p className="mt-4 text-[14px] leading-6 text-[#2b3a32]">Apollo, Kepler, Galileo, and Newton are built to one fixed working distance from the measurements you submit.</p>
        <Link href="/measurements" className="mt-7 flex min-h-[54px] items-center justify-between rounded-[16px] bg-[#14231d] px-5 text-[15px] font-bold text-[#eef0ec]">Understand your measurements <ArrowRight size={17} /></Link>
      </section>
    </div>
  )
}
