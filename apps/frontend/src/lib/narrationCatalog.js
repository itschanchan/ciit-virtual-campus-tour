import catalog from './narrationCatalog.json'

const entriesById = new Map(catalog.entries.map((entry) => [entry.id, entry]))

export function getNarrationById(id) {
  if (!id) {
    return null
  }

  return entriesById.get(id) ?? null
}

export function getNarrationForScene(sceneId) {
  if (!sceneId) {
    return null
  }

  return catalog.entries.find((entry) => entry.sceneId === sceneId) ?? null
}

export function getDefaultNarrationForFloor(floor) {
  if (!floor) {
    return null
  }

  return getNarrationById(catalog.floorDefaults[floor])
}

export function resolveNarration(sceneId, floor, currentEntryId) {
  const sceneEntry = getNarrationForScene(sceneId)

  if (sceneEntry) {
    return sceneEntry
  }

  const currentEntry = getNarrationById(currentEntryId)

  if (currentEntry && currentEntry.floor === floor) {
    return currentEntry
  }

  return getDefaultNarrationForFloor(floor)
}

export { catalog as narrationCatalog }
