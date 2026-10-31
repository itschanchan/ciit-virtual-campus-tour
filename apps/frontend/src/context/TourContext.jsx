import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { catalogData, getDefaultLocation, getSortedLocations, loadCatalog } from '../lib/catalog'
import { NARRATION_STATUSES, TourContext } from './tourContextValue'

function getInitialSidebarOpen() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true
  }

  return window.matchMedia('(min-width: 1024px)').matches
}

function createInitialState() {
  return {
    catalog: null,
    currentLocationId: null,
    contentStatus: 'loading',
    sidebarOpen: getInitialSidebarOpen(),
    galleryOpen: false,
    narrationStatus: 'idle',
    errorMessage: null,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'CONTENT_READY':
      return {
        ...state,
        catalog: action.catalog,
        currentLocationId: action.currentLocationId,
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
    case 'SELECT_LOCATION': {
      const exists = state.catalog?.locations.some((location) => location.id === action.id)
      if (!exists) {
        return state
      }

      return {
        ...state,
        currentLocationId: action.id,
        galleryOpen: false,
        narrationStatus: 'idle',
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
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  const loadContent = useCallback(() => {
    dispatch({ type: 'RETRY_CONTENT' })

    try {
      const catalog = loadCatalog(catalogSource)
      const defaultLocation = getDefaultLocation(catalog)

      if (!defaultLocation) {
        throw new Error('No default location is available.')
      }

      dispatch({
        type: 'CONTENT_READY',
        catalog,
        currentLocationId: defaultLocation.id,
      })
    } catch {
      dispatch({
        type: 'CONTENT_ERROR',
        message: 'The tour content could not be loaded. Please try again.',
      })
    }
  }, [catalogSource])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  const selectLocation = useCallback((id) => {
    dispatch({ type: 'SELECT_LOCATION', id })
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
      selectLocation,
      toggleSidebar,
      setSidebarOpen,
      toggleGallery,
      setGalleryOpen,
      playNarration,
      pauseNarration,
      setNarrationStatus,
      resetNarration,
      retryContent: loadContent,
    }),
    [
      state,
      locations,
      currentLocation,
      selectLocation,
      toggleSidebar,
      setSidebarOpen,
      toggleGallery,
      setGalleryOpen,
      playNarration,
      pauseNarration,
      setNarrationStatus,
      resetNarration,
      loadContent,
    ],
  )

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}
