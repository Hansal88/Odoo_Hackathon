const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
	{
		activityName: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			trim: true,
			default: '',
		},
		description: {
			type: String,
			trim: true,
			default: '',
		},
		cost: {
			type: Number,
			default: 0,
			min: 0,
		},
		duration: {
			type: String,
			trim: true,
			default: '',
		},
		activityDate: {
			type: Date,
		},
		image: {
			type: String,
			default: '',
		},
		stopId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Stop',
			required: true,
		},
		tripId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Trip',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Activity', activitySchema);