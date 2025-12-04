const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    name: { type: String, required: true }, // e.g., "Medical Assistant"
    requiredSkills: [String],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    slotsAvailable: { type: Number, required: true },
    status: { type: String, enum: ['Open', 'Full', 'Completed'], default: 'Open' }
});

module.exports = mongoose.model('Task', TaskSchema);