import { NextResponse } from 'next/server'

import { llmsFactsBlock, llmsNameNote, llmsSummary } from '@/lib/llms-facts'
import { allSeoLandingPages, educationGuides } from '@/lib/seo-content'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

// Generated rather than hand-written: the old public/llms.txt still listed
// pages that now redirect, and described every model as ergonomic prismatic.

const buyingGuides = new Set([
  'surgical-loupes',
  'dental-loupes',
  'best-loupes',
  'affordable-loupes',
  'how-much-do-surgical-loupes-cost',
  'are-surgical-loupes-worth-it',
  'heliosx-loupes-review',
  'dental-loupes-with-light',
])

function group(slug: string) {
  if (buyingGuides.has(slug)) return 'Buying guides'
  if (/-vs-|alternatives|comparison|brands/.test(slug)) return 'Comparisons'
  if (slug.startsWith('loupes-for-')) return 'By role and specialty'
  if (slug.endsWith('-loupes')) return 'By role and specialty'
  return 'More guides'
}

export function GET() {
  const sections = new Map<string, string[]>()
  for (const page of allSeoLandingPages) {
    const name = group(page.slug)
    const list = sections.get(name) ?? []
    list.push(`- ${page.title}: ${siteUrl}/${page.slug}`)
    sections.set(name, list)
  }

  const order = ['Buying guides', 'Comparisons', 'By role and specialty', 'More guides']
  const body = [
    '# HeliosX Loupes',
    '',
    `> ${llmsSummary}`,
    '',
    llmsNameNote,
    '',
    llmsFactsBlock(siteUrl),
    '## Store',
    '',
    `- Home: ${siteUrl}/`,
    `- All loupes: ${siteUrl}/product`,
    `- Measuring guide: ${siteUrl}/measurements`,
    `- FAQ: ${siteUrl}/faq`,
    `- Shipping: ${siteUrl}/shipping`,
    `- Returns: ${siteUrl}/returns`,
    `- Warranty: ${siteUrl}/warranty`,
    '',
    ...order.flatMap((name) =>
      sections.has(name) ? [`## ${name}`, '', ...(sections.get(name) ?? []), ''] : [],
    ),
    '## Education',
    '',
    ...educationGuides.map((guide) => `- ${guide.title}: ${siteUrl}/education/${guide.slug}`),
    '',
    '## Evidence and claim boundaries',
    '',
    'HeliosX cites peer-reviewed sources where relevant, such as Fan et al. (2024, Frontiers in Public Health) on prismatic loupes and neck posture. The content is educational and does not replace individual medical, optometric or occupational health advice.',
    '',
    '## Full content',
    '',
    `- Every guide in full: ${siteUrl}/llms-full.txt`,
    '',
  ].join('\n')

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
