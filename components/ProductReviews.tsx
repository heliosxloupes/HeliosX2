'use client'

import { Marquee } from '@/components/ui/Marquee'
import type { Review } from '@/lib/reviews'

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸',
  CA: '🇨🇦',
  MX: '🇲🇽',
  ES: '🇪🇸',
  AR: '🇦🇷',
  CO: '🇨🇴',
  BR: '🇧🇷',
  PT: '🇵🇹',
  RU: '🇷🇺',
  BY: '🇧🇾',
  KZ: '🇰🇿',
  GB: '🇬🇧',
  AE: '🇦🇪',
}

const LOCATION_PATTERNS: { test: RegExp; code: string }[] = [
  { test: /Madrid|Barcelona|España/i, code: 'ES' },
  { test: /Buenos Aires|Argentina/i, code: 'AR' },
  { test: /México|Mexico/i, code: 'MX' },
  { test: /São Paulo|Rio de Janeiro|Belo Horizonte|Porto Alegre|Brasil/i, code: 'BR' },
  { test: /Lisboa|Portugal/i, code: 'PT' },
  { test: /Bogotá|Colombia/i, code: 'CO' },
  { test: /Москва|Санкт-Петербург|Новосибирск|Россия/i, code: 'RU' },
  { test: /Минск|Беларусь/i, code: 'BY' },
  { test: /Алматы|Казахстан/i, code: 'KZ' },
  { test: /London|UK|Manchester/i, code: 'GB' },
  { test: /Dubai|UAE/i, code: 'AE' },
  {
    test: /,\s*(?:ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|YT|NT|NU|Toronto|Calgary|Vancouver|Montreal|Ottawa|Edmonton)\b/i,
    code: 'CA',
  },
]

function detectCountryCode(location: string | undefined): string {
  if (!location) return 'US'
  for (const { test, code } of LOCATION_PATTERNS) {
    if (test.test(location)) return code
  }
  return 'US'
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          className={index <= rating ? 'text-emerald-300' : 'text-white/15'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const flag = COUNTRY_FLAGS[detectCountryCode(review.authorLocation)] ?? '🌐'
  return (
    <article className="w-[300px] shrink-0 rounded-2xl border border-white/10 bg-[#070b14]/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-emerald-500/25 via-sky-500/15 to-transparent text-sm font-semibold text-white">
          {initials(review.authorName)}
        </div>
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-semibold text-white">
            {review.authorName} <span className="ml-1 text-base leading-none">{flag}</span>
          </p>
          {review.authorCredential && (
            <p className="truncate text-[11px] uppercase tracking-[0.18em] text-emerald-200/70">
              {review.authorCredential}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
        <StarRow rating={review.rating} />
        {review.verified && <span className="text-emerald-200/80">Verified</span>}
      </div>
      <h4 className="mt-3 text-sm font-semibold text-white">{review.title}</h4>
      <blockquote className="mt-2 line-clamp-6 text-sm leading-6 text-neutral-300">
        {review.body}
      </blockquote>
    </article>
  )
}

type ProductReviewsProps = {
  productName: string
  reviews: Review[]
  aggregate: { ratingValue: number; reviewCount: number } | null
}

export default function ProductReviews({ productName, reviews, aggregate }: ProductReviewsProps) {
  if (reviews.length === 0 || !aggregate) return null

  const third = Math.ceil(reviews.length / 3)
  const column1 = reviews.slice(0, third)
  const column2 = reviews.slice(third, third * 2)
  const column3 = reviews.slice(third * 2)

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200/80">
              Clinician reviews
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              What surgeons and dental clinicians say about {productName}.
            </h2>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#050b16] px-5 py-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white">
                {aggregate.ratingValue.toFixed(1)}
              </span>
              <span className="text-sm text-neutral-400">/ 5</span>
            </div>
            <div className="flex flex-col">
              <StarRow rating={Math.round(aggregate.ratingValue)} />
              <span className="mt-1 text-xs text-neutral-400">
                {aggregate.reviewCount} verified reviews
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-12 flex h-[520px] items-center justify-center overflow-hidden [perspective:1000px]">
          <div
            className="flex flex-row items-center gap-4"
            style={{
              transform:
                'translateX(0px) translateY(0px) translateZ(-60px) rotateX(14deg) rotateY(-8deg) rotateZ(8deg)',
            }}
          >
            <Marquee vertical pauseOnHover repeat={3} className="[--duration:48s] h-[520px]">
              {column1.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </Marquee>
            <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:54s] h-[520px]">
              {column2.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </Marquee>
            <Marquee vertical pauseOnHover repeat={3} className="[--duration:60s] h-[520px]">
              {column3.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </Marquee>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/70 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black via-black/60 to-transparent" />
        </div>
      </div>
    </section>
  )
}
