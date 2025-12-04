const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getRecommendedTasks, applyForTask, checkIn } = require('../controllers/volunteerController');

router.get('/recommendations', protect, getRecommendedTasks);
router.post('/apply', protect, applyForTask);
router.post('/checkin', protect, checkIn);

module.exports = router;