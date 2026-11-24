import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { catalogData } from '../lib/catalog'
import { TourProvider } from '../context/TourContext'
import { useTour } from '../context/useTour'

function cloneCatalog() {
  return JSON.parse(JSON.stringify(catalogData))
}

function withSecondLocation() {
  const catalog = cloneCatalog()
  catalog.locations.push({
    ...catalog.locations[0],
    id: 'glitch-tower-library',
    name: 'Glitch Tower Library',
    description: 'Browse the library.',
    order: 12,
    narration: undefined,
  })
  return catalog
}

function Harness() {
  const {
    contentStatus,
    currentLocation,
    sidebarOpen,
    galleryOpen,
    activeNarration,
    narrationStatus,
    errorMessage,
    selectLocation,
    setCurrentSceneId,
    toggleSidebar,
    toggleGallery,
    playNarration,
    pauseNarration,
    setNarrationStatus,
  } = useTour()

  return (
    <div>
      <p>status:{contentStatus}</p>
      <p>location:{currentLocation?.name ?? 'none'}</p>
      <p>sidebar:{String(sidebarOpen)}</p>
      <p>gallery:{String(galleryOpen)}</p>
      <p>activeNarration:{activeNarration?.id ?? 'none'}</p>
      <p>narration:{narrationStatus}</p>
      <p>error:{errorMessage ?? 'none'}</p>
      <button onClick={() => selectLocation('glitch-tower-library')}>Select library</button>
      <button onClick={() => selectLocation('ug-ground')}>Select UG</button>
      <button onClick={() => selectLocation('missing')}>Select missing</button>
      <button onClick={() => setCurrentSceneId('1-lg---2')}>LG-2 scene</button>
      <button onClick={() => setCurrentSceneId('2-lg---3')}>LG-3 scene</button>
      <button onClick={() => setCurrentSceneId('0-lg---1')}>LG-1 scene</button>
      <button onClick={toggleSidebar}>Toggle sidebar</button>
      <button onClick={toggleGallery}>Toggle gallery</button>
      <button onClick={playNarration}>Play</button>
      <button onClick={pauseNarration}>Pause</button>
      <button onClick={() => setNarrationStatus('playing')}>Playing</button>
      <button onClick={() => setNarrationStatus('ended')}>Ended</button>
    </div>
  )
}

async function renderTour(catalogSource = withSecondLocation()) {
  render(
    <TourProvider catalogSource={catalogSource}>
      <Harness />
    </TourProvider>,
  )

  await waitFor(() => expect(screen.getByText('status:ready')).toBeInTheDocument())
}

describe('TourContext', () => {
  it('starts at the default location', async () => {
    await renderTour()

    expect(screen.getByText('location:Glitch Tower Lobby')).toBeInTheDocument()
    expect(screen.getByText('sidebar:true')).toBeInTheDocument()
    expect(screen.getByText('narration:idle')).toBeInTheDocument()
  })

  it('selects a location and resets gallery and narration state', async () => {
    await renderTour()

    fireEvent.click(screen.getByText('Toggle gallery'))
    fireEvent.click(screen.getByText('Play'))
    fireEvent.click(screen.getByText('Playing'))
    fireEvent.click(screen.getByText('Select library'))

    expect(screen.getByText('location:Glitch Tower Library')).toBeInTheDocument()
    expect(screen.getByText('gallery:false')).toBeInTheDocument()
    expect(screen.getByText('narration:idle')).toBeInTheDocument()
  })

  it('ignores an unknown location', async () => {
    await renderTour()

    fireEvent.click(screen.getByText('Select missing'))

    expect(screen.getByText('location:Glitch Tower Lobby')).toBeInTheDocument()
  })

  it('toggles the sidebar and gallery', async () => {
    await renderTour()

    fireEvent.click(screen.getByText('Toggle sidebar'))
    fireEvent.click(screen.getByText('Toggle gallery'))

    expect(screen.getByText('sidebar:false')).toBeInTheDocument()
    expect(screen.getByText('gallery:true')).toBeInTheDocument()
  })

  it('transitions narration through play, pause, resume, and replay', async () => {
    await renderTour()

    fireEvent.click(screen.getByText('Play'))
    expect(screen.getByText('narration:loading')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Playing'))
    expect(screen.getByText('narration:playing')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Pause'))
    expect(screen.getByText('narration:paused')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Play'))
    expect(screen.getByText('narration:playing')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Ended'))
    fireEvent.click(screen.getByText('Play'))
    expect(screen.getByText('narration:playing')).toBeInTheDocument()
  })

  it('shows a friendly error when the catalog is invalid', async () => {
    const catalog = cloneCatalog()
    catalog.locations = []

    render(
      <TourProvider catalogSource={catalog}>
        <Harness />
      </TourProvider>,
    )

    await waitFor(() => expect(screen.getByText('status:error')).toBeInTheDocument())
    expect(
      screen.getByText('error:The tour content could not be loaded. Please try again.'),
    ).toBeInTheDocument()
  })

  it('starts with the LG floor default narration voice-1', async () => {
    await renderTour()

    expect(screen.getByText('activeNarration:voice-1')).toBeInTheDocument()
  })

  it('switches to voice-2 on the LG-2 scene override', async () => {
    await renderTour()

    fireEvent.click(screen.getByText('LG-2 scene'))

    expect(screen.getByText('activeNarration:voice-2')).toBeInTheDocument()
  })

  it('keeps voice-2 playing on same-floor continuity from LG-2 to LG-3', async () => {
    await renderTour()

    fireEvent.click(screen.getByText('LG-2 scene'))
    fireEvent.click(screen.getByText('LG-3 scene'))

    expect(screen.getByText('activeNarration:voice-2')).toBeInTheDocument()
  })

  it('switches back to voice-1 on the explicit LG-1 scene', async () => {
    await renderTour()

    fireEvent.click(screen.getByText('LG-2 scene'))
    fireEvent.click(screen.getByText('LG-1 scene'))

    expect(screen.getByText('activeNarration:voice-1')).toBeInTheDocument()
  })

  it('switches to the floor default voice-3 when selecting UG', async () => {
    await renderTour()

    fireEvent.click(screen.getByText('Select UG'))

    expect(screen.getByText('activeNarration:voice-3')).toBeInTheDocument()
  })
})
