import { useEffect, useState } from "react";
import { useTour } from "../context/useTour";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Panorama from "../pages/Panorama";
import Dashboard from "../pages/Dashboard";

export default function Layout() {
  const {
    sidebarOpen,
    currentLocation,
    locations,
    selectLocation,
    toggleSidebar,
    setSidebarOpen,
  } = useTour();

  const [activeView] = useState("panorama");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

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

      <div className="relative flex h-full w-full min-h-0 flex-col">
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
            <Panorama />
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </div>
  );
}
