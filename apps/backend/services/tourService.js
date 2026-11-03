import TourLocation from '../models/TourLocation.js'

export function createTourService({ TourLocationModel = TourLocation } = {}) {
  return {
    async getAllLocations() {
      const locations = await TourLocationModel.find({}).select('-__v').lean()
      return locations
    },

    async getLocationBySlug(slug) {
      const location = await TourLocationModel.findOne({ slug }).select('-__v').lean()
      return location
    },
  }
}
