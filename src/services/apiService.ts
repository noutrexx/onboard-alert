import { alerts as seedAlerts } from '../data/alerts'

type ApiRequestOptions = RequestInit & {
  admin?: boolean
}

const STORAGE_KEY = 'onboard-alert:alerts'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''
const USE_BACKEND = Boolean(API_BASE_URL)

export function isBackendEnabled() {
  return USE_BACKEND
}

export function getDataMode() {
  if (USE_BACKEND) {
    return {
      description: 'Backend bagli; admin islemleri guvenli HttpOnly oturum ile korunuyor.',
      id: 'secure-api',
      isBackendEnabled: true,
      label: 'Guvenli API',
      tone: 'cyan',
    }
  }

  return {
    description: 'Backend env tanımlı değil; demo veriler tarayıcıda LocalStorage ile saklanıyor.',
    id: 'local-demo',
    isBackendEnabled: false,
    label: 'Local Demo',
    tone: 'amber',
  }
}

const frontendToBackendSeverity = {
  critical: 'red',
  high: 'yellow',
  medium: 'green',
  red: 'red',
  yellow: 'yellow',
  green: 'green',
}

const backendToFrontendSeverity = {
  red: 'critical',
  yellow: 'high',
  green: 'medium',
}

function readAlerts() {
  const storedAlerts = window.localStorage.getItem(STORAGE_KEY)

  if (!storedAlerts) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedAlerts))
    return seedAlerts
  }

  try {
    return JSON.parse(storedAlerts)
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedAlerts))
    return seedAlerts
  }
}

function writeAlerts(alerts) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
}

function normalizeAlert(payload) {
  return {
    ...payload,
    lat: payload.lat === null || payload.lat === undefined || payload.lat === '' ? null : Number(payload.lat),
    lng: payload.lng === null || payload.lng === undefined || payload.lng === '' ? null : Number(payload.lng),
    active: payload.active ?? true,
    status: payload.status ?? 'published',
    source: payload.source ?? 'manual_admin',
    tags: Array.isArray(payload.tags)
      ? payload.tags
      : String(payload.tags ?? '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
  }
}

async function request(path: string, options: ApiRequestOptions = {}) {
  const { admin, ...requestOptions } = options
  const headers = {
    'Content-Type': 'application/json',
    ...(requestOptions.headers ?? {}),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    credentials: admin ? 'include' : requestOptions.credentials,
    headers,
  })

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    throw new Error(detail.error || `api_request_failed_${response.status}`)
  }

  if (response.status === 204) return null

  const body = await response.json()
  return body.data ?? body
}

function fromBackendAlert(alert) {
  return normalizeAlert({
    ...alert,
    category: alert.metadata?.category ?? 'regional',
    location: alert.locationText ?? '',
    severity: backendToFrontendSeverity[alert.severity] ?? alert.severity,
    sourceUrl: alert.sourceUrl ?? '',
    tags: alert.metadata?.tags ?? [],
    timestamp: alert.createdAt,
    updatedAt: alert.updatedAt,
  })
}

function toBackendAlert(payload) {
  const normalized = normalizeAlert(payload)

  if (!Number.isFinite(normalized.lat) || !Number.isFinite(normalized.lng)) {
    throw new Error('invalid_coordinates')
  }

  return {
    description: normalized.description,
    lat: normalized.lat,
    lng: normalized.lng,
    locationText: normalized.location,
    metadata: {
      category: normalized.category,
      tags: normalized.tags,
    },
    severity: frontendToBackendSeverity[normalized.severity] ?? 'green',
    sourceUrl: normalized.sourceUrl || undefined,
    title: normalized.title,
  }
}

export async function getAdminSession() {
  if (!USE_BACKEND) return { authenticated: true }
  return request('/api/admin/auth/session', { admin: true })
}

export async function loginAdmin(password: string) {
  return request('/api/admin/auth/login', {
    admin: true,
    body: JSON.stringify({ password }),
    method: 'POST',
  })
}

export async function logoutAdmin() {
  if (!USE_BACKEND) return { authenticated: false }
  return request('/api/admin/auth/logout', { admin: true, method: 'POST' })
}

export async function getAdminAlerts() {
  if (!USE_BACKEND) return readAlerts()
  const data = await request('/api/admin/alerts', { admin: true })
  return data.map(fromBackendAlert)
}

export async function getAlerts() {
  if (USE_BACKEND) {
    const data = await request('/api/alerts?limit=500')
    return data.map(fromBackendAlert)
  }

  return readAlerts()
}

export async function getPendingAlerts() {
  if (USE_BACKEND) {
    const data = await request('/api/admin/alerts/pending', { admin: true })
    return data.map(fromBackendAlert)
  }

  return readAlerts().filter((alert) => alert.status === 'pending_location')
}

export async function addAlert(payload) {
  if (USE_BACKEND) {
    const data = await request('/api/admin/alerts', {
      admin: true,
      body: JSON.stringify(toBackendAlert(payload)),
      method: 'POST',
    })
    return fromBackendAlert(data)
  }

  const alerts = readAlerts()
  const newAlert = normalizeAlert({
    ...payload,
    id: crypto.randomUUID(),
    timestamp: payload.timestamp || new Date().toISOString(),
  })
  const nextAlerts = [newAlert, ...alerts]

  writeAlerts(nextAlerts)
  return newAlert
}

export async function updateAlert(id, payload) {
  if (USE_BACKEND) {
    const data = await request(`/api/admin/alerts/${id}`, {
      admin: true,
      body: JSON.stringify(toBackendAlert(payload)),
      method: 'PATCH',
    })
    return fromBackendAlert(data)
  }

  const alerts = readAlerts()
  const updatedAlert = normalizeAlert({ ...payload, id })
  const nextAlerts = alerts.map((alert) => (alert.id === id ? updatedAlert : alert))

  writeAlerts(nextAlerts)
  return updatedAlert
}

export async function publishAlertLocation(id, payload) {
  if (USE_BACKEND) {
    const data = await request(`/api/admin/alerts/${id}/publish-location`, {
      admin: true,
      body: JSON.stringify({
        lat: Number(payload.lat),
        lng: Number(payload.lng),
        locationText: payload.location ?? payload.locationText,
      }),
      method: 'PATCH',
    })
    return fromBackendAlert(data)
  }

  const alerts = readAlerts()
  const existingAlert = alerts.find((alert) => alert.id === id)

  if (!existingAlert) throw new Error('alert_not_found')

  const nextAlert = normalizeAlert({
    ...existingAlert,
    ...payload,
    active: true,
    status: 'published',
    updatedAt: new Date().toISOString(),
  })
  const nextAlerts = alerts.map((alert) => (alert.id === id ? nextAlert : alert))

  writeAlerts(nextAlerts)
  return nextAlert
}

export async function deleteAlert(id) {
  if (USE_BACKEND) {
    await request(`/api/admin/alerts/${id}`, {
      admin: true,
      method: 'DELETE',
    })
    return { id }
  }

  const alerts = readAlerts()
  const nextAlerts = alerts.filter((alert) => alert.id !== id)

  writeAlerts(nextAlerts)
  return { id }
}

export async function resetAlerts() {
  if (USE_BACKEND) {
    throw new Error('reset_disabled_for_backend_mode')
  }

  writeAlerts(seedAlerts)
  return seedAlerts
}
