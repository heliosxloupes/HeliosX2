import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-auth'
import { seedFallbackProducts } from '@/lib/commerce'

export async function POST() {
  await requireAdmin()
  const result = await seedFallbackProducts()
  return NextResponse.json(result)
}
