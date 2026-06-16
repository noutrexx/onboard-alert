import { Link } from 'react-router-dom'
import { Edit3, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useAlerts } from '../../context/useAlerts'
import { getCategoryMeta } from '../../data/categories'
import { formatAlertTime, severityLabel } from '../../utils/formatters'

function AdminNewsList() {
  const { alerts, deleteAlert, resetAlerts } = useAlerts()

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Haber Listesi</h3>
          <p className="mt-1 text-sm text-slate-400">
            Tüm manuel haber kayıtlarını buradan yönetebilirsin.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
            onClick={resetAlerts}
            type="button"
          >
            <RotateCcw size={16} />
            Sıfırla
          </button>
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/16"
            to="/admin/new"
          >
            <Plus size={16} />
            Yeni Haber
          </Link>
        </div>
      </div>

      <div className="overflow-hidden overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035]">
        <table className="w-full min-w-[820px] divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="w-[42%] px-4 py-3">Başlık</th>
              <th className="whitespace-nowrap px-4 py-3">Tarih</th>
              <th className="whitespace-nowrap px-4 py-3">Şiddet</th>
              <th className="whitespace-nowrap px-4 py-3">Kategori</th>
              <th className="whitespace-nowrap px-4 py-3">Durum</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {alerts.map((alert) => {
              const category = getCategoryMeta(alert.category)

              return (
                <tr className="text-slate-200" key={alert.id}>
                  <td className="px-4 py-4 align-top">
                    <p className="line-clamp-2 font-semibold text-white">{alert.title}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">{alert.location}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 align-top text-slate-300">{formatAlertTime(alert.timestamp)}</td>
                  <td className="whitespace-nowrap px-4 py-4 align-top">{severityLabel(alert.severity)}</td>
                  <td className="whitespace-nowrap px-4 py-4 align-top">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${category.accentClass}`}>
                      {category.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 align-top">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        alert.active === false
                          ? 'border-slate-500/40 bg-slate-500/10 text-slate-300'
                          : 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100'
                      }`}
                    >
                      {alert.active === false ? 'Pasif' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex justify-end gap-2">
                      <Link
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] px-2.5 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08]"
                        to={`/admin/edit/${alert.id}`}
                      >
                        <Edit3 size={14} />
                        Düzenle
                      </Link>
                      <button
                        className="inline-flex items-center gap-1 rounded-lg border border-red-300/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-100 transition hover:bg-red-500/16"
                        onClick={() => deleteAlert(alert.id)}
                        type="button"
                      >
                        <Trash2 size={14} />
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminNewsList
