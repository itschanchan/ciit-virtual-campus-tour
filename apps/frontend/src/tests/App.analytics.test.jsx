import { StrictMode } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/introduction', () => ({
  readFirstVisitState: vi.fn(),
  writeFirstVisitState: vi.fn(),
  clearFirstVisitState: vi.fn(),
}))

vi.mock('../lib/analytics', () => ({
  trackPageView: vi.fn(),
  trackTourStart: vi.fn(),
  trackFloorView: vi.fn(),
  trackLocationView: vi.fn(),
}))

import App from '../App'
import { readFirstVisitState } from '../lib/introduction'
import { trackPageView, trackTourStart } from '../lib/analytics'

function setPath(path) {
  window.history.pushState({}, '', path)
}

function mockFirstVisit(hasSeenIntroduction) {
  vi.mocked(readFirstVisitState).mockReturnValue({
    hasSeenIntroduction,
    firstVisitTimestamp: hasSeenIntroduction ? '2026-11-18T00:00:00Z' : null,
  })
}

describe('App analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
    setPath('/')
  })

  afterEach(() => {
    setPath('/')
  })

  it('tracks one page view for the public root path', () => {
    mockFirstVisit(false)

    render(<App />)

    expect(trackPageView).toHaveBeenCalledTimes(1)
    expect(trackPageView).toHaveBeenCalledWith('/')
  })

  it('does not duplicate the page view under StrictMode', () => {
    mockFirstVisit(false)

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    )

    expect(trackPageView).toHaveBeenCalledTimes(1)
  })

  it('does not track page views for admin routes', () => {
    mockFirstVisit(false)
    setPath('/admin/login')

    render(<App />)

    expect(trackPageView).not.toHaveBeenCalled()
  })

  it('does not track page views for the admin dashboard route', async () => {
    mockFirstVisit(false)
    setPath('/admin')

    render(<App />)

    await waitFor(() => expect(window.location.pathname).toBe('/admin/login'))
    expect(trackPageView).not.toHaveBeenCalled()
  })

  it('does not track page views for nested admin routes', async () => {
    mockFirstVisit(false)
    setPath('/admin/analytics/overview')

    render(<App />)

    await waitFor(() => expect(window.location.pathname).toBe('/admin/login'))
    expect(trackPageView).not.toHaveBeenCalled()
  })

  it('tracks a page view when browser navigation returns to a public path', () => {
    mockFirstVisit(false)
    setPath('/')

    render(<App />)

    expect(trackPageView).toHaveBeenCalledTimes(1)
    expect(trackPageView).toHaveBeenLastCalledWith('/')

    act(() => {
      window.history.pushState({}, '', '/admin/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(trackPageView).toHaveBeenCalledTimes(1)

    act(() => {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(trackPageView).toHaveBeenCalledTimes(2)
    expect(trackPageView).toHaveBeenLastCalledWith('/')
  })

  it('does not track a tour start on the welcome or instructions screens', () => {
    mockFirstVisit(false)

    render(<App />)

    expect(trackTourStart).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'START' }))

    expect(trackTourStart).not.toHaveBeenCalled()
  })

  it('tracks a tour start when the tour screen is reached', () => {
    mockFirstVisit(false)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'START' }))
    fireEvent.click(screen.getByText('CLICK ANYWHERE TO START!'))

    expect(trackTourStart).toHaveBeenCalledTimes(1)
  })

  it('tracks a tour start for returning visitors who land on the tour', () => {
    mockFirstVisit(true)

    render(<App />)

    expect(trackTourStart).toHaveBeenCalledTimes(1)
  })
})
