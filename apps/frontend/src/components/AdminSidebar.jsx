export default function AdminSidebar({ user, onLogout }) {
  const navItems = [
    { label: 'Overview', active: true },
    { label: 'Gallery Manager', active: false },
    { label: 'Settings', active: false },
  ]

  return (
    <aside className="w-full border-b border-slate-700 bg-slate-900 p-4 md:w-72 md:border-b-0 md:border-r">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Admin</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            {user?.fullName || 'Administrator'}
          </h2>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              item.active
                ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-8 w-full rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-rose-400 hover:text-rose-200"
      >
        Log out
      </button>
    </aside>
  )
}
