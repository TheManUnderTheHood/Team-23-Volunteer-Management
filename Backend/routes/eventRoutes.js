const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createEvent, createTask, getStats, verifyCompletion } = require('../controllers/eventController');

// Admin/Lead only
router.post('/', protect, authorize('admin'), createEvent);
router.post('/task', protect, authorize('admin'), createTask);
router.get('/stats', protect, authorize('admin'), getStats);
router.post('/verify', protect, authorize('admin', 'lead'), verifyCompletion);

module.exports = router;