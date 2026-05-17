import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function PATCH(req: Request, { params }: { params: { key: string } }) {
  await requireAdmin()
  const body = await req.json()
  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })

  const { error } = await supabase
    .from('email_templates')
    .update({
      subject: body.subject,
      body: body.body,
      delay_days: Number(body.delayDays ?? 0),
    })
    .eq('key', params.key)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
