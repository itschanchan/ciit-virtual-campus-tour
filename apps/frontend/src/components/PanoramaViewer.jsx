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
  ["up", "up.png", "ml-[-145px]", "Pan up"],
  ["down", "down.png", "ml-[-95px]", "Pan down"],
  ["left", "left.png", "ml-[-45px]", "Pan left"],
  ["right", "right.png", "ml-[5px]", "Pan right"],
  ["in", "plus.png", "ml-[55px]", "Zoom in"],
  ["out", "minus.png", "ml-[105px]", "Zoom out"],
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
  useEffect(() => {
    if (!onSceneChange || !currentSceneId) {
      return;
    }

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
    "fixed inset-y-0 left-0 z-20 w-[220px] max-h-full overflow-x-hidden overflow-y-auto",
    "bg-surface-strong border-r border-line",
    "pt-10 transition-all duration-500 ease-in-out",
    sceneListOpen ? "translate-x-0" : "-translate-x-full",
  ].join(" ");

  return (
    <section
      ref={containerRef}
      className="relative min-h-0 flex-1 touch-none overflow-hidden bg-canvas"
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
        <div className="flex flex-col p-4 space-y-2">
          {APP_DATA.scenes.map((scene) => (
            <a
              key={scene.id}
              href="javascript:void(0)"
              className={[
                "scene block w-full h-[30px]",
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
              <li className="text w-full h-full px-[15px] leading-[30px] overflow-hidden text-ellipsis whitespace-nowrap">
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
        className="absolute top-0 left-0 z-10 w-10 h-10 p-[5px] bg-[rgba(103,115,131,0.8)] flex items-center justify-center text-ink hidden"
      >
        <span className="text-xl">☰</span>
      </a>

      {/* Fullscreen toggle: hidden but kept in DOM so frozen Marzipano.jsx can query it */}
      <a
        href="javascript:void(0)"
        id="fullscreenToggle"
        className="absolute top-0 right-0 z-10 w-10 h-10 p-[5px] bg-[rgba(103,115,131,0.8)] flex items-center justify-center text-ink hidden"
      >
        <img
          className="icon off w-6 h-6"
          src="img/fullscreen.png"
          alt="Fullscreen on"
        />
        <img
          className="icon on w-6 h-6 hidden"
          src="img/windowed.png"
          alt="Fullscreen off"
        />
      </a>

      {/* Title bar: hidden but kept in DOM so frozen Marzipano.jsx can query #titleBar .sceneName */}
      <div
        id="titleBar"
        className="absolute top-0 left-[40px] right-[40px] z-10 h-10 bg-[rgba(58,68,84,0.8)] border-b border-line flex items-center justify-center px-4 hidden"
      >
        <h1 className="sceneName text-sm text-ink truncate" id="sceneName">
          {sceneName}
        </h1>
      </div>

      {/* Autorotate toggle: hidden but kept in DOM so frozen Marzipano.jsx can query it */}
      <a
        href="javascript:void(0)"
        id="autorotateToggle"
        className="absolute top-0 right-0 z-10 w-10 h-10 p-[5px] bg-[rgba(103,115,131,0.8)] flex items-center justify-center text-ink hidden"
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("autorotateToggle")
            ?.classList.toggle("enabled");
        }}
      >
        <img
          className="icon off w-6 h-6"
          src="img/play.png"
          alt="Autorotate on"
        />
        <img
          className="icon on w-6 h-6 hidden"
          src="img/pause.png"
          alt="Autorotate off"
        />
      </a>

      {/* View control buttons: centered at bottom with original margins */}
      <div className="absolute bottom-0 left-1/2 z-10 pb-4" id="viewControls">
        {VIEW_CONTROLS.map(([id, img, marginClass, label]) => {
          const controlId = `view${id.charAt(0).toUpperCase() + id.slice(1)}`;
          return (
            <a
              key={id}
              href="javascript:void(0)"
              id={controlId}
              className={[
                "viewControlButton absolute bottom-0 w-10 h-10 p-[5px] bg-[rgba(103,115,131,0.8)] flex items-center justify-center text-ink hover:bg-accent transition-colors",
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
              <img className="icon w-6 h-6" src={`img/${img}`} alt={label} />
            </a>
          );
        })}
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="absolute top-1/2 left-1/2 z-[6] grid -translate-x-1/2 -translate-y-1/2 place-items-center gap-3 rounded-panel border border-line bg-surface-soft p-5 text-center text-ink">
          <span
            className="size-8 animate-spin rounded-full border-[3px] border-accent/25 border-t-accent"
            aria-hidden="true"
          />
          Loading the 360 degree view...
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div
          className="absolute top-1/2 left-1/2 z-[6] grid -translate-x-1/2 -translate-y-1/2 place-items-center gap-3 rounded-panel border border-danger/50 bg-surface-soft p-5 text-center text-danger"
          role="alert"
        >
          <strong>Panorama unavailable</strong>
          <span className="text-ink">{MISSING_PANORAMA_MESSAGE}</span>
        </div>
      )}
    </section>
  );
}
