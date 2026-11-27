import { describe, expect, it } from 'vitest'
import AnalyticsEvent from '../models/AnalyticsEvents.js'

function schemaIndexes() {
  return AnalyticsEvent.schema.indexes().map(([fields, options]) => ({ fields, options }))
}

function findIndex(fields) {
  return schemaIndexes().find((entry) => {
    return JSON.stringify(entry.fields) === JSON.stringify(fields)
  })
}

describe('AnalyticsEvent schema indexes', () => {
  it('declares a unique eventId index for duplicate protection', () => {
    const entry = findIndex({ eventId: 1 })

    expect(entry).toBeDefined()
    expect(entry.options.unique).toBe(true)
  })

  it('declares a date-only index for totals queries', () => {
    expect(findIndex({ createdAt: -1 })).toBeDefined()
  })

  it('declares a floor grouping index bounded by the report window', () => {
    const entry = findIndex({ type: 1, createdAt: -1, floor: 1 })

    expect(entry).toBeDefined()
    expect(entry.options.unique).toBeUndefined()
  })

  it('declares a location grouping index bounded by the report window', () => {
    const entry = findIndex({ type: 1, createdAt: -1, locationId: 1 })

    expect(entry).toBeDefined()
    expect(entry.options.unique).toBeUndefined()
  })

  it('does not expire analytics events', () => {
    for (const entry of schemaIndexes()) {
      expect(entry.options.expireAfterSeconds).toBeUndefined()
    }
  })

  it('exposes init() so startup can await index creation', () => {
    expect(typeof AnalyticsEvent.init).toBe('function')
  })
})
