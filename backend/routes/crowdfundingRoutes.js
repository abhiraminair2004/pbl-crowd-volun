const express = require('express');
const router = express.Router();
const crowdfundingController = require('../controllers/crowdfundingController');
const auth = require('../middleware/auth');
const Crowdfunding = require('../models/Crowdfunding');

// Public routes
router.get('/', crowdfundingController.getAllCampaigns);
router.get('/:id', crowdfundingController.getCampaignById);

// Protected routes
router.post('/', auth, crowdfundingController.createCampaign);
router.put('/:id', auth, crowdfundingController.updateCampaign);
router.delete('/:id', auth, crowdfundingController.deleteCampaign);
router.post('/:id/donate', auth, crowdfundingController.donate);

// Campaign updates
router.post('/:id/updates', auth, async (req, res) => {
    try {
        const campaign = await Crowdfunding.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        if (campaign.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to add updates' });
        }

        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        await campaign.addUpdate(title, content);
        res.json(campaign);
    } catch (error) {
        console.error('Error adding update:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Campaign images
router.post('/:id/images', auth, async (req, res) => {
    try {
        const campaign = await Crowdfunding.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        if (campaign.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to add images' });
        }

        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        await campaign.addImage(imageUrl);
        res.json(campaign);
    } catch (error) {
        console.error('Error adding image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 