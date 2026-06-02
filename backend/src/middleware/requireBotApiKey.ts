import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'

export function requireBotApiKey(request: Request, response: Response, next: NextFunction) {
  const apiKey = request.header('x-api-key')

  if (!apiKey || apiKey !== env.BOT_INGEST_API_KEY) {
    return response.status(401).json({ error: 'invalid_bot_api_key' })
  }

  return next()
}
