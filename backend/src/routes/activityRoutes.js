const express = require('express');
const {
	createActivity,
	getAllActivities,
	getActivityById,
	updateActivity,
	deleteActivity,
} = require('../controllers/activityController');

const router = express.Router();

router.post('/', createActivity);
router.get('/', getAllActivities);
router.get('/:id', getActivityById);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;