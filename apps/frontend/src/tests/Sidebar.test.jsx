import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Sidebar from '../components/Sidebar'
import { catalogData } from '../lib/catalog'

const firstLocation = catalogData.locations[0]
const secondLocation = {
  ...firstLocation,
  id: 'glitch-tower-library',
  name: 'Glitch Tower Library',
  description: 'Browse the library shelves.',
  order: 1,
  narration: undefined,
}

function mockMatchMedia(matches) {
  window.matchMedia = vi.fn((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('Sidebar', () => {
  afterEach(() => {
    delete window.matchMedia
  })

  it('renders every location and marks the current one', () => {
    render(
      <Sidebar
        locations={[secondLocation, firstLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
      />,
    )

    expect(screen.getByText('Glitch Tower Lobby')).toBeInTheDocument()
    expect(screen.getByText('Glitch Tower Library')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Glitch Tower Lobby/ })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  it('calls onSelect with the selected location id', () => {
    const onSelect = vi.fn()
    render(
      <Sidebar
        locations={[firstLocation, secondLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={onSelect}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Glitch Tower Library/ }))

    expect(onSelect).toHaveBeenCalledWith(secondLocation.id)
  })

  it('closes after selection on a compact viewport', () => {
    mockMatchMedia(true)
    const onClose = vi.fn()
    render(
      <Sidebar
        locations={[firstLocation, secondLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
        onClose={onClose}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Glitch Tower Library/ }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('marks an unavailable location and explains why', () => {
    const unavailable = { ...secondLocation, panorama: undefined }
    render(
      <Sidebar
        locations={[firstLocation, unavailable]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
      />,
    )

    const button = screen.getByRole('button', { name: /Glitch Tower Library/ })
    expect(button).toBeDisabled()
    expect(screen.getByText('This location is unavailable.')).toBeInTheDocument()
  })
})
