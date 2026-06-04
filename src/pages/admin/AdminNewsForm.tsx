import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save } from 'lucide-react'
import AdminMiniMap from '../../components/admin/AdminMiniMap'
import { useAlerts } from '../../context/useAlerts'
import { categoryMeta } from '../../data/categories'

const severityOptions = [
  { label: 'Kırmızı Kod', value: 'critical' },
  { label: 'Sarı Kod', value: 'high' },
  { label: 'Yeşil Kod', value: 'medium' },
]

const defaultForm = {
  active: true,
  category: 'regional',
  description: '',
  lat: 39.9334,
  lng: 32.8597,
  location: 'Ankara',
  severity: 'medium',
  sourceUrl: '',
  tags: 'Bölgesel, Yerel',
  timestamp: new Date().toISOString(),
  title: '',
}

function AdminNewsForm({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addAlert, alerts, updateAlert } = useAlerts()
  const editingAlert = alerts.find((alert) => alert.id === id)
  const initialForm = useMemo(() => {
    if (mode !== 'edit' || !editingAlert) return defaultForm

    return {
      ...editingAlert,
      tags: editingAlert.tags?.join(', ') ?? '',
    }
  }, [editingAlert, mode])
  const [form, setForm] = useState(initialForm)

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function updateLocation(lat, lng) {
    setForm((current) => ({
      ...current,
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const payload = {
      ...form,
      lat: Number(form.lat),
      lng: Number(form.lng),
      timestamp: form.timestamp || new Date().toISOString(),
    }

    if (mode === 'edit' && editingAlert) {
      await updateAlert(editingAlert.id, payload)
    } else {
      await addAlert(payload)
    }

    navigate('/admin/news')
  }

  if (mode === 'edit' && !editingAlert) {
    return (
      <div className="border border-red-300/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
        Düzenlenecek haber bulunamadı.
      </div>
    )
  }

  return (
    <form className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]" onSubmit={handleSubmit}>
      <section className="space-y-4 border border-white/10 bg-white/[0.035] p-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {mode === 'edit' ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Manuel kayıtlar LocalStorage üzerinde saklanır; servis katmanı backend’e hazırdır.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Başlık" className="md:col-span-2">
            <input
              className="admin-input"
              onChange={(event) => updateField('title', event.target.value)}
              required
              value={form.title}
            />
          </Field>

          <Field label="Detay" className="md:col-span-2">
            <textarea
              className="admin-input min-h-28 resize-y"
              onChange={(event) => updateField('description', event.target.value)}
              required
              value={form.description}
            />
          </Field>

          <Field label="Şiddet Kodu">
            <select
              className="admin-input"
              onChange={(event) => updateField('severity', event.target.value)}
              value={form.severity}
            >
              {severityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Kategori">
            <select
              className="admin-input"
              onChange={(event) => updateField('category', event.target.value)}
              value={form.category}
            >
              {Object.entries(categoryMeta).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Kaynak URL">
            <input
              className="admin-input"
              onChange={(event) => updateField('sourceUrl', event.target.value)}
              placeholder="https://..."
              type="url"
              value={form.sourceUrl}
            />
          </Field>

          <Field label="Şehir / Lokasyon">
            <input
              className="admin-input"
              onChange={(event) => updateField('location', event.target.value)}
              required
              value={form.location}
            />
          </Field>

          <Field label="Etiketler">
            <input
              className="admin-input"
              onChange={(event) => updateField('tags', event.target.value)}
              placeholder="Finans, Borsa, İstanbul"
              value={form.tags}
            />
          </Field>

          <Field label="Tarih">
            <input
              className="admin-input"
              onChange={(event) => updateField('timestamp', new Date(event.target.value).toISOString())}
              type="datetime-local"
              value={toDateTimeLocal(form.timestamp)}
            />
          </Field>

          <Field label="Enlem">
            <input
              className="admin-input"
              onChange={(event) => updateField('lat', event.target.value)}
              required
              step="0.000001"
              type="number"
              value={form.lat}
            />
          </Field>

          <Field label="Boylam">
            <input
              className="admin-input"
              onChange={(event) => updateField('lng', event.target.value)}
              required
              step="0.000001"
              type="number"
              value={form.lng}
            />
          </Field>
        </div>

        <label className="flex items-center gap-3 border border-white/10 bg-white/[0.035] px-3 py-3 text-sm font-semibold text-slate-200">
          <input
            checked={form.active}
            className="h-4 w-4 accent-cyan-300"
            onChange={(event) => updateField('active', event.target.checked)}
            type="checkbox"
          />
          Haberi haritada aktif göster
        </label>

        <button
          className="inline-flex items-center gap-2 border border-cyan-300/40 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/16"
          type="submit"
        >
          <Save size={16} />
          {mode === 'edit' ? 'Değişiklikleri Kaydet' : 'Haberi Kaydet'}
        </button>
      </section>

      <aside className="space-y-3 border border-white/10 bg-white/[0.035] p-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Konum Seçici</h3>
          <p className="mt-1 text-sm text-slate-400">
            Haritaya tıkla veya pini sürükle; koordinatlar forma otomatik yazılır.
          </p>
        </div>
        <AdminMiniMap lat={form.lat} lng={form.lng} onChange={updateLocation} />
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
          <div className="border border-white/10 bg-white/[0.04] px-3 py-2">
            LAT: {Number(form.lat).toFixed(6)}
          </div>
          <div className="border border-white/10 bg-white/[0.04] px-3 py-2">
            LNG: {Number(form.lng).toFixed(6)}
          </div>
        </div>
      </aside>
    </form>
  )
}

function Field({ children, className = '', label }) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-slate-300 ${className}`}>
      {label}
      {children}
    </label>
  )
}

function toDateTimeLocal(timestamp) {
  const date = new Date(timestamp)
  const timezoneOffset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

export default AdminNewsForm
