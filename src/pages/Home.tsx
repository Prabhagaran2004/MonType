import React, { useEffect, useState } from "react";
import { useWallet } from "../contexts/WalletContext";

interface HomeProps {
  onStartGame: () => void;
}

function Home({ onStartGame }: HomeProps) {
  const { wallet, connectWallet, getBalance } = useWallet();
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet.isConnected) {
        const bal = await getBalance();
        setBalance(bal);
      }
    };
    fetchBalance();
  }, [wallet.isConnected, getBalance]);

  const handleStartGame = async () => {
    if (!wallet.isConnected) {
      const connected = await connectWallet();
      if (!connected) {
        alert("Please connect your wallet to play");
        return;
      }
    }
    onStartGame();
  };

  return (
    <div className="main">
      <div style={{ textAlign: "center", maxWidth: "800px", width: "100%" }}>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "var(--primary)",
            textShadow: "0 0 5px var(--primary)",
            marginBottom: "20px",
            letterSpacing: "2px",
          }}
        >
          ⚔️ NEURAL COMBAT
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "var(--text-secondary)",
            marginBottom: "40px",
            letterSpacing: "1px",
          }}
        >
          Type Fast. Destroy Enemies. Earn MNTYPE Tokens.
        </p>

        {wallet.isConnected && (
          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 255, 0, 0.1) 0%, rgba(0, 102, 255, 0.05) 100%)",
              borderColor: "var(--success)",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ color: "var(--success)", marginBottom: "15px" }}>
              💰 WALLET STATUS
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                textAlign: "left",
              }}
            >
              <div>
                <div
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  Connected Address
                </div>
                <div
                  style={{
                    color: "var(--primary)",
                    fontFamily: "Space Mono",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  MNTYPE Balance
                </div>
                <div
                  style={{
                    color: "var(--success)",
                    fontSize: "18px",
                    fontWeight: 900,
                  }}
                >
                  {balance} MNTYPE
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h3
            style={{
              color: "var(--primary)",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            🎮 HOW TO PLAY
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              textAlign: "left",
            }}
          >
            <li style={{ fontSize: "16px" }}>
              <strong>⚡ Enemies Incoming:</strong> Words spawn from the top of
              your screen
            </li>
            <li style={{ fontSize: "16px" }}>
              <strong>⌨️ Type Accurately:</strong> Type the exact word and press
              Enter to destroy enemies
            </li>
            <li style={{ fontSize: "16px" }}>
              <strong>🔥 Build Combo:</strong> Type words without missing to
              build up your combo multiplier
            </li>
            <li style={{ fontSize: "16px" }}>
              <strong>💾 Claim Rewards:</strong> Complete each level to earn
              MNTYPE tokens on blockchain
            </li>
            <li style={{ fontSize: "16px" }}>
              <strong>🏆 Compete:</strong> Climb the leaderboard and earn up to
              500 MNTYPE per level
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 style={{ color: "var(--secondary)", marginBottom: "15px" }}>
            💎 REWARD STRUCTURE
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "10px",
              fontSize: "12px",
            }}
          >
            {[
              { level: 1, reward: 10 },
              { level: 2, reward: 20 },
              { level: 3, reward: 30 },
              { level: 4, reward: 50 },
              { level: 5, reward: 100 },
              { level: 6, reward: 150 },
              { level: 7, reward: 200 },
              { level: 8, reward: 300 },
              { level: 9, reward: 400 },
              { level: 10, reward: 500 },
            ].map((item) => (
              <div
                key={item.level}
                style={{
                  padding: "10px",
                  background: "rgba(0, 255, 255, 0.05)",
                  border: "1px solid var(--primary)",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "var(--text-secondary)" }}>
                  Lvl {item.level}
                </div>
                <div style={{ color: "var(--success)", fontWeight: 700 }}>
                  {item.reward}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleStartGame}
          style={{
            marginTop: "40px",
            padding: "16px 60px",
            fontSize: "18px",
            letterSpacing: "2px",
          }}
        >
          🚀 {wallet.isConnected ? "START MISSION" : "CONNECT & PLAY"}
        </button>

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "rgba(255, 0, 51, 0.05)",
            border: "1px dashed var(--accent)",
            borderRadius: "4px",
            color: "var(--text-secondary)",
            fontSize: "12px",
          }}
        >
          <strong>⚠️ Note:</strong> You must have MetaMask installed and
          connected to the Monad testnet to play and claim rewards.
        </div>
      </div>
    </div>
  );
}

export default Home;
