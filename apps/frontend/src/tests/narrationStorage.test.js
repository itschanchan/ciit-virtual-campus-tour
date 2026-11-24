import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clearNarrationState,
  readNarrationState,
  writeNarrationState,
} from '../lib/narrationStorage'

afterEach(() => {
  try {
    window.localStorage.clear()
  } catch {
    // ignore
  }
  vi.restoreAllMocks()
})

describe('narrationStorage', () => {
  it('returns null when no key exists', () => {
    expect(readNarrationState()).toBeNull()
  })

  it('writes and reads state round-trip', () => {
    writeNarrationState({ floor: '6F', isPaused: true })
    expect(readNarrationState()).toEqual({ floor: '6F', isPaused: true })
  })

  it('normalizes isPaused to a boolean', () => {
    writeNarrationState({ floor: 'UG', isPaused: 1 })
    expect(readNarrationState()).toEqual({ floor: 'UG', isPaused: true })
  })

  it('returns null for invalid JSON', () => {
    window.localStorage.setItem('ciit_narration_state', '{not json')
    expect(readNarrationState()).toBeNull()
  })

  it('returns null when the stored floor is missing', () => {
    window.localStorage.setItem('ciit_narration_state', '{}')
    expect(readNarrationState()).toBeNull()
  })

  it('clears the stored state', () => {
    writeNarrationState({ floor: 'LG', isPaused: false })
    clearNarrationState()
    expect(readNarrationState()).toBeNull()
  })

  it('does not throw when storage throws on write', () => {
    const setItem = window.localStorage.setItem.bind(window.localStorage)
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => writeNarrationState({ floor: 'LG', isPaused: false })).not.toThrow()
    window.localStorage.setItem = setItem
  })

  it('does not throw when storage throws on clear', () => {
    const removeItem = window.localStorage.removeItem.bind(window.localStorage)
    vi.spyOn(window.localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => clearNarrationState()).not.toThrow()
    window.localStorage.removeItem = removeItem
  })
})
