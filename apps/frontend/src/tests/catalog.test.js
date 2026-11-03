import { describe, expect, it } from 'vitest'
import { catalogData, getSortedLocations, loadCatalog, validateCatalog } from '../lib/catalog'

function cloneCatalog() {
  return JSON.parse(JSON.stringify(catalogData))
}

describe('catalog validation', () => {
  it('accepts the bundled catalog', () => {
    const result = validateCatalog(catalogData)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('requires a version, default location, and at least one location', () => {
    const catalog = cloneCatalog()
    delete catalog.version
    catalog.defaultLocationId = 'missing'
    catalog.locations = []

    const result = validateCatalog(catalog)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('version must be a semantic version such as 1.0.0.')
    expect(result.errors).toContain('locations must contain at least one location.')
    expect(result.errors).toContain('defaultLocationId must match a location id.')
  })

  it('requires unique ids and order values', () => {
    const catalog = cloneCatalog()
    catalog.locations.push({ ...catalog.locations[0], name: 'Duplicate' })

    const result = validateCatalog(catalog)

    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('id must be unique'))).toBe(true)
    expect(result.errors.some((e) => e.includes('order must be unique'))).toBe(true)
  })

  it('requires a default location that exists', () => {
    const catalog = cloneCatalog()
    catalog.defaultLocationId = 'missing-location'

    const result = validateCatalog(catalog)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('defaultLocationId must match a location id.')
  })

  it('requires a narration transcript when narration is present', () => {
    const catalog = cloneCatalog()
    catalog.locations[0].narration.transcript = ''

    const result = validateCatalog(catalog)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('locations[0].narration.transcript is required.')
  })

  it('requires panorama placeholders and a valid field of view', () => {
    const catalog = cloneCatalog()
    catalog.locations[0].panorama.tileUrlTemplate = '/panoramas/placeholder/equirect.svg'
    catalog.locations[0].panorama.initialView.fov = 9
    catalog.locations[0].panorama.minFov = 2
    catalog.locations[0].panorama.maxFov = 1

    const result = validateCatalog(catalog)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('locations[0].panorama.tileUrlTemplate must contain {z}.')
    expect(result.errors).toContain('locations[0].panorama.tileUrlTemplate must contain {y}.')
    expect(result.errors).toContain('locations[0].panorama.tileUrlTemplate must contain {x}.')
    expect(result.errors).toContain('locations[0].panorama.minFov must be less than maxFov.')
    expect(result.errors).toContain(
      'locations[0].panorama.initialView.fov must be within minFov and maxFov.',
    )
  })

  it('throws when loading an invalid catalog', () => {
    const catalog = cloneCatalog()
    catalog.locations = []

    expect(() => loadCatalog(catalog)).toThrow(/Invalid tour catalog/)
  })

  it('returns locations sorted by order', () => {
    const locations = getSortedLocations(catalogData)

    const orders = locations.map((location) => location.order)
    const sortedOrders = [...orders].sort((a, b) => a - b)

    expect(orders).toEqual(sortedOrders)
  })
})
