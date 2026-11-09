import { useEffect, useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import MapIcon from "@mui/icons-material/Map";
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

export default function FloatingMenu({
  narration,
  status,
  onPlay,
  onPause,
  onStatusChange,
  muted = false,
  onMuteToggle,
  sidebarOpen = false,
}) {
  const audioRef = useRef(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const lastClick = useRef(0);
  const GUARD_MS = 600;

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

  // Hide the floating navigation bar when the sidebar is open on a mobile
  // viewport so the sidebar's tinted background is the sole focus.
  if (sidebarOpen && isCompactViewport()) {
    return null;
  }

  return (
    <>
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
        className="fixed bottom-4 left-1/2 z-7 -translate-x-1/2 w-[min(44rem,calc(100%-1.5rem))] rounded-full border border-line bg-surface/90 px-4 py-[0.9rem] shadow-narration backdrop-blur-narration narrow:bottom-0 narrow:w-full narrow:rounded-t-panel narrow:rounded-b-none narrow:border-x-0 narrow:border-b-0"
        aria-label="Tour narration controls"
      >
        <div className="flex justify-center items-center gap-[0.6rem]">
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
            className={`inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full border border-transparent bg-accent px-4 py-[0.55rem] font-bold text-accent-ink transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${audioError ? "opacity-50 pointer-events-none" : ""}`}
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
            className="inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full border border-line bg-surface-soft px-4 py-[0.55rem] font-bold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
              className="inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full border border-line bg-surface-soft px-4 py-[0.55rem] font-bold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={() => setTranscriptOpen((current) => !current)}
              aria-expanded={transcriptOpen}
              aria-controls="floating-menu-transcript"
            >
              {transcriptOpen ? "Hide transcript" : "Show transcript"}
            </button>
          )}

          {/* Map Button */}
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full border border-line bg-surface-soft px-4 py-[0.55rem] font-bold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Open map"
          >
            <MapIcon></MapIcon>
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {STATUS_LABELS[status] ?? STATUS_LABELS.idle}
        </p>

        {audioError && (
          <p
            className="mt-3 mb-0 rounded-mark border-l-[3px] border-accent bg-accent-notice px-3 py-[0.6rem] text-[0.86rem] text-selected-ink"
            role="status"
          >
            Playback was blocked by your browser. Open the transcript to read
            the narration.
          </p>
        )}

        {status === "error" && (
          <p
            className="mt-3 mb-0 rounded-mark border-l-[3px] border-accent bg-accent-notice px-3 py-[0.6rem] text-[0.86rem] text-selected-ink"
            role="alert"
          >
            The narration could not be played. Open the transcript to read it
            instead.
          </p>
        )}

        {narration && transcriptOpen && (
          <div className="mt-[0.8rem] max-h-44 overflow-y-auto border-t border-line pt-[0.8rem]">
            <h3 className="mb-[0.4rem] text-[0.95rem]">Transcript</h3>
            <p className="mb-0 text-[0.9rem] leading-[1.55] text-muted">
              {narration.transcript}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
