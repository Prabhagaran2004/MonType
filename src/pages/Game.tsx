import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useWallet } from "../contexts/WalletContext";
import {
  getTokenBalance,
  getLevelReward,
  claimLevelReward,
} from "../services/blockchain";

interface GameProps {
  onBack: () => void;
}

interface Enemy {
  id: string;
  word: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  typedLength: number;
  color: string;
}

interface GameState {
  level: number;
  score: number;
  health: number;
  combo: number;
  totalWords: number;
  wordsKilled: number;
  accuracy: number;
  isGameOver: boolean;
  isLevelComplete: boolean;
}

const WORDS = [
  "cyber",
  "neural",
  "matrix",
  "quantum",
  "photon",
  "plasma",
  "reactor",
  "fusion",
  "orbit",
  "launch",
  "strike",
  "shield",
  "armor",
  "laser",
  "beam",
  "pulse",
  "wave",
  "surge",
  "flux",
  "storm",
  "nexus",
  "void",
  "abyss",
  "titan",
  "nova",
  "solar",
  "lunar",
  "stellar",
  "cosmic",
  "ethereal",
  "frontend",
  "backend",
  "serverless",
  "database",
  "middleware",
  "framework",
  "component",
  "module",
  "package",
  "library",
  "typescript",
  "javascript",
  "react",
  "redux",
  "nextjs",
  "expo",
  "flutter",
  "native",
  "android",
  "ios",
  "sandbox",
  "runtime",
  "debug",
  "compiler",
  "deploy",
  "version",
  "router",
  "hydrate",
  "optimize",
  "render",
  "virtual",
  "thread",
  "socket",
  "protocol",
  "network",
  "latency",
  "payload",
  "bandwidth",
  "server",
  "cluster",
  "cache",
  "stream",
  "gateway",
  "edge",
  "cloud",
  "compute",
  "scalable",
  "container",
  "docker",
  "kubernetes",
  "pipeline",
  "ci",
  "build",
  "release",
  "monitor",
  "logs",
  "metrics",
  "automate",
  "encrypt",
  "decrypt",
  "cypher",
  "hash",
  "blockchain",
  "contract",
  "solidity",
  "ethereum",
  "polygon",
  "avalanche",
  "wallet",
  "gas",
  "mining",
  "staking",
  "liquidity",
  "defi",
  "dex",
  "oracle",
  "ledger",
  "bridge",
  "sharding",
  "zkproof",
  "node",
  "validator",
  "dao",
  "nft",
  "token",
  "metaverse",
  "protocol",
  "web3",
  "dapp",
  "opcodes",
  "signature",
  "nonce",
  "consensus",
  "peer",
  "fork",
  "mainnet",
  "testnet",
  "api",
  "endpoint",
  "schema",
  "resolver",
  "mutation",
  "query",
  "graphql",
  "rest",
  "http",
  "https",
  "cookie",
  "session",
  "jwt",
  "csrf",
  "rateLimit",
  "firewall",
  "intrusion",
  "override",
  "adapter",
  "instance",
  "parallel",
  "eventloop",
  "websocket",
  "subnet",
  "hashmap",
  "binary",
  "compiler",
  "runtime",
  "inference",
  "neuron",
  "dataset",
  "training",
  "model",
  "weights",
  "vector",
  "cluster",
  "module",
  "stack",
  "queue",
  "buffer",
  "virtualize",
  "allocate",
  "compute",
];

const COLORS = [
  "#00ffff", // Bright cyan
  "#ffff00", // Bright yellow
  "#ff00ff", // Bright magenta
  "#ff3366", // Bright red-pink
  "#00ff66", // Bright green
  "#ff9900", // Bright orange
];

const LEVEL_CONFIG = {
  1: { enemiesTarget: 8, reward: 10 },
  2: { enemiesTarget: 13, reward: 20 },
  3: { enemiesTarget: 18, reward: 30 },
  4: { enemiesTarget: 23, reward: 50 },
  5: { enemiesTarget: 28, reward: 100 },
  6: { enemiesTarget: 33, reward: 150 },
  7: { enemiesTarget: 38, reward: 200 },
  8: { enemiesTarget: 43, reward: 300 },
  9: { enemiesTarget: 48, reward: 400 },
  10: { enemiesTarget: 53, reward: 500 },
};

function Game({ onBack }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { wallet, getBalance, switchToMonadTestnet } = useWallet();

  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    health: 100,
    combo: 0,
    totalWords: 0,
    wordsKilled: 0,
    accuracy: 100,
    isGameOver: false,
    isLevelComplete: false,
  });

  const [input, setInput] = useState("");
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [rewards, setRewards] = useState<{
    level: number;
    amount: string;
  } | null>(null);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [claimedLevels, setClaimedLevels] = useState<Set<number>>(new Set());
  const [tokenBalance, setTokenBalance] = useState("0");

  const gameRef = useRef({
    enemies: [] as Enemy[],
    spawnTimer: 0,
    gameTime: 0,
    isPlaying: true,
  });

  // Update player stats on score/level changes
  useEffect(() => {
    const updateStats = async () => {
      if (!wallet.isConnected || !wallet.address) return;

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
        await fetch(`${apiUrl}/api/update-stats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: wallet.address,
            level: gameState.level,
            score: Math.floor(gameState.score),
            tokens: tokenBalance,
          }),
        });
      } catch (error) {
        console.error("Error updating stats:", error);
      }
    };

    // Update stats every 5 seconds during gameplay
    if (!gameState.isGameOver && !gameState.isLevelComplete) {
      const interval = setInterval(updateStats, 5000);
      return () => clearInterval(interval);
    }
  }, [
    gameState.level,
    gameState.score,
    gameState.isGameOver,
    gameState.isLevelComplete,
    wallet.isConnected,
    wallet.address,
    tokenBalance,
  ]);

  // Keep input field focused
  useEffect(() => {
    const handleWindowClick = () => {
      if (
        inputRef.current &&
        !gameState.isGameOver &&
        !gameState.isLevelComplete
      ) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [gameState.isGameOver, gameState.isLevelComplete]);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Reset input field focus when level complete
  useEffect(() => {
    if (
      !gameState.isLevelComplete &&
      !gameState.isGameOver &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [gameState.isLevelComplete, gameState.isGameOver]);

  // Load player's balance
  useEffect(() => {
    const loadPlayerData = async () => {
      if (!wallet.isConnected || !wallet.provider || !wallet.address) return;

      try {
        const balance = await getBalance();
        setTokenBalance(balance);

        // Note: Claimed levels tracking is handled locally
        // The smart contract will prevent double claims
      } catch (error) {
        console.error("Error loading player data:", error);
      }
    };

    loadPlayerData();
  }, [wallet.isConnected, wallet.provider, wallet.address, getBalance]);

  const getRandomWord = () => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  };

  const spawnEnemy = () => {
    const word = getRandomWord();
    const enemy: Enemy = {
      id: Math.random().toString(),
      word,
      x: Math.random() * 600 + 100,
      y: -50,
      vx: (Math.random() - 0.5) * 0.02,
      vy: 0.05, // Reduced from 0.1 for slower falling speed
      width: word.length * 22, // Increased from 15 to 22 to fit larger text
      height: 65, // Increased from 50 to 65 for larger text
      health: word.length,
      maxHealth: word.length,
      typedLength: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    gameRef.current.enemies.push(enemy);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();

    // Find matching enemy for current input
    let foundMatch = false;
    for (let i = 0; i < gameRef.current.enemies.length; i++) {
      const enemy = gameRef.current.enemies[i];

      // Check if input matches the beginning of the word
      if (enemy.word.startsWith(value) && value.length > 0) {
        foundMatch = true;
        enemy.typedLength = value.length;

        // Check if word is fully typed
        if (value === enemy.word) {
          gameRef.current.enemies.splice(i, 1);
          const wordLength = enemy.word.length;
          const points = wordLength * 10 * (1 + gameState.combo / 10);

          setGameState((prev) => ({
            ...prev,
            score: prev.score + points,
            combo: prev.combo + 1,
            wordsKilled: prev.wordsKilled + 1,
            accuracy:
              prev.wordsKilled > 0
                ? ((prev.wordsKilled + 1) / (prev.totalWords + 1)) * 100
                : 100,
          }));
          setInput("");
        } else {
          setInput(value);
        }
        break;
      }
    }

    // Reset input if no match found (mistype)
    if (!foundMatch && value.length > 0) {
      setInput("");
      // Reset all enemy typed lengths
      gameRef.current.enemies.forEach((e) => (e.typedLength = 0));
      // Break combo on mistype
      setGameState((prev) => ({ ...prev, combo: 0 }));
    } else if (value.length === 0) {
      setInput("");
      // Reset all typed lengths when input is cleared
      gameRef.current.enemies.forEach((e) => (e.typedLength = 0));
    }

    setEnemies([...gameRef.current.enemies]);
  };

  const claimReward = async () => {
    if (!wallet.isConnected || !wallet.address || !wallet.signer || !rewards) {
      toast.error("❌ Wallet not connected");
      return;
    }

    // Check if on correct network (Monad Testnet = 41454)
    if (wallet.chainId !== 41454) {
      toast.loading("🔄 Switching to Monad Testnet...");
      const switched = await switchToMonadTestnet();
      toast.dismiss();

      if (!switched) {
        toast.error("❌ Please switch to Monad Testnet to claim rewards");
        return;
      }

      toast.success("✅ Switched to Monad Testnet");

      // Get new signer after network switch
      if (!wallet.provider) {
        toast.error("❌ Provider not available");
        return;
      }
      const newSigner = await wallet.provider.getSigner();

      setIsClaimingReward(true);
      toast.loading("⏳ Processing claim transaction...");

      try {
        // Claim reward with new signer
        const result = await claimLevelReward(
          wallet.address,
          rewards.level,
          newSigner
        );

        toast.dismiss();

        if (result.success) {
          toast.success(`✅ Successfully claimed ${rewards.amount} MNTYPE!`);
          setClaimedLevels((prev) => new Set(prev).add(rewards.level));

          // Refresh balance
          const newBalance = await getBalance();
          setTokenBalance(newBalance);

          // Update player stats in backend
          await updatePlayerStats();

          setRewards(null);
        } else {
          toast.error(`❌ ${result.error || "Failed to claim reward"}`);
        }
      } catch (error) {
        toast.dismiss();
        console.error("Error claiming reward:", error);
        toast.error("❌ Error claiming reward. Try again.");
      } finally {
        setIsClaimingReward(false);
      }
      return;
    }

    setIsClaimingReward(true);
    toast.loading("⏳ Processing claim transaction...");

    try {
      // Claim reward directly from smart contract
      const result = await claimLevelReward(
        wallet.address,
        rewards.level,
        wallet.signer
      );

      toast.dismiss();

      if (result.success) {
        toast.success(`✅ Successfully claimed ${rewards.amount} MNTYPE!`);
        setClaimedLevels((prev) => new Set(prev).add(rewards.level));

        // Refresh balance
        const newBalance = await getBalance();
        setTokenBalance(newBalance);

        // Update player stats in backend
        await updatePlayerStats();

        setRewards(null);
      } else {
        toast.error(`❌ ${result.error || "Failed to claim reward"}`);
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error claiming reward:", error);
      toast.error("❌ Error claiming reward. Try again.");
    } finally {
      setIsClaimingReward(false);
    }
  };

  const updatePlayerStats = async () => {
    if (!wallet.isConnected || !wallet.address) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      await fetch(`${apiUrl}/api/update-stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: wallet.address,
          level: gameState.level,
          score: Math.floor(gameState.score),
          tokens: tokenBalance,
        }),
      });
    } catch (error) {
      console.error("Error updating stats:", error);
    }
  };

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = "rgba(10, 14, 31, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      gameRef.current.spawnTimer++;
      gameRef.current.gameTime++;

      const levelConfig =
        LEVEL_CONFIG[gameState.level as keyof typeof LEVEL_CONFIG];
      const spawnRate = Math.max(180 - gameState.level * 10, 90);

      // Limit max enemies on screen (2-3 at a time)
      const maxEnemiesOnScreen = Math.min(
        2 + Math.floor(gameState.level / 3),
        4
      );

      if (
        gameRef.current.spawnTimer > spawnRate &&
        gameRef.current.enemies.length < maxEnemiesOnScreen
      ) {
        spawnEnemy();
        gameRef.current.spawnTimer = 0;
        setGameState((prev) => ({ ...prev, totalWords: prev.totalWords + 1 }));
      }

      // Update and draw enemies
      for (let i = gameRef.current.enemies.length - 1; i >= 0; i--) {
        const enemy = gameRef.current.enemies[i];
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        // Draw enemy
        ctx.strokeStyle = enemy.color;
        ctx.lineWidth = 2;
        ctx.fillStyle = enemy.color + "33";
        ctx.fillRect(
          enemy.x - enemy.width / 2,
          enemy.y,
          enemy.width,
          enemy.height
        );
        ctx.strokeRect(
          enemy.x - enemy.width / 2,
          enemy.y,
          enemy.width,
          enemy.height
        );

        // Draw word with typed/untyped highlighting
        ctx.font = "bold 26px JetBrains Mono";
        ctx.textAlign = "center";

        if (enemy.typedLength > 0) {
          // Draw typed part in green
          const typedPart = enemy.word.substring(0, enemy.typedLength);
          const untypedPart = enemy.word.substring(enemy.typedLength);

          // Measure text widths
          const typedWidth = ctx.measureText(typedPart).width;
          const totalWidth = ctx.measureText(enemy.word).width;
          const startX = enemy.x - totalWidth / 2;

          // Draw typed part (green)
          ctx.fillStyle = "#00ff00";
          ctx.textAlign = "left";
          ctx.fillText(typedPart, startX, enemy.y + 30); // Changed from 20 to 30

          // Draw untyped part (original color)
          ctx.fillStyle = enemy.color;
          ctx.fillText(untypedPart, startX + typedWidth, enemy.y + 30); // Changed from 20 to 30
        } else {
          // Draw full word in original color
          ctx.fillStyle = enemy.color;
          ctx.fillText(enemy.word, enemy.x, enemy.y + 30); // Changed from 20 to 30
        }

        // Draw health bar
        const healthPercent = 1;
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(
          enemy.x - enemy.width / 2,
          enemy.y - 8,
          enemy.width * healthPercent,
          4
        );
        ctx.strokeStyle = enemy.color;
        ctx.strokeRect(enemy.x - enemy.width / 2, enemy.y - 8, enemy.width, 4);

        // Check if off screen
        if (enemy.y > canvas.height) {
          gameRef.current.enemies.splice(i, 1);
          setGameState((prev) => ({
            ...prev,
            health: Math.max(0, prev.health - 10),
            combo: 0,
          }));
        }
      }

      // Draw HUD
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 18px Orbitron";
      ctx.textAlign = "left";
      ctx.fillText(`Level: ${gameState.level}`, 20, 30);
      ctx.fillText(`Score: ${Math.floor(gameState.score)}`, 20, 55);
      ctx.fillText(`Health: ${gameState.health}`, 20, 80);
      ctx.fillText(`Combo: ${gameState.combo}x`, 20, 105);
      ctx.fillText(
        `Words: ${gameState.wordsKilled}/${levelConfig?.enemiesTarget || 10}`,
        20,
        130
      );

      // Check win/loss conditions
      if (gameState.health <= 0) {
        setGameState((prev) => ({ ...prev, isGameOver: true }));
        gameRef.current.isPlaying = false;
      } else if (gameState.wordsKilled >= (levelConfig?.enemiesTarget || 10)) {
        // Get reward amount
        const rewardAmount = levelConfig?.reward || 10;
        setRewards({
          level: gameState.level,
          amount: rewardAmount.toString(),
        });
        setGameState((prev) => ({ ...prev, isLevelComplete: true }));
        gameRef.current.isPlaying = false;
      } else if (gameRef.current.isPlaying) {
        requestAnimationFrame(gameLoop);
      }

      setEnemies([...gameRef.current.enemies]);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  const handleNextLevel = () => {
    if (gameState.level >= 10) {
      alert("Congratulations! You completed all levels!");
      onBack();
      return;
    }

    gameRef.current = {
      enemies: [],
      spawnTimer: 0,
      gameTime: 0,
      isPlaying: true,
    };

    setGameState({
      level: gameState.level + 1,
      score: gameState.score,
      health: 100,
      combo: 0,
      totalWords: 0,
      wordsKilled: 0,
      accuracy: 100,
      isGameOver: false,
      isLevelComplete: false,
    });

    setInput("");
    setRewards(null);
  };

  return (
    <div className="main" style={{ padding: 0 }}>
      <div className="game-area">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            border: "2px solid #00ffff",
            boxShadow: "0 0 8px rgba(0, 255, 255, 0.4)",
          }}
        />
        <div className="input-area">
          <label className="input-label">
            Type the words to destroy enemies | Balance: {tokenBalance} MNTYPE
          </label>
          <input
            ref={inputRef}
            type="text"
            className="game-input"
            value={input}
            onChange={handleInput}
            placeholder="Type here..."
            autoFocus
            disabled={gameState.isGameOver || gameState.isLevelComplete}
          />
        </div>
      </div>

      {gameState.isGameOver && (
        <div className="modal-overlay" onClick={onBack}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">💀 GAME OVER</div>
            <div className="modal-text">
              Final Score: {Math.floor(gameState.score)}
              <br />
              Level Reached: {gameState.level}
              <br />
              Words Destroyed: {gameState.wordsKilled}
              <br />
              Accuracy: {gameState.accuracy.toFixed(1)}%
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={onBack}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState.isLevelComplete && !gameState.isGameOver && rewards && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">
              ✨ LEVEL {gameState.level} COMPLETE!
            </div>
            <div className="modal-text">
              Score: {Math.floor(gameState.score)}
              <br />
              Words Destroyed: {gameState.wordsKilled}
              <br />
              <span
                style={{
                  color: "var(--success)",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                Reward: +{rewards.amount} MNTYPE
              </span>
              <br />
              <small style={{ color: "var(--text-secondary)" }}>
                {claimedLevels.has(gameState.level)
                  ? "Already claimed this level"
                  : "Click claim to receive your reward"}
              </small>
            </div>
            <div className="modal-buttons">
              {!claimedLevels.has(gameState.level) && (
                <button
                  className="btn-success"
                  onClick={claimReward}
                  disabled={isClaimingReward}
                >
                  {isClaimingReward ? "Claiming..." : "💰 CLAIM REWARD"}
                </button>
              )}
              <button
                className="btn-primary"
                onClick={handleNextLevel}
                disabled={isClaimingReward}
              >
                {gameState.level >= 10 ? "Finish" : "Next Level"}
              </button>
              <button className="btn-danger" onClick={onBack}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
