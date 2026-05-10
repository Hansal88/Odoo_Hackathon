const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema(
	{
		cityName: {
			type: String,
			required: true,
			trim: true,
		},
		country: {
			type: String,
			trim: true,
			default: '',
		},
		arrivalDate: {
			type: Date,
		},
		departureDate: {
			type: Date,
			validate: {
				validator(value) {
					if (!value || !this.arrivalDate) {
						return true;
					}

					return value >= this.arrivalDate;
				},
				message: 'departureDate must be greater than or equal to arrivalDate',
			},
		},
		notes: {
			type: String,
			trim: true,
			default: '',
		},
		estimatedCost: {
			type: Number,
			default: 0,
			min: 0,
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

module.exports = mongoose.model('Stop', stopSchema);