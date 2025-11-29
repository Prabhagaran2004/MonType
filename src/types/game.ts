export interface Enemy {
  id: string;
  word: string;
  x: number;
  y: number;
  speed: number;
  typedChars: string[];
  isDestroyed: boolean;
}

export interface GameState {
  level: number;
  score: number;
  lives: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  levelComplete: boolean;
  enemies: Enemy[];
  currentInput: string;
  highScore: number;
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  baseEnemySpeed: number;
  speedIncreasePerLevel: number;
  enemiesPerLevel: number;
  wordLengths: number[];
}

export interface LevelReward {
  level: number;
  rewardAmount: string;
  isClaimed: boolean;
}

export interface PlayerStats {
  highestLevel: number;
  totalScore: number;
  tokensEarned: string;
  levelsCompleted: number;
}
