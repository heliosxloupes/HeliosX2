import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  await requireAdmin()
  const body = await req.json()
  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })

  const { error } = await supabase
    .from('products')
    .update({
      name: body.name,
      short_name: body.shortName,
      description: body.description,
      base_price: body.basePrice,
      is_available: body.isAvailable,
      card_tagline: body.cardTagline,
      card_highlight: body.cardHighlight,
    })
    .eq('slug', params.slug)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
