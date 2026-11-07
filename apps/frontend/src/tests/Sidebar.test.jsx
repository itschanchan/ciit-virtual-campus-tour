import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

function buildAvailableLocations(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `floor-${index}`,
    name: `Floor ${index}`,
    order: index,
    panorama: {},
  }))
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
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
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

  it('does not show a missing panorama message for empty floors', () => {
    render(
      <Sidebar
        locations={[firstLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
      />,
    )

    expect(screen.queryByText('No panorama available yet.')).not.toBeInTheDocument()
  })

  it('waits 1.5 seconds before showing a locked-floor popover', () => {
    render(
      <Sidebar
        locations={[firstLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /^1F OFF LIMITS$/ }))

    expect(screen.queryByText('1F is coming soon.')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1499)
    })

    expect(screen.queryByText('1F is coming soon.')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(screen.getByText('1F is coming soon.')).toBeInTheDocument()
  })

  it('restarts the delay and shows only the latest locked floor', () => {
    render(
      <Sidebar
        locations={[firstLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /^1F OFF LIMITS$/ }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    fireEvent.click(screen.getByRole('button', { name: /2F OFF LIMITS/ }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByText(/coming soon/)).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(screen.getByText('2F is coming soon.')).toBeInTheDocument()
    expect(screen.queryByText('1F is coming soon.')).not.toBeInTheDocument()
  })

  it('keeps a visible popover until Escape dismisses it', () => {
    render(
      <Sidebar
        locations={[firstLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /^1F OFF LIMITS$/ }))

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByText('1F is coming soon.')).toBeInTheDocument()

    // Escape must bubble from inside the MUI modal root to reach onClose.
    fireEvent.keyDown(screen.getByRole('status'), { key: 'Escape' })

    // Let the popover exit transition finish under fake timers.
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByText('1F is coming soon.')).not.toBeInTheDocument()
  })

  it('cancels a pending popover when the sidebar closes', () => {
    const { rerender } = render(
      <Sidebar
        locations={[firstLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /^1F OFF LIMITS$/ }))

    rerender(
      <Sidebar
        locations={[firstLocation]}
        currentLocationId={firstLocation.id}
        open={false}
        onSelect={vi.fn()}
      />,
    )

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.queryByText('1F is coming soon.')).not.toBeInTheDocument()
  })

  it('acknowledges a locked floor without motion when reduced motion is preferred', () => {
    mockMatchMedia(true)
    render(
      <Sidebar
        locations={[firstLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
      />,
    )

    const button = screen.getByRole('button', { name: /^1F OFF LIMITS$/ })

    fireEvent.click(button)

    expect(button).toHaveClass('floor-acknowledgement')

    act(() => {
      vi.advanceTimersByTime(320)
    })

    expect(button).not.toHaveClass('floor-acknowledgement')
  })

  it('shares one row for 5M and 5F while every other floor keeps its own row', () => {
    render(
      <Sidebar
        locations={buildAvailableLocations(8)}
        currentLocationId={null}
        open
        onSelect={vi.fn()}
      />,
    )

    const fiveM = screen.getByRole('button', { name: /5M/ })
    const fiveF = screen.getByRole('button', { name: /5F/ })
    const fourF = screen.getByRole('button', { name: /4F/ })
    const sixF = screen.getByRole('button', { name: /6F/ })

    const pairRow = fiveM.closest('li')

    expect(pairRow).toBe(fiveF.closest('li'))
    expect(fourF.closest('li')).not.toBe(pairRow)
    expect(sixF.closest('li')).not.toBe(pairRow)
  })

  it('orders the pair as 5M then 5F to match the descending list', () => {
    render(
      <Sidebar
        locations={buildAvailableLocations(8)}
        currentLocationId={null}
        open
        onSelect={vi.fn()}
      />,
    )

    const fiveM = screen.getByRole('button', { name: /5M/ })
    const fiveF = screen.getByRole('button', { name: /5F/ })

    expect(fiveM.compareDocumentPosition(fiveF)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('centers every floor button within the sidebar column', () => {
    render(
      <Sidebar
        locations={buildAvailableLocations(8)}
        currentLocationId={null}
        open
        onSelect={vi.fn()}
      />,
    )

    const rows = screen.getByRole('list').querySelectorAll('li')

    rows.forEach((row) => {
      expect(row).toHaveClass('justify-center')
    })
  })

  it('activates only the selected floor within the pair', () => {
    const onSelect = vi.fn()

    render(
      <Sidebar
        locations={buildAvailableLocations(8)}
        currentLocationId={null}
        open
        onSelect={onSelect}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /5F/ }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('floor-6')
  })

  it('shows the current state on only one floor of the pair', () => {
    render(
      <Sidebar
        locations={buildAvailableLocations(8)}
        currentLocationId="floor-7"
        open
        onSelect={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /5M/ })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('button', { name: /5F/ })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('exposes the pair as a labelled group with both floors in reading order', () => {
    render(
      <Sidebar
        locations={buildAvailableLocations(8)}
        currentLocationId={null}
        open
        onSelect={vi.fn()}
      />,
    )

    const group = screen.getByRole('group', { name: 'Fifth-floor levels' })
    const fiveM = within(group).getByRole('button', { name: /5M/ })
    const fiveF = within(group).getByRole('button', { name: /5F/ })

    expect(fiveM.compareDocumentPosition(fiveF)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('matches a floor to its location by order, not array index, so available tiles are clickable', () => {
    const onSelect = vi.fn()
    const locations = [
      { id: 'lg-lobby', order: 0, name: 'LG Lobby', description: 'Lobby', panorama: {} },
      { id: 'fourth-floor', order: 5, name: 'Fourth Floor', description: '4F', panorama: {} },
    ]
    render(
      <Sidebar
        locations={locations}
        currentLocationId={null}
        open
        onSelect={onSelect}
      />,
    )

    // 4F is at FLOOR_SEQUENCE index 5; its location has order 5.
    // With index-based mapping, 4F would get null (only 2 locations).
    // With order-based matching, 4F gets the fourth-floor location.
    const fourthFloorButton = screen.getByRole('button', { name: /4F Fourth Floor/ })
    expect(fourthFloorButton).not.toBeDisabled()

    fireEvent.click(fourthFloorButton)
    expect(onSelect).toHaveBeenCalledWith('fourth-floor')
  })

  it('disables a floor button when no location exists for that floor', () => {
    const onSelect = vi.fn()
    const locations = [
      { id: 'lg-lobby', order: 0, name: 'LG Lobby', description: 'Lobby', panorama: {} },
    ]
    render(
      <Sidebar
        locations={locations}
        currentLocationId={null}
        open
        onSelect={onSelect}
      />,
    )

    // UG is at FLOOR_SEQUENCE index 1; no location has order 1.
    const ugButton = screen.getByRole('button', { name: /^UG$/ })
    expect(ugButton).toBeDisabled()

    fireEvent.click(ugButton)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
