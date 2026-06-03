import rateLimit from 'express-rate-limit'
import { env } from '../config/env.js'

function standardLimit(max: number, message: string) {
  return rateLimit({
    legacyHeaders: false,
    max,
    message: { error: message },
    standardHeaders: true,
    windowMs: 60 * 1000,
  })
}

export const publicApiRateLimit = standardLimit(
  env.RATE_LIMIT_PUBLIC_PER_MINUTE,
  'public_rate_limit_exceeded',
)

export const adminApiRateLimit = standardLimit(
  env.RATE_LIMIT_ADMIN_PER_MINUTE,
  'admin_rate_limit_exceeded',
)

export const botIngestRateLimit = standardLimit(
  env.RATE_LIMIT_BOT_PER_MINUTE,
  'bot_rate_limit_exceeded',
)
