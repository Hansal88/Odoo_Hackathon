const mongoose = require('mongoose');

const tripPackingSchema = new mongoose.Schema(
  {
    tripId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    travelers: {
      type: Number,
      default: 1,
    },
    season: {
      type: String,
      enum: ['summer', 'monsoon', 'autumn', 'winter'],
      default: 'summer',
    },
    travelStyle: {
      type: String,
      default: 'adventure',
    },
    clothing: {
      type: String,
      default: '',
    },
    footwear: {
      type: String,
      default: '',
    },
    toiletries: {
      type: String,
      default: '',
    },
    medications: {
      type: String,
      default: '',
    },
    electronics: {
      type: String,
      default: '',
    },
    documents: {
      type: String,
      default: '',
    },
    optionalItems: {
      type: String,
      default: '',
    },
    activityGear: {
      type: String,
      default: '',
    },
    packingTips: {
      type: String,
      default: '',
    },
    luggageOptimization: {
      type: String,
      default: '',
    },
    fullContent: {
      type: String,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

tripPackingSchema.index({ tripId: 1, userId: 1 });
tripPackingSchema.index({ destination: 1 });

module.exports = mongoose.model('TripPacking', tripPackingSchema);
