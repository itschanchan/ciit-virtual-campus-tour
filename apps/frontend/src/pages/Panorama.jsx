import { Suspense, useCallback, useEffect, useMemo } from "react";
import { useTour } from "../context/useTour";
import {
  getFloorForLocation,
  getFloorForSceneId,
  getFloorIndex,
} from "../lib/floorSceneMap";
import { getFloorGalleryImages } from "../lib/floorGallery";
import { isCompactViewport } from "../lib/viewport";
import PanoramaViewer from "../components/PanoramaViewer";
import RoomGallery from "../components/RoomGallery";

export default function Panorama({ sidebarOpen = false }) {
  const {
    contentStatus,
    currentLocation,
    locations,
    galleryOpen,
    errorMessage,
    selectLocation,
    toggleGallery,
    setGalleryOpen,
    retryContent,
  } = useTour();

  const currentFloor = getFloorForLocation(currentLocation);
  const floorGalleryImages = useMemo(
    () => getFloorGalleryImages(currentFloor, currentLocation?.name),
    [currentFloor, currentLocation?.name],
  );
  const galleryImages =
    floorGalleryImages.length > 0
      ? floorGalleryImages
      : (currentLocation?.gallery ?? []);
  const closeGallery = useCallback(() => {
    setGalleryOpen(false);
  }, [setGalleryOpen]);

  useEffect(() => {
    if (!currentLocation) {
      return;
    }

    const currentIndex = locations.findIndex(
      (location) => location.id === currentLocation.id,
    );
    const adjacentLocations = [
      locations[currentIndex - 1],
      locations[currentIndex + 1],
    ].filter(Boolean);

    for (const adjacent of adjacentLocations) {
      const previewUrl = adjacent.panorama?.previewUrl;

      if (previewUrl) {
        const image = new Image();
        image.src = previewUrl;
      }
    }
  }, [currentLocation, locations]);

  // Sync the sidebar's active floor button when the displayed panorama
  // scene changes (Rule 1: Button Sync).
  const handleSceneChange = useCallback((sceneId) => {
    const floor = getFloorForSceneId(sceneId);
    if (!floor) {
      return;
    }

    const floorIndex = getFloorIndex(floor);
    const location = locations.find((loc) => loc.order === floorIndex);

    // Guard: skip if already at the target location to prevent
    // selectLocation → re-render → handleSceneChange → selectLocation loops.
    if (location && location.id !== currentLocation.id) {
      selectLocation(location.id);
    }
  }, [locations, selectLocation, currentLocation]);

  if (contentStatus === "loading") {
    return (
      <div
        className="grid flex-1 place-content-center justify-items-center gap-3 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <span
          className="size-8 animate-spin rounded-full border-[3px] border-accent/25 border-t-accent"
          aria-hidden="true"
        />
        <h1 className="mb-0 text-[clamp(1.75rem,4vw,3rem)]">
          Preparing the tour
        </h1>
        <p className="max-w-136 text-muted">
          Loading the campus locations and panorama viewer.
        </p>
      </div>
    );
  }

  if (contentStatus === "error") {
    return (
      <div
        className="grid flex-1 place-content-center justify-items-center gap-3 p-8 text-center"
        role="alert"
      >
        <h1 className="mb-0 text-[clamp(1.75rem,4vw,3rem)]">
          The tour is unavailable
        </h1>
        <p className="max-w-136 text-muted">{errorMessage}</p>
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-transparent bg-accent px-4 py-2 font-bold text-accent-ink transition-colors hover:bg-accent-hover"
          onClick={retryContent}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      {contentStatus === "ready" && (
        <>
          {/* Panorama loading state */}
          <Suspense
            fallback={
              <div
                className="grid flex-1 place-content-center justify-items-center gap-3 p-8 text-center"
                role="status"
                aria-live="polite"
              >
                <span
                  className="size-8 animate-spin rounded-full border-[3px] border-accent/25 border-t-accent"
                  aria-hidden="true"
                />
                <h1 className="mb-0 text-[clamp(1.75rem,4vw,3rem)]">
                  Opening the panorama
                </h1>
              </div>
            }
          >
            <PanoramaViewer
              location={currentLocation}
              onSceneChange={handleSceneChange}
            />
          </Suspense>

          {currentLocation && !(
            sidebarOpen && isCompactViewport()
          ) && (
            <>
              <div className="absolute top-20 right-4 z-8 compact:top-20 compact:right-3">
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface-soft px-4 py-2 font-bold text-ink transition-colors hover:border-accent hover:text-accent tiny:min-h-9 tiny:px-[0.8rem] tiny:py-[0.45rem] tiny:text-[0.85rem]"
                  aria-expanded={galleryOpen}
                  aria-controls="room-gallery"
                  aria-haspopup="dialog"
                  onClick={toggleGallery}
                >
                  View gallery
                </button>
              </div>
            </>
          )}
        </>
      )}

      <RoomGallery
        key={currentLocation?.id ?? "empty"}
        images={galleryImages}
        open={galleryOpen}
        onClose={closeGallery}
        sidebarOpen={sidebarOpen}
        floorLabel={currentFloor ?? ""}
      />
    </>
  );
}
