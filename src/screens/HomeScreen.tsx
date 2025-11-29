import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from "../contexts/WalletContext.tsx";

const formatAddress = (address: string | null) => {
  if (!address) return "0x0000...0000";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  const handleStartMission = async () => {
    if (!wallet.isConnected) {
      const result = await connectWallet();
      if (result.success) {
        navigate("/game");
      }
      return;
    }

    navigate("/game");
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

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {wallet.isConnected ? (
              <>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                    Connected
                  </div>
                  <div className="mono-font" style={{ fontSize: 16 }}>
                    {formatAddress(wallet.address)}
                  </div>
                </div>
                <button className="btn-ghost" onClick={disconnectWallet}>
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="btn-primary"
                style={{ width: 200 }}
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main
        className="app-section"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="page-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 32,
            padding: "48px 0",
          }}
        >
          <div
            style={{
              maxWidth: 720,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h1
              className="pixel-font"
              style={{ fontSize: 48, letterSpacing: "0.2em" }}
            >
              MONAD STATION
            </h1>
            <p
              style={{
                fontSize: 20,
                color: "var(--accent-purple)",
                letterSpacing: "0.08em",
              }}
            >
              Defend. Type. Earn. On-Chain.
            </p>
          </div>

          <div className="card" style={{ maxWidth: 600, textAlign: "left" }}>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {[
                "Fast-paced typing meets arcade shooter action",
                "Earn MNTYPE tokens as you clear waves",
                "Compete on the global blockchain leaderboard",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontSize: 18,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ color: "var(--accent-purple)", fontSize: 24 }}>
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn-primary" onClick={handleStartMission}>
            Start Mission
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
