import mongoose from 'mongoose'

const tourLocationSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    panoramaUrl: {
      type: String,
      required: true,
    },
    galleryImages: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('TourLocation', tourLocationSchema)
