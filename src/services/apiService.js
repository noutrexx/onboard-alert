import { alerts as seedAlerts } from '../data/alerts'

const STORAGE_KEY = 'onboard-alert:alerts'

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

export async function getAlerts() {
  return readAlerts()
}

export async function getPendingAlerts() {
  return readAlerts().filter((alert) => alert.status === 'pending_location')
}

export async function addAlert(payload) {
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
  const alerts = readAlerts()
  const updatedAlert = normalizeAlert({ ...payload, id })
  const nextAlerts = alerts.map((alert) => (alert.id === id ? updatedAlert : alert))

  writeAlerts(nextAlerts)
  return updatedAlert
}

export async function publishAlertLocation(id, payload) {
  const alerts = readAlerts()
  const nextAlert = normalizeAlert({
    ...alerts.find((alert) => alert.id === id),
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
  const alerts = readAlerts()
  const nextAlerts = alerts.filter((alert) => alert.id !== id)

  writeAlerts(nextAlerts)
  return { id }
}

export async function resetAlerts() {
  writeAlerts(seedAlerts)
  return seedAlerts
}
