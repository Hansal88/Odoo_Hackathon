const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/verify-email
router.post('/verify-email', authController.verifyEmail);

// POST /api/auth/resend-verification-email
router.post('/resend-verification-email', authController.resendVerificationEmail);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me
router.get('/me', authMiddleware, userController.getCurrentUser);

module.exports = router;
