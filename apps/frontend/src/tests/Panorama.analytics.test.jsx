import { act, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let emitSceneChange = null

vi.mock('../components/PanoramaViewer', () => ({
  default: function PanoramaViewer({ onSceneChange }) {
    emitSceneChange = onSceneChange
    return null
  },
}))

vi.mock('../lib/analytics', () => ({
  trackPageView: vi.fn(),
  trackTourStart: vi.fn(),
  trackFloorView: vi.fn(),
  trackLocationView: vi.fn(),
}))

import { TourProvider } from '../context/TourContext'
import Panorama from '../pages/Panorama'
import { catalogData } from '../lib/catalog'
import { trackFloorView, trackLocationView } from '../lib/analytics'

async function renderPanorama(catalogSource = catalogData) {
  render(
    <TourProvider catalogSource={catalogSource}>
      <Panorama />
    </TourProvider>,
  )

  await waitFor(() => expect(emitSceneChange).toBeTypeOf('function'))
}

function buildCatalogWithoutNinthFloor() {
  const catalog = JSON.parse(JSON.stringify(catalogData))
  catalog.locations = catalog.locations.filter(
    (location) => location.order !== 11,
  )
  return catalog
}

function changeScene(sceneId) {
  act(() => {
    emitSceneChange(sceneId)
  })
}

describe('Panorama analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    emitSceneChange = null
  })

  it('tracks the first displayed scene as a floor and location view', async () => {
    await renderPanorama()

    changeScene('0-lg---1')

    expect(trackFloorView).toHaveBeenCalledTimes(1)
    expect(trackFloorView).toHaveBeenCalledWith({
      floor: 'LG',
      locationId: 'glitch-tower-lobby',
      sceneId: '0-lg---1',
    })
    expect(trackLocationView).toHaveBeenCalledTimes(1)
    expect(trackLocationView).toHaveBeenCalledWith({
      locationId: 'glitch-tower-lobby',
      floor: 'LG',
      sceneId: '0-lg---1',
    })
  })

  it('does not count another scene on the same floor', async () => {
    await renderPanorama()

    changeScene('0-lg---1')
    changeScene('1-lg---2')

    expect(trackFloorView).toHaveBeenCalledTimes(1)
    expect(trackLocationView).toHaveBeenCalledTimes(1)
  })

  it('counts a new floor and location when the scene changes floors', async () => {
    await renderPanorama()

    changeScene('0-lg---1')
    changeScene('6-ug---2')

    expect(trackFloorView).toHaveBeenCalledTimes(2)
    expect(trackFloorView).toHaveBeenLastCalledWith({
      floor: 'UG',
      locationId: 'ug-ground',
      sceneId: '6-ug---2',
    })
    expect(trackLocationView).toHaveBeenCalledTimes(2)
    expect(trackLocationView).toHaveBeenLastCalledWith({
      locationId: 'ug-ground',
      floor: 'UG',
      sceneId: '6-ug---2',
    })
  })

  it('counts a floor and location again when returning to them', async () => {
    await renderPanorama()

    changeScene('0-lg---1')
    changeScene('6-ug---2')
    changeScene('0-lg---1')

    expect(trackFloorView).toHaveBeenCalledTimes(3)
    expect(trackLocationView).toHaveBeenCalledTimes(3)
  })

  it('ignores scenes without a known floor', async () => {
    await renderPanorama()

    changeScene('0-lg---1')
    changeScene('99-xx---1')

    expect(trackFloorView).toHaveBeenCalledTimes(1)
    expect(trackLocationView).toHaveBeenCalledTimes(1)
  })

  it('sends a floor view without a location when the floor has no catalog location', async () => {
    await renderPanorama(buildCatalogWithoutNinthFloor())

    changeScene('51-9f---5')

    expect(trackFloorView).toHaveBeenCalledTimes(1)
    expect(trackFloorView).toHaveBeenCalledWith({
      floor: '9F',
      locationId: undefined,
      sceneId: '51-9f---5',
    })
    expect(trackLocationView).not.toHaveBeenCalled()
  })
})
