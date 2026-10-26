import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import RoomGallery from '../components/RoomGallery'

const images = [
  {
    src: '/panoramas/placeholder/equirect.svg',
    alt: 'A blue and violet placeholder panorama.',
    caption: 'Placeholder preview',
    order: 0,
  },
  {
    src: '/panoramas/placeholder/0/0/0.svg',
    alt: 'The front face of the placeholder panorama.',
    order: 1,
  },
]

describe('RoomGallery', () => {
  it('renders images with alt text and captions', () => {
    render(<RoomGallery images={images} open onClose={vi.fn()} />)

    expect(screen.getByAltText('A blue and violet placeholder panorama.')).toBeInTheDocument()
    expect(screen.getByAltText('The front face of the placeholder panorama.')).toBeInTheDocument()
    expect(screen.getByText('Placeholder preview')).toBeInTheDocument()
  })

  it('shows a friendly empty state', () => {
    render(<RoomGallery images={[]} open onClose={vi.fn()} />)

    expect(
      screen.getByText('No gallery images are available for this location yet.'),
    ).toBeInTheDocument()
  })

  it('moves focus into the gallery and closes on Escape', () => {
    const onClose = vi.fn()
    render(<RoomGallery images={images} open onClose={onClose} />)

    expect(screen.getByRole('button', { name: 'Close gallery' })).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('returns focus to the trigger when closed', () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open gallery'
    document.body.appendChild(trigger)
    trigger.focus()

    const { rerender } = render(<RoomGallery images={images} open onClose={vi.fn()} />)

    rerender(<RoomGallery images={images} open={false} onClose={vi.fn()} />)

    expect(trigger).toHaveFocus()
    trigger.remove()
  })
})
