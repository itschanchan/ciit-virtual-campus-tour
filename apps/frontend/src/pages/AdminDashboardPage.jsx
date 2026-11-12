import { useAuth } from '../context/AuthContext'
import AdminLayout from '../components/AdminLayout'

export default function AdminDashboardPage({ onNavigate }) {
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    if (onNavigate) {
      onNavigate('/admin/login')
    }
  }

  return (
    <AdminLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Overview
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white">Welcome back, {user?.fullName || 'Administrator'}.</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Manage the campus tour platform, monitor content status, and keep the tour experience
            ready for visitors.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Tour status</p>
            <p className="mt-3 text-2xl font-bold text-white">Operational</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Active galleries</p>
            <p className="mt-3 text-2xl font-bold text-white">12</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Last sync</p>
            <p className="mt-3 text-2xl font-bold text-white">Today</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold text-white">Administrator profile</h3>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-400">Name</dt>
              <dd className="mt-1 text-slate-100">{user?.fullName || 'CIIT Admin'}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">Email</dt>
              <dd className="mt-1 text-slate-100">{user?.email || user?.username || 'admin@ciit.edu.ph'}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">Role</dt>
              <dd className="mt-1 text-slate-100">{user?.role || 'admin'}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">Access</dt>
              <dd className="mt-1 text-slate-100">Full administrative</dd>
            </div>
          </dl>
        </section>
      </div>
    </AdminLayout>
  )
}
