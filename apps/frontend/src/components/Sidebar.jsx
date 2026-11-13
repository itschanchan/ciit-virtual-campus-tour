import { useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Popover from "@mui/material/Popover";
import { FLOOR_SEQUENCE, FLOOR_SCENE_MAP } from "../lib/floorSceneMap";
import { isCompactViewport } from "../lib/viewport";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import LanguageIcon from "@mui/icons-material/Language";
import ReplyIcon from "@mui/icons-material/Reply";
import AboutDialog from "./AboutDialog";
import ShareDialog from "./ShareDialog";

const LOCKED_FLOORS = new Set(["1F", "2F", "3F", "10F", "11F"]);
const POPOVER_DELAY_MS = 1500;
const ACKNOWLEDGEMENT_MS = 320;

const PAIRED_FLOORS = [["5F", "5M"]];

const ACTION_CLASS =
  "text-ink border-line bg-surface-strong/50 hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition-colors";

function buildFloorItems(locations) {
  // Match each floor to its location by floor label position (order), not by
  // array index. Index-based matching breaks when locations do not cover every
  // floor in sequence order (e.g. order 0 = LG, order 5 = 4F): then UG would
  // incorrectly receive 4F's data and 4F would receive nothing.
  const locationByOrder = new Map();
  for (const location of locations) {
    locationByOrder.set(location.order, location);
  }

  const items = FLOOR_SEQUENCE.map((floor, index) => ({
    floor,
    location: locationByOrder.get(index) ?? null,
  }));

  return items.reverse();
}

function getPairGroup(floor, entries = PAIRED_FLOORS) {
  return entries.find((group) => group.includes(floor)) ?? null;
}

function buildFloorRows(items) {
  const rows = [];
  const grouped = new Set();

  for (const item of items) {
    if (grouped.has(item.floor)) {
      continue;
    }

    const pairGroup = getPairGroup(item.floor);

    if (!pairGroup) {
      rows.push({ kind: "single", entries: [item] });
      continue;
    }

    // Spec 010 FR-001: reverse so the pair renders 5F then 5M.
    const entries = items
      .filter((candidate) => pairGroup.includes(candidate.floor))
      .reverse();
    entries.forEach((entry) => grouped.add(entry.floor));
    rows.push({ kind: entries.length > 1 ? "pair" : "single", entries });
  }

  return rows;
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

function markReducedMotionAcknowledgement(element) {
  element.classList.add("floor-acknowledgement");
}

function clearReducedMotionAcknowledgement(element) {
  if (!element) {
    return;
  }

  element.classList.remove("floor-acknowledgement");
}

function getFloorStatus(location) {
  if (!location) {
    return null;
  }

  if (!location.panorama) {
    return "This location is unavailable.";
  }

  return null;
}

function SidebarLogo({ logoUrl }) {
  return (
    <div className="border-line compact:mb-4 narrow:mb-3 mb-5 flex flex-col items-center gap-2 border-b pb-5 text-center">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="CIIT logo"
          className="compact:h-12 narrow:h-10 h-16 w-auto"
        />
      ) : (
        <span className="rounded-mark bg-accent text-accent-ink compact:text-base narrow:text-sm px-3 py-1 text-lg font-black tracking-[0.12em]">
          CIIT
        </span>
      )}
      {/* <p className="mb-0 text-[0.8rem] font-bold tracking-[0.12em] text-ink uppercase">
        360° Virtual Campus Tour
      </p> */}
    </div>
  );
}

function FloorButton({ floor, location, current, onSelect, onLocked }) {
  const locked = LOCKED_FLOORS.has(floor);
  const available = Boolean(location?.panorama);
  const disabled = !locked && !available;
  const status = getFloorStatus(location);

  function handleClick(event) {
    if (locked) {
      onLocked(floor, event);
      return;
    }

    if (location) {
      onSelect(location.id);
    }

    // Switch the panorama viewer to this floor's designated first scene.
    const sceneId = FLOOR_SCENE_MAP[floor];
    if (sceneId && typeof window !== "undefined") {
      window.__panoramaViewer?.switchToSceneId(sceneId);
    }
  }

  const stateClass = current
    ? "border-accent bg-accent-soft"
    : "border-line bg-surface-strong/50";
  const interactionClass = locked
    ? "bg-surface-strong/30 text-muted"
    : "enabled:hover:translate-x-0.5 enabled:hover:border-accent enabled:hover:bg-surface-strong/90";
  const detailClass = current ? "text-selected-ink" : "text-muted";

  // Explicit accessible name so "1F" and "OFF LIMITS" read as separate
  // words (nested element text is otherwise concatenated without spaces).
  // The location name is only announced when the floor is active, matching
  // the visual display (Rule 2: location ID only on the active button).
  const accessibleName = [
    floor,
    locked ? "OFF LIMITS" : "",
    current && location ? location.name : "",
    status ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={`text-ink grid w-fit items-center gap-1 rounded-full px-3 py-2 text-left transition ${stateClass} ${interactionClass}`}
      aria-label={accessibleName}
      aria-current={current ? "true" : undefined}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-sm font-black tracking-[0.08em]">{floor}</span>
        {locked && (
          <span className="text-xs font-bold tracking-[0.08em] uppercase">
            OFF LIMITS
          </span>
        )}
      </span>
      {current && location && (
        <span className={`font-bold ${detailClass}`}>{location.name}</span>
      )}
      {status && (
        <span className={`text-xs leading-snug ${detailClass}`}>{status}</span>
      )}
    </button>
  );
}

function FloorPair({ entries, currentLocationId, onSelect, onLocked }) {
  return (
    <div
      role="group"
      aria-label="Fifth-floor levels"
      className="narrow:gap-2 flex max-w-full justify-center gap-1.5"
    >
      {entries.map(({ floor, location }) => (
        <FloorButton
          key={floor}
          floor={floor}
          location={location}
          current={location?.id === currentLocationId}
          onSelect={onSelect}
          onLocked={onLocked}
        />
      ))}
    </div>
  );
}

function FloorRow({ row, currentLocationId, onSelect, onLocked }) {
  if (row.kind === "pair") {
    return (
      <FloorPair
        entries={row.entries}
        currentLocationId={currentLocationId}
        onSelect={onSelect}
        onLocked={onLocked}
      />
    );
  }

  const { floor, location } = row.entries[0];

  return (
    <FloorButton
      floor={floor}
      location={location}
      current={location?.id === currentLocationId}
      onSelect={onSelect}
      onLocked={onLocked}
    />
  );
}

function FloorList({ items, currentLocationId, onSelect, onLocked }) {
  const rows = buildFloorRows(items);

  return (
    <nav aria-label="Campus floors">
      <ul className="m-0 grid list-none gap-[0.6rem] p-0">
        {rows.map((row) => (
          <li key={row.entries[0].floor} className="flex justify-center">
            <FloorRow
              row={row}
              currentLocationId={currentLocationId}
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
  const [shareOpen, setShareOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const popoverTimerRef = useRef(null);
  const acknowledgementTimerRef = useRef(null);
  const acknowledgedElementRef = useRef(null);
  const floorItems = buildFloorItems(locations);

  useEffect(() => {
    return () => {
      if (popoverTimerRef.current !== null) {
        window.clearTimeout(popoverTimerRef.current);
      }

      if (acknowledgementTimerRef.current !== null) {
        window.clearTimeout(acknowledgementTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (open) {
      return;
    }

    if (popoverTimerRef.current !== null) {
      window.clearTimeout(popoverTimerRef.current);
      popoverTimerRef.current = null;
    }
  }, [open]);

  function clearPendingPopover() {
    if (popoverTimerRef.current === null) {
      return;
    }

    window.clearTimeout(popoverTimerRef.current);
    popoverTimerRef.current = null;
  }

  function clearAcknowledgement() {
    if (acknowledgementTimerRef.current !== null) {
      window.clearTimeout(acknowledgementTimerRef.current);
      acknowledgementTimerRef.current = null;
    }

    if (acknowledgedElementRef.current) {
      clearReducedMotionAcknowledgement(acknowledgedElementRef.current);
      acknowledgedElementRef.current = null;
    }
  }

  function acknowledgeActivation(element) {
    if (!element) {
      return;
    }

    if (!prefersReducedMotion()) {
      shakeElement(element);
      return;
    }

    clearAcknowledgement();
    acknowledgedElementRef.current = element;
    markReducedMotionAcknowledgement(element);
    acknowledgementTimerRef.current = window.setTimeout(
      clearAcknowledgement,
      ACKNOWLEDGEMENT_MS,
    );
  }

  function handleToggle() {
    if (open) {
      onClose?.();
      return;
    }

    setNotice(null);
    onOpen?.();
  }

  function handleSelect(locationId) {
    onSelect(locationId);

    if (isCompactViewport()) {
      onClose?.();
    }
  }

  function handleLockedFloor(floor, event) {
    const nextNotice = {
      floor,
      anchorEl: event.currentTarget,
    };

    acknowledgeActivation(event.currentTarget);

    if (notice) {
      setNotice(nextNotice);
      return;
    }

    clearPendingPopover();
    popoverTimerRef.current = window.setTimeout(() => {
      popoverTimerRef.current = null;
      setNotice(nextNotice);
    }, POPOVER_DELAY_MS);
  }

  function handleCloseNotice() {
    clearPendingPopover();
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
        className={`border-line bg-surface/86 narrow:bg-surface/86 compact:w-[min(20rem,86vw)] narrow:w-full compact:shadow-sidebar narrow:shadow-sidebar narrow:z-50 absolute top-0 bottom-0 left-0 z-30 overflow-hidden border-r transition-all duration-300 ease-in-out ${shellState}`}
        aria-label="Campus floors"
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={`compact:w-[min(20rem,86vw)] narrow:w-full relative flex h-full w-80 flex-col transition-opacity duration-200 ${contentState}`}
        >
          {open && (
            <button
              type="button"
              className="bg-surface/86 text-ink hover:border-accent hover:text-accent narrow:inline-flex absolute top-4 left-4 z-50 hidden size-10 items-center justify-center transition-colors"
              aria-label="Close location menu"
              aria-controls="location-sidebar"
              onClick={onClose}
            >
              <CloseIcon></CloseIcon>
            </button>
          )}

          <div
            data-testid="sidebar-scroll-body"
            className="compact:pt-2 narrow:px-4 narrow:pt-16 narrow:pb-4 flex min-h-0 flex-1 flex-col overflow-y-auto p-5 pt-5"
          >
            <SidebarLogo logoUrl={logoUrl} />

            <div className="mb-4">
              <p className="text-accent compact:text-sm narrow:text-xs mb-1.5 text-xs font-extrabold tracking-[0.16em] uppercase">
                Explore
              </p>
              <h2 className="compact:text-2xl narrow:text-lg mb-0 text-xl">
                Campus Floors
              </h2>
            </div>

            <FloorList
              items={floorItems}
              currentLocationId={currentLocationId}
              onSelect={handleSelect}
              onLocked={handleLockedFloor}
            />

            <div
              data-testid="sidebar-action-row"
              className="narrow:gap-2 compact:pt-3 mt-auto flex flex-wrap items-center justify-center gap-3 pt-5"
            >
              <a
                href="https://www.ciit.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CIIT official website"
                className={ACTION_CLASS}
              >
                <LanguageIcon fontSize="small" />
                <span>CIIT Website</span>
              </a>

              <button
                type="button"
                aria-label="Share this virtual tour"
                className={ACTION_CLASS}
                onClick={() => setShareOpen(true)}
              >
                <ReplyIcon
                  fontSize="small"
                  sx={{ transform: "scaleX(-1)" }}
                ></ReplyIcon>
                <span>Share</span>
              </button>

              <button
                type="button"
                aria-label="About this virtual tour"
                className={ACTION_CLASS}
                onClick={() => setAboutOpen(true)}
              >
                <InfoIcon fontSize="small" />
                <span>About</span>
              </button>
            </div>
          </div>

          <footer className="narrow:px-4 shrink-0 py-3 text-center">
            <p className="text-muted m-0 text-xs">
              © 2026 CIIT. All rights reserved.
            </p>
          </footer>
        </div>
      </aside>

      <ShareDialog
        open={open && shareOpen}
        onClose={() => setShareOpen(false)}
      />
      <AboutDialog
        open={open && aboutOpen}
        onClose={() => setAboutOpen(false)}
      />

      {/* Sidebar Toggle */}
      <button
        type="button"
        className={`compact:h-45 narrow:h-36 narrow:top-24 compact:size-9 narrow:size-7 compact:rounded-r-full narrow:rounded-full narrow:border border-line bg-surface/86 text-ink hover:border-accent hover:text-accent narrow:hidden fixed top-1/2 z-40 -ml-px inline-flex size-8 h-40 -translate-y-1/2 items-center justify-center rounded-r-full border border-l-0 transition-all duration-300 ease-in-out ${togglePosition}`}
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
        open={open && Boolean(notice)}
        anchorEl={notice?.anchorEl ?? null}
        onClose={handleCloseNotice}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        slotProps={{
          transition: {
            onExited: handleCloseNotice,
          },
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
