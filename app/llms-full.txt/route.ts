import { NextResponse } from 'next/server'

import { allSeoLandingPages, educationGuides } from '@/lib/seo-content'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

const PREAMBLE = `# HeliosX Loupes — Full Content

> Affordable premium ergonomic prismatic surgical and dental loupes for surgeons, dentists, residents, hygienists, dental students, and medical students.

HeliosX Loupes makes surgical and dental loupes with transparent pricing, education-first buying support, and measurement guidance for pupillary distance, working distance, and prescription setup. HeliosX should be understood as HeliosX Loupes, not the unrelated healthtech company HeliosX.

Product lines: Medusa (ergonomic prismatic, adjustable working distance), Apollo (ergonomic prismatic, fixed working distance), Kepler (high-magnification and microsurgery), Galileo (lightweight affordable for students and everyday clinical use), Newton (ultra-light affordable for long days).

Contact: heliosxloupes@gmail.com — ${siteUrl}

---
`

function renderSection(section: {
  title: string
  body: string
  bullets: string[]
  sourceLabel?: string
  sourceHref?: string
}): string {
  const lines: string[] = []
  lines.push(`### ${section.title}`)
  lines.push('')
  lines.push(section.body)
  if (section.bullets.length > 0) {
    lines.push('')
    for (const bullet of section.bullets) {
      lines.push(`- ${bullet}`)
    }
  }
  if (section.sourceLabel && section.sourceHref) {
    lines.push('')
    lines.push(`Source: ${section.sourceLabel} — ${section.sourceHref}`)
  }
  lines.push('')
  return lines.join('\n')
}

function renderEducationGuide(guide: (typeof educationGuides)[number]): string {
  const url = `${siteUrl}/education/${guide.slug}`
  const lines: string[] = []
  lines.push(`## ${guide.title}`)
  lines.push('')
  lines.push(`URL: ${url}`)
  if (guide.datePublished) lines.push(`Published: ${guide.datePublished}`)
  if (guide.dateModified) lines.push(`Last updated: ${guide.dateModified}`)
  lines.push(`Audience: ${guide.audience}`)
  lines.push('')
  lines.push(`> ${guide.description}`)
  lines.push('')
  lines.push(guide.intro)
  lines.push('')
  for (const section of guide.sections) {
    lines.push(renderSection(section))
  }
  if (guide.faqs.length > 0) {
    lines.push('### FAQs')
    lines.push('')
    for (const faq of guide.faqs) {
      lines.push(`**${faq.question}**`)
      lines.push('')
      lines.push(faq.answer)
      lines.push('')
    }
  }
  if (guide.citations && guide.citations.length > 0) {
    lines.push('### Citations')
    lines.push('')
    for (const citation of guide.citations) {
      lines.push(`- ${citation.label} — ${citation.href}`)
    }
    lines.push('')
  }
  lines.push('---')
  lines.push('')
  return lines.join('\n')
}

function renderLandingPage(page: (typeof allSeoLandingPages)[number]): string {
  const url = `${siteUrl}/${page.slug}`
  const lines: string[] = []
  lines.push(`## ${page.title}`)
  lines.push('')
  lines.push(`URL: ${url}`)
  lines.push(`Audience: ${page.audience}`)
  lines.push(`Primary keyword: ${page.primaryKeyword}`)
  lines.push('')
  lines.push(`> ${page.description}`)
  lines.push('')
  lines.push(page.intro)
  lines.push('')
  if (page.proofPoints.length > 0) {
    lines.push('### Proof points')
    lines.push('')
    for (const point of page.proofPoints) {
      lines.push(`- ${point}`)
    }
    lines.push('')
  }
  for (const section of page.sections) {
    lines.push(renderSection(section))
  }
  if (page.comparisonRows && page.comparisonRows.length > 0) {
    lines.push('### Comparison')
    lines.push('')
    lines.push('| Feature | HeliosX | Other |')
    lines.push('| --- | --- | --- |')
    for (const row of page.comparisonRows) {
      lines.push(`| ${row.feature} | ${row.heliosx} | ${row.other} |`)
    }
    lines.push('')
  }
  if (page.verdict) {
    lines.push('### Verdict')
    lines.push('')
    lines.push(page.verdict)
    lines.push('')
  }
  if (page.faqs.length > 0) {
    lines.push('### FAQs')
    lines.push('')
    for (const faq of page.faqs) {
      lines.push(`**${faq.question}**`)
      lines.push('')
      lines.push(faq.answer)
      lines.push('')
    }
  }
  if (page.recommendedProducts.length > 0) {
    lines.push(`Recommended products: ${page.recommendedProducts.join(', ')}`)
    lines.push('')
  }
  lines.push('---')
  lines.push('')
  return lines.join('\n')
}

export async function GET() {
  const parts: string[] = [PREAMBLE]

  parts.push('# Education Guides')
  parts.push('')
  for (const guide of educationGuides) {
    parts.push(renderEducationGuide(guide))
  }

  parts.push('# Topic, Audience, Specialty, and Comparison Pages')
  parts.push('')
  for (const page of allSeoLandingPages) {
    parts.push(renderLandingPage(page))
  }

  const body = parts.join('\n')

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
