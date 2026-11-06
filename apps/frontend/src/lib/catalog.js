import catalogData from './catalog.json'

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function validateView(view, path, errors) {
  if (!view || typeof view !== 'object' || Array.isArray(view)) {
    errors.push(`${path} must be an object.`)
    return
  }

  for (const key of ['yaw', 'pitch', 'fov']) {
    if (!isNumber(view[key])) {
      errors.push(`${path}.${key} must be a finite number.`)
    }
  }
}

function validatePanorama(panorama, path, errors) {
  if (!panorama || typeof panorama !== 'object' || Array.isArray(panorama)) {
    errors.push(`${path} must be an object.`)
    return
  }

  if (!isNonEmptyString(panorama.tileUrlTemplate)) {
    errors.push(`${path}.tileUrlTemplate is required.`)
  } else {
    for (const placeholder of ['{z}', '{y}', '{x}']) {
      if (!panorama.tileUrlTemplate.includes(placeholder)) {
        errors.push(`${path}.tileUrlTemplate must contain ${placeholder}.`)
      }
    }
  }

  if (panorama.previewUrl !== undefined && !isNonEmptyString(panorama.previewUrl)) {
    errors.push(`${path}.previewUrl must be a non-empty string when provided.`)
  }

  validateView(panorama.initialView, `${path}.initialView`, errors)

  if (!isNumber(panorama.minFov) || panorama.minFov <= 0) {
    errors.push(`${path}.minFov must be a positive number.`)
  }

  if (!isNumber(panorama.maxFov) || panorama.maxFov <= 0) {
    errors.push(`${path}.maxFov must be a positive number.`)
  }

  if (isNumber(panorama.minFov) && isNumber(panorama.maxFov) && panorama.minFov >= panorama.maxFov) {
    errors.push(`${path}.minFov must be less than maxFov.`)
  }

  if (
    isNumber(panorama.initialView?.fov) &&
    isNumber(panorama.minFov) &&
    isNumber(panorama.maxFov) &&
    (panorama.initialView.fov < panorama.minFov || panorama.initialView.fov > panorama.maxFov)
  ) {
    errors.push(`${path}.initialView.fov must be within minFov and maxFov.`)
  }
}

function validateGallery(gallery, path, errors) {
  if (gallery === undefined) {
    return
  }

  if (!Array.isArray(gallery)) {
    errors.push(`${path} must be an array when provided.`)
    return
  }

  const orders = new Set()

  gallery.forEach((image, index) => {
    const imagePath = `${path}[${index}]`
    if (!image || typeof image !== 'object' || Array.isArray(image)) {
      errors.push(`${imagePath} must be an object.`)
      return
    }

    if (!isNonEmptyString(image.src)) {
      errors.push(`${imagePath}.src is required.`)
    }

    if (!isNonEmptyString(image.alt)) {
      errors.push(`${imagePath}.alt is required.`)
    }

    if (!Number.isInteger(image.order) || image.order < 0) {
      errors.push(`${imagePath}.order must be a non-negative integer.`)
    } else if (orders.has(image.order)) {
      errors.push(`${imagePath}.order must be unique within the gallery.`)
    } else {
      orders.add(image.order)
    }
  })
}

function validateNarration(narration, path, errors) {
  if (narration === undefined) {
    return
  }

  if (!narration || typeof narration !== 'object' || Array.isArray(narration)) {
    errors.push(`${path} must be an object when provided.`)
    return
  }

  if (!isNonEmptyString(narration.audioSrc)) {
    errors.push(`${path}.audioSrc is required.`)
  }

  if (!isNonEmptyString(narration.transcript)) {
    errors.push(`${path}.transcript is required.`)
  }

  if (
    narration.durationSeconds !== undefined &&
    (!isNumber(narration.durationSeconds) || narration.durationSeconds <= 0)
  ) {
    errors.push(`${path}.durationSeconds must be a positive number when provided.`)
  }
}

function validateLocation(location, index, ids, orders, errors) {
  const path = `locations[${index}]`

  if (!location || typeof location !== 'object' || Array.isArray(location)) {
    errors.push(`${path} must be an object.`)
    return
  }

  if (!isNonEmptyString(location.id) || !SLUG_PATTERN.test(location.id)) {
    errors.push(`${path}.id must be lowercase kebab-case.`)
  } else if (ids.has(location.id)) {
    errors.push(`${path}.id must be unique.`)
  } else {
    ids.add(location.id)
  }

  if (!isNonEmptyString(location.name)) {
    errors.push(`${path}.name is required.`)
  }

  if (!isNonEmptyString(location.description)) {
    errors.push(`${path}.description is required.`)
  }

  if (!Number.isInteger(location.order) || location.order < 0) {
    errors.push(`${path}.order must be a non-negative integer.`)
  } else if (orders.has(location.order)) {
    errors.push(`${path}.order must be unique.`)
  } else {
    orders.add(location.order)
  }

  validatePanorama(location.panorama, `${path}.panorama`, errors)
  validateGallery(location.gallery, `${path}.gallery`, errors)
  validateNarration(location.narration, `${path}.narration`, errors)
}

export function validateCatalog(catalog) {
  const errors = []

  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
    return { valid: false, errors: ['Catalog must be an object.'] }
  }

  if (!isNonEmptyString(catalog.version) || !SEMVER_PATTERN.test(catalog.version)) {
    errors.push('version must be a semantic version such as 1.0.0.')
  }

  if (!Array.isArray(catalog.locations) || catalog.locations.length === 0) {
    errors.push('locations must contain at least one location.')
  }

  const ids = new Set()
  const orders = new Set()

  if (Array.isArray(catalog.locations)) {
    catalog.locations.forEach((location, index) => {
      validateLocation(location, index, ids, orders, errors)
    })
  }

  if (!isNonEmptyString(catalog.defaultLocationId)) {
    errors.push('defaultLocationId is required.')
  } else if (Array.isArray(catalog.locations) && !ids.has(catalog.defaultLocationId)) {
    errors.push('defaultLocationId must match a location id.')
  }

  return { valid: errors.length === 0, errors }
}

export function loadCatalog(catalog = catalogData) {
  const result = validateCatalog(catalog)

  if (!result.valid) {
    throw new Error(`Invalid tour catalog: ${result.errors.join(' ')}`)
  }

  return catalog
}

export function getSortedLocations(catalog) {
  return [...catalog.locations].sort((a, b) => a.order - b.order)
}

export function getDefaultLocation(catalog) {
  return catalog.locations.find((location) => location.id === catalog.defaultLocationId) ?? null
}

export { catalogData }
