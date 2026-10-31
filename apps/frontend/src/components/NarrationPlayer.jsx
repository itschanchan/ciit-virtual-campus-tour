import { useEffect, useRef, useState } from 'react'

const STATUS_LABELS = {
  idle: 'Narration ready.',
  loading: 'Narration is loading.',
  playing: 'Narration is playing.',
  paused: 'Narration is paused.',
  ended: 'Narration has ended.',
  blocked: 'Playback was blocked by your browser.',
  error: 'Narration could not be played.',
}

export default function NarrationPlayer({
  narration,
  status,
  onPlay,
  onPause,
  onStatusChange,
}) {
  const audioRef = useRef(null)
  const [transcriptOpen, setTranscriptOpen] = useState(false)

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.pause()
    audio.currentTime = 0
    setTranscriptOpen(false)
  }, [narration?.audioSrc])

  if (!narration) {
    return null
  }

  function handlePlay() {
    const audio = audioRef.current

    onPlay()

    if (!audio) {
      return
    }

    if (status === 'ended') {
      audio.currentTime = 0
    }

    const playPromise = audio.play()

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        onStatusChange?.('blocked')
      })
    }
  }

  function handlePause() {
    onPause()
    audioRef.current?.pause()
  }

  const playing = status === 'playing'
  const buttonLabel = playing
    ? 'Pause narration'
    : status === 'paused'
      ? 'Resume narration'
      : status === 'ended'
        ? 'Replay narration'
        : 'Play narration'

  return (
    <section
      className="absolute bottom-4 left-1/2 z-[7] w-[min(48rem,calc(100%_-_2rem))] -translate-x-1/2 rounded-panel border border-line bg-surface/90 px-4 py-[0.9rem] shadow-narration backdrop-blur-narration narrow:bottom-0 narrow:w-full narrow:rounded-t-panel narrow:rounded-b-none narrow:border-x-0 narrow:border-b-0"
      aria-label="Narration"
    >
      <div className="flex flex-wrap items-center gap-[0.6rem]">
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full border border-transparent bg-accent px-4 py-[0.55rem] font-bold text-accent-ink transition-colors hover:bg-accent-hover"
          onClick={playing ? handlePause : handlePlay}
          aria-label={buttonLabel}
        >
          <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
          {buttonLabel}
        </button>

        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-[0.45rem] rounded-full border border-line bg-surface-soft px-4 py-[0.55rem] font-bold text-ink transition-colors hover:border-accent hover:text-accent"
          aria-expanded={transcriptOpen}
          aria-controls="narration-transcript"
          onClick={() => setTranscriptOpen((current) => !current)}
        >
          {transcriptOpen ? 'Hide transcript' : 'Show transcript'}
        </button>

        {narration.durationSeconds && (
          <span className="ml-auto text-[0.82rem] text-muted narrow:hidden">
            {narration.durationSeconds}s
          </span>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {STATUS_LABELS[status] ?? STATUS_LABELS.idle}
      </p>

      {status === 'blocked' && (
        <p
          className="mt-3 mb-0 rounded-[0.35rem] border-l-[3px] border-accent bg-accent-notice px-3 py-[0.6rem] text-[0.86rem] text-selected-ink"
          role="status"
        >
          Playback was blocked by your browser. Open the transcript to read the narration.
        </p>
      )}

      {status === 'error' && (
        <p
          className="mt-3 mb-0 rounded-[0.35rem] border-l-[3px] border-accent bg-accent-notice px-3 py-[0.6rem] text-[0.86rem] text-selected-ink"
          role="alert"
        >
          The narration could not be played. Open the transcript to read it instead.
        </p>
      )}

      {transcriptOpen && (
        <div
          id="narration-transcript"
          className="mt-[0.8rem] max-h-44 overflow-y-auto border-t border-line pt-[0.8rem]"
        >
          <h3 className="mb-[0.4rem] text-[0.95rem]">Transcript</h3>
          <p className="mb-0 text-[0.9rem] leading-[1.55] text-muted">{narration.transcript}</p>
        </div>
      )}

      <audio
        ref={audioRef}
        className="hidden"
        src={narration.audioSrc}
        preload="none"
        onPlaying={() => onStatusChange?.('playing')}
        onPause={() => onStatusChange?.('paused')}
        onEnded={() => onStatusChange?.('ended')}
        onError={() => onStatusChange?.('error')}
      />
    </section>
  )
}
