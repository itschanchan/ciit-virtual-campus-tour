import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Layout from '../components/Layout'
import { TourProvider } from '../context/TourContext'
import { catalogData } from '../lib/catalog'

function buildCatalog() {
  const catalog = JSON.parse(JSON.stringify(catalogData))
  const sourceLocation = catalog.locations.find((location) => location.order === 0)

  catalog.locations = catalog.locations.filter(
    (location) => location.id !== 'ug-ground',
  )
  catalog.locations.push({
    ...sourceLocation,
    id: 'glitch-tower-library',
    name: 'Glitch Tower Library',
    description: 'Browse the library.',
    order: 1,
    narration: undefined,
  })

  return catalog
}

async function renderLayout(catalogSource = catalogData) {
  render(
    <TourProvider catalogSource={catalogSource}>
      <Layout />
    </TourProvider>,
  )

  return screen.findByRole('button', { name: 'View gallery' })
}

function getDialog() {
  return document.getElementById('room-gallery')
}

function getBackdrop() {
  return getDialog().parentElement
}

describe('Layout gallery integration', () => {
  it('exposes trigger metadata and keeps the dialog mounted while closed', async () => {
    const trigger = await renderLayout()

    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', 'room-gallery')

    const dialog = getDialog()
    expect(dialog).toBeInTheDocument()
    expect(getBackdrop()).toHaveAttribute('aria-hidden', 'true')
  })

  it('opens the dialog and restores focus after the close button', async () => {
    const trigger = await renderLayout()
    trigger.focus()
    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(getBackdrop()).toHaveAttribute('aria-hidden', 'false')

    fireEvent.click(screen.getByRole('button', { name: 'Close gallery' }))

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('swaps through the floor gallery with the arrow buttons', async () => {
    const trigger = await renderLayout()
    fireEvent.click(trigger)

    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    expect(
      screen.getByAltText('Placeholder image one for the Glitch Tower Lobby gallery.'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))

    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(
      screen.getByAltText('Placeholder image two for the Glitch Tower Lobby gallery.'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))

    expect(screen.getByText('3 / 3')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))

    expect(screen.getByText('1 / 3')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Previous image' }))

    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('swaps through the floor gallery with the arrow keys', async () => {
    const trigger = await renderLayout()
    fireEvent.click(trigger)

    const closeButton = screen.getByRole('button', { name: 'Close gallery' })
    await waitFor(() => expect(closeButton).toHaveFocus())

    expect(screen.getByText('1 / 3')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(closeButton).toHaveFocus()

    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByText('1 / 3')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
    expect(closeButton).toHaveFocus()
  })

  it('closes only the Gallery on Escape while the sidebar remains open', async () => {
    const trigger = await renderLayout()
    trigger.focus()
    fireEvent.click(trigger)

    const sidebarToggle = screen.getByRole('button', {
      name: 'Collapse campus floors',
    })

    expect(sidebarToggle).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    expect(sidebarToggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes the Gallery and restores focus when the location changes', async () => {
    const trigger = await renderLayout(buildCatalog())
    trigger.focus()
    fireEvent.click(trigger)

    fireEvent.click(screen.getByRole('button', { name: 'UG' }))

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
