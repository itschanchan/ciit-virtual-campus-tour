import { describe, expect, it } from 'vitest'
import { existsSync } from 'fs'
import path, { join } from 'path'
import { fileURLToPath } from 'node:url'
import {
  getDefaultNarrationForFloor,
  getNarrationById,
  getNarrationForScene,
  narrationCatalog,
  resolveNarration,
} from '../lib/narrationCatalog'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = join(__dirname, '..', '..', 'public')

describe('narration catalog', () => {
  it('has version 1.0.0', () => {
    expect(narrationCatalog.version).toBe('1.0.0')
  })

  it('has exactly ten entries', () => {
    expect(narrationCatalog.entries).toHaveLength(10)
  })

  it('maps voice-1 through voice-10 with unique numbers', () => {
    const ids = narrationCatalog.entries.map((e) => e.id)
    const numbers = narrationCatalog.entries.map((e) => e.number)
    expect(ids).toEqual([
      'voice-1',
      'voice-2',
      'voice-3',
      'voice-4',
      'voice-5',
      'voice-6',
      'voice-7',
      'voice-8',
      'voice-9',
      'voice-10',
    ])
    expect(new Set(numbers).size).toBe(10)
  })

  it('pairs each voice-N with transcript-N', () => {
    for (const entry of narrationCatalog.entries) {
      expect(entry.id).toBe(`voice-${entry.number}`)
      expect(entry.transcriptId).toBe(`transcript-${entry.number}`)
    }
  })

  it('assigns every recording to a narrated floor', () => {
    const floors = new Set(narrationCatalog.entries.map((e) => e.floor))
    expect([...floors].sort()).toEqual([
      '4F',
      '5F',
      '5M',
      '6F',
      '7F',
      '8F',
      '9F',
      'LG',
      'UG',
    ])
  })

  it('links audioSrc and transcriptSrc to the correct numbered files', () => {
    for (const entry of narrationCatalog.entries) {
      expect(entry.audioSrc).toBe(
        `/voice/CIIT_Glitch_Virtual_Campus_Recording_${entry.number}.mp3`,
      )
      expect(entry.transcriptSrc).toBe(
        `/transcripts/CIIT_Glitch_Virtual_Campus_Transcript_${entry.number}.md`,
      )
    }
  })

  it('references no locked floors', () => {
    const locked = ['1F', '2F', '3F', '10F', '11F']
    for (const entry of narrationCatalog.entries) {
      expect(locked).not.toContain(entry.floor)
    }
  })

  it('no entry references the placeholder asset', () => {
    for (const entry of narrationCatalog.entries) {
      expect(entry.audioSrc).not.toBe('/panoramas/placeholder/narration.wav')
    }
  })
})

describe('getNarrationById', () => {
  it('returns the exact entry for a known id', () => {
    expect(getNarrationById('voice-3')?.id).toBe('voice-3')
    expect(getNarrationById('voice-3')?.number).toBe(3)
  })

  it('returns null for unknown ids', () => {
    expect(getNarrationById('voice-99')).toBeNull()
    expect(getNarrationById(null)).toBeNull()
    expect(getNarrationById('')).toBeNull()
  })
})

describe('getNarrationForScene', () => {
  it('returns voice-1 for scene 0-lg---1', () => {
    expect(getNarrationForScene('0-lg---1')?.id).toBe('voice-1')
  })

  it('returns voice-2 for scene 1-lg---2', () => {
    expect(getNarrationForScene('1-lg---2')?.id).toBe('voice-2')
  })

  it('returns null for scenes without an entry', () => {
    expect(getNarrationForScene('6-ug---2')).toBeNull()
    expect(getNarrationForScene(null)).toBeNull()
  })
})

describe('getDefaultNarrationForFloor', () => {
  it('returns voice-1 for LG', () => {
    expect(getDefaultNarrationForFloor('LG')?.id).toBe('voice-1')
  })

  it('returns voice-3 for UG', () => {
    expect(getDefaultNarrationForFloor('UG')?.id).toBe('voice-3')
  })

  it('returns voice-10 for 9F', () => {
    expect(getDefaultNarrationForFloor('9F')?.id).toBe('voice-10')
  })

  it('returns null for locked floors', () => {
    expect(getDefaultNarrationForFloor('1F')).toBeNull()
    expect(getDefaultNarrationForFloor(null)).toBeNull()
  })
})

describe('resolveNarration', () => {
  it('prefers an explicit scene match over same-floor continuity', () => {
    expect(resolveNarration('1-lg---2', 'LG', 'voice-1')?.id).toBe('voice-2')
  })

  it('keeps the current entry on same-floor continuity', () => {
    expect(resolveNarration('2-lg---3', 'LG', 'voice-2')?.id).toBe('voice-2')
  })

  it('falls back to the floor default on a floor change', () => {
    expect(resolveNarration('6-ug---2', 'UG', 'voice-2')?.id).toBe('voice-3')
  })

  it('returns null when the floor has no narration', () => {
    expect(resolveNarration('10-4f---1', '1F', 'voice-1')).toBeNull()
  })
})

describe('narration catalog file existence', () => {
  it('every audioSrc file exists under public', () => {
    for (const entry of narrationCatalog.entries) {
      const path = join(PUBLIC_DIR, entry.audioSrc)
      expect(existsSync(path), `${entry.audioSrc} should exist`).toBe(true)
    }
  })

  it('every transcriptSrc file exists under public', () => {
    for (const entry of narrationCatalog.entries) {
      const path = join(PUBLIC_DIR, entry.transcriptSrc)
      expect(existsSync(path), `${entry.transcriptSrc} should exist`).toBe(true)
    }
  })

  it('all ten recording and transcript pairs are unique', () => {
    const audioSrcs = narrationCatalog.entries.map((e) => e.audioSrc)
    const transcriptSrcs = narrationCatalog.entries.map((e) => e.transcriptSrc)
    expect(new Set(audioSrcs).size).toBe(10)
    expect(new Set(transcriptSrcs).size).toBe(10)
  })
})
