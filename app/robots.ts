import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  // /measurements is the public, indexable measurement guide and is in
  // the sitemap. /measurements/[token] is a per-customer route that is
  // noindex via its own layout metadata, so we do not need a robots
  // wildcard blocking it.
  const sharedDisallow = ['/admin', '/admin/', '/api/', '/auth/', '/cart', '/checkout']

  // Explicit allow-list for major AI / search crawlers signals intent
  // even when '*' already permits them, and lets us tighten per-bot
  // later without rewriting the spec for every UA.
  const aiAndSearchBots = [
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'ClaudeBot',
    'anthropic-ai',
    'Claude-Web',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
    'Bytespider',
    'cohere-ai',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
      },
      {
        userAgent: aiAndSearchBots,
        allow: '/',
        disallow: sharedDisallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
