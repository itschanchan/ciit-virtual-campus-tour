import { describe, expect, it } from 'vitest'
import { resolveAnalyticsRange } from '../utils/analytics.js'

function iso(value) {
  return value.toISOString()
}

describe('resolveAnalyticsRange', () => {
  it('uses Asia/Manila midnight for today', () => {
    const result = resolveAnalyticsRange('today', new Date('2026-11-27T05:00:00.000Z'))

    expect(result).toMatchObject({ range: 'today', timezone: 'Asia/Manila' })
    expect(iso(result.start)).toBe('2026-11-26T16:00:00.000Z')
    expect(iso(result.end)).toBe('2026-11-27T16:00:00.000Z')
  })

  it('keeps the same Manila day just before midnight', () => {
    const result = resolveAnalyticsRange('today', new Date('2026-11-27T15:59:59.999Z'))

    expect(iso(result.start)).toBe('2026-11-26T16:00:00.000Z')
    expect(iso(result.end)).toBe('2026-11-27T16:00:00.000Z')
  })

  it('rolls to the next Manila day at 16:00 UTC', () => {
    const result = resolveAnalyticsRange('today', new Date('2026-11-27T16:00:00.000Z'))

    expect(iso(result.start)).toBe('2026-11-27T16:00:00.000Z')
    expect(iso(result.end)).toBe('2026-11-28T16:00:00.000Z')
  })

  it('covers seven Manila days for 7d', () => {
    const result = resolveAnalyticsRange('7d', new Date('2026-11-27T05:00:00.000Z'))

    expect(iso(result.start)).toBe('2026-11-20T16:00:00.000Z')
    expect(iso(result.end)).toBe('2026-11-27T16:00:00.000Z')
  })

  it('covers thirty Manila days for 30d', () => {
    const result = resolveAnalyticsRange('30d', new Date('2026-11-27T05:00:00.000Z'))

    expect(iso(result.start)).toBe('2026-10-28T16:00:00.000Z')
    expect(iso(result.end)).toBe('2026-11-27T16:00:00.000Z')
  })

  it('handles month and year rollover', () => {
    const result = resolveAnalyticsRange('7d', new Date('2027-01-02T03:00:00.000Z'))

    expect(iso(result.start)).toBe('2026-12-26T16:00:00.000Z')
    expect(iso(result.end)).toBe('2027-01-02T16:00:00.000Z')
  })

  it('rejects unsupported ranges', () => {
    expect(resolveAnalyticsRange('90d', new Date('2026-11-27T05:00:00.000Z'))).toBeNull()
    expect(resolveAnalyticsRange(undefined)).toBeNull()
  })
})
