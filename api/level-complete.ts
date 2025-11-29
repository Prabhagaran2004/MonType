import { VercelRequest, VercelResponse } from "@vercel/node";
import cors from "cors";
import { ethers } from "ethers";

// CORS middleware
const corsMiddleware = cors({
  origin: ["https://your-project-name.vercel.app", "http://localhost:3000"],
  methods: ["POST", "OPTIONS"],
  credentials: true,
});

// Contract ABI
const REWARDS_ABI = [
  "function rewardPlayer(address player, uint256 level) external",
  "function hasClaimedLevel(address player, uint256 level) external view returns (bool)",
  "function getLevelReward(uint256 level) external view returns (uint256)",
  "event RewardPaid(address indexed player, uint256 indexed level, uint256 amount)",
];

// Rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

const checkRateLimit = (address: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(address);

  if (!userLimit || now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(address, { count: 1, lastReset: now });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
};

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

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { address, level, score } = req.body;

    // Validate input
    if (!address || !level || !score) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: address, level, score",
      });
    }

    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: "Invalid wallet address",
      });
    }

    if (level < 1 || level > 100) {
      return res.status(400).json({
        success: false,
        error: "Invalid level (must be 1-100)",
      });
    }

    if (score < 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid score",
      });
    }

    // Rate limiting
    if (!checkRateLimit(address)) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please try again later.",
      });
    }

    // Setup contract
    const { contract } = setupContract();

    // Check if level already claimed
    const alreadyClaimed = await contract.hasClaimedLevel(address, level);
    if (alreadyClaimed) {
      return res.status(400).json({
        success: false,
        error: "Level reward already claimed",
      });
    }

    // Get reward amount
    const rewardAmount = await contract.getLevelReward(level);
    if (rewardAmount === 0n) {
      return res.status(400).json({
        success: false,
        error: "No reward configured for this level",
      });
    }

    // Call rewardPlayer function
    const tx = await contract.rewardPlayer(address, level);

    console.log(`Reward transaction sent: ${tx.hash}`);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      res.json({
        success: true,
        txHash: tx.hash,
        rewardAmount: ethers.formatEther(rewardAmount),
        level,
        score,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Transaction failed",
      });
    }
  } catch (error: any) {
    console.error("Error in /api/level-complete:", error);

    if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
      return res.status(500).json({
        success: false,
        error: "Transaction failed. Please try again.",
      });
    }

    if (error.code === "INSUFFICIENT_FUNDS") {
      return res.status(500).json({
        success: false,
        error: "Insufficient funds for gas",
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
