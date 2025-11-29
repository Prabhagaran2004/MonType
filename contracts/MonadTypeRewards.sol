// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MonadTypeRewards
 * @dev Contract for managing game rewards and leaderboard
 */
contract MonadTypeRewards is Ownable, ReentrancyGuard {
    
    IERC20 public immutable rewardToken;
    
    // Level => reward amount mapping
    mapping(uint256 => uint256) public levelRewards;
    
    // Player => level => claimed mapping
    mapping(address => mapping(uint256 => bool)) public levelClaimed;
    
    // Player => highest level reached
    mapping(address => uint256) public highestLevelReached;
    
    // Events
    event RewardPaid(address indexed player, uint256 indexed level, uint256 amount);
    event LevelRewardSet(uint256 indexed level, uint256 amount);
    event LevelUpdated(address indexed player, uint256 indexed level);
    
    constructor(address _rewardToken, address initialOwner) 
        Ownable(initialOwner) 
    {
        rewardToken = IERC20(_rewardToken);
    }
    
    /**
     * @dev Set reward amount for a specific level
     * @param level The level number
     * @param amount The reward amount in tokens
     */
    function setLevelReward(uint256 level, uint256 amount) external onlyOwner {
        levelRewards[level] = amount;
        emit LevelRewardSet(level, amount);
    }
    
    /**
     * @dev Reward a player for completing a level
     * @param player The player address
     * @param level The completed level
     */
    function rewardPlayer(address player, uint256 level) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(!levelClaimed[player][level], "Level already claimed");
        require(levelRewards[level] > 0, "No reward set for this level");
        
        // Mark as claimed
        levelClaimed[player][level] = true;
        
        // Update highest level if this is higher
        if (level > highestLevelReached[player]) {
            highestLevelReached[player] = level;
            emit LevelUpdated(player, level);
        }
        
        // Transfer reward
        uint256 rewardAmount = levelRewards[level];
        require(rewardToken.transfer(player, rewardAmount), "Token transfer failed");
        
        emit RewardPaid(player, level, rewardAmount);
    }
    
    /**
     * @dev Check if player has claimed a specific level
     * @param player The player address
     * @param level The level to check
     * @return bool True if claimed, false otherwise
     */
    function hasClaimedLevel(address player, uint256 level) external view returns (bool) {
        return levelClaimed[player][level];
    }
    
    /**
     * @dev Get reward amount for a specific level
     * @param level The level number
     * @return uint256 The reward amount
     */
    function getLevelReward(uint256 level) external view returns (uint256) {
        return levelRewards[level];
    }
    
    /**
     * @dev Get player's highest level reached
     * @param player The player address
     * @return uint256 Highest level reached
     */
    function getHighestLevel(address player) external view returns (uint256) {
        return highestLevelReached[player];
    }
    
    /**
     * @dev Get all claimed levels for a player
     * @param player The player address
     * @param maxLevel Maximum level to check (for gas efficiency)
     * @return claimedLevels Array of claimed level numbers
     */
    function getClaimedLevels(address player, uint256 maxLevel) 
        external 
        view 
        returns (uint256[] memory claimedLevels) 
    {
        uint256 count = 0;
        
        // First count claimed levels
        for (uint256 i = 1; i <= maxLevel; i++) {
            if (levelClaimed[player][i]) {
                count++;
            }
        }
        
        // Then fill array
        claimedLevels = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= maxLevel; i++) {
            if (levelClaimed[player][i]) {
                claimedLevels[index] = i;
                index++;
            }
        }
    }
}
