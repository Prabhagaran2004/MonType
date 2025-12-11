import { ethers } from "ethers";
import {
  CONTRACT_ADDRESSES,
  TOKEN_ABI,
  REWARDS_ABI,
} from "../config/contracts";

/**
 * Get token balance for an address
 */
export async function getTokenBalance(
  address: string,
  provider: ethers.BrowserProvider
): Promise<string> {
  try {
    const tokenContract = new ethers.Contract(
      CONTRACT_ADDRESSES.TOKEN,
      TOKEN_ABI,
      provider
    );

    const balance = await tokenContract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting token balance:", error);
    return "0";
  }
}

/**
 * Check if a player has claimed a specific level
 */
export async function hasClaimedLevel(
  playerAddress: string,
  level: number,
  provider: ethers.BrowserProvider
): Promise<boolean> {
  try {
    const rewardsContract = new ethers.Contract(
      CONTRACT_ADDRESSES.REWARDS,
      REWARDS_ABI,
      provider
    );

    return await rewardsContract.hasClaimedLevel(playerAddress, level);
  } catch (error) {
    console.error("Error checking claimed level:", error);
    return false;
  }
}

/**
 * Get the reward amount for a specific level
 */
export async function getLevelReward(
  level: number,
  provider: ethers.BrowserProvider
): Promise<string> {
  try {
    const rewardsContract = new ethers.Contract(
      CONTRACT_ADDRESSES.REWARDS,
      REWARDS_ABI,
      provider
    );

    const reward = await rewardsContract.getLevelReward(level);
    return ethers.formatEther(reward);
  } catch (error) {
    console.error("Error getting level reward:", error);
    return "0";
  }
}

/**
 * Get player's highest level reached
 */
export async function getHighestLevel(
  playerAddress: string,
  provider: ethers.BrowserProvider
): Promise<number> {
  try {
    const rewardsContract = new ethers.Contract(
      CONTRACT_ADDRESSES.REWARDS,
      REWARDS_ABI,
      provider
    );

    const level = await rewardsContract.getHighestLevel(playerAddress);
    return Number(level);
  } catch (error) {
    console.error("Error getting highest level:", error);
    return 0;
  }
}

/**
 * Get player stats (for leaderboard/stats page)
 */
export async function getPlayerStats(
  playerAddress: string,
  provider: ethers.BrowserProvider
) {
  try {
    const tokenBalance = await getTokenBalance(playerAddress, provider);
    const highestLevel = await getHighestLevel(playerAddress, provider);

    return {
      tokenBalance,
      highestLevel,
    };
  } catch (error) {
    console.error("Error getting player stats:", error);
    return {
      tokenBalance: "0",
      highestLevel: 0,
    };
  }
}

/**
 * Claim reward for completing a level
 */
export async function claimLevelReward(
  playerAddress: string,
  level: number,
  signer: ethers.Signer
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Encode the contract call data
    const rewardsContract = new ethers.Contract(
      CONTRACT_ADDRESSES.REWARDS,
      REWARDS_ABI
    );

    // Encode the rewardPlayer function call
    const data = rewardsContract.interface.encodeFunctionData("rewardPlayer", [
      playerAddress,
      level,
    ]);

    // Get the signer's address
    const signerAddress = await signer.getAddress();

    // Estimate gas (optional, can fail on RPC issues)
    let gasLimit: string | bigint = "500000"; // Default gas limit
    try {
      // Try to estimate, but don't fail if it doesn't work
      const provider = signer.provider;
      if (provider) {
        const estimate = await provider.estimateGas({
          to: CONTRACT_ADDRESSES.REWARDS,
          data: data,
          from: signerAddress,
        });
        gasLimit = (estimate * 120n) / 100n; // Add 20% buffer
      }
    } catch (e) {
      // Use default gas limit if estimation fails
      console.log("Gas estimation failed, using default");
    }

    // Send the transaction using the signer
    try {
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESSES.REWARDS,
        data: data,
        gasLimit: gasLimit,
      });

      // Transaction was sent, return immediately with hash
      return {
        success: true,
        txHash: tx.hash,
      };
    } catch (sendError: any) {
      // Check if user rejected
      if (sendError.code === "ACTION_REJECTED") {
        return {
          success: false,
          error: "Transaction rejected by user",
        };
      }

      // For other send errors, still try via MetaMask
      throw sendError;
    }
  } catch (error: any) {
    console.error("Error claiming level reward:", error);

    // Try direct MetaMask call as fallback
    try {
      const rewardsContract = new ethers.Contract(
        CONTRACT_ADDRESSES.REWARDS,
        REWARDS_ABI
      );

      const data = rewardsContract.interface.encodeFunctionData(
        "rewardPlayer",
        [playerAddress, level]
      );

      const txHash = await (window as any).ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: await signer.getAddress(),
            to: CONTRACT_ADDRESSES.REWARDS,
            data: data,
            gas: "0x7a120", // 500000 in hex
          },
        ],
      });

      return {
        success: true,
        txHash: txHash,
      };
    } catch (fallbackError: any) {
      console.error("Fallback error:", fallbackError);

      // Parse error messages
      let errorMsg = "Failed to claim reward";
      if (fallbackError.code === 4001) {
        errorMsg = "Transaction rejected by user";
      } else if (error.message?.includes("insufficient funds")) {
        errorMsg = "Insufficient funds for gas";
      } else if (error.message?.includes("already claimed")) {
        errorMsg = "Already claimed reward for this level";
      } else if (error.message) {
        errorMsg = error.message;
      }

      return {
        success: false,
        error: errorMsg,
      };
    }
  }
}
