import { createHmac, randomUUID, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

import { getAdminSeedEmails } from './admin-emails'

const STATIC_ADMIN_COOKIE = 'heliosx_admin_static'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

type StaticAdminSession = {
  email: string
  exp: number
}

function getSigningSecret() {
  return process.env.ADMIN_STATIC_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
}

function sign(value: string) {
  const secret = getSigningSecret()
  if (!secret) return ''
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function createStaticAdminCookie(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS
  const payload = Buffer.from(JSON.stringify({ email: normalizedEmail, exp } satisfies StaticAdminSession)).toString('base64url')
  const signature = sign(payload)

  if (!signature) return false

  cookies().set(STATIC_ADMIN_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  return true
}

export function clearStaticAdminCookie() {
  cookies().delete(STATIC_ADMIN_COOKIE)
}

export function getStaticAdminFromCookie() {
  const value = cookies().get(STATIC_ADMIN_COOKIE)?.value
  if (!value) return null

  const [payload, signature] = value.split('.')
  if (!payload || !signature) return null

  const expectedSignature = sign(payload)
  if (!expectedSignature || !safeEqual(signature, expectedSignature)) return null

  let session: StaticAdminSession
  try {
    session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as StaticAdminSession
  } catch {
    return null
  }

  const email = session.email?.trim().toLowerCase()
  if (!email || !getAdminSeedEmails().includes(email)) return null
  if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null

  return {
    id: `static-${randomUUID()}`,
    email,
    role: 'admin' as const,
  }
}
