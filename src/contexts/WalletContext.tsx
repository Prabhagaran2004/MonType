import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import {
  WalletState,
  NetworkConfig,
  TransactionResult,
} from "../types/wallet.ts";

const MONAD_TESTNET: NetworkConfig = {
  chainId: "0xA1BE", // 41454 in hex
  chainName: "Monad Testnet",
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  blockExplorerUrls: ["https://explorer.testnet.monad.xyz"],
};

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => Promise<TransactionResult>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<TransactionResult>;
  getTokenBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    isCorrectNetwork: false,
    tokenBalance: "0",
    provider: null,
    signer: null,
  });

  const checkNetwork = async (): Promise<boolean> => {
    if (!window.ethereum) return false;

    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      return chainId === MONAD_TESTNET.chainId;
    } catch (error) {
      console.error("Error checking network:", error);
      return false;
    }
  };

  const switchNetwork = async (): Promise<TransactionResult> => {
    if (!window.ethereum) {
      return { success: false, error: "MetaMask not installed" };
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });

      return { success: true };
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [MONAD_TESTNET],
          });
          return { success: true };
        } catch (addError) {
          return { success: false, error: "Failed to add network" };
        }
      }
      return { success: false, error: "Failed to switch network" };
    }
  };

  const getTokenBalance = async (): Promise<void> => {
    if (!wallet.address || !wallet.provider) return;

    try {
      // For demo purposes, return a mock balance
      // In production, you'd call the ERC20 contract
      setWallet((prev) => ({
        ...prev,
        tokenBalance: "1000.5",
      }));
    } catch (error) {
      console.error("Error getting token balance:", error);
    }
  };

  const connectWallet = async (): Promise<TransactionResult> => {
    if (!window.ethereum) {
      return { success: false, error: "MetaMask not installed" };
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        return { success: false, error: "No accounts found" };
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const isCorrectNetwork = chainId === MONAD_TESTNET.chainId;

      setWallet({
        address,
        isConnected: true,
        chainId,
        isCorrectNetwork,
        tokenBalance: "0",
        provider,
        signer,
      });

      await getTokenBalance();

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const disconnectWallet = (): void => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
      isCorrectNetwork: false,
      tokenBalance: "0",
      provider: null,
      signer: null,
    });
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        disconnectWallet();
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const value: WalletContextType = {
    wallet,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getTokenBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
