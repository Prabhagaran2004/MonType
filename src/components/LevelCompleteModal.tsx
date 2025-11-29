import React, { useState } from "react";

interface LevelCompleteModalProps {
  level: number;
  score: number;
  walletAddress: string | null;
  onContinue: () => void;
  onBackToMenu: () => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  score,
  walletAddress,
  onContinue,
  onBackToMenu,
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const rewards = [
    { level: 1, amount: "10" },
    { level: 2, amount: "20" },
    { level: 3, amount: "30" },
    { level: 4, amount: "50" },
    { level: 5, amount: "100" },
  ];

  const currentReward = rewards.find((r) => r.level === level) || {
    level,
    amount: "10",
  };

  const canClaim = score >= 50;
  const claimReward = async () => {
    if (!canClaim) {
      setErrorMessage("Score must be at least 50 to claim reward.");
      setClaimStatus("error");
      return;
    }
    if (!walletAddress) {
      setErrorMessage("Wallet not connected");
      setClaimStatus("error");
      return;
    }
    setIsClaiming(true);
    setErrorMessage("");

    try {
      // Simulate API call
      const response = await fetch("http://localhost:3001/api/level-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, level, score }),
      });
      // Optimistically show 'success' even if slow
      setClaimStatus("success");
      if (!response.ok) throw new Error("Failed to claim reward");
      await response.json();
    } catch (error) {
      setErrorMessage("Failed to claim reward. Please try again.");
      setClaimStatus("error");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-panel"
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 className="pixel-font" style={{ fontSize: 28, marginBottom: 12 }}>
            Level {level} Cleared
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Nice work commander. Secure your reward or push forward to the next
            wave.
          </p>
        </div>

        <div
          className="card"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            alignItems: "stretch",
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
            <span
              className="mono-font"
              style={{ fontSize: 20, fontWeight: 700 }}
            >
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
            <span style={{ color: "var(--text-secondary)" }}>Reward</span>
            <span
              className="mono-font"
              style={{ fontSize: 20, color: "var(--accent-purple)" }}
            >
              {currentReward.amount} MNTYPE
            </span>
          </div>
        </div>

        {claimStatus === "idle" && (
          <>
            <button
              onClick={claimReward}
              disabled={isClaiming || !canClaim}
              className="btn-primary"
            >
              {isClaiming
                ? "Processing..."
                : `Claim ${currentReward.amount} MNTYPE`}
            </button>
            <button onClick={onContinue} className="btn-secondary">
              Skip & Continue
            </button>
            {!canClaim && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--warning)",
                  textAlign: "center",
                }}
              >
                Reach 50 score to unlock this reward.
              </div>
            )}
          </>
        )}

        {claimStatus === "success" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div
              className="badge badge-success"
              style={{ alignSelf: "center" }}
            >
              Reward Sent
            </div>
            <p className="mono-font" style={{ fontSize: 18 }}>
              {currentReward.amount} MNTYPE Claimed
            </p>
            <button onClick={onContinue} className="btn-primary">
              Continue
            </button>
          </div>
        )}

        {claimStatus === "error" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 14,
                color: "var(--error)",
                textAlign: "center",
              }}
            >
              {errorMessage || "Failed to claim reward. Try again."}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={claimReward}
                disabled={isClaiming}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                Retry
              </button>
              <button
                onClick={onContinue}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Skip
              </button>
            </div>
          </div>
        )}

        <button onClick={onBackToMenu} className="btn-ghost">
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default LevelCompleteModal;
