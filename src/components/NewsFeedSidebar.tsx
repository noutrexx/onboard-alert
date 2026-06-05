import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Landmark,
  MapPin,
  MapPinned,
  Menu,
  Radio,
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
  getSeverityTone,
  getSourceUrl,
} from '../utils/formatters'

const categoryIcons = {
  politics: Landmark,
  finance: Banknote,
  regional: MapPinned,
  security: ShieldAlert,
  transport: Route,
}

const FEED_RENDER_LIMIT = 250

function NewsFeedSidebar({ alerts, dataMode, selectedAlert, onSelectAlert }) {
  const [isOpen, setIsOpen] = useState(() =>
    typeof window === 'undefined' ? true : window.innerWidth >= 768,
  )
  const [hasUnread, setHasUnread] = useState(false)
  const previousCountRef = useRef(alerts.length)
  const visibleAlerts = alerts.slice(0, FEED_RENDER_LIMIT)
  const hiddenAlertCount = Math.max(alerts.length - visibleAlerts.length, 0)
  const categoryCount = new Set(alerts.map((alert) => alert.category)).size
  const locationCount = new Set(alerts.map(getDisplayLocation).filter(Boolean)).size

  useEffect(() => {
    const previousCount = previousCountRef.current

    if (!isOpen && alerts.length > previousCount) {
      setHasUnread(true)
    }

    previousCountRef.current = alerts.length
  }, [alerts.length, isOpen])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key.toLowerCase() === 'm') {
        if (!isOpen) setHasUnread(false)
        setIsOpen(!isOpen)
      }

      if (event.key === 'Escape') {
        closePanel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  function openPanel() {
    setHasUnread(false)
    setIsOpen(true)
  }

  function closePanel() {
    setIsOpen(false)
  }

  return (
    <>
      {!isOpen ? (
        <button
          className="fixed left-3 top-4 z-[620] inline-flex items-center gap-2 border border-cyan-300/35 bg-black/70 px-3 py-3 text-sm font-bold text-cyan-100 shadow-2xl shadow-black/40 backdrop-blur-md transition hover:bg-black/80 md:top-1/2 md:-translate-y-1/2"
          onClick={openPanel}
          type="button"
        >
          <span className="relative">
            {hasUnread ? (
              <>
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-ping bg-red-400" />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 bg-red-500" />
              </>
            ) : null}
            <Menu size={18} />
          </span>
          <span className="hidden sm:inline">Haberler</span>
          <ChevronRight size={16} />
        </button>
      ) : null}

      <motion.aside
        animate={{ x: isOpen ? 0 : '-104%' }}
        className="fixed inset-y-0 left-0 z-[610] flex h-dvh w-full flex-col overflow-hidden border-r border-white/10 bg-black/70 text-white shadow-2xl shadow-black/50 backdrop-blur-md md:w-96"
        initial={false}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="border-b border-white/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                <Radio size={15} className="animate-pulse" />
                Live News Map
              </p>
              <h1 className="mt-2 text-xl font-semibold tracking-normal text-white">
                Türkiye Haber Akışı
              </h1>
            </div>
            <button
              className="border border-white/10 bg-white/[0.045] p-2 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              onClick={closePanel}
              type="button"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <StatusMetric icon={<Activity size={15} />} label="Haber" value={alerts.length} />
            <StatusMetric icon={<MapPinned size={15} />} label="Şehir" value={locationCount} />
            <StatusMetric icon={<Tag size={15} />} label="Kategori" value={categoryCount} />
          </div>

          <p className="mt-3 text-[11px] font-medium text-slate-500">
            Kısayol: M aç/kapat, Esc kapat
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 border border-white/10 bg-white/[0.045] px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Veri Modu
            </span>
            <span className="border border-amber-300/35 bg-amber-300/10 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-100">
              {dataMode.label}
            </span>
          </div>
        </header>

        <div className="news-scrollbar min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
          {hiddenAlertCount > 0 ? (
            <div className="border border-amber-300/25 bg-amber-300/10 p-3 text-xs font-semibold leading-5 text-amber-100">
              Performans koruması aktif: ilk {FEED_RENDER_LIMIT} haber gösteriliyor.
              {hiddenAlertCount} kayıt haritada cluster olarak duruyor.
            </div>
          ) : null}

          {visibleAlerts.map((alert, index) => {
            const isSelected = selectedAlert?.id === alert.id
            const category = getCategoryMeta(alert.category)
            const CategoryIcon = categoryIcons[alert.category] ?? Tag
            const displayLocation = getDisplayLocation(alert)
            const sourceUrl = getSourceUrl(alert)

            return (
              <motion.article
                animate={{ opacity: 1, y: 0 }}
                className={`group relative w-full border p-3.5 text-left transition ${
                  isSelected
                    ? 'border-cyan-300/70 bg-cyan-300/12 shadow-lg shadow-cyan-950/40'
                    : 'border-white/10 bg-white/[0.045] hover:border-cyan-200/35 hover:bg-white/[0.08]'
                }`}
                initial={{ opacity: 0, y: 12 }}
                key={alert.id}
                transition={{ delay: index * 0.04, duration: 0.28 }}
              >
                <button
                  className="absolute inset-0 z-0 cursor-pointer"
                  onClick={() => onSelectAlert(alert)}
                  type="button"
                >
                  <span className="sr-only">{alert.title}</span>
                </button>

                <span
                  className={`absolute right-3 top-3 h-2.5 w-2.5 shadow-lg ${getSeverityTone(alert.severity)}`}
                />

                <div className="relative z-10 flex items-start justify-between gap-6">
                  <span
                    className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] font-bold ${category.accentClass}`}
                  >
                    <CategoryIcon size={13} />
                    {category.label}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 pr-5 text-xs font-medium text-slate-400">
                    <Clock3 size={13} />
                    {formatRelativeTime(getAlertTimestamp(alert))}
                  </span>
                </div>

                <h2 className="relative z-10 mt-3 pr-4 text-base font-semibold leading-snug text-white">
                  {alert.title}
                </h2>

                <p className="relative z-10 mt-2 text-sm leading-6 text-slate-300">
                  {cleanDescription(alert.description, 110)}
                </p>

                <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
                  {displayLocation ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <MapPin size={13} />
                      {displayLocation}
                    </div>
                  ) : (
                    <span />
                  )}
                </div>

                <div className="relative z-20">
                  <SourceEmbedder compact sourceUrl={sourceUrl} />
                </div>
              </motion.article>
            )
          })}
        </div>
      </motion.aside>
    </>
  )
}

function StatusMetric({ icon, label, value }) {
  return (
    <div className="border border-white/10 bg-white/[0.045] px-3 py-2">
      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-white">
        {icon}
        {value}
      </div>
      <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  )
}

export default NewsFeedSidebar
