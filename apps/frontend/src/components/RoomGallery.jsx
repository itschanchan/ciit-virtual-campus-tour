import { useEffect, useRef } from 'react'
import './RoomGallery.css'

export default function RoomGallery({ images, open, onClose }) {
  const closeButtonRef = useRef(null)
  const previousFocusRef = useRef(null)
  const sortedImages = [...images].sort((a, b) => a.order - b.order)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    previousFocusRef.current = document.activeElement
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      className="gallery-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        id="room-gallery"
        className="room-gallery"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-gallery-title"
      >
        <div className="gallery-heading">
          <div>
            <p className="eyebrow">Room details</p>
            <h2 id="room-gallery-title">Gallery</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-button"
            aria-label="Close gallery"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {sortedImages.length === 0 ? (
          <p className="gallery-empty">No gallery images are available for this location yet.</p>
        ) : (
          <div className="gallery-grid">
            {sortedImages.map((image, index) => (
              <figure key={`${image.src}-${image.order}`} className="gallery-item">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
