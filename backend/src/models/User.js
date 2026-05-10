const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		profilePhoto: {
			type: String,
			default: '',
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verificationCode: {
			type: String,
			default: null,
		},
		verificationCodeExpires: {
			type: Date,
			default: null,
		},
		lastVerificationEmailSent: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

// Hash password before saving
userSchema.pre('save', async function () {
	if (!this.isModified('password')) return;
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	} catch (error) {
		throw new Error(`Password hashing failed: ${error.message}`);
	}
});

// Compare password method
userSchema.methods.comparePassword = function (plainPassword) {
	return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);