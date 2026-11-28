const DEFAULT_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Gallery Manager' },
  { id: 'locations', label: 'Locations' },
  { id: 'settings', label: 'Settings' },
]

export default function AdminLayout({
  user,
  onLogout,
  children,
  sections = DEFAULT_SECTIONS,
  activeSection = 'overview',
  onSelect,
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <aside className="md:sticky md:top-0 md:h-screen">
          <div className="h-full w-full md:w-72">
            <div className="h-full border-r border-slate-800 bg-slate-900/90 p-4">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">CIIT</p>
                  <h1 className="mt-2 text-2xl font-bold">Dashboard</h1>
                </div>
              </div>

              <nav className="grid gap-2 sm:grid-cols-2 md:grid-cols-1" aria-label="Admin sections">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => onSelect?.(section.id)}
                    aria-current={activeSection === section.id ? 'page' : undefined}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      activeSection === section.id
                        ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>

              <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Profile</p>
                <p className="mt-2 font-medium text-slate-100">{user?.fullName || 'Administrator'}</p>
                <p className="text-sm text-slate-400">{user?.email || user?.username || 'admin@ciit.edu.ph'}</p>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="mt-8 w-full rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-rose-400 hover:text-rose-200"
              >
                Log out
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
