import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export default async function AdminCrmPage() {
  await requireAdmin()
  const supabase = getSupabaseServiceClient()
  const { data } = supabase
    ? await supabase.from('crm_contacts').select('*').order('created_at', { ascending: false })
    : { data: [] }
  const contacts = data ?? []

  return (
    <main>
      <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">CRM</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Deduplicated customer emails from cart capture, checkout, purchase, and measurements.
          </p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300">
          {contacts.length} contacts
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-neutral-950/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-neutral-500">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Sources</th>
                <th className="p-4">Added</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact: any) => (
                <tr key={contact.id} className="border-t border-white/10 transition hover:bg-white/[0.025]">
                  <td className="whitespace-nowrap p-4 font-medium text-neutral-100">{contact.email}</td>
                  <td className="whitespace-nowrap p-4 text-neutral-400">{contact.phone ?? 'Not provided'}</td>
                  <td className="p-4">
                    <div className="flex min-w-[180px] flex-wrap gap-1">
                      {(contact.sources ?? []).map((source: string) => (
                        <span key={source} className="rounded-full border border-white/10 px-2 py-1 text-xs text-neutral-300">
                          {source}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-4 text-neutral-500">{new Date(contact.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {!contacts.length && <p className="mt-6 text-sm text-neutral-500">No contacts captured yet.</p>}
    </main>
  )
}
