'use client'

import Link from 'next/link'

import Image from 'next/image'

import CartButton from '../CartButton'

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/home2" className="flex items-center gap-2">
          <Image
            src="/logominimalnowriting.png"
            alt="HeliosX Logo"
            width={28}
            height={28}
            className="object-contain brightness-0 invert"
          />
          <span className="text-sm font-semibold tracking-[0.25em] uppercase">
            heliosX
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <Link href="/product" className="hover:text-white transition-colors">
            Product
          </Link>
          <Link href="/home2#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/home2#story" className="hover:text-white transition-colors">
            Story
          </Link>
          <Link href="/faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Right: cart + CTA */}
        <div className="flex items-center gap-3">
          <CartButton />

          <Link
            href="/product"
            className="rounded-full border border-white/20 bg-white text-black px-4 py-1.5 text-sm font-medium shadow-lg shadow-white/10 hover:bg-neutral-200 transition-colors"
          >
            Order now
          </Link>
        </div>
      </div>
    </header>
  )
}
