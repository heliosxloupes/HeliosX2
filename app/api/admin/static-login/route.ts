import { NextResponse } from 'next/server'

import { getAdminSeedEmails } from '@/lib/admin-emails'
import { createStaticAdminCookie } from '@/lib/static-admin-auth'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = String(body?.email ?? '').trim().toLowerCase()
  const password = String(body?.password ?? '')
  const staticPassword = process.env.ADMIN_STATIC_PASSWORD ?? ''

  if (!staticPassword) {
    return NextResponse.json({ error: 'Static admin login is not configured.' }, { status: 503 })
  }

  if (!getAdminSeedEmails().includes(email) || password !== staticPassword) {
    return NextResponse.json({ error: 'Invalid admin email or password.' }, { status: 401 })
  }

  if (!createStaticAdminCookie(email)) {
    return NextResponse.json({ error: 'Could not create admin session.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
