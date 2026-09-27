export type ImagePoint = { x: number; y: number }

export type IpdMarks = {
  leftPupil: ImagePoint
  rightPupil: ImagePoint
  cardLeft: ImagePoint
  cardRight: ImagePoint
}

// ISO/IEC 7810 ID-1 card width. Only a physical card supplies image scale.
export const CARD_WIDTH_MM = 85.6

function distance(a: ImagePoint, b: ImagePoint) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function calculateIpd(marks: IpdMarks, imageWidth: number) {
  const pupilsPx = distance(marks.leftPupil, marks.rightPupil)
  const cardPx = distance(marks.cardLeft, marks.cardRight)
  if (!Number.isFinite(imageWidth) || imageWidth <= 0 || cardPx < 160 || pupilsPx < 80) {
    return { value: null, error: 'Move closer or retake in better light so the eyes and full card are sharp.' }
  }

  const cardTilt = Math.abs(marks.cardLeft.y - marks.cardRight.y) / cardPx
  const eyeTilt = Math.abs(marks.leftPupil.y - marks.rightPupil.y) / pupilsPx
  if (cardTilt > 0.14 || eyeTilt > 0.14) {
    return { value: null, error: 'Keep your head and the card level, then take another photo.' }
  }

  const value = (pupilsPx / cardPx) * CARD_WIDTH_MM
  if (value < 45 || value > 80) {
    return { value: null, error: 'The result is outside the usual adult range. Check all four marks and try again.' }
  }
  return { value: Math.round(value * 10) / 10, error: null }
}

export function summarizeIpdReadings(readings: number[]) {
  if (readings.length < 3) return { value: null, error: null }
  const spread = Math.max(...readings) - Math.min(...readings)
  if (spread > 1.5) {
    return { value: null, error: 'Your readings differ by more than 1.5 mm. Retake with the camera square to your face or use an optician-measured PD.' }
  }
  return {
    value: Math.round((readings.reduce((sum, reading) => sum + reading, 0) / readings.length) * 10) / 10,
    error: null,
  }
}
