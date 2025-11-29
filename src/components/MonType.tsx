import React, { useEffect, useRef, useState } from "react";

interface Enemy {
  word: string;
  typedChars: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  rotation: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export default function ZTypeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [health, setHealth] = useState(100);
  const [currentInput, setCurrentInput] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalWave, setFinalWave] = useState(1);

  const gameRunningRef = useRef(false);
  const enemiesRef = useRef<Enemy[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const targetEnemyRef = useRef<Enemy | null>(null);
  const lastSpawnRef = useRef(0);
  const enemiesThisWaveRef = useRef(0);
  const maxEnemiesPerWaveRef = useRef(10);
  const animationIdRef = useRef<number | null>(null);
  const waveRef = useRef(1);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);

  const words = [
    "alien",
    "space",
    "rocket",
    "star",
    "planet",
    "galaxy",
    "comet",
    "orbit",
    "meteor",
    "cosmic",
    "nebula",
    "pulsar",
    "quasar",
    "void",
    "black",
    "hole",
    "gravity",
    "photon",
    "laser",
    "beam",
    "ship",
    "fighter",
    "defense",
    "attack",
    "shield",
    "weapon",
    "energy",
    "power",
    "speed",
    "light",
    "warp",
    "jump",
    "asteroid",
    "station",
    "moon",
    "mars",
    "venus",
    "saturn",
    "jupiter",
    "neptune",
    "pluto",
    "mercury",
    "earth",
    "solar",
    "system",
    "universe",
    "cosmos",
    "infinity",
  ];

  const getRandomColor = () => {
    const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff0000", "#00ff00"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const createEnemy = (speed: number): Enemy | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const word = words[Math.floor(Math.random() * words.length)];
    return {
      word,
      typedChars: 0,
      x: Math.random() * (canvas.width - 100) + 50,
      y: -50,
      speed,
      size: 20,
      color: getRandomColor(),
      rotation: 0,
    };
  };

  const createParticle = (x: number, y: number, color: string): Particle => {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      life: 1,
      color,
      size: Math.random() * 3 + 1,
    };
  };

  const createStar = (): Star | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.5 + 0.1,
    };
  };

  const initStars = () => {
    const stars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      const star = createStar();
      if (star) stars.push(star);
    }
    starsRef.current = stars;
  };

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push(createParticle(x, y, color));
    }
  };

  const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.rotation);

    ctx.strokeStyle = enemy.color;
    ctx.fillStyle = enemy.color + "44";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, -enemy.size);
    ctx.lineTo(-enemy.size, enemy.size);
    ctx.lineTo(enemy.size, enemy.size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 20;
    ctx.shadowColor = enemy.color;
    ctx.stroke();

    ctx.restore();

    const typed = enemy.word.substring(0, enemy.typedChars);
    const remaining = enemy.word.substring(enemy.typedChars);

    ctx.shadowBlur = 0;
    ctx.font = "bold 18px Courier New";
    ctx.textAlign = "center";

    if (typed) {
      ctx.fillStyle = "#00ff00";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00ff00";
      ctx.fillText(
        typed,
        enemy.x - remaining.length * 5.5,
        enemy.y + enemy.size + 25
      );
    }

    if (remaining) {
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#ffffff";
      ctx.fillText(
        remaining,
        enemy.x + typed.length * 5.5,
        enemy.y + enemy.size + 25
      );
    }
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.globalAlpha = particle.life;
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawStar = (ctx: CanvasRenderingContext2D, star: Star) => {
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const endGame = () => {
    gameRunningRef.current = false;
    setFinalScore(score);
    setFinalWave(wave);
    setShowGameOver(true);
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  };

  const gameLoop = (timestamp: number) => {
    if (!gameRunningRef.current) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgba(0, 0, 26, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw stars
    starsRef.current.forEach((star) => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
      drawStar(ctx, star);
    });

    // Spawn enemies
    if (
      timestamp - lastSpawnRef.current > 2000 / waveRef.current &&
      enemiesThisWaveRef.current < maxEnemiesPerWaveRef.current
    ) {
      const speed = 0.5 + waveRef.current * 0.1;
      const enemy = createEnemy(speed);
      if (enemy) {
        enemiesRef.current.push(enemy);
        lastSpawnRef.current = timestamp;
        enemiesThisWaveRef.current++;
      }
    }

    // Update and draw enemies
    for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
      const enemy = enemiesRef.current[i];
      enemy.y += enemy.speed;
      enemy.rotation += 0.02;
      drawEnemy(ctx, enemy);

      if (enemy.y > canvas.height + 50) {
        healthRef.current -= 20;
        setHealth(healthRef.current);

        if (healthRef.current <= 0) {
          healthRef.current = 0;
          endGame();
        }

        enemiesRef.current.splice(i, 1);
        if (enemy === targetEnemyRef.current) {
          targetEnemyRef.current = null;
          setCurrentInput("");
        }
      }
    }

    // Update and draw particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const particle = particlesRef.current[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;
      drawParticle(ctx, particle);

      if (particle.life <= 0) {
        particlesRef.current.splice(i, 1);
      }
    }

    // Check wave completion
    if (
      enemiesRef.current.length === 0 &&
      enemiesThisWaveRef.current >= maxEnemiesPerWaveRef.current
    ) {
      waveRef.current++;
      setWave(waveRef.current);
      enemiesThisWaveRef.current = 0;
      maxEnemiesPerWaveRef.current = 10 + waveRef.current * 2;
      healthRef.current = Math.min(100, healthRef.current + 20);
      setHealth(healthRef.current);
    }

    animationIdRef.current = requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    setGameStarted(true);
    gameRunningRef.current = true;
    setScore(0);
    setWave(1);
    setHealth(100);
    setCurrentInput("");
    setShowGameOver(false);

    enemiesRef.current = [];
    particlesRef.current = [];
    targetEnemyRef.current = null;
    lastSpawnRef.current = 0;
    enemiesThisWaveRef.current = 0;
    maxEnemiesPerWaveRef.current = 10;

    initStars();
    animationIdRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunningRef.current) return;

      const key = e.key.toLowerCase();

      if (key.length === 1 && key.match(/[a-z]/)) {
        if (!targetEnemyRef.current) {
          for (let enemy of enemiesRef.current) {
            if (enemy.word[0] === key && enemy.typedChars === 0) {
              targetEnemyRef.current = enemy;
              setCurrentInput(key);
              enemy.typedChars = 1;
              break;
            }
          }
        } else {
          if (
            targetEnemyRef.current.word[targetEnemyRef.current.typedChars] ===
            key
          ) {
            setCurrentInput((prev) => prev + key);
            targetEnemyRef.current.typedChars++;

            if (
              targetEnemyRef.current.typedChars ===
              targetEnemyRef.current.word.length
            ) {
              scoreRef.current +=
                targetEnemyRef.current.word.length * 10 * waveRef.current;
              setScore(scoreRef.current);
              createExplosion(
                targetEnemyRef.current.x,
                targetEnemyRef.current.y,
                targetEnemyRef.current.color
              );
              enemiesRef.current = enemiesRef.current.filter(
                (e) => e !== targetEnemyRef.current
              );
              targetEnemyRef.current = null;
              setCurrentInput("");
            }
          } else {
            targetEnemyRef.current.typedChars = 0;
            targetEnemyRef.current = null;
            setCurrentInput("");
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyPress);

    initStars();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyPress);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [wave]);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#000",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        fontFamily: "Courier New, monospace",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          background: "linear-gradient(to bottom, #000000 0%, #001a33 100%)",
        }}
      />

      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            fontSize: 24,
            color: "#00ff00",
            textShadow: "0 0 10px #00ff00",
          }}
        >
          SCORE: {score}
        </div>

        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            fontSize: 24,
            color: "#00ffff",
            textShadow: "0 0 10px #00ffff",
          }}
        >
          WAVE: {wave}
        </div>

        <div
          style={{
            position: "absolute",
            top: 60,
            left: 20,
            fontSize: 18,
            color: "#ff0000",
            textShadow: "0 0 10px #ff0000",
          }}
        >
          HEALTH: {health}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 32,
            color: "#ffff00",
            textShadow: "0 0 15px #ffff00",
            letterSpacing: 4,
          }}
        >
          {currentInput}
        </div>

        {/* Game Over Screen */}
        {showGameOver && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "auto",
            }}
          >
            <h1
              style={{
                fontSize: 64,
                color: "#ff0000",
                textShadow: "0 0 20px #ff0000",
                marginBottom: 20,
              }}
            >
              GAME OVER
            </h1>
            <p
              style={{
                fontSize: 24,
                color: "#fff",
                marginBottom: 10,
              }}
            >
              Final Score: {finalScore}
            </p>
            <p
              style={{
                fontSize: 24,
                color: "#fff",
                marginBottom: 30,
              }}
            >
              Wave Reached: {finalWave}
            </p>
            <button
              onClick={startGame}
              style={{
                fontSize: 24,
                padding: "15px 40px",
                background: "#00ff00",
                border: "3px solid #00ff00",
                color: "#000",
                cursor: "pointer",
                textTransform: "uppercase",
                boxShadow: "0 0 20px #00ff00",
                fontFamily: "Courier New, monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#000";
                e.currentTarget.style.color = "#00ff00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#00ff00";
                e.currentTarget.style.color = "#000";
              }}
            >
              RESTART
            </button>
          </div>
        )}
      </div>

      {/* Start Screen */}
      {!gameStarted && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "auto",
          }}
        >
          <h1
            style={{
              fontSize: 72,
              color: "#00ff00",
              textShadow: "0 0 30px #00ff00",
              marginBottom: 30,
            }}
          >
            Monad Type
          </h1>
          <p
            style={{
              fontSize: 24,
              color: "#fff",
              marginBottom: 50,
            }}
          >
            Type words to destroy enemies!
          </p>
          <button
            onClick={startGame}
            style={{
              fontSize: 28,
              padding: "20px 50px",
              background: "#00ff00",
              border: "3px solid #00ff00",
              color: "#000",
              cursor: "pointer",
              textTransform: "uppercase",
              boxShadow: "0 0 30px #00ff00",
              fontFamily: "Courier New, monospace",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#000";
              e.currentTarget.style.color = "#00ff00";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#00ff00";
              e.currentTarget.style.color = "#000";
            }}
          >
            START GAME
          </button>
        </div>
      )}
    </div>
  );
}
