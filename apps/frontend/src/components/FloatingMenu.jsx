import { useEffect, useMemo, useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import MapIcon from "@mui/icons-material/Map";
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { isCompactViewport } from "../lib/viewport";

const STATUS_LABELS = {
  idle: "Narration ready.",
  loading: "Narration is loading.",
  playing: "Narration is playing.",
  paused: "Narration is paused.",
  ended: "Narration has ended.",
  blocked: "Playback was blocked by your browser.",
  error: "Narration could not be played.",
};

function GalleryImage({ image }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        className="rounded-gallery-item bg-surface-strong text-muted grid aspect-16/10 w-full place-items-center px-6 text-center max-h-[calc(90dvh-10rem)]"
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      className="rounded-gallery-item bg-surface-strong block aspect-16/10 w-full object-cover max-h-[calc(90dvh-10rem)]"
      src={image.src}
      alt={image.alt}
      onError={() => setFailed(true)}
    />
  );
}

export default function FloatingMenu({
  images = [],
  open = false,
  onClose,
  narration,
  status,
  onPlay,
  onPause,
  onStatusChange,
  muted = false,
  onMuteToggle,
  sidebarOpen = false,
  floorLabel = "",
  onOpen,
}) {
  // Narration state (existing)
  const audioRef = useRef(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const lastClick = useRef(0);
  const GUARD_MS = 600;

  // Gallery state (consolidated from RoomGallery)
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.order - b.order),
    [images],
  );

  // Floor directory modal state (maps button)
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapZoomLevel, setMapZoomLevel] = useState(1);
  const [mapPanX, setMapPanX] = useState(0);
  const [mapPanY, setMapPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const MAP_ZOOM_MIN = 1;
  const MAP_ZOOM_MAX = 3;
  const MAP_ZOOM_STEP = 0.1;

  const mapImageRef = useRef(null);

  const imageCount = sortedImages.length;
  const activeIndex = currentIndex < imageCount ? currentIndex : 0;
  const activeImage = sortedImages[activeIndex] ?? null;
  const hasMultipleImages = imageCount > 1;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    setTranscriptOpen(false);
  }, [narration?.audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = muted;
    }
  }, [muted]);

  // Gallery open/close, keyboard navigation, and focus management
  // (consolidated from RoomGallery).
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        setCurrentIndex((index) => (index - 1 + imageCount) % imageCount);
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        setCurrentIndex((index) => (index + 1) % imageCount);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      const previousElement = previousFocusRef.current;
      previousFocusRef.current = null;

      if (previousElement?.isConnected) {
        previousElement.focus?.();
        return;
      }

      document.getElementById("tour-main")?.focus();
    };
  }, [open, onClose, hasMultipleImages, imageCount]);

  // Floor directory modal open/close and Escape handling
  useEffect(() => {
    if (!mapModalOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMapModalOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mapModalOpen]);

  function handleMapOpen() {
    setMapModalOpen(true);
    setMapZoomLevel(MAP_ZOOM_MIN);
    setMapPanX(0);
    setMapPanY(0);
  }

  function handleMapClose() {
    setMapModalOpen(false);
  }

  function handleMapWheel(event) {
    if (!mapModalOpen) {
      return;
    }
    event.preventDefault();
    const delta = event.deltaY > 0 ? -MAP_ZOOM_STEP : MAP_ZOOM_STEP;
    setMapZoomLevel((current) =>
      Math.min(MAP_ZOOM_MAX, Math.max(MAP_ZOOM_MIN, current + delta)),
    );
    setMapPanX(0);
    setMapPanY(0);
  }

  const touchStartDistance = useRef(0);
  function handleMapTouchStart(event) {
    if (!mapModalOpen) {
      return;
    }
    if (event.touches.length === 2) {
      touchStartDistance.current = getTouchDistance(event.touches);
      return;
    }
    if (event.touches.length === 1 && mapZoomLevel > MAP_ZOOM_MIN) {
      setIsPanning(true);
    }
  }

  function handleMapTouchMove(event) {
    if (!mapModalOpen) {
      return;
    }
    if (event.touches.length === 2) {
      event.preventDefault();
      const currentDistance = getTouchDistance(event.touches);
      const ratio = currentDistance / touchStartDistance.current;
      setMapZoomLevel((current) =>
        Math.min(MAP_ZOOM_MAX, Math.max(MAP_ZOOM_MIN, current * ratio)),
      );
      touchStartDistance.current = currentDistance;
      return;
    }
    if (event.touches.length === 1 && isPanning) {
      event.preventDefault();
      setMapPanX(50);
      setMapPanY(50);
    }
  }

  function handleMapTouchEnd() {
    setIsPanning(false);
  }

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handleMapMouseDown() {
    if (!mapModalOpen || mapZoomLevel <= MAP_ZOOM_MIN) {
      return;
    }
    setIsPanning(true);
  }

  function handleMapMouseMove() {
    if (!mapModalOpen || !isPanning) {
      return;
    }
    setMapPanX(50);
    setMapPanY(50);
  }

  function handleMapMouseUp() {
    if (!isPanning) {
      return;
    }
    setIsPanning(false);
  }

  const handlePlayPause = () => {
    const now = Date.now();
    if (now - lastClick.current < GUARD_MS) {
      return;
    }
    lastClick.current = now;
    if (status === "playing") {
      onPause();
      audioRef.current?.pause();
    } else {
      onPlay();
      const audio = audioRef.current;
      if (!audio) {
        return;
      }
      if (status === "ended") {
        audio.currentTime = 0;
      }
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          onStatusChange?.("blocked");
        });
      }
    }
  };

  const handleMuteToggle = (event) => {
    const now = Date.now();
    if (now - lastClick.current < GUARD_MS) {
      return;
    }
    lastClick.current = now;
    onMuteToggle(event);
  };

  const playing = status === "playing";
  const audioError = status === "error" || status === "blocked";
  const buttonLabel = playing
    ? "Pause narration"
    : status === "paused"
      ? "Resume narration"
      : status === "ended"
        ? "Replay narration"
        : "Play narration";

  // Hide the floating menu (gallery + narration) when the sidebar is open on a
  // compact mobile viewport so the sidebar's tinted background is the sole focus.
  if (sidebarOpen && isCompactViewport()) {
    return null;
  }

  function showPreviousImage() {
    setCurrentIndex((index) => (index - 1 + imageCount) % imageCount);
  }

  function showNextImage() {
    setCurrentIndex((index) => (index + 1) % imageCount);
  }

  return (
    <>
      {/* Room gallery modal (consolidated from RoomGallery). Always mounted so
          focus management and aria-hidden can toggle cleanly. */}
      <div
        className={`bg-canvas/78 backdrop-blur-gallery tiny:p-0 fixed inset-0 z-60 grid place-items-center p-5 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        inert={!open}
        aria-hidden={!open}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <section
          id="room-gallery"
          className={`rounded-gallery-panel bg-surface shadow-gallery tiny:min-h-dvh tiny:w-full tiny:max-h-dvh tiny:rounded-none max-h-[min(90dvh,52rem)] w-[min(68rem,100%)] tiny:p-3 sm:p-5 transition-all duration-300 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="room-gallery-title"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-accent mb-1.5 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">
                {floorLabel ? `${floorLabel} floor gallery` : "Room details"}
              </p>
              <h2 id="room-gallery-title" className="mb-0 text-[clamp(1.4rem,3vw,2rem)]">
                Gallery
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className="bg-surface text-ink hover:text-accent inline-flex size-11 shrink-0 items-center justify-center gap-1.5 rounded-full text-xl leading-none transition-colors"
              aria-label="Close gallery"
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          {activeImage ? (
            <div className="grid gap-3">
              <div className="relative">
                <div key={`${activeImage.src}-${activeIndex}`} className="gallery-image-enter">
                  <GalleryImage image={activeImage} />
                </div>

                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      className="bg-surface/90 text-ink hover:text-accent absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-2xl leading-none transition-colors"
                      aria-label="Previous image"
                      onClick={showPreviousImage}
                    >
                      <span aria-hidden="true">‹</span>
                    </button>
                    <button
                      type="button"
                      className="bg-surface/90 text-ink hover:text-accent absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-2xl leading-none transition-colors"
                      aria-label="Next image"
                      onClick={showNextImage}
                    >
                      <span aria-hidden="true">›</span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-muted m-0 text-[0.85rem]">
                  {activeImage.caption}
                </p>
                <p className="text-muted m-0 text-[0.85rem]" aria-live="polite">
                  {activeIndex + 1} / {imageCount}
                </p>
              </div>
            </div>
          ) : (
            <p className="rounded-gallery-item text-muted m-0 px-4 py-8 text-center">
              No gallery images are available for this location yet.
            </p>
          )}
        </section>
      </div>

      {/* Floor directory modal (maps button). Always mounted so
          focus management and aria-hidden can toggle cleanly. */}
      <div
        className={`bg-canvas/78 backdrop-blur-gallery tiny:p-0 fixed inset-0 z-60 grid place-items-center p-5 transition-opacity duration-300 ${mapModalOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        inert={!mapModalOpen}
        aria-hidden={!mapModalOpen}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            handleMapClose();
          }
        }}
        onMouseMove={handleMapMouseMove}
        onMouseUp={handleMapMouseUp}
        onWheel={handleMapWheel}
        onTouchStart={handleMapTouchStart}
        onTouchMove={handleMapTouchMove}
        onTouchEnd={handleMapTouchEnd}
        style={{ touchAction: "none" }}
      >
        <section
          id="floor-directory"
          className={`rounded-gallery-panel bg-surface shadow-gallery tiny:min-h-dvh tiny:w-full tiny:max-h-dvh tiny:rounded-none max-h-[min(90dvh,52rem)] w-[min(68rem,100%)] tiny:p-3 sm:p-5 transition-all duration-300 ease-out ${mapModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="floor-directory-title"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-accent mb-1.5 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">
                Floor directory
              </p>
              <h2 id="floor-directory-title" className="mb-0 text-[clamp(1.4rem,3vw,2rem)]">
                Floor Directory
              </h2>
            </div>
            <button
              type="button"
              className="bg-surface text-ink hover:text-accent inline-flex size-11 shrink-0 items-center justify-center gap-1.5 rounded-full text-xl leading-none transition-colors"
              aria-label="Close floor directory"
              onClick={handleMapClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="relative w-full" onMouseDown={handleMapMouseDown}>
            <img
              ref={mapImageRef}
              src="/img/glitch_directory.png"
              alt="Floor Directory"
              className="block w-full max-w-full max-h-[calc(90dvh-10rem)] object-contain"
              style={{
                transform: `translate(${mapPanX}px, ${mapPanY}px) scale(${mapZoomLevel})`,
                transformOrigin: "center",
                cursor:
                  mapZoomLevel > MAP_ZOOM_MIN || isPanning
                    ? "grabbing"
                    : "grab",
              }}
              onError={(event) => {
                event.target.src = "";
              }}
            />
          </div>
        </section>
      </div>

      <style>{`
        @keyframes oscillate {
          0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .audio-viz {
          display: flex;
          align-items: flex-end;
          gap: 1px;
          min-width: 36px;
        }
        .audio-viz .viz-bar {
          width: 6px;
          height: 16px;
          border-radius: 2px;
          background: currentColor;
          opacity: 0.6;
        }
        .audio-viz.playing .viz-bar {
          animation: oscillate 0.6s ease-in-out infinite;
        }
        .audio-viz.playing .viz-bar:nth-child(2) {
          animation-delay: 0.2s;
        }
        .audio-viz.playing .viz-bar:nth-child(3) {
          animation-delay: 0.4s;
        }
        @media (prefers-reduced-motion: reduce) {
          .audio-viz.playing .viz-bar {
            animation: none;
            transform: none;
            opacity: 0.6;
          }
        }
      `}</style>

      <section
        className="bg-surface/90 shadow-narration backdrop-blur-narration narrow:bottom-0 narrow:w-full narrow:rounded-t-panel narrow:rounded-b-none fixed bottom-4 left-1/2 z-7 w-[min(44rem,calc(100%-1.5rem))] -translate-x-1/2 rounded-full px-4 py-[0.9rem]"
        aria-label="Tour narration controls"
      >
        <div className="flex items-center justify-center gap-[0.6rem]">
          <span
            className={`audio-viz narrow:hidden ${playing ? "playing" : "hidden"}`}
            aria-hidden="true"
          >
            <span className="viz-bar" />
            <span className="viz-bar" />
            <span className="viz-bar" />
          </span>

          {/* Play/Pause Button */}
          <button
            type="button"
            className={`bg-accent text-accent-ink hover:bg-accent-hover focus-visible:ring-accent inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full border border-transparent px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none ${audioError ? "pointer-events-none opacity-50" : ""}`}
            onClick={handlePlayPause}
            onKeyDown={(keyEvent) => {
              if (keyEvent.key === "p") {
                keyEvent.preventDefault();
                handlePlayPause();
              }
            }}
            disabled={audioError}
            aria-label={audioError ? "Narration unavailable" : buttonLabel}
          >
            {playing ? (
              <PauseIcon fontSize="small" />
            ) : (
              <PlayArrowIcon fontSize="small" />
            )}
          </button>

          {/* Mute / Unmute Button */}
          <button
            type="button"
            className="bg-surface-soft text-ink hover:text-accent focus-visible:ring-accent inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            onClick={handleMuteToggle}
            onKeyDown={(event) => {
              if (event.key === "m") {
                event.preventDefault();
                onMuteToggle(event);
              }
            }}
            aria-label={muted ? "Unmute narration" : "Mute narration"}
          >
            {muted ? (
              <VolumeOffIcon fontSize="small" />
            ) : (
              <VolumeUpIcon fontSize="small" />
            )}
          </button>

          {/* Narration Button */}
          {narration && (
            <button
              type="button"
              className="bg-surface-soft text-ink hover:text-accent focus-visible:ring-accent inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => setTranscriptOpen((current) => !current)}
              aria-expanded={transcriptOpen}
              aria-controls="floating-menu-transcript"
            >
              {/* {transcriptOpen ? "Hide transcript" : "Show transcript"} */}
              { transcriptOpen ? <DescriptionIcon fontSize="small" /> : <DescriptionIcon fontSize="small" /> }
            </button>
          )}

          {/* Map Button */}
          <button
            type="button"
            className="bg-surface-soft text-ink hover:text-accent focus-visible:ring-accent inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Open map"
            aria-expanded={mapModalOpen}
            onClick={handleMapOpen}
          >
            <MapIcon></MapIcon>
          </button>

          {/* View Gallery Button */}
          <button
            type="button"
            className="bg-surface-soft text-ink hover:text-accent focus-visible:ring-accent inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-expanded={open}
            aria-controls="room-gallery"
            aria-haspopup="dialog"
            onClick={onOpen}
          >
           <PhotoCameraIcon></PhotoCameraIcon>
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {STATUS_LABELS[status] ?? STATUS_LABELS.idle}
        </p>

        {audioError && (
          <p
            className="rounded-mark border-accent bg-accent-notice text-selected-ink mt-3 mb-0 border-l-[3px] px-3 py-[0.6rem] text-[0.86rem]"
            role="status"
          >
            Playback was blocked by your browser. Open the transcript to read
            the narration.
          </p>
        )}

        {status === "error" && (
          <p
            className="rounded-mark border-accent bg-accent-notice text-selected-ink mt-3 mb-0 border-l-[3px] px-3 py-[0.6rem] text-[0.86rem]"
            role="alert"
          >
            The narration could not be played. Open the transcript to read it
            instead.
          </p>
        )}

        {narration && transcriptOpen && (
          <div className="mt-[0.8rem] max-h-44 overflow-y-auto pt-[0.8rem]">
            <h3 className="mb-[0.4rem] text-[0.95rem]">Transcript</h3>
            <p className="text-muted mb-0 text-[0.9rem] leading-[1.55]">
              {narration.transcript}
            </p>
          </div>
        )}

      </section>
    </>
  );
}
