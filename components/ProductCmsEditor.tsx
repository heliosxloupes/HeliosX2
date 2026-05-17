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
    <form onSubmit={save} className="rounded-[24px] border border-white/10 bg-neutral-950 p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{product.shortName}</h2>
        <label className="flex items-center gap-2 text-xs text-neutral-300">
          <input type="checkbox" checked={isAvailable} onChange={(event) => setIsAvailable(event.target.checked)} />
          Available
        </label>
      </div>
      <div className="mt-4 grid gap-3">
        <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-white/10 bg-black px-4 py-2 text-sm" />
        <input value={shortName} onChange={(event) => setShortName(event.target.value)} className="rounded-2xl border border-white/10 bg-black px-4 py-2 text-sm" />
        <input value={basePrice} onChange={(event) => setBasePrice(event.target.value)} placeholder="Base price" className="rounded-2xl border border-white/10 bg-black px-4 py-2 text-sm" />
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="rounded-2xl border border-white/10 bg-black px-4 py-2 text-sm" />
        <input value={cardTagline} onChange={(event) => setCardTagline(event.target.value)} className="rounded-2xl border border-white/10 bg-black px-4 py-2 text-sm" />
        <input value={cardHighlight} onChange={(event) => setCardHighlight(event.target.value)} className="rounded-2xl border border-white/10 bg-black px-4 py-2 text-sm" />
      </div>
      <button className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Save product</button>
      {message && <span className="ml-3 text-xs text-neutral-400">{message}</span>}
    </form>
  )
}
