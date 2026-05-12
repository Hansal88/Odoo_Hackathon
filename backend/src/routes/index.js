const express = require('express');
const router = express.Router();

// Root
router.get('/', (req, res) => res.json({ success: true, message: 'API root' }));

// Auth routes
const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

<<<<<<< HEAD
// Place image routes
const placeImageRoutes = require('./placeImageRoutes');
router.use('/place-images', placeImageRoutes);

=======
>>>>>>> a50ef801b0859d710a0c82e1bb15db0cf3c41bb0
// User routes
const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);

// Further routes (users, trips, etc.) can be mounted here

module.exports = router;
