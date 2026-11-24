import { useEffect, useState } from 'react'
import { loadTranscript } from '../lib/transcripts'

const LOADING_MESSAGE = 'Loading transcript...'
const FALLBACK_MESSAGE = 'Transcript not available yet.'

function splitParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export default function NarrationTranscript({ src }) {
  const [transcript, setTranscript] = useState({ status: 'loading', text: null })

  useEffect(() => {
    let active = true

    if (!src) {
      queueMicrotask(() => {
        if (active) {
          setTranscript({ status: 'empty', text: null })
        }
      })
      return undefined
    }

    queueMicrotask(() => {
      if (active) {
        setTranscript({ status: 'loading', text: null })
      }
    })

    loadTranscript(src).then((text) => {
      if (!active) {
        return
      }

      setTranscript({ status: text ? 'ready' : 'empty', text })
    })

    return () => {
      active = false
    }
  }, [src])

  if (transcript.status === 'loading') {
    return (
      <p className="text-muted mb-0 text-[0.9rem]" role="status" aria-live="polite">
        {LOADING_MESSAGE}
      </p>
    )
  }

  if (transcript.status !== 'ready' || !transcript.text) {
    return <p className="text-muted mb-0 text-[0.9rem]">{FALLBACK_MESSAGE}</p>
  }

  return (
    <div className="grid gap-2">
      {splitParagraphs(transcript.text).map((paragraph, index) => (
        <p
          key={index}
          className="text-muted mb-0 text-[0.9rem] leading-[1.55]"
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}
