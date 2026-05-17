import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  await requireAdmin()
  const formData = await req.formData()
  const file = formData.get('file')
  const slug = String(formData.get('slug') ?? 'product')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `${slug}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage.from('product-media').upload(path, file, {
    upsert: false,
    contentType: file.type,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from('product-media').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
