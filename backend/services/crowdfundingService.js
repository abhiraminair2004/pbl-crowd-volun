const ethers = require('ethers');
const Crowdfunding = require('../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json');

class CrowdfundingService {
    constructor() {
        console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY, 'LENGTH:', process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 'undefined');
        if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY.length !== 64) {
            throw new Error('Invalid PRIVATE_KEY in .env. It must be a 64-character hex string with no 0x prefix.');
        }
        this.provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        this.contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            Crowdfunding.abi,
            this.wallet
        );
    }

    async createCampaign(title, description, goal, duration) {
        try {
            const tx = await this.contract.createCampaign(
                title,
                description,
                ethers.parseEther(goal.toString()),
                duration
            );
            await tx.wait();
            return tx.hash;
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
            return {
                creator: details[0],
                title: details[1],
                description: details[2],
                goal: ethers.formatEther(details[3]),
                deadline: new Date(Number(details[4]) * 1000),
                raised: ethers.formatEther(details[5]),
                completed: details[6]
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