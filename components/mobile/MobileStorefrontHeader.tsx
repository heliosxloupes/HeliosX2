'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ArrowRight, ArrowUpRight, Mail, Menu, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { useContact } from '@/components/Contact/ContactProvider'
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

// Mobile v2: paper sheets, ink type, deep green controls.
const ink = 'text-[#08261b]'
const hair = 'border-[rgba(8,38,27,0.12)]'

function StorefrontSheet({
  open,
  onOpenChange,
  title,
  description,
  origin,
  children,
}: {
  origin: string
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="hx-sheet-overlay fixed inset-0 z-[80] bg-[rgba(8,38,27,0.32)]" />
        <Dialog.Content
          style={{ '--hx-origin': origin } as CSSProperties}
          className={`hx-sheet fixed inset-y-0 right-0 z-[90] flex w-full max-w-[520px] flex-col overflow-hidden bg-[#eef0ec] ${ink} focus:outline-none`}>
          <div className="hx-sheet-row flex shrink-0 items-start justify-between gap-5 px-5 pb-4 pt-[max(1.1rem,env(safe-area-inset-top))]">
            <div>
              <Dialog.Title className="text-[2rem] font-extrabold leading-tight tracking-[-0.045em]">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-[13px] leading-5 text-[#56665d]">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#08261b] text-[#eef0ec] transition active:scale-95"
              aria-label="Close panel">
              <X size={20} />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-2">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default function MobileStorefrontHeader() {
  const pathname = usePathname()
  const { openContact } = useContact()
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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(8,38,27,0.08)] bg-[rgba(238,240,236,0.9)] pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="HeliosX home">
            <Image src="/logominimalnowriting.png" alt="HeliosX logo" width={26} height={26} className="h-[26px] w-[26px] object-contain brightness-0" priority />
            <span className={`text-[12px] font-extrabold uppercase tracking-[0.32em] ${ink}`}>HeliosX</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                syncCart()
                setBagOpen(true)
              }}
              className={`relative grid h-11 w-11 place-items-center rounded-full ${ink} transition active:scale-95`}
              aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#08261b] px-1 text-[10px] font-bold text-[#eef0ec]">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#08261b] text-[#eef0ec] transition active:scale-95"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <StorefrontSheet
        open={menuOpen}
        onOpenChange={setMenuOpen}
        origin="calc(100% - 2.15rem) 1.75rem"
        title="Explore HeliosX"
        description="Surgical precision, finally accessible."
      >
        <div className="hx-sheet-row" style={{ '--i': 1 } as CSSProperties}>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#56665d]">The collection</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {models.map((model, index) => (
              <Link
                key={model}
                href={`/product/${model}`}
                className={`flex min-h-[108px] flex-col justify-between rounded-[14px] bg-[#e1d9d0] p-3 transition active:scale-[0.98] ${index === 0 ? 'col-span-2 min-h-[132px]' : ''}`}
              >
                <span className={`relative block w-full ${index === 0 ? 'h-[64px]' : 'h-12'}`}>
                  <Image src={`/mobile/${model}.webp`} alt="" fill sizes="(max-width: 767px) 80vw, 1px" className="object-contain" />
                </span>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-bold capitalize">{model}</span>
                  <span className="text-[11px] text-[#56665d]">From {money(startingPrice(model))}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <nav aria-label="Mobile navigation" className={`mt-6 border-t ${hair}`}>
          {menuLinks.map(([label, href], index) => (
            <Link
              key={href}
              href={href}
              style={{ '--i': index + 2 } as CSSProperties}
              className={`hx-sheet-row flex min-h-[60px] items-center justify-between gap-5 border-b ${hair} py-3.5 text-[1.3rem] font-bold leading-tight tracking-[-0.03em]`}
            >
              {label}
              <ArrowUpRight size={19} className="text-[#0b6b53]" />
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              window.setTimeout(() => openContact('mobile_navigation'), 0)
            }}
            style={{ '--i': menuLinks.length + 2 } as CSSProperties}
            className={`hx-sheet-row flex min-h-[60px] w-full items-center justify-between gap-5 border-b ${hair} py-3.5 text-left text-[1.3rem] font-bold leading-tight tracking-[-0.03em]`}
          >
            Contact HeliosX
            <Mail size={19} className="text-[#0b6b53]" />
          </button>
        </nav>
        <p
          style={{ '--i': menuLinks.length + 3 } as CSSProperties}
          className="hx-sheet-row mt-8 text-[1.7rem] font-extrabold leading-[1.1] tracking-[-0.045em]"
        >
          Skill thrives where access exists.
        </p>
      </StorefrontSheet>

      <StorefrontSheet
        open={bagOpen}
        onOpenChange={setBagOpen}
        origin="calc(100% - 5.35rem) 1.75rem"
        title="Your bag"
        description="Your selections are saved on this device."
      >
        {items.length === 0 ? (
          <div className="pt-6">
            <div className="relative h-[120px] rounded-[18px] bg-[#e1d9d0]">
              <Image src="/mobile/galileo.webp" alt="" fill sizes="(max-width: 767px) 90vw, 1px" className="object-contain p-4" />
            </div>
            <h2 className="mt-6 text-[2rem] leading-[1.05] tracking-[-0.045em]">Your next pair starts here.</h2>
            <p className="mt-3 text-sm leading-6 text-[#56665d]">Explore five systems, each configured around your work and measurements.</p>
            <Link href="/product" className="mt-7 flex min-h-[54px] items-center justify-between rounded-[14px] bg-[#14231d] px-5 text-sm font-bold text-[#eef0ec]">
              Explore loupes <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[rgba(8,38,27,0.12)]">
              {items.map((item, index) => (
                <article key={`${item.productSlug}-${item.selectedMagnification}-${item.selectedFrameId}-${index}`} className="grid grid-cols-[82px_minmax(0,1fr)] gap-4 py-5">
                  <div className="relative aspect-square">
                    <div className="relative h-full w-full overflow-hidden rounded-[12px] bg-[#e1d9d0]">
                      {(models as readonly string[]).includes(item.productSlug) ? (
                        <Image src={`/mobile/${item.productSlug}.webp`} alt={item.shortName || item.name} fill sizes="82px" className="object-contain p-1.5" />
                      ) : item.image || item.selectedFrameImage ? (
                        <Image src={item.image || item.selectedFrameImage || ''} alt={item.shortName || item.name} fill sizes="82px" className="object-cover" />
                      ) : null}
                    </div>
                    {item.selectedFrameImage ? (
                      <div className="absolute -bottom-1.5 -right-1.5 h-8 w-10 overflow-hidden rounded-md border border-[rgba(8,38,27,0.12)] bg-white">
                        <Image src={item.selectedFrameImage} alt={`${item.selectedFrameName ?? 'Selected'} frame`} fill sizes="40px" className="object-contain p-0.5" />
                      </div>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg">{item.shortName || item.name}</h2>
                        <p className="mt-1 text-xs leading-5 text-[#56665d]">
                          {item.selectedMagnification} / {item.selectedFrameName}
                        </p>
                        {item.hasPrescriptionLenses && <p className="text-xs text-[#0b6b53]">Prescription lenses</p>}
                      </div>
                      <strong className="text-sm font-bold tabular-nums">{money((item.price + (item.hasPrescriptionLenses ? pricing.addOns['prescription-lenses'].price : 0)) * item.quantity)}</strong>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <button type="button" onClick={() => changeQuantity(index, -1)} className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(8,38,27,0.22)]" aria-label={`Reduce ${item.name} quantity`}><Minus size={15} /></button>
                      <span className="w-9 text-center text-sm font-bold tabular-nums" aria-live="polite">{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(index, 1)} disabled={item.quantity >= pricing.limits.maxQuantityPerLine} className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(8,38,27,0.22)] disabled:opacity-40" aria-label={`Increase ${item.name} quantity`}><Plus size={15} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className={`mt-5 border-y ${hair} py-5`}>
              <p className="flex items-baseline justify-between gap-4 text-xl font-bold"><span>Subtotal</span><strong className="tabular-nums">{money(subtotal)}</strong></p>
              <p className="mt-3 flex justify-between gap-4 text-xs text-[#56665d]"><span>Standard worldwide shipping</span><span>Included</span></p>
            </div>
            <p className="mt-5 rounded-[14px] bg-[#e2f3ea] px-4 py-3 text-xs leading-5 text-[#2b3a32]">
              Your measurements are submitted after checkout and reviewed before production.
            </p>
            <Link href="/cart" className="mt-5 flex min-h-[54px] items-center justify-between rounded-[14px] bg-[#14231d] px-5 text-sm font-bold text-[#eef0ec]">
              Review bag <ArrowRight size={18} />
            </Link>
          </>
        )}
      </StorefrontSheet>
    </>
  )
}
