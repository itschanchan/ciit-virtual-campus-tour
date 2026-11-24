const STORAGE_KEY = 'ciit_introduction_seen'

function readFirstVisitState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { hasSeenIntroduction: false, firstVisitTimestamp: null }
    }
    const parsed = JSON.parse(raw)
    return {
      hasSeenIntroduction: Boolean(parsed.hasSeenIntroduction),
      firstVisitTimestamp: parsed.firstVisitTimestamp || null,
    }
  } catch {
    return { hasSeenIntroduction: false, firstVisitTimestamp: null }
  }
}

function writeFirstVisitState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function clearFirstVisitState() {
  window.localStorage.removeItem(STORAGE_KEY)
}

export { readFirstVisitState, writeFirstVisitState, clearFirstVisitState }
