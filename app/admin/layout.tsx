import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const links = [
    ['Orders', '/admin/orders'],
    ['CRM', '/admin/crm'],
    ['Products', '/admin/products'],
    ['Email Templates', '/admin/email-templates'],
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/admin" className="text-sm font-semibold uppercase tracking-[0.25em]">
            HeliosX Admin
          </Link>
          <nav className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-neutral-300">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
