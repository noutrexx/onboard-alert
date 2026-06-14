import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FilePlus2, ListChecks, LogOut, Map, MapPinned, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAlerts } from '../../context/useAlerts'
import { getAdminSession, isBackendEnabled, logoutAdmin } from '../../services/apiService'

const navItems = [
  { icon: ListChecks, label: 'Haberler', to: '/admin/news' },
  { icon: MapPinned, label: 'Konum Bekleyenler', to: '/admin/pending', badge: true },
  { icon: FilePlus2, label: 'Yeni Ekle', to: '/admin/new' },
  { icon: Settings, label: 'Ayarlar', to: '/admin/settings' },
]

function AdminLayout() {
  const { pendingAlerts, refreshAdminAlerts } = useAlerts()
  const navigate = useNavigate()
  const [authState, setAuthState] = useState(isBackendEnabled() ? 'checking' : 'authenticated')

  useEffect(() => {
    if (!isBackendEnabled()) return

    getAdminSession()
      .then(() => refreshAdminAlerts())
      .then(() => setAuthState('authenticated'))
      .catch(() => setAuthState('unauthenticated'))
  }, [refreshAdminAlerts])

  async function handleLogout() {
    await logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  if (authState === 'checking') {
    return (
      <main className="grid min-h-dvh place-items-center bg-slate-950 text-slate-300">
        Oturum dogrulaniyor...
      </main>
    )
  }

  if (authState === 'unauthenticated') {
    return <Navigate replace to="/admin/login" />
  }

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="grid min-h-dvh lg:grid-cols-[270px_1fr]">
        <aside className="border-b border-white/10 bg-slate-950/95 lg:border-b-0 lg:border-r">
          <div className="border-b border-white/10 p-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              <Map size={16} />
              Onboard Alert
            </p>
            <h1 className="mt-2 text-xl font-semibold text-white">Admin Paneli</h1>
          </div>
          <nav className="grid gap-2 p-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const badgeValue = item.badge ? pendingAlerts.length : 0

              return (
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 border px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'border-cyan-300/60 bg-cyan-300/10 text-white'
                        : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/25 hover:bg-white/[0.07]'
                    }`
                  }
                  key={item.to}
                  to={item.to}
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon size={17} />
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span className="min-w-6 border border-amber-300/40 bg-amber-300/12 px-2 py-0.5 text-center text-xs font-bold text-amber-100">
                      {badgeValue}
                    </span>
                  ) : null}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Manuel veri yönetimi
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Haber Yönetimi</h2>
            </div>
            <a
              className="border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/16"
              href="/"
            >
              Haritayı Aç
            </a>
            {isBackendEnabled() ? (
              <button
                className="inline-flex items-center gap-2 border border-rose-300/30 bg-rose-300/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/16"
                onClick={handleLogout}
                type="button"
              >
                <LogOut size={16} />
                Cikis
              </button>
            ) : null}
          </header>
          <div className="p-5">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminLayout
