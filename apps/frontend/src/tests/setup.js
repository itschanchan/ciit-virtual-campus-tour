import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('marzipano', () => {
  const createView = () => ({
    yaw: vi.fn(() => 0),
    pitch: vi.fn(() => 0),
    fov: vi.fn(() => 1.2),
    setYaw: vi.fn(),
    setPitch: vi.fn(),
    setFov: vi.fn(),
  })

  const createViewer = () => ({
    createScene: vi.fn(() => ({ switchTo: vi.fn(), destroy: vi.fn() })),
    destroy: vi.fn(),
    updateSize: vi.fn(),
  })

  const Viewer = vi.fn(() => createViewer())

  return {
    default: {
      Viewer,
      ImageUrlSource: { fromString: vi.fn((value) => value) },
      CubeGeometry: vi.fn(() => ({})),
      RectilinearView: Object.assign(vi.fn(() => createView()), {
        limit: { traditional: vi.fn(() => ({})) },
      }),
    },
  }
})
