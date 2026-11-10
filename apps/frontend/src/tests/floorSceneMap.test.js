import { describe, expect, it } from 'vitest'
import {
  FLOOR_SCENE_MAP,
  getFloorForSceneId,
  getSceneIdForFloor,
} from '../lib/floorSceneMap'
import { APP_DATA } from '../lib/data'

describe('floor scene sync map', () => {
  it('resolves every scene in APP_DATA to a floor button (Integration Rule 1)', () => {
    const sceneIds = APP_DATA.scenes.map((scene) => scene.id)

    expect(sceneIds).toHaveLength(54)

    for (const sceneId of sceneIds) {
      expect(getFloorForSceneId(sceneId), sceneId).not.toBeNull()
    }
  })

  it('syncs every scene of a floor to that floor button, not just the first scene', () => {
    expect(getFloorForSceneId('0-lg---1')).toBe('LG')
    expect(getFloorForSceneId('2-lg---3')).toBe('LG')
    expect(getFloorForSceneId('4-lg---5')).toBe('LG')
    expect(getFloorForSceneId('16-4f---11')).toBe('4F')
    expect(getFloorForSceneId('27-5m---1')).toBe('5M')
    expect(getFloorForSceneId('51-9f---5')).toBe('9F')
  })

  it('round-trips each designated first scene back to its floor', () => {
    for (const [floor, sceneId] of Object.entries(FLOOR_SCENE_MAP)) {
      expect(getSceneIdForFloor(floor)).toBe(sceneId)
      expect(getFloorForSceneId(sceneId)).toBe(floor)
    }
  })

  it('returns null for an unresolvable scene id so the previous highlight stays', () => {
    expect(getFloorForSceneId('99-xx---1')).toBeNull()
    expect(getFloorForSceneId('not-a-scene')).toBeNull()
    expect(getFloorForSceneId('')).toBeNull()
    expect(getFloorForSceneId(null)).toBeNull()
  })
})
