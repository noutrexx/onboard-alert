import { memo, useMemo } from 'react'
import L from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import {
  Banknote,
  Clock3,
  Landmark,
  MapPin,
  MapPinned,
  Route,
  ShieldAlert,
  Tag,
} from 'lucide-react'
import SourceEmbedder from './SourceEmbedder'
import { getCategoryMeta } from '../data/categories'
import {
  cleanDescription,
  formatRelativeTime,
  getAlertTimestamp,
  getDisplayLocation,
  getSourceUrl,
} from '../utils/formatters'

const categoryIcons = {
  politics: Landmark,
  finance: Banknote,
  regional: MapPinned,
  security: ShieldAlert,
  transport: Route,
}

function AlertMarker({ alert, isSelected, onSelect }) {
  const category = getCategoryMeta(alert.category)
  const CategoryIcon = categoryIcons[alert.category] ?? Tag
  const displayLocation = getDisplayLocation(alert)
  const sourceUrl = getSourceUrl(alert)

  const markerIcon = useMemo(() => {
    return L.divIcon({
      className: 'alert-marker',
      html: `
        <button class="marker-pin ${alert.severity} ${isSelected ? 'selected' : ''}" aria-label="${alert.title}">
          <span class="marker-pulse"></span>
          <span class="marker-ring"></span>
          <span class="marker-core"><span></span></span>
        </button>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -18],
    })
  }, [alert.severity, alert.title, isSelected])

  return (
    <Marker
      icon={markerIcon}
      position={[alert.lat, alert.lng]}
      eventHandlers={{
        click: () => onSelect(alert),
      }}
    >
      <Popup className="alert-popup" minWidth={320}>
        <article className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] font-bold tracking-wide ${category.accentClass}`}
            >
              <CategoryIcon size={13} />
              {category.label}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold leading-tight text-slate-950">
              {alert.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock3 size={13} />
                {formatRelativeTime(getAlertTimestamp(alert))}
              </span>
              {displayLocation ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} />
                  {displayLocation}
                </span>
              ) : null}
            </div>
          </div>

          <p className="text-sm leading-6 text-slate-700">
            {cleanDescription(alert.description, 160)}
          </p>

          <SourceEmbedder sourceUrl={sourceUrl} />
        </article>
      </Popup>
    </Marker>
  )
}

export default memo(AlertMarker)
