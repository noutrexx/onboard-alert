import { Router } from 'express'
import { z } from 'zod'
import { adminLoginRateLimit } from '../middleware/rateLimits.js'
import {
  clearAdminSession,
  createAdminSession,
  verifyAdminPassword,
  verifyAdminSession,
} from '../services/adminAuth.service.js'

const loginSchema = z.object({
  password: z.string().min(1).max(256),
})

export const adminAuthRouter = Router()

adminAuthRouter.post('/login', adminLoginRateLimit, (request, response) => {
  const parsed = loginSchema.safeParse(request.body)

  if (!parsed.success || !verifyAdminPassword(parsed.data.password)) {
    return response.status(401).json({ error: 'invalid_admin_credentials' })
  }

  createAdminSession(response)
  return response.json({ data: { authenticated: true } })
})

adminAuthRouter.get('/session', (request, response) => {
  if (!verifyAdminSession(request)) {
    return response.status(401).json({ error: 'admin_session_required' })
  }

  return response.json({ data: { authenticated: true } })
})

adminAuthRouter.post('/logout', (_request, response) => {
  clearAdminSession(response)
  return response.json({ data: { authenticated: false } })
})
