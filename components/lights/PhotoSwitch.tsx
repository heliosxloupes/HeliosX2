import Image from 'next/image'

import { cutout } from '@/lib/lights'

// Thumbnails for a light with more than one photo. Renders nothing otherwise.
export default function PhotoSwitch({
  photos,
  active,
  onChange,
  name,
  glass = false,
  className = '',
}: {
  photos: string[]
  active: number
  onChange: (index: number) => void
  name: string
  /** Translucent tiles and cut-out photos, for glass surfaces. */
  glass?: boolean
  className?: string
}) {
  if (photos.length < 2) return null
  return (
    <div className={`z-[3] flex gap-1.5 ${className}`} role="group" aria-label={`${name} photos`}>
      {photos.map((src, index) => (
        <button
          key={src}
          type="button"
          aria-pressed={index === active}
          aria-label={`${name} photo ${index + 1}`}
          onClick={() => onChange(index)}
          className={`relative h-12 w-12 overflow-hidden rounded-xl ${glass ? 'bg-[radial-gradient(circle_at_50%_58%,rgba(236,248,242,0.32),rgba(236,248,242,0.06)_70%)] backdrop-blur-md' : 'bg-white'} transition-[box-shadow,transform] duration-200 active:scale-95 ${
            index === active
              ? glass ? 'shadow-[0_0_0_2px_rgba(255,255,255,0.85)]' : 'shadow-[0_0_0_2px_#0b1210]'
              : `opacity-70 hover:opacity-100 ${glass ? 'shadow-[0_0_0_1px_rgba(255,255,255,0.2)]' : 'shadow-[0_0_0_1px_rgba(11,18,16,0.15)]'}`
          }`}
        >
          <Image src={glass ? cutout(src) : src} alt="" fill sizes="48px" className={glass ? 'object-contain' : 'object-cover'} />
        </button>
      ))}
    </div>
  )
}
