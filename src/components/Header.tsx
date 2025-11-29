import React from "react";
import { useWallet } from "../contexts/WalletContext.tsx";

interface HeaderProps {
  currentView: "menu" | "game" | "levels" | "rewards";
  setCurrentView: (view: "menu" | "game" | "levels" | "rewards") => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { wallet, disconnectWallet, switchNetwork, connectWallet } =
    useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navItems: Array<{ id: HeaderProps["currentView"]; label: string }> = [
    { id: "menu", label: "Home" },
    { id: "levels", label: "Levels" },
    { id: "rewards", label: "Rewards" },
  ];

  return (
    <header className="flex items-center justify-between px-6 h-[70px] bg-[rgba(0,0,0,0.3)] border-b border-[rgba(255,255,255,0.08)]">
      {/* LEFT - Logo */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-white">
          MONAD<span className="text-[#B07BFF]">TYPE</span>
        </h1>
      </div>

      {/* CENTER - Navigation - TOP CENTER */}
      <nav className="hidden sm:flex items-center gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:scale-105 ${
              currentView === item.id
                ? "bg-[#B07BFF] text-white"
                : "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <nav className="sm:hidden flex items-center gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors hover:scale-105 ${
              currentView === item.id
                ? "bg-[#B07BFF] text-white"
                : "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* RIGHT - Wallet Actions */}
      <div className="flex items-center gap-3">
        {!wallet.isConnected ? (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-[#B07BFF] text-white rounded-lg text-sm font-medium hover:bg-[#9A6AE8] transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">
              <span>Balance:</span>
              <span className="text-[#B07BFF] font-mono">
                {parseFloat(wallet.tokenBalance || "0").toFixed(2)} MNTYPE
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">
              <span>Network:</span>
              <span
                className={
                  wallet.isCorrectNetwork ? "text-[#B07BFF]" : "text-red-400"
                }
              >
                {wallet.isCorrectNetwork ? "Monad" : "Wrong"}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-[#B07BFF] animate-pulse" />
              <span className="font-mono text-sm text-gray-300">
                {wallet.address ? formatAddress(wallet.address) : "No Address"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!wallet.isCorrectNetwork && (
                <button
                  onClick={switchNetwork}
                  className="px-4 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm font-medium text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
                >
                  Switch
                </button>
              )}
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm font-medium text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
              >
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
