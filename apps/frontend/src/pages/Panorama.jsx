import { Suspense, useCallback, useEffect, useState } from "react";
import { useTour } from "../context/useTour";
import {
  getFloorForSceneId,
  getFloorIndex,
} from "../lib/floorSceneMap";
import PanoramaViewer from "../components/PanoramaViewer";

export default function Panorama() {
  const {
    contentStatus,
    currentLocation,
    locations,
    errorMessage,
    selectLocation,
    setCurrentSceneId,
    retryContent,
    activeNarration,
    narrationStatus,
    playNarration,
  } = useTour();
  const [viewerReady, setViewerReady] = useState(false);

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

  // Start the initial narration one second after the viewer is ready.
  // Later floor changes play immediately through the scene resolution.
  useEffect(() => {
    if (!viewerReady || !activeNarration || narrationStatus !== "idle") {
      return undefined;
    }

    const timer = setTimeout(() => {
      playNarration();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [viewerReady, activeNarration, narrationStatus, playNarration]);

  // Sync the sidebar's active floor button when the displayed panorama
  // scene changes (Rule 1: Button Sync).
  const handleSceneChange = useCallback((sceneId) => {
    setCurrentSceneId(sceneId);

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
  }, [locations, selectLocation, setCurrentSceneId, currentLocation]);

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
              onReady={() => setViewerReady(true)}
              onSceneChange={handleSceneChange}
            />
          </Suspense>
        </>
      )}
    </>
  );
}
