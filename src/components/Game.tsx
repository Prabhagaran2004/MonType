import React, { useEffect, useRef, useState } from "react";
import { useGame } from "../contexts/GameContext.tsx";
import { useWallet } from "../contexts/WalletContext.tsx";
import GameCanvas from "./GameCanvas.tsx";
import GameHUD from "./GameHUD.tsx";
import LevelCompleteModal from "./LevelCompleteModal.tsx";
import GameOverModal from "./GameOverModal.tsx";
import StartGameModal from "./StartGameModal.tsx";

interface GameProps {
  onBackToMenu: () => void;
  showIntroModal: boolean;
  onCloseIntroModal: () => void;
}

const LEVEL_REWARDS = [
  { level: 1, reward: "10" },
  { level: 2, reward: "20" },
  { level: 3, reward: "30" },
  { level: 4, reward: "50" },
  { level: 5, reward: "100" },
];

const Game: React.FC<GameProps> = ({
  onBackToMenu,
  showIntroModal,
  onCloseIntroModal,
}) => {
  const {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    updateInput,
    spawnEnemy,
    updateEnemies,
    nextLevel,
  } = useGame();
  const { wallet } = useWallet();
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameState.levelComplete && !showLevelComplete) {
      setShowLevelComplete(true);
      pauseGame();
    }
  }, [gameState.levelComplete, showLevelComplete, pauseGame]);

  useEffect(() => {
    if (gameState.gameOver && !showGameOver) {
      setShowGameOver(true);
    }
  }, [gameState.gameOver, showGameOver]);

  useEffect(() => {
    if (showIntroModal) {
      resetGame();
      setShowLevelComplete(false);
      setShowGameOver(false);
    }
  }, [showIntroModal, resetGame]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      gameLoopRef.current = setInterval(() => {
        updateEnemies();
      }, 50);

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, updateEnemies]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const spawnDelay = Math.max(1000, 3000 - gameState.level * 200);

      spawnTimerRef.current = setInterval(() => {
        if (gameState.enemies.length < 5 + gameState.level) {
          spawnEnemy();
        }
      }, spawnDelay);

      return () => {
        if (spawnTimerRef.current) {
          clearInterval(spawnTimerRef.current);
        }
      };
    }

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [
    gameState.isPlaying,
    gameState.isPaused,
    gameState.level,
    gameState.enemies.length,
    spawnEnemy,
  ]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused) {
        return;
      }

      if (event.key === "Escape") {
        if (gameState.isPaused) {
          resumeGame();
        } else {
          pauseGame();
        }
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        updateInput(gameState.currentInput.slice(0, -1));
        return;
      }

      if (event.key.length === 1) {
        const newInput = gameState.currentInput + event.key.toLowerCase();
        updateInput(newInput);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameState.isPlaying,
    gameState.isPaused,
    gameState.currentInput,
    updateInput,
    pauseGame,
    resumeGame,
  ]);

  const handleContinueGame = () => {
    setShowLevelComplete(false);
    nextLevel();
  };

  const handleRestartGame = () => {
    setShowGameOver(false);
    resetGame();
    startGame();
  };

  const handleReturnToMenu = () => {
    resetGame();
    onCloseIntroModal();
    onBackToMenu();
  };

  const currentReward = LEVEL_REWARDS.find(
    (reward) => reward.level === gameState.level
  ) ?? { level: gameState.level, reward: "10" };

  const progressToNextLevel = Math.min(
    ((gameState.score % 1000) / 1000) * 100,
    100
  );

  const canClaimRewards = gameState.score >= 50;

  const handleStartFromModal = () => {
    resetGame();
    startGame();
    onCloseIntroModal();
  };

  return (
    <div className="fixed inset-0 grid grid-cols-[280px_1fr_280px] bg-[#0A0F1F] overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="flex flex-col h-full overflow-y-auto border-r border-[rgba(255,255,255,0.08)]">
        <div className="p-3 space-y-4">
          {/* WALLET CARD */}
          <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] rounded-lg p-[14px]">
            <h3 className="pixel-font text-xs uppercase tracking-wider text-gray-400 mb-[6px]">
              WALLET
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-left">Address</span>
                <span className="text-[#B07BFF] font-mono text-xs">
                  {wallet.address
                    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(
                        -4
                      )}`
                    : "Not Connected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-left">Balance</span>
                <span className="text-[#B07BFF] font-semibold">
                  {wallet.tokenBalance} MNTYPE
                </span>
              </div>
            </div>
          </div>

          {/* LEVEL CARD */}
          <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] rounded-lg p-[14px]">
            <h3 className="pixel-font text-xs uppercase tracking-wider text-gray-400 mb-[6px]">
              LEVEL
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-left">Current Level</span>
                <span className="text-[#B07BFF] font-semibold text-lg">
                  {gameState.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-left">Reward</span>
                <span className="text-[#B07BFF] font-semibold">
                  {currentReward.reward} MNTYPE
                </span>
              </div>
            </div>
          </div>

          {/* REWARDS CARD */}
          <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] rounded-lg p-[14px]">
            <h3 className="pixel-font text-xs uppercase tracking-wider text-gray-400 mb-[6px]">
              REWARDS
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-left">Earned</span>
                <span className="text-[#B07BFF] font-semibold">
                  {Math.floor(gameState.score / 100) * 10} MNTYPE
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleReturnToMenu}
            className="w-full px-4 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </aside>

      {/* CENTER GAME AREA */}
      <main className="flex items-center justify-center h-full bg-[#12142A] p-0">
        <div className="relative w-full h-full max-w-[800px] max-h-[600px] bg-[#0A0F1F] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
          <GameCanvas />

          {!gameState.isPlaying &&
            !showIntroModal &&
            !gameState.levelComplete &&
            !gameState.gameOver && (
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.85)] backdrop-blur-sm rounded-lg flex items-center justify-center text-center px-6">
                <div className="space-y-3">
                  <h3 className="text-2xl pixel-font text-white">Ready up</h3>
                  <p className="text-sm text-gray-300">
                    Launch a mission from the main deck to start spawning
                    enemies.
                  </p>
                </div>
              </div>
            )}

          {gameState.isPaused && (
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.9)] flex items-center justify-center rounded-lg backdrop-blur-sm">
              <div className="text-center space-y-4">
                <h3 className="text-3xl pixel-font text-white">Paused</h3>
                <p className="text-gray-300 text-sm">
                  Press ESC or tap resume to drop back in.
                </p>
                <button
                  onClick={resumeGame}
                  className="px-6 py-2 bg-[#B07BFF] text-white rounded-lg text-sm font-semibold hover:bg-[#9A6AE8] transition-colors"
                >
                  Resume Game
                </button>
              </div>
            </div>
          )}

          {gameState.isPlaying && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={gameState.isPaused ? resumeGame : pauseGame}
                className="px-4 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
              >
                {gameState.isPaused ? "Resume" : "Pause"}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="flex flex-col h-full overflow-y-auto border-l border-[rgba(255,255,255,0.08)]">
        <div className="p-3 space-y-4">
          {/* PROGRESS CARD */}
          <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] rounded-lg p-[14px]">
            <h3 className="pixel-font text-xs uppercase tracking-wider text-gray-400 mb-[6px]">
              PROGRESS
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-left">To Next Level</span>
                <span className="text-[#B07BFF] font-semibold">
                  {progressToNextLevel.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B07BFF] transition-all duration-300"
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-left">Enemies</span>
                <span className="text-[#B07BFF] font-semibold">
                  {gameState.enemies.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-left">Lives</span>
                <span className="text-[#B07BFF] font-semibold">
                  {"💜".repeat(gameState.lives)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-left">Score</span>
                <span className="text-[#B07BFF] font-semibold">
                  {gameState.score.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* GAME STATS CARD */}
          <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] rounded-lg p-[14px]">
            <h3 className="pixel-font text-xs uppercase tracking-wider text-gray-400 mb-[6px]">
              STATS
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-left">WPM</span>
                <span className="text-[#B07BFF] font-semibold">
                  {gameState.isPlaying
                    ? Math.floor(Math.random() * 20 + 40)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-left">Accuracy</span>
                <span className="text-[#B07BFF] font-semibold">
                  {gameState.isPlaying
                    ? Math.floor(Math.random() * 15 + 85)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-left">Streak</span>
                <span className="text-[#B07BFF] font-semibold">
                  {gameState.isPlaying ? Math.floor(gameState.score / 50) : 0}
                </span>
              </div>
            </div>
          </div>

          {/* CLAIM BUTTON */}
          <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.08)] rounded-lg p-[14px]">
            <h3 className="pixel-font text-xs uppercase tracking-wider text-gray-400 mb-[6px]">
              REWARDS
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-left">Next Claim</span>
                <span className="text-[#B07BFF] font-semibold">
                  {currentReward.reward} MNTYPE
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Score 50+ points to claim rewards
              </p>
            </div>
            <button
              className="w-full py-3 bg-[#B07BFF] text-white rounded-lg text-sm font-semibold hover:bg-[#9A6AE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canClaimRewards}
            >
              {canClaimRewards
                ? "Claim Rewards"
                : `Score ${50 - gameState.score} more`}
            </button>
          </div>
        </div>
      </aside>

      {/* MODALS */}
      {showIntroModal && (
        <StartGameModal
          onStart={handleStartFromModal}
          onCancel={handleReturnToMenu}
        />
      )}

      {showLevelComplete && (
        <LevelCompleteModal
          level={gameState.level}
          score={gameState.score}
          walletAddress={wallet.address}
          onContinue={handleContinueGame}
          onBackToMenu={handleReturnToMenu}
        />
      )}

      {showGameOver && (
        <GameOverModal
          score={gameState.score}
          level={gameState.level}
          onRestart={handleRestartGame}
          onBackToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
};

export default Game;
