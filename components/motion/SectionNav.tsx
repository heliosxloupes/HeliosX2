'use client'

import { useEffect, useState } from 'react'

type SectionNavProps = {
  items: { id: string; label: string }[]
  className?: string
}

// "On this page" links that highlight the section currently being read.
export default function SectionNav({ items, className }: SectionNavProps) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
    if (!targets.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label="On this page" className={className}>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? 'location' : undefined}
          className={`transition-colors duration-300 ${
            active === item.id ? '!text-white !decoration-emerald-300' : ''
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
