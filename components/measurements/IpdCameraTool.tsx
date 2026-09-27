'use client'

import { useEffect, useRef, useState } from 'react'

import { calculateIpd, CARD_WIDTH_MM, type ImagePoint, type IpdMarks, summarizeIpdReadings } from '@/lib/ipd-measurement'

type MarkName = keyof IpdMarks

const markOrder: { key: MarkName; label: string }[] = [
  { key: 'leftPupil', label: 'Pupil on left of photo' },
  { key: 'rightPupil', label: 'Pupil on right of photo' },
  { key: 'cardLeft', label: 'Left end of card top edge' },
  { key: 'cardRight', label: 'Right end of card top edge' },
]

export default function IpdCameraTool({ onAccept }: { onAccept?: (value: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [image, setImage] = useState('')
  const [imageWidth, setImageWidth] = useState(0)
  const [marks, setMarks] = useState<Partial<IpdMarks>>({})
  const [activeMark, setActiveMark] = useState<MarkName>('leftPupil')
  const [readings, setReadings] = useState<number[]>([])
  const [message, setMessage] = useState('')
  const [zoom, setZoom] = useState(1)

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOpen(false)
  }

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), [])

  const openCamera = async () => {
    setCameraError('')
    setMessage('')
    if (!navigator.mediaDevices?.getUserMedia) {
      fileRef.current?.click()
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      streamRef.current = stream
      setCameraOpen(true)
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
    } catch {
      setCameraError('Camera access failed. Allow camera permission, or take a photo with your phone camera.')
    }
  }

  const useImage = (src: string, width: number) => {
    stopCamera()
    setImage(src)
    setImageWidth(width)
    setMarks({})
    setActiveMark('leftPupil')
    setZoom(1)
    setMessage('Tap each pupil center, then the two ends of the card’s top edge.')
  }

  const capture = () => {
    const video = videoRef.current
    if (!video?.videoWidth || !video.videoHeight) return
    const canvas = document.createElement('canvas')
    const scale = Math.min(1, 1920 / video.videoWidth)
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
    useImage(canvas.toDataURL('image/jpeg', 0.94), canvas.width)
  }

  const loadFile = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setCameraError('Please select a photo.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const src = String(reader.result)
      const probe = new Image()
      probe.onload = () => useImage(src, probe.naturalWidth)
      probe.src = src
    }
    reader.readAsDataURL(file)
  }

  const mark = (event: React.PointerEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const point: ImagePoint = {
      x: ((event.clientX - rect.left) / rect.width) * imageWidth,
      y: ((event.clientY - rect.top) / rect.height) * event.currentTarget.naturalHeight,
    }
    if (point.x < 0 || point.x > imageWidth || point.y < 0 || point.y > event.currentTarget.naturalHeight) return
    const nextMarks = { ...marks, [activeMark]: point }
    setMarks(nextMarks)
    const next = markOrder.find(({ key }) => !nextMarks[key])
    if (next) setActiveMark(next.key)
    setMessage('')
  }

  const complete = markOrder.every(({ key }) => marks[key])
  const current = complete ? calculateIpd(marks as IpdMarks, imageWidth) : null
  const summary = summarizeIpdReadings(readings)

  const saveReading = () => {
    if (current?.value == null) {
      setMessage(current?.error ?? 'Mark all four points first.')
      return
    }
    setReadings((previous) => [...previous, current.value!].slice(0, 3))
    setImage('')
    setMarks({})
    setMessage('Take a fresh photo for the next reading. Do not reuse the same image.')
  }

  return (
    <div className="space-y-6" id="ipd-camera-tool">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Camera measurement</p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">Measure your pupil distance</h2>
        <p className="max-w-2xl text-sm leading-6 text-neutral-300">
          Hold a standard bank-size card ({CARD_WIDTH_MM.toFixed(2)} mm wide), blank side out, just below your eyes. Keep it flat against your face, your head level, and your camera at eye height. Remove glasses and face the camera straight on.
        </p>
      </div>

      {readings.length > 0 && (
        <div className="border-y border-white/10 py-4 text-sm text-neutral-300" aria-live="polite">
          Readings: {readings.map((value) => `${value.toFixed(1)} mm`).join(' · ')} ({readings.length}/3)
        </div>
      )}

      {summary.value != null ? (
        <div className="border-l-2 border-emerald-400 pl-5" aria-live="polite">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Three-reading average</p>
          <p className="mt-1 text-5xl font-semibold text-white">{summary.value.toFixed(1)} <span className="text-xl text-neutral-400">mm</span></p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-300">This is a camera estimate. We review fit details before production; an optician-measured PD remains the best check if you have one.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {onAccept && <button type="button" onClick={() => onAccept(summary.value!)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200">Use this PD on my order</button>}
            <button type="button" onClick={() => { setReadings([]); setMessage('') }} className="rounded-full border border-white/20 px-5 py-3 text-sm text-white hover:border-white/50">Measure again</button>
          </div>
        </div>
      ) : summary.error ? (
        <div className="space-y-3" role="alert">
          <p className="text-sm text-amber-200">{summary.error}</p>
          <button type="button" onClick={() => { setReadings([]); setMessage('Retake three fresh photos.') }} className="rounded-full border border-white/20 px-5 py-3 text-sm text-white">Start three new readings</button>
        </div>
      ) : (
        <>
          {!image && !cameraOpen && (
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={openCamera} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200">Open camera</button>
              <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-white/20 px-5 py-3 text-sm text-white hover:border-white/50">Use a photo</button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="user" className="sr-only" aria-label="Choose face and calibration card photo" onChange={(event) => { loadFile(event.target.files?.[0]); event.target.value = '' }} />
          {cameraOpen && (
            <div className="space-y-4">
              <video ref={videoRef} autoPlay playsInline muted aria-label="Live camera preview" className="max-h-[70vh] w-full rounded-2xl bg-neutral-900 object-contain" />
              <div className="flex gap-3">
                <button type="button" onClick={capture} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Take photo</button>
                <button type="button" onClick={stopCamera} className="rounded-full border border-white/20 px-5 py-3 text-sm">Cancel</button>
              </div>
            </div>
          )}
          {image && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-300">Select: <strong className="text-white">{markOrder.find(({ key }) => key === activeMark)?.label}</strong>. Tap a label below to refine any point.</p>
              <div className="max-h-[70vh] overflow-auto rounded-2xl border border-white/15 bg-neutral-900">
                <div className="relative inline-block min-w-full align-top" style={{ width: `${zoom * 100}%` }}>
                  {/* The image never leaves this browser; markers are in source-image coordinates. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={imageRef} src={image} alt="Captured face with card for pupil distance measurement" onPointerDown={mark} className="block w-full cursor-crosshair touch-manipulation select-none" draggable={false} />
                  {markOrder.map(({ key }, index) => marks[key] && (
                    <span key={key} className="pointer-events-none absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[11px] font-bold text-black shadow-[0_0_0_2px_#000]" style={{ left: `${(marks[key]!.x / imageWidth) * 100}%`, top: `${(marks[key]!.y / (imageRef.current?.naturalHeight || 1)) * 100}%` }}>{index + 1}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {markOrder.map(({ key, label }, index) => <button type="button" key={key} onClick={() => setActiveMark(key)} className={`rounded-full border px-3 py-2 text-xs ${activeMark === key ? 'border-emerald-300 text-emerald-200' : 'border-white/20 text-neutral-300'}`}>{index + 1}. {label}</button>)}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.5))} className="rounded-full border border-white/20 px-3 py-2" aria-label="Zoom out">−</button>
                <span>Zoom {zoom.toFixed(1)}×</span>
                <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.5))} className="rounded-full border border-white/20 px-3 py-2" aria-label="Zoom in">+</button>
              </div>
              {current?.value != null && <p className="text-lg text-white" aria-live="polite">This photo: <strong>{current.value.toFixed(1)} mm</strong></p>}
              {current?.error && <p className="text-sm text-amber-200" role="alert">{current.error}</p>}
              <div className="flex flex-wrap gap-3">
                <button type="button" disabled={!current?.value} onClick={saveReading} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40">Save reading</button>
                <button type="button" onClick={() => { setImage(''); setMarks({}); setMessage('') }} className="rounded-full border border-white/20 px-5 py-3 text-sm text-white">Retake photo</button>
              </div>
            </div>
          )}
        </>
      )}
      {(message || cameraError) && <p role="status" className="text-sm leading-6 text-neutral-300">{cameraError || message}</p>}
      <p className="border-t border-white/10 pt-4 text-xs leading-5 text-neutral-500">Your photo is processed on your device and is not submitted with your measurement. Camera access works on HTTPS or localhost.</p>
    </div>
  )
}
