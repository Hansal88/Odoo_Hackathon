const mongoose = require('mongoose');

const tripBudgetSchema = new mongoose.Schema(
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
    totalBudget: {
      type: Number,
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
    travelStyle: {
      type: String,
      default: 'adventure',
    },
    accommodationPercentage: {
      type: Number,
      default: 0,
    },
    foodPercentage: {
      type: Number,
      default: 0,
    },
    transportPercentage: {
      type: Number,
      default: 0,
    },
    activitiesPercentage: {
      type: Number,
      default: 0,
    },
    shoppingPercentage: {
      type: Number,
      default: 0,
    },
    emergencyPercentage: {
      type: Number,
      default: 0,
    },
    accommodationDetails: {
      type: String,
      default: '',
    },
    foodDetails: {
      type: String,
      default: '',
    },
    transportDetails: {
      type: String,
      default: '',
    },
    activitiesDetails: {
      type: String,
      default: '',
    },
    moneySavingTips: {
      type: String,
      default: '',
    },
    hiddenCosts: {
      type: String,
      default: '',
    },
    dailySpendingLimit: {
      type: Number,
      default: 0,
    },
    paymentMethods: {
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

tripBudgetSchema.index({ tripId: 1, userId: 1 });
tripBudgetSchema.index({ destination: 1 });

module.exports = mongoose.model('TripBudget', tripBudgetSchema);
