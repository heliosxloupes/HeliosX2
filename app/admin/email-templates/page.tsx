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
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Email templates</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Drip timing and transactional copy are database driven. Use {'{{measurement_url}}'}, {'{{tracking_number}}'}, and {'{{tracking_url}}'} as placeholders.
      </p>
      <div className="mt-6 space-y-4">
        {templates.map((template: any) => (
          <EmailTemplateEditor key={template.key} template={template} />
        ))}
        {!templates.length && <p className="text-neutral-400">No templates found. Run the Supabase migration first.</p>}
      </div>
    </main>
  )
}
