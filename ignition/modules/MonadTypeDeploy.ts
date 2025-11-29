import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MonadTypeDeploy = buildModule("MonadTypeDeploy", (m) => {
  // Deploy the ERC20 token contract
  const token = m.contract("MonadTypeToken", [m.getAccount(0)]);

  // Deploy the rewards contract with token address
  const rewards = m.contract("MonadTypeRewards", [token, m.getAccount(0)]);

  // Set up initial level rewards
  // Level 1: 10 tokens
  m.call(rewards, "setLevelReward", [1, 10000000000000000000n]);

  // Level 2: 20 tokens
  m.call(rewards, "setLevelReward", [2, 20000000000000000000n]);

  // Level 3: 30 tokens
  m.call(rewards, "setLevelReward", [3, 30000000000000000000n]);

  // Level 4: 50 tokens
  m.call(rewards, "setLevelReward", [4, 50000000000000000000n]);

  // Level 5: 100 tokens
  m.call(rewards, "setLevelReward", [5, 100000000000000000000n]);

  // Transfer tokens to rewards contract for payouts
  // Transfer 1000 tokens initially
  m.call(token, "transfer", [rewards, 1000000000000000000000n]);

  return { token, rewards };
});

export default MonadTypeDeploy;
