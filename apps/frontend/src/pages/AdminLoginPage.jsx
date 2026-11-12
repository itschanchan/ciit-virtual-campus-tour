import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginPage({ onNavigate }) {
  const { login, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated && onNavigate) {
      onNavigate('/admin')
    }
  }, [isAuthenticated, onNavigate])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      await login({ username: form.username, password: form.password })
      if (onNavigate) {
        onNavigate('/admin')
      }
    } catch (loginError) {
      setError(loginError.message || 'Invalid credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-slate-950/60">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            CIIT Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-200">
            Username or email
            <input
              aria-label="Username or email"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-base text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40"
              placeholder="admin"
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Password
            <input
              aria-label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-base text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
