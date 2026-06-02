import { useState } from 'react'
import { CheckCircle2, Trash2, X } from 'lucide-react'
import AdminMiniMap from './AdminMiniMap'
import SourceEmbedder from '../SourceEmbedder'
import {
  cleanDescription,
  formatRelativeTime,
  getAlertTimestamp,
  getSourceUrl,
} from '../../utils/formatters'

function ApprovalModal({ alert, onApprove, onClose, onReject }) {
  const [location, setLocation] = useState({
    lat: alert.lat ?? 39.0,
    lng: alert.lng ?? 35.2,
  })
  const [locationText, setLocationText] = useState(alert.location || alert.locationText || '')

  if (!alert) return null

  function updateLocation(lat, lng) {
    setLocation({
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
    })
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/78 p-3 backdrop-blur-sm">
      <div className="mx-auto grid h-full max-w-6xl grid-rows-[auto_1fr_auto] overflow-hidden border border-white/10 bg-slate-950 text-white shadow-2xl shadow-black/50">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Konum Onayı
            </p>
            <h2 className="mt-2 text-xl font-semibold">{alert.title}</h2>
          </div>
          <button
            className="border border-white/10 bg-white/[0.04] p-2 text-slate-300 hover:bg-white/[0.08]"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <section className="grid min-h-0 gap-4 overflow-y-auto p-4 lg:grid-cols-[minmax(0,1fr)_420px]">
          <article className="min-h-0 border border-white/10 bg-white/[0.035] p-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
              <span>{alert.source || 'bot'}</span>
              <span>{formatRelativeTime(getAlertTimestamp(alert))}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {cleanDescription(alert.description, 220)}
            </p>
            <SourceEmbedder sourceUrl={getSourceUrl(alert)} />
          </article>

          <aside className="space-y-3 border border-white/10 bg-white/[0.035] p-4">
            <div>
              <h3 className="text-lg font-semibold">Haritadan konum seç</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Haritaya tıkla veya pini sürükle. Seçilen koordinatlar yayın
                aşamasında kayda yazılır.
              </p>
            </div>
            <AdminMiniMap lat={location.lat} lng={location.lng} onChange={updateLocation} />
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              Görünen lokasyon adı
              <input
                className="admin-input"
                onChange={(event) => setLocationText(event.target.value)}
                placeholder="Örn. Ankara"
                value={locationText}
              />
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
              <div className="border border-white/10 bg-white/[0.04] px-3 py-2">
                LAT: {Number(location.lat).toFixed(6)}
              </div>
              <div className="border border-white/10 bg-white/[0.04] px-3 py-2">
                LNG: {Number(location.lng).toFixed(6)}
              </div>
            </div>
          </aside>
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/10 p-4 sm:flex-row sm:justify-end">
          <button
            className="inline-flex items-center justify-center gap-2 border border-red-300/35 bg-red-500/12 px-5 py-3 text-sm font-bold text-red-100 hover:bg-red-500/18"
            onClick={() => onReject(alert.id)}
            type="button"
          >
            <Trash2 size={17} />
            Çöpe At / Sil
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 border border-emerald-300/45 bg-emerald-400/14 px-5 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-400/20"
            onClick={() =>
              onApprove(alert.id, {
                lat: location.lat,
                lng: location.lng,
                location: locationText,
                locationText,
              })
            }
            type="button"
          >
            <CheckCircle2 size={17} />
            Konumu Onayla ve Yayınla
          </button>
        </footer>
      </div>
    </div>
  )
}

export default ApprovalModal
