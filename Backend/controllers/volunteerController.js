const Task = require('../models/Task');
const Application = require('../models/Application');

// Get Recommended Tasks (Skill Matching)
exports.getRecommendedTasks = async (req, res) => {
    try {
        // Find tasks where requiredSkills match User's skills
        const tasks = await Task.find({
            requiredSkills: { $in: req.user.skills },
            status: 'open'
        }).populate('event');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Apply for a Shift (Includes Overlap Prevention)
exports.applyForTask = async (req, res) => {
    const { taskId } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.filledSpots >= task.maxVolunteers) {
            return res.status(400).json({ message: 'Task is full' });
        }

        // 1. Check if already applied
        const existingApp = await Application.findOne({ user: req.user.id, task: taskId });
        if (existingApp) return res.status(400).json({ message: 'Already applied' });

        // 2. Overlap Check: Check other approved tasks for this user
        // Find all applications for this user that are approved
        const userApps = await Application.find({ user: req.user.id, status: 'approved' }).populate('task');
        
        const hasOverlap = userApps.some(app => {
            const t = app.task;
            // Check if time ranges intersect
            return (task.startTime < t.endTime && task.endTime > t.startTime);
        });

        if (hasOverlap) {
            return res.status(400).json({ message: 'You have a scheduling conflict with another approved task.' });
        }

        // Create Application
        await Application.create({
            user: req.user.id,
            task: taskId,
            status: 'pending' // Or 'approved' immediately if you want auto-approval
        });

        res.status(201).json({ message: 'Application successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Volunteer Check-In (Simple Version)
exports.checkIn = async (req, res) => {
    const { applicationId, lat, lng } = req.body;
    try {
        // In production, compare lat/lng with Event location radius
        const app = await Application.findById(applicationId);
        app.checkInTime = new Date();
        await app.save();
        res.json({ message: 'Checked in successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};