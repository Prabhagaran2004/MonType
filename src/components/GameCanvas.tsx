import React, { useEffect, useRef, useState } from "react";
import { useGame } from "../contexts/GameContext.tsx";

const PRIMARY_COLOR = "#B07BFF";
const PRIMARY_LIGHT = "#C599FF";
const PRIMARY_SOFT = "#E5CCFF";
const PRIMARY_DARK = "#7E4FF8";

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, activeEnemyId } = useGame();

  // Track pop animation
  const [popStates, setPopStates] = useState<Record<string, number[]>>({});
  useEffect(() => {
    const handler = () => {
      // decrement all pop frames
      setPopStates((current) => {
        const next = { ...current };
        for (const id in next) {
          next[id] = next[id].map((n) => (n > 0 ? n - 1 : 0));
        }
        return next;
      });
      requestAnimationFrame(handler);
    };
    const reqId = requestAnimationFrame(handler);
    return () => cancelAnimationFrame(reqId);
  }, []);

  useEffect(() => {
    // On enemy typedChars increased, pop that letter
    if (activeEnemyId) {
      const enemy = gameState.enemies.find((e) => e.id === activeEnemyId);
      if (enemy) {
        setPopStates((prev) => {
          const pops = prev[enemy.id] || Array(enemy.word.length).fill(0);
          let changed = false;
          for (let i = 0; i < enemy.typedChars.length; ++i) {
            if (enemy.typedChars[i] && pops[i] === 0) {
              pops[i] = 8; // 8 frames of pop
              changed = true;
            }
          }
          return changed ? { ...prev, [enemy.id]: pops } : prev;
        });
      }
    }
  }, [gameState.enemies, activeEnemyId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with dark background
    ctx.fillStyle = "#0A0F1F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pixel grid background
    ctx.strokeStyle = "#1A1C2E";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw animated stars
    const time = Date.now() * 0.001;
    for (let i = 0; i < 50; i++) {
      const x = (i * 73) % canvas.width;
      const y = (i * 37 + time * 20) % canvas.height;
      const brightness = 0.3 + Math.sin(time + i) * 0.3;
      ctx.fillStyle = `rgba(176, 123, 255, ${brightness})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Draw player ship (pixel art style)
    const shipX = canvas.width / 2;
    const shipY = canvas.height - 50;

    // Ship body - pixelated triangle
    ctx.fillStyle = PRIMARY_COLOR;
    ctx.fillRect(shipX - 4, shipY - 20, 8, 8);
    ctx.fillRect(shipX - 8, shipY - 12, 16, 8);
    ctx.fillRect(shipX - 12, shipY - 4, 24, 8);
    ctx.fillRect(shipX - 16, shipY + 4, 32, 8);
    ctx.fillRect(shipX - 8, shipY + 12, 16, 8);

    // Ship glow effect
    ctx.shadowColor = PRIMARY_COLOR;
    ctx.shadowBlur = 10;
    ctx.fillRect(shipX - 4, shipY - 20, 8, 8);
    ctx.shadowBlur = 0;

    // Draw enemies with pixel art style
    gameState.enemies.forEach((enemy) => {
      const isTargeted = enemy.word.startsWith(gameState.currentInput);
      const isCompleted = enemy.word === gameState.currentInput;
      const isActive = enemy.id === activeEnemyId;

      // Enemy ship - pixelated design
      const enemyColor = isCompleted
        ? PRIMARY_SOFT
        : isTargeted
        ? PRIMARY_LIGHT
        : PRIMARY_DARK;
      ctx.fillStyle = enemyColor;

      // Draw pixel enemy ship
      const shipSize = 24;
      ctx.fillRect(
        enemy.x - shipSize / 2,
        enemy.y - shipSize / 2,
        shipSize,
        shipSize
      );
      ctx.fillRect(
        enemy.x - shipSize / 2 - 4,
        enemy.y - shipSize / 2 + 4,
        4,
        4
      );
      ctx.fillRect(enemy.x + shipSize / 2, enemy.y - shipSize / 2 + 4, 4, 4);
      ctx.fillRect(
        enemy.x - shipSize / 2 + 4,
        enemy.y - shipSize / 2 - 4,
        4,
        4
      );
      ctx.fillRect(enemy.x - shipSize / 2 + 4, enemy.y + shipSize / 2, 4, 4);

      // Add glow effect for targeted enemies
      if (isTargeted) {
        ctx.shadowColor = enemyColor;
        ctx.shadowBlur = 15;
        ctx.fillRect(
          enemy.x - shipSize / 2,
          enemy.y - shipSize / 2,
          shipSize,
          shipSize
        );
        ctx.shadowBlur = 0;
      }

      // Draw word, per letter, with burst effect for correctly-typed
      const word = enemy.word;
      ctx.font = "14px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let xStart = enemy.x - (word.length * 14) / 2;
      for (let i = 0; i < word.length; i++) {
        const isTyped =
          isActive &&
          enemy.typedChars &&
          i < enemy.typedChars.length &&
          enemy.typedChars[i] === word[i];
        const popVal = popStates[enemy.id]?.[i] || 0;
        ctx.save();
        if (isTyped && popVal > 0) {
          const scale = 1 + 0.65 * (popVal / 8.0);
          ctx.globalAlpha = 1 - 0.12 * popVal;
          ctx.translate(enemy.x + (i - word.length / 2) * 14, enemy.y + 20);
          ctx.scale(scale, scale);
          ctx.fillStyle = PRIMARY_LIGHT;
          ctx.shadowColor = PRIMARY_COLOR;
          ctx.shadowBlur = 12;
          ctx.fillText(word[i], 0, 0);
          ctx.restore();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        } else if (isTyped) {
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = PRIMARY_LIGHT;
          ctx.fillText(
            word[i],
            enemy.x + (i - word.length / 2) * 14,
            enemy.y + 20
          );
          ctx.globalAlpha = 1.0;
          ctx.restore();
        } else {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(
            word[i],
            enemy.x + (i - word.length / 2) * 14,
            enemy.y + 20
          );
          ctx.restore();
        }
      }

      // Draw targeting box if this enemy is being typed
      if (isTargeted) {
        ctx.strokeStyle = PRIMARY_LIGHT;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(enemy.x - 35, enemy.y - 30, 70, 70);
        ctx.setLineDash([]);
      }
    });

    // Draw current input at bottom with neon styling
    if (gameState.currentInput) {
      ctx.font = "18px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = PRIMARY_LIGHT;
      ctx.shadowColor = PRIMARY_LIGHT;
      ctx.shadowBlur = 10;
      ctx.fillText(
        `> ${gameState.currentInput}`,
        canvas.width / 2,
        canvas.height - 20
      );

      // Draw blinking cursor
      if (Math.floor(Date.now() / 500) % 2 === 0) {
        const textWidth = ctx.measureText(`> ${gameState.currentInput}`).width;
        ctx.fillRect(
          canvas.width / 2 + textWidth / 2 + 4,
          canvas.height - 30,
          2,
          20
        );
      }
      ctx.shadowBlur = 0;
    }
  }, [
    gameState,
    gameState.enemies,
    gameState.currentInput,
    activeEnemyId,
    popStates,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="game-canvas pixel-font mx-auto block"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

export default GameCanvas;
