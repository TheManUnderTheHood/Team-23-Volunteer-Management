const Task = require('../models/Task');
const Application = require('../models/Application');
const PDFDocument = require('pdfkit');

// --- Helper: Haversine Formula for Geofencing ---
const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000; // Return in meters
};

// 1. Get Tasks Recommended for User's Skills
exports.getRecommendedTasks = async (req, res) => {
    try {
        // Find tasks where 'requiredSkills' are present in the User's 'skills' array
        const tasks = await Task.find({
            requiredSkills: { $in: req.user.skills },
            status: 'open'
        }).populate('event');
        
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Apply for a Task (With Overlap Protection)
exports.applyForTask = async (req, res) => {
    const { taskId } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Check if full
        if (task.filledSpots >= task.maxVolunteers) {
            return res.status(400).json({ message: 'Task is full' });
        }

        // Check if already applied
        const existingApp = await Application.findOne({ user: req.user.id, task: taskId });
        if (existingApp) return res.status(400).json({ message: 'Already applied' });

        // Overlap Check: Find all APPROVED tasks for this user
        const userApps = await Application.find({ user: req.user.id, status: 'approved' }).populate('task');
        
        const hasOverlap = userApps.some(app => {
            const t = app.task;
            // Check if time ranges intersect
            return (task.startTime < t.endTime && task.endTime > t.startTime);
        });

        if (hasOverlap) {
            return res.status(400).json({ message: 'Conflict: You have another shift at this time.' });
        }

        // Create Application
        await Application.create({
            user: req.user.id,
            task: taskId,
            status: 'pending' // Admin must approve, or change to 'approved' for auto-join
        });

        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Check-In (With Geofencing Validation)
exports.checkIn = async (req, res) => {
    const { applicationId, lat, lng } = req.body;
    try {
        // Deep populate to get the Event location inside the Task
        const app = await Application.findById(applicationId).populate({
            path: 'task',
            populate: { path: 'event' }
        });

        if (!app) return res.status(404).json({ message: 'Application not found' });

        // Get Event Coordinates
        const eventLat = app.task.event.location.lat;
        const eventLng = app.task.event.location.lng;

        // Calculate Distance
        const distance = getDistanceFromLatLonInM(lat, lng, eventLat, eventLng);

        // Validation: Must be within 500 meters
        if (distance > 500) {
            return res.status(400).json({ 
                message: `Check-in Failed: You are ${Math.round(distance)}m away. Please go to the venue.` 
            });
        }

        app.checkInTime = new Date();
        await app.save();

        res.json({ message: 'Checked in successfully! Good luck with your shift.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Generate & Download PDF Certificate
exports.downloadCertificate = async (req, res) => {
    const { applicationId } = req.params;
    try {
        const app = await Application.findById(applicationId)
            .populate('user')
            .populate({
                path: 'task',
                populate: { path: 'event' }
            });

        if (!app || app.status !== 'completed') {
            return res.status(400).json({ message: 'Task not completed or not verified yet.' });
        }

        // Initialize PDF
        const doc = new PDFDocument({ layout: 'landscape' });

        // Set headers so browser downloads it
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificate-${app.user.name.replace(/\s/g, '_')}.pdf`);

        doc.pipe(res);

        // --- Design the Certificate ---
        // You can load an image here using doc.image('path/to/logo.png', ...)
        
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke(); // Border

        doc.fontSize(36).font('Helvetica-Bold').text('CERTIFICATE OF APPRECIATION', { align: 'center', valign: 'center' });
        doc.moveDown(1);
        
        doc.fontSize(18).font('Helvetica').text(`This certificate is proudly presented to`, { align: 'center' });
        doc.moveDown(0.5);
        
        doc.fontSize(28).font('Helvetica-Bold').text(app.user.name, { align: 'center', underline: true });
        doc.moveDown(0.5);
        
        doc.fontSize(16).font('Helvetica').text(`For their outstanding contribution and dedication as a volunteer.`, { align: 'center' });
        doc.moveDown(0.5);

        doc.fontSize(20).text(`Event: ${app.task.event.title}`, { align: 'center' });
        doc.fontSize(15).text(`Role: ${app.task.title}`, { align: 'center' });
        
        doc.moveDown(2);
        doc.fontSize(12).text(`Date Issued: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.text('Signature: ____________________', { align: 'center' });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Submit Feedback (Volunteer -> Org)
exports.submitFeedback = async (req, res) => {
    const { applicationId, rating, feedback } = req.body;
    try {
        const app = await Application.findById(applicationId);
        
        // Security check: ensure user owns this app
        if(app.user.toString() !== req.user.id) {
             return res.status(401).json({ message: 'Not authorized' });
        }

        app.rating = rating;
        app.feedback = feedback;
        await app.save();

        res.json({ message: 'Thank you for your feedback!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};