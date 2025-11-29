import React from "react";
import { useWallet } from "../contexts/WalletContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";

const Sidebar: React.FC = () => {
  const { wallet } = useWallet();
  const { gameState } = useGame();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const levelRewards = [
    { level: 1, reward: "10" },
    { level: 2, reward: "20" },
    { level: 3, reward: "30" },
    { level: 4, reward: "50" },
    { level: 5, reward: "100" },
  ];

  const currentReward = levelRewards.find(
    (r) => r.level === gameState.level
  ) || {
    level: gameState.level,
    reward: "10",
  };

  // Calculate mock stats for display
  const progressToNextLevel = ((gameState.score % 1000) / 1000) * 100;

  return (
    <aside className="bg-[#161625] border border-[#2D2F45] rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h3 className="pixel-font text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
          Wallet
        </h3>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#B07BFF] animate-pulse" />
          <span className="font-mono text-sm text-[#B07BFF]">
            {wallet.address ? formatAddress(wallet.address) : "Not connected"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="stat-card">
          <p className="pixel-font text-gray-400 text-xs uppercase tracking-wider">
            Balance
          </p>
          <p className="text-2xl font-bold text-white">
            {parseFloat(wallet.tokenBalance || "0").toFixed(1)}
          </p>
          <p className="text-[#B07BFF] text-xs">MNTYPE</p>
        </div>
        <div className="stat-card">
          <p className="pixel-font text-gray-400 text-xs uppercase tracking-wider">
            Level
          </p>
          <p className="text-2xl font-bold text-white">{gameState.level}</p>
          <p className="text-[#B07BFF] text-xs">
            Reward {currentReward.reward} MNTYPE
          </p>
        </div>
      </div>

      <div className="stat-card space-y-4">
        <div>
          <p className="pixel-font text-xs text-gray-400 uppercase tracking-wider mb-1">
            Progress
          </p>
          <div className="h-2 bg-[#20243a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B07BFF]"
              style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {progressToNextLevel.toFixed(0)}% to next level
          </p>
        </div>

        <div className="flex justify-between text-xs text-gray-300">
          <span>Score</span>
          <span className="text-[#B07BFF] font-semibold">
            {gameState.score.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-300">
          <span>Lives</span>
          <span className="text-[#B07BFF] font-semibold">
            {gameState.lives}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-300">
          <span>Enemies</span>
          <span className="text-[#B07BFF] font-semibold">
            {gameState.enemies.length}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          className="btn-primary w-full text-xs py-2"
          disabled={gameState.score < 50}
        >
          Claim Rewards
        </button>
        <button className="btn-secondary w-full text-xs py-2">
          View History
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
