import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import RoomGallery from '../components/RoomGallery'

const images = [
  {
    src: '/gallery/lg/first.jpg',
    alt: 'The first lobby photo.',
    caption: 'First preview',
    order: 0,
  },
  {
    src: '/gallery/lg/second.jpg',
    alt: 'The second lobby photo.',
    caption: 'Second preview',
    order: 1,
  },
  {
    src: '/gallery/lg/third.jpg',
    alt: 'The third lobby photo.',
    caption: 'Third preview',
    order: 2,
  },
]

function createFocusTargets() {
  const trigger = document.createElement('button')
  trigger.textContent = 'Open gallery'
  trigger.dataset.testFocusTarget = 'true'

  const main = document.createElement('main')
  main.id = 'tour-main'
  main.tabIndex = -1
  main.dataset.testFocusTarget = 'true'

  document.body.append(trigger, main)
  trigger.focus()

  return { trigger, main }
}

function ControlledGallery({
  galleryImages = images,
  initialOpen = true,
  onClose = vi.fn(),
}) {
  const [open, setOpen] = useState(initialOpen)

  function handleClose() {
    onClose()
    setOpen(false)
  }

  return <RoomGallery images={galleryImages} open={open} onClose={handleClose} />
}

function getDialog() {
  return document.getElementById('room-gallery')
}

function getBackdrop() {
  return getDialog().parentElement
}

describe('RoomGallery', () => {
  afterEach(() => {
    document.querySelectorAll('[data-test-focus-target]').forEach((node) => {
      node.remove()
    })
  })

  it('keeps the dialog mounted but hidden when open is false', () => {
    const { rerender } = render(
      <RoomGallery images={images} open={false} onClose={vi.fn()} />,
    )

    const dialog = getDialog()

    expect(dialog).toBeInTheDocument()
    expect(getBackdrop()).toHaveAttribute('aria-hidden', 'true')

    rerender(<RoomGallery images={images} open onClose={vi.fn()} />)

    expect(getBackdrop()).toHaveAttribute('aria-hidden', 'false')
  })

  it('exposes the dialog name, modal state, and close control', () => {
    render(<RoomGallery images={images} open onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: 'Gallery' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(
      screen.getByRole('button', { name: 'Close gallery' }),
    ).toBeInTheDocument()
  })

  it('renders only the active image and navigates with the arrow buttons', () => {
    render(<RoomGallery images={images} open onClose={vi.fn()} />)

    expect(screen.getByAltText('The first lobby photo.')).toBeInTheDocument()
    expect(screen.queryByAltText('The second lobby photo.')).not.toBeInTheDocument()
    expect(screen.getByText('First preview')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))

    expect(screen.getByAltText('The second lobby photo.')).toBeInTheDocument()
    expect(screen.queryByAltText('The first lobby photo.')).not.toBeInTheDocument()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Previous image' }))

    expect(screen.getByAltText('The first lobby photo.')).toBeInTheDocument()
  })

  it('wraps around at the end of the gallery', () => {
    render(<RoomGallery images={images} open onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(screen.getByAltText('The third lobby photo.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByAltText('The first lobby photo.')).toBeInTheDocument()
  })

  it('navigates with the left and right arrow keys', () => {
    render(<RoomGallery images={images} open onClose={vi.fn()} />)

    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(screen.getByAltText('The second lobby photo.')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByAltText('The first lobby photo.')).toBeInTheDocument()
  })

  it('hides the arrow controls when there is only one image', () => {
    render(<RoomGallery images={[images[0]]} open onClose={vi.fn()} />)

    expect(
      screen.queryByRole('button', { name: 'Previous image' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Next image' }),
    ).not.toBeInTheDocument()
  })

  it('shows a friendly empty state', () => {
    render(<RoomGallery images={[]} open onClose={vi.fn()} />)

    expect(
      screen.getByText('No gallery images are available for this location yet.'),
    ).toBeInTheDocument()
  })

  it('treats a missing images prop as an empty gallery', () => {
    render(<RoomGallery open onClose={vi.fn()} />)

    expect(
      screen.getByText('No gallery images are available for this location yet.'),
    ).toBeInTheDocument()
  })

  it('renders images in order, not input order', () => {
    const unorderedImages = [images[1], images[0]]

    render(<RoomGallery images={unorderedImages} open onClose={vi.fn()} />)

    expect(screen.getByAltText(images[0].alt)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))

    expect(screen.getByAltText(images[1].alt)).toBeInTheDocument()
  })

  it('closes through the close button', () => {
    const onClose = vi.fn()
    render(<ControlledGallery onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: 'Close gallery' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes through the backdrop', () => {
    const onClose = vi.fn()
    render(<ControlledGallery onClose={onClose} />)

    fireEvent.mouseDown(getBackdrop())

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes through Escape', () => {
    const onClose = vi.fn()
    render(<ControlledGallery onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('restores focus to the trigger after closing with the close button', async () => {
    const { trigger } = createFocusTargets()
    render(<ControlledGallery />)

    fireEvent.click(screen.getByRole('button', { name: 'Close gallery' }))

    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('restores focus to the trigger after Escape', async () => {
    const { trigger } = createFocusTargets()
    render(<ControlledGallery />)

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('restores focus to the trigger after the backdrop closes', async () => {
    const { trigger } = createFocusTargets()
    render(<ControlledGallery />)

    fireEvent.mouseDown(getBackdrop())

    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('falls back to the tour main region when the trigger is gone', async () => {
    const { trigger, main } = createFocusTargets()
    render(<ControlledGallery />)
    trigger.remove()

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(main).toHaveFocus())
  })

  it('renders a fallback when an image fails to load', () => {
    render(<RoomGallery images={images} open onClose={vi.fn()} />)

    fireEvent.error(screen.getByAltText(images[0].alt))

    const fallback = screen.getByRole('img', { name: images[0].alt })
    expect(fallback).toHaveTextContent('Image unavailable')

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))

    expect(screen.getByAltText(images[1].alt)).toBeInTheDocument()
  })
})
