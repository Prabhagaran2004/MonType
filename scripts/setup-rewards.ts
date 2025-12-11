import hre from "hardhat";
import { formatEther, parseEther } from "ethers";

/**
 * Script to set up level rewards for MonadType game
 * Run: npx hardhat run scripts/setup-rewards.ts --network monad_testnet
 */

const REWARDS_ADDRESS = "0x98A538511fF0ad568D5E32aa604C5Ef1f3046741";

const LEVEL_REWARDS = [
  { level: 1, amount: parseEther("10") }, // 10 MNTYPE
  { level: 2, amount: parseEther("20") }, // 20 MNTYPE
  { level: 3, amount: parseEther("30") }, // 30 MNTYPE
  { level: 4, amount: parseEther("50") }, // 50 MNTYPE
  { level: 5, amount: parseEther("100") }, // 100 MNTYPE
  { level: 6, amount: parseEther("150") }, // 150 MNTYPE
  { level: 7, amount: parseEther("200") }, // 200 MNTYPE
  { level: 8, amount: parseEther("300") }, // 300 MNTYPE
  { level: 9, amount: parseEther("400") }, // 400 MNTYPE
  { level: 10, amount: parseEther("500") }, // 500 MNTYPE
];

async function main() {
  console.log("Setting up level rewards for MonadType game...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);
  console.log(
    "Account balance:",
    formatEther(await hre.ethers.provider.getBalance(deployer.address)),
    "MON\n"
  );

  // Get the contract
  const MonadTypeRewards = await hre.ethers.getContractAt(
    "MonadTypeRewards",
    REWARDS_ADDRESS
  );

  console.log("Setting rewards for levels 1-10...\n");

  for (const { level, amount } of LEVEL_REWARDS) {
    try {
      const currentReward = await MonadTypeRewards.getLevelReward(level);

      if (currentReward > 0n) {
        console.log(
          `Level ${level}: Already set (${formatEther(
            currentReward
          )} MNTYPE) - Skipping`
        );
        continue;
      }

      console.log(`Setting Level ${level}: ${formatEther(amount)} MNTYPE`);
      const tx = await MonadTypeRewards.setLevelReward(level, amount);
      await tx.wait();
      console.log(`✅ Level ${level} reward set! Tx: ${tx.hash}\n`);
    } catch (error: any) {
      console.error(`❌ Error setting Level ${level}:`, error.message, "\n");
    }
  }

  console.log("\n🎉 All level rewards configured!");
  console.log("\nReward Summary:");
  for (const { level } of LEVEL_REWARDS) {
    const reward = await MonadTypeRewards.getLevelReward(level);
    console.log(`Level ${level}: ${formatEther(reward)} MNTYPE`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
