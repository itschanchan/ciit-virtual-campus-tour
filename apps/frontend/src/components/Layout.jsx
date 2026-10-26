import { lazy, Suspense, useEffect } from 'react'
import { useTour } from '../context/useTour'
import NarrationPlayer from './NarrationPlayer'
import RoomGallery from './RoomGallery'
import Sidebar from './Sidebar'

const PanoramaViewer = lazy(() => import('./PanoramaViewer'))

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
  } = useTour()

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen, setSidebarOpen])

  useEffect(() => {
    if (!currentLocation) {
      return
    }

    const currentIndex = locations.findIndex((location) => location.id === currentLocation.id)
    const adjacentLocations = [
      locations[currentIndex - 1],
      locations[currentIndex + 1],
    ].filter(Boolean)

    for (const adjacent of adjacentLocations) {
      const previewUrl = adjacent.panorama?.previewUrl

      if (previewUrl) {
        const image = new Image()
        image.src = previewUrl
      }
    }
  }, [currentLocation, locations])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#tour-main">
        Skip to the tour
      </a>

      <header className="app-header">
        <button
          type="button"
          className="icon-button menu-button"
          aria-label={sidebarOpen ? 'Close location menu' : 'Open location menu'}
          aria-expanded={sidebarOpen}
          aria-controls="location-sidebar"
          onClick={toggleSidebar}
        >
          <span aria-hidden="true">{sidebarOpen ? '×' : '☰'}</span>
        </button>

        <div className="brand">
          <span className="brand-mark">CIIT</span>
          <span className="brand-name">Virtual Campus Tour</span>
        </div>

        <p className="current-location" aria-live="polite">
          {currentLocation?.name ?? 'Loading campus locations'}
        </p>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close location menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="app-body">
        <Sidebar
          locations={locations}
          currentLocationId={currentLocation?.id ?? ''}
          open={sidebarOpen}
          onSelect={selectLocation}
          onClose={() => setSidebarOpen(false)}
        />

        <main id="tour-main" className="tour-main" tabIndex={-1}>
          {contentStatus === 'loading' && (
            <div className="tour-state" role="status" aria-live="polite">
              <span className="spinner" aria-hidden="true" />
              <h1>Preparing the tour</h1>
              <p>Loading the campus locations and panorama viewer.</p>
            </div>
          )}

          {contentStatus === 'error' && (
            <div className="tour-state" role="alert">
              <h1>The tour is unavailable</h1>
              <p>{errorMessage}</p>
              <button type="button" className="primary-button" onClick={retryContent}>
                Try again
              </button>
            </div>
          )}

          {contentStatus === 'ready' && currentLocation && (
            <>
              <Suspense
                fallback={
                  <div className="tour-state" role="status" aria-live="polite">
                    <span className="spinner" aria-hidden="true" />
                    <h1>Opening the panorama</h1>
                  </div>
                }
              >
                <PanoramaViewer location={currentLocation} />
              </Suspense>

              <div className="tour-toolbar">
                <button
                  type="button"
                  className="secondary-button"
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
  )
}
