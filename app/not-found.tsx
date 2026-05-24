import type { Metadata } from 'next'
import Link from 'next/link'

import Header from '@/components/Header'
import { buildMetadata } from '@/lib/seo'

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
