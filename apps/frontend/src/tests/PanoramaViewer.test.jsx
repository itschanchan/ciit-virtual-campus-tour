import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Marzipano from 'marzipano'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PanoramaViewer from '../components/PanoramaViewer'
import { catalogData } from '../lib/catalog'

const location = catalogData.locations[0]
const secondLocation = {
  ...location,
  id: 'glitch-tower-library',
  name: 'Glitch Tower Library',
  order: 1,
}

describe('PanoramaViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a viewer and switches to the current scene', async () => {
    const onReady = vi.fn()
    render(<PanoramaViewer location={location} onReady={onReady} />)

    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1))

    const viewer = Marzipano.Viewer.mock.results[0].value
    expect(Marzipano.Viewer).toHaveBeenCalledTimes(1)
    expect(viewer.createScene).toHaveBeenCalledTimes(1)
    expect(viewer.createScene.mock.results[0].value.switchTo).toHaveBeenCalledWith({
      transitionDuration: 0,
    })
    expect(
      screen.getByLabelText('360 degree view of Glitch Tower Lobby'),
    ).toBeInTheDocument()
  })

  it('destroys the viewer on unmount', async () => {
    const { unmount } = render(<PanoramaViewer location={location} />)

    await waitFor(() => expect(Marzipano.Viewer).toHaveBeenCalledTimes(1))
    const viewer = Marzipano.Viewer.mock.results[0].value

    unmount()

    expect(viewer.destroy).toHaveBeenCalledTimes(1)
  })

  it('destroys the previous viewer when the location changes', async () => {
    const { rerender } = render(<PanoramaViewer location={location} />)

    await waitFor(() => expect(Marzipano.Viewer).toHaveBeenCalledTimes(1))
    const firstViewer = Marzipano.Viewer.mock.results[0].value

    rerender(<PanoramaViewer location={secondLocation} />)

    await waitFor(() => expect(Marzipano.Viewer).toHaveBeenCalledTimes(2))
    expect(firstViewer.destroy).toHaveBeenCalledTimes(1)
  })

  it('shows a friendly fallback when the panorama is missing', async () => {
    const onError = vi.fn()
    render(<PanoramaViewer location={{ ...location, panorama: undefined }} onError={onError} />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Panorama unavailable')
    expect(onError).toHaveBeenCalledWith('This location is not available right now.')
  })

  it('rotates the view with arrow keys', async () => {
    render(<PanoramaViewer location={location} />)

    await waitFor(() => expect(Marzipano.RectilinearView).toHaveBeenCalledTimes(1))
    const view = Marzipano.RectilinearView.mock.results[0].value

    fireEvent.keyDown(screen.getByLabelText('360 degree view of Glitch Tower Lobby'), {
      key: 'ArrowRight',
    })

    expect(view.setYaw).toHaveBeenCalledWith(0.08)
  })
})
