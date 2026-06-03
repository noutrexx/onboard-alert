import { pool } from '../db/pool.js'
import type { Alert, AlertStatus, CreateAlertInput } from '../models/alert.model.js'

export interface PublicAlertFilters {
  bbox?: [number, number, number, number]
  limit: number
  offset: number
  since?: string
}

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

export async function findPublishedAlerts(filters: PublicAlertFilters): Promise<Alert[]> {
  const values: unknown[] = []
  const conditions = ["status = 'published'", 'lat IS NOT NULL', 'lng IS NOT NULL']

  if (filters.since) {
    values.push(filters.since)
    conditions.push(`created_at >= $${values.length}`)
  }

  if (filters.bbox) {
    const [minLng, minLat, maxLng, maxLat] = filters.bbox
    values.push(minLat, maxLat, minLng, maxLng)
    conditions.push(
      `lat BETWEEN $${values.length - 3} AND $${values.length - 2}`,
      `lng BETWEEN $${values.length - 1} AND $${values.length}`,
    )
  }

  values.push(filters.limit, filters.offset)

  const result = await pool.query<Alert>(
    `SELECT ${alertSelect}
     FROM alerts
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
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

export async function findAdminAlerts(limit = 500): Promise<Alert[]> {
  const result = await pool.query<Alert>(
    `SELECT ${alertSelect}
     FROM alerts
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit],
  )

  return result.rows
}

export async function findAlertBySourceUrl(sourceUrl: string): Promise<Alert | null> {
  const result = await pool.query<Alert>(
    `SELECT ${alertSelect}
     FROM alerts
     WHERE source_url = $1
     LIMIT 1`,
    [sourceUrl],
  )

  return result.rows[0] ?? null
}

export async function findPendingReviewAlerts(): Promise<Alert[]> {
  const result = await pool.query<Alert>(
    `SELECT ${alertSelect}
     FROM alerts
     WHERE status = 'pending_review'
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

export async function updateAlertStatusById(
  id: string,
  status: Extract<AlertStatus, 'published' | 'pending_location' | 'draft'>,
): Promise<Alert | null> {
  const result = await pool.query<Alert>(
    `UPDATE alerts
     SET status = $2
     WHERE id = $1
       AND status IN ('pending_review', 'draft', 'pending_location')
     RETURNING ${alertSelect}`,
    [id, status],
  )

  return result.rows[0] ?? null
}

export async function updateAlertById(
  id: string,
  input: Partial<CreateAlertInput>,
): Promise<Alert | null> {
  const current = await pool.query<Alert>(`SELECT ${alertSelect} FROM alerts WHERE id = $1`, [id])
  const existing = current.rows[0]

  if (!existing) return null

  const result = await pool.query<Alert>(
    `UPDATE alerts
     SET title = $2,
         description = $3,
         lat = $4,
         lng = $5,
         severity = $6,
         status = $7,
         source_url = $8,
         location_text = $9,
         metadata = $10
     WHERE id = $1
     RETURNING ${alertSelect}`,
    [
      id,
      input.title ?? existing.title,
      input.description ?? existing.description,
      input.lat ?? existing.lat,
      input.lng ?? existing.lng,
      input.severity ?? existing.severity,
      input.status ?? existing.status,
      input.sourceUrl ?? existing.sourceUrl,
      input.locationText ?? existing.locationText,
      input.metadata ?? existing.metadata,
    ],
  )

  return result.rows[0] ?? null
}
