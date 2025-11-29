import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LeaderboardRow {
  rank: number;
  address: string;
  score: number;
  wpm: number;
  level: number;
}

const leaderboardData: LeaderboardRow[] = [
  { rank: 1, address: "0x1234...5678", score: 15420, wpm: 95, level: 10 },
  { rank: 2, address: "0xabcd...efgh", score: 14890, wpm: 92, level: 9 },
  { rank: 3, address: "0x9876...5432", score: 13250, wpm: 88, level: 8 },
  { rank: 4, address: "0xffff...1111", score: 12100, wpm: 85, level: 8 },
  { rank: 5, address: "0xeeee...2222", score: 11800, wpm: 82, level: 7 },
  { rank: 42, address: "0xff39...555F", score: 2450, wpm: 53, level: 1 },
];

const filters = ["All Time", "This Week", "Today"] as const;

type FilterOption = (typeof filters)[number];

const LeaderboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All Time");

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
              GLOBAL LEADERBOARD
            </h1>
            <p
              style={{
                fontSize: 20,
                color: "var(--accent-purple)",
                letterSpacing: "0.08em",
              }}
            >
              On-Chain Verified Rankings
            </p>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="btn-ghost"
                style={{
                  borderColor:
                    activeFilter === filter
                      ? "var(--accent-purple)"
                      : "var(--border-color)",
                  color:
                    activeFilter === filter
                      ? "var(--accent-purple)"
                      : "var(--text-secondary)",
                  background:
                    activeFilter === filter
                      ? "var(--bg-secondary)"
                      : "transparent",
                  padding: "12px 24px",
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div
            className="table-wrapper"
            style={{ width: "100%", maxWidth: 1000 }}
          >
            <table>
              <thead>
                <tr>
                  <th style={{ width: 120 }}>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>WPM</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((row) => (
                  <tr
                    key={row.rank}
                    className={
                      row.rank === 42 ? "leaderboard-row--self" : undefined
                    }
                  >
                    <td style={{ fontSize: 18 }}>
                      {row.rank === 1
                        ? "🥇"
                        : row.rank === 2
                        ? "🥈"
                        : row.rank === 3
                        ? "🥉"
                        : row.rank}
                    </td>
                    <td className="mono-font" style={{ fontSize: 16 }}>
                      {row.address}
                    </td>
                    <td style={{ fontSize: 16 }}>
                      {row.score.toLocaleString()}
                    </td>
                    <td style={{ fontSize: 16 }}>{row.wpm}</td>
                    <td style={{ fontSize: 16 }}>{row.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardScreen;
