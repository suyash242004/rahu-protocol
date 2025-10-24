import { useState, useEffect } from "react";
import { ethers } from "ethers";

export function useWeb3() {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [chainId, setChainId] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize read-only provider
    const rpcUrl = import.meta.env.VITE_ETHEREUM_RPC_URL;
    if (rpcUrl) {
      const readProvider = new ethers.JsonRpcProvider(rpcUrl);
      setProvider(readProvider);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const address = accounts[0];
        const network = await browserProvider.getNetwork();

        setSigner(signer);
        setAddress(address);
        setChainId(Number(network.chainId));
        setIsConnected(true);

        // Check if on Sepolia
        if (Number(network.chainId) !== 11155111) {
          alert("Please switch to Sepolia testnet!");
        }

        console.log("✅ Wallet connected:", address);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setSigner(null);
    setAddress("");
    setIsConnected(false);
  };

  return {
    provider,
    signer,
    address,
    chainId,
    isConnected,
    connectWallet,
    disconnectWallet,
  };
}
