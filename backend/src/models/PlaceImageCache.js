const mongoose = require('mongoose');

const placeImageCacheSchema = new mongoose.Schema(
  {
    placeName: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedPlace: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ['wikipedia', 'unsplash', 'fallback'],
      required: true,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    pageUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    photographer: {
      type: String,
      default: '',
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PlaceImageCache', placeImageCacheSchema);