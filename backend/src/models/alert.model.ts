export type AlertSeverity = 'red' | 'yellow' | 'green'
export type AlertSource = 'manual_admin' | 'twitter_bot' | 'afad_scraper' | 'rss_feed'
export type AlertStatus = 'published' | 'draft' | 'pending_review' | 'pending_location'

export interface Alert {
  id: string
  title: string
  description: string
  lat: number | null
  lng: number | null
  severity: AlertSeverity
  source: AlertSource
  status: AlertStatus
  sourceUrl: string | null
  locationText: string | null
  confidence: number | null
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateAlertInput {
  title: string
  description: string
  lat: number | null
  lng: number | null
  severity: AlertSeverity
  source: AlertSource
  status: AlertStatus
  sourceUrl?: string | null
  locationText?: string | null
  confidence?: number | null
  metadata?: Record<string, unknown>
}
