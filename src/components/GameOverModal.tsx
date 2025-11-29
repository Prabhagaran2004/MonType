import React from "react";

interface GameOverModalProps {
  score: number;
  level: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  level,
  onRestart,
  onBackToMenu,
}) => {
  return (
    <div className="modal-overlay">
      <div
        className="modal-panel"
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            className="pixel-font"
            style={{
              fontSize: 28,
              marginBottom: 12,
              color: "var(--accent-purple)",
            }}
          >
            Game Over
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            The station fell this time, but data is never lost. Recalibrate and
            strike back.
          </p>
        </div>

        <div
          className="card"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>Final Score</span>
            <span className="mono-font" style={{ fontSize: 20 }}>
              {score.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              Level Reached
            </span>
            <span className="mono-font" style={{ fontSize: 20 }}>
              {level}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button onClick={onRestart} className="btn-primary">
            Restart Mission
          </button>
          <button onClick={onBackToMenu} className="btn-secondary">
            Back to Hangar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
