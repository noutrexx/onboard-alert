import type { NextFunction, Request, Response } from 'express'
import crypto from 'node:crypto'
import { env } from '../config/env.js'

export function requireBotApiKey(request: Request, response: Response, next: NextFunction) {
  const apiKey = request.header('x-api-key')

  if (!apiKey || apiKey !== env.BOT_INGEST_API_KEY) {
    return response.status(401).json({ error: 'invalid_bot_api_key' })
  }

  if (env.NODE_ENV === 'production' || env.BOT_INGEST_HMAC_SECRET) {
    const timestamp = request.header('x-timestamp')
    const signature = request.header('x-signature')

    if (!timestamp || !signature) {
      return response.status(401).json({ error: 'missing_bot_signature' })
    }

    const timestampMs = Number(timestamp)
    const nowMs = Date.now()

    if (!Number.isFinite(timestampMs) || Math.abs(nowMs - timestampMs) > 5 * 60 * 1000) {
      return response.status(401).json({ error: 'stale_bot_signature' })
    }

    if (!env.BOT_INGEST_HMAC_SECRET) {
      return response.status(500).json({ error: 'bot_hmac_secret_not_configured' })
    }

    const payload = JSON.stringify(request.body ?? {})
    const expectedSignature = crypto
      .createHmac('sha256', env.BOT_INGEST_HMAC_SECRET)
      .update(`${timestamp}.${payload}`)
      .digest('hex')

    const provided = Buffer.from(signature, 'hex')
    const expected = Buffer.from(expectedSignature, 'hex')

    if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
      return response.status(401).json({ error: 'invalid_bot_signature' })
    }
  }

  return next()
}
