import { useEffect, useRef, useState } from 'react'
import { createScene, createViewer, destroyViewer, switchToScene } from '../lib/marzipano'
import './PanoramaViewer.css'

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
      className="panorama-viewer"
      aria-label={`360 degree view of ${locationLabel}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div ref={containerRef} className="panorama-canvas" />

      {!missing && status === 'loading' && (
        <div className="panorama-status" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          Loading the 360 degree view...
        </div>
      )}

      {(missing || status === 'error') && (
        <div className="panorama-status panorama-status-error" role="alert">
          <strong>Panorama unavailable</strong>
          <span>{missing ? 'This location is not available right now.' : message}</span>
        </div>
      )}

      <p className="panorama-instructions">
        Drag to look around. Use the arrow keys to rotate and plus or minus to zoom.
      </p>
    </section>
  )
}
