import { createContext } from 'react'

export const TourContext = createContext(null)

export const NARRATION_STATUSES = [
  'idle',
  'loading',
  'playing',
  'paused',
  'ended',
  'blocked',
  'error',
]
