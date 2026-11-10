import { useEffect, useRef, useState } from "react";
import { APP_DATA } from "../lib/data";
import { getSceneIdForFloor } from "../lib/floorSceneMap";

const MISSING_PANORAMA_MESSAGE = "No panorama available yet.";

// Switch to a scene by ID by dispatching a click on the corresponding
// scene list element (Marzipano.jsx handles the actual scene switch).
// The event must be cancelable so React's preventDefault() stops jsdom and
// browsers from following the sanitized `javascript:` href.
function switchToSceneId(sceneId) {
  if (!sceneId) return;
  const el = document.querySelector(`#sceneList .scene[data-id="${sceneId}"]`);
  if (el) {
    el.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  }
}

// View control buttons: id, icon file, margin class, accessible label.
// The margin must be a complete literal class name so Tailwind can scan and
// generate it - building it with `ml-[${value}]` at runtime never produces CSS.
const VIEW_CONTROLS = [
  [
    "up",
    "up.png",
    "ml-[-145px] compact:ml-[-120px] narrow:ml-[-95px]",
    "Pan up",
  ],
  [
    "down",
    "down.png",
    "ml-[-95px] compact:ml-[-80px] narrow:ml-[-65px]",
    "Pan down",
  ],
  [
    "left",
    "left.png",
    "ml-[-45px] compact:ml-[-35px] narrow:ml-[-25px]",
    "Pan left",
  ],
  ["right", "right.png", "ml-[5px] compact:ml-[2px] narrow:ml-0", "Pan right"],
  ["in", "plus.png", "ml-[55px] compact:ml-[45px] narrow:ml-[35px]", "Zoom in"],
  [
    "out",
    "minus.png",
    "ml-[105px] compact:ml-[85px] narrow:ml-[65px]",
    "Zoom out",
  ],
];

// Keyboard keys mapped to view control element ids. Marzipano's press
// control only listens for mouse/touch events, so keyboard support presses
// the same control elements by dispatching mousedown/mouseup (SC-005).
const KEY_CONTROL_MAP = {
  ArrowUp: "viewUp",
  ArrowDown: "viewDown",
  ArrowLeft: "viewLeft",
  ArrowRight: "viewRight",
  "+": "viewIn",
  "=": "viewIn",
  "-": "viewOut",
};

function pressControl(controlId) {
  const el = document.getElementById(controlId);
  el?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
}

function releaseControl(controlId) {
  const el = document.getElementById(controlId);
  el?.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
}

export default function PanoramaViewer({
  location,
  onReady,
  onError,
  onSceneChange,
}) {
  const containerRef = useRef(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const viewerStartedRef = useRef(false);

  // spec-004 (FR-001/FR-002): the viewer owns the missing-panorama empty
  // state. No location, no panorama, or no scene data means the alert shows
  // and the Marzipano viewer is never initialized for that content.
  const missingPanorama = !location?.panorama || APP_DATA.scenes.length === 0;

  const [viewerStatus, setViewerStatus] = useState("loading");
  const [currentSceneId, setCurrentSceneId] = useState(null);

  // Sync the sidebar when the displayed panorama scene changes
  // (Rule 1: Button Sync - sidebar buttons sync with the current panorama).
  const lastReportedSceneId = useRef(null);
  useEffect(() => {
    if (
      !onSceneChange ||
      !currentSceneId ||
      currentSceneId === lastReportedSceneId.current
    ) {
      return;
    }
    lastReportedSceneId.current = currentSceneId;
    onSceneChange(currentSceneId);
  }, [currentSceneId, onSceneChange]);

  const [sceneListOpen] = useState(false);

  // The empty state is derived, not stored: `missingPanorama` flips the
  // display straight to the alert and back when a valid panorama returns.
  const status = missingPanorama ? "error" : viewerStatus;

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
  }, [onReady, onError]);

  useEffect(() => {
    // Missing-panorama empty state: notify the parent and never initialize
    // the viewer for this content.
    if (missingPanorama) {
      onErrorRef.current?.(MISSING_PANORAMA_MESSAGE);
      return;
    }

    // Already initialized: nothing to do, the derived empty state above
    // simply stops covering the viewer again.
    if (viewerStartedRef.current) {
      return;
    }

    viewerStartedRef.current = true;

    // Render DOM skeleton first (done above), then dynamically import
    // Marzipano.jsx after mount so its IIFE queries rendered elements.
    Promise.resolve()
      .then(() => import("../components/Marzipano"))
      .then(() => {
        // Marzipano.jsx initializes on import via window globals.
        // Set the initial scene to the LG first scene `0-lg---1`.
        const initialSceneId = getSceneIdForFloor("LG");
        setCurrentSceneId(initialSceneId);

        // Give the DOM a frame to render, then trigger initial scene switch.
        setTimeout(() => {
          switchToSceneId(initialSceneId);
          setViewerStatus("ready");
          onReadyRef.current?.();
        }, 0);
      })
      .catch((err) => {
        console.error("Marzipano viewer failed to load:", err);
      });
    // Intentionally NOT keyed on `location`: the Sidebar dispatches floor
    // scene switches itself, and re-running this init on every location
    // change would revert the viewer to the LG scene (FR-002/FR-013).
    // Only the empty-state flip (spec-004) re-runs this effect.
  }, [missingPanorama]);

  // Expose scene switching for Sidebar integration via window.
  useEffect(() => {
    window.__panoramaViewer = {
      switchToSceneId,
      getCurrentSceneId: () => currentSceneId,
    };
    return () => {
      window.__panoramaViewer = undefined;
    };
  }, [currentSceneId]);

  // Track scene changes triggered by Marzipano link hotspots (DOM mutations
  // on the scene list `.scene.current` class) so React stays in sync.
  useEffect(() => {
    const sceneList = document.getElementById("sceneList");
    if (!sceneList) return;

    const observer = new MutationObserver(() => {
      const current = sceneList.querySelector(".scene.current");
      if (current) {
        const id = current.getAttribute("data-id");
        if (id && id !== currentSceneId) {
          setCurrentSceneId(id);
        }
      }
    });

    observer.observe(sceneList, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [currentSceneId]);

  const locationLabel = location?.name ?? "Campus location";

  // The title bar always shows the current scene name (spec-006 FR-004).
  // Deriving it from React state keeps ownership of the text node in React,
  // so a location change no longer overwrites Marzipano's scene switch
  // (FR-013: the most recently selected scene stays displayed).
  const activeScene = APP_DATA.scenes.find(
    (scene) => scene.id === currentSceneId,
  );
  const sceneName = activeScene?.name ?? "";

  // Scene list positioning: off-screen left when closed, visible when open
  const sceneListClasses = [
    "fixed inset-y-0 left-0 z-20 w-[16rem] max-h-full overflow-x-hidden overflow-y-auto",
    "bg-surface-strong border-r border-line",
    "pt-10 transition-all duration-500 ease-in-out",
    "compact:w-[14rem] narrow:w-[16rem]",
    sceneListOpen ? "translate-x-0" : "-translate-x-full",
  ].join(" ");

  return (
    <section
      ref={containerRef}
      className="bg-canvas relative min-h-0 flex-1 touch-none overflow-hidden"
      aria-label={`360 degree view of ${locationLabel}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        const controlId = KEY_CONTROL_MAP[e.key];
        if (!controlId) return;
        e.preventDefault();
        pressControl(controlId);
      }}
      onKeyUp={(e) => {
        if (e.target !== e.currentTarget) return;
        const controlId = KEY_CONTROL_MAP[e.key];
        if (!controlId) return;
        releaseControl(controlId);
      }}
    >
      {/* Panorama render target */}
      <div id="pano" className="absolute inset-0" />

      {/* Scene list */}
      <div id="sceneList" className={sceneListClasses}>
        <div className="flex flex-col space-y-2 p-4">
          {APP_DATA.scenes.map((scene) => (
            <a
              key={scene.id}
              href="javascript:void(0)"
              className={[
                "scene block h-7.5 w-full",
                scene.id === currentSceneId ? "bg-[rgba(103,115,131,0.8)]" : "",
              ]
                .join(" ")
                .trim()}
              data-id={scene.id}
              onClick={(e) => {
                e.preventDefault();
                setCurrentSceneId(scene.id);
              }}
            >
              <li className="text compact:text-sm narrow:text-xs h-full w-full overflow-hidden px-3 leading-10 text-ellipsis whitespace-nowrap">
                {scene.name}
              </li>
            </a>
          ))}
        </div>
      </div>

      {/* Hamburger scene list toggle: hidden but kept in DOM so frozen Marzipano.jsx can query it */}
      <a
        href="javascript:void(0)"
        id="sceneListToggle"
        className="compact:w-9 compact:h-9 compact:p-1 narrow:w-8 narrow:h-8 narrow:p-1 absolute top-0 left-0 z-10 hidden h-10 w-10 bg-[rgba(103,115,131,0.8)] p-1.25"
      >
        <span className="compact:text-lg narrow:text-base text-xl">☰</span>
      </a>

      {/* Fullscreen toggle: hidden but kept in DOM so frozen Marzipano.jsx can query it */}
      <a
        href="javascript:void(0)"
        id="fullscreenToggle"
        className="compact:w-9 compact:h-9 compact:p-1 narrow:w-8 narrow:h-8 narrow:p-1 absolute top-0 right-0 z-10 hidden h-10 w-10 bg-[rgba(103,115,131,0.8)] p-1.25"
      >
        <img
          className="icon off compact:w-5 compact:h-5 narrow:w-5 narrow:h-5 h-6 w-6"
          src="img/fullscreen.png"
          alt="Fullscreen on"
        />
        <img
          className="icon on compact:w-5 compact:h-5 narrow:w-5 narrow:h-5 hidden h-6 w-6"
          src="img/windowed.png"
          alt="Fullscreen off"
        />
      </a>

      {/* Title bar: hidden but kept in DOM so frozen Marzipano.jsx can query #titleBar .sceneName */}
      <div
        id="titleBar"
        className="compact:left-6 compact:right-6 narrow:left-4 narrow:right-4 border-line absolute top-0 right-10 left-10 z-10 hidden h-10 border-b bg-[rgba(58,68,84,0.8)]"
      >
        <h1
          className="sceneName text-ink compact:text-xs narrow:text-xs truncate text-sm"
          id="sceneName"
        >
          {sceneName}
        </h1>
      </div>

      {/* Autorotate toggle: hidden but kept in DOM so frozen Marzipano.jsx can query it */}
      <a
        href="javascript:void(0)"
        id="autorotateToggle"
        className="compact:w-9 compact:h-9 compact:p-1 narrow:w-8 narrow:h-8 narrow:p-1 absolute top-0 right-0 z-10 hidden h-10 w-10 bg-[rgba(103,115,131,0.8)] p-1.25"
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("autorotateToggle")
            ?.classList.toggle("enabled");
        }}
      >
        <img
          className="icon off compact:w-5 compact:h-5 narrow:w-5 narrow:h-5 h-6 w-6"
          src="img/play.png"
          alt="Autorotate on"
        />
        <img
          className="icon on compact:w-5 compact:h-5 narrow:w-5 narrow:h-5 hidden h-6 w-6"
          src="img/pause.png"
          alt="Autorotate off"
        />
      </a>

      {/* View control buttons: centered at bottom with original margins */}
      <div
        className="compact:pb-3 narrow:pb-2 absolute bottom-0 left-1/2 z-10 hidden pb-4"
        id="viewControls"
      >
        {VIEW_CONTROLS.map(([id, img, marginClass, label]) => {
          const controlId = `view${id.charAt(0).toUpperCase() + id.slice(1)}`;
          return (
            <a
              key={id}
              href="javascript:void(0)"
              id={controlId}
              className={[
                "viewControlButton text-ink hover:bg-accent absolute bottom-0 flex h-10 w-10 items-center justify-center bg-[rgba(103,115,131,0.8)] p-1.25 transition-colors",
                marginClass,
              ].join(" ")}
              onClick={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                pressControl(controlId);
              }}
              onKeyUp={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                releaseControl(controlId);
              }}
            >
              <img className="icon h-6 w-6" src={`img/${img}`} alt={label} />
            </a>
          );
        })}
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="compact:gap-2 narrow:gap-2 rounded-panel border-line bg-surface-soft compact:p-4 narrow:p-3 text-ink absolute top-1/2 left-1/2 z-6 grid -translate-x-1/2 -translate-y-1/2 place-items-center gap-3 border text-center">
          <span
            className="compact:size-7 narrow:size-6 border-accent/25 border-t-accent size-8 animate-spin rounded-full border-[3px]"
            aria-hidden="true"
          />
          Loading the 360 degree view...
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div
          className="compact:gap-2 narrow:gap-2 rounded-panel border-danger/50 bg-surface-soft compact:p-4 narrow:p-3 text-danger absolute top-1/2 left-1/2 z-6 grid -translate-x-1/2 -translate-y-1/2 place-items-center gap-3 border text-center"
          role="alert"
        >
          <strong>Panorama unavailable</strong>
          <span className="text-ink compact:text-sm narrow:text-xs">
            {MISSING_PANORAMA_MESSAGE}
          </span>
        </div>
      )}
    </section>
  );
}
