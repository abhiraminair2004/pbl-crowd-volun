const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
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
    skills: [{
        type: String,
        trim: true
    }],
    availability: {
        type: String,
        enum: ['weekdays', 'weekends', 'both'],
        required: true
    },
    interests: [{
        type: String,
        trim: true
    }],
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