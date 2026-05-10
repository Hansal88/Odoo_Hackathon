const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
	{
		tripName: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			default: '',
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
			validate: {
				validator(value) {
					if (!value || !this.startDate) {
						return true;
					}

					return value >= this.startDate;
				},
				message: 'endDate must be greater than or equal to startDate',
			},
		},
		budget: {
			type: Number,
			default: 0,
			min: 0,
		},
		coverPhoto: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			enum: ['planned', 'ongoing', 'completed'],
			default: 'planned',
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		stops: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Stop',
				},
			],
			default: [],
		},
		activities: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Activity',
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Trip', tripSchema);