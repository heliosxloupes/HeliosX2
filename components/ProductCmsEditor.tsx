'use client'

import { useState } from 'react'
import type { CmsProduct } from '@/lib/ecommerce-types'

export default function ProductCmsEditor({ product }: { product: CmsProduct }) {
  const [name, setName] = useState(product.name)
  const [shortName, setShortName] = useState(product.shortName)
  const [description, setDescription] = useState(product.description)
  const [basePrice, setBasePrice] = useState(product.basePrice?.toString() ?? '')
  const [isAvailable, setIsAvailable] = useState(product.isAvailable)
  const [cardTagline, setCardTagline] = useState(product.cardTagline)
  const [cardHighlight, setCardHighlight] = useState(product.cardHighlight)
  const [message, setMessage] = useState('')

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('Saving...')
    const response = await fetch(`/api/admin/products/${product.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        shortName,
        description,
        basePrice: basePrice ? Number(basePrice) : null,
        isAvailable,
        cardTagline,
        cardHighlight,
      }),
    })
    setMessage(response.ok ? 'Saved.' : 'Save failed. Make sure Supabase is configured and seeded.')
  }

  return (
    <form onSubmit={save} className="rounded-2xl border border-white/10 bg-neutral-950/80 p-5 transition hover:border-white/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{product.shortName}</h2>
          <p className="mt-1 text-xs text-neutral-500">{product.slug}</p>
        </div>
        <label className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs text-neutral-300">
          <input type="checkbox" checked={isAvailable} onChange={(event) => setIsAvailable(event.target.checked)} className="accent-emerald-400" />
          Available
        </label>
      </div>
      <div className="mt-4 grid gap-3">
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-sm normal-case tracking-normal text-white outline-none transition focus:border-emerald-300/50" />
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Short name
          <input value={shortName} onChange={(event) => setShortName(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-sm normal-case tracking-normal text-white outline-none transition focus:border-emerald-300/50" />
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Base price
          <input value={basePrice} onChange={(event) => setBasePrice(event.target.value)} placeholder="Base price" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-sm normal-case tracking-normal text-white outline-none transition focus:border-emerald-300/50" />
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-sm normal-case leading-6 tracking-normal text-white outline-none transition focus:border-emerald-300/50" />
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Card tagline
          <input value={cardTagline} onChange={(event) => setCardTagline(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-sm normal-case tracking-normal text-white outline-none transition focus:border-emerald-300/50" />
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Card highlight
          <input value={cardHighlight} onChange={(event) => setCardHighlight(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-sm normal-case tracking-normal text-white outline-none transition focus:border-emerald-300/50" />
        </label>
      </div>
      <button className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">Save product</button>
      {message && <span className="ml-3 text-xs text-neutral-400">{message}</span>}
    </form>
  )
}
