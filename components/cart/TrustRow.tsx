import Link from 'next/link'
import { Hammer, RotateCcw, ShieldCheck } from 'lucide-react'

// What a buyer weighs at the total: the return terms, the warranty and how long
// the pair takes. Each line states the policy page's own terms and links to it.
const items = [
  {
    key: 'returns',
    icon: RotateCcw,
    text: '30-day returns on non-prescription pairs',
    href: '/returns',
  },
  {
    key: 'warranty',
    icon: ShieldCheck,
    text: 'Limited lifetime warranty on every pair',
    href: '/warranty',
  },
  {
    key: 'build',
    icon: Hammer,
    text: 'Built to your measurements, typically in 1–2 weeks',
    href: '/shipping',
  },
] as const

export default function TrustRow({
  omit = [],
  className = '',
}: {
  omit?: Array<(typeof items)[number]['key']>
  className?: string
}) {
  return (
    <ul className={`space-y-1.5 text-xs leading-5 text-neutral-300 ${className}`}>
      {items
        .filter((item) => !omit.includes(item.key))
        .map(({ key, icon: Icon, text, href }) => (
          <li key={key}>
            <Link
              href={href}
              className="group inline-flex items-center gap-2 underline-offset-4 transition hover:text-white hover:underline"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-300/80" strokeWidth={1.75} aria-hidden="true" />
              {text}
            </Link>
          </li>
        ))}
    </ul>
  )
}
