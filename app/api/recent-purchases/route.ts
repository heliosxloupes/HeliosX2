import { NextResponse } from 'next/server'
import { getRecentPurchases } from '@/lib/recent-purchases'

// One cached read every 10 minutes, shared by every visitor.
export const revalidate = 600

export async function GET() {
  const purchases = await getRecentPurchases()
  return NextResponse.json(
    { purchases },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
        // Data for the toast, not a page: keep it out of search results.
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
  )
}
