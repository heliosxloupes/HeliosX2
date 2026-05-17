'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Header from '@/components/Header'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setMessage('Supabase is not configured yet.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    })

    setLoading(false)
    setMessage(error ? error.message : 'Check your email for the admin login link.')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-4 pt-28 text-white">
        <form
          onSubmit={submit}
          className="mx-auto max-w-md rounded-[28px] border border-white/10 bg-neutral-950 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold">Sign in to HeliosX ops</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Admin access is limited to seeded HeliosX emails.
          </p>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@email.com"
            required
            className="mt-6 w-full rounded-full border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-emerald-300"
          />
          <button
            disabled={loading}
            className="mt-4 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
          >
            {loading ? 'Sending link...' : 'Send magic link'}
          </button>
          {message && <p className="mt-4 text-sm text-neutral-300">{message}</p>}
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="mt-4 text-xs text-neutral-500 hover:text-white"
          >
            Back to site
          </button>
        </form>
      </main>
    </>
  )
}
