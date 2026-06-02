import { Router } from 'express'
import {
  deleteAdminAlert,
  getAdminPendingAlerts,
  getPublicAlerts,
  patchPublishLocation,
  postAdminAlert,
  postBotIngest,
} from '../controllers/alert.controller.js'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'
import { requireBotApiKey } from '../middleware/requireBotApiKey.js'
import { validateRequest } from '../middleware/validateRequest.js'
import {
  adminCreateAlertSchema,
  botIngestSchema,
  publishLocationSchema,
} from '../schemas/alert.schema.js'

export const alertRouter = Router()

alertRouter.get('/alerts', getPublicAlerts)

alertRouter.get('/admin/alerts/pending', requireAdminAuth, getAdminPendingAlerts)

alertRouter.post(
  '/admin/alerts',
  requireAdminAuth,
  validateRequest(adminCreateAlertSchema),
  postAdminAlert,
)

alertRouter.patch(
  '/admin/alerts/:id/publish-location',
  requireAdminAuth,
  validateRequest(publishLocationSchema),
  patchPublishLocation,
)

alertRouter.delete('/admin/alerts/:id', requireAdminAuth, deleteAdminAlert)

alertRouter.post(
  '/webhooks/bot-ingest',
  requireBotApiKey,
  validateRequest(botIngestSchema),
  postBotIngest,
)
