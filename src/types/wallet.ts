import { ethers } from "ethers";

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
  isCorrectNetwork: boolean;
  tokenBalance: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

export interface NetworkConfig {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
}

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}
