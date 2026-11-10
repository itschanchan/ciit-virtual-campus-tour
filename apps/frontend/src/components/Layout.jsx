import { useEffect, useState } from "react";
import { useTour } from "../context/useTour";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Panorama from "../pages/Panorama";
import Dashboard from "../pages/Dashboard";
import FloatingMenu from "./FloatingMenu";

export default function Layout() {
  const {
    sidebarOpen,
    galleryOpen,
    currentLocation,
    locations,
    selectLocation,
    toggleSidebar,
    setSidebarOpen,
    narrationStatus,
    isMuted,
    playNarration,
    pauseNarration,
    setNarrationStatus,
    toggleMute,
  } = useTour();

  const [activeView] = useState("panorama");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && sidebarOpen && !galleryOpen) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, galleryOpen, setSidebarOpen]);

  return (
    <div className="bg-canvas text-ink relative h-dvh overflow-hidden">
      {/* HEADER */}
      <Header
        sidebarOpen={sidebarOpen}
        currentLocation={currentLocation}
        onToggleSidebar={toggleSidebar}
      />

      {/* FLOATING MENU - narration controls at center bottom */}
      <FloatingMenu
        narration={currentLocation?.narration ?? null}
        status={narrationStatus}
        muted={isMuted}
        onPlay={playNarration}
        onPause={pauseNarration}
        onStatusChange={setNarrationStatus}
        onMuteToggle={toggleMute}
        sidebarOpen={sidebarOpen}
      />

      {/* SIDEBAR */}

      {sidebarOpen && (
        <button
          type="button"
          className="compact:block fixed inset-x-0 top-16 bottom-0 z-20 hidden w-full border-0 bg-transparent"
          aria-label="Close location menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="relative flex h-full min-h-0 w-full flex-col">
        <Sidebar
          locations={locations}
          currentLocationId={currentLocation?.id ?? ""}
          open={sidebarOpen}
          onSelect={selectLocation}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
          logoUrl="/img/ciit_glitch_virtual_tour_logo.png"
        />

        <main
          id="tour-main"
          className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden"
          tabIndex={-1}
        >
          {activeView === "panorama" ? (
            <Panorama sidebarOpen={sidebarOpen} />
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </div>
  );
}
