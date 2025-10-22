import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/web3";

export function useContract(address: string, abi: any[]) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!address || !abi) {
        setError("Invalid contract parameters");
        setLoading(false);
        return;
      }

      const contractInstance = getContract(address, abi);
      setContract(contractInstance);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contract");
      setLoading(false);
    }
  }, [address, abi]);

  return { contract, loading, error };
}
