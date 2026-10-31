import { useEffect, useRef } from 'react'

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
      className="fixed inset-0 z-[60] grid place-items-center bg-canvas/78 p-5 backdrop-blur-gallery tiny:p-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        id="room-gallery"
        className="max-h-[min(88dvh,52rem)] w-[min(68rem,100%)] overflow-y-auto rounded-gallery-panel border border-line bg-surface p-5 shadow-gallery tiny:min-h-dvh tiny:w-full tiny:max-h-dvh tiny:rounded-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-gallery-title"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1.5 text-[0.72rem] font-extrabold tracking-[0.16em] text-accent uppercase">
              Room details
            </p>
            <h2 id="room-gallery-title" className="mb-0 text-[clamp(1.4rem,3vw,2rem)]">
              Gallery
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex size-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface text-xl leading-none text-ink transition-colors hover:border-accent hover:text-accent"
            aria-label="Close gallery"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {sortedImages.length === 0 ? (
          <p className="m-0 rounded-gallery-item border border-dashed border-line px-4 py-8 text-center text-muted">
            No gallery images are available for this location yet.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(16rem,100%),1fr))] gap-4">
            {sortedImages.map((image, index) => (
              <figure
                key={`${image.src}-${image.order}`}
                className="m-0 overflow-hidden rounded-gallery-item border border-line bg-surface-strong"
              >
                <img
                  className="block aspect-[16/10] w-full object-cover"
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                {image.caption && (
                  <figcaption className="px-[0.9rem] py-3 text-[0.85rem] text-muted">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
