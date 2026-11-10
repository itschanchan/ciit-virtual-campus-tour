import { useEffect, useRef } from "react";
import { isCompactViewport } from "../lib/viewport";

export default function RoomGallery({ images, open, onClose, sidebarOpen = false }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  // Hide the room gallery when the sidebar is open on a mobile viewport so
  // the sidebar's tinted background is the sole focus.
  if (sidebarOpen && isCompactViewport()) {
    return null;
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="bg-canvas/78 backdrop-blur-gallery tiny:p-0 fixed inset-0 z-60 grid place-items-center p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        id="room-gallery"
        className="rounded-gallery-panel border-line bg-surface shadow-gallery tiny:min-h-dvh tiny:w-full tiny:max-h-dvh tiny:rounded-none max-h-[min(88dvh,52rem)] w-[min(68rem,100%)] overflow-y-auto border p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-gallery-title"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-accent mb-1.5 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">
              Room details
            </p>
            <h2
              id="room-gallery-title"
              className="mb-0 text-[clamp(1.4rem,3vw,2rem)]"
            >
              Gallery
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="border-line bg-surface text-ink hover:border-accent hover:text-accent inline-flex size-10 items-center justify-center gap-1.5 rounded-full border text-xl leading-none transition-colors"
            aria-label="Close gallery"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {sortedImages.length === 0 ? (
          <p className="rounded-gallery-item border-line text-muted m-0 border border-dashed px-4 py-8 text-center">
            No gallery images are available for this location yet.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(16rem,100%),1fr))] gap-4">
            {sortedImages.map((image, index) => (
              <figure
                key={`${image.src}-${image.order}`}
                className="rounded-gallery-item border-line bg-surface-strong m-0 overflow-hidden border"
              >
                <img
                  className="block aspect-16/10 w-full object-cover"
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {image.caption && (
                  <figcaption className="text-muted px-[0.9rem] py-3 text-[0.85rem]">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
