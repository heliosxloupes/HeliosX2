'use client'

import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { MODELS, modelBySlug, money, startingPrice } from '@/components/m2/models'
import { PhotoThumb, StagePhoto } from '@/components/m2/Photo'
import PromoBadge from '@/components/PromoBadge'
import { magnificationPriceByProduct, TRAINEE_PERCENT_OFF } from '@/lib/pricing'

type Filter = 'all' | 'ergonomic' | 'lightweight' | 'high-mag'

const notes: Record<string, { note: string; filters: Filter[] }> = {
  medusa: { note: 'The only HeliosX model with adjustable working distance.', filters: ['ergonomic', 'high-mag'] },
  apollo: { note: 'Fixed working distance with an ergonomic optical path.', filters: ['ergonomic', 'high-mag'] },
  kepler: { note: 'High magnification for detail-intensive procedures.', filters: ['high-mag'] },
  galileo: { note: 'A clear, accessible first custom loupe system.', filters: ['lightweight'] },
  newton: { note: 'The lightest route into custom-fit magnification.', filters: ['lightweight'] },
}

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

const magnificationCount = (slug: string) => Object.keys(magnificationPriceByProduct[slug] ?? {}).length

export default function MobileCatalogueExperience() {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = useMemo(
    () => MODELS.filter((model) => filter === 'all' || notes[model.slug]?.filters.includes(filter)),
    [filter],
  )

  return (
    <main className="m2 min-h-screen pb-16">
      <section className="px-5 pb-6 pt-[88px]">
        <p className="m2-kicker">The collection / 2026</p>
        {/* /product renders its <h1> in the desktop layout; see MobileProductExperience. */}
        <p role="heading" aria-level={1} className="m2-rise mt-3 text-[min(3.1rem,13.6vw)] font-extrabold leading-[0.92] tracking-[-0.06em]">
          Five systems.<br />One standard.
        </p>
        <p className="m2-lede mt-4">
          Custom-fit surgical and dental loupes from {money(startingPrice('newton'))}, shipping included. Choose by posture, magnification, and the work in front of you.
        </p>
        <PromoBadge className="mt-4" />
        <ul className="mt-4 flex flex-wrap gap-1.5 text-[12px] font-bold">
          <li><Link href="/warranty" className="flex min-h-9 items-center gap-1.5 rounded-full bg-[#f7f9f7] px-3 active:scale-[0.98]"><Check size={14} className="text-[#0b6b53]" /> Limited lifetime warranty</Link></li>
          <li><Link href="/returns" className="flex min-h-9 items-center gap-1.5 rounded-full bg-[#f7f9f7] px-3 active:scale-[0.98]"><Check size={14} className="text-[#0b6b53]" /> 30-day returns</Link></li>
          <li className="flex min-h-9 items-center gap-1.5 rounded-full bg-[#d1fae5] px-3"><Check size={14} className="text-[#0b6b53]" /> Residents &amp; students save {TRAINEE_PERCENT_OFF}%</li>
        </ul>
      </section>

      {/* FINDER: start from the work, land on the model */}
      <section aria-labelledby="finder-title">
        <h2 id="finder-title" className="px-5 text-[1.15rem] font-extrabold tracking-[-0.03em]">Find your starting point</h2>
        <div className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-pl-5 px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {finder.map((row) => (
            <Link key={row.slug} href={`/product/${row.slug}`} className="flex w-[168px] shrink-0 snap-start flex-col justify-between rounded-[20px] bg-[#f7f9f7] p-3.5 transition-transform active:scale-[0.97]">
              <span className="text-[14px] font-bold leading-[1.3]">{row.need}</span>
              <span className="relative mt-3 block h-[78px] overflow-hidden rounded-[12px] bg-[#d9d0c7]">
                {modelBySlug(row.slug) ? <PhotoThumb model={modelBySlug(row.slug)!} sizes="168px" /> : null}
              </span>
              <span className="mt-2.5 flex items-baseline justify-between">
                <span className="text-[14px] font-extrabold">{row.name}</span>
                <span className="tab text-[12px] font-semibold text-[#4d5f54]">from {money(startingPrice(row.slug))}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="m2-pills mx-5 mt-7" role="group" aria-label="Filter loupes">
        {filters.map((option) => (
          <button key={option.value} type="button" className="m2-pill" aria-pressed={filter === option.value} onClick={() => setFilter(option.value)}>
            {option.label}
          </button>
        ))}
      </div>

      {/* STAGES: each model as a small version of its product page */}
      <section aria-live="polite" className="mt-4 grid gap-3 px-3">
        {visible.map((model) => (
          <article key={model.slug} className="m2-reveal overflow-hidden rounded-[28px] bg-[#f7f9f7]">
            <Link href={`/product/${model.slug}`} className="group block">
              <div className="relative h-[300px] overflow-hidden" style={{ background: model.photo.tone }}>
                <StagePhoto model={model} scale={1.04} animate={false} alt={`${model.name} surgical loupes`} />
                <span className="m2-shade" aria-hidden="true" />
                <span className="absolute inset-x-0 top-6 z-[2] text-center">
                  <span aria-hidden="true" className="m2-giant m2-giant--light" style={{ fontSize: 'min(21vw, 6.2rem)' }}>{model.name}</span>
                  <span className="m2-sub mt-2.5">{model.category} loupes</span>
                </span>
              </div>
              <div className="relative -mt-5 rounded-t-[22px] bg-[#f7f9f7] px-5 pb-5 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-[1.6rem] font-extrabold leading-none tracking-[-0.045em]">{model.name}</h2>
                    <p className="mt-2 text-[14px] leading-[1.45] text-[#26352d]">{notes[model.slug]?.note}</p>
                  </div>
                  <span className="shrink-0 text-right">
                    <small className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#4d5f54]">From</small>
                    <strong className="tab text-[1.35rem] font-extrabold">{money(startingPrice(model.slug))}</strong>
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-[12.5px] font-semibold text-[#4d5f54]">{magnificationCount(model.slug)} magnifications, {model.range}</span>
                  <span className="m2-btn m2-btn--ink min-h-[44px] flex-none px-4 text-[14px]">Configure <ArrowUpRight size={16} /></span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <section className="mx-3 mt-4 rounded-[28px] bg-[#14231d] px-5 pb-6 pt-10 text-[#eef2ee]">
        <p className="text-[12px] font-bold uppercase tracking-[0.26em] text-[rgba(238,242,238,0.62)]">Not sure where to begin?</p>
        <h2 className="mt-3 text-[2.35rem] font-extrabold leading-[0.96] tracking-[-0.055em]">Choose the optics before the extras.</h2>
        <ul className="mt-6 space-y-3 text-[14px] leading-6 text-[rgba(238,242,238,0.8)]">
          <li className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#d1fae5]" />2.5x-3.5x for a broad, forgiving everyday field.</li>
          <li className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#d1fae5]" />4.0x and above for smaller structures and finer detail.</li>
          <li className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#d1fae5]" />Ergonomic refracted optics when neutral neck posture is the priority.</li>
        </ul>
        <Link href="/loupe-comparisons" className="m2-btn m2-btn--mint mt-7 w-full justify-between">
          Compare all models <ArrowRight size={18} />
        </Link>
        <Link href="/education/loupe-magnification-guide" className="m2-btn mt-2 w-full justify-between bg-transparent text-[#eef2ee] shadow-[inset_0_0_0_1.5px_rgba(238,242,238,0.25)]">
          Read the magnification guide <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  )
}
