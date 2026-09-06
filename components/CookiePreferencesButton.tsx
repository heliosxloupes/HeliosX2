'use client'

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('heliosx:open-privacy-choices'))}
      className="text-neutral-500 transition hover:text-white"
    >
      Privacy choices
    </button>
  )
}
