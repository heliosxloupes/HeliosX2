import { createHmac, timingSafeEqual } from 'crypto'

const TOKEN_VERSION = 1
export const CART_RECOVERY_TTL_MS = 14 * 24 * 60 * 60 * 1000

type RecoveryPayload = { v: number; sid: string; exp: number }

export type VerifiedCartRecoveryToken = {
  cartSessionId: string
  expiresAt: number
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function recoverySecret(override?: string) {
  // A dedicated key is preferred. The existing server-only admin signing key
  // keeps recovery operational during rollout on deployments that have not
  // added the dedicated variable yet.
  const secret = override ?? process.env.CART_RECOVERY_SECRET ?? process.env.ADMIN_STATIC_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('CART_RECOVERY_SECRET must contain at least 32 characters')
  }
  return secret
}

function signature(value: string, secret: string) {
  return createHmac('sha256', secret)
    .update(`heliosx-cart-recovery:v${TOKEN_VERSION}:${value}`)
    .digest('base64url')
}

export function createCartRecoveryToken(
  cartSessionId: string,
  options: { now?: number; ttlMs?: number; secret?: string } = {},
) {
  if (!uuidPattern.test(cartSessionId)) throw new Error('Invalid cart session ID')
  const now = options.now ?? Date.now()
  const payload: RecoveryPayload = {
    v: TOKEN_VERSION,
    sid: cartSessionId,
    exp: now + (options.ttlMs ?? CART_RECOVERY_TTL_MS),
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${signature(encoded, recoverySecret(options.secret))}`
}

export function verifyCartRecoveryToken(
  token: string,
  options: { now?: number; secret?: string } = {},
): VerifiedCartRecoveryToken | null {
  const [encoded, suppliedSignature, extra] = token.split('.')
  if (!encoded || !suppliedSignature || extra) return null

  const expectedSignature = signature(encoded, recoverySecret(options.secret))
  const supplied = Buffer.from(suppliedSignature)
  const expected = Buffer.from(expectedSignature)
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as RecoveryPayload
    if (
      payload.v !== TOKEN_VERSION ||
      !uuidPattern.test(payload.sid) ||
      !Number.isFinite(payload.exp) ||
      payload.exp <= (options.now ?? Date.now())
    ) return null
    return { cartSessionId: payload.sid, expiresAt: payload.exp }
  } catch {
    return null
  }
}
