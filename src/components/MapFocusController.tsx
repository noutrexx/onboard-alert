import { useEffect } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import { turkeyBounds } from '../data/alerts'

function MapFocusController({ selectedAlert }) {
  const map = useMap()

  useEffect(() => {
    if (!selectedAlert || selectedAlert.lat == null || selectedAlert.lng == null) {
      // No active selection → frame the whole country so every marker is visible.
      map.fitBounds(turkeyBounds, { animate: false, padding: [48, 48] })
      return
    }

    const zoom = 9
    const size = map.getSize()
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
  }, [map, selectedAlert])

  return null
}

export default MapFocusController
