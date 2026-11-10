import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PanoramaViewer from '../components/PanoramaViewer'
import { catalogData } from '../lib/catalog'
import { APP_DATA } from '../lib/data'

const location = catalogData.locations[0]
const secondLocation = {
  ...location,
  id: 'glitch-tower-library',
  name: 'Glitch Tower Library',
  order: 1,
}

const INITIAL_SCENE_ID = '0-lg---1'
const FIFTH_FLOOR_SCENE_ID = '23-5f---1'
const MISSING_MESSAGE = 'No panorama available yet.'

// Marzipano.jsx is a frozen IIFE that reads vendor globals from `window`
// when the module is imported. Each test installs fresh mocks and resets
// the module registry so the IIFE runs again against the fresh DOM.
function installVendorMocks() {
  window.bowser = { msie: false, version: '' }
  window.screenfull = { enabled: false, toggle: vi.fn(), on: vi.fn() }

  window.Marzipano = {
    Viewer: vi.fn(function () {
      return {
        createScene: vi.fn(() => ({
          switchTo: vi.fn(),
          hotspotContainer: () => ({ createHotspot: vi.fn() }),
        })),
        controls: () => ({ registerMethod: vi.fn() }),
        startMovement: vi.fn(),
        stopMovement: vi.fn(),
        setIdleMovement: vi.fn(),
        destroy: vi.fn(),
      }
    }),
    autorotate: vi.fn(() => vi.fn()),
    ElementPressControlMethod: vi.fn(),
    ImageUrlSource: { fromString: vi.fn(() => ({})) },
    CubeGeometry: vi.fn(function () {}),
    RectilinearView: vi.fn(function () {
      return { setParameters: vi.fn() }
    }),
  }
  window.Marzipano.RectilinearView.limit = {
    traditional: vi.fn(() => ({})),
  }
}

async function renderViewer(props = {}) {
  const onReady = vi.fn()
  const utils = render(
    <PanoramaViewer location={location} onReady={onReady} {...props} />
  )
  await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1))
  return { ...utils, onReady }
}

describe('PanoramaViewer', () => {
  beforeEach(() => {
    vi.resetModules()
    installVendorMocks()
  })

  afterEach(() => {
    delete window.Marzipano
    delete window.bowser
    delete window.screenfull
  })

  it('creates a viewer and switches to the initial scene', async () => {
    const { onReady } = await renderViewer()

    expect(onReady).toHaveBeenCalledTimes(1)
    expect(window.Marzipano.Viewer).toHaveBeenCalledTimes(1)
    expect(window.Marzipano.Viewer.mock.results[0].value.createScene).toHaveBeenCalledTimes(
      APP_DATA.scenes.length,
    )
    expect(
      screen.getByLabelText('360 degree view of Glitch Tower Lobby'),
    ).toBeInTheDocument()

    await waitFor(() => {
      const current = document.querySelector('#sceneList .scene.current')
      expect(current).toHaveAttribute('data-id', INITIAL_SCENE_ID)
    })
    const firstScene = APP_DATA.scenes.find((scene) => scene.id === INITIAL_SCENE_ID)
    expect(document.querySelector('#titleBar .sceneName')).toHaveTextContent(
      firstScene.name,
    )
  })

  it('does not re-initialize the viewer when the location changes', async () => {
    const { rerender } = await renderViewer()

    rerender(<PanoramaViewer location={secondLocation} />)

    await waitFor(() => {
      expect(
        screen.getByLabelText('360 degree view of Glitch Tower Library'),
      ).toBeInTheDocument()
    })
    expect(window.Marzipano.Viewer).toHaveBeenCalledTimes(1)
    expect(window.__panoramaViewer.getCurrentSceneId()).toBe(INITIAL_SCENE_ID)
  })

  it('keeps the most recently selected scene on rapid location change (FR-013)', async () => {
    const { rerender } = await renderViewer()

    await act(async () => {
      window.__panoramaViewer.switchToSceneId(FIFTH_FLOOR_SCENE_ID)
    })
    rerender(<PanoramaViewer location={secondLocation} />)

    // Let any pending initialization timeouts run before asserting, so a
    // regression that reverts to the LG scene would be caught here.
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(window.__panoramaViewer.getCurrentSceneId()).toBe(FIFTH_FLOOR_SCENE_ID)
    const fifthFloorScene = APP_DATA.scenes.find(
      (scene) => scene.id === FIFTH_FLOOR_SCENE_ID,
    )
    expect(document.querySelector('#titleBar .sceneName')).toHaveTextContent(
      fifthFloorScene.name,
    )
    expect(window.Marzipano.Viewer).toHaveBeenCalledTimes(1)
  })

  it('cleans up the scene-switch bridge on unmount', async () => {
    const { unmount } = await renderViewer()
    expect(window.__panoramaViewer).toBeDefined()

    unmount()

    expect(window.__panoramaViewer).toBeUndefined()
  })

  it('shows a friendly fallback when the panorama is missing', async () => {
    const onError = vi.fn()
    render(
      <PanoramaViewer
        location={{ ...location, panorama: undefined }}
        onError={onError}
      />
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(MISSING_MESSAGE)
    expect(onError).toHaveBeenCalledWith(MISSING_MESSAGE)
    expect(window.Marzipano.Viewer).not.toHaveBeenCalled()
  })

  it('shows the missing panorama message when no location is selected', async () => {
    render(<PanoramaViewer />)

    expect(await screen.findByRole('alert')).toHaveTextContent(MISSING_MESSAGE)
  })

  it('does not show the missing panorama message for a valid panorama', async () => {
    await renderViewer()

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText(MISSING_MESSAGE)).not.toBeInTheDocument()
  })

  it('presses the view controls with arrow keys', async () => {
    await renderViewer()
    const section = screen.getByLabelText('360 degree view of Glitch Tower Lobby')
    const pressed = vi.fn()
    const released = vi.fn()
    document.getElementById('viewRight').addEventListener('mousedown', pressed)
    document.getElementById('viewRight').addEventListener('mouseup', released)

    fireEvent.keyDown(section, { key: 'ArrowRight' })
    fireEvent.keyUp(section, { key: 'ArrowRight' })

    expect(pressed).toHaveBeenCalledTimes(1)
    expect(released).toHaveBeenCalledTimes(1)
  })

  it('presses a view control with the Enter key', async () => {
    await renderViewer()
    const viewIn = document.getElementById('viewIn')
    const pressed = vi.fn()
    viewIn.addEventListener('mousedown', pressed)

    fireEvent.keyDown(viewIn, { key: 'Enter' })

    expect(pressed).toHaveBeenCalledTimes(1)
  })

  it('exposes meaningful alt text for the view controls', async () => {
    await renderViewer()

    const labels = ['Pan up', 'Pan down', 'Pan left', 'Pan right', 'Zoom in', 'Zoom out']
    labels.forEach((label) => {
      expect(screen.getByAltText(label)).toBeInTheDocument()
    })
  })
})
