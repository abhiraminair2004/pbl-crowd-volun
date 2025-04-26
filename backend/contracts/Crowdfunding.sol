// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 raised;
        bool completed;
        mapping(address => uint256) contributions;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;

    event CampaignCreated(
        uint256 id,
        address creator,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event ContributionMade(
        uint256 campaignId,
        address contributor,
        uint256 amount
    );

    event CampaignCompleted(uint256 campaignId, uint256 raised);

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _duration
    ) public {
        require(_goal > 0, "Goal must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");

        uint256 deadline = block.timestamp + _duration;
        campaignCount++;

        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.creator = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.goal = _goal;
        newCampaign.deadline = deadline;
        newCampaign.raised = 0;
        newCampaign.completed = false;

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _title,
            _goal,
            deadline
        );
    }

    function contribute(uint256 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.completed, "Campaign is already completed");
        require(block.timestamp < campaign.deadline, "Campaign deadline has passed");
        require(msg.value > 0, "Contribution must be greater than 0");

        campaign.contributions[msg.sender] += msg.value;
        campaign.raised += msg.value;

        emit ContributionMade(_campaignId, msg.sender, msg.value);

        if (campaign.raised >= campaign.goal) {
            campaign.completed = true;
            emit CampaignCompleted(_campaignId, campaign.raised);
        }
    }

    function withdrawFunds(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.creator == msg.sender, "Only creator can withdraw");
        require(campaign.completed, "Campaign is not completed yet");
        require(campaign.raised > 0, "No funds to withdraw");

        uint256 amount = campaign.raised;
        campaign.raised = 0;
        payable(msg.sender).transfer(amount);
    }

    function getCampaignDetails(uint256 _campaignId)
        public
        view
        returns (
            address creator,
            string memory title,
            string memory description,
            uint256 goal,
            uint256 deadline,
            uint256 raised,
            bool completed
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.goal,
            campaign.deadline,
            campaign.raised,
            campaign.completed
        );
    }

    function getContribution(uint256 _campaignId, address _contributor)
        public
        view
        returns (uint256)
    {
        return campaigns[_campaignId].contributions[_contributor];
    }

    function deleteCampaign(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator can delete");
        require(!campaign.completed, "Cannot delete completed campaign");
        delete campaigns[_campaignId];
    }
}