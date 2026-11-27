import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import { AuthProvider } from '../context/AuthContext'
import { readAdminContent } from '../lib/adminContent'

function createFetchMock() {
  return vi.fn(async (url) => {
    if (url === '/api/admin/session') {
      return {
        ok: true,
        json: async () => ({
          user: { id: 'admin-1', username: 'admin', email: 'admin@ciit.edu.ph', role: 'admin' },
        }),
      }
    }

    return { ok: true, json: async () => ({ status: 'ok' }) }
  })
}

beforeEach(() => {
  window.localStorage.clear()
  sessionStorage.clear()
  sessionStorage.setItem('ciit-admin-tab-session', 'active')
  globalThis.fetch = createFetchMock()
})

afterEach(() => {
  window.localStorage.clear()
  sessionStorage.clear()
})

function renderDashboard() {
  render(
    <AuthProvider>
      <AdminDashboardPage onNavigate={() => {}} />
    </AuthProvider>,
  )
}

describe('Admin dashboard', () => {
  it('switches between dashboard sections', async () => {
    renderDashboard()

    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Gallery Manager' }))
    expect(await screen.findByText('Location galleries')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Locations' }))
    expect(await screen.findByText('Tour locations')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
    expect(await screen.findByText('Tour and account settings')).toBeInTheDocument()
  })

  it('adds a gallery image and saves it to storage', async () => {
    renderDashboard()

    fireEvent.click(await screen.findByRole('button', { name: 'Gallery Manager' }))
    await screen.findByText('Location galleries')

    fireEvent.change(screen.getByLabelText('Image URL or path'), {
      target: { value: '/panoramas/placeholder/gallery-2.svg' },
    })
    fireEvent.change(screen.getByLabelText('Alt text'), {
      target: { value: 'A new lobby view' },
    })
    fireEvent.change(screen.getByLabelText('Caption'), {
      target: { value: 'New lobby view' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add image' }))

    expect(await screen.findByText('New lobby view')).toBeInTheDocument()

    await waitFor(() => {
      const content = readAdminContent()
      expect(content.gallery['glitch-tower-lobby']).toHaveLength(4)
    })
  })
})
