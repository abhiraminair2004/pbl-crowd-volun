const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

// Get all volunteer opportunities
exports.getVolunteerOpportunities = async (req, res) => {
    try {
        const opportunities = await Volunteer.find()
            .populate('organizer', 'name email')
            .populate('currentVolunteers', 'name email');
        res.status(200).json(opportunities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single volunteer opportunity
exports.getVolunteerOpportunity = async (req, res) => {
    try {
        const opportunity = await Volunteer.findById(req.params.id)
            .populate('organizer', 'name email')
            .populate('currentVolunteers', 'name email');
        if (!opportunity) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }
        res.status(200).json(opportunity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create volunteer opportunity
exports.createVolunteerOpportunity = async (req, res) => {
    try {
        const opportunity = new Volunteer({
            ...req.body,
            organizer: req.user._id
        });
        const savedOpportunity = await opportunity.save();
        res.status(201).json(savedOpportunity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update volunteer opportunity
exports.updateVolunteerOpportunity = async (req, res) => {
    try {
        const opportunity = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!opportunity) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }
        res.status(200).json(opportunity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete volunteer opportunity
exports.deleteVolunteerOpportunity = async (req, res) => {
    try {
        const opportunity = await Volunteer.findByIdAndDelete(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }
        res.status(200).json({ message: 'Volunteer opportunity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Join volunteer opportunity
exports.joinVolunteerOpportunity = async (req, res) => {
    try {
        const opportunity = await Volunteer.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }

        if (opportunity.currentVolunteers.includes(req.user._id)) {
            return res.status(400).json({ message: 'You have already joined this opportunity' });
        }

        if (opportunity.currentVolunteers.length >= opportunity.maxVolunteers) {
            return res.status(400).json({ message: 'This opportunity is full' });
        }

        opportunity.currentVolunteers.push(req.user._id);
        await opportunity.save();

        res.status(200).json({ message: 'Successfully joined the volunteer opportunity' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Leave volunteer opportunity
exports.leaveVolunteerOpportunity = async (req, res) => {
    try {
        const opportunity = await Volunteer.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ message: 'Volunteer opportunity not found' });
        }

        if (!opportunity.currentVolunteers.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are not part of this opportunity' });
        }

        opportunity.currentVolunteers = opportunity.currentVolunteers.filter(
            volunteer => volunteer.toString() !== req.user._id.toString()
        );
        await opportunity.save();

        res.status(200).json({ message: 'Successfully left the volunteer opportunity' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create a new volunteer
exports.createVolunteer = async (req, res) => {
    try {
        console.log('Creating volunteer profile:', {
            userId: req.user._id,
            data: req.body
        });

        // Check if user exists
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log('User not found:', req.user._id);
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if volunteer profile already exists
        const existingVolunteer = await Volunteer.findOne({ user: req.user._id });
        if (existingVolunteer) {
            console.log('Volunteer profile already exists for user:', req.user._id);
            return res.status(400).json({ error: 'Volunteer profile already exists' });
        }

        // Validate required fields
        const { name, phone, skills, availability, interests, experience } = req.body;
        if (!name || !phone || !availability) {
            console.log('Missing required fields:', req.body);
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields: {
                    name: !name,
                    phone: !phone,
                    availability: !availability
                }
            });
        }

        // Create volunteer profile
        const volunteer = new Volunteer({
            user: req.user._id,
            name,
            email: user.email,
            phone,
            skills: skills || [],
            availability,
            interests: interests || [],
            experience: experience || '',
            status: 'pending'
        });

        console.log('Saving volunteer profile:', volunteer);
        await volunteer.save();
        
        // Update user role to volunteer
        user.role = 'volunteer';
        await user.save();

        console.log('Volunteer profile created successfully:', volunteer._id);
        res.status(201).json(volunteer);
    } catch (error) {
        console.error('Error creating volunteer:', {
            message: error.message,
            stack: error.stack
        });
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }
        
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all volunteers
exports.getAllVolunteers = async (req, res) => {
    try {
        console.log('Fetching all volunteers');
        const volunteers = await Volunteer.find()
            .populate('user', 'name email role');
        console.log(`Found ${volunteers.length} volunteers`);
        res.json(volunteers);
    } catch (error) {
        console.error('Error getting volunteers:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a single volunteer by ID
exports.getVolunteerById = async (req, res) => {
    try {
        console.log('Fetching volunteer:', req.params.id);
        const volunteer = await Volunteer.findById(req.params.id)
            .populate('user', 'name email role');
        if (!volunteer) {
            console.log('Volunteer not found:', req.params.id);
            return res.status(404).json({ error: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (error) {
        console.error('Error getting volunteer:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a volunteer
exports.updateVolunteer = async (req, res) => {
    try {
        console.log('Updating volunteer:', {
            userId: req.user._id,
            updates: req.body
        });

        const volunteer = await Volunteer.findOne({ user: req.user._id });
        if (!volunteer) {
            console.log('Volunteer not found for user:', req.user._id);
            return res.status(404).json({ error: 'Volunteer not found' });
        }

        // Only allow updating specific fields
        const allowedUpdates = ['name', 'phone', 'skills', 'availability', 'interests', 'experience', 'status'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            console.log('Invalid update fields:', updates);
            return res.status(400).json({ error: 'Invalid updates' });
        }

        updates.forEach(update => {
            volunteer[update] = req.body[update];
        });

        await volunteer.save();
        console.log('Volunteer updated successfully:', volunteer._id);
        res.json(volunteer);
    } catch (error) {
        console.error('Error updating volunteer:', {
            message: error.message,
            stack: error.stack
        });
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }
        
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a volunteer
exports.deleteVolunteer = async (req, res) => {
    try {
        console.log('Deleting volunteer:', req.params.id);
        const volunteer = await Volunteer.findOneAndDelete({ user: req.user._id });
        if (!volunteer) {
            console.log('Volunteer not found for user:', req.user._id);
            return res.status(404).json({ error: 'Volunteer not found' });
        }

        // Update user role back to user
        const user = await User.findById(req.user._id);
        if (user) {
            user.role = 'user';
            await user.save();
        }

        console.log('Volunteer deleted successfully:', volunteer._id);
        res.json({ message: 'Volunteer profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting volunteer:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Server error' });
    }
};

// Get current user's volunteer profile
exports.getMyVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({ user: req.user._id })
            .populate('user', 'name email role');
        if (!volunteer) {
            return res.status(404).json({ error: 'Volunteer profile not found' });
        }
        res.json(volunteer);
    } catch (error) {
        console.error('Error getting volunteer profile:', error);
        res.status(500).json({ error: error.message });
    }
}; 