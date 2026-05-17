'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackShell message="Signing you in..." />}>
      <AuthCallbackContent />
    </Suspense>
  )
}

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Signing you in...')

  useEffect(() => {
    const completeLogin = async () => {
      const supabase = createSupabaseBrowserClient()
      if (!supabase) {
        setMessage('Supabase is not configured.')
        return
      }

      const next = searchParams.get('next') || '/admin'
      const code = searchParams.get('code')
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      const { error } =
        code
          ? await supabase.auth.exchangeCodeForSession(code)
          : accessToken && refreshToken
            ? await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              })
            : { error: new Error('No auth token was found in the callback URL.') }

      if (error) {
        setMessage(error.message)
        return
      }

      const adminResponse = await fetch('/api/admin/me')
      const adminPayload = await adminResponse.json().catch(() => null)

      if (!adminPayload?.admin) {
        setMessage('Signed in, but this email is not configured as an admin.')
        return
      }

      router.replace(next)
    }

    completeLogin()
  }, [router, searchParams])

  return (
    <AuthCallbackShell message={message} />
  )
}

function AuthCallbackShell({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="rounded-[28px] border border-white/10 bg-neutral-950 p-6 text-center">
        <p className="text-sm text-neutral-300">{message}</p>
      </div>
    </main>
  )
}
