import { RotateCcw } from 'lucide-react'
import { useAlerts } from '../../context/useAlerts'

function AdminSettings() {
  const { resetAlerts } = useAlerts()

  return (
    <section className="max-w-3xl space-y-4">
      <div className="border border-white/10 bg-white/[0.035] p-5">
        <h3 className="text-lg font-semibold text-white">Ayarlar</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Bu alan ileride kullanıcı yetkileri, otomasyon kaynakları ve API bağlantıları için
          genişletilebilir. Şu anda manuel veri deposunu başlangıç verisine döndürür.
        </p>
        <button
          className="mt-5 inline-flex items-center gap-2 border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.08]"
          onClick={resetAlerts}
          type="button"
        >
          <RotateCcw size={16} />
          Mock Veriyi Sıfırla
        </button>
      </div>
    </section>
  )
}

export default AdminSettings
