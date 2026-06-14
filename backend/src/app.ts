import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { alertRouter } from './routes/alert.routes.js'
import { adminAuthRouter } from './routes/adminAuth.routes.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ credentials: true, origin: env.CORS_ORIGIN }))
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

  app.get('/health', (_request, response) => {
    response.json({ ok: true, service: 'onboard-alert-api' })
  })

  app.use('/api/admin/auth', adminAuthRouter)
  app.use('/api', alertRouter)
  app.use(errorHandler)

  return app
}
