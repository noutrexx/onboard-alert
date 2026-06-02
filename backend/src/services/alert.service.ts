import { env } from '../config/env.js'
import type { Alert, AlertStatus, CreateAlertInput } from '../models/alert.model.js'
import {
  createAlert,
  deleteAlertById,
  findPendingLocationAlerts,
  findPublishedAlerts,
  publishAlertLocation,
} from '../repositories/alert.repository.js'
import { geocodeLocationText } from './geocoding.service.js'

interface AdminCreateAlertPayload {
  title: string
  description: string
  lat: number
  lng: number
  severity: CreateAlertInput['severity']
  sourceUrl?: string
  locationText?: string
  metadata?: Record<string, unknown>
}

interface BotIngestPayload {
  title: string
  description: string
  severity: CreateAlertInput['severity']
  source: Exclude<CreateAlertInput['source'], 'manual_admin'>
  lat?: number | null
  lng?: number | null
  locationText?: string
  sourceUrl?: string
  confidence?: number
  metadata?: Record<string, unknown>
}

export async function getPublishedAlerts(): Promise<Alert[]> {
  return findPublishedAlerts()
}

export async function getPendingLocationAlerts(): Promise<Alert[]> {
  return findPendingLocationAlerts()
}

export async function createManualAdminAlert(payload: AdminCreateAlertPayload): Promise<Alert> {
  return createAlert({
    ...payload,
    confidence: 1,
    source: 'manual_admin',
    status: 'published',
  })
}

export async function ingestBotAlert(payload: BotIngestPayload): Promise<Alert> {
  const coordinates = await resolveCoordinates(payload)
  const status = coordinates.needsLocation ? 'pending_location' : resolveBotStatus(payload.confidence)

  return createAlert({
    title: payload.title,
    description: payload.description,
    lat: coordinates.lat,
    lng: coordinates.lng,
    severity: payload.severity,
    source: payload.source,
    status,
    sourceUrl: payload.sourceUrl,
    locationText: payload.locationText,
    confidence: payload.confidence ?? null,
    metadata: {
      ...(payload.metadata ?? {}),
      geocoded: coordinates.geocoded,
      geocodeMatch: coordinates.geocodeMatch,
      needsLocation: coordinates.needsLocation,
    },
  })
}

export async function approvePendingLocationAlert(
  id: string,
  coordinates: { lat: number; lng: number; locationText?: string },
): Promise<Alert> {
  const alert = await publishAlertLocation(id, coordinates)

  if (!alert) {
    throw new Error('Pending alert not found')
  }

  return alert
}

export async function rejectAlert(id: string): Promise<void> {
  const deleted = await deleteAlertById(id)

  if (!deleted) {
    throw new Error('Alert not found')
  }
}

async function resolveCoordinates(payload: BotIngestPayload) {
  if (typeof payload.lat === 'number' && typeof payload.lng === 'number') {
    return { geocoded: false, lat: payload.lat, lng: payload.lng, needsLocation: false }
  }

  if (!payload.locationText) {
    return { geocoded: false, lat: null, lng: null, needsLocation: true }
  }

  const geocode = await geocodeLocationText(payload.locationText)

  if (!geocode) {
    return { geocoded: false, lat: null, lng: null, needsLocation: true }
  }

  return {
    geocoded: true,
    geocodeMatch: geocode.matchedText,
    lat: geocode.lat,
    lng: geocode.lng,
    needsLocation: false,
  }
}

function resolveBotStatus(confidence?: number): AlertStatus {
  if (typeof confidence === 'number' && confidence >= env.BOT_AUTO_PUBLISH_CONFIDENCE) {
    return 'published'
  }

  return 'pending_review'
}
