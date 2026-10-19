import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'

import CustomHairline from '@/components/m2/CustomHairline'

// Homepage links into the specialty landing pages. Groups use <details> so the
// list stays short on screen while every link is in the HTML Google indexes
// (a select menu or tap-to-render dropdown would hide them from crawlers).
const GROUPS = [
  {
    title: 'Surgical specialties',
    links: [
      ['/general-surgery-loupes', 'General surgery'],
      ['/education/best-loupes-for-plastic-surgery', 'Plastic surgery'],
      ['/hand-surgery-loupes', 'Hand surgery'],
      ['/neurosurgery-loupes', 'Neurosurgery'],
      ['/spine-surgery-loupes', 'Spine surgery'],
      ['/orthopedic-surgery-loupes', 'Orthopedic surgery'],
      ['/ent-otolaryngology-loupes', 'ENT / otolaryngology'],
      ['/ophthalmic-surgery-loupes', 'Ophthalmic surgery'],
      ['/maxillofacial-surgery-loupes', 'Oral & maxillofacial surgery'],
      ['/vascular-surgery-loupes', 'Vascular surgery'],
      ['/cardiac-surgery-loupes', 'Cardiac surgery'],
      ['/colorectal-surgery-loupes', 'Colorectal surgery'],
      ['/trauma-surgery-loupes', 'Trauma surgery'],
      ['/pediatric-surgery-loupes', 'Pediatric surgery'],
      ['/urology-loupes', 'Urology'],
      ['/gynecology-loupes', 'Gynecology'],
      ['/dermatology-mohs-surgery-loupes', 'Dermatology & Mohs surgery'],
    ],
  },
  {
    title: 'Dental specialties',
    links: [
      ['/loupes-for-general-dentists', 'General dentistry'],
      ['/loupes-for-dental-hygiene', 'Dental hygiene'],
      ['/loupes-for-dental-assistants', 'Dental assistants'],
      ['/loupes-for-endodontics', 'Endodontics'],
      ['/loupes-for-periodontics', 'Periodontics'],
      ['/loupes-for-prosthodontics', 'Prosthodontics'],
      ['/loupes-for-orthodontics', 'Orthodontics'],
      ['/loupes-for-pediatric-dentistry', 'Pediatric dentistry'],
      ['/loupes-for-oral-surgery', 'Oral surgery'],
      ['/loupes-for-dental-implants', 'Dental implants'],
    ],
  },
  {
    title: 'Other clinical fields',
    links: [
      ['/veterinary-surgery-loupes', 'Veterinary surgery'],
      ['/podiatry-foot-ankle-surgery-loupes', 'Podiatry & foot and ankle surgery'],
    ],
  },
] as const

const STAGES = [
  ['/student-loupe-comparison', 'Medical & dental students'],
  ['/education/best-loupes-for-residents', 'Residents & fellows'],
  ['/surgical-loupes', 'Attending surgeons'],
  ['/dental-loupes', 'Dentists'],
  ['/loupes-for-dental-hygiene', 'Dental hygienists'],
] as const

const AUDIENCE =
  'HeliosX loupes are made for medical and dental students, residents, fellows, attending surgeons, dentists, and dental hygienists.'

export default function SpecialtySection({ variant }: { variant: 'mobile' | 'desktop' }) {
  if (variant === 'mobile') {
    return (
      <section className="px-5 pt-14" aria-labelledby="mobile-specialty-heading">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#4d5f54]">Who it&apos;s for</p>
            <h2 id="mobile-specialty-heading" className="m2-h2 m2-reveal mt-3 text-[2.1rem]">Made for your<br />specialty.</h2>
          </div>
          <CustomHairline name="tray" className="-mr-2 w-[112px] shrink-0" />
        </div>
        <p className="m2-lede mt-3">{AUDIENCE}</p>
        <ul className="m2-stagger mt-5 flex flex-wrap gap-2">
          {STAGES.map(([href, label]) => (
            <li key={label}>
              <Link href={href} className="flex min-h-10 items-center rounded-full bg-[#f7f9f7] px-3.5 text-[13px] font-bold">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-5">
          {GROUPS.map((group) => (
            <details key={group.title} className="m2-details">
              <summary>{group.title} <Plus size={18} /></summary>
              <ul className="grid grid-cols-2 gap-x-3 pb-5">
                {group.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="flex min-h-11 items-center text-[14px] leading-5 text-[#26352d] underline decoration-[rgba(8,38,27,0.2)] underline-offset-4">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="specialties" aria-labelledby="specialty-heading" className="relative px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200/80">Who it&apos;s for</p>
        <h2 id="specialty-heading" className="mt-3 max-w-2xl text-2xl font-semibold leading-tight text-white md:text-4xl">
          Made for your specialty.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400 md:text-base">{AUDIENCE}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {STAGES.map(([href, label]) => (
            <li key={label}>
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:border-emerald-300/40 hover:text-white"
              >
                {label} <ArrowUpRight size={14} />
              </Link>
            </li>
          ))}
        </ul>
        {/* items-start: opening one group must not stretch its row-mates open with it */}
        <div className="mt-8 grid items-start gap-4 md:grid-cols-3">
          {GROUPS.map((group) => (
            <details key={group.title} className="group rounded-2xl border border-white/10 bg-neutral-950/70 p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-white [&::-webkit-details-marker]:hidden">
                {group.title}
                <Plus size={18} className="text-emerald-200 transition-transform group-open:rotate-45" />
              </summary>
              <ul className="mt-4 grid gap-2">
                {group.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-neutral-300 transition hover:text-emerald-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
