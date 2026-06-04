import { useContext } from 'react'
import { AlertContext } from './alertContext'

export function useAlerts() {
  const context = useContext(AlertContext)

  if (!context) {
    throw new Error('useAlerts must be used inside AlertProvider')
  }

  return context
}
