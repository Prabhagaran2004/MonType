import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ShopScreen: React.FC = () => {
  const navigate = useNavigate();

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
              SUPPLY DEPOT
            </h1>
            <p
              style={{
                fontSize: 20,
                color: "var(--accent-purple)",
                letterSpacing: "0.08em",
              }}
            >
              Equipment & Upgrades Coming Soon
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
                "Ship upgrades and weapons",
                "Cosmetic modifications",
                "Power-ups and boosts",
                "Exclusive NFT collectibles",
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

          <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>
            The MonadType equipment shop is under construction. Check back soon
            to exchange your MNTYPE rewards for ship upgrades and cosmetic mods.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ShopScreen;
