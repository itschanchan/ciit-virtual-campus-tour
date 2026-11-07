// `onToggleSidebar` is intentionally omitted from the props for now: the
// Header's toggle button is commented out (the Sidebar exposes its own
// toggle). Re-add the prop if the button is restored.
export default function Header({ sidebarOpen, currentLocation }) {
  return (
    <div className="absolute inset-x-0 top-0 z-40">
      <header className="relative z-40 flex min-h-16 items-center gap-4 bg-transparent px-5 py-3 compact:px-3.5 compact:py-2.5">
        {/* <button
          type="button"
          className="inline-flex size-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface text-xl leading-none text-ink transition-colors hover:border-accent hover:text-accent"
          aria-label={
            sidebarOpen ? "Close location menu" : "Open location menu"
          }
          aria-expanded={sidebarOpen}
          aria-controls="location-sidebar"
          onClick={onToggleSidebar}
        >
          <span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span>
        </button> */}

        <div className="flex min-w-0 items-baseline gap-2.5">
          <img
            src="/img/CIIT_Logo_Inverse_cropped.svg"
            alt="CIIT logo"
            className={`h-7 w-auto ${sidebarOpen ? "hidden" : ""}`}
          />
          {/* <span
            className={`font-bold whitespace-nowrap compact:text-[0.92rem] tiny:hidden ${sidebarOpen ? "hidden" : ""}`}
          >
            Virtual Campus Tour
          </span> */}
        </div>

        <p
          className="ml-auto overflow-hidden text-ellipsis whitespace-nowrap text-[0.95rem] text-muted compact:max-w-[38vw] compact:text-[0.82rem] tiny:max-w-[52vw]"
          aria-live="polite"
        >
          {currentLocation?.name ?? "Loading campus locations"}
        </p>
      </header>
    </div>
  );
}
