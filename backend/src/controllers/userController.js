const mongoose = require('mongoose');
	const User = require('../models/User');

	const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

	const createUser = async (req, res) => {
		try {
			const { name, email, password, profilePhoto } = req.body;

			const user = await User.create({
				name,
				email,
				password,
				profilePhoto,
			});

			return res.status(201).json({
				success: true,
				message: 'User created successfully',
				data: user,
			});
		} catch (error) {
			if (error && error.code === 11000) {
				return res.status(409).json({
					success: false,
					message: 'Email already exists',
				});
			}

			if (error && error.name === 'ValidationError') {
				return res.status(400).json({
					success: false,
					message: error.message,
				});
			}

			return res.status(500).json({
				success: false,
				message: 'Failed to create user',
			});
		}
	};

	const getAllUsers = async (req, res) => {
		try {
			const users = await User.find().sort({ createdAt: -1 });

			return res.status(200).json({
				success: true,
				message: 'Users fetched successfully',
				data: users,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: 'Failed to fetch users',
			});
		}
	};

	const getUserById = async (req, res) => {
		try {
			const { id } = req.params;

			if (!isValidObjectId(id)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid user ID',
				});
			}

			const user = await User.findById(id);

			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				});
			}

			return res.status(200).json({
				success: true,
				message: 'User fetched successfully',
				data: user,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: 'Failed to fetch user',
			});
		}
	};

	const updateUser = async (req, res) => {
		try {
			const { id } = req.params;

			if (!isValidObjectId(id)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid user ID',
				});
			}

			const existingUser = await User.findById(id);

			if (!existingUser) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				});
			}

			const updatedUser = await User.findByIdAndUpdate(id, req.body, {
				new: true,
				runValidators: true,
			});

			return res.status(200).json({
				success: true,
				message: 'User updated successfully',
				data: updatedUser,
			});
		} catch (error) {
			if (error && error.code === 11000) {
				return res.status(409).json({
					success: false,
					message: 'Email already exists',
				});
			}

			if (error && error.name === 'ValidationError') {
				return res.status(400).json({
					success: false,
					message: error.message,
				});
			}

			return res.status(500).json({
				success: false,
				message: 'Failed to update user',
			});
		}
	};

	const deleteUser = async (req, res) => {
		try {
			const { id } = req.params;

			if (!isValidObjectId(id)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid user ID',
				});
			}

			const user = await User.findById(id);

			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				});
			}

			await User.findByIdAndDelete(id);

			return res.status(200).json({
				success: true,
				message: 'User deleted successfully',
				data: null,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: 'Failed to delete user',
			});
		}
	};

	const getCurrentUser = async (req, res) => {
		try {
			const user = req.user;
			if (!user) {
				return res.status(401).json({
					success: false,
					message: 'User not found',
				});
			}

			return res.status(200).json({
				success: true,
				message: 'User fetched successfully',
				data: user,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: 'Failed to fetch user',
			});
		}
	};

	module.exports = {
		createUser,
		getAllUsers,
		getUserById,
		updateUser,
		deleteUser,
		getCurrentUser,
	};