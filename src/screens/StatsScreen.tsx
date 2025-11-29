import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from "../contexts/WalletContext.tsx";

const StatsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();

  const stats = {
    totalGames: 12,
    bestScore: 1250,
    averageWpm: 53,
    bestWpm: 68,
    accuracy: 87,
    bestStreak: 12,
  };

  const recentGames = [
    { level: 1, score: 450, wpm: 52, timeAgo: "2h ago" },
    { level: 1, score: 380, wpm: 48, timeAgo: "5h ago" },
    { level: 2, score: 620, wpm: 61, timeAgo: "1d ago" },
  ];

  const badges = [
    { icon: "🎯", label: "Sharpshooter", unlocked: true },
    { icon: "⚡", label: "Lightning", unlocked: true },
    { icon: "🔥", label: "Hot Streak", unlocked: false },
    { icon: "💎", label: "Collector", unlocked: false },
    { icon: "👑", label: "Commander", unlocked: false },
  ];

  const formatAddress = (address: string | null) => {
    if (!address) return "0x0000...0000";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="app-page">
      <header
        className="app-section"
        style={{ paddingTop: 24, paddingBottom: 24 }}
      >
        <div
          className="page-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn-ghost" onClick={() => navigate("/")}>
              ◀ Back
            </button>
            <div
              className="pixel-font"
              style={{ fontSize: 18, color: "var(--accent-purple)" }}
            >
              MONADTYPE
            </div>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link to="/leaderboard" className="btn-ghost">
              Leaderboard
            </Link>
            <Link to="/stats" className="btn-ghost">
              My Stats
            </Link>
            <Link to="/shop" className="btn-ghost">
              Shop
            </Link>
          </nav>
        </div>
      </header>

      <main className="app-section" style={{ flex: 1, paddingBottom: 48 }}>
        <div
          className="page-container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              className="pixel-font"
              style={{ fontSize: 48, letterSpacing: "0.2em", marginBottom: 12 }}
            >
              MY STATS
            </h1>
            <p
              style={{
                fontSize: 20,
                color: "var(--accent-purple)",
                letterSpacing: "0.08em",
              }}
            >
              Performance & Achievement Data
            </p>
          </div>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
              width: "100%",
              maxWidth: 1000,
            }}
          >
            <div className="card">
              <h3
                className="pixel-font"
                style={{ fontSize: 16, marginBottom: 16 }}
              >
                Player Profile
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 14,
                  color: "var(--text-secondary)",
                }}
              >
                <div>
                  <span>Wallet:</span>
                  <div className="mono-font" style={{ fontSize: 16 }}>
                    {formatAddress(wallet.address)}
                  </div>
                </div>
                <div>
                  Balance:{" "}
                  <span style={{ color: "var(--accent-purple)" }}>
                    {parseFloat(wallet.tokenBalance || "0").toFixed(2)} MNTYPE
                  </span>
                </div>
                <div>Level: {wallet.isConnected ? 1 : 0}</div>
                <div>XP: 0 / 100</div>
              </div>
              <button className="btn-primary" style={{ marginTop: 24 }}>
                Claim Rewards
              </button>
            </div>

            <div className="card">
              <h3
                className="pixel-font"
                style={{ fontSize: 16, marginBottom: 16 }}
              >
                Performance Stats
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 16,
                }}
              >
                <StatBlock
                  label="Total Games"
                  value={stats.totalGames.toString()}
                />
                <StatBlock
                  label="Best Score"
                  value={stats.bestScore.toString()}
                />
                <StatBlock
                  label="Average WPM"
                  value={stats.averageWpm.toString()}
                />
                <StatBlock label="Best WPM" value={stats.bestWpm.toString()} />
                <StatBlock label="Accuracy" value={`${stats.accuracy}%`} />
                <StatBlock
                  label="Best Streak"
                  value={stats.bestStreak.toString()}
                />
              </div>
            </div>
          </section>

          <section className="card" style={{ width: "100%", maxWidth: 1000 }}>
            <h3
              className="pixel-font"
              style={{ fontSize: 16, marginBottom: 16 }}
            >
              Achievement Badges
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className={`achievement-badge${
                    badge.unlocked ? "" : " achievement-badge--locked"
                  }`}
                  title={badge.label}
                >
                  <span style={{ fontSize: 24 }}>{badge.icon}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card" style={{ width: "100%", maxWidth: 1000 }}>
            <h3
              className="pixel-font"
              style={{ fontSize: 16, marginBottom: 16 }}
            >
              Recent Games
            </h3>
            <div>
              {recentGames.map((game, idx) => (
                <div
                  key={`${game.level}-${game.timeAgo}-${idx}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 160px 120px 1fr",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom:
                      idx === recentGames.length - 1
                        ? "none"
                        : "1px solid var(--border-color)",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Level {game.level}
                  </span>
                  <span>Score: {game.score}</span>
                  <span>WPM: {game.wpm}</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {game.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

interface StatBlockProps {
  label: string;
  value: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ label, value }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span
      style={{
        fontSize: 12,
        color: "var(--text-secondary)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {label}
    </span>
    <span className="mono-font" style={{ fontSize: 20, fontWeight: 700 }}>
      {value}
    </span>
  </div>
);

export default StatsScreen;
