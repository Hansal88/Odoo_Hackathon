const express = require('express');
const router = express.Router();

// Root
router.get('/', (req, res) => res.json({ success: true, message: 'API root' }));

// Auth routes
const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

// Place image routes
const placeImageRoutes = require('./placeImageRoutes');
router.use('/place-images', placeImageRoutes);

// User routes
const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);

// Further routes (users, trips, etc.) can be mounted here

module.exports = router;
