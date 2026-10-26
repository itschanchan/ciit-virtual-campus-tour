import { useEffect, useRef, useState } from 'react'
import './NarrationPlayer.css'

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
    <section className="narration-player" aria-label="Narration">
      <div className="narration-controls">
        <button
          type="button"
          className="primary-button"
          onClick={playing ? handlePause : handlePlay}
          aria-label={buttonLabel}
        >
          <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
          {buttonLabel}
        </button>

        <button
          type="button"
          className="secondary-button"
          aria-expanded={transcriptOpen}
          aria-controls="narration-transcript"
          onClick={() => setTranscriptOpen((current) => !current)}
        >
          {transcriptOpen ? 'Hide transcript' : 'Show transcript'}
        </button>

        {narration.durationSeconds && (
          <span className="narration-duration">{narration.durationSeconds}s</span>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {STATUS_LABELS[status] ?? STATUS_LABELS.idle}
      </p>

      {status === 'blocked' && (
        <p className="narration-notice" role="status">
          Playback was blocked by your browser. Open the transcript to read the narration.
        </p>
      )}

      {status === 'error' && (
        <p className="narration-notice" role="alert">
          The narration could not be played. Open the transcript to read it instead.
        </p>
      )}

      {transcriptOpen && (
        <div id="narration-transcript" className="narration-transcript">
          <h3>Transcript</h3>
          <p>{narration.transcript}</p>
        </div>
      )}

      <audio
        ref={audioRef}
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
