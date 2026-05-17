import { NextResponse } from 'next/server'

import { upsertCrmContact } from '@/lib/commerce'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = String(body?.email ?? '').trim().toLowerCase()
  const source = body?.source ?? 'contact form'

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  await upsertCrmContact({
    email,
    phone: body?.phone,
    source,
    metadata: body?.metadata,
  })

  return NextResponse.json({ ok: true })
}
