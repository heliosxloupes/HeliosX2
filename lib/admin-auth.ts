import { redirect } from 'next/navigation'

import { getAdminSeedEmails } from './admin-emails'
import { createSupabaseServerClient, getSupabaseServiceClient } from './supabase/server'
import { getStaticAdminFromCookie } from './static-admin-auth'

export { getAdminSeedEmails }

export async function getCurrentAdmin() {
  const staticAdmin = getStaticAdminFromCookie()
  if (staticAdmin) return staticAdmin

  const supabase = createSupabaseServerClient()
  const service = getSupabaseServiceClient()
  if (!supabase || !service) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return null

  const email = user.email.toLowerCase()
  const seededAdmin = getAdminSeedEmails().includes(email)

  const { data: profile } = await service
    .from('users')
    .select('id,email,role')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile && seededAdmin) {
    const { data } = await service
      .from('users')
      .upsert(
        {
          id: user.id,
          email,
          role: 'admin',
        },
        { onConflict: 'id' }
      )
      .select('id,email,role')
      .single()

    return data?.role === 'admin' ? data : null
  }

  if (profile?.role === 'admin') return profile

  if (seededAdmin && profile) {
    const { data } = await service
      .from('users')
      .update({ role: 'admin', email })
      .eq('id', user.id)
      .select('id,email,role')
      .single()

    return data?.role === 'admin' ? data : null
  }

  return null
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login')
  return admin
}
