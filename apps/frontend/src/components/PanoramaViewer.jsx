import { useEffect, useRef, useState } from 'react'
import { createScene, createViewer, destroyViewer, switchToScene } from '../lib/marzipano'

const ROTATION_STEP = 0.08
const ZOOM_STEP = 0.1
const MAX_PITCH = Math.PI / 2

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

export default function PanoramaViewer({ location, onReady, onError }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const onReadyRef = useRef(onReady)
  const onErrorRef = useRef(onError)
  const missing = !location?.panorama
  const [status, setStatus] = useState(missing ? 'error' : 'loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    onReadyRef.current = onReady
    onErrorRef.current = onError
  }, [onReady, onError])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return undefined
    }

    if (!location?.panorama) {
      onErrorRef.current?.('This location is not available right now.')
      return undefined
    }

    let viewer
    let active = true

    try {
      viewer = createViewer(container)
      const created = createScene(viewer, location)
      viewRef.current = created.view
      switchToScene(created.scene)

      Promise.resolve().then(() => {
        if (active) {
          setStatus('ready')
          onReadyRef.current?.()
        }
      })
    } catch {
      Promise.resolve().then(() => {
        if (active) {
          setStatus('error')
          setMessage('The panorama could not be loaded. You can still use the location menu.')
          onErrorRef.current?.('The panorama could not be loaded.')
        }
      })
    }

    return () => {
      active = false
      viewRef.current = null

      destroyViewer(viewer)
    }
  }, [location])

  function handleKeyDown(event) {
    const view = viewRef.current

    if (!view || !location?.panorama) {
      return
    }

    let handled = true

    switch (event.key) {
      case 'ArrowLeft':
        view.setYaw(view.yaw() - ROTATION_STEP)
        break
      case 'ArrowRight':
        view.setYaw(view.yaw() + ROTATION_STEP)
        break
      case 'ArrowUp':
        view.setPitch(clamp(view.pitch() + ROTATION_STEP, -MAX_PITCH, MAX_PITCH))
        break
      case 'ArrowDown':
        view.setPitch(clamp(view.pitch() - ROTATION_STEP, -MAX_PITCH, MAX_PITCH))
        break
      case '+':
      case '=':
        view.setFov(clamp(view.fov() - ZOOM_STEP, location.panorama.minFov, location.panorama.maxFov))
        break
      case '-':
      case '_':
        view.setFov(clamp(view.fov() + ZOOM_STEP, location.panorama.minFov, location.panorama.maxFov))
        break
      default:
        handled = false
    }

    if (handled) {
      event.preventDefault()
    }
  }

  const locationLabel = location?.name ?? 'Campus location'

  return (
    <section
      className="relative min-h-0 flex-1 touch-none overflow-hidden bg-canvas"
      aria-label={`360 degree view of ${locationLabel}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {!missing && status === 'loading' && (
        <div
          className="absolute top-1/2 left-1/2 z-[6] grid w-[min(28rem,calc(100%_-_2rem))] -translate-x-1/2 -translate-y-1/2 justify-items-center gap-3 rounded-panel border border-line bg-surface-soft p-5 text-center"
          role="status"
          aria-live="polite"
        >
          <span
            className="size-8 animate-spin rounded-full border-[3px] border-accent/25 border-t-accent"
            aria-hidden="true"
          />
          Loading the 360 degree view...
        </div>
      )}

      {(missing || status === 'error') && (
        <div
          className="absolute top-1/2 left-1/2 z-[6] grid w-[min(28rem,calc(100%_-_2rem))] -translate-x-1/2 -translate-y-1/2 justify-items-center gap-3 rounded-panel border border-danger/50 bg-surface-soft p-5 text-center text-danger"
          role="alert"
        >
          <strong>Panorama unavailable</strong>
          <span className="text-ink">
            {missing ? 'This location is not available right now.' : message}
          </span>
        </div>
      )}

      <p className="pointer-events-none absolute top-4 left-4 z-[5] m-0 max-w-[min(22rem,calc(100%_-_10rem))] rounded-instruction border border-muted/25 bg-canvas/66 px-3 py-2.5 text-[0.82rem] text-instruction narrow:top-auto narrow:bottom-[10.5rem] narrow:left-1/2 narrow:max-w-[calc(100%_-_1.5rem)] narrow:-translate-x-1/2 narrow:text-center">
        Drag to look around. Use the arrow keys to rotate and plus or minus to zoom.
      </p>
    </section>
  )
}
