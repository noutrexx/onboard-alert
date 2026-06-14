import { LockKeyhole, Map } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isBackendEnabled, loginAdmin } from '../../services/apiService'

function AdminLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('')

  if (!isBackendEnabled()) return <Navigate replace to="/admin" />

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await loginAdmin(password)
      navigate('/admin', { replace: true })
    } catch {
      setError('Admin parolasi gecersiz veya API baglantisi kurulamadi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-950 px-5 text-slate-100">
      <section className="w-full max-w-md border border-white/10 bg-white/[0.035] p-6 shadow-2xl">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
          <Map size={16} />
          Onboard Alert
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-white">Admin Girisi</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Oturum bilgisi tarayici paketine gomulmez ve HttpOnly cookie olarak saklanir.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Admin Parolasi
            </span>
            <span className="relative mt-2 block">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
              <input
                autoComplete="current-password"
                autoFocus
                className="admin-input pl-10"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </span>
          </label>
          <button
            className="w-full border border-cyan-300/50 bg-cyan-300/12 px-4 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Dogrulaniyor...' : 'Admin Panelini Ac'}
          </button>
        </form>
        {error ? <p className="mt-4 text-sm font-semibold text-rose-300">{error}</p> : null}
      </section>
    </main>
  )
}

export default AdminLogin
