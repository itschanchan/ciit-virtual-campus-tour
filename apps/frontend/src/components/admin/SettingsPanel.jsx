import { useState } from 'react'
import { getSortedLocations } from '../../lib/catalog'
import { getDefaultLocationId } from '../../lib/adminContent'

const INPUT_CLASS =
  'mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-50 outline-none focus:border-cyan-400'
const CARD_CLASS = 'rounded-2xl border border-slate-700 bg-slate-900 p-6'

function PasswordForm({ user }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user?.id) {
      setStatus({ type: 'error', message: 'Your admin id is unavailable. Please sign in again.' })
      return
    }

    if (form.newPassword.length < 8) {
      setStatus({ type: 'error', message: 'New password must be at least 8 characters.' })
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match.' })
      return
    }

    try {
      setSubmitting(true)
      setStatus({ type: '', message: '' })

      const response = await fetch(`/api/admins/${user.id}/activate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Password change failed.')
      }

      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setStatus({ type: 'success', message: 'Password changed successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <label className="block text-sm text-slate-200">
        Current password
        <input
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          className={INPUT_CLASS}
        />
      </label>
      <label className="block text-sm text-slate-200">
        New password
        <input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          className={INPUT_CLASS}
        />
      </label>
      <label className="block text-sm text-slate-200">
        Confirm new password
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          className={INPUT_CLASS}
        />
      </label>
      {status.message ? (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${
            status.type === 'success'
              ? 'border border-cyan-400/40 bg-cyan-500/10 text-cyan-200'
              : 'border border-rose-400/40 bg-rose-500/10 text-rose-200'
          }`}
        >
          {status.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Updating...' : 'Change password'}
      </button>
    </form>
  )
}

function downloadContent(content) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'ciit-admin-content.json'
  link.click()
  URL.revokeObjectURL(url)
}

export default function SettingsPanel({ user, catalog, content, commit, onResetAll }) {
  const locations = getSortedLocations(catalog)
  const defaultId = getDefaultLocationId(catalog, content)

  function handleDefaultChange(event) {
    const id = event.target.value
    const location = locations.find((item) => item.id === id)
    const nextSettings = { ...content.settings, defaultLocationId: id }
    commit({ ...content, settings: nextSettings }, 'Changed default location', location?.name || id)
  }

  function handleConfirmChange(event) {
    const confirmDeletes = event.target.checked
    const nextSettings = { ...content.settings, confirmDeletes }
    commit({ ...content, settings: nextSettings }, 'Updated preferences')
  }

  function handleResetAll() {
    if (!window.confirm('Reset all gallery, location, and preference changes?')) {
      return
    }

    onResetAll()
  }

  return (
    <div className="space-y-5">
      <header className={CARD_CLASS}>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Settings
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white">Tour and account settings</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Control the default tour entry point, your admin preferences, and account security.
        </p>
      </header>

      <section className={CARD_CLASS}>
        <h3 className="text-lg font-semibold text-white">Tour preferences</h3>
        <label className="mt-4 block text-sm text-slate-200">
          Default starting location
          <select value={defaultId} onChange={handleDefaultChange} className={INPUT_CLASS}>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 flex items-center gap-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={content.settings.confirmDeletes}
            onChange={handleConfirmChange}
            className="size-4 rounded border-slate-600 bg-slate-950"
          />
          Ask for confirmation before deleting gallery images
        </label>
      </section>

      <section className={CARD_CLASS}>
        <h3 className="text-lg font-semibold text-white">Administrator account</h3>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-400">Username</dt>
            <dd className="text-slate-100">{user?.username || 'Unknown'}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Email</dt>
            <dd className="text-slate-100">{user?.email || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Role</dt>
            <dd className="text-slate-100">{user?.role || 'admin'}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Admin ID</dt>
            <dd className="truncate text-slate-100">{user?.id || 'Unavailable'}</dd>
          </div>
        </dl>
        <PasswordForm user={user} />
      </section>

      <section className={CARD_CLASS}>
        <h3 className="text-lg font-semibold text-white">Data management</h3>
        <p className="mt-2 text-sm text-slate-300">
          Customizations are stored in this browser. Export a backup or reset everything to the
          bundled tour content.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadContent(content)}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
          >
            Export content
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="rounded-lg border border-rose-400/50 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/10"
          >
            Reset all customizations
          </button>
        </div>
      </section>
    </div>
  )
}
