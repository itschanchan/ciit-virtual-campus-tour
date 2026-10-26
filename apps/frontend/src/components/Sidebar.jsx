import { isCompactViewport } from '../lib/viewport'
import './Sidebar.css'

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
      className={`sidebar ${open ? 'is-open' : ''}`}
      aria-label="Campus locations"
      aria-hidden={!open}
    >
      <div className="sidebar-heading">
        <div>
          <p className="eyebrow">Explore</p>
          <h2>Campus locations</h2>
        </div>
        <button type="button" className="icon-button" aria-label="Close location menu" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {sortedLocations.length === 0 ? (
        <p className="sidebar-empty">No locations are available yet.</p>
      ) : (
        <nav aria-label="Tour locations">
          <ul className="location-list">
            {sortedLocations.map((location) => {
              const available = Boolean(location.panorama)
              const current = location.id === currentLocationId

              return (
                <li key={location.id}>
                  <button
                    type="button"
                    className={`location-button ${current ? 'is-current' : ''}`}
                    aria-current={current ? 'true' : undefined}
                    onClick={() => handleSelect(location.id)}
                    disabled={!available}
                  >
                    <span className="location-name">{location.name}</span>
                    <span className="location-description">
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
