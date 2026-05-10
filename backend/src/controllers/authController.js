const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/mailer');
const { generateToken } = require('../utils/jwt');

// Helper to format responses
function apiResponse(success, message, data = {}) {
  return { success, message, data };
}

// Register user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Log attempt for debugging (do not log password)
    // eslint-disable-next-line no-console
    console.log(`Register attempt for email=${email}, name=${name}`);
    if (!name || !email || !password) return res.status(400).json(apiResponse(false, 'Name, email and password are required'));

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json(apiResponse(false, 'Email already in use'));

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = new User({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
      lastVerificationEmailSent: new Date(),
    });
    await user.save();

    // Send verification email with code (don't fail registration on email error)
    try {
      await sendVerificationEmail(email, verificationCode, name);
      // eslint-disable-next-line no-console
      console.log(`Verification email sent to ${email}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send verification email', err);
    }

    return res.status(201).json(apiResponse(true, 'Registration successful. Please check your email to verify your account.', { userId: user._id, email: user.email }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Register error:', err);
    // Handle common Mongoose errors with appropriate status codes
    if (err && err.code === 11000) {
      return res.status(409).json(apiResponse(false, 'Email already in use'));
    }
    if (err && err.name === 'ValidationError') {
      return res.status(400).json(apiResponse(false, err.message || 'Validation failed'));
    }
    return res.status(500).json(apiResponse(false, err.message || 'Registration failed'));
  }
};

// Verify email with code
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json(apiResponse(false, 'Email and verification code are required'));

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json(apiResponse(false, 'Invalid or expired verification code'));

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // eslint-disable-next-line no-console
    console.log(`Email verified for user: ${user.email}`);
    return res.json(apiResponse(true, 'Email verified successfully', { userId: user._id }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Verify email error:', err);
    return res.status(500).json(apiResponse(false, err.message || 'Verification failed'));
  }
};

// Resend verification email
exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json(apiResponse(false, 'Email is required'));

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json(apiResponse(false, 'User not found'));

    if (user.isVerified) {
      return res.status(400).json(apiResponse(false, 'Email is already verified'));
    }

    // Check if resend was requested too soon (rate limiting)
    if (user.lastVerificationEmailSent) {
      const timeSinceLastEmail = Date.now() - user.lastVerificationEmailSent.getTime();
      if (timeSinceLastEmail < 60000) { // 1 minute
        return res.status(429).json(apiResponse(false, 'Please wait before requesting another email'));
      }
    }

    // Generate new 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    user.lastVerificationEmailSent = new Date();
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode, user.name);
      // eslint-disable-next-line no-console
      console.log(`Resend verification email sent to ${email}`);
      return res.json(apiResponse(true, 'Verification email sent successfully'));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send verification email', err);
      return res.status(500).json(apiResponse(false, 'Failed to send verification email'));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Resend verification email error:', err);
    return res.status(500).json(apiResponse(false, err.message || 'Failed to resend verification email'));
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(apiResponse(false, 'Email and password are required'));

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json(apiResponse(false, 'Invalid credentials'));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json(apiResponse(false, 'Invalid credentials'));

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first',
        email: user.email,
      });
    }

    const token = generateToken({ id: user._id });

    return res.json(apiResponse(true, 'Login successful', { token, userId: user._id, name: user.name }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Login error:', err);
    if (typeof next === 'function') return next(err);
    return res.status(500).json(apiResponse(false, err.message || 'Login failed'));
  }
};
