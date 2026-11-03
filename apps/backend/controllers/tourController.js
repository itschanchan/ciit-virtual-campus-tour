import { asyncHandler } from '../utils/asyncHandler.js'
import { AppError } from '../utils/errors.js'
import { createTourService } from '../services/tourService.js'

export function createTourController() {
  return {
    getAllLocations: asyncHandler(async (req, res) => {
      const locations = await TourLocationService.getAllLocations()
      res.status(200).json(locations)
    }),

    getLocationBySlug: asyncHandler(async (req, res) => {
      const { slug } = req.params

      const location = await TourLocationService.getLocationBySlug(slug)

      if (!location) {
        throw new AppError('Tour location not found.', 404, 'LOCATION_NOT_FOUND')
      }

      res.status(200).json(location)
    }),
  }
}

const TourLocationService = createTourService()

export { TourLocationService }
