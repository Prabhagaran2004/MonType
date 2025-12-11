import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { WalletProvider, useWallet } from "./contexts/WalletContext";
import Home from "./pages/Home";
import Game from "./pages/Game";
import AccountDetails from "./pages/AccountDetails";
import "./index.css";

type PageType = "home" | "game" | "account";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (addr: string | null) => {
    if (!addr) return "0x0000...0000";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">⚡ MONADTYPE ⚡</div>

        <nav className="nav">
          <button
            className={`nav-button ${currentPage === "home" ? "active" : ""}`}
            onClick={() => setCurrentPage("home")}
          >
            Home
          </button>
          <button
            className={`nav-button ${
              currentPage === "account" ? "active" : ""
            }`}
            onClick={() => setCurrentPage("account")}
          >
            Account
          </button>
        </nav>

        <div className="wallet-section">
          {wallet.isConnected ? (
            <>
              <div className="wallet-info">
                <div className="wallet-status">Connected</div>
                <div className="wallet-address">
                  {formatAddress(wallet.address)}
                </div>
              </div>
              <button className="btn-danger" onClick={disconnectWallet}>
                Disconnect
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <div className="content">
        {currentPage === "home" && (
          <Home onStartGame={() => setCurrentPage("game")} />
        )}
        {currentPage === "game" && (
          <Game onBack={() => setCurrentPage("home")} />
        )}
        {currentPage === "account" && <AccountDetails />}
      </div>
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AppContent />
    </WalletProvider>
  );
}

export default App;
