import type { NextFunction, Request, Response } from 'express'
import type {
  AdminCreateAlertBody,
  AdminUpdateAlertBody,
  BotIngestBody,
  PublishLocationBody,
  PublicAlertsQuery,
  UpdateReviewStatusBody,
} from '../schemas/alert.schema.js'
import { env } from '../config/env.js'
import {
  approvePendingLocationAlert,
  createManualAdminAlert,
  getAdminAlerts,
  getPendingLocationAlerts,
  getPendingReviewAlerts,
  getPublishedAlerts,
  ingestBotAlert,
  rejectAlert,
  updateAdminAlert,
  updateReviewAlertStatus,
} from '../services/alert.service.js'

export async function getPublicAlerts(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const query = request.query as unknown as PublicAlertsQuery
    const limit = Math.min(query.limit ?? 500, env.PUBLIC_ALERT_LIMIT_MAX)
    const bbox = query.bbox
      ? (query.bbox.split(',').map(Number) as [number, number, number, number])
      : undefined
    const alerts = await getPublishedAlerts({
      bbox,
      limit,
      offset: query.offset ?? 0,
      since: query.since,
    })
    response.json({ data: alerts })
  } catch (error) {
    next(error)
  }
}

export async function getAdminPendingAlerts(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const alerts = await getPendingLocationAlerts()
    response.json({ data: alerts })
  } catch (error) {
    next(error)
  }
}

export async function getAdminAlertsList(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const alerts = await getAdminAlerts()
    response.json({ data: alerts })
  } catch (error) {
    next(error)
  }
}

export async function getAdminReviewAlerts(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const alerts = await getPendingReviewAlerts()
    response.json({ data: alerts })
  } catch (error) {
    next(error)
  }
}

export async function postAdminAlert(
  request: Request<unknown, unknown, AdminCreateAlertBody>,
  response: Response,
  next: NextFunction,
) {
  try {
    const alert = await createManualAdminAlert(request.body)
    response.status(201).json({ data: alert })
  } catch (error) {
    next(error)
  }
}

export async function patchAdminAlert(
  request: Request<{ id: string }, unknown, AdminUpdateAlertBody>,
  response: Response,
  next: NextFunction,
) {
  try {
    const alert = await updateAdminAlert(request.params.id, request.body)
    response.json({ data: alert })
  } catch (error) {
    next(error)
  }
}

export async function patchPublishLocation(
  request: Request<{ id: string }, unknown, PublishLocationBody>,
  response: Response,
  next: NextFunction,
) {
  try {
    const alert = await approvePendingLocationAlert(request.params.id, request.body)
    response.json({ data: alert })
  } catch (error) {
    next(error)
  }
}

export async function deleteAdminAlert(
  request: Request<{ id: string }>,
  response: Response,
  next: NextFunction,
) {
  try {
    await rejectAlert(request.params.id)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
}

export async function patchReviewStatus(
  request: Request<{ id: string }, unknown, UpdateReviewStatusBody>,
  response: Response,
  next: NextFunction,
) {
  try {
    const alert = await updateReviewAlertStatus(request.params.id, request.body.status)
    response.json({ data: alert })
  } catch (error) {
    next(error)
  }
}

export async function postBotIngest(
  request: Request<unknown, unknown, BotIngestBody>,
  response: Response,
  next: NextFunction,
) {
  try {
    const alert = await ingestBotAlert(request.body)
    response.status(202).json({ data: alert })
  } catch (error) {
    next(error)
  }
}
