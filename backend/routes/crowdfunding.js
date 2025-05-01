const express = require('express');
const router = express.Router();
const crowdfundingService = require('../services/crowdfundingService');

// Create a new campaign
router.post('/campaigns', async (req, res) => {
    try {
        const { title, description, goal, duration } = req.body;
        const txHash = await crowdfundingService.createCampaign(
            title,
            description,
            goal,
            duration
        );
        res.json({ success: true, txHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all campaigns from the smart contract
router.get('/campaigns', async (req, res) => {
    try {
        console.log('Fetching campaign count...');
        const count = await crowdfundingService.contract.campaignCount();
        console.log('Campaign count:', count.toString());

        if (count.toString() === '0') {
            return res.json([]);
        }

        const campaigns = [];
        for (let i = 1; i <= Number(count); i++) {
            try {
                console.log(`Fetching details for campaign ${i}...`);
                const details = await crowdfundingService.getCampaignDetails(i);
                campaigns.push({ id: i, ...details });
            } catch (err) {
                console.error(`Error fetching campaign ${i}:`, err);
                // Continue with other campaigns even if one fails
            }
        }
        res.json(campaigns);
    } catch (error) {
        console.error('Error in /campaigns route:', error);
        res.status(500).json({
            error: error.message,
            details: error.stack
        });
    }
});

// Contribute to a campaign
router.post('/campaigns/:id/contribute', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const txHash = await crowdfundingService.contribute(id, amount);
        res.json({ success: true, txHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Withdraw funds from a completed campaign
router.post('/campaigns/:id/withdraw', async (req, res) => {
    try {
        const { id } = req.params;
        const txHash = await crowdfundingService.withdrawFunds(id);
        res.json({ success: true, txHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get campaign details
router.get('/campaigns/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const details = await crowdfundingService.getCampaignDetails(id);
        res.json({ success: true, details });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user's contribution to a campaign
router.get('/campaigns/:id/contribution/:address', async (req, res) => {
    try {
        const { id, address } = req.params;
        const contribution = await crowdfundingService.getContribution(id, address);
        res.json({ success: true, contribution });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a campaign (on-chain)
router.delete('/campaigns/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tx = await crowdfundingService.contract.deleteCampaign(id);
        await tx.wait();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
