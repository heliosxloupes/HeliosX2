import { createHash, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

import { createCartRecoveryToken } from '@/lib/cart-recovery'
import { sendEmail } from '@/lib/email'
import { getSiteUrl } from '@/lib/site-url'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const EXPECTED_TOKEN_HASH = '91dd93ec4b921ae29ec8efea5f253faa896a99687b78e47ace625ca8f4250df7'
const TEST_RECIPIENT = 'heliosxloupes@gmail.com'

function authorized(token: string) {
  const supplied = createHash('sha256').update(token).digest('hex')
  const left = Buffer.from(supplied)
  const right = Buffer.from(EXPECTED_TOKEN_HASH)
  return left.length === right.length && timingSafeEqual(left, right)
}

export async function POST(req: Request) {
  const token = req.headers.get('x-preview-token') ?? ''
  if (!authorized(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase unavailable' }, { status: 503 })
  const { data: cart, error } = await supabase
    .from('abandoned_cart_sessions')
    .select('id,cart_items')
    .is('completed_at', null)
    .not('reached_checkout_at', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()
  if (error || !cart) return NextResponse.json({ error: 'No checkout cart available' }, { status: 404 })

  const items = (Array.isArray(cart.cart_items) ? cart.cart_items : []).filter((item: any) => item && !item.isAddon)
  const first = items[0]
  const firstName = String(first?.name ?? 'HeliosX Surgical Loupes')
  const productName = firstName.replace(/\s+surgical loupes$/i, '').trim()
  const imageBySlug: Record<string, string> = {
    newton: '/mobile-home/newton-v2.png',
    galileo: '/mobile-home/galileo-editorial.png',
    apollo: '/mobile-home/apollo-editorial.png',
    medusa: '/mobile-home/medusa-editorial.png',
    kepler: '/mobile-home/kepler-v2.png',
  }
  const recoveryToken = createCartRecoveryToken(cart.id)
  const recoveryUrl = `${getSiteUrl()}/cart/recover?token=${encodeURIComponent(recoveryToken)}`
  const body = `Hello — this is Dr. Efimenko, founder of HeliosX.

I wanted to personally reach out regarding your interest in our ${productName} loupes. Choosing surgical loupes is personal, especially when you are buying online for the first time.

If a question about magnification, working distance, measurements, prescription lenses, or fit held you back, reply directly to this email. Tell me what kind of work you do and what you are deciding between, and I will give you an honest recommendation.

Your configuration is saved below if you would like to pick up where you left off. There is no pressure either way.

Best,
Dr. Efimenko
Founder, HeliosX`
  const result: any = await sendEmail({
    to: TEST_RECIPIENT,
    subject: `[TEST] A personal note about your ${productName} loupes`,
    preview: 'A personal note from Dr. Efimenko about your saved loupe configuration.',
    title: `A personal note about your ${productName} loupes.`,
    body,
    cta: { label: 'Restore checkout', url: recoveryUrl },
    recoverySummary: {
      imageUrl: `${getSiteUrl()}${imageBySlug[String(first?.productSlug ?? '').toLowerCase()] ?? ''}`,
      items: items.map((item: any) => ({
        name: String(item.name ?? 'HeliosX Surgical Loupes'),
        quantity: Math.max(1, Number(item.quantity ?? 1)),
        price: Number(item.price ?? 0),
      })),
      total: items.reduce((sum: number, item: any) => sum + Number(item.price ?? 0) * Math.max(1, Number(item.quantity ?? 1)), 0),
    },
  })
  if (result?.error) return NextResponse.json({ error: result.error.message ?? 'Email failed' }, { status: 502 })
  return NextResponse.json({ sent: true, recipient: TEST_RECIPIENT })
}
