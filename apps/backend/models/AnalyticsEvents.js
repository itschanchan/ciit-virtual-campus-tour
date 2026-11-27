import mongoose from 'mongoose'

// One row per tracked visitor event. No IP addresses, user agents, or
// account identifiers are stored; sessionId is an anonymous browser value.
const AnalyticsEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['page_view', 'tour_start', 'floor_view', 'location_view'],
    },
    sessionId: { type: String, required: true, trim: true },
    path: { type: String, default: null },
    floor: { type: String, default: null },
    locationId: { type: String, default: null },
    sceneId: { type: String, default: null },
  },
  {
    timestamps: true,
  },
)

// Date-only totals, then type-scoped groupings. createdAt sits before the
// grouped field so the reporting window stays a bounded index range.
AnalyticsEventSchema.index({ createdAt: -1 })
AnalyticsEventSchema.index({ type: 1, createdAt: -1, floor: 1 })
AnalyticsEventSchema.index({ type: 1, createdAt: -1, locationId: 1 })

export const AnalyticsEvent =
  mongoose.models.AnalyticsEvent ||
  mongoose.model('AnalyticsEvent', AnalyticsEventSchema)

export default AnalyticsEvent
