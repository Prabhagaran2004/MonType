import React, { useEffect, useState } from "react";
import { useWallet } from "../contexts/WalletContext";

interface PlayerStats {
  address: string;
  level: number;
  score: number;
  tokens: string;
  lastPlayed: string;
}

function AccountDetails() {
  const { wallet } = useWallet();
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayerData = async () => {
      // Only fetch if wallet is connected
      if (!wallet.isConnected || !wallet.address) {
        console.log("Wallet not connected, skipping fetch");
        setPlayerStats(null);
        setLoading(false);
        return;
      }

      console.log("Fetching player data for:", wallet.address);
      setLoading(true);

      // Always set default stats immediately when wallet connects
      const defaultStats: PlayerStats = {
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
        console.log("API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("API data received:", data);
          if (data.player) {
            setPlayerStats(data.player);
          } else {
            setPlayerStats(defaultStats);
          }
        } else {
          console.log("API returned error, using default stats");
          setPlayerStats(defaultStats);
        }
      } catch (fetchError) {
        console.log("Fetch failed, using default stats:", fetchError);
        setPlayerStats(defaultStats);
      } finally {
        setLoading(false);
        console.log("Loading complete");
      }
    };

    fetchPlayerData();
  }, [wallet.isConnected, wallet.address]);

  // Debug logging
  console.log("Wallet state:", {
    isConnected: wallet.isConnected,
    address: wallet.address,
    loading,
    hasPlayerStats: !!playerStats,
  });

  return (
    <div className="main">
      <div style={{ textAlign: "center", maxWidth: "900px", width: "100%" }}>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 900,
            color: "var(--primary)",
            textShadow: "0 0 5px var(--primary)",
            marginBottom: "40px",
            letterSpacing: "2px",
          }}
        >
          👤 ACCOUNT DETAILS
        </h1>

        <div className="card" style={{ maxWidth: "100%" }}>
          {!wallet.isConnected ? (
            <div style={{ textAlign: "center", padding: "60px 40px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
                💼 Connect your wallet to view account details
              </p>
            </div>
          ) : loading ? (
            <div style={{ textAlign: "center", padding: "60px 40px" }}>
              <div className="spinner"></div>
              <p
                style={{
                  marginTop: "20px",
                  color: "var(--text-secondary)",
                  fontSize: "16px",
                }}
              >
                Loading account details...
              </p>
            </div>
          ) : playerStats ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "40px",
                  padding: "40px 0",
                }}
              >
                {/* Left Column */}
                <div
                  style={{
                    textAlign: "left",
                    borderRight: "2px solid var(--primary)",
                    paddingRight: "40px",
                  }}
                >
                  <div style={{ marginBottom: "30px" }}>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "11px",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: "1px",
                      }}
                    >
                      Wallet Address
                    </div>
                    <div
                      style={{
                        color: "var(--primary)",
                        fontFamily: "Space Mono",
                        fontSize: "13px",
                        fontWeight: 700,
                        wordBreak: "break-all",
                        padding: "15px",
                        background: "rgba(0, 255, 255, 0.1)",
                        border: "1px solid var(--primary)",
                        borderRadius: "4px",
                      }}
                    >
                      {wallet.address}
                    </div>
                  </div>

                  <div style={{ marginBottom: "30px" }}>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "11px",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: "1px",
                      }}
                    >
                      Current Level
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
                        fontSize: "11px",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: "1px",
                      }}
                    >
                      Total Score
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

                {/* Right Column */}
                <div style={{ textAlign: "left" }}>
                  <div style={{ marginBottom: "30px" }}>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "11px",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: "1px",
                      }}
                    >
                      Tokens Earned
                    </div>
                    <div
                      style={{
                        color: "var(--success)",
                        fontSize: "48px",
                        fontWeight: 900,
                      }}
                    >
                      {playerStats.tokens}
                    </div>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        marginTop: "8px",
                      }}
                    >
                      MNTYPE
                    </div>
                  </div>

                  <div style={{ marginBottom: "30px" }}>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "11px",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: "1px",
                      }}
                    >
                      Last Played
                    </div>
                    <div
                      style={{
                        color: "var(--secondary)",
                        fontSize: "18px",
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
                        fontSize: "11px",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: "1px",
                      }}
                    >
                      Status
                    </div>
                    <div
                      style={{
                        color: "var(--success)",
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      ✅ Connected & Active
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 40px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
                ⚠️ Could not load account data. Please refresh the page.
              </p>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                Debug: Wallet{" "}
                {wallet.isConnected ? "connected" : "not connected"} | Address:{" "}
                {wallet.address ? wallet.address.slice(0, 10) + "..." : "none"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
