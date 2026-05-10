const mongoose = require('mongoose');
const Trip = require('../models/Trip');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createTrip = async (req, res) => {
	try {
		const trip = await Trip.create(req.body);

		const populatedTrip = await Trip.findById(trip._id)
			.populate('userId')
			.populate('stops')
			.populate('activities');

		return res.status(201).json({
			success: true,
			message: 'Trip created successfully',
			data: populatedTrip,
		});
	} catch (error) {
		if (error && error.name === 'ValidationError') {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}

		return res.status(500).json({
			success: false,
			message: 'Failed to create trip',
		});
	}
};

const getAllTrips = async (req, res) => {
	try {
		const trips = await Trip.find()
			.populate('userId')
			.populate('stops')
			.populate('activities')
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			message: 'Trips fetched successfully',
			data: trips,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch trips',
		});
	}
};

const getTripById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid trip ID',
			});
		}

		const trip = await Trip.findById(id)
			.populate('userId')
			.populate('stops')
			.populate('activities');

		if (!trip) {
			return res.status(404).json({
				success: false,
				message: 'Trip not found',
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Trip fetched successfully',
			data: trip,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch trip',
		});
	}
};

const updateTrip = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid trip ID',
			});
		}

		const trip = await Trip.findById(id);

		if (!trip) {
			return res.status(404).json({
				success: false,
				message: 'Trip not found',
			});
		}

		const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		})
			.populate('userId')
			.populate('stops')
			.populate('activities');

		return res.status(200).json({
			success: true,
			message: 'Trip updated successfully',
			data: updatedTrip,
		});
	} catch (error) {
		if (error && error.name === 'ValidationError') {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}

		return res.status(500).json({
			success: false,
			message: 'Failed to update trip',
		});
	}
};

const deleteTrip = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid trip ID',
			});
		}

		const trip = await Trip.findById(id);

		if (!trip) {
			return res.status(404).json({
				success: false,
				message: 'Trip not found',
			});
		}

		await Trip.findByIdAndDelete(id);

		return res.status(200).json({
			success: true,
			message: 'Trip deleted successfully',
			data: null,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to delete trip',
		});
	}
};

module.exports = {
	createTrip,
	getAllTrips,
	getTripById,
	updateTrip,
	deleteTrip,
};