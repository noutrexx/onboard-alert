import { useMemo, useState } from 'react'
import { Activity, Crosshair, Layers, LocateFixed, Tag } from 'lucide-react'
import LiveMap from '../components/LiveMap'
import NewsFeedSidebar from '../components/NewsFeedSidebar'
import { useAlerts } from '../context/useAlerts'
import { getCategoryMeta } from '../data/categories'
import { getDisplayLocation } from '../utils/formatters'

function HomePage() {
  const { activeAlerts, isLoading } = useAlerts()
  const [selectedAlertId, setSelectedAlertId] = useState(null)
  const selectedAlert = useMemo(() => {
    return activeAlerts.find((alert) => alert.id === selectedAlertId) ?? activeAlerts[0]
  }, [activeAlerts, selectedAlertId])
  const selectedCategory = selectedAlert ? getCategoryMeta(selectedAlert.category) : null
  const selectedLocation = selectedAlert ? getDisplayLocation(selectedAlert) : ''

  if (isLoading || !selectedAlert) {
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
        onSelectAlert={(alert) => setSelectedAlertId(alert.id)}
        selectedAlert={selectedAlert}
      />

      <div className="map-vignette pointer-events-none absolute inset-0 z-[450]" />

      <NewsFeedSidebar
        alerts={activeAlerts}
        onSelectAlert={(alert) => setSelectedAlertId(alert.id)}
        selectedAlert={selectedAlert}
      />

      <section className="pointer-events-none absolute right-4 top-4 z-[510] hidden w-[310px] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl xl:block">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
          <Activity size={15} />
          Haber Masası
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white">Türkiye yayın kapsamı</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <InfoPill icon={<LocateFixed size={15} />} label="Odak" value={selectedLocation || 'Harita'} />
          <InfoPill icon={<Tag size={15} />} label="Kategori" value={selectedCategory.label} />
          <InfoPill icon={<Crosshair size={15} />} label="Yakınlık" value="Bölgesel" />
          <InfoPill icon={<Layers size={15} />} label="Katman" value="Dark Map" />
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
