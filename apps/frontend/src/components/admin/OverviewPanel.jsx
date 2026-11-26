import { useEffect, useState } from 'react'
import { checkBackendStatus } from '../../api/client'
import { getDefaultLocationId, getEffectiveGallery, getEffectiveLocation } from '../../lib/adminContent'

function formatTimestamp(value) {
  if (!value) {
    return 'No changes yet'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return date.toLocaleString()
}

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
      {detail ? <p className="mt-1 text-xs text-slate-400">{detail}</p> : null}
    </div>
  )
}

function QuickAction({ label, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-left transition hover:border-cyan-400/60 hover:bg-slate-800/60"
    >
      <p className="font-semibold text-white">{label}</p>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </button>
  )
}

function ActivityList({ entries }) {
  if (entries.length === 0) {
    return (
      <p className="mt-4 rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
        No admin activity recorded yet. Changes you make will appear here.
      </p>
    )
  }

  return (
    <ul className="mt-4 space-y-3">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex flex-col gap-1 rounded-xl border border-slate-700 bg-slate-950/60 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium text-slate-100">{entry.action}</p>
            {entry.detail ? <p className="text-sm text-slate-400">{entry.detail}</p> : null}
          </div>
          <p className="text-xs text-slate-500">{formatTimestamp(entry.timestamp)}</p>
        </li>
      ))}
    </ul>
  )
}

function ProfileCard({ user }) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <h3 className="text-xl font-semibold text-white">Administrator profile</h3>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-400">Name</dt>
          <dd className="mt-1 text-slate-100">{user?.fullName || user?.username || 'CIIT Admin'}</dd>
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
  )
}

export default function OverviewPanel({ user, catalog, content, onNavigate }) {
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    let active = true

    checkBackendStatus().then((result) => {
      if (active) {
        setBackendStatus(result ? 'online' : 'offline')
      }
    })

    return () => {
      active = false
    }
  }, [])

  const galleryCount = catalog.locations.reduce(
    (total, location) => total + getEffectiveGallery(location, content).length,
    0,
  )
  const customizedCount = new Set([
    ...Object.keys(content.gallery),
    ...Object.keys(content.locations),
  ]).size
  const defaultId = getDefaultLocationId(catalog, content)
  const defaultLocation = catalog.locations.find((location) => location.id === defaultId)
  const defaultName = getEffectiveLocation(defaultLocation, content)?.name ?? 'Not set'
  const statusLabel = backendStatus === 'checking' ? 'Checking...' : backendStatus

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Overview
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">
          Welcome back, {user?.fullName || user?.username || 'Administrator'}.
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Manage the campus tour platform, keep the galleries up to date, and confirm the
          experience is ready for visitors.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Backend status"
          value={statusLabel}
          detail={backendStatus === 'online' ? 'API is responding' : 'API is unavailable'}
        />
        <StatCard label="Campus locations" value={catalog.locations.length} detail={defaultName} />
        <StatCard label="Gallery images" value={galleryCount} detail="Across all locations" />
        <StatCard
          label="Last update"
          value={content.updatedAt ? 'Saved' : 'Default'}
          detail={formatTimestamp(content.updatedAt)}
        />
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">Quick actions</h3>
          <p className="text-sm text-slate-400">{customizedCount} customized locations</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <QuickAction
            label="Manage galleries"
            description="Add, edit, reorder, or remove location images."
            onClick={() => onNavigate('gallery')}
          />
          <QuickAction
            label="Edit locations"
            description="Update location names and descriptions."
            onClick={() => onNavigate('locations')}
          />
          <QuickAction
            label="Open settings"
            description="Set the starting location and manage your account."
            onClick={() => onNavigate('settings')}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h3 className="text-xl font-semibold text-white">Recent activity</h3>
        <ActivityList entries={content.activity.slice(0, 6)} />
      </section>

      <ProfileCard user={user} />
    </div>
  )
}
