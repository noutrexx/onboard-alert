import { z } from 'zod'

export const severitySchema = z.enum(['red', 'yellow', 'green'])
export const botSourceSchema = z.enum(['twitter_bot', 'afad_scraper', 'rss_feed'])
export const reviewStatusSchema = z.enum(['published', 'pending_location', 'draft'])

const coordinateFields = {
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
}

export const adminCreateAlertSchema = z.object({
  body: z.object({
    description: z.string().min(5).max(300),
    lat: coordinateFields.lat,
    lng: coordinateFields.lng,
    locationText: z.string().max(180).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    severity: severitySchema,
    sourceUrl: z.string().url().optional(),
    title: z.string().min(3).max(220),
  }),
})

export const adminUpdateAlertSchema = z.object({
  body: adminCreateAlertSchema.shape.body.partial().extend({
    status: z.enum(['published', 'draft', 'pending_review', 'pending_location']).optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
})

export const botIngestSchema = z.object({
  body: z.object({
    confidence: z.number().min(0).max(1).optional(),
    description: z.string().min(5).max(300),
    lat: coordinateFields.lat.nullable().optional(),
    lng: coordinateFields.lng.nullable().optional(),
    locationText: z.string().min(2).max(180).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    severity: severitySchema,
    source: botSourceSchema,
    sourceUrl: z.string().url(),
    title: z.string().min(3).max(220),
  }),
})

export const publishLocationSchema = z.object({
  body: z.object({
    lat: coordinateFields.lat,
    lng: coordinateFields.lng,
    locationText: z.string().min(2).max(180).optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
})

export const publicAlertsQuerySchema = z.object({
  query: z.object({
    bbox: z
      .string()
      .regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)
      .optional(),
    limit: z.coerce.number().int().positive().max(1000).default(500),
    offset: z.coerce.number().int().min(0).default(0),
    since: z.string().datetime().optional(),
  }),
})

export const updateReviewStatusSchema = z.object({
  body: z.object({
    status: reviewStatusSchema,
  }),
  params: z.object({
    id: z.uuid(),
  }),
})

export type AdminCreateAlertBody = z.infer<typeof adminCreateAlertSchema>['body']
export type AdminUpdateAlertBody = z.infer<typeof adminUpdateAlertSchema>['body']
export type BotIngestBody = z.infer<typeof botIngestSchema>['body']
export type PublishLocationBody = z.infer<typeof publishLocationSchema>['body']
export type PublicAlertsQuery = z.infer<typeof publicAlertsQuerySchema>['query']
export type UpdateReviewStatusBody = z.infer<typeof updateReviewStatusSchema>['body']
