'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from '@/components/Header'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function MeasurementPage({ params }: { params: { token: string } }) {
  const [email, setEmail] = useState('')
  const [pupillaryDistance, setPupillaryDistance] = useState('')
  const [workingDistance, setWorkingDistance] = useState('')
  const [prescriptionNotes, setPrescriptionNotes] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const loading = status === 'submitting'

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    try {
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
      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(payload?.error ?? 'Could not submit measurements.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Could not submit measurements. Please check your connection and try again.')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-4 pt-28 text-white">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[28px] border border-white/10 bg-neutral-950 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.08, type: 'spring', stiffness: 220, damping: 16 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M4 12.5l5 5L20 6.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.28, duration: 0.5, ease: 'easeInOut' }}
                    />
                  </svg>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.4 }}
                  className="mt-6 text-3xl font-semibold"
                >
                  Measurements received
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.4 }}
                  className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-400"
                >
                  Thank you. Your order is now moving into review. Our team will check your fit details
                  and start building your loupes — we&rsquo;ll reach out if we need anything else. A
                  confirmation is on its way to your inbox.
                </motion.p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                onSubmit={submit}
                className="rounded-[28px] border border-white/10 bg-neutral-950 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Custom fit</p>
                <h1 className="mt-2 text-3xl font-semibold">Submit your HeliosX measurements</h1>
                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  Your order remains fully refundable until custom production begins. After you
                  submit these measurements, we review your fit details before releasing the order to production.
                </p>
                <div className="mt-6 grid gap-4">
                  <input
                    required
                    type="email"
                    value={email}
                    disabled={loading}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Order email"
                    className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30 disabled:opacity-50"
                  />
                  <input
                    required
                    value={pupillaryDistance}
                    disabled={loading}
                    onChange={(event) => setPupillaryDistance(event.target.value)}
                    placeholder="Pupillary distance / PD"
                    className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30 disabled:opacity-50"
                  />
                  <input
                    value={workingDistance}
                    disabled={loading}
                    onChange={(event) => setWorkingDistance(event.target.value)}
                    placeholder="Working distance, if known"
                    className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30 disabled:opacity-50"
                  />
                  <textarea
                    value={prescriptionNotes}
                    disabled={loading}
                    onChange={(event) => setPrescriptionNotes(event.target.value)}
                    placeholder="Prescription notes"
                    rows={4}
                    className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30 disabled:opacity-50"
                  />
                  <textarea
                    value={additionalNotes}
                    disabled={loading}
                    onChange={(event) => setAdditionalNotes(event.target.value)}
                    placeholder="Anything else we should know?"
                    rows={4}
                    className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-white/30 disabled:opacity-50"
                  />
                </div>
                <button
                  disabled={loading}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <motion.span
                        aria-hidden="true"
                        className="h-4 w-4 rounded-full border-2 border-black/25 border-t-black"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 0.7 }}
                      />
                      Submitting…
                    </>
                  ) : (
                    'Submit measurements'
                  )}
                </button>
                <AnimatePresence>
                  {status === 'error' && errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 text-sm text-red-400"
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
