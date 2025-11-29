import React, { createContext, useContext, useState, ReactNode } from "react";
import { GameState, GameConfig, Enemy } from "../types/game.ts";

const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  baseEnemySpeed: 2.1, // was 1, now faster base speed
  speedIncreasePerLevel: 0.5, // as before, but more leveraged via GameCanvas.jsx
  enemiesPerLevel: 5,
  wordLengths: [3, 4, 5, 6, 7],
};

const INITIAL_GAME_STATE: GameState = {
  level: 1,
  score: 0,
  lives: 3,
  isPlaying: false,
  isPaused: false,
  gameOver: false,
  levelComplete: false,
  enemies: [],
  currentInput: "",
  highScore: 0,
};

interface GameContextType {
  gameState: GameState;
  config: GameConfig;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  updateInput: (input: string) => void;
  spawnEnemy: () => void;
  updateEnemies: () => void;
  destroyEnemy: (enemyId: string) => void;
  loseLife: () => void;
  completeLevel: () => void;
  nextLevel: () => void;
  activeEnemyId: string | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

const WORDS = [
  "cat",
  "dog",
  "run",
  "jump",
  "play",
  "game",
  "type",
  "fast",
  "slow",
  "code",
  "react",
  "block",
  "chain",
  "token",
  "mint",
  "send",
  "sign",
  "hash",
  "node",
  "peer",
  "smart",
  "contract",
  "deploy",
  "verify",
  "compile",
  "execute",
  "function",
  "variable",
  "constant",
  "import",
  "export",
  "default",
  "return",
  "async",
  "await",
  "promise",
  "callback",
  "listener",
  "emitter",
  "provider",
];

const getRandomWord = (maxLength: number): string => {
  const filteredWords = WORDS.filter((word) => word.length <= maxLength);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
};

const getEnemiesForLevel = (level: number) => {
  const count = 5 + (level - 1) * 2;
  const enemies: Enemy[] = [];
  for (let i = 0; i < count; i++) {
    const word = getRandomWord(7);
    enemies.push({
      id: Math.random().toString(36).substr(2, 9),
      word,
      x: Math.random() * (GAME_CONFIG.canvasWidth - 100) + 50,
      y: -Math.random() * 300, // stagger spawn Y so not all drop in sync
      speed: GAME_CONFIG.baseEnemySpeed + (level - 1) * GAME_CONFIG.speedIncreasePerLevel,
      typedChars: [],
      isDestroyed: false,
    });
  }
  return enemies;
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [activeEnemyId, setActiveEnemyId] = useState<string | null>(null);

  const startGame = () => {
    setGameState((prev) => ({
      ...INITIAL_GAME_STATE,
      isPlaying: true,
      highScore: prev.highScore,
      enemies: getEnemiesForLevel(1),
    }));
    setActiveEnemyId(null);
  };

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, isPaused: true }));
  };

  const resumeGame = () => {
    setGameState((prev) => ({ ...prev, isPaused: false }));
  };

  const resetGame = () => {
    setGameState((prev) => ({
      ...INITIAL_GAME_STATE,
      highScore: prev.highScore,
    }));
  };

  const updateInput = (input: string) => {
    setGameState((prev) => {
      let updatedEnemies = prev.enemies;
      // If no active, lock-in first match
      const targetEnemy = activeEnemyId
        ? prev.enemies.find(e => e.id === activeEnemyId)
        : prev.enemies.find(e => e.word.startsWith(input[0] || ""));
      if (!targetEnemy) {
        return { ...prev, currentInput: "" };
      }
      if (!activeEnemyId) setActiveEnemyId(targetEnemy.id);

      // burst typed chars
      let nextTyped = input.split("");
      // Only allow typing up to word.length chars
      if (nextTyped.length > targetEnemy.word.length) nextTyped = nextTyped.slice(0, targetEnemy.word.length);
      updatedEnemies = prev.enemies.map(e => e.id === targetEnemy.id ? { ...e, typedChars: nextTyped } : e);
      // If finished word:
      if (nextTyped.join("") === targetEnemy.word) {
        destroyEnemy(targetEnemy.id, targetEnemy.word.length);
        setActiveEnemyId(null);
        return { ...prev, currentInput: "" };
      } else {
        return { ...prev, enemies: updatedEnemies, currentInput: nextTyped.join("") };
      }
    });
  };

  const spawnEnemy = () => {
    const maxWordLength = Math.min(3 + Math.floor(gameState.level / 2), 7);
    const word = getRandomWord(maxWordLength);

    const newEnemy: Enemy = {
      id: Math.random().toString(36).substr(2, 9),
      word,
      x: Math.random() * (GAME_CONFIG.canvasWidth - 100) + 50,
      y: -50,
      speed:
        GAME_CONFIG.baseEnemySpeed +
        (gameState.level - 1) * GAME_CONFIG.speedIncreasePerLevel,
      typedChars: [],
      isDestroyed: false,
    };

    setGameState((prev) => ({
      ...prev,
      enemies: [...prev.enemies, newEnemy],
    }));
  };

  const updateEnemies = () => {
    setGameState((prev) => {
      const updatedEnemies = prev.enemies.map((enemy) => ({
        ...enemy,
        y: enemy.y + enemy.speed,
      }));

      // Check if any enemy reached the bottom
      const enemiesAtBottom = updatedEnemies.filter(
        (enemy) => enemy.y > GAME_CONFIG.canvasHeight
      );

      if (enemiesAtBottom.length > 0) {
        // Lose a life for each enemy that reached the bottom
        const livesLost = enemiesAtBottom.length;
        const newLives = Math.max(0, prev.lives - livesLost);

        return {
          ...prev,
          enemies: updatedEnemies.filter(
            (enemy) => enemy.y <= GAME_CONFIG.canvasHeight
          ),
          lives: newLives,
          gameOver: newLives === 0,
          isPlaying: newLives > 0,
        };
      }

      return { ...prev, enemies: updatedEnemies };
    });
  };

  const destroyEnemy = (enemyId: string, wordLenOverride?: number) => {
    setGameState((prev) => {
      const enemy = prev.enemies.find((e) => e.id === enemyId);
      if (!enemy) return prev;
      const points = (wordLenOverride || enemy.word.length);
      const newScore = prev.score + points;
      const newEnemies = prev.enemies.filter((e) => e.id !== enemyId);
      const isLevelComplete = newEnemies.length === 0;
      return {
        ...prev,
        enemies: newEnemies,
        score: newScore,
        levelComplete: isLevelComplete,
        isPlaying: !isLevelComplete,
      };
    });
  };

  const loseLife = () => {
    setGameState((prev) => {
      const newLives = Math.max(0, prev.lives - 1);
      return {
        ...prev,
        lives: newLives,
        gameOver: newLives === 0,
        isPlaying: newLives > 0,
      };
    });
  };

  const completeLevel = () => {
    setGameState((prev) => ({
      ...prev,
      levelComplete: true,
      isPlaying: false,
    }));
  };

  const nextLevel = () => {
    setGameState((prev) => ({
      ...prev,
      level: prev.level + 1,
      lives: 3,
      isPlaying: true,
      levelComplete: false,
      enemies: getEnemiesForLevel(prev.level + 1),
      currentInput: "",
    }));
    setActiveEnemyId(null);
  };

  const value: GameContextType = {
    gameState,
    config: GAME_CONFIG,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    updateInput,
    spawnEnemy,
    updateEnemies,
    destroyEnemy,
    loseLife,
    completeLevel,
    nextLevel,
    activeEnemyId,
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        config: GAME_CONFIG,
        startGame,
        pauseGame,
        resumeGame,
        resetGame,
        updateInput,
        spawnEnemy,
        updateEnemies,
        destroyEnemy,
        loseLife,
        completeLevel,
        nextLevel,
        activeEnemyId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
