import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NarrationPlayer from '../components/NarrationPlayer'

const narration = {
  audioSrc: '/panoramas/placeholder/narration.wav',
  transcript: 'Welcome to the CIIT Virtual Campus Tour.',
  durationSeconds: 2,
}

describe('NarrationPlayer', () => {
  beforeEach(() => {
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders nothing without narration', () => {
    const { container } = render(
      <NarrationPlayer narration={null} status="idle" onPlay={vi.fn()} onPause={vi.fn()} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('starts playback and exposes the transcript', () => {
    const onPlay = vi.fn()
    render(
      <NarrationPlayer
        narration={narration}
        status="idle"
        onPlay={onPlay}
        onPause={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Play narration' }))
    expect(onPlay).toHaveBeenCalledTimes(1)
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Show transcript' }))
    expect(screen.getByText(narration.transcript)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hide transcript' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('pauses playback', () => {
    const onPause = vi.fn()
    render(
      <NarrationPlayer
        narration={narration}
        status="playing"
        onPlay={vi.fn()}
        onPause={onPause}
        onStatusChange={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Pause narration' }))

    expect(onPause).toHaveBeenCalledTimes(1)
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })

  it('reports blocked playback and points to the transcript', async () => {
    window.HTMLMediaElement.prototype.play.mockRejectedValueOnce(new Error('blocked'))
    const onStatusChange = vi.fn()
    render(
      <NarrationPlayer
        narration={narration}
        status="idle"
        onPlay={vi.fn()}
        onPause={vi.fn()}
        onStatusChange={onStatusChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Play narration' }))

    await waitFor(() => expect(onStatusChange).toHaveBeenCalledWith('blocked'))
  })

  it('reports the ended state from the audio element', () => {
    const onStatusChange = vi.fn()
    render(
      <NarrationPlayer
        narration={narration}
        status="playing"
        onPlay={vi.fn()}
        onPause={vi.fn()}
        onStatusChange={onStatusChange}
      />,
    )

    fireEvent(screen.getByRole('button', { name: 'Pause narration' }).closest('section').querySelector('audio'), new Event('ended'))

    expect(onStatusChange).toHaveBeenCalledWith('ended')
  })
})
