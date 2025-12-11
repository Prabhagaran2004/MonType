// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
  TOKEN: "0x7578654611e0E505A976A06DAF3de44a746F4D77",
  REWARDS: "0x98A538511fF0ad568D5E32aa604C5Ef1f3046741",
} as const;

// MonadTypeToken ABI (only functions we need)
export const TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function mint(address to, uint256 amount)",
] as const;

// MonadTypeRewards ABI (only functions we need)
export const REWARDS_ABI = [
  "function levelRewards(uint256 level) view returns (uint256)",
  "function levelClaimed(address player, uint256 level) view returns (bool)",
  "function highestLevelReached(address player) view returns (uint256)",
  "function rewardPlayer(address player, uint256 level)",
  "function setLevelReward(uint256 level, uint256 amount)",
  "function hasClaimedLevel(address player, uint256 level) view returns (bool)",
  "function getLevelReward(uint256 level) view returns (uint256)",
  "function getHighestLevel(address player) view returns (uint256)",
  "event RewardPaid(address indexed player, uint256 indexed level, uint256 amount)",
  "event LevelRewardSet(uint256 indexed level, uint256 amount)",
  "event LevelUpdated(address indexed player, uint256 indexed level)",
] as const;

// Network configuration
export const MONAD_TESTNET_CHAIN_ID = 41454;
