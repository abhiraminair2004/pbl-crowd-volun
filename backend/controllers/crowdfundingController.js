const Crowdfunding = require('../models/Crowdfunding');
const User = require('../models/User');

// Create a new crowdfunding campaign
exports.createCampaign = async (req, res) => {
    try {
        console.log('Creating crowdfunding campaign:', {
            userId: req.user._id,
            data: req.body
        });

        // Check if user exists
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log('User not found:', req.user._id);
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate required fields
        const { title, description, targetAmount, endDate, category } = req.body;
        if (!title || !description || !targetAmount || !endDate || !category) {
            console.log('Missing required fields:', req.body);
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields: {
                    title: !title,
                    description: !description,
                    targetAmount: !targetAmount,
                    endDate: !endDate,
                    category: !category
                }
            });
        }

        // Validate target amount
        if (targetAmount <= 0) {
            console.log('Invalid target amount:', targetAmount);
            return res.status(400).json({ error: 'Target amount must be greater than 0' });
        }

        // Validate end date
        const endDateObj = new Date(endDate);
        if (endDateObj <= new Date()) {
            console.log('Invalid end date:', endDate);
            return res.status(400).json({ error: 'End date must be in the future' });
        }

        // Create campaign
        const campaign = new Crowdfunding({
            user: req.user._id,
            title,
            description,
            targetAmount,
            currentAmount: 0,
            endDate,
            category,
            status: 'active',
            donations: []
        });

        console.log('Saving campaign:', campaign);
        await campaign.save();
        
        console.log('Campaign created successfully:', campaign._id);
        res.status(201).json(campaign);
    } catch (error) {
        console.error('Error creating campaign:', {
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

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
    try {
        console.log('Fetching all campaigns');
        const campaigns = await Crowdfunding.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        console.log(`Found ${campaigns.length} campaigns`);
        res.json(campaigns);
    } catch (error) {
        console.error('Error getting campaigns:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a single campaign by ID
exports.getCampaignById = async (req, res) => {
    try {
        console.log('Fetching campaign:', req.params.id);
        const campaign = await Crowdfunding.findById(req.params.id)
            .populate('user', 'name email')
            .populate('donations.user', 'name email');
        if (!campaign) {
            console.log('Campaign not found:', req.params.id);
            return res.status(404).json({ error: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        console.error('Error getting campaign:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a campaign
exports.updateCampaign = async (req, res) => {
    try {
        console.log('Updating campaign:', {
            campaignId: req.params.id,
            updates: req.body
        });

        const campaign = await Crowdfunding.findOne({
            _id: req.params.id,
            user: req.user._id
        });
        
        if (!campaign) {
            console.log('Campaign not found or unauthorized:', req.params.id);
            return res.status(404).json({ error: 'Campaign not found or unauthorized' });
        }

        // Only allow updating specific fields
        const allowedUpdates = ['title', 'description', 'targetAmount', 'endDate', 'category', 'status'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            console.log('Invalid update fields:', updates);
            return res.status(400).json({ error: 'Invalid updates' });
        }

        updates.forEach(update => {
            campaign[update] = req.body[update];
        });

        await campaign.save();
        console.log('Campaign updated successfully:', campaign._id);
        res.json(campaign);
    } catch (error) {
        console.error('Error updating campaign:', {
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

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
    try {
        console.log('Deleting campaign:', req.params.id);
        const campaign = await Crowdfunding.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        
        if (!campaign) {
            console.log('Campaign not found or unauthorized:', req.params.id);
            return res.status(404).json({ error: 'Campaign not found or unauthorized' });
        }

        console.log('Campaign deleted successfully:', campaign._id);
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error('Error deleting campaign:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Server error' });
    }
};

// Donate to a campaign
exports.donate = async (req, res) => {
    try {
        console.log('Processing donation:', {
            campaignId: req.params.id,
            userId: req.user._id,
            amount: req.body.amount
        });

        const { amount } = req.body;
        if (!amount || amount <= 0) {
            console.log('Invalid donation amount:', amount);
            return res.status(400).json({ error: 'Invalid donation amount' });
        }

        const campaign = await Crowdfunding.findById(req.params.id);
        if (!campaign) {
            console.log('Campaign not found:', req.params.id);
            return res.status(404).json({ error: 'Campaign not found' });
        }

        if (campaign.status !== 'active') {
            console.log('Campaign is not active:', campaign.status);
            return res.status(400).json({ error: 'Campaign is not active' });
        }

        // Add donation
        campaign.donations.push({
            user: req.user._id,
            amount,
            date: new Date()
        });

        // Update current amount
        campaign.currentAmount += amount;

        // Check if target reached
        if (campaign.currentAmount >= campaign.targetAmount) {
            campaign.status = 'completed';
        }

        await campaign.save();
        console.log('Donation processed successfully:', campaign._id);
        res.json(campaign);
    } catch (error) {
        console.error('Error processing donation:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Server error' });
    }
}; 