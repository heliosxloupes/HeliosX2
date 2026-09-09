'use client'

import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { CartItem } from '@/lib/cart'
import { PRESCRIPTION_PRICE, WARRANTY_PRICE } from '@/lib/pricing'

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

  return (
    <main className="min-h-screen bg-[#06090b] pb-32 pt-14 text-white">
      <section className="border-b border-white/10 px-5 pb-7 pt-8">
        <Link href="/product" className="flex min-h-11 items-center gap-2 text-xs text-emerald-200"><ArrowLeft size={16} /> Continue shopping</Link>
        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200/70">Your configuration</p>
        <h1 className="mt-3 font-display text-[3.2rem] leading-none tracking-[-0.06em]">The bag.</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-400">Review each custom pair before secure checkout.</p>
      </section>

      {!items.length ? (
        <section className="px-5 py-16">
          <p className="text-xl text-neutral-200">Your bag is empty.</p>
          <p className="mt-3 text-sm leading-6 text-neutral-400">Explore the five HeliosX systems and build the one that fits your work.</p>
          <Link href="/product" className="mt-7 flex min-h-[52px] items-center justify-between rounded-md bg-emerald-100 px-5 text-sm font-semibold text-[#08261b]">Explore the collection <ArrowRight size={18} /></Link>
        </section>
      ) : (
        <>
          <section>
            {items.map((item, index) => (
              <article key={`${item.productSlug}-${item.selectedFrameId}-${item.selectedMagnification}-${index}`} className="border-b border-white/10 px-5 py-6">
                <div className="flex gap-4">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md bg-white">
                    {item.selectedFrameImage || item.image ? <Image src={item.selectedFrameImage || item.image || ''} alt={item.name} fill sizes="112px" className="object-contain p-1" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/70">Custom loupe system</p>
                    <h2 className="mt-1 font-display text-[1.8rem] leading-none">{item.shortName ?? item.name}</h2>
                    <p className="mt-2 text-xs leading-5 text-neutral-400">{item.selectedMagnification} / {item.selectedFrameName}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-white/15">
                        <button type="button" onClick={() => onQuantity(index, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`} className="flex h-11 w-11 items-center justify-center"><Minus size={14} /></button>
                        <span className="min-w-5 text-center text-xs">{item.quantity}</span>
                        <button type="button" onClick={() => onQuantity(index, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`} className="flex h-11 w-11 items-center justify-center"><Plus size={14} /></button>
                      </div>
                      <strong className="text-sm font-medium">{money(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <button type="button" onClick={() => onPrescription(index, !item.hasPrescriptionLenses)} className={`flex min-h-11 items-center gap-2 text-left text-xs ${item.hasPrescriptionLenses ? 'text-emerald-200' : 'text-neutral-400'}`}>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-sm border ${item.hasPrescriptionLenses ? 'border-emerald-200 bg-emerald-200 text-[#08261b]' : 'border-white/25'}`}>{item.hasPrescriptionLenses ? <Check size={13} /> : null}</span>
                    Prescription lenses (+{money(PRESCRIPTION_PRICE)} per pair)
                  </button>
                  <button type="button" onClick={() => onRemove(index)} aria-label={`Remove ${item.name}`} className="flex h-11 w-11 items-center justify-center text-neutral-500"><Trash2 size={16} /></button>
                </div>
              </article>
            ))}
          </section>

          <section className="border-b border-white/10 px-5 py-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Protection</p>
            <button type="button" onClick={() => onWarrantyChange(!warranty)} className={`mt-4 flex w-full min-h-[82px] items-center gap-4 rounded-md border px-4 text-left ${warranty ? 'border-emerald-200 bg-[#14231d]' : 'border-white/15'}`}>
              <ShieldCheck className="shrink-0 text-emerald-200" size={22} />
              <span className="min-w-0 flex-1"><strong className="block text-sm font-medium">Extended warranty</strong><small className="mt-1 block text-xs leading-5 text-neutral-400">Additional coverage beyond the included two-year limited warranty.</small></span>
              <strong className="text-sm">+{money(WARRANTY_PRICE)}</strong>
            </button>
          </section>

          <section className="px-5 py-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Checkout</p>
            <label htmlFor="mobile-cart-email" className="mt-4 block text-sm">Email address</label>
            <input id="mobile-cart-email" type="email" autoComplete="email" value={email} onChange={(event) => onEmailChange(event.target.value)} placeholder="you@example.com" className="mt-2 min-h-[52px] w-full rounded-md border border-white/20 bg-transparent px-4 text-base outline-none focus:border-emerald-200" />
            {emailError ? <p className="mt-2 text-xs text-red-300">{emailError}</p> : null}
            <p className="mt-3 text-xs leading-5 text-neutral-500">Used for your receipt and measurement link. No account required.</p>
            <dl className="mt-7 space-y-3 border-t border-white/10 pt-5 text-sm">
              <div className="flex justify-between text-neutral-400"><dt>Loupes</dt><dd>{money(loupeSubtotal)}</dd></div>
              {rxPairs ? <div className="flex justify-between text-neutral-400"><dt>Prescription lenses x {rxPairs}</dt><dd>{money(rxPairs * PRESCRIPTION_PRICE)}</dd></div> : null}
              {warranty ? <div className="flex justify-between text-neutral-400"><dt>Extended warranty</dt><dd>{money(WARRANTY_PRICE)}</dd></div> : null}
              <div className="flex justify-between text-neutral-400"><dt>Worldwide shipping</dt><dd className="text-emerald-200">Included</dd></div>
              <div className="flex justify-between border-t border-white/10 pt-4 text-lg text-white"><dt>Total</dt><dd>{money(total)}</dd></div>
            </dl>
            <div className="mt-6 border-l-2 border-emerald-200 bg-[#14231d] px-4 py-4 text-xs leading-5 text-neutral-300">Fully refundable before custom production begins. Production usually takes 1-2 weeks after your measurements are approved.</div>
          </section>
        </>
      )}

      {items.length ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#0c1710]/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-lg items-center gap-4">
            <div className="min-w-0 flex-1"><small className="block text-[11px] text-neutral-400">Total / shipping included</small><strong className="block text-xl font-medium">{money(total)}</strong></div>
            <button type="button" onClick={onCheckout} className="flex min-h-[52px] min-w-[58%] items-center justify-between rounded-md bg-emerald-100 px-5 text-sm font-semibold text-[#08261b]">Secure checkout <ArrowRight size={18} /></button>
          </div>
        </div>
      ) : null}
    </main>
  )
}
