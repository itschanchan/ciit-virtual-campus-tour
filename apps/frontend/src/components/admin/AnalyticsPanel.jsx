import { useEffect, useState, useRef } from 'react'
import { getEffectiveLocation } from '../../lib/adminContent'
import { catalogData } from '../../lib/catalog'
import { fetchAnalyticsSummary } from '../../api/client'

function resolveLocationName(locationId, content) {
  if (!locationId) return 'Unassigned'

  const catalogLoc = catalogData.locations.find((loc) => loc.id === locationId)
  if (!catalogLoc) return 'Unassigned'

  const effective = getEffectiveLocation(catalogLoc, content)
  return effective.name || catalogLoc.name || 'Unassigned'
}

function AnalyticsPanel({ content }) {
  const [range, setRange] = useState('7d')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // request identity & controller management
  const requestIdRef = useRef(0)
  const abortCtrlRef = useRef(null)
  const mountedRef = useRef(true)

  const [refreshId, setRefreshId] = useState(0)

  // Single effect handling both mount and range/refresh changes
  useEffect(() => {
    // Abort any previous in-flight request
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort()
    }

    // Increment request ID to create a new identity for this request
    requestIdRef.current += 1
    const newId = requestIdRef.current

    // Set mounted flag
    mountedRef.current = true

    // Create and store abort controller for this effect run
    const ac = new AbortController()
    abortCtrlRef.current = ac

    fetchAnalyticsSummary(range, { signal: ac.signal })
      .then((summary) => {
        // Stale-response guard: only respond if this is still the active request
        if (mountedRef.current && requestIdRef.current === newId) {
          setData(summary)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && mountedRef.current && requestIdRef.current === newId) {
          if (err.code === 'unauthorised') {
            window.location.href = '/admin/login'
          } else {
            setError(err.message)
          }
          setLoading(false)
        }
      })

    // Cleanup on unmount or effect re-run
    return () => {
      mountedRef.current = false
      if (abortCtrlRef.current) {
        abortCtrlRef.current.abort()
        abortCtrlRef.current = null
      }
    }
  }, [range, refreshId]) // re-run when range changes or refreshId increments

  // Manual refresh function — re-fetches using current range
  const refresh = () => {
    setRefreshId(prev => prev + 1)
  }

  // render
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <span className="text-primary animate-spin rounded-full size-8" aria-hidden="true" /> Loading analytics…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-6">
        <p className="text-red-200">{error}</p>
        <button onClick={refresh} className="mt-3 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400">
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return <p className="text-slate-400">No analytics data for this period.</p>
  }

  const totals = data.totals
  const floors = data.floors || []
  const locations = data.locations || []

  // Distinguish three situations (requirement #4):
  // No activity: all totals zero AND floors empty AND locations empty
  // Valid response with zeros: show metric cards with zeros
  // Empty arrays: floors/locations empty but totals may have values
  const allTotalsZero =
    (totals.pageViews ?? 0) === 0 &&
    (totals.uniqueVisitors ?? 0) === 0 &&
    (totals.tourStarts ?? 0) === 0 &&
    (totals.floorVisits ?? 0) === 0
  const noActivity =
    allTotalsZero && floors.length === 0 && locations.length === 0

  if (noActivity) {
    return <p className="text-slate-400">No analytics data for this period.</p>
  }

  // compute max visit count for proportional bars (guard against /0)
  const allVisits = [
    ...floors.map((f) => f.visits),
    ...locations.map((l) => l.visits),
  ]
  const maxVisits = allVisits.length > 0 ? Math.max(...allVisits) : 1

  // floor popularity bars
  const floorItems = floors.map((f) => ({
    floor: f.floor,
    visits: f.visits,
    barPct: ((f.visits / maxVisits) * 100).toFixed(1),
  }))

  // most-visited locations list
  const locationItems = locations.map((l) => ({
    locationId: l.locationId,
    visits: l.visits,
    name: resolveLocationName(l.locationId, content),
  }))

  // sort locations by visits descending
  locationItems.sort((a, b) => b.visits - a.visits)

  return (
    <div className="space-y-6">
      {/* Date range selector */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Analytics
        </p>
        <h2 className="mt-3 text-xl font-bold text-white">Analytics Dashboard</h2>
        <div className="grid gap-2 md:grid-cols-4 sm:grid-cols-2 xl:grid-cols-4 mt-4">
          <button
            onClick={() => setRange('today')}
            className={`rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition ${range === 'today' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Today
          </button>
          <button
            onClick={() => setRange('7d')}
            className={`rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition ${range === '7d' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setRange('30d')}
            className={`rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition ${range === '30d' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Last 30 Days
          </button>
          <button onClick={refresh} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 w-full">
            Refresh
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Page Views</p>
          <p className="mt-2 text-2xl font-bold text-white">{totals.pageViews ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Unique Visitors</p>
          <p className="mt-2 text-2xl font-bold text-white">{totals.uniqueVisitors ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Tour Starts</p>
          <p className="mt-2 text-2xl font-bold text-white">{totals.tourStarts ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Floor Visits</p>
          <p className="mt-2 text-2xl font-bold text-white">{totals.floorVisits ?? 0}</p>
        </div>
      </div>

      {/* Floor popularity */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Floor Popularity
        </p>
        <div className="mt-3 space-y-2">
          {floorItems.map((item) => (
            <div key={item.floor} className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">{item.floor}</span>
              <span
                className="text-slate-300 text-xs"
                style={{ width: `${item.barPct}%` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Most visited campus locations */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Most Visited Campus Locations
        </p>
        {locationItems.length === 0
          ? <p className="text-slate-400">No location data.</p>
          : (
              <ol className="mt-3 space-y-2">
                {locationItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-slate-300 text-sm w-20">{item.name}</span>
                    <span className="text-slate-300 text-xs">
                      {item.visits} visits
                      <span style={{ width: `${item.barPct}%` }} aria-hidden="true" />
                    </span>
                  </li>
                ))}
              </ol>
            )}
      </div>
    </div>
  )
}

export default AnalyticsPanel