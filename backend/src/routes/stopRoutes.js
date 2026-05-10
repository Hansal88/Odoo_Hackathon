const express = require('express');
const {
	createStop,
	getAllStops,
	getStopById,
	updateStop,
	deleteStop,
} = require('../controllers/stopController');

const router = express.Router();

router.post('/', createStop);
router.get('/', getAllStops);
router.get('/:id', getStopById);
router.put('/:id', updateStop);
router.delete('/:id', deleteStop);

module.exports = router;
