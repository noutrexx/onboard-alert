import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useAlerts } from '../../context/useAlerts'

function AdminSettings() {
  const { dataMode, resetAlerts } = useAlerts()
  const [statusMessage, setStatusMessage] = useState('')

  async function handleReset() {
    try {
      await resetAlerts()
      setStatusMessage('Demo veri başlangıç kayıtlarına döndürüldü.')
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Demo veri sıfırlanamadı.',
      )
    }
  }

  return (
    <section className="max-w-3xl space-y-4">
      <div className="border border-white/10 bg-white/[0.035] p-5">
        <h3 className="text-lg font-semibold text-white">Ayarlar</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Bu alan ileride kullanıcı yetkileri, otomasyon kaynakları ve API bağlantıları için
          genişletilebilir. Şu anda manuel veri deposunu başlangıç verisine döndürür.
        </p>
        <div className="mt-4 border border-cyan-300/20 bg-cyan-300/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            Çalışma Modu
          </p>
          <h4 className="mt-2 text-base font-semibold text-white">{dataMode.label}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-400">{dataMode.description}</p>
        </div>
        <button
          className="mt-5 inline-flex items-center gap-2 border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={dataMode.isBackendEnabled}
          onClick={handleReset}
          type="button"
        >
          <RotateCcw size={16} />
          Demo Veriyi Sıfırla
        </button>
        {statusMessage ? (
          <p className="mt-3 text-sm font-semibold text-slate-300">{statusMessage}</p>
        ) : null}
      </div>
    </section>
  )
}

export default AdminSettings
