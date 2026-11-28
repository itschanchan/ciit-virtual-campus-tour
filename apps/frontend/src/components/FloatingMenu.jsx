import { useEffect, useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import MapIcon from "@mui/icons-material/Map";
import DescriptionIcon from "@mui/icons-material/Description";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { usePrefersReducedMotion } from "../lib/motion";
import FloorDirectoryDialog from "./FloorDirectoryDialog";
import NarrationTranscript from "./NarrationTranscript";
import GalleryDialog from "./GalleryDialog";

const STATUS_LABELS = {
  idle: "Narration ready.",
  loading: "Narration is loading.",
  playing: "Narration is playing.",
  paused: "Narration is paused.",
  ended: "Narration has ended.",
  blocked: "Playback was blocked by your browser.",
  error: "Narration could not be played.",
};

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

  // Floor directory modal state (maps button)
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const mapButtonRef = useRef(null);

  // Only one overlay is interactive at a time: the directory stays closed
  // while the gallery or the compact sidebar is open so focus can follow the
  // active surface. Derived during render so no setState runs inside an effect.
  const mapModalOpen = directoryOpen && !open && !sidebarOpen;

  // A new recording replaces the previous one from the beginning and closes
  // the transcript so it can never show another recording's text.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    setTranscriptOpen(false);
  }, [narration?.audioSrc]);

  // Apply the requested status to the single audio element. The play click
  // also calls play() directly so browsers keep the user activation.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !narration?.audioSrc) {
      return;
    }

    if (["paused", "ended", "error"].includes(status)) {
      audio.pause();
      return;
    }

    if (["playing", "loading"].includes(status)) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          onStatusChange?.("blocked");
        });
      }
    }
  }, [status, narration?.audioSrc, onStatusChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = muted;
    }
  }, [muted]);

  function handleMapOpen() {
    setDirectoryOpen(true);
  }

  function handleMapClose() {
    setDirectoryOpen(false);
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
  const unavailable = status === "error";
  const blocked = status === "blocked";
  const buttonLabel = playing
    ? "Pause narration"
    : status === "paused"
      ? "Resume narration"
      : status === "ended"
        ? "Replay narration"
        : "Play narration";

  const reduceMotion = usePrefersReducedMotion();

  return (
    <>
      {/* Single hidden audio element. Always mounted, even when the compact
          sidebar hides the visible panel, so narration keeps playing. */}
      <audio
        ref={audioRef}
        src={narration?.audioSrc ?? undefined}
        preload="metadata"
        className="hidden"
        aria-hidden="true"
        onPlay={() => onStatusChange?.("playing")}
        onEnded={() => onStatusChange?.("ended")}
        onError={() => onStatusChange?.("error")}
      />

      {/* Floor directory dialog (maps button). Always mounted so focus
      management and aria-hidden can toggle cleanly. */}
      <FloorDirectoryDialog
        open={mapModalOpen}
        onClose={handleMapClose}
        returnFocusRef={mapButtonRef}
      />

      {/* Room gallery dialog */}
      <GalleryDialog
        images={images}
        open={open}
        onClose={onClose}
        floorLabel={floorLabel}
      />

      {/* Audio Visualizer */}
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

      {/* Narration controls - always mounted so playback controls remain
      accessible even when the sidebar is open on mobile. */}
      <section
        className={`bg-surface/90 shadow-narration backdrop-blur-narration narrow:bottom-0 narrow:w-full narrow:rounded-t-panel narrow:rounded-b-none compact:w-auto fixed bottom-4 left-1/2 z-7 w-[min(44rem,calc(100%-1.5rem))] -translate-x-1/2 ${transcriptOpen ? "rounded-xl" : "rounded-pill"} compact:px-3 compact:py-[0.6rem] overflow-hidden px-4 py-[0.9rem] ${reduceMotion ? "transition-none" : "transition-all duration-300 ease-in-out"}`}
        aria-label="Tour narration controls"
      >
        <div className="compact:gap-[0.4rem] flex flex-wrap items-center justify-center gap-[0.6rem]">
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
            className={`bg-accent text-accent-ink hover:bg-accent-hover focus-visible:ring-accent compact:min-h-9 compact:gap-[0.35rem] compact:px-3 compact:py-[0.4rem] inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full border border-transparent px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none ${unavailable ? "pointer-events-none opacity-50" : ""}`}
            onClick={handlePlayPause}
            onKeyDown={(keyEvent) => {
              if (keyEvent.key === "p") {
                keyEvent.preventDefault();
                handlePlayPause();
              }
            }}
            disabled={unavailable}
            aria-label={unavailable ? "Narration unavailable" : buttonLabel}
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
            className="bg-surface-soft text-ink hover:text-accent focus-visible:ring-accent compact:min-h-9 compact:gap-[0.35rem] compact:px-3 compact:py-[0.4rem] inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
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
              className="bg-surface-soft text-ink hover:text-accent focus-visible:ring-accent compact:min-h-9 compact:gap-[0.35rem] compact:px-3 compact:py-[0.4rem] inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => setTranscriptOpen((current) => !current)}
              aria-label={
                transcriptOpen ? "Hide transcript" : "Show transcript"
              }
              aria-expanded={transcriptOpen}
              aria-controls="floating-menu-transcript"
            >
              {/* {transcriptOpen ? "Hide transcript" : "Show transcript"} */}
              {transcriptOpen ? (
                <DescriptionIcon fontSize="small" />
              ) : (
                <DescriptionIcon fontSize="small" />
              )}
            </button>
          )}

          {/* Map Button */}
          <button
            ref={mapButtonRef}
            type="button"
            className="bg-surface-soft text-ink hover:text-accent focus-visible:ring-accent compact:min-h-9 compact:gap-[0.35rem] compact:px-3 compact:py-[0.4rem] inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Open map"
            aria-expanded={mapModalOpen}
            aria-controls="floor-directory"
            aria-haspopup="dialog"
            onClick={handleMapOpen}
          >
            <MapIcon></MapIcon>
          </button>

          {/* View Gallery Button */}
          <button
            type="button"
            className="bg-surface-soft text-ink hover:text-accent focus-visible:ring-accent compact:min-h-9 compact:gap-[0.35rem] compact:px-3 compact:py-[0.4rem] inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full px-4 py-[0.55rem] font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
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

        {blocked && (
          <p
            className="rounded-mark border-accent bg-accent-notice text-selected-ink compact:text-[0.8rem] compact:py-[0.5rem] mt-3 mb-0 border-l-[3px] px-3 py-[0.6rem] text-[0.86rem]"
            role="status"
          >
            Playback was blocked by your browser. Press play to start the
            narration, or open the transcript to read it.
          </p>
        )}

        {status === "error" && (
          <p
            className="rounded-mark border-accent bg-accent-notice text-selected-ink compact:text-[0.8rem] compact:py-[0.5rem] mt-3 mb-0 border-l-[3px] px-3 py-[0.6rem] text-[0.86rem]"
            role="alert"
          >
            The narration could not be played. Open the transcript to read it
            instead.
          </p>
        )}

        {/* Kept mounted like the sidebar content so opening and closing both
        animate instead of the transcript popping in and out. */}
        {narration && (
          <div
            className={`grid transition-all duration-300 ease-in-out ${transcriptOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} ${reduceMotion ? "transition-none" : ""}`}
            aria-hidden={!transcriptOpen}
            inert={!transcriptOpen}
          >
            <div className="overflow-hidden">
              <div
                id="floating-menu-transcript"
                className="compact:max-h-36 mt-[0.8rem] max-h-44 overflow-y-auto pt-[0.8rem]"
              >
                <h3 className="compact:text-[0.85rem] mb-[0.4rem] text-[0.95rem]">
                  Transcript
                </h3>
                <NarrationTranscript src={narration.transcriptSrc} />
              </div>
            </div>
          </div>
        )}
      </section>
    </> // closes outer fragment from line 248
  );
}
