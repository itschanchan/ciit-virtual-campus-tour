import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AdminLoginPage from '../pages/AdminLoginPage'
import { AuthProvider, useAuth } from '../context/AuthContext'

beforeEach(() => {
  sessionStorage.clear()
})

afterEach(() => {
  sessionStorage.clear()
})

function TestAuthConsumer() {
  const { user } = useAuth()

  return <div>{user ? `Logged in as ${user.username}` : 'Logged out'}</div>
}

describe('Admin login page', () => {
  it('submits valid credentials and redirects an authenticated admin', async () => {
    const onNavigate = vi.fn()
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        message: 'Login successful',
        user: {
          id: 'admin-1',
          username: 'admin',
          fullName: 'CIIT Admin',
          role: 'admin',
        },
      }),
    }))

    global.fetch = fetchMock

    render(
      <AuthProvider>
        <AdminLoginPage onNavigate={onNavigate} />
      </AuthProvider>,
    )

    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/admin/login',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        }),
      )
    })

    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('/admin'))
  })

  it('shows an error when credentials are invalid', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      json: async () => ({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } }),
    }))

    global.fetch = fetchMock

    render(
      <AuthProvider>
        <AdminLoginPage />
      </AuthProvider>,
    )

    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('reads the authentication state from the context', async () => {
    sessionStorage.setItem('ciit-admin-tab-session', 'active')
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ user: { username: 'admin', role: 'admin' } }),
    }))

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Logged in as admin')).toBeInTheDocument()
    })
  })

  it('keeps the admin signed in after a refresh in the same tab', async () => {
    sessionStorage.setItem('ciit-admin-tab-session', 'active')
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ user: { username: 'admin', role: 'admin' } }),
    }))

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Logged in as admin')).toBeInTheDocument()
    })

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/admin/session', {
      credentials: 'include',
    })
  })

  it('shows the login page in a new tab without an admin tab session', async () => {
    globalThis.fetch = vi.fn()

    render(
      <AuthProvider>
        <AdminLoginPage />
      </AuthProvider>,
    )

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })
})
