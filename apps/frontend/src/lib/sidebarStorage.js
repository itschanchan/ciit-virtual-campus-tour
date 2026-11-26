const STORAGE_KEY = 'ciit_sidebar_open'

function readSidebarState() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)

    if (typeof parsed !== 'boolean') {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function writeSidebarState(open) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(open))
  } catch {
    // Persistence is optional; blocked storage must not break the tour.
  }
}

export {
  STORAGE_KEY,
  readSidebarState,
  writeSidebarState,
}