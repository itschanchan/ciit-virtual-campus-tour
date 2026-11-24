import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import App from '../App'

vi.mock('../lib/introduction', () => ({
  readFirstVisitState: vi.fn(() => ({ hasSeenIntroduction: false, firstVisitTimestamp: null })),
  writeFirstVisitState: vi.fn(),
  clearFirstVisitState: vi.fn(),
}))

import {
  readFirstVisitState,
  writeFirstVisitState,
  clearFirstVisitState,
} from '../lib/introduction'

describe('App first-visit persistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('shows welcome screen to first-time visitor', () => {
    vi.mocked(readFirstVisitState).mockReturnValue({
      hasSeenIntroduction: false,
      firstVisitTimestamp: null,
    })

    render(<App />)

    expect(screen.getByText('GLITCH TOWER')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument()
    expect(screen.queryByText('How to Move Around')).not.toBeInTheDocument()
  })

  it('shows instructions screen after clicking START', () => {
    vi.mocked(readFirstVisitState).mockReturnValue({
      hasSeenIntroduction: false,
      firstVisitTimestamp: null,
    })

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'START' }))

    expect(screen.getByText('How to Move Around')).toBeInTheDocument()
    expect(screen.queryByText('GLITCH TOWER')).not.toBeInTheDocument()
  })

  it('shows tour after completing instructions', () => {
    vi.mocked(readFirstVisitState).mockReturnValue({
      hasSeenIntroduction: false,
      firstVisitTimestamp: null,
    })

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'START' }))
    fireEvent.click(screen.getByText('CLICK ANYWHERE TO START!'))

    expect(screen.queryByText('GLITCH TOWER')).not.toBeInTheDocument()
    expect(screen.queryByText('How to Move Around')).not.toBeInTheDocument()
    expect(screen.queryByText('CIIT College of Innovation and Integrated Technology')).not.toBeInTheDocument()
  })

  it('skips introduction screens for returning visitor', () => {
    vi.mocked(readFirstVisitState).mockReturnValue({
      hasSeenIntroduction: true,
      firstVisitTimestamp: '2026-11-18T00:00:00Z',
    })

    render(<App />)

    expect(screen.queryByText('GLITCH TOWER')).not.toBeInTheDocument()
    expect(screen.queryByText('How to Move Around')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'START' })).not.toBeInTheDocument()
  })

  it('writes first-visit state when entering tour', () => {
    vi.mocked(readFirstVisitState).mockReturnValue({
      hasSeenIntroduction: false,
      firstVisitTimestamp: null,
    })

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'START' }))
    fireEvent.click(screen.getByText('CLICK ANYWHERE TO START!'))

    expect(vi.mocked(writeFirstVisitState)).toHaveBeenCalledWith(
      expect.objectContaining({ hasSeenIntroduction: true }),
    )
  })

  it('shows welcome screen again after clearing browser data', () => {
    vi.mocked(readFirstVisitState).mockReturnValueOnce({
      hasSeenIntroduction: true,
      firstVisitTimestamp: '2026-11-18T00:00:00Z',
    })

    render(<App />)

    expect(screen.queryByText('GLITCH TOWER')).not.toBeInTheDocument()

    vi.mocked(clearFirstVisitState).mockImplementation(() => {
      window.localStorage.removeItem('ciit_introduction_seen')
    })
    clearFirstVisitState()

    vi.mocked(readFirstVisitState).mockReturnValueOnce({
      hasSeenIntroduction: false,
      firstVisitTimestamp: null,
    })

    render(<App />)

    expect(screen.getByText('GLITCH TOWER')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument()
  })

  it('shows instructions screen again after clearing browser data', () => {
    vi.mocked(readFirstVisitState).mockReturnValueOnce({
      hasSeenIntroduction: true,
      firstVisitTimestamp: '2026-11-18T00:00:00Z',
    })

    render(<App />)

    vi.mocked(clearFirstVisitState).mockImplementation(() => {
      window.localStorage.removeItem('ciit_introduction_seen')
    })
    clearFirstVisitState()

    vi.mocked(readFirstVisitState).mockReturnValueOnce({
      hasSeenIntroduction: false,
      firstVisitTimestamp: null,
    })

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'START' }))

    expect(screen.getByText('How to Move Around')).toBeInTheDocument()
  })
})
