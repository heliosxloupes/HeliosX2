'use client'

import { useState } from 'react'
import Header from '@/components/Header'

export default function MeasurementPage({ params }: { params: { token: string } }) {
  const [email, setEmail] = useState('')
  const [pupillaryDistance, setPupillaryDistance] = useState('')
  const [workingDistance, setWorkingDistance] = useState('')
  const [prescriptionNotes, setPrescriptionNotes] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const response = await fetch('/api/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: params.token,
        email,
        pupillaryDistance,
        workingDistance,
        prescriptionNotes,
        additionalNotes,
      }),
    })
    const payload = await response.json().catch(() => null)
    setLoading(false)
    setMessage(response.ok ? 'Measurements received. Your order will move into review.' : payload?.error ?? 'Could not submit measurements.')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-4 pt-28 text-white">
        <form
          onSubmit={submit}
          className="mx-auto max-w-2xl rounded-[28px] border border-white/10 bg-neutral-950 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Custom fit</p>
          <h1 className="mt-2 text-3xl font-semibold">Submit your HeliosX measurements</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Your order remains fully refundable until these measurements are submitted. Once submitted, we review your fit details and move your loupes toward production.
          </p>
          <div className="mt-6 grid gap-4">
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Order email" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none" />
            <input required value={pupillaryDistance} onChange={(event) => setPupillaryDistance(event.target.value)} placeholder="Pupillary distance / PD" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none" />
            <input value={workingDistance} onChange={(event) => setWorkingDistance(event.target.value)} placeholder="Working distance, if known" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none" />
            <textarea value={prescriptionNotes} onChange={(event) => setPrescriptionNotes(event.target.value)} placeholder="Prescription notes" rows={4} className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none" />
            <textarea value={additionalNotes} onChange={(event) => setAdditionalNotes(event.target.value)} placeholder="Anything else we should know?" rows={4} className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none" />
          </div>
          <button disabled={loading} className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit measurements'}
          </button>
          {message && <p className="mt-4 text-sm text-neutral-300">{message}</p>}
        </form>
      </main>
    </>
  )
}
