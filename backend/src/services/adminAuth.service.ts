import { scryptSync, timingSafeEqual } from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { env } from '../config/env.js'

const ADMIN_COOKIE = 'onboard_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8

function readCookie(request: Request, name: string) {
  const cookies = Object.fromEntries(
    (request.header('cookie') ?? '')
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf('=')
        return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))]
      }),
  )

  return cookies[name]
}

export function verifyAdminPassword(password: string) {
  const [algorithm, salt, expectedHash] = env.ADMIN_PASSWORD_HASH.split('$')

  if (algorithm !== 'scrypt' || !salt || !expectedHash) return false

  const actual = scryptSync(password, salt, 64)
  const expected = Buffer.from(expectedHash, 'base64url')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function createAdminSession(response: Response) {
  const token = jwt.sign({ role: 'admin' }, env.JWT_SECRET, {
    expiresIn: SESSION_TTL_SECONDS,
    issuer: 'onboard-alert-api',
    subject: 'admin',
  })

  response.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: '/',
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
  })
}

export function clearAdminSession(response: Response) {
  response.clearCookie(ADMIN_COOKIE, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
  })
}

export function verifyAdminSession(request: Request) {
  const token = readCookie(request, ADMIN_COOKIE)
  if (!token) return false

  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'onboard-alert-api',
      subject: 'admin',
    })
    return typeof payload !== 'string' && payload.role === 'admin'
  } catch {
    return false
  }
}
