export type AlertSeverity = 'critical' | 'high' | 'medium' | 'red' | 'yellow' | 'green'

export type AlertCategory = 'politics' | 'finance' | 'regional' | 'security' | 'transport'

export type AlertStatus = 'published' | 'pending_location'

export interface AlertItem {
  id: string
  title: string
  description: string
  lat: number | null
  lng: number | null
  timestamp?: string
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
  severity: AlertSeverity
  category: AlertCategory
  tags?: string[]
  sourceUrl?: string
  source_url?: string
  location?: string
  locationText?: string
  location_text?: string
  city?: string
  region?: string
  status?: AlertStatus
  source?: string
  active?: boolean
  confidence?: number
  metadata?: {
    category?: AlertCategory
    tags?: string[]
  }
}

export type AlertPayload = Omit<Partial<AlertItem>, 'tags'> & {
  tags?: string[] | string
}

export interface MapMode {
  id: string
  label: string
  description: string
  url: string
  attribution: string
}

export interface CategoryMeta {
  label: string
  accentClass: string
}
