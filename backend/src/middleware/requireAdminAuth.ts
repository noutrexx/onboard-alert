import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function requireAdminAuth(request: Request, response: Response, next: NextFunction) {
  const header = request.header('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return response.status(401).json({ error: 'missing_admin_token' })
  }

  try {
    jwt.verify(token, env.JWT_SECRET)
    return next()
  } catch {
    return response.status(401).json({ error: 'invalid_admin_token' })
  }
}
