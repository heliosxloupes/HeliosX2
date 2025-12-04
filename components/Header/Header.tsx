'use client'

import Link from 'next/link'
import Image from 'next/image'
import CartButton from '../CartButton'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-gradient-to-b from-black/95 via-black/90 to-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 lg:px-10 xl:px-16">
        {/* Left: logo + wordmark (matches home2 style) */}
        <Link href="/home" className="flex items-center gap-2">
          <Image
            src="/logominimalnowriting.png"
            alt="HeliosX logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain brightness-0 invert"
            priority
          />
          <span className="hidden text-sm font-semibold uppercase tracking-[0.35em] text-neutral-200 sm:inline">
            HELIOSX
          </span>
        </Link>

        {/* Center: nav (Product / Features / Story / FAQ) */}
        <nav className="hidden items-center gap-6 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-neutral-300 md:flex">
          <Link href="/home" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/product" className="transition hover:text-white">
            Product
          </Link>
          <Link href="/features" className="transition hover:text-white">
            Features
          </Link>
          <Link href="/story" className="transition hover:text-white">
            Story
          </Link>
          <Link href="/faq" className="transition hover:text-white">
            FAQ
          </Link>
        </nav>

        {/* Right: Cart + Order CTA */}
        <div className="flex items-center gap-3">
          <CartButton />

          <Link
            href="/product"
            className="hidden rounded-full bg-white px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_32px_rgba(255,255,255,0.7)] transition hover:bg-neutral-100 md:inline-flex"
          >
            Order now
          </Link>
        </div>
      </div>
    </header>
  )
}
