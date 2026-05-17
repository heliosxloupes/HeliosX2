import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'session_id is required' }, { status: 400 })

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ order: null })

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ order: data })
}
