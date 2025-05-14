// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EcoToken.sol"; 

contract EnvironmentalImpactTracker {
    EcoToken public ecoToken;

    struct Activity {
        string description;
        uint256 carbonFootprint;
        uint256 timestamp;
    }

    mapping(address => Activity[]) public activities;

    event ActivityLogged(address indexed user, string description, uint256 carbonFootprint, uint256 timestamp);
    event TokensEarned(address indexed user, uint256 amount);

    error ERC20InsufficientBalance(address account, uint256 balance, uint256 needed);

    constructor(EcoToken _ecoToken) {
        ecoToken = _ecoToken;
    }

    function logActivity(string memory description, uint256 carbonFootprint) public {
        
        activities[msg.sender].push(Activity(description, carbonFootprint, block.timestamp));
        emit ActivityLogged(msg.sender, description, carbonFootprint, block.timestamp);

        
        uint256 reward = calculateReward(carbonFootprint);

        // Check if the tracker has enough balance before transferring
        uint256 trackerBalance = ecoToken.balanceOf(address(this));
        if (trackerBalance < reward) {
            revert ERC20InsufficientBalance(address(this), trackerBalance, reward);
        }

        // Transfer tokens to the user
        bool success = ecoToken.transfer(msg.sender, reward);
        require(success, "Token transfer failed");
        emit TokensEarned(msg.sender, reward);
    }

    function calculateReward(uint256 carbonFootprint) internal pure returns (uint256) {
        // 1 EcoToken per unit of carbon footprint --> easy rule
        return carbonFootprint;
    }

    function getActivities(address user) public view returns (Activity[] memory) {
        return activities[user];
    }

    function getEcoTokenBalance() public view returns (uint256) {
        return ecoToken.balanceOf(msg.sender);
    }
}