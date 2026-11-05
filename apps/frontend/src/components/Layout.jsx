import { lazy, Suspense, useEffect } from "react";
import { useTour } from "../context/useTour";
import NarrationPlayer from "./NarrationPlayer";
import Header from "./Header";
import RoomGallery from "./RoomGallery";
import Sidebar from "./Sidebar";

const PanoramaViewer = lazy(() => import("./PanoramaViewer"));

export default function Layout() {
  const {
    contentStatus,
    currentLocation,
    locations,
    sidebarOpen,
    galleryOpen,
    narrationStatus,
    errorMessage,
    selectLocation,
    toggleSidebar,
    setSidebarOpen,
    toggleGallery,
    setGalleryOpen,
    playNarration,
    pauseNarration,
    setNarrationStatus,
    retryContent,
  } = useTour();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

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

  return (
    <div className="relative h-dvh overflow-hidden bg-canvas text-ink">
      <a
        className="absolute top-3 left-3 z-[100] -translate-y-[200%] rounded-full bg-focus px-4 py-2.5 font-bold text-focus-ink no-underline focus:translate-y-0"
        href="#tour-main"
      >
        Skip to the tour
      </a>

      {/* HEADER */}
      <Header
        sidebarOpen={sidebarOpen}
        currentLocation={currentLocation}
        onToggleSidebar={toggleSidebar}
      />

      {/* SIDEBAR */}

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-x-0 top-16 bottom-0 z-20 hidden w-full border-0 bg-canvas/70 compact:block"
          aria-label="Close location menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-full min-h-0">
        <Sidebar
          locations={locations}
          currentLocationId={currentLocation?.id ?? ""}
          open={sidebarOpen}
          onSelect={selectLocation}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
        />

        <main
          id="tour-main"
          className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
          tabIndex={-1}
        >
          {contentStatus === "loading" && (
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
              <p className="max-w-[34rem] text-muted">
                Loading the campus locations and panorama viewer.
              </p>
            </div>
          )}

          {contentStatus === "error" && (
            <div
              className="grid flex-1 place-content-center justify-items-center gap-3 p-8 text-center"
              role="alert"
            >
              <h1 className="mb-0 text-[clamp(1.75rem,4vw,3rem)]">
                The tour is unavailable
              </h1>
              <p className="max-w-[34rem] text-muted">{errorMessage}</p>
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-transparent bg-accent px-4 py-2 font-bold text-accent-ink transition-colors hover:bg-accent-hover"
                onClick={retryContent}
              >
                Try again
              </button>
            </div>
          )}

          {contentStatus === "ready" && currentLocation && (
            <>
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
                <PanoramaViewer location={currentLocation} />
              </Suspense>

              <div className="absolute top-20 right-4 z-[8] compact:top-20 compact:right-3">
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface-soft px-4 py-2 font-bold text-ink transition-colors hover:border-accent hover:text-accent tiny:min-h-9 tiny:px-[0.8rem] tiny:py-[0.45rem] tiny:text-[0.85rem]"
                  aria-expanded={galleryOpen}
                  aria-controls="room-gallery"
                  onClick={toggleGallery}
                >
                  View gallery
                </button>
              </div>

              <NarrationPlayer
                narration={currentLocation.narration ?? null}
                status={narrationStatus}
                onPlay={playNarration}
                onPause={pauseNarration}
                onStatusChange={setNarrationStatus}
              />
            </>
          )}
        </main>
      </div>

      <RoomGallery
        images={currentLocation?.gallery ?? []}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  );
}
