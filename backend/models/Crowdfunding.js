const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1, 'Donation amount must be at least 1']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const crowdfundingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [20, 'Description must be at least 20 characters long'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Target amount is required'],
        min: [1, 'Target amount must be greater than 0']
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function(value) {
                return value > Date.now();
            },
            message: 'End date must be in the future'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['education', 'health', 'environment', 'social', 'other'],
            message: 'Invalid category'
        }
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    donations: [donationSchema],
    images: [{
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\..+/.test(v);
            },
            message: 'Invalid image URL'
        }
    }],
    updates: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.__v;
            return ret;
        }
    }
});

// Virtual for progress percentage
crowdfundingSchema.virtual('progress').get(function() {
    return (this.currentAmount / this.targetAmount) * 100;
});

// Virtual for days remaining
crowdfundingSchema.virtual('daysRemaining').get(function() {
    const now = new Date();
    const end = new Date(this.endDate);
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to check if campaign is active
crowdfundingSchema.methods.isActive = function() {
    return this.status === 'active' && new Date(this.endDate) > new Date();
};

// Method to check if campaign is completed
crowdfundingSchema.methods.isCompleted = function() {
    return this.status === 'completed' || this.currentAmount >= this.targetAmount;
};

// Method to add an update
crowdfundingSchema.methods.addUpdate = async function(title, content) {
    this.updates.push({ title, content });
    await this.save();
    return this;
};

// Method to add an image
crowdfundingSchema.methods.addImage = async function(imageUrl) {
    this.images.push(imageUrl);
    await this.save();
    return this;
};

// Pre-save middleware to validate campaign
crowdfundingSchema.pre('save', function(next) {
    // Check if campaign should be marked as completed
    if (this.currentAmount >= this.targetAmount) {
        this.status = 'completed';
    }
    
    // Check if campaign should be marked as cancelled
    if (new Date(this.endDate) < new Date() && this.status === 'active') {
        this.status = 'cancelled';
    }
    
    next();
});

const Crowdfunding = mongoose.model('Crowdfunding', crowdfundingSchema);

module.exports = Crowdfunding; 