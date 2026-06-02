import { pool } from '../db/pool.js'
import type { Alert, CreateAlertInput } from '../models/alert.model.js'

const alertSelect = `
  id,
  title,
  description,
  lat,
  lng,
  severity,
  source,
  status,
  source_url AS "sourceUrl",
  location_text AS "locationText",
  confidence,
  metadata,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`

export async function findPublishedAlerts(): Promise<Alert[]> {
  const result = await pool.query<Alert>(
    `SELECT ${alertSelect}
     FROM alerts
     WHERE status = 'published'
       AND lat IS NOT NULL
       AND lng IS NOT NULL
     ORDER BY created_at DESC`,
  )

  return result.rows
}

export async function findPendingLocationAlerts(): Promise<Alert[]> {
  const result = await pool.query<Alert>(
    `SELECT ${alertSelect}
     FROM alerts
     WHERE status = 'pending_location'
     ORDER BY created_at DESC`,
  )

  return result.rows
}

export async function createAlert(input: CreateAlertInput): Promise<Alert> {
  const result = await pool.query<Alert>(
    `INSERT INTO alerts (
      title,
      description,
      lat,
      lng,
      severity,
      source,
      status,
      source_url,
      location_text,
      confidence,
      metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING ${alertSelect}`,
    [
      input.title,
      input.description,
      input.lat,
      input.lng,
      input.severity,
      input.source,
      input.status,
      input.sourceUrl ?? null,
      input.locationText ?? null,
      input.confidence ?? null,
      input.metadata ?? {},
    ],
  )

  return result.rows[0]
}

export async function publishAlertLocation(
  id: string,
  coordinates: { lat: number; lng: number; locationText?: string | null },
): Promise<Alert | null> {
  const result = await pool.query<Alert>(
    `UPDATE alerts
     SET lat = $2,
         lng = $3,
         location_text = COALESCE($4, location_text),
         status = 'published'
     WHERE id = $1
       AND status = 'pending_location'
     RETURNING ${alertSelect}`,
    [id, coordinates.lat, coordinates.lng, coordinates.locationText ?? null],
  )

  return result.rows[0] ?? null
}

export async function deleteAlertById(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM alerts WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}
