'use client'

import { useEffect, useRef, useState } from 'react'

type SectionRailProps = {
  items: { id: string; label: string }[]
  /** Section numbers carry no information on reading pages; off there. */
  numbered?: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

// Left-gutter reading rail for long pages: numbered sections, the current one
// highlighted, and a line that fills as the reader moves through them.
// Matches the step rail on /measurements. Only shown where the gutter is wide
// enough (2xl); smaller screens keep the inline "On this page" links.
export default function SectionRail({ items, numbered = true }: SectionRailProps) {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    // Looked up on every pass: some templates mount their sections after this
    // component, so a one-time lookup can come back empty.
    const update = () => {
      frame = 0
      const targets = items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null)
      if (targets.length < 2) return
      const marker = window.innerHeight * 0.4
      const first = targets[0].getBoundingClientRect()
      const last = targets[targets.length - 1].getBoundingClientRect()
      const start = first.top - marker
      const end = last.bottom - marker
      const progress = Math.min(1, Math.max(0, -start / Math.max(1, end - start)))
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`
      setVisible(first.top < window.innerHeight * 0.9 && last.bottom > window.innerHeight * 0.2)

      let current = 0
      targets.forEach((el, index) => {
        if (el.getBoundingClientRect().top <= marker) current = index
      })
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  if (items.length < 2) return null

  return (
    <nav
      aria-label="Sections"
      className={`fixed left-8 top-32 z-30 hidden w-[min(230px,calc((100vw_-_1160px)/2_-_56px))] transition-opacity duration-300 2xl:block ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="flex gap-5">
        <div className="relative w-px shrink-0 bg-white/10">
          <div
            ref={fillRef}
            className="absolute inset-0 origin-top bg-gradient-to-b from-white via-sky-200 to-emerald-300 transition-transform duration-150 ease-out motion-reduce:transition-none"
            style={{ transform: 'scaleY(0)' }}
          />
        </div>
        <ol className="space-y-4 py-1">
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === index ? 'location' : undefined}
                className={`block text-sm leading-5 transition-colors duration-300 ${
                  active === index ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {numbered ? (
                  <span
                    className={`mr-2 font-semibold tabular-nums transition-colors duration-300 ${
                      active === index ? 'text-emerald-300' : ''
                    }`}
                  >
                    {pad(index + 1)}
                  </span>
                ) : null}
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
