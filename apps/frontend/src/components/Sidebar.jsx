import { isCompactViewport } from '../lib/viewport'

export default function Sidebar({ locations, currentLocationId, open, onSelect, onClose }) {
  const sortedLocations = [...locations].sort((a, b) => a.order - b.order)

  function handleSelect(locationId) {
    onSelect(locationId)

    if (isCompactViewport()) {
      onClose?.()
    }
  }

  return (
    <aside
      id="location-sidebar"
      className={`w-80 flex-none overflow-y-auto border-r border-line bg-surface/86 p-5 compact:fixed compact:top-16 compact:bottom-0 compact:left-0 compact:z-30 compact:w-[min(20rem,86vw)] compact:shadow-sidebar ${open ? 'block' : 'hidden'}`}
      aria-label="Campus locations"
      aria-hidden={!open}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[0.72rem] font-extrabold tracking-[0.16em] text-accent uppercase">
            Explore
          </p>
          <h2 className="mb-0 text-xl">Campus locations</h2>
        </div>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface text-xl leading-none text-ink transition-colors hover:border-accent hover:text-accent"
          aria-label="Close location menu"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {sortedLocations.length === 0 ? (
        <p className="text-muted">No locations are available yet.</p>
      ) : (
        <nav aria-label="Tour locations">
          <ul className="m-0 grid list-none gap-[0.6rem] p-0">
            {sortedLocations.map((location) => {
              const available = Boolean(location.panorama)
              const current = location.id === currentLocationId

              return (
                <li key={location.id}>
                  <button
                    type="button"
                    className={`grid w-full gap-1 rounded-location border px-[0.9rem] py-[0.8rem] text-left text-ink transition disabled:cursor-not-allowed disabled:opacity-55 ${
                      current
                        ? 'border-accent bg-accent-soft'
                        : 'border-line bg-surface-strong/50 enabled:hover:translate-x-0.5 enabled:hover:border-accent enabled:hover:bg-surface-strong/90'
                    }`}
                    aria-current={current ? 'true' : undefined}
                    onClick={() => handleSelect(location.id)}
                    disabled={!available}
                  >
                    <span className="font-bold">{location.name}</span>
                    <span
                      className={`text-[0.82rem] leading-[1.4] ${
                        current ? 'text-selected-ink' : 'text-muted'
                      }`}
                    >
                      {available ? location.description : 'This location is unavailable.'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </aside>
  )
}
