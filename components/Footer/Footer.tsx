import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'

import CookiePreferencesButton from '@/components/CookiePreferencesButton'
import { supportEmail } from '@/lib/seo'

const exploreLinks = [
  { label: 'All loupes', href: '/product' },
  { label: 'Surgical loupes', href: '/surgical-loupes' },
  { label: 'Dental loupes', href: '/dental-loupes' },
  { label: 'Affordable loupes', href: '/affordable-loupes' },
  { label: 'Best loupes', href: '/best-loupes' },
  { label: 'Loupe comparisons', href: '/loupe-comparisons' },
]

const buyingGuideLinks = [
  { label: 'How much do loupes cost?', href: '/how-much-do-surgical-loupes-cost' },
  { label: 'Are loupes worth it?', href: '/are-surgical-loupes-worth-it' },
  { label: 'HeliosX loupes review', href: '/heliosx-loupes-review' },
  { label: 'Student & resident discount', href: '/student-loupes-discount' },
]

const dentalSpecialtyLinks = [
  { label: 'Endodontics', href: '/loupes-for-endodontics' },
  { label: 'Periodontics', href: '/loupes-for-periodontics' },
  { label: 'Orthodontics', href: '/loupes-for-orthodontics' },
  { label: 'Dental implants', href: '/loupes-for-dental-implants' },
  { label: 'Dental hygiene', href: '/loupes-for-dental-hygiene' },
]

const surgicalSpecialtyLinks = [
  { label: 'Vascular surgery', href: '/vascular-surgery-loupes' },
  { label: 'Orthopedic surgery', href: '/orthopedic-surgery-loupes' },
  { label: 'Hand surgery', href: '/hand-surgery-loupes' },
  { label: 'General surgery', href: '/general-surgery-loupes' },
  { label: 'Spine surgery', href: '/spine-surgery-loupes' },
  { label: 'Urology', href: '/urology-loupes' },
  { label: 'Gynecology', href: '/gynecology-loupes' },
]

const educationLinks = [
  { label: 'Measurements guide', href: '/measurements' },
  { label: 'Magnification guide', href: '/education/loupe-magnification-guide' },
  { label: 'Galilean vs prismatic', href: '/education/galilean-vs-prismatic-loupes' },
  { label: 'Working distance', href: '/education/working-distance-for-loupes' },
  { label: 'How to measure PD', href: '/education/how-to-measure-pupillary-distance' },
  { label: 'Research library', href: '/education/research' },
]

const policyLinks = [
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns & refunds', href: '/returns' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Terms of service', href: '/terms' },
]

const supportLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Submit measurements', href: '/measurements' },
]

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.href}`}>
            <Link href={link.href} className="text-[13px] leading-5 text-neutral-400 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const contactSubject = encodeURIComponent('Question for HeliosX')

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#030508] text-neutral-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(23,176,143,0.13),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(72,136,255,0.08),transparent_24%)]" />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-8 pt-12 md:px-12 md:pt-16">
        <div className="grid gap-7 border-b border-white/10 pb-11 md:grid-cols-[1fr_auto] md:items-end md:pb-14">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-300/80">
              Guidance before you order
            </p>
            <h2 className="max-w-3xl font-display text-[clamp(2rem,4.6vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white">
              Choose your view<br className="hidden sm:block" /> with clarity.
            </h2>
          </div>
          <a
            href={`mailto:${supportEmail}?subject=${contactSubject}`}
            className="group flex min-h-14 w-full items-center justify-between gap-6 border border-emerald-200/30 bg-emerald-200/10 px-5 text-sm font-semibold text-white transition hover:border-emerald-200/60 hover:bg-emerald-200/15 md:w-[285px]"
          >
            <span className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-emerald-300" strokeWidth={1.7} aria-hidden="true" />
              Email a loupe specialist
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>

        <div className="grid gap-12 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <div className="lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="HeliosX home">
              <Image
                src="/logominimalnowriting.png"
                alt="HeliosX logo"
                width={38}
                height={38}
                className="h-9 w-9 object-contain brightness-0 invert"
              />
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white">HELIOSX</span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-6 text-neutral-400">
              Surgical precision, finally accessible. Ergonomic prismatic and lightweight loupes designed for surgeons, dentists, residents, hygienists, and students who want honest pricing without compromise.
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className="mt-6 inline-block text-xs text-emerald-200 underline decoration-emerald-200/30 underline-offset-4 transition hover:text-white"
            >
              {supportEmail}
            </a>
            <p className="mt-2 text-[11px] text-neutral-600">Replies within one business day.</p>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-4 xl:grid-cols-7">
            <FooterColumn title="Explore" links={exploreLinks} />
            <FooterColumn title="Buying guide" links={buyingGuideLinks} />
            <FooterColumn title="Surgical specialty" links={surgicalSpecialtyLinks} />
            <FooterColumn title="Dental specialty" links={dentalSpecialtyLinks} />
            <FooterColumn title="Education" links={educationLinks} />
            <FooterColumn title="Policies" links={policyLinks} />
            <FooterColumn title="Support" links={supportLinks} />
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-neutral-600 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} HeliosX Loupes. Engineered for excellence. Perfect focus, every detail.</p>
          <div className="flex items-center gap-4">
            <CookiePreferencesButton />
            <p className="uppercase tracking-[0.16em]">No gate keeping. Just fair pricing.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
