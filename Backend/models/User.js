const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['volunteer', 'admin', 'team_lead'], 
        default: 'volunteer' 
    },
    skills: [String], // e.g., ['First Aid', 'Cooking']
    totalHours: { type: Number, default: 0 },
    badges: [String], // e.g., ['50 Hours Club']
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);