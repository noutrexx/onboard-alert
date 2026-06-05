import { useMemo, useState } from 'react'
import { Activity, Crosshair, DatabaseZap, Layers, LocateFixed, Radio, Tag } from 'lucide-react'
import LiveMap from '../components/LiveMap'
import MapModeControl from '../components/MapModeControl'
import NewsFeedSidebar from '../components/NewsFeedSidebar'
import { useAlerts } from '../context/useAlerts'
import { getCategoryMeta } from '../data/categories'
import { defaultMapModeId, getMapMode } from '../data/mapModes'
import { getDisplayLocation } from '../utils/formatters'

function HomePage() {
  const { activeAlerts, dataMode, error, isLoading } = useAlerts()
  const [selectedAlertId, setSelectedAlertId] = useState(null)
  const [mapModeId, setMapModeId] = useState(defaultMapModeId)
  const selectedAlert = useMemo(() => {
    return activeAlerts.find((alert) => alert.id === selectedAlertId) ?? activeAlerts[0]
  }, [activeAlerts, selectedAlertId])
  const selectedCategory = selectedAlert ? getCategoryMeta(selectedAlert.category) : null
  const selectedLocation = selectedAlert ? getDisplayLocation(selectedAlert) : ''
  const selectedMapMode = getMapMode(mapModeId)

  if (!isLoading && (error || !selectedAlert)) {
    return (
      <main className="grid h-dvh w-screen place-items-center bg-slate-950 p-6 text-center text-sm font-semibold text-slate-300">
        <div className="max-w-md border border-white/10 bg-white/[0.04] p-6">
          <h1 className="text-lg font-bold text-white">Harita verisi hazir degil</h1>
          <p className="mt-2 leading-6 text-slate-400">
            {error ? error.message : 'Yayina alinmis ve koordinati dogrulanmis haber bulunamadi.'}
          </p>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="grid h-dvh w-screen place-items-center bg-slate-950 text-sm font-semibold text-slate-300">
        Haber haritası yükleniyor...
      </main>
    )
  }

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-slate-950 text-white">
      <LiveMap
        alerts={activeAlerts}
        mapModeId={mapModeId}
        onSelectAlert={(alert) => setSelectedAlertId(alert.id)}
        selectedAlert={selectedAlert}
      />

      <div className="map-vignette pointer-events-none absolute inset-0 z-[450]" />

      <NewsFeedSidebar
        alerts={activeAlerts}
        dataMode={dataMode}
        onSelectAlert={(alert) => setSelectedAlertId(alert.id)}
        selectedAlert={selectedAlert}
      />

      <MapModeControl activeModeId={mapModeId} onModeChange={setMapModeId} />

      <section className="pointer-events-none absolute right-4 top-4 z-[510] hidden w-[310px] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl xl:block">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              <Activity size={15} />
              Haber Masası
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">Türkiye yayın kapsamı</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100">
            <Radio size={12} className="animate-pulse" />
            Aktif
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <InfoPill icon={<LocateFixed size={15} />} label="Odak" value={selectedLocation || 'Harita'} />
          <InfoPill icon={<Tag size={15} />} label="Kategori" value={selectedCategory.label} />
          <InfoPill icon={<Crosshair size={15} />} label="Yakınlık" value="Bölgesel" />
          <InfoPill icon={<Layers size={15} />} label="Katman" value={selectedMapMode.label} />
        </div>
        <div className="mt-3 border border-white/10 bg-white/[0.045] px-3 py-2">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-400">
            <DatabaseZap size={15} />
            Veri modu
          </span>
          <p className="mt-1 font-semibold text-white">{dataMode.label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">{dataMode.description}</p>
        </div>
      </section>
    </main>
  )
}

function InfoPill({ icon, label, value }) {
  return (
    <div className="border border-white/10 bg-white/[0.06] px-3 py-2">
      <span className="flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-400">
        {icon}
        {label}
      </span>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}

export default HomePage
