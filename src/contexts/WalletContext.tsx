import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  getBalance: () => Promise<string>;
  switchToMonadTestnet: () => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    balance: "0",
    chainId: null,
    provider: null,
    signer: null,
  });

  const connectWallet = async (): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        toast.error("❌ MetaMask is not installed!");
        return false;
      }

      toast.loading("🔌 Connecting wallet...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        toast.dismiss();
        toast.error("❌ No accounts found");
        return false;
      }

      const address = accounts[0];
      const signer = await provider.getSigner();

      let balance = "0";
      let chainId = 0;

      try {
        // Try to get balance and network info
        const balanceWei = await provider.getBalance(address);
        balance = ethers.formatEther(balanceWei);
        const network = await provider.getNetwork();
        chainId = Number(network.chainId);
      } catch (rpcError) {
        // If RPC fails (like Monad not available), just connect without balance
        // Silently fail for RPC errors - balance will show as "0"
        // Try to get chainId from MetaMask directly
        try {
          const hexChainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          chainId = parseInt(hexChainId, 16);
        } catch {
          chainId = 0;
        }
      }

      setWallet({
        address,
        isConnected: true,
        balance,
        chainId,
        provider,
        signer,
      });

      toast.dismiss();
      toast.success(
        `✅ Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
      );
      return true;
    } catch (error) {
      toast.dismiss();
      console.error("Error connecting wallet:", error);

      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          toast.error("❌ Connection rejected by user");
        } else {
          toast.error("❌ Failed to connect wallet");
        }
      } else {
        toast.error("❌ Failed to connect wallet");
      }
      return false;
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      balance: "0",
      chainId: null,
      provider: null,
      signer: null,
    });
  };

  const getBalance = async (): Promise<string> => {
    if (!wallet.provider || !wallet.address) return "0";
    try {
      const balance = await wallet.provider.getBalance(wallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      // Silently fail - RPC might not be available
      return "0";
    }
  };

  const switchToMonadTestnet = async (): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        toast.error("❌ MetaMask is not installed!");
        return false;
      }

      const monadChainId = "0xa1f6"; // 41454 in hex

      try {
        // Try to switch to Monad Testnet
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: monadChainId }],
        });

        // Update wallet state
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const signer = await provider.getSigner();

        setWallet((prev) => ({
          ...prev,
          chainId: Number(network.chainId),
          provider,
          signer,
        }));

        toast.success("✅ Switched to Monad Testnet!");
        return true;
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          toast.loading("Adding Monad Testnet...");
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: monadChainId,
                  chainName: "Monad Testnet",
                  nativeCurrency: {
                    name: "Monad",
                    symbol: "MON",
                    decimals: 18,
                  },
                  rpcUrls: ["https://testnet-rpc.monad.xyz"],
                  blockExplorerUrls: ["https://testnet.monad.xyz"],
                },
              ],
            });

            toast.dismiss();

            // Update wallet state after adding
            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            const signer = await provider.getSigner();

            setWallet((prev) => ({
              ...prev,
              chainId: Number(network.chainId),
              provider,
              signer,
            }));

            toast.success("✅ Monad Testnet added successfully!");
            return true;
          } catch (addError: any) {
            toast.dismiss();
            console.error("Error adding network:", addError);
            toast.error(
              "❌ Failed to add Monad Testnet. Add it manually in MetaMask."
            );
            return false;
          }
        }

        // User rejected the switch
        if (switchError.code === 4001) {
          toast.error("❌ Network switch cancelled");
          return false;
        }

        console.error("Error switching network:", switchError);
        toast.error("❌ Failed to switch network");
        return false;
      }
    } catch (error) {
      console.error("Error in switchToMonadTestnet:", error);
      toast.error("❌ Network switch failed");
      return false;
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        getBalance,
        switchToMonadTestnet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    return {
      wallet: {
        address: null,
        isConnected: false,
        balance: "0",
        chainId: null,
        provider: null,
        signer: null,
      },
      connectWallet: async () => false,
      disconnectWallet: () => {},
      getBalance: async () => "0",
      switchToMonadTestnet: async () => false,
    };
  }
  return context;
};
