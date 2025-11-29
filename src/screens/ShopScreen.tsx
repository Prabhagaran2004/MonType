import React from "react";
import { useNavigate } from "react-router-dom";

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
          }}
        >
          <button className="btn-ghost" onClick={() => navigate("/")}>
            ◀ Back to Menu
          </button>
          <div
            className="pixel-font"
            style={{ fontSize: 18, color: "var(--accent-purple)" }}
          >
            MONADTYPE
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
        <div className="card" style={{ maxWidth: 480, textAlign: "center" }}>
          <h2 className="pixel-font" style={{ fontSize: 24, marginBottom: 16 }}>
            Supply Depot
          </h2>
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
