import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  BOT_AUTO_PUBLISH_CONFIDENCE: z.coerce.number().min(0).max(1).default(0.82),
  BOT_INGEST_API_KEY: z.string().min(12),
  CORS_ORIGIN: z.string().default('http://127.0.0.1:5173'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
})

export const env = envSchema.parse(process.env)
