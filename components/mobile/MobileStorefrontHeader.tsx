'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ArrowRight, ArrowUpRight, Menu, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { getCart, type CartItem } from '@/lib/cart'
import pricing from '@/lib/pricing.json'

const models = ['medusa', 'apollo', 'kepler', 'galileo', 'newton'] as const

const menuLinks = [
  ['Shop all loupes', '/product'],
  ['Compare the collection', '/loupe-comparisons'],
  ['Why HeliosX', '/#mission'],
  ['Your custom fit', '/measurements'],
  ['Education', '/education'],
  ['Questions & answers', '/faq'],
] as const

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const startingPrice = (slug: (typeof models)[number]) =>
  Math.min(...Object.values(pricing.products[slug].prices))

function StorefrontSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-[520px] flex-col overflow-hidden border-l border-emerald-200/20 bg-[#0c1310] text-white shadow-[-24px_0_80px_rgba(0,0,0,0.55)] focus:outline-none">
          <div className="flex shrink-0 items-start justify-between gap-5 border-b border-white/10 px-5 pb-5 pt-[max(1.1rem,env(safe-area-inset-top))]">
            <div>
              <Dialog.Title className="font-display text-[1.9rem] font-medium leading-tight tracking-[-0.035em]">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-xs leading-5 text-[#a8bdae]">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-neutral-200 transition active:scale-95" aria-label="Close panel">
              <X size={21} />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default function MobileStorefrontHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [bagOpen, setBagOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])

  const syncCart = () => setItems(getCart())

  useEffect(() => {
    syncCart()
    window.addEventListener('cartUpdated', syncCart)
    window.addEventListener('storage', syncCart)
    return () => {
      window.removeEventListener('cartUpdated', syncCart)
      window.removeEventListener('storage', syncCart)
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setBagOpen(false)
  }, [pathname])

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const rxCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.hasPrescriptionLenses ? item.quantity : 0), 0),
    [items],
  )
  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      rxCount * pricing.addOns['prescription-lenses'].price,
    [items, rxCount],
  )

  const changeQuantity = (index: number, delta: number) => {
    const next = items
      .map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, quantity: Math.max(0, Math.min(pricing.limits.maxQuantityPerLine, item.quantity + delta)) }
          : item,
      )
      .filter((item) => item.quantity > 0)
    localStorage.setItem('heliosx_cart', JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
    setItems(next)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#030609]/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="HeliosX home">
            <Image src="/logominimalnowriting.png" alt="" width={27} height={27} className="h-7 w-7 object-contain brightness-0 invert" priority />
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-100">HeliosX</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                syncCart()
                setBagOpen(true)
              }}
              className="relative grid h-11 w-11 place-items-center rounded-full text-neutral-100 transition active:scale-95"
              aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-emerald-100 px-1 text-[10px] font-bold text-[#08261b]">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-neutral-100 transition active:scale-95"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      <StorefrontSheet
        open={menuOpen}
        onOpenChange={setMenuOpen}
        title="Explore HeliosX"
        description="Surgical precision, finally accessible."
      >
        <nav aria-label="Mobile navigation" className="border-t border-white/10">
          {menuLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-[66px] items-center justify-between gap-5 border-b border-white/10 py-4 font-display text-[1.42rem] leading-tight tracking-[-0.025em]"
            >
              {label}
              <ArrowUpRight size={19} className="text-emerald-200" />
            </Link>
          ))}
        </nav>
        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">The collection</p>
          <div className="mt-3 divide-y divide-white/10 border-y border-white/10">
            {models.map((model) => (
              <Link key={model} href={`/product/${model}`} className="flex min-h-12 items-center justify-between gap-4 py-3">
                <span className="text-base capitalize">{model}</span>
                <span className="text-xs text-neutral-400">From {money(startingPrice(model))}</span>
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-8 font-display text-[1.9rem] leading-[1.1] tracking-[-0.04em] text-emerald-200">
          Skill thrives where access exists.
        </p>
      </StorefrontSheet>

      <StorefrontSheet
        open={bagOpen}
        onOpenChange={setBagOpen}
        title="Your bag"
        description="Your selections are saved on this device."
      >
        {items.length === 0 ? (
          <div className="pt-9">
            <ShoppingBag size={38} className="text-emerald-200" />
            <h2 className="mt-6 font-display text-[2rem] leading-[1.05] tracking-[-0.04em]">Your next pair starts here.</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-400">Explore five systems, each configured around your work and measurements.</p>
            <Link href="/product" className="mt-7 flex min-h-[54px] items-center justify-between rounded-md bg-emerald-100 px-5 text-sm font-semibold text-[#08261b]">
              Explore loupes <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/10">
              {items.map((item, index) => (
                <article key={`${item.productSlug}-${item.selectedMagnification}-${item.selectedFrameId}-${index}`} className="grid grid-cols-[82px_minmax(0,1fr)] gap-4 py-5">
                  <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-900">
                    {item.selectedFrameImage || item.image ? (
                      <Image src={item.selectedFrameImage || item.image || ''} alt="" fill sizes="82px" className="object-contain p-1" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-medium">{item.shortName || item.name}</h2>
                        <p className="mt-1 text-xs leading-5 text-neutral-400">
                          {item.selectedMagnification} / {item.selectedFrameName}
                        </p>
                        {item.hasPrescriptionLenses && <p className="text-xs text-emerald-200">Prescription lenses</p>}
                      </div>
                      <strong className="text-sm font-medium">{money((item.price + (item.hasPrescriptionLenses ? pricing.addOns['prescription-lenses'].price : 0)) * item.quantity)}</strong>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <button type="button" onClick={() => changeQuantity(index, -1)} className="grid h-11 w-11 place-items-center border border-white/15" aria-label={`Reduce ${item.name} quantity`}><Minus size={15} /></button>
                      <span className="w-9 text-center text-sm" aria-live="polite">{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(index, 1)} disabled={item.quantity >= pricing.limits.maxQuantityPerLine} className="grid h-11 w-11 place-items-center border border-white/15 disabled:opacity-40" aria-label={`Increase ${item.name} quantity`}><Plus size={15} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-5 border-y border-white/10 py-5">
              <p className="flex items-baseline justify-between gap-4 text-xl"><span>Subtotal</span><strong className="font-medium">{money(subtotal)}</strong></p>
              <p className="mt-3 flex justify-between gap-4 text-xs text-neutral-400"><span>Standard worldwide shipping</span><span>Included</span></p>
            </div>
            <p className="mt-5 border-l-2 border-emerald-200 bg-emerald-950/25 px-4 py-3 text-xs leading-5 text-neutral-300">
              Your measurements are submitted after checkout and reviewed before production.
            </p>
            <Link href="/cart" className="mt-5 flex min-h-[54px] items-center justify-between rounded-md bg-emerald-100 px-5 text-sm font-semibold text-[#08261b]">
              Review bag <ArrowRight size={18} />
            </Link>
          </>
        )}
      </StorefrontSheet>
    </>
  )
}
