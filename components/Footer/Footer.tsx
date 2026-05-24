import Link from 'next/link'

import { supportEmail } from '@/lib/seo'

const exploreLinks: { label: string; href: string }[] = [
  { label: 'All loupes', href: '/product' },
  { label: 'Surgical loupes', href: '/surgical-loupes' },
  { label: 'Dental loupes', href: '/dental-loupes' },
  { label: 'Affordable loupes', href: '/affordable-loupes' },
  { label: 'Best loupes', href: '/best-loupes' },
  { label: 'Loupe comparisons', href: '/loupe-comparisons' },
]

const educationLinks: { label: string; href: string }[] = [
  { label: 'Measurements guide', href: '/measurements' },
  { label: 'Magnification guide', href: '/education/loupe-magnification-guide' },
  { label: 'Galilean vs prismatic', href: '/education/galilean-vs-prismatic-loupes' },
  { label: 'Working distance', href: '/education/working-distance-for-loupes' },
  { label: 'How to measure PD', href: '/education/how-to-measure-pupillary-distance' },
  { label: 'Research library', href: '/education/research' },
]

const policyLinks: { label: string; href: string }[] = [
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns & refunds', href: '/returns' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Terms of service', href: '/terms' },
]

const supportLinks: { label: string; href: string }[] = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Submit measurements', href: '/measurements' },
]

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200/80">
        {title}
      </p>
      <ul className="space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-neutral-300 transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black px-5 py-16 text-neutral-300 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/40 bg-gradient-to-br from-emerald-500/30 to-transparent text-sm font-semibold text-white">
                H
              </span>
              <span className="text-base font-semibold text-white">HeliosX</span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-neutral-300">
              Surgical precision, finally accessible. Ergonomic prismatic and lightweight loupes designed for surgeons, dentists, residents, hygienists, and students who want honest pricing without compromise.
            </p>
            <div className="space-y-2 text-sm text-neutral-300">
              <p>
                <span className="text-neutral-500">Support:</span>{' '}
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-emerald-200 underline decoration-emerald-200/30 underline-offset-4 transition hover:text-white"
                >
                  {supportEmail}
                </a>
              </p>
              <p className="text-xs text-neutral-500">
                Our team answers within one business day.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            <FooterColumn title="Explore" links={exploreLinks} />
            <FooterColumn title="Education" links={educationLinks} />
            <FooterColumn title="Policies" links={policyLinks} />
            <FooterColumn title="Support" links={supportLinks} />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} HeliosX Loupes. Engineered for excellence. Perfect focus, every detail.
          </p>
          <p>No gate keeping. Just fair pricing.</p>
        </div>
      </div>
    </footer>
  )
}
