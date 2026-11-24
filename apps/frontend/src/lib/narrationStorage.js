const STORAGE_KEY = 'ciit_narration_state'

function readNarrationState() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)

    if (!parsed || typeof parsed.floor !== 'string') {
      return null
    }

    return {
      floor: parsed.floor,
      isPaused: Boolean(parsed.isPaused),
    }
  } catch {
    return null
  }
}

function writeNarrationState(state) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        floor: state.floor,
        isPaused: Boolean(state.isPaused),
      }),
    )
  } catch {
    // Persistence is optional; blocked storage must not break the tour.
  }
}

function clearNarrationState() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Clearing is best effort when storage is blocked.
  }
}

export {
  STORAGE_KEY,
  readNarrationState,
  writeNarrationState,
  clearNarrationState,
}
