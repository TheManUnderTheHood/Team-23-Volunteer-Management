const Event = require('../models/Event');
const Task = require('../models/Task');
const Application = require('../models/Application');

// Create Event
const createEvent = async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, organizer: req.user.id });
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create Task
const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Stats
const getStats = async (req, res) => {
    try {
        const totalVolunteers = await Application.countDocuments({ status: 'approved' });
        const totalEvents = await Event.countDocuments();
        res.json({ totalVolunteers, totalEvents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify Completion
const verifyCompletion = async (req, res) => {
    const { applicationId } = req.body;
    try {
        const app = await Application.findById(applicationId).populate('task').populate('user');
        if (!app) return res.status(404).json({ message: 'Application not found' });

        app.status = 'completed';
        await app.save();

        // Update User Hours
        const user = app.user;
        const durationHours = (new Date(app.task.endTime) - new Date(app.task.startTime)) / 36e5; 
        user.totalHours += durationHours || 0;
        
        // Add Badge if needed
        if (user.totalHours >= 50 && !user.badges.includes('50 Hours Club')) {
            user.badges.push('50 Hours Club');
        }
        await user.save();

        res.json({ message: 'Task verified, hours updated', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEvent, createTask, getStats, verifyCompletion };