const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: String,
    date: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);