const mongoose = require('mongoose');
const Stop = require('../models/Stop');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createStop = async (req, res) => {
	try {
		const stop = await Stop.create(req.body);

		const populatedStop = await Stop.findById(stop._id).populate('tripId');

		return res.status(201).json({
			success: true,
			message: 'Stop created successfully',
			data: populatedStop,
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
			message: 'Failed to create stop',
		});
	}
};

const getAllStops = async (req, res) => {
	try {
		const stops = await Stop.find().populate('tripId').sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			message: 'Stops fetched successfully',
			data: stops,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch stops',
		});
	}
};

const getStopById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid stop ID',
			});
		}

		const stop = await Stop.findById(id).populate('tripId');

		if (!stop) {
			return res.status(404).json({
				success: false,
				message: 'Stop not found',
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Stop fetched successfully',
			data: stop,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch stop',
		});
	}
};

const updateStop = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid stop ID',
			});
		}

		const stop = await Stop.findById(id);

		if (!stop) {
			return res.status(404).json({
				success: false,
				message: 'Stop not found',
			});
		}

		const updatedStop = await Stop.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		}).populate('tripId');

		return res.status(200).json({
			success: true,
			message: 'Stop updated successfully',
			data: updatedStop,
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
			message: 'Failed to update stop',
		});
	}
};

const deleteStop = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid stop ID',
			});
		}

		const stop = await Stop.findById(id);

		if (!stop) {
			return res.status(404).json({
				success: false,
				message: 'Stop not found',
			});
		}

		await Stop.findByIdAndDelete(id);

		return res.status(200).json({
			success: true,
			message: 'Stop deleted successfully',
			data: null,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to delete stop',
		});
	}
};

module.exports = {
	createStop,
	getAllStops,
	getStopById,
	updateStop,
	deleteStop,
};