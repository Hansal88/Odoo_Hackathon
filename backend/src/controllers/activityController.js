const mongoose = require('mongoose');
const Activity = require('../models/Activity');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createActivity = async (req, res) => {
	try {
		const activity = await Activity.create(req.body);

		const populatedActivity = await Activity.findById(activity._id)
			.populate('tripId')
			.populate('stopId');

		return res.status(201).json({
			success: true,
			message: 'Activity created successfully',
			data: populatedActivity,
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
			message: 'Failed to create activity',
		});
	}
};

const getAllActivities = async (req, res) => {
	try {
		const activities = await Activity.find()
			.populate('tripId')
			.populate('stopId')
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			message: 'Activities fetched successfully',
			data: activities,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch activities',
		});
	}
};

const getActivityById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid activity ID',
			});
		}

		const activity = await Activity.findById(id)
			.populate('tripId')
			.populate('stopId');

		if (!activity) {
			return res.status(404).json({
				success: false,
				message: 'Activity not found',
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Activity fetched successfully',
			data: activity,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch activity',
		});
	}
};

const updateActivity = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid activity ID',
			});
		}

		const activity = await Activity.findById(id);

		if (!activity) {
			return res.status(404).json({
				success: false,
				message: 'Activity not found',
			});
		}

		const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		})
			.populate('tripId')
			.populate('stopId');

		return res.status(200).json({
			success: true,
			message: 'Activity updated successfully',
			data: updatedActivity,
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
			message: 'Failed to update activity',
		});
	}
};

const deleteActivity = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid activity ID',
			});
		}

		const activity = await Activity.findById(id);

		if (!activity) {
			return res.status(404).json({
				success: false,
				message: 'Activity not found',
			});
		}

		await Activity.findByIdAndDelete(id);

		return res.status(200).json({
			success: true,
			message: 'Activity deleted successfully',
			data: null,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to delete activity',
		});
	}
};

module.exports = {
	createActivity,
	getAllActivities,
	getActivityById,
	updateActivity,
	deleteActivity,
};