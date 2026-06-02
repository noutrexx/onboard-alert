import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import AlertMarker from './AlertMarker'
import MapFocusController from './MapFocusController'
import { turkeyBounds, turkeyCenter } from '../data/alerts'

function LiveMap({ alerts, selectedAlert, onSelectAlert }) {
  return (
    <MapContainer
      center={turkeyCenter}
      zoom={6}
      minZoom={5}
      maxZoom={13}
      maxBounds={turkeyBounds}
      maxBoundsViscosity={0.8}
      zoomControl={false}
      className="h-full w-full bg-slate-950"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="bottomright" />
      <MapFocusController selectedAlert={selectedAlert} />
      {alerts.map((alert) => (
        <AlertMarker
          alert={alert}
          isSelected={selectedAlert?.id === alert.id}
          key={alert.id}
          onSelect={onSelectAlert}
        />
      ))}
    </MapContainer>
  )
}

export default LiveMap
