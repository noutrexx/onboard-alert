import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { turkeyBounds } from '../../data/alerts'

function AdminMiniMap({ lat, lng, onChange }) {
  const position = useMemo<[number, number]>(
    () => [
      lat === null || lat === undefined || lat === '' ? 39.0 : Number(lat),
      lng === null || lng === undefined || lng === '' ? 35.2 : Number(lng),
    ],
    [lat, lng],
  )
  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: 'admin-location-marker',
        html: '<span></span>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    [],
  )

  return (
    <div className="h-[360px] overflow-hidden border border-slate-700 bg-slate-950">
      <MapContainer
        center={position}
        className="h-full w-full"
        maxBounds={turkeyBounds}
        maxBoundsViscosity={0.8}
        minZoom={5}
        zoom={6}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler onChange={onChange} />
        <MapSync position={position} />
        <Marker
          draggable
          eventHandlers={{
            dragend: (event) => {
              const nextPosition = event.target.getLatLng()
              onChange(nextPosition.lat, nextPosition.lng)
            },
          }}
          icon={markerIcon}
          position={position}
        />
      </MapContainer>
    </div>
  )
}

function MapClickHandler({ onChange }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng)
    },
  })

  return null
}

function MapSync({ position }) {
  const map = useMap()

  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true })
  }, [map, position])

  return null
}

export default AdminMiniMap
