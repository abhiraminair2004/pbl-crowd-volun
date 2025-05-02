const ethers = require('ethers');
const Crowdfunding = require('../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json');
const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');

let instance = null;

class CrowdfundingService {
    constructor() {
        if (instance) {
            return instance;
        }

        try {
            console.log('Initializing CrowdfundingService...');
            console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY ? '***' : 'undefined');
            console.log('RPC_URL:', process.env.RPC_URL);
            console.log('CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS);

            if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY.length !== 64) {
                throw new Error('Invalid PRIVATE_KEY in .env. It must be a 64-character hex string with no 0x prefix.');
            }
            if (!process.env.RPC_URL) {
                throw new Error('ETHEREUM_RPC_URL is not set in .env');
            }
            if (!process.env.CONTRACT_ADDRESS) {
                throw new Error('CONTRACT_ADDRESS is not set in .env');
            }

            this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
            this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

            console.log('Creating contract instance...');
            this.contract = new ethers.Contract(
                process.env.CONTRACT_ADDRESS,
                Crowdfunding.abi,
                this.wallet
            );

            // Test the contract connection
            this.contract.campaignCount().then(count => {
                console.log('Contract connection successful. Current campaign count:', count.toString());
            }).catch(err => {
                console.error('Error testing contract connection:', err);
            });
            instance = this;
        } catch (error) {
            console.error('Error initializing CrowdfundingService:', error);
            throw error;
        }
    }

    async createCampaign(title, description, goal, duration, imageUrl) {
        try {
            // Create campaign on blockchain
            const tx = await this.contract.createCampaign(
                title,
                description,
                ethers.parseEther(goal.toString()),
                duration
            );
            const receipt = await tx.wait();

            // Create corresponding entry in MongoDB
            const campaign = new Campaign({
                title,
                organization: this.wallet.address,
                description,
                goal: parseFloat(goal),
                deadline: new Date(Date.now() + duration * 1000),
                category: 'General',
                raised: 0,
                image: imageUrl // Add the image URL here
            });
            await campaign.save();

            return {
                transactionHash: tx.hash,
                campaignId: campaign._id
            };
        } catch (error) {
            console.error('Error creating campaign:', error);
            throw error;
        }
    }

    async contribute(campaignId, amount) {
        try {
            const tx = await this.contract.contribute(campaignId, {
                value: ethers.parseEther(amount.toString())
            });
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error contributing to campaign:', error);
            throw error;
        }
    }

    async withdrawFunds(campaignId) {
        try {
            const tx = await this.contract.withdrawFunds(campaignId);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error withdrawing funds:', error);
            throw error;
        }
    }

    async getCampaignDetails(campaignId) {
        try {
            const details = await this.contract.getCampaignDetails(campaignId);
            const dbCampaign = await Campaign.findOne({
                title: details[1],
                description: details[2]
            });

            return {
                creator: details[0],
                title: details[1],
                description: details[2],
                goal: ethers.formatEther(details[3]),
                deadline: new Date(Number(details[4]) * 1000),
                raised: ethers.formatEther(details[5]),
                completed: details[6],
                image: dbCampaign?.image, // Include the image URL in response
                category: dbCampaign?.category
            };
        } catch (error) {
            console.error('Error getting campaign details:', error);
            throw error;
        }
    }

    async getContribution(campaignId, contributor) {
        try {
            const contribution = await this.contract.getContribution(campaignId, contributor);
            return ethers.formatEther(contribution);
        } catch (error) {
            console.error('Error getting contribution:', error);
            throw error;
        }
    }
}

module.exports = new CrowdfundingService();