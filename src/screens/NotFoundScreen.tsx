import React from "react";
import { Link } from "react-router-dom";

const NotFoundScreen: React.FC = () => {
  return (
    <div
      className="app-page"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <div className="card" style={{ maxWidth: 420, textAlign: "center" }}>
        <h1 className="pixel-font" style={{ fontSize: 32, marginBottom: 16 }}>
          404
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>
          The terminal you are looking for is offline. Return to the main deck
          to continue your mission.
        </p>
        <Link
          to="/"
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundScreen;
