import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import AlertMarker from './AlertMarker'
import MapFocusController from './MapFocusController'
import { turkeyBounds, turkeyCenter } from '../data/alerts'
import { getMapMode } from '../data/mapModes'

function LiveMap({ alerts, mapModeId, selectedAlert, onSelectAlert }) {
  const mapMode = getMapMode(mapModeId)

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
        attribution={mapMode.attribution}
        key={mapMode.id}
        url={mapMode.url}
      />
      <ZoomControl position="bottomright" />
      <MapFocusController selectedAlert={selectedAlert} />
      <MarkerClusterGroup chunkedLoading maxClusterRadius={44} showCoverageOnHover={false}>
        {alerts.map((alert) => (
          <AlertMarker
            alert={alert}
            isSelected={selectedAlert?.id === alert.id}
            key={alert.id}
            onSelect={onSelectAlert}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}

export default LiveMap
