'use client'

import { useState } from 'react'

export default function EmailTemplateEditor({ template }: { template: any }) {
  const [subject, setSubject] = useState(template.subject ?? '')
  const [body, setBody] = useState(template.body ?? '')
  const [delayDays, setDelayDays] = useState(String(template.delay_days ?? 0))
  const [message, setMessage] = useState('')

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('Saving...')
    const response = await fetch(`/api/admin/email-templates/${template.key}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body, delayDays: Number(delayDays) }),
    })
    setMessage(response.ok ? 'Saved.' : 'Save failed.')
  }

  return (
    <form onSubmit={save} className="rounded-2xl border border-white/10 bg-neutral-950/80 p-5 transition hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{template.name}</h2>
          <p className="text-xs text-neutral-500">{template.key}</p>
        </div>
        <label className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs text-neutral-400">
          Delay
          <input
            type="number"
            min={0}
            value={delayDays}
            onChange={(event) => setDelayDays(event.target.value)}
            className="w-12 bg-transparent text-right text-neutral-100 outline-none"
            aria-label="Delay days"
          />
          days
        </label>
      </div>
      <input
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        className="mt-4 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm outline-none transition focus:border-emerald-300/50"
        placeholder="Subject"
      />
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={5}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-300/50"
        placeholder="Email body"
      />
      <button className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
        Save
      </button>
      {message && <span className="ml-3 text-xs text-neutral-400">{message}</span>}
    </form>
  )
}
