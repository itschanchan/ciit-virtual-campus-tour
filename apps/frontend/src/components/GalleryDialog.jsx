import { useEffect, useMemo, useRef, useState } from "react";

function GalleryImage({ image }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        className="rounded-gallery-item bg-surface-strong text-muted grid aspect-16/10 max-h-[calc(90dvh-10rem)] w-full place-items-center px-6 text-center"
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      className="rounded-gallery-item bg-surface-strong block aspect-16/10 max-h-[calc(90dvh-10rem)] w-full object-cover"
      src={image.src}
      alt={image.alt}
      onError={() => setFailed(true)}
    />
  );
}

export default function GalleryDialog({
  images = [],
  open = false,
  onClose,
  floorLabel = "",
}) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.order - b.order),
    [images],
  );

  const imageCount = sortedImages.length;
  const activeIndex = currentIndex < imageCount ? currentIndex : 0;
  const activeImage = sortedImages[activeIndex] ?? null;
  const hasMultipleImages = imageCount > 1;

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

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        setCurrentIndex((index) => (index - 1 + imageCount) % imageCount);
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        setCurrentIndex((index) => (index + 1) % imageCount);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      const previousElement = previousFocusRef.current;
      previousFocusRef.current = null;

      if (previousElement?.isConnected) {
        previousElement.focus?.();
        return;
      }

      document.getElementById("tour-main")?.focus();
    };
  }, [open, onClose, hasMultipleImages, imageCount]);

  function showPreviousImage() {
    setCurrentIndex((index) => (index - 1 + imageCount) % imageCount);
  }

  function showNextImage() {
    setCurrentIndex((index) => (index + 1) % imageCount);
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="bg-canvas/78 backdrop-blur-gallery tiny:p-0 fixed inset-0 z-60 grid place-items-center p-5 transition-opacity duration-300 opacity-100"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        id="room-gallery"
        className="rounded-gallery-panel bg-surface shadow-gallery tiny:min-h-dvh tiny:w-full tiny:max-h-dvh tiny:rounded-none tiny:p-3 max-h-[min(90dvh,52rem)] w-[min(68rem,100%)] transition-all duration-300 ease-out sm:p-5 translate-y-0 scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-gallery-title"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-accent mb-1.5 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">
              {floorLabel
                ? `${floorLabel} floor gallery`
                : "Room details"}
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
            className="bg-surface text-ink hover:text-accent inline-flex size-11 shrink-0 items-center justify-center gap-1.5 rounded-full text-xl leading-none transition-colors"
            aria-label="Close gallery"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {activeImage ? (
          <div className="grid gap-3">
            <div className="relative">
              <div
                key={`${activeImage.src}-${activeIndex}`}
                className="gallery-image-enter"
              >
                <GalleryImage image={activeImage} />
              </div>

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    className="bg-surface/90 text-ink hover:text-accent absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-2xl leading-none transition-colors"
                    aria-label="Previous image"
                    onClick={showPreviousImage}
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  <button
                    type="button"
                    className="bg-surface/90 text-ink hover:text-accent absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-2xl leading-none transition-colors"
                    aria-label="Next image"
                    onClick={showNextImage}
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted m-0 text-[0.85rem]">
                {activeImage.caption}
              </p>
              <p
                className="text-muted m-0 text-[0.85rem]"
                aria-live="polite"
              >
                {activeIndex + 1} / {imageCount}
              </p>
            </div>
          </div>
        ) : (
          <p className="rounded-gallery-item text-muted m-0 px-4 py-8 text-center">
            No gallery images are available for this location yet.
          </p>
        )}
      </section>
    </div>
  );
}