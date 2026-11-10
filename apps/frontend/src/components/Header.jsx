// `onToggleSidebar` is passed from Layout to control the sidebar from the
// header's hamburger button on mobile viewports.
import MenuIcon from "@mui/icons-material/Menu";

export default function Header({
  sidebarOpen,
  currentLocation,
  onToggleSidebar,
}) {
  return (
    <div className="absolute inset-x-0 top-0 z-40">
      <header className="compact:px-3.5 compact:py-2.5 narrow:px-3 narrow:py-2 relative z-40 flex min-h-16 items-center gap-4 bg-transparent px-5 py-3">
        {!sidebarOpen && (
          <button
            type="button"
            className="bg-surface text-ink hover:border-accent hover:text-accent narrow:inline-flex hidden size-10 items-center justify-center gap-1.5 text-xl leading-none transition-colors"
            aria-label="Open location menu"
            aria-expanded={sidebarOpen}
            aria-controls="location-sidebar"
            onClick={onToggleSidebar}
          >
            <MenuIcon></MenuIcon>
          </button>
        )}

        <div className="compact:gap-2 narrow:gap-1.5 flex min-w-0 items-baseline gap-2.5">
          <img
            src="/img/CIIT_Logo_Inverse_cropped.svg"
            alt="CIIT logo"
            className={`compact:h-6 narrow:h-5 h-7 w-auto ${sidebarOpen ? "hidden" : ""}`}
          />
          {/* <span
            className={`font-bold whitespace-nowrap compact:text-[0.92rem] tiny:hidden ${sidebarOpen ? "hidden" : ""}`}
          >
            Virtual Campus Tour
          </span> */}
        </div>

        <p
          className="text-muted compact:max-w-xs compact:text-xs tiny:max-w-sm tiny:text-xs ml-auto overflow-hidden text-[0.95rem] text-ellipsis whitespace-nowrap"
          aria-live="polite"
        >
          {currentLocation?.name ?? "Loading campus locations"}
        </p>
      </header>
    </div>
  );
}
