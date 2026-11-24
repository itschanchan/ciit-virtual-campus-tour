const cache = new Map()

async function loadTranscript(src) {
  if (!src) {
    return null
  }

  if (cache.has(src)) {
    return cache.get(src)
  }

  try {
    const response = await fetch(src)

    if (!response.ok) {
      return null
    }

    const text = await response.text()
    const trimmed = text.trim()

    if (!trimmed) {
      return null
    }

    cache.set(src, trimmed)
    return trimmed
  } catch {
    return null
  }
}

function clearTranscriptCache() {
  cache.clear()
}

export { loadTranscript, clearTranscriptCache }
