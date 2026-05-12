const mongoose = require('mongoose');

const tripExploreSchema = new mongoose.Schema(
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
    travelStyle: {
      type: String,
      default: 'adventure',
    },
    attractions: {
      type: String,
      default: '',
    },
    hiddenGems: {
      type: String,
      default: '',
    },
    localExperiences: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
    foodRecommendations: {
      type: String,
      default: '',
    },
    transportOptions: {
      type: String,
      default: '',
    },
    budgetEstimates: {
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

tripExploreSchema.index({ tripId: 1, userId: 1 });
tripExploreSchema.index({ destination: 1 });

module.exports = mongoose.model('TripExplore', tripExploreSchema);
