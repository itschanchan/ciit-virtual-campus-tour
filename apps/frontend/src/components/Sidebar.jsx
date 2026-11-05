import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Popover from "@mui/material/Popover";
import { isCompactViewport } from "../lib/viewport";

const FLOOR_SEQUENCE = [
  "UG",
  "LG",
  "1F",
  "2F",
  "3F",
  "4F",
  "5F",
  "5M",
  "6F",
  "7F",
  "8F",
  "9F",
  "10F",
  "11F",
];

const LOCKED_FLOORS = new Set(["1F", "2F", "3F", "10F", "11F"]);

function buildFloorItems(locations) {
  const sortedLocations = [...locations].sort((a, b) => a.order - b.order);
  const items = FLOOR_SEQUENCE.map((floor, index) => ({
    floor,
    location: sortedLocations[index] ?? null,
  }));

  return items.reverse();
}

function prefersReducedMotion() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shakeElement(element) {
  if (
    !element ||
    typeof element.animate !== "function" ||
    prefersReducedMotion()
  ) {
    return;
  }

  element.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(-2px)" },
      { transform: "translateX(2px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 320, easing: "ease-in-out" },
  );
}

function getFloorStatus(location, locked) {
  if (locked) {
    return "Coming soon.";
  }

  if (!location) {
    return "No panorama available yet.";
  }

  if (!location.panorama) {
    return "This location is unavailable.";
  }

  return null;
}

function SidebarLogo({ logoUrl }) {
  return (
    <div className="mb-5 flex flex-col items-center gap-2 border-b border-line pb-5 text-center">
      {logoUrl ? (
        <img src={logoUrl} alt="CIIT logo" className="h-16 w-auto" />
      ) : (
        <span className="rounded-mark bg-accent px-3 py-1 text-lg font-black tracking-[0.12em] text-accent-ink">
          CIIT
        </span>
      )}
      <p className="mb-0 text-[0.8rem] font-bold tracking-[0.12em] text-ink uppercase">
        360 Virtual Campus Tour
      </p>
    </div>
  );
}

function FloorButton({ floor, location, current, onSelect, onLocked }) {
  const locked = LOCKED_FLOORS.has(floor);
  const available = Boolean(location?.panorama);
  const disabled = !locked && !available;
  const status = getFloorStatus(location, locked);

  function handleClick(event) {
    if (locked) {
      onLocked(floor, event);
      return;
    }

    if (location) {
      onSelect(location.id);
    }
  }

  const stateClass = current
    ? "border-accent bg-accent-soft"
    : "border-line bg-surface-strong/50";
  const interactionClass = locked
    ? "bg-surface-strong/30 text-muted"
    : "enabled:hover:translate-x-0.5 enabled:hover:border-accent enabled:hover:bg-surface-strong/90";
  const detailClass = current ? "text-selected-ink" : "text-muted";

  return (
    <button
      type="button"
      className={`grid w-full gap-1 rounded-location border px-[0.9rem] py-[0.8rem] text-left text-ink transition ${stateClass} ${interactionClass}`}
      aria-current={current ? "true" : undefined}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[0.95rem] font-black tracking-[0.08em]">
          {floor}
        </span>
        {locked && (
          <span className="text-[0.7rem] font-bold tracking-[0.08em] uppercase">
            Locked
          </span>
        )}
      </span>
      {location && (
        <span className={`font-bold ${detailClass}`}>{location.name}</span>
      )}
      {status && (
        <span className={`text-[0.82rem] leading-[1.4] ${detailClass}`}>
          {status}
        </span>
      )}
    </button>
  );
}

function FloorList({ items, currentLocationId, onSelect, onLocked }) {
  return (
    <nav aria-label="Campus floors">
      <ul className="m-0 grid list-none gap-[0.6rem] p-0">
        {items.map(({ floor, location }) => (
          <li key={floor}>
            <FloorButton
              floor={floor}
              location={location}
              current={location?.id === currentLocationId}
              onSelect={onSelect}
              onLocked={onLocked}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Sidebar({
  locations,
  currentLocationId,
  open,
  onSelect,
  onClose,
  onOpen,
  logoUrl,
}) {
  const [notice, setNotice] = useState(null);
  const floorItems = buildFloorItems(locations);

  function handleToggle() {
    if (open) {
      onClose?.();
      return;
    }

    onOpen?.();
  }

  function handleSelect(locationId) {
    onSelect(locationId);

    if (isCompactViewport()) {
      onClose?.();
    }
  }

  function handleLockedFloor(floor, event) {
    shakeElement(event.currentTarget);
    setNotice({ floor, anchorEl: event.currentTarget });
  }

  function handleCloseNotice() {
    setNotice(null);
  }

  const shellState = open ? "w-80 translate-x-0" : "w-0 -translate-x-full";
  const contentState = open ? "opacity-100" : "opacity-0";
  const togglePosition = open
    ? "left-80 compact:left-[min(20rem,86vw)]"
    : "left-0";

  return (
    <>
      <aside
        id="location-sidebar"
        className={`flex-none overflow-hidden border-r bg-surface/86 transition-all duration-300 ease-in-out compact:fixed compact:top-16 compact:bottom-0 compact:left-0 compact:z-30 compact:w-[min(20rem,86vw)] compact:shadow-sidebar ${shellState}`}
        aria-label="Campus floors"
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={`flex h-full w-80 flex-col overflow-y-auto p-5 pt-20 transition-opacity duration-200 compact:w-[min(20rem,86vw)] compact:pt-5 ${contentState}`}
        >
          <SidebarLogo logoUrl={logoUrl} />

          <div className="mb-4">
            <p className="mb-1.5 text-[0.72rem] font-extrabold tracking-[0.16em] text-accent uppercase">
              Explore
            </p>
            <h2 className="mb-0 text-xl">Campus floors</h2>
          </div>

          <FloorList
            items={floorItems}
            currentLocationId={currentLocationId}
            onSelect={handleSelect}
            onLocked={handleLockedFloor}
          />
        </div>
      </aside>

      <button
        type="button"
        className={`fixed top-1/2 z-40 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-r-full border border-l-0 border-line bg-surface text-ink shadow-sidebar transition-all duration-300 hover:border-accent hover:text-accent ${togglePosition}`}
        aria-label={open ? "Collapse campus floors" : "Expand campus floors"}
        aria-expanded={open}
        aria-controls="location-sidebar"
        onClick={handleToggle}
      >
        {open ? (
          <ChevronLeftIcon fontSize="small" />
        ) : (
          <ChevronRightIcon fontSize="small" />
        )}
      </button>

      <Popover
        open={Boolean(notice)}
        anchorEl={notice?.anchorEl ?? null}
        onClose={handleCloseNotice}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        slotProps={{
          paper: {
            role: "status",
            "aria-live": "polite",
            sx: {
              borderRadius: "var(--radius-location)",
              border: "1px solid var(--color-accent)",
              backgroundColor: "var(--color-surface-strong)",
              color: "var(--color-ink)",
              boxShadow: "var(--shadow-sidebar)",
            },
          },
        }}
      >
        <p className="m-0 px-4 py-2 text-sm font-bold">
          {notice?.floor} is coming soon.
        </p>
      </Popover>
    </>
  );
}
