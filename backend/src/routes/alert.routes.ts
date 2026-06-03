import { Router } from 'express'
import {
  deleteAdminAlert,
  getAdminAlertsList,
  getAdminPendingAlerts,
  getAdminReviewAlerts,
  getPublicAlerts,
  patchPublishLocation,
  patchAdminAlert,
  patchReviewStatus,
  postAdminAlert,
  postBotIngest,
} from '../controllers/alert.controller.js'
import { adminApiRateLimit, botIngestRateLimit, publicApiRateLimit } from '../middleware/rateLimits.js'
import { requireAdminAuth } from '../middleware/requireAdminAuth.js'
import { requireBotApiKey } from '../middleware/requireBotApiKey.js'
import { validateRequest } from '../middleware/validateRequest.js'
import {
  adminCreateAlertSchema,
  adminUpdateAlertSchema,
  botIngestSchema,
  publicAlertsQuerySchema,
  publishLocationSchema,
  updateReviewStatusSchema,
} from '../schemas/alert.schema.js'

export const alertRouter = Router()

alertRouter.get('/alerts', publicApiRateLimit, validateRequest(publicAlertsQuerySchema), getPublicAlerts)

alertRouter.get('/admin/alerts', adminApiRateLimit, requireAdminAuth, getAdminAlertsList)

alertRouter.get('/admin/alerts/pending', adminApiRateLimit, requireAdminAuth, getAdminPendingAlerts)

alertRouter.get('/admin/alerts/review', adminApiRateLimit, requireAdminAuth, getAdminReviewAlerts)

alertRouter.post(
  '/admin/alerts',
  adminApiRateLimit,
  requireAdminAuth,
  validateRequest(adminCreateAlertSchema),
  postAdminAlert,
)

alertRouter.patch(
  '/admin/alerts/:id',
  adminApiRateLimit,
  requireAdminAuth,
  validateRequest(adminUpdateAlertSchema),
  patchAdminAlert,
)

alertRouter.patch(
  '/admin/alerts/:id/publish-location',
  adminApiRateLimit,
  requireAdminAuth,
  validateRequest(publishLocationSchema),
  patchPublishLocation,
)

alertRouter.patch(
  '/admin/alerts/:id/review-status',
  adminApiRateLimit,
  requireAdminAuth,
  validateRequest(updateReviewStatusSchema),
  patchReviewStatus,
)

alertRouter.delete('/admin/alerts/:id', adminApiRateLimit, requireAdminAuth, deleteAdminAlert)

alertRouter.post(
  '/webhooks/bot-ingest',
  botIngestRateLimit,
  requireBotApiKey,
  validateRequest(botIngestSchema),
  postBotIngest,
)
