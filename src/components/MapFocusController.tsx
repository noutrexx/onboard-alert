import { useEffect } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import { turkeyBounds } from '../data/alerts'

function MapFocusController({ selectedAlert }) {
  const map = useMap()

  useEffect(() => {
    const size = map.getSize()
    // Bail out until the map has a real, measurable viewport. Running the
    // projection math against a zero-sized container produces invalid
    // coordinates and makes flyTo/fitBounds throw, tearing down the app.
    if (!size || size.x <= 0 || size.y <= 0) return

    try {
      if (!selectedAlert || selectedAlert.lat == null || selectedAlert.lng == null) {
        // No active selection → frame the whole country so every marker is visible.
        map.fitBounds(turkeyBounds, { animate: false, padding: [48, 48] })
        return
      }

      const zoom = 9
      const desiredY = window.innerWidth < 768 ? size.y * 0.24 : size.y / 2
      const targetPoint = map.project([selectedAlert.lat, selectedAlert.lng], zoom)
      const centerPoint = targetPoint
        .add(size.divideBy(2))
        .subtract(L.point(size.x / 2, desiredY))
      const centeredLatLng = map.unproject(centerPoint, zoom)

      map.flyTo(centeredLatLng, zoom, {
        animate: true,
        duration: 1.25,
      })
    } catch {
      // Never let a transient map error tear down the whole app.
    }
  }, [map, selectedAlert])

  return null
}

export default MapFocusController
