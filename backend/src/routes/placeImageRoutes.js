const express = require('express');
const router = express.Router();
const { getPlaceImage } = require('../controllers/placeImageController');

router.get('/', getPlaceImage);

module.exports = router;