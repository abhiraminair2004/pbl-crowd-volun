const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// Get all campaigns
exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate('creator', 'name email');
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single campaign
exports.getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id)
            .populate('creator', 'name email')
            .populate({
                path: 'donations',
                populate: {
                    path: 'donor',
                    select: 'name'
                }
            });
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create campaign
exports.createCampaign = async (req, res) => {
    try {
        const campaign = new Campaign({
            ...req.body,
            creator: req.user._id
        });
        const savedCampaign = await campaign.save();
        res.status(201).json(savedCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update campaign
exports.updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json(campaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete campaign
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Make donation
exports.makeDonation = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const donation = new Donation({
            amount: req.body.amount,
            donor: req.user._id,
            campaign: campaign._id,
            message: req.body.message,
            isAnonymous: req.body.isAnonymous
        });

        const savedDonation = await donation.save();
        
        // Update campaign's current amount
        campaign.currentAmount += req.body.amount;
        await campaign.save();

        res.status(201).json(savedDonation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 