import React, { useState } from "react";
import { useWallet } from "../contexts/WalletContext.tsx";

interface WalletConnectProps {
  onConnect: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const { connectWallet, switchNetwork } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const result = await connectWallet();

      if (result.success) {
        onConnect();
      } else {
        setError(result.error || "Failed to connect wallet");
      }
    } catch (err) {
      setError("Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      const result = await switchNetwork();
      if (!result.success) {
        setError(result.error || "Failed to switch network");
      }
    } catch (err) {
      setError("Network switch failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="btn-primary"
        style={{ minWidth: 280 }}
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>

      {error && (
        <div
          style={{
            color: "var(--error)",
            fontSize: 14,
            textAlign: "center",
            maxWidth: 360,
            padding: "12px 16px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: 12,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          textAlign: "center",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <p>Make sure you have MetaMask installed.</p>
        <p>The game automatically connects to the Monad Testnet.</p>
      </div>

      <div
        style={{ fontSize: 12, color: "var(--text-secondary)", opacity: 0.7 }}
      >
        Don't have a wallet? Get MetaMask from metamask.io
      </div>
    </div>
  );
};

export default WalletConnect;
