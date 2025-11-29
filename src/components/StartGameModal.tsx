import React from "react";

interface StartGameModalProps {
  onStart: () => void;
  onCancel: () => void;
}

const StartGameModal: React.FC<StartGameModalProps> = ({
  onStart,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div
        className="modal-panel"
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <h3 className="pixel-font" style={{ fontSize: 24 }}>
          Mission Briefing
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          Enemies will descend from above. Type each callsign precisely to
          vaporize the target before it breaches Monad Station.
        </p>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 14,
            color: "var(--text-secondary)",
          }}
        >
          <li>• Maintain accuracy to preserve your shields.</li>
          <li>• Press ESC anytime to pause and recalibrate.</li>
          <li>• Rack up score to unlock token rewards.</li>
        </ul>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button onClick={onStart} className="btn-primary">
            Start Mission
          </button>
          <button onClick={onCancel} className="btn-secondary">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartGameModal;
