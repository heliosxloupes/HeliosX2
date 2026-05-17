import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let serviceClient: SupabaseClient | null = null

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function hasSupabaseServiceEnv() {
  return Boolean(hasSupabaseEnv() && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export function getSupabaseServiceClient() {
  if (!hasSupabaseServiceEnv()) return null
  if (!serviceClient) {
    serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }
  return serviceClient
}

export function createSupabaseServerClient() {
  if (!hasSupabaseEnv()) return null
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Server Components cannot set cookies. Route handlers can.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Server Components cannot set cookies. Route handlers can.
          }
        },
      },
    }
  )
}
