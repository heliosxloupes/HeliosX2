import Image from 'next/image'

import type { M2Model } from './models'

// The studio photograph as a stage: anchored to the bottom of its container,
// its top edge faded into the photo's own wall tone so the name can sit above.
export function StagePhoto({
  model,
  scale = 1,
  priority = false,
  animate = true,
  fadeBottom = false,
  alt,
}: {
  model: M2Model
  scale?: number
  priority?: boolean
  animate?: boolean
  fadeBottom?: boolean
  alt?: string
}) {
  const mask = fadeBottom
    ? 'linear-gradient(180deg, transparent 0%, #000 30%, #000 72%, transparent 100%)'
    : 'linear-gradient(180deg, transparent 0%, #000 30%)'
  const width = `calc(${model.photo.width} * ${scale})`
  return (
    <div
      className="absolute bottom-0 left-1/2 z-0 aspect-[1800/1005]"
      style={{
        width,
        transform: `translateX(${model.photo.shift})`,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <div className={`relative h-full w-full ${animate ? 'm2-rise' : ''}`}>
        <Image
          src={model.photo.src}
          alt={alt ?? ''}
          fill
          priority={priority}
          sizes="(max-width: 767px) 150vw, 1px"
          className="object-cover"
        />
      </div>
    </div>
  )
}

// A cropped thumbnail of the same photograph, centred on the pair.
export function PhotoThumb({ model, sizes, alt = '' }: { model: M2Model; sizes: string; alt?: string }) {
  return (
    <Image
      src={model.photo.src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      style={{ objectPosition: model.photo.focus }}
    />
  )
}
