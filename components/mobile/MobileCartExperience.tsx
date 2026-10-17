'use client'

import { ArrowRight, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useRef } from 'react'

import { cartEditHref } from '@/lib/cart'
import AfterCheckoutSteps from '@/components/cart/AfterCheckoutSteps'
import type { CartItem } from '@/lib/cart'
import { PRESCRIPTION_PRICE, WARRANTY_PRICE } from '@/lib/pricing'
import { modelBySlug } from '@/components/m2/models'
import { PhotoThumb } from '@/components/m2/Photo'
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
  const pairs = items.reduce((sum, item) => sum + item.quantity, 0)
  const checkoutBarRef = useRef<HTMLDivElement>(null)
  useStickyBarOffset(checkoutBarRef, items.length > 0)

  return (
    <main className="m2 min-h-screen pb-32">
      <section className="px-5 pb-5 pt-[88px]">
        <p className="m2-kicker">Your configuration</p>
        <h1 className="m2-rise mt-2 text-[3.1rem] font-extrabold leading-none tracking-[-0.06em]">The bag.</h1>
        <p className="m2-lede mt-3">
          {items.length ? `${pairs} custom pair${pairs === 1 ? '' : 's'}. ` : ''}Review each custom pair before secure checkout.
        </p>
      </section>

      {!items.length ? (
        <section className="px-3 pb-10">
          <div className="relative h-[300px] overflow-hidden rounded-[28px] bg-[#ae9c8f]">
            <Image src="/m2/galileo/stage.webp" alt="" fill sizes="(max-width: 767px) 94vw, 1px" className="m2-rise object-cover" style={{ objectPosition: '48% 62%' }} />
          </div>
          <div className="px-2">
            <p className="mt-6 text-[1.4rem] font-extrabold tracking-[-0.03em]">Your bag is empty.</p>
            <p className="m2-lede mt-1.5">Explore the five HeliosX systems and build the one that fits your work.</p>
            <Link href="/product" className="m2-btn m2-btn--ink mt-6 w-full justify-between">Explore the collection <ArrowRight size={18} /></Link>
          </div>
        </section>
      ) : (
        <>
          <section className="grid gap-2.5 px-3">
            {items.map((item, index) => (
              <article key={`${item.productSlug}-${item.selectedFrameId}-${item.selectedMagnification}-${index}`} className="overflow-hidden rounded-[24px] bg-[#f7f9f7]">
                {/* Main image is the loupe system itself; the chosen frame is a small inset, so the
                    bag never shows bare frames that look like a different product. */}
                <div className="relative h-[190px] overflow-hidden" style={{ background: modelBySlug(item.productSlug)?.photo.tone ?? '#d9d0c7' }}>
                  {modelBySlug(item.productSlug) ? (
                    <PhotoThumb model={modelBySlug(item.productSlug)!} sizes="(max-width: 767px) 94vw, 1px" alt={`${item.shortName ?? item.name} loupes`} />
                  ) : item.image ? (
                    <Image src={item.image} alt={`${item.shortName ?? item.name} loupes`} fill sizes="94vw" className="object-cover" />
                  ) : null}
                  {item.selectedFrameImage ? (
                    <span className="absolute bottom-3 right-3 z-[3] h-[42px] w-[64px] overflow-hidden rounded-[10px] bg-white shadow-[0_6px_16px_rgba(40,30,22,0.16)]">
                      <Image src={item.selectedFrameImage} alt={`${item.selectedFrameName ?? 'Selected'} frame`} fill sizes="64px" className="object-contain p-0.5" />
                    </span>
                  ) : null}
                </div>
                <div className="px-4 pb-3 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-[1.3rem] font-extrabold leading-tight tracking-[-0.035em]">{item.shortName ?? item.name}</h2>
                      <p className="mt-0.5 text-[13px] text-[#4d5f54]">
                        {item.selectedMagnification} / {item.selectedFrameName}
                        <Link href={cartEditHref(item, index)} className="ml-2 font-extrabold text-[#0b6b53] underline underline-offset-4">Edit</Link>
                      </p>
                    </div>
                    <strong className="tab shrink-0 text-[16px] font-extrabold">{money(item.price * item.quantity)}</strong>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-[#e4e9e4] p-1">
                      <button type="button" onClick={() => onQuantity(index, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`} className="m2-icon h-9 w-9 bg-[#f7f9f7]"><Minus size={14} /></button>
                      <span className="tab w-7 text-center text-[14px] font-extrabold" aria-live="polite">{item.quantity}</span>
                      <button type="button" onClick={() => onQuantity(index, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`} className="m2-icon h-9 w-9 bg-[#f7f9f7]"><Plus size={14} /></button>
                    </div>
                    <button type="button" onClick={() => onRemove(index)} aria-label={`Remove ${item.name}`} className="m2-icon h-10 w-10 bg-transparent text-[#4d5f54]"><Trash2 size={17} /></button>
                  </div>
                  <button type="button" role="switch" aria-checked={Boolean(item.hasPrescriptionLenses)} onClick={() => onPrescription(index, !item.hasPrescriptionLenses)} className="mt-2 flex min-h-[52px] w-full items-center justify-between gap-3 border-t border-[rgba(8,38,27,0.1)] pt-2 text-left">
                    <span className="text-[13.5px] font-bold">Prescription lenses <span className="tab font-semibold text-[#4d5f54]">+{money(PRESCRIPTION_PRICE)} per pair</span></span>
                    <span className="m2-switch" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="px-3 pt-3">
            <button type="button" role="switch" aria-checked={warranty} onClick={() => onWarrantyChange(!warranty)} className="m2-row min-h-[78px] rounded-[24px] pl-4">
              <ShieldCheck className="shrink-0 text-[#0b6b53]" size={22} />
              <span className="min-w-0 flex-1">
                <strong className="block text-[15px] font-extrabold">Extended warranty <span className="tab font-semibold text-[#4d5f54]">+{money(WARRANTY_PRICE)}</span></strong>
                <small className="block text-[12.5px] leading-5 text-[#4d5f54]">Additional coverage beyond the included two-year limited warranty.</small>
              </span>
              <span className="m2-switch" aria-hidden="true" />
            </button>
          </section>

          <section className="px-5 pt-8">
            <label htmlFor="mobile-cart-email" className="block text-[15px] font-extrabold">Email address <span className="font-semibold text-[#4d5f54]">(optional)</span></label>
            <input
              id="mobile-cart-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              enterKeyHint="done"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="you@example.com"
              aria-invalid={Boolean(emailError)}
              aria-describedby="mobile-cart-email-help"
              className="mt-2 min-h-[54px] w-full rounded-[16px] border-[1.5px] border-[rgba(8,38,27,0.16)] bg-[#f7f9f7] px-4 text-[16px] text-[#08261b] outline-none placeholder:text-[#6b7a71] focus:border-[#0b6b53]"
            />
            {emailError ? <p className="mt-2 text-[13px] font-bold text-[#b42318]">{emailError}</p> : null}
            <p id="mobile-cart-email-help" className="mt-2 text-[12.5px] leading-5 text-[#4d5f54]">Saves your cart. You can also enter it at payment. No account required.</p>

            <dl className="m2-facts mt-7 border-y border-[rgba(8,38,27,0.12)]">
              <div><dt>Loupes</dt><dd className="tab">{money(loupeSubtotal)}</dd></div>
              {rxPairs ? <div><dt>Prescription lenses x {rxPairs}</dt><dd className="tab">{money(rxPairs * PRESCRIPTION_PRICE)}</dd></div> : null}
              {warranty ? <div><dt>Extended warranty</dt><dd className="tab">{money(WARRANTY_PRICE)}</dd></div> : null}
              <div><dt>Worldwide shipping</dt><dd className="text-[#0b6b53]">Included</dd></div>
              <div className="text-[17px]"><dt className="font-extrabold text-[#08261b]">Total</dt><dd className="tab font-extrabold">{money(total)}</dd></div>
            </dl>
            <AfterCheckoutSteps className="mt-5 rounded-[22px] bg-[#e4e9e4] px-4 py-4" />
          </section>
        </>
      )}

      {items.length ? (
        <div ref={checkoutBarRef} className="m2-bar">
          <button type="button" onClick={onCheckout} className="m2-btn m2-btn--ink justify-between">
            Secure checkout <span className="soft">{money(total)}</span>
          </button>
        </div>
      ) : null}
    </main>
  )
}
