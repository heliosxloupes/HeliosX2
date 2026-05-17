'use client'

import { useState } from 'react'

export function SeedProductsButton() {
  const [message, setMessage] = useState('')

  const seed = async () => {
    setMessage('Seeding...')
    const response = await fetch('/api/admin/seed-products', { method: 'POST' })
    const payload = await response.json().catch(() => null)
    setMessage(response.ok ? 'Products seeded from current catalogue.' : payload?.error ?? 'Seed failed.')
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-neutral-950 p-5">
      <h2 className="text-lg font-semibold">Seed current catalogue</h2>
      <p className="mt-2 text-sm text-neutral-400">
        Copies the current hardcoded HeliosX products into Supabase CMS tables.
      </p>
      <button onClick={seed} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
        Seed products
      </button>
      {message && <p className="mt-3 text-sm text-neutral-300">{message}</p>}
    </div>
  )
}

export function TrackingForm({ orderId }: { orderId: string }) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('Saving...')
    const response = await fetch(`/api/admin/orders/${orderId}/tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingNumber, trackingUrl }),
    })
    setMessage(response.ok ? 'Tracking saved and email queued.' : 'Could not save tracking.')
  }

  return (
    <form onSubmit={submit} className="mt-3 grid gap-2 md:grid-cols-[1fr,1fr,auto]">
      <input
        value={trackingNumber}
        onChange={(event) => setTrackingNumber(event.target.value)}
        placeholder="Tracking number"
        className="rounded-full border border-white/10 bg-black px-3 py-2 text-xs outline-none"
      />
      <input
        value={trackingUrl}
        onChange={(event) => setTrackingUrl(event.target.value)}
        placeholder="Tracking URL"
        className="rounded-full border border-white/10 bg-black px-3 py-2 text-xs outline-none"
      />
      <button className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-black">
        Mark shipped
      </button>
      {message && <p className="text-xs text-neutral-400 md:col-span-3">{message}</p>}
    </form>
  )
}
