import { useEffect, useMemo, useState } from 'react'
import {
  addAlert as addAlertRequest,
  deleteAlert as deleteAlertRequest,
  getAlerts,
  getDataMode,
  getPendingAlerts,
  publishAlertLocation as publishAlertLocationRequest,
  resetAlerts as resetAlertsRequest,
  updateAlert as updateAlertRequest,
} from '../services/apiService'
import { AlertContext } from './alertContext'

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAlerts()
      .then((items) => {
        setAlerts(items)
        setError(null)
      })
      .catch((requestError) => {
        setError(requestError)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const sortedAlerts = useMemo(
    () =>
      [...alerts].sort(
        (a, b) =>
          new Date(b.timestamp ?? b.createdAt ?? 0).getTime() -
          new Date(a.timestamp ?? a.createdAt ?? 0).getTime(),
      ),
    [alerts],
  )

  const activeAlerts = useMemo(
    () =>
      sortedAlerts.filter(
        (alert) =>
          alert.active !== false &&
          (alert.status === undefined || alert.status === 'published') &&
          Number.isFinite(Number(alert.lat)) &&
          Number.isFinite(Number(alert.lng)),
      ),
    [sortedAlerts],
  )

  const pendingAlerts = useMemo(
    () => sortedAlerts.filter((alert) => alert.status === 'pending_location'),
    [sortedAlerts],
  )
  const dataMode = useMemo(() => getDataMode(), [])

  async function addAlert(payload) {
    const newAlert = await addAlertRequest(payload)
    setAlerts((current) => [newAlert, ...current])
    return newAlert
  }

  async function updateAlert(id, payload) {
    const updatedAlert = await updateAlertRequest(id, payload)
    setAlerts((current) =>
      current.map((alert) => (alert.id === id ? updatedAlert : alert)),
    )
    return updatedAlert
  }

  async function deleteAlert(id) {
    await deleteAlertRequest(id)
    setAlerts((current) => current.filter((alert) => alert.id !== id))
  }

  async function refreshPendingAlerts() {
    const pending = await getPendingAlerts()
    return pending
  }

  async function publishAlertLocation(id, payload) {
    const updatedAlert = await publishAlertLocationRequest(id, payload)
    setAlerts((current) =>
      current.map((alert) => (alert.id === id ? updatedAlert : alert)),
    )
    return updatedAlert
  }

  async function resetAlerts() {
    const seed = await resetAlertsRequest()
    setAlerts(seed)
  }

  const value = {
    activeAlerts,
    addAlert,
    alerts: sortedAlerts,
    dataMode,
    deleteAlert,
    error,
    isLoading,
    pendingAlerts,
    publishAlertLocation,
    refreshPendingAlerts,
    resetAlerts,
    updateAlert,
  }

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}
