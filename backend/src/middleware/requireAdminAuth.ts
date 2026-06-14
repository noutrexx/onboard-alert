import type { NextFunction, Request, Response } from 'express'
import { verifyAdminSession } from '../services/adminAuth.service.js'

export function requireAdminAuth(request: Request, response: Response, next: NextFunction) {
  if (!verifyAdminSession(request)) {
    return response.status(401).json({ error: 'admin_session_required' })
  }

  return next()
}
