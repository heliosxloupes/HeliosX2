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
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">CRM</h1>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-950 text-xs uppercase tracking-[0.18em] text-neutral-500">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Sources</th>
              <th className="p-4">Added</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact: any) => (
              <tr key={contact.id} className="border-t border-white/10">
                <td className="p-4">{contact.email}</td>
                <td className="p-4 text-neutral-400">{contact.phone ?? '-'}</td>
                <td className="p-4 text-neutral-400">{(contact.sources ?? []).join(', ')}</td>
                <td className="p-4 text-neutral-500">{new Date(contact.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
