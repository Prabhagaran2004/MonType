import React from "react";
import { useGame } from "../contexts/GameContext.tsx";

const GameHUD: React.FC = () => {
  const { gameState } = useGame();
  const livesDisplay = "💜".repeat(gameState.lives);

  return (
    <div className="bg-[#161625] border border-[#2D2F45] rounded-xl shadow-xl p-5 space-y-4">
      <h3 className="pixel-font text-xs uppercase tracking-wider text-gray-400">
        Battle Status
      </h3>
      <div className="space-y-3 text-sm text-gray-300">
        <div className="flex items-center justify-between">
          <span>Score</span>
          <span className="text-[#B07BFF] font-semibold">
            {gameState.score.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Enemies Remaining</span>
          <span className="text-[#B07BFF] font-semibold">
            {gameState.enemies.length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Lives</span>
          <span
            className="text-[#B07BFF] font-semibold"
            aria-label={`${gameState.lives} lives remaining`}
          >
            {livesDisplay}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
