import { VercelRequest, VercelResponse } from "@vercel/node";
import cors from "cors";
import { ethers } from "ethers";

// CORS middleware
const corsMiddleware = cors({
  origin: ["https://your-project-name.vercel.app", "http://localhost:3000"],
  methods: ["GET", "OPTIONS"],
  credentials: true,
});

// Contract ABI
const REWARDS_ABI = [
  "function rewardPlayer(address player, uint256 level) external",
  "function hasClaimedLevel(address player, uint256 level) external view returns (bool)",
  "function getLevelReward(uint256 level) external view returns (uint256)",
  "event RewardPaid(address indexed player, uint256 indexed level, uint256 amount)",
];

const setupContract = () => {
  if (!process.env.MONAD_TESTNET_RPC_URL) {
    throw new Error("MONAD_TESTNET_RPC_URL not configured");
  }

  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not configured");
  }

  if (!process.env.REWARDS_ADDRESS) {
    throw new Error("REWARDS_ADDRESS not configured");
  }

  // For demo purposes, return a mock contract if not configured
  if (process.env.REWARDS_ADDRESS === "0x..." || !process.env.REWARDS_ADDRESS) {
    return {
      provider: null,
      wallet: null,
      contract: {
        hasClaimedLevel: async () => false,
        getLevelReward: async () => ethers.parseEther("10"),
        rewardPlayer: async () => ({
          hash: "0x" + Math.random().toString(16).substr(2, 64),
          wait: async () => ({ status: 1 }),
        }),
      },
    };
  }

  const provider = new ethers.JsonRpcProvider(
    process.env.MONAD_TESTNET_RPC_URL
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    process.env.REWARDS_ADDRESS,
    REWARDS_ABI,
    wallet
  );

  return { provider, wallet, contract };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS
  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { address } = req.query;

    if (!address || typeof address !== "string") {
      return res.status(400).json({
        success: false,
        error: "Address parameter is required",
      });
    }

    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: "Invalid wallet address",
      });
    }

    const { contract } = setupContract();

    // Get claimed levels (check first 10 levels for demo)
    const claimedLevels = [];
    for (let level = 1; level <= 10; level++) {
      const claimed = await contract.hasClaimedLevel(address, level);
      if (claimed) {
        claimedLevels.push(level);
      }
    }

    res.json({
      success: true,
      data: {
        address,
        claimedLevels,
        highestLevel: Math.max(...claimedLevels, 0),
      },
    });
  } catch (error: any) {
    console.error("Error in /api/player-stats:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
