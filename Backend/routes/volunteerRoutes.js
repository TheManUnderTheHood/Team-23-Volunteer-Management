const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getRecommendedTasks, 
    applyForTask, 
    checkIn, 
    downloadCertificate,
    submitFeedback 
} = require('../controllers/volunteerController');

// All routes require login (Bearer Token)
router.use(protect);

// 1. Skill Matching: Get suggested tasks
router.get('/recommendations', getRecommendedTasks);

// 2. Action: Apply for a specific task
router.post('/apply', applyForTask);

// 3. Action: Check-in at venue (Requires lat/lng)
router.post('/checkin', checkIn);

// 4. Reward: Download PDF Certificate (Only if status = completed)
// Usage: Link this in frontend as <a href="/api/volunteers/certificate/{id}">
router.get('/certificate/:applicationId', downloadCertificate);

// 5. Feedback: Rate the experience
router.post('/feedback', submitFeedback);

module.exports = router;