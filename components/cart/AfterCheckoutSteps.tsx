import { TRAINEE_PERCENT_OFF } from '@/lib/pricing'

// Clarity showed shoppers spending seconds on the bag and leaving. The open
// question at this point is "what happens after I pay for something custom?",
// so answer it right above the button.
const steps = [
  ['Pay securely', 'Card, Affirm or Klarna through Stripe.'],
  ['Send two measurements', 'Pupillary and working distance, measured at home. We walk you through it.'],
  ['We confirm, then build', 'We review your numbers before production (usually 1–2 weeks), then ship free worldwide.'],
] as const

export default function AfterCheckoutSteps({ className = '' }: { className?: string }) {
  return (
    <div className={`text-xs leading-5 text-neutral-300 ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">After you pay</p>
      <ol className="mt-3 space-y-2.5">
        {steps.map(([title, body], index) => (
          <li key={title} className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-200/40 text-[10px] font-semibold text-emerald-200">
              {index + 1}
            </span>
            <span>
              <strong className="font-medium text-neutral-100">{title}.</strong> {body}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-neutral-400">
        <strong className="font-medium text-neutral-100">30-day returns</strong> on non-prescription pairs; prescription pairs are refundable until production starts. Resident, fellow or student? Email us proof of your training status and, once we have verified it, we send a code for {TRAINEE_PERCENT_OFF}% off.
      </p>
    </div>
  )
}
