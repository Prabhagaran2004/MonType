import hre from "hardhat";
import { formatEther, parseEther } from "ethers";

/**
 * Script to fund the MonadTypeRewards contract with tokens
 * Run: npx hardhat run scripts/fund-rewards.ts --network monad_testnet
 */

const TOKEN_ADDRESS = "0x7578654611e0E505A976A06DAF3de44a746F4D77";
const REWARDS_ADDRESS = "0x98A538511fF0ad568D5E32aa604C5Ef1f3046741";

// Amount to transfer (100,000 tokens)
const AMOUNT_TO_TRANSFER = parseEther("100000");

async function main() {
  console.log("Funding MonadTypeRewards contract with tokens...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);
  console.log(
    "Account balance:",
    formatEther(await hre.ethers.provider.getBalance(deployer.address)),
    "MON\n"
  );

  // Get the token contract
  const MonadTypeToken = await hre.ethers.getContractAt(
    "MonadTypeToken",
    TOKEN_ADDRESS
  );

  // Check current balance
  const deployerBalance = await MonadTypeToken.balanceOf(deployer.address);
  console.log("Your MNTYPE balance:", formatEther(deployerBalance), "MNTYPE");

  const rewardsBalance = await MonadTypeToken.balanceOf(REWARDS_ADDRESS);
  console.log(
    "Rewards contract balance:",
    formatEther(rewardsBalance),
    "MNTYPE\n"
  );

  if (deployerBalance < AMOUNT_TO_TRANSFER) {
    console.error("❌ Insufficient balance to transfer!");
    console.log(`Need: ${formatEther(AMOUNT_TO_TRANSFER)} MNTYPE`);
    console.log(`Have: ${formatEther(deployerBalance)} MNTYPE`);
    process.exit(1);
  }

  console.log(
    `Transferring ${formatEther(
      AMOUNT_TO_TRANSFER
    )} MNTYPE to Rewards contract...`
  );

  const tx = await MonadTypeToken.transfer(REWARDS_ADDRESS, AMOUNT_TO_TRANSFER);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();
  console.log("✅ Transfer confirmed!");

  // Check new balances
  const newDeployerBalance = await MonadTypeToken.balanceOf(deployer.address);
  const newRewardsBalance = await MonadTypeToken.balanceOf(REWARDS_ADDRESS);

  console.log("\n📊 New Balances:");
  console.log("Your balance:", formatEther(newDeployerBalance), "MNTYPE");
  console.log(
    "Rewards contract balance:",
    formatEther(newRewardsBalance),
    "MNTYPE"
  );

  console.log(
    "\n🎉 Rewards contract is now funded and ready to distribute tokens!"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
