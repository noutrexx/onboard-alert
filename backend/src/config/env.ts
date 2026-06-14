import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  ADMIN_PASSWORD_HASH: z.string().regex(/^scrypt\$[^$]+\$[^$]+$/),
  BOT_AUTO_PUBLISH_CONFIDENCE: z.coerce.number().min(0).max(1).default(0.82),
  BOT_INGEST_API_KEY: z.string().min(12),
  BOT_INGEST_HMAC_SECRET: z.string().min(24).optional(),
  CORS_ORIGIN: z.string().default('http://127.0.0.1:5173'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  PUBLIC_ALERT_LIMIT_MAX: z.coerce.number().int().positive().default(500),
  RATE_LIMIT_ADMIN_PER_MINUTE: z.coerce.number().int().positive().default(120),
  RATE_LIMIT_ADMIN_LOGIN_PER_MINUTE: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_BOT_PER_MINUTE: z.coerce.number().int().positive().default(30),
  RATE_LIMIT_PUBLIC_PER_MINUTE: z.coerce.number().int().positive().default(600),
})

export const env = envSchema.parse(process.env)
