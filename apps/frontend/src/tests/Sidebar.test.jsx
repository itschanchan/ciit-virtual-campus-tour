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

    expect(screen.getByRole('button', { name: /Glitch Tower Lobby/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^UG$/ })).toBeInTheDocument()
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

    fireEvent.click(screen.getByRole('button', { name: /^UG$/ }))

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

    fireEvent.click(screen.getByRole('button', { name: /^UG$/ }))

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

    const button = screen.getByRole('button', { name: /^UG/ })
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

  it('orders the pair as 5F then 5M per spec 010', () => {
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

    expect(fiveF.compareDocumentPosition(fiveM)).toBe(
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

    expect(fiveF.compareDocumentPosition(fiveM)).toBe(
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
        currentLocationId="fourth-floor"
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

describe('Sidebar website, share, about, and footer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.open = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    delete navigator.clipboard
  })

  function renderSidebar(overrides = {}) {
    return render(
      <Sidebar
        locations={[firstLocation, secondLocation]}
        currentLocationId={firstLocation.id}
        open
        onSelect={vi.fn()}
        {...overrides}
      />,
    )
  }

  function openShareDialog() {
    fireEvent.click(screen.getByRole('button', { name: /share this virtual tour/i }))
  }

  function openAboutDialog() {
    fireEvent.click(screen.getByRole('button', { name: /about this virtual tour/i }))
  }

  it('renders the CIIT website action as a safe new-tab link', () => {
    renderSidebar()

    const website = screen.getByRole('link', { name: /ciit official website/i })

    expect(website).toHaveAttribute('href', 'https://www.ciit.edu.ph/')
    expect(website).toHaveAttribute('target', '_blank')
    expect(website.getAttribute('rel')).toContain('noopener')
    expect(website.getAttribute('rel')).toContain('noreferrer')
  })

  it('centers the action row and lets it wrap', () => {
    renderSidebar()

    const row = screen.getByTestId('sidebar-action-row')

    expect(row).toHaveClass('justify-center')
    expect(row).toHaveClass('flex-wrap')
  })

  it('pins the copyright line in a footer outside the scrollable body', () => {
    renderSidebar()

    const footer = screen.getByRole('contentinfo')
    const scrollBody = screen.getByTestId('sidebar-scroll-body')

    expect(footer).toHaveTextContent('© 2026 CIIT. All rights reserved.')
    expect(footer).toHaveClass('shrink-0')
    expect(scrollBody.contains(footer)).toBe(false)
    expect(scrollBody).toHaveClass('overflow-y-auto')
  })

  it('keeps the narrow-viewport close control outside the scrollable body', () => {
    renderSidebar()

    const closeButton = screen.getByRole('button', { name: /close location menu/i })
    const scrollBody = screen.getByTestId('sidebar-scroll-body')

    expect(scrollBody.contains(closeButton)).toBe(false)
  })

  it('opens the share dialog and shows the current tour address', () => {
    renderSidebar()

    openShareDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByDisplayValue(window.location.href)).toBeInTheDocument()
  })

  it('keeps the share close control outside the scrollable content', () => {
    renderSidebar()

    openShareDialog()

    const content = screen.getByTestId('share-dialog-content')
    const closeButton = screen.getByRole('button', { name: /close share dialog/i })
    const paper = document.querySelector('.MuiDialog-paper')

    expect(content.contains(closeButton)).toBe(false)
    expect(paper).toHaveClass('MuiDialog-paperFullWidth')
    expect(paper).toHaveClass('MuiDialog-paperWidthSm')
  })

  it('copies the tour address and confirms it', async () => {
    renderSidebar()

    openShareDialog()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy tour link/i }))
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href)
    expect(screen.getByText(/link copied to your clipboard/i)).toBeInTheDocument()
  })

  it('opens Facebook and X with the encoded tour address', () => {
    renderSidebar()

    openShareDialog()

    fireEvent.click(screen.getByRole('button', { name: /share on facebook/i }))

    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.open.mock.calls[0][0]).toContain(
      encodeURIComponent(window.location.href),
    )

    fireEvent.click(screen.getByRole('button', { name: /share on x/i }))

    expect(window.open).toHaveBeenCalledTimes(2)
    expect(window.open.mock.calls[1][0]).toContain(
      encodeURIComponent(window.location.href),
    )
  })

  it('opens WhatsApp and email with the tour address and message', () => {
    renderSidebar()

    openShareDialog()

    fireEvent.click(screen.getByRole('button', { name: /share on whatsapp/i }))
    fireEvent.click(screen.getByRole('button', { name: /share by email/i }))

    expect(window.open).toHaveBeenCalledTimes(2)
    expect(window.open.mock.calls[0][0]).toContain('wa.me')
    expect(window.open.mock.calls[1][0]).toContain('mailto:')
  })

  it('copies the link before opening Messenger and Discord', async () => {
    renderSidebar()

    openShareDialog()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /share on messenger/i }))
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href)
    expect(window.open.mock.calls[0][0]).toContain('messenger.com')
    expect(screen.getByText(/paste it in the chat/i)).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /share on discord/i }))
    })

    expect(window.open.mock.calls[1][0]).toContain('discord.com')
  })

  it('closes the share dialog by its close control without closing the sidebar', () => {
    renderSidebar()

    openShareDialog()

    fireEvent.click(screen.getByRole('button', { name: /close share dialog/i }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('complementary')).toHaveAttribute('aria-hidden', 'false')
  })

  it('returns focus to the share trigger after closing', () => {
    renderSidebar()

    const trigger = screen.getByRole('button', { name: /share this virtual tour/i })
    trigger.focus()

    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('button', { name: /close share dialog/i }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(trigger).toHaveFocus()
  })

  it('closes the share dialog by Escape without closing the sidebar', () => {
    renderSidebar()

    openShareDialog()

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('complementary')).toHaveAttribute('aria-hidden', 'false')
  })

  it('closes the share dialog when the backdrop is clicked', () => {
    renderSidebar()

    openShareDialog()

    fireEvent.click(document.querySelector('.MuiBackdrop-root'))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('complementary')).toHaveAttribute('aria-hidden', 'false')
  })

  it('closes the share dialog when the sidebar closes', () => {
    const { rerender } = renderSidebar()

    openShareDialog()

    rerender(
      <Sidebar
        locations={[firstLocation, secondLocation]}
        currentLocationId={firstLocation.id}
        open={false}
        onSelect={vi.fn()}
      />,
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the about dialog with a description, credits, and a CIIT link', () => {
    renderSidebar()

    openAboutDialog()

    const dialog = screen.getByRole('dialog')

    expect(within(dialog).getByText(/360-degree walkthrough/i)).toBeInTheDocument()
    expect(within(dialog).getAllByRole('listitem').length).toBeGreaterThanOrEqual(4)

    const link = within(dialog).getByRole('link', { name: /ciit official website/i })

    expect(link).toHaveAttribute('href', 'https://www.ciit.edu.ph/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })

  it('keeps the about close control outside the scrollable content', () => {
    renderSidebar()

    openAboutDialog()

    const content = screen.getByTestId('about-dialog-content')
    const closeButton = screen.getByRole('button', { name: /close about dialog/i })

    expect(content.contains(closeButton)).toBe(false)
  })

  it('closes the about dialog by close control and Escape', () => {
    renderSidebar()

    openAboutDialog()

    fireEvent.click(screen.getByRole('button', { name: /close about dialog/i }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('complementary')).toHaveAttribute('aria-hidden', 'false')

    openAboutDialog()

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('complementary')).toHaveAttribute('aria-hidden', 'false')
  })
})
