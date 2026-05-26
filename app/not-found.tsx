import type { Metadata } from 'next'
import Link from 'next/link'

import Header from '@/components/Header'
import { buildMetadata } from '@/lib/seo'

// Two layers of robots metadata both fire on this segment:
// (1) Next.js auto-emits <meta name="robots" content="noindex"> for any
//     app/not-found.tsx — this is built-in framework behavior.
// (2) The root layout sets robots = { index: true, follow: true } via
//     buildMetadata. Without an explicit override here, that inherited
//     `index, follow` ALSO renders alongside Next's auto noindex —
//     producing a real semantic conflict ("index, follow" + "noindex").
//
// Setting noIndex: true here forces buildMetadata to emit
// `noindex, nofollow` which REPLACES the parent's `index, follow`. The
// remaining duplication is two consistent noindex directives, which
// crawlers de-conflict by taking the most restrictive (noindex). Better
// than the index/noindex conflict that ships without this flag.
export const metadata: Metadata = buildMetadata({
  title: 'Page not found | HeliosX Loupes',
  description: 'The page you are looking for was not found. Return to HeliosX surgical and dental loupes.',
  path: '/',
  noIndex: true,
})

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-neutral-100">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/80">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">This page is off the optical axis.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-neutral-300">
          The page you tried to reach does not exist or has moved. Head back to the homepage or jump to the loupe catalogue.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Back to home
          </Link>
          <Link
            href="/product"
            className="rounded-full border border-white/20 bg-black/25 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white"
          >
            Shop loupes
          </Link>
        </div>
      </main>
    </>
  )
}
