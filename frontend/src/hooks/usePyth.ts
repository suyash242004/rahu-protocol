import { useState, useEffect } from "react";
import { useContract } from "./useContract";
import { PYTH_ORACLE_ABI } from "../utils/web3";

export function usePyth() {
  const address = import.meta.env.VITE_PYTH_ORACLE_ADDRESS;
  const { contract } = useContract(address, PYTH_ORACLE_ABI);

  const [gasPrice, setGasPrice] = useState<number>(0);
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contract) return;

    const fetchPrices = async () => {
      try {
        const metrics = await contract.getLatestMetrics();
        setGasPrice(Number(metrics.gasPrice));
        setEthPrice(Number(metrics.ethPrice) / 1e8); // Pyth uses 8 decimals
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch Pyth data:", error);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // Every 10s

    return () => clearInterval(interval);
  }, [contract]);

  return { gasPrice, ethPrice, loading };
}
