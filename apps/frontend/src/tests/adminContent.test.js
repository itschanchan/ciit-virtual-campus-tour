import { beforeEach, describe, expect, it } from 'vitest'
import { catalogData } from '../lib/catalog'
import {
  appendActivity,
  applyAdminContent,
  getEffectiveGallery,
  readAdminContent,
  resetAdminContent,
  writeAdminContent,
} from '../lib/adminContent'

function cloneCatalog() {
  return JSON.parse(JSON.stringify(catalogData))
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('admin content store', () => {
  it('starts empty and exposes catalog defaults', () => {
    const content = readAdminContent()
    const location = catalogData.locations[0]

    expect(content.gallery).toEqual({})
    expect(content.settings.confirmDeletes).toBe(true)
    expect(getEffectiveGallery(location, content)).toEqual(location.gallery)
  })

  it('persists overrides and applies them to the tour catalog', () => {
    const content = readAdminContent()
    const customGallery = [
      { src: '/custom.svg', alt: 'Custom image', caption: 'Custom', order: 0 },
    ]

    const saved = writeAdminContent({
      ...content,
      gallery: { 'glitch-tower-lobby': customGallery },
      locations: {
        'glitch-tower-lobby': { name: 'Custom Lobby', description: 'Custom description.' },
      },
      settings: { ...content.settings, defaultLocationId: 'ug-ground' },
    })

    const applied = applyAdminContent(cloneCatalog())
    const lobby = applied.locations.find((location) => location.id === 'glitch-tower-lobby')

    expect(saved.updatedAt).toBeTruthy()
    expect(lobby.name).toBe('Custom Lobby')
    expect(lobby.description).toBe('Custom description.')
    expect(lobby.gallery).toHaveLength(1)
    expect(lobby.gallery[0].src).toBe('/custom.svg')
    expect(applied.defaultLocationId).toBe('ug-ground')
  })

  it('ignores overrides that would make the catalog invalid', () => {
    const content = readAdminContent()

    writeAdminContent({
      ...content,
      gallery: {
        'glitch-tower-lobby': [{ src: '', alt: '', caption: '', order: 0 }],
      },
    })

    const applied = applyAdminContent(cloneCatalog())
    const lobby = applied.locations.find((location) => location.id === 'glitch-tower-lobby')

    expect(lobby.gallery).toEqual(catalogData.locations[0].gallery)
  })

  it('keeps the newest activity entries first', () => {
    const first = appendActivity(readAdminContent(), 'First action', 'One')
    const second = appendActivity(first, 'Second action', 'Two')

    expect(second.activity[0].action).toBe('Second action')
    expect(second.activity[1].action).toBe('First action')
  })

  it('resets all stored content', () => {
    writeAdminContent({ ...readAdminContent(), settings: { defaultLocationId: 'ug-ground', confirmDeletes: false } })
    const reset = resetAdminContent()

    expect(reset.gallery).toEqual({})
    expect(readAdminContent().settings.defaultLocationId).toBe('')
  })
})
