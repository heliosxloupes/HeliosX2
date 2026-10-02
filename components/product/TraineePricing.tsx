'use client'

import { ChevronDown } from 'lucide-react'
import { TRAINEE_PERCENT_OFF, traineePrice } from '@/lib/pricing'

const EMAIL = 'heliosxloupes@gmail.com'

const usd = (value: number) =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`

type Props = {
  model: string
  magnification: string
  price: number
}

// Shoppers kept emailing to ask what the trainee price actually was, and got
// 10% in one reply and 15% in another. Show the number next to the price and
// say exactly how to claim it. The discount itself is a Stripe promotion code
// sent after verification, so checkout still charges catalogue prices.
export default function TraineePricing({ model, magnification, price }: Props) {
  if (!price) return null
  const subject = `Trainee pricing: ${model} ${magnification}`
  const body = [
    'Hi HeliosX,',
    '',
    `I'd like trainee pricing on the ${model} ${magnification}.`,
    '',
    'Name:',
    'Program or school:',
    'Training year:',
    '',
    'Proof of status attached (program ID, enrollment or residency letter, or a schedule showing my training year).',
  ].join('\n')
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <details className="group mt-4 rounded-xl border border-emerald-300/20 bg-emerald-500/[0.06] text-sm">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="text-neutral-200">
          Resident, fellow or student?{' '}
          <strong className="font-semibold text-emerald-200">{usd(traineePrice(price))}</strong>{' '}
          <span className="text-neutral-400">with verified trainee pricing ({TRAINEE_PERCENT_OFF}% off)</span>
        </span>
        <ChevronDown size={16} className="shrink-0 text-emerald-200 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-emerald-300/15 px-4 pb-4 pt-3 text-[13px] leading-relaxed text-neutral-300">
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Email proof of your training status: a program ID, enrollment or residency letter, or a schedule showing your training year.</li>
          <li>We reply with a personal discount code, usually within one business day.</li>
          <li>Enter the code at checkout. Shipping and the two-year warranty stay included.</li>
        </ol>
        <a
          href={mailto}
          className="mt-3 inline-flex min-h-10 items-center rounded-full bg-emerald-200 px-4 text-xs font-semibold text-[#06100b] transition-colors hover:bg-white"
        >
          Email to verify
        </a>
      </div>
    </details>
  )
}
