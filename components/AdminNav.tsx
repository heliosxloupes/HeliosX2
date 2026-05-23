'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  ['Overview', '/admin'],
  ['Orders', '/admin/orders'],
  ['CRM', '/admin/crm'],
  ['Products', '/admin/products'],
  ['Emails', '/admin/email-templates'],
]

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Admin navigation"
      className="-mx-1 flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs text-neutral-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {links.map(([label, href]) => {
        const active = isActive(pathname, href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`shrink-0 rounded-full px-3 py-2 transition outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 ${
              active
                ? 'bg-white text-black shadow-sm'
                : 'hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
