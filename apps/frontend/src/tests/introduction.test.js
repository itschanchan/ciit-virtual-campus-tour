import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import {
  readFirstVisitState,
  writeFirstVisitState,
  clearFirstVisitState,
} from '../lib/introduction'

const STORAGE_KEY = 'ciit_introduction_seen'

describe('introduction localStorage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  describe('readFirstVisitState', () => {
    it('returns default state when no key exists', () => {
      const state = readFirstVisitState()
      expect(state.hasSeenIntroduction).toBe(false)
      expect(state.firstVisitTimestamp).toBeNull()
    })

    it('returns stored state when key exists', () => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          hasSeenIntroduction: true,
          firstVisitTimestamp: '2026-11-18T00:00:00Z',
        }),
      )
      const state = readFirstVisitState()
      expect(state.hasSeenIntroduction).toBe(true)
      expect(state.firstVisitTimestamp).toBe('2026-11-18T00:00:00Z')
    })

    it('returns default state when stored value is malformed', () => {
      window.localStorage.setItem(STORAGE_KEY, 'not-json')
      const state = readFirstVisitState()
      expect(state.hasSeenIntroduction).toBe(false)
      expect(state.firstVisitTimestamp).toBeNull()
    })
  })

  describe('writeFirstVisitState', () => {
    it('writes state to localStorage', () => {
      writeFirstVisitState({
        hasSeenIntroduction: true,
        firstVisitTimestamp: '2026-11-18T00:00:00Z',
      })
      const raw = window.localStorage.getItem(STORAGE_KEY)
      expect(raw).toBe(
        JSON.stringify({
          hasSeenIntroduction: true,
          firstVisitTimestamp: '2026-11-18T00:00:00Z',
        }),
      )
    })
  })

  describe('clearFirstVisitState', () => {
    it('removes the key from localStorage', () => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ hasSeenIntroduction: true }),
      )
      clearFirstVisitState()
      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    })
  })
})
