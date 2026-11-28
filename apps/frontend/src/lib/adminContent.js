import { validateCatalog } from './catalog'

const STORAGE_KEY = 'ciit-admin-content'
const MAX_ACTIVITY_ENTRIES = 30

function createEmptyContent() {
  return {
    gallery: {},
    locations: {},
    settings: {
      defaultLocationId: '',
      confirmDeletes: true,
    },
    activity: [],
    updatedAt: null,
  }
}

function normalizeSettings(value) {
  const settings = value && typeof value === 'object' ? value : {}

  return {
    defaultLocationId:
      typeof settings.defaultLocationId === 'string' ? settings.defaultLocationId : '',
    confirmDeletes: settings.confirmDeletes !== false,
  }
}

function normalizeContent(value) {
  const content = value && typeof value === 'object' ? value : {}

  return {
    gallery:
      content.gallery && typeof content.gallery === 'object' ? content.gallery : {},
    locations:
      content.locations && typeof content.locations === 'object' ? content.locations : {},
    settings: normalizeSettings(content.settings),
    activity: Array.isArray(content.activity) ? content.activity : [],
    updatedAt: typeof content.updatedAt === 'string' ? content.updatedAt : null,
  }
}

export function readAdminContent() {
  if (typeof window === 'undefined') {
    return createEmptyContent()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createEmptyContent()
    }

    return normalizeContent(JSON.parse(raw))
  } catch {
    return createEmptyContent()
  }
}

export function writeAdminContent(content) {
  const nextContent = {
    ...normalizeContent(content),
    updatedAt: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent))
  }

  return nextContent
}

export function resetAdminContent() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return createEmptyContent()
}

function createActivityEntry(action, detail) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    action,
    detail: detail || '',
    timestamp: new Date().toISOString(),
  }
}

export function appendActivity(content, action, detail) {
  if (!action) {
    return content
  }

  const entry = createActivityEntry(action, detail)
  const activity = [entry, ...content.activity].slice(0, MAX_ACTIVITY_ENTRIES)

  return { ...content, activity }
}

export function getEffectiveGallery(location, content) {
  if (!location) {
    return []
  }

  const override = content.gallery[location.id]
  if (Array.isArray(override)) {
    return override
  }

  return location.gallery ?? []
}

export function getEffectiveLocation(location, content) {
  if (!location) {
    return null
  }

  const override = content.locations[location.id] ?? {}

  return {
    name: override.name || location.name,
    description: override.description || location.description,
  }
}

export function getDefaultLocationId(catalog, content) {
  const storedId = content.settings.defaultLocationId
  const hasStoredId = catalog.locations.some((location) => location.id === storedId)

  return hasStoredId ? storedId : catalog.defaultLocationId
}

function applyLocationOverrides(catalog, content) {
  for (const location of catalog.locations) {
    const override = content.locations[location.id]

    if (override) {
      if (typeof override.name === 'string' && override.name.trim()) {
        location.name = override.name
      }

      if (typeof override.description === 'string' && override.description.trim()) {
        location.description = override.description
      }
    }

    const gallery = content.gallery[location.id]
    if (Array.isArray(gallery)) {
      location.gallery = gallery.map((image, index) => ({ ...image, order: index }))
    }
  }
}

export function applyAdminContent(catalog) {
  const content = readAdminContent()
  const nextCatalog = JSON.parse(JSON.stringify(catalog))

  applyLocationOverrides(nextCatalog, content)

  const defaultId = content.settings.defaultLocationId
  const hasDefault = nextCatalog.locations.some((location) => location.id === defaultId)

  if (defaultId && hasDefault) {
    nextCatalog.defaultLocationId = defaultId
  }

  return validateCatalog(nextCatalog).valid ? nextCatalog : catalog
}
