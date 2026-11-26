import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { catalogData, getDefaultLocation, getSortedLocations, loadCatalog } from '../lib/catalog'
import { getFloorForLocation, getFloorForSceneId, getFloorIndex } from '../lib/floorSceneMap'
import {
  getDefaultNarrationForFloor,
  getNarrationById,
  resolveNarration,
} from '../lib/narrationCatalog'
import { readNarrationState, writeNarrationState } from '../lib/narrationStorage'
import { readSidebarState, writeSidebarState } from '../lib/sidebarStorage'
import { NARRATION_STATUSES, TourContext } from './tourContextValue'

function getInitialSidebarOpen() {
  const stored = readSidebarState()
  if (stored !== null) {
    return stored
  }

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true
  }

  return window.matchMedia('(min-width: 1024px)').matches
}

function createInitialState(restoredNarration) {
  return {
    catalog: null,
    currentLocationId: null,
    currentSceneId: null,
    activeNarrationId: null,
    contentStatus: 'loading',
    sidebarOpen: getInitialSidebarOpen(),
    galleryOpen: false,
    narrationStatus: restoredNarration?.isPaused ? 'paused' : 'idle',
    isMuted: false,
    errorMessage: null,
  }
}

function findLocationForFloor(catalog, floor) {
  if (!floor) {
    return null
  }

  const floorIndex = getFloorIndex(floor)

  if (floorIndex < 0) {
    return null
  }

  return catalog.locations.find((location) => location.order === floorIndex) ?? null
}

function reducer(state, action) {
  switch (action.type) {
    case 'CONTENT_READY':
      return {
        ...state,
        catalog: action.catalog,
        currentLocationId: action.currentLocationId,
        activeNarrationId: action.activeNarrationId,
        contentStatus: 'ready',
        errorMessage: null,
      }
    case 'CONTENT_ERROR':
      return {
        ...state,
        contentStatus: 'error',
        errorMessage: action.message,
      }
    case 'RETRY_CONTENT':
      return {
        ...state,
        contentStatus: 'loading',
        errorMessage: null,
      }
    case 'SET_SCENE': {
      const floor = getFloorForSceneId(action.sceneId)
      const nextEntry = resolveNarration(
        action.sceneId,
        floor,
        state.activeNarrationId,
      )
      const nextNarrationId = nextEntry?.id ?? null

      return {
        ...state,
        currentSceneId: action.sceneId,
        activeNarrationId: nextNarrationId,
        narrationStatus: nextNarrationId ? state.narrationStatus : 'idle',
      }
    }
    case 'SELECT_LOCATION': {
      const location = state.catalog?.locations.find(
        (candidate) => candidate.id === action.id,
      )
      if (!location) {
        return state
      }

      if (action.id === state.currentLocationId) {
        return { ...state, galleryOpen: false }
      }

      const entry = getDefaultNarrationForFloor(getFloorForLocation(location))

      return {
        ...state,
        currentLocationId: action.id,
        activeNarrationId: entry?.id ?? null,
        narrationStatus: entry ? state.narrationStatus : 'idle',
        galleryOpen: false,
      }
    }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.open }
    case 'TOGGLE_GALLERY':
      return { ...state, galleryOpen: !state.galleryOpen }
    case 'SET_GALLERY_OPEN':
      return { ...state, galleryOpen: action.open }
    case 'PLAY_NARRATION':
      if (state.narrationStatus === 'paused' || state.narrationStatus === 'ended') {
        return { ...state, narrationStatus: 'playing' }
      }

      if (['idle', 'error', 'blocked'].includes(state.narrationStatus)) {
        return { ...state, narrationStatus: 'loading' }
      }

      return state
    case 'PAUSE_NARRATION':
      if (state.narrationStatus === 'playing' || state.narrationStatus === 'loading') {
        return { ...state, narrationStatus: 'paused' }
      }

      return state
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted }
    case 'SET_NARRATION_STATUS':
      if (!NARRATION_STATUSES.includes(action.status)) {
        return state
      }

      return { ...state, narrationStatus: action.status }
    case 'RESET_NARRATION':
      return { ...state, narrationStatus: 'idle' }
    default:
      return state
  }
}

export function TourProvider({ children, catalogSource = catalogData }) {
  const [restoredNarration] = useState(readNarrationState)
  const [state, dispatch] = useReducer(reducer, restoredNarration, createInitialState)

  const loadContent = useCallback(() => {
    dispatch({ type: 'RETRY_CONTENT' })

    try {
      const catalog = loadCatalog(catalogSource)
      const defaultLocation = getDefaultLocation(catalog)

      if (!defaultLocation) {
        throw new Error('No default location is available.')
      }

      const restoredLocation = findLocationForFloor(
        catalog,
        restoredNarration?.floor,
      )
      const currentLocation = restoredLocation ?? defaultLocation
      const narration = getDefaultNarrationForFloor(
        getFloorForLocation(currentLocation),
      )

      dispatch({
        type: 'CONTENT_READY',
        catalog,
        currentLocationId: currentLocation.id,
        activeNarrationId: narration?.id ?? null,
      })
    } catch {
      dispatch({
        type: 'CONTENT_ERROR',
        message: 'The tour content could not be loaded. Please try again.',
      })
    }
  }, [catalogSource, restoredNarration])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  useEffect(() => {
    const entry = getNarrationById(state.activeNarrationId)

    if (!entry) {
      return
    }

    writeNarrationState({
      floor: entry.floor,
      isPaused: ['paused', 'blocked', 'ended'].includes(state.narrationStatus),
    })
  }, [state.activeNarrationId, state.narrationStatus])

  useEffect(() => {
    writeSidebarState(state.sidebarOpen)
  }, [state.sidebarOpen])

  const selectLocation = useCallback((id) => {
    dispatch({ type: 'SELECT_LOCATION', id })
  }, [])

  const setCurrentSceneId = useCallback((sceneId) => {
    dispatch({ type: 'SET_SCENE', sceneId })
  }, [])

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }, [])

  const setSidebarOpen = useCallback((open) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', open })
  }, [])

  const toggleGallery = useCallback(() => {
    dispatch({ type: 'TOGGLE_GALLERY' })
  }, [])

  const setGalleryOpen = useCallback((open) => {
    dispatch({ type: 'SET_GALLERY_OPEN', open })
  }, [])

  const playNarration = useCallback(() => {
    dispatch({ type: 'PLAY_NARRATION' })
  }, [])

  const pauseNarration = useCallback(() => {
    dispatch({ type: 'PAUSE_NARRATION' })
  }, [])

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' })
  }, [])

  const setNarrationStatus = useCallback((status) => {
    dispatch({ type: 'SET_NARRATION_STATUS', status })
  }, [])

  const resetNarration = useCallback(() => {
    dispatch({ type: 'RESET_NARRATION' })
  }, [])

  const currentLocation = useMemo(
    () => state.catalog?.locations.find((location) => location.id === state.currentLocationId) ?? null,
    [state.catalog, state.currentLocationId],
  )

  const activeNarration = useMemo(
    () => getNarrationById(state.activeNarrationId),
    [state.activeNarrationId],
  )

  const locations = useMemo(
    () => (state.catalog ? getSortedLocations(state.catalog) : []),
    [state.catalog],
  )

  const value = useMemo(
    () => ({
      ...state,
      catalog: state.catalog ?? { version: '1.0.0', defaultLocationId: '', locations: [] },
      locations,
      currentLocation,
      activeNarration,
      selectLocation,
      setCurrentSceneId,
      toggleSidebar,
      setSidebarOpen,
      toggleGallery,
      setGalleryOpen,
      playNarration,
      pauseNarration,
      toggleMute,
      setNarrationStatus,
      resetNarration,
      retryContent: loadContent,
    }),
    [
      state,
      locations,
      currentLocation,
      activeNarration,
      selectLocation,
      setCurrentSceneId,
      toggleSidebar,
      setSidebarOpen,
      toggleGallery,
      setGalleryOpen,
      playNarration,
      pauseNarration,
      toggleMute,
      setNarrationStatus,
      resetNarration,
      loadContent,
    ],
  )

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}
