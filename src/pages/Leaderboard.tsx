import React, { useEffect, useState } from "react";
import { useWallet } from "../contexts/WalletContext";

interface LeaderboardEntry {
  address: string;
  level: number;
  score: number;
  tokens: string;
  lastPlayed: string;
}

function AccountDetails() {
  const { wallet } = useWallet();
  const [playerStats, setPlayerStats] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayerData = async () => {
      // Only fetch if wallet is connected
      if (!wallet.isConnected || !wallet.address) {
        setPlayerStats(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Always set default stats immediately when wallet connects
      const defaultStats: LeaderboardEntry = {
        address: wallet.address,
        level: 0,
        score: 0,
        tokens: "0",
        lastPlayed: "Never",
      };

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

      try {
        const response = await fetch(
          `${apiUrl}/api/player-stats/${wallet.address}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.player) {
            setPlayerStats(data.player);
          } else {
            setPlayerStats(defaultStats);
          }
        } else {
          setPlayerStats(defaultStats);
        }
      } catch (fetchError) {
        console.log("Backend not available, using default stats");
        setPlayerStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [wallet.isConnected, wallet.address]);

  return (
    <div className="main">
      <div style={{ maxWidth: "1200px", width: "100%" }}>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 900,
            color: "var(--primary)",
            textShadow: "0 0 5px var(--primary)",
            marginBottom: "40px",
            letterSpacing: "2px",
            textAlign: "center",
          }}
        >
          👤 ACCOUNT DETAILS
        </h1>

        <div className="card" style={{ maxWidth: "100%", marginTop: "30px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner"></div>
              <p style={{ marginTop: "20px", color: "var(--text-secondary)" }}>
                Loading account details...
              </p>
            </div>
          ) : !wallet.isConnected ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                Connect your wallet to view your account details
              </p>
            </div>
          ) : playerStats ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "30px",
                }}
              >
                <div
                  style={{
                    borderRight: "2px solid var(--primary)",
                    paddingRight: "20px",
                  }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      WALLET ADDRESS
                    </div>
                    <div
                      style={{
                        color: "var(--primary)",
                        fontFamily: "Space Mono",
                        fontSize: "14px",
                        fontWeight: 700,
                        wordBreak: "break-all",
                      }}
                    >
                      {wallet.address}
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      LEVEL
                    </div>
                    <div
                      style={{
                        color: "var(--primary)",
                        fontSize: "48px",
                        fontWeight: 900,
                      }}
                    >
                      {playerStats.level}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      SCORE
                    </div>
                    <div
                      style={{
                        color: "var(--primary)",
                        fontSize: "48px",
                        fontWeight: 900,
                      }}
                    >
                      {playerStats.score}
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      TOKENS EARNED
                    </div>
                    <div
                      style={{
                        color: "var(--success)",
                        fontSize: "48px",
                        fontWeight: 900,
                      }}
                    >
                      {playerStats.tokens} MNTYPE
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      LAST PLAYED
                    </div>
                    <div
                      style={{
                        color: "var(--secondary)",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      {playerStats.lastPlayed}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      STATUS
                    </div>
                    <div
                      style={{
                        color: "var(--success)",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      ✅ Connected & Active
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
