import EmailTemplateEditor from '@/components/EmailTemplateEditor'
import { requireAdmin } from '@/lib/admin-auth'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export default async function AdminEmailTemplatesPage() {
  await requireAdmin()
  const supabase = getSupabaseServiceClient()
  const { data } = supabase
    ? await supabase.from('email_templates').select('*').order('key', { ascending: true })
    : { data: [] }
  const templates = data ?? []

  return (
    <main className="max-w-5xl">
      <div className="border-b border-white/10 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Messaging</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Email templates</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">
          Drip timing and transactional copy are database driven. Use {'{{measurement_url}}'}, {'{{pdcheck_ios_url}}'}, {'{{tracking_number}}'}, and {'{{tracking_url}}'} as placeholders.
        </p>
      </div>
      <div className="mt-6 space-y-4">
        {templates.map((template: any) => (
          <EmailTemplateEditor key={template.key} template={template} />
        ))}
        {!templates.length && <p className="text-neutral-400">No templates found. Run the Supabase migration first.</p>}
      </div>
    </main>
  )
}
