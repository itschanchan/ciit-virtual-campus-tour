import Marzipano from 'marzipano'

const DEFAULT_VIEW_LIMIT_RESOLUTION = 4096

export function createViewer(element, options = {}) {
  return new Marzipano.Viewer(element, {
    controls: {
      mouseViewMode: 'drag',
      touchViewMode: 'drag',
    },
    ...options,
  })
}

export function createScene(viewer, location) {
  const panorama = location.panorama
  const source = Marzipano.ImageUrlSource.fromString(panorama.tileUrlTemplate)
  const geometry = new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }])
  const limiter = Marzipano.RectilinearView.limit.traditional(
    DEFAULT_VIEW_LIMIT_RESOLUTION,
    panorama.maxFov,
  )
  const view = new Marzipano.RectilinearView(panorama.initialView, limiter)
  const scene = viewer.createScene({
    source,
    geometry,
    view,
    pinFirstLevel: true,
  })

  return { scene, view, source }
}

export function switchToScene(scene) {
  scene.switchTo({ transitionDuration: 0 })
}

export function destroyViewer(viewer) {
  if (viewer && typeof viewer.destroy === 'function') {
    viewer.destroy()
  }
}
