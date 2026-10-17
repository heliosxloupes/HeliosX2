'use client'

import { useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronLeft, Mail, Menu, MessageCircle, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import Sheet from '@/components/m2/Sheet'
import { MODELS, modelBySlug, money, startingPrice } from '@/components/m2/models'
import { PhotoThumb } from '@/components/m2/Photo'
import { useContact } from '@/components/Contact/ContactProvider'
import { getCart, type CartItem } from '@/lib/cart'
import pricing from '@/lib/pricing.json'

const menuLinks = [
  ['Shop all loupes', '/product'],
  ['Compare the collection', '/loupe-comparisons'],
  ['Why HeliosX', '/#mission'],
  ['Your custom fit', '/measurements'],
  ['Education', '/education'],
  ['Questions & answers', '/faq'],
] as const


export default function MobileStorefrontHeader() {
  const pathname = usePathname() ?? '/'
  const router = useRouter()
  const { openContact } = useContact()
  const [menuOpen, setMenuOpen] = useState(false)
  const [bagOpen, setBagOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [solid, setSolid] = useState(false)
  const [bump, setBump] = useState(false)
  const { scrollY } = useScroll()

  // Clear over the studio stage, frosted paper once the page moves.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24
    setSolid((prev) => (prev === next ? prev : next))
  })

  const syncCart = () => setItems(getCart())

  useEffect(() => {
    syncCart()
    const onUpdate = () => {
      syncCart()
      setBump(true)
      window.setTimeout(() => setBump(false), 450)
    }
    window.addEventListener('cartUpdated', onUpdate)
    window.addEventListener('storage', syncCart)
    return () => {
      window.removeEventListener('cartUpdated', onUpdate)
      window.removeEventListener('storage', syncCart)
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setBagOpen(false)
  }, [pathname])

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const rxCount = useMemo(() => items.reduce((sum, item) => sum + (item.hasPrescriptionLenses ? item.quantity : 0), 0), [items])
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0) + rxCount * pricing.addOns['prescription-lenses'].price,
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

  // Product pages and the bag get a back button; everything else opens the menu.
  const inner = pathname.startsWith('/product/') || pathname.startsWith('/cart') || pathname.startsWith('/checkout')
  const backHref = pathname.startsWith('/product/') ? '/product' : '/product'

  return (
    <>
      <header className="m2 m2-chrome" data-solid={solid} data-on-photo={!solid && (pathname === '/' || /^\/product\/[^/]+/.test(pathname))} style={{ background: solid ? undefined : 'transparent' }}>
        <div className="m2-chrome__side">
          {inner ? (
            <button type="button" className="m2-icon" aria-label="Back" onClick={() => (window.history.length > 1 ? router.back() : router.push(backHref))}>
              <ChevronLeft size={20} />
            </button>
          ) : null}
          <button type="button" className="m2-icon" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu size={19} />
          </button>
        </div>
        <Link href="/" className="m2-brand flex min-h-11 items-center" aria-label="HeliosX home">
          HELIOSX
        </Link>
        <div className="m2-chrome__side m2-chrome__side--end">
          {/* Always on screen: a person to ask before a high-value purchase. */}
          <button type="button" className="m2-ask" onClick={() => openContact(`mobile_header${pathname === '/' ? '_home' : pathname.replace(/\//g, '_')}`)}>
            <MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" />
            Ask
          </button>
          <button
            type="button"
            className="m2-icon"
            aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
            onClick={() => {
              syncCart()
              setBagOpen(true)
            }}
          >
            <ShoppingBag size={19} />
            {count > 0 ? <span className="m2-badge tab" data-bump={bump}>{count}</span> : null}
          </button>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen} title="HeliosX" description="Surgical precision, finally accessible." full>
        <nav aria-label="Loupe collection" className="grid gap-2">
          {MODELS.map((model, index) => (
            <Link
              key={model.slug}
              href={`/product/${model.slug}`}
              className="relative block h-[104px] overflow-hidden rounded-[22px] transition-transform active:scale-[0.98]"
              style={{ background: model.photo.tone, animation: `m2-rise 0.6s ${80 + index * 50}ms var(--ease-out) both` }}
            >
              <span className="absolute left-4 top-3.5 z-[1] max-w-[46%]">
                <span className="block text-[2rem] font-extrabold uppercase leading-none tracking-[-0.05em] text-[#f1f4f1]">{model.name}</span>
                <span className="mt-1.5 block text-[12.5px] font-semibold leading-[1.35] text-[rgba(241,244,241,0.8)]">{model.category}<br />from <span className="tab text-[#f1f4f1]">{money(startingPrice(model.slug))}</span></span>
              </span>
              <span className="absolute inset-y-0 left-[34%] right-0" style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 24%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 24%)' }}>
                <PhotoThumb model={model} sizes="(max-width: 767px) 62vw, 1px" />
              </span>
              <span className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(90deg, rgba(58,46,38,0.6) 0%, rgba(58,46,38,0.42) 36%, rgba(58,46,38,0.08) 52%, rgba(58,46,38,0) 64%)' }} />
            </Link>
          ))}
        </nav>
        <nav aria-label="Mobile navigation" className="mt-6">
          {menuLinks.map(([label, href]) => (
            <Link key={href} href={href} className="flex min-h-[56px] items-center justify-between gap-5 border-b border-[rgba(8,38,27,0.12)] text-[1.2rem] font-bold tracking-[-0.03em]">
              {label}
              <ArrowUpRight size={18} className="text-[#0b6b53]" />
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              window.setTimeout(() => openContact('mobile_navigation'), 0)
            }}
            className="flex min-h-[56px] w-full items-center justify-between gap-5 border-b border-[rgba(8,38,27,0.12)] text-left text-[1.2rem] font-bold tracking-[-0.03em]"
          >
            Contact HeliosX
            <Mail size={18} className="text-[#0b6b53]" />
          </button>
        </nav>
        <p className="mt-8 text-[1.9rem] font-extrabold leading-[1.02] tracking-[-0.05em]">
          Skill thrives where <span className="text-[#0b6b53]">access exists.</span>
        </p>
      </Sheet>

      <Sheet
        open={bagOpen}
        onOpenChange={setBagOpen}
        title="Your bag"
        description={items.length ? `${count} item${count === 1 ? '' : 's'}, saved on this device` : 'Your selections are saved on this device.'}
        footer={
          items.length ? (
            <Link href="/cart" className="m2-btn m2-btn--ink w-full justify-between">
              Review bag <span className="soft">{money(subtotal)}</span>
            </Link>
          ) : null
        }
      >
        {items.length === 0 ? (
          <div className="pb-2 pt-2">
            <div className="relative h-[170px] overflow-hidden rounded-[22px] bg-[#ae9c8f]">
              <Image src="/m2/galileo/stage.webp" alt="" fill sizes="(max-width: 767px) 90vw, 1px" className="object-cover" style={{ objectPosition: '48% 60%' }} />
            </div>
            <h2 className="mt-5 text-[1.6rem] font-extrabold leading-[1.05] tracking-[-0.045em]">Your next pair starts here.</h2>
            <p className="mt-2 text-sm leading-6 text-[#4d5f54]">Explore five systems, each configured around your work and measurements.</p>
            <Link href="/product" className="m2-btn m2-btn--ink mt-5 w-full justify-between">
              Explore loupes <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              {items.map((item, index) => (
                <article key={`${item.productSlug}-${item.selectedMagnification}-${item.selectedFrameId}-${index}`} className="flex gap-3 rounded-[18px] bg-[#f7f9f7] p-2.5">
                  <div className="relative h-[76px] w-[86px] shrink-0 overflow-hidden rounded-[14px] bg-[#d9d0c7]">
                    {modelBySlug(item.productSlug) ? (
                      <PhotoThumb model={modelBySlug(item.productSlug)!} sizes="86px" alt={item.shortName || item.name} />
                    ) : item.image ? (
                      <Image src={item.image} alt={item.shortName || item.name} fill sizes="86px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[16px] font-extrabold tracking-[-0.02em]">{item.shortName || item.name}</h3>
                      <strong className="tab text-[14px] font-extrabold">{money((item.price + (item.hasPrescriptionLenses ? pricing.addOns['prescription-lenses'].price : 0)) * item.quantity)}</strong>
                    </div>
                    <p className="truncate text-[12px] text-[#4d5f54]">{item.selectedMagnification} / {item.selectedFrameName}{item.hasPrescriptionLenses ? ' / Rx' : ''}</p>
                    <div className="mt-1.5 flex items-center gap-1">
                      <button type="button" onClick={() => changeQuantity(index, -1)} className="m2-icon h-9 w-9 bg-[#e4e9e4]" aria-label={`Reduce ${item.name} quantity`}><Minus size={14} /></button>
                      <span className="tab w-7 text-center text-sm font-bold" aria-live="polite">{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(index, 1)} disabled={item.quantity >= pricing.limits.maxQuantityPerLine} className="m2-icon h-9 w-9 bg-[#e4e9e4] disabled:opacity-40" aria-label={`Increase ${item.name} quantity`}><Plus size={14} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 flex justify-between text-[13px] text-[#4d5f54]"><span>Standard worldwide shipping</span><span className="font-bold text-[#0b6b53]">Included</span></p>
            <p className="mt-3 rounded-[16px] bg-[#e4e9e4] px-4 py-3 text-[12.5px] leading-5 text-[#26352d]">Your measurements are submitted after checkout and reviewed before production.</p>
          </>
        )}
      </Sheet>
    </>
  )
}
