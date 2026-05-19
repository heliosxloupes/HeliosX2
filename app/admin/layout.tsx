import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const links = [
    ['Overview', '/admin'],
    ['Orders', '/admin/orders'],
    ['CRM', '/admin/crm'],
    ['Products', '/admin/products'],
    ['Emails', '/admin/email-templates'],
  ]

  return (
    <div className="min-h-screen bg-[#030507] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.14),transparent_32%),linear-gradient(135deg,#020617_0%,#030507_42%,#07111f_100%)]" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030507]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
          <Link href="/admin" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-sm font-semibold text-emerald-200">
              HX
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.18em] text-white">HeliosX</span>
              <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-neutral-500">Ops console</span>
            </span>
          </Link>
          <nav className="flex flex-wrap justify-end gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs text-neutral-300">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  )
}
