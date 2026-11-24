import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearTranscriptCache, loadTranscript } from '../lib/transcripts'

const fetchMock = vi.fn()

beforeEach(() => {
  globalThis.fetch = fetchMock
  clearTranscriptCache()
})

afterEach(() => {
  vi.restoreAllMocks()
  delete globalThis.fetch
})

describe('loadTranscript', () => {
  it('returns null for empty src', async () => {
    expect(await loadTranscript('')).toBeNull()
    expect(await loadTranscript(null)).toBeNull()
  })

  it('returns cached text on repeated calls', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, text: async () => 'Hello world.\n\nSecond paragraph.' })
    const first = await loadTranscript('/transcripts/x.md')
    const second = await loadTranscript('/transcripts/x.md')
    expect(first).toBe('Hello world.\n\nSecond paragraph.')
    expect(second).toBe(first)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns null when the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404 })
    expect(await loadTranscript('/transcripts/missing.md')).toBeNull()
  })

  it('returns null when the text is empty', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, text: async () => '   ' })
    expect(await loadTranscript('/transcripts/empty.md')).toBeNull()
  })

  it('returns null on network rejection', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    expect(await loadTranscript('/transcripts/x.md')).toBeNull()
  })
})
