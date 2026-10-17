'use client'

import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useRef } from 'react'

import { cartEditHref } from '@/lib/cart'
import AfterCheckoutSteps from '@/components/cart/AfterCheckoutSteps'
import type { CartItem } from '@/lib/cart'
import { PRESCRIPTION_PRICE, WARRANTY_PRICE } from '@/lib/pricing'
import { useStickyBarOffset } from './useStickyBarOffset'

type Props = {
  items: CartItem[]
  email: string
  emailError: string
  warranty: boolean
  onEmailChange: (value: string) => void
  onWarrantyChange: (value: boolean) => void
  onRemove: (index: number) => void
  onQuantity: (index: number, quantity: number) => void
  onPrescription: (index: number, value: boolean) => void
  onCheckout: () => void
}

const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

// Studio cut-outs (public/mobile) stand in for the loupe photo in the bag.
const cutoutModels = ['medusa', 'apollo', 'kepler', 'galileo', 'newton']
const eyebrow = 'text-[11px] font-bold uppercase tracking-[0.22em] text-[#56665d]'

export default function MobileCartExperience({
  items,
  email,
  emailError,
  warranty,
  onEmailChange,
  onWarrantyChange,
  onRemove,
  onQuantity,
  onPrescription,
  onCheckout,
}: Props) {
  const loupeSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const rxPairs = items.reduce((sum, item) => sum + (item.hasPrescriptionLenses ? item.quantity : 0), 0)
  const addOns = rxPairs * PRESCRIPTION_PRICE + (warranty ? WARRANTY_PRICE : 0)
  const total = loupeSubtotal + addOns
  const checkoutBarRef = useRef<HTMLDivElement>(null)
  useStickyBarOffset(checkoutBarRef, items.length > 0)

  return (
    <main className="min-h-screen bg-[#eef0ec] pb-36 pt-14 text-[#08261b]">
      <section className="px-5 pb-6 pt-6">
        <Link href="/product" className="flex min-h-11 items-center gap-1.5 text-[13px] font-semibold"><ArrowLeft size={16} /> Continue shopping</Link>
        <p className={`mt-6 ${eyebrow}`}>Your configuration</p>
        <h1 className="mt-2 text-[3.2rem] leading-none tracking-[-0.06em]">The bag.</h1>
        <p className="mt-3 text-[15px] leading-6 text-[#2b3a32]">Review each custom pair before secure checkout.</p>
      </section>

      {!items.length ? (
        <section className="px-5 pb-16">
          <div className="mv2-plane relative h-[220px] overflow-hidden rounded-[24px]">
            <Image src="/mobile/galileo.webp" alt="" fill sizes="(max-width: 767px) 90vw, 1px" className="object-contain p-6 drop-shadow-[0_18px_18px_rgba(55,40,28,0.25)]" />
          </div>
          <p className="mt-7 text-xl font-bold text-[#08261b]">Your bag is empty.</p>
          <p className="mt-2 text-[15px] leading-6 text-[#2b3a32]">Explore the five HeliosX systems and build the one that fits your work.</p>
          <Link href="/product" className="mt-7 flex min-h-[56px] items-center justify-between rounded-[16px] bg-[#14231d] px-5 text-[15px] font-bold text-[#eef0ec]">Explore the collection <ArrowRight size={18} /></Link>
        </section>
      ) : (
        <>
          <section className="grid gap-3 px-3">
            {items.map((item, index) => {
              const useCutout = cutoutModels.includes(item.productSlug)
              return (
                <article key={`${item.productSlug}-${item.selectedFrameId}-${item.selectedMagnification}-${index}`} className="rounded-[24px] bg-[#f8f9f6] p-4">
                  <div className="flex gap-4">
                    {/* Main image is the loupe system itself; the chosen frame is a small inset, so the
                        bag never shows bare frames that look like a different product. */}
                    <div className="relative h-28 w-28 shrink-0">
                      <div className="mv2-plane relative h-full w-full overflow-hidden rounded-[16px]">
                        {useCutout ? (
                          <Image src={`/mobile/${item.productSlug}.webp`} alt={`${item.shortName ?? item.name} loupes`} fill sizes="112px" className="object-contain p-2" />
                        ) : item.image || item.selectedFrameImage ? (
                          <Image src={item.image || item.selectedFrameImage || ''} alt={`${item.shortName ?? item.name} loupes`} fill sizes="112px" className="object-cover" />
                        ) : null}
                      </div>
                      {item.selectedFrameImage ? (
                        <div className="absolute -bottom-2 -right-2 h-11 w-14 overflow-hidden rounded-[10px] border border-[rgba(8,38,27,0.12)] bg-white">
                          <Image src={item.selectedFrameImage} alt={`${item.selectedFrameName ?? 'Selected'} frame`} fill sizes="56px" className="object-contain p-0.5" />
                        </div>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#56665d]">Custom loupe system</p>
                      <h2 className="mt-1 text-[1.6rem] leading-none tracking-[-0.04em]">{item.shortName ?? item.name}</h2>
                      <p className="mt-2 text-[12.5px] leading-5 text-[#2b3a32]">
                        {item.selectedMagnification} / {item.selectedFrameName}
                        <Link href={cartEditHref(item, index)} className="ml-2 font-bold text-[#0b6b53] underline underline-offset-4">Edit</Link>
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-full border-[1.5px] border-[rgba(8,38,27,0.16)]">
                          <button type="button" onClick={() => onQuantity(index, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`} className="flex h-11 w-11 items-center justify-center"><Minus size={14} /></button>
                          <span className="min-w-5 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                          <button type="button" onClick={() => onQuantity(index, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`} className="flex h-11 w-11 items-center justify-center"><Plus size={14} /></button>
                        </div>
                        <strong className="text-[15px] font-extrabold tabular-nums">{money(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[rgba(8,38,27,0.1)] pt-2">
                    <button type="button" onClick={() => onPrescription(index, !item.hasPrescriptionLenses)} aria-pressed={Boolean(item.hasPrescriptionLenses)} className="flex min-h-11 items-center gap-2.5 text-left text-[13px] font-semibold text-[#2b3a32]">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-[6px] border-[1.5px] ${item.hasPrescriptionLenses ? 'border-[#08261b] bg-[#08261b] text-[#eef0ec]' : 'border-[rgba(8,38,27,0.3)]'}`}>{item.hasPrescriptionLenses ? <Check size={13} /> : null}</span>
                      Prescription lenses (+{money(PRESCRIPTION_PRICE)} per pair)
                    </button>
                    <button type="button" onClick={() => onRemove(index)} aria-label={`Remove ${item.name}`} className="flex h-11 w-11 items-center justify-center rounded-full text-[#56665d]"><Trash2 size={16} /></button>
                  </div>
                </article>
              )
            })}
          </section>

          <section className="px-5 pt-8">
            <p className={eyebrow}>Protection</p>
            <button type="button" onClick={() => onWarrantyChange(!warranty)} aria-pressed={warranty} className={`mt-3 flex w-full min-h-[82px] items-center gap-4 rounded-[18px] border-[1.5px] px-4 text-left transition-colors ${warranty ? 'border-[#08261b] bg-[#e2f3ea]' : 'border-[rgba(8,38,27,0.14)]'}`}>
              <ShieldCheck className="shrink-0 text-[#0b6b53]" size={22} />
              <span className="min-w-0 flex-1"><strong className="block text-sm font-bold">Extended warranty</strong><small className="mt-0.5 block text-xs leading-5 text-[#56665d]">Additional coverage beyond the included two-year limited warranty.</small></span>
              <strong className="text-sm font-extrabold tabular-nums">+{money(WARRANTY_PRICE)}</strong>
            </button>
          </section>

          <section className="px-5 py-8">
            <p className={eyebrow}>Checkout</p>
            <label htmlFor="mobile-cart-email" className="mt-3 block text-sm font-bold">Email address <span className="font-normal text-[#56665d]">(optional)</span></label>
            <input id="mobile-cart-email" type="email" autoComplete="email" inputMode="email" autoCapitalize="none" value={email} onChange={(event) => onEmailChange(event.target.value)} placeholder="you@example.com" aria-invalid={Boolean(emailError)} aria-describedby="mobile-cart-email-help" className="mt-2 min-h-[54px] w-full rounded-[14px] border-[1.5px] border-[rgba(8,38,27,0.18)] bg-[#f8f9f6] px-4 text-base text-[#08261b] outline-none placeholder:text-[#6b7a71] focus:border-[#0b6b53]" />
            {emailError ? <p className="mt-2 text-[13px] font-semibold text-[#b42318]">{emailError}</p> : null}
            <p id="mobile-cart-email-help" className="mt-2 text-[12.5px] leading-5 text-[#56665d]">Saves your cart. You can also enter it at payment. No account required.</p>
            <dl className="mt-7 space-y-3 rounded-[18px] bg-[#f8f9f6] px-4 py-5 text-sm">
              <div className="flex justify-between text-[#2b3a32]"><dt>Loupes</dt><dd className="tabular-nums">{money(loupeSubtotal)}</dd></div>
              {rxPairs ? <div className="flex justify-between text-[#2b3a32]"><dt>Prescription lenses x {rxPairs}</dt><dd className="tabular-nums">{money(rxPairs * PRESCRIPTION_PRICE)}</dd></div> : null}
              {warranty ? <div className="flex justify-between text-[#2b3a32]"><dt>Extended warranty</dt><dd className="tabular-nums">{money(WARRANTY_PRICE)}</dd></div> : null}
              <div className="flex justify-between text-[#2b3a32]"><dt>Worldwide shipping</dt><dd className="font-bold text-[#0b6b53]">Included</dd></div>
              <div className="flex justify-between border-t border-[rgba(8,38,27,0.12)] pt-4 text-lg font-extrabold text-[#08261b]"><dt>Total</dt><dd className="tabular-nums">{money(total)}</dd></div>
            </dl>
            <AfterCheckoutSteps className="mt-4 rounded-[18px] bg-[#e2f3ea] px-4 py-4" />
          </section>
        </>
      )}

      {items.length ? (
        <div ref={checkoutBarRef} className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-[#eef0ec] via-[#eef0ec] to-[rgba(238,240,236,0)] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-5">
          <button type="button" onClick={onCheckout} className="mx-auto flex min-h-[58px] w-full max-w-lg items-center justify-between rounded-[18px] bg-[#14231d] px-5 text-[#eef0ec] transition active:scale-[0.98]">
            <span className="flex items-center gap-2 text-[15px] font-extrabold">Secure checkout <ArrowRight size={18} /></span>
            <span className="text-right"><small className="block text-[10px] font-semibold text-[rgba(238,240,236,0.7)]">Total, shipping included</small><strong className="block text-[15px] font-extrabold tabular-nums">{money(total)}</strong></span>
          </button>
        </div>
      ) : null}
    </main>
  )
}
