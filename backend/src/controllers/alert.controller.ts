import type { NextFunction, Request, Response } from 'express'
import type {
  AdminCreateAlertBody,
  BotIngestBody,
  PublishLocationBody,
} from '../schemas/alert.schema.js'
import {
  approvePendingLocationAlert,
  createManualAdminAlert,
  getPendingLocationAlerts,
  getPublishedAlerts,
  ingestBotAlert,
  rejectAlert,
} from '../services/alert.service.js'

export async function getPublicAlerts(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const alerts = await getPublishedAlerts()
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
