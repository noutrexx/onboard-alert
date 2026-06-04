import { useState } from 'react'
import { ExternalLink, MapPin, Trash2 } from 'lucide-react'
import ApprovalModal from '../../components/admin/ApprovalModal'
import { useAlerts } from '../../context/useAlerts'
import {
  cleanDescription,
  formatRelativeTime,
  getAlertTimestamp,
  getSourceHost,
  getSourceUrl,
} from '../../utils/formatters'

function AdminPendingAlerts() {
  const { deleteAlert, pendingAlerts, publishAlertLocation } = useAlerts()
  const [selectedAlert, setSelectedAlert] = useState(null)

  async function approveAlert(id, payload) {
    await publishAlertLocation(id, payload)
    setSelectedAlert(null)
  }

  async function rejectAlert(id) {
    await deleteAlert(id)
    setSelectedAlert(null)
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Konum Bekleyenler</h3>
        <p className="mt-1 text-sm text-slate-400">
          Botlardan gelen ancak koordinatı kesinleşmeyen haberleri konum atayarak yayınla.
        </p>
      </div>

      {pendingAlerts.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.035] p-6 text-sm font-semibold text-slate-300">
          Bekleyen konum kaydı yok.
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {pendingAlerts.map((alert) => {
            const sourceUrl = getSourceUrl(alert)

            return (
              <article
                className="border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan-300/45 hover:bg-white/[0.06]"
                key={alert.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                      Konum Bekliyor
                    </p>
                    <h4 className="mt-2 text-base font-semibold leading-snug text-white">
                      {alert.title}
                    </h4>
                  </div>
                  <span className="shrink-0 border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-semibold text-slate-300">
                    {alert.source || 'bot'}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {cleanDescription(alert.description, 170)}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
                  <span>{formatRelativeTime(getAlertTimestamp(alert))}</span>
                  {sourceUrl ? (
                    <a
                      className="inline-flex items-center gap-1 text-cyan-200 hover:text-cyan-100"
                      href={sourceUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {getSourceHost(sourceUrl) || 'kaynak'}
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    className="inline-flex flex-1 items-center justify-center gap-2 border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/16"
                    onClick={() => setSelectedAlert(alert)}
                    type="button"
                  >
                    <MapPin size={16} />
                    Konum Ata
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 border border-red-300/35 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-100 hover:bg-red-500/16"
                    onClick={() => rejectAlert(alert.id)}
                    type="button"
                  >
                    <Trash2 size={16} />
                    Sil
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {selectedAlert ? (
        <ApprovalModal
          alert={selectedAlert}
          onApprove={approveAlert}
          onClose={() => setSelectedAlert(null)}
          onReject={rejectAlert}
        />
      ) : null}
    </section>
  )
}

export default AdminPendingAlerts
