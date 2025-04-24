const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    skills: {
        type: String,
        required: [true, 'Skills are required'],
        trim: true
    },
    interests: [{
        type: String,
        trim: true
    }],
    availability: {
        type: String,
        required: [true, 'Availability is required'],
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);
module.exports = Volunteer; 