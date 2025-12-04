const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'completed'], 
        default: 'pending' 
    },
    checkInTime: Date,
    checkOutTime: Date,
    feedback: String,
    rating: Number
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);