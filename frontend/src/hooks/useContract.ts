import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/web3";

export function useContract(address: string | undefined, abi: any[]) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!address || !abi) {
        setError("Invalid contract parameters");
        setLoading(false);
        setContract(null);
        return;
      }

      const contractInstance = getContract(address, abi);

      if (!contractInstance) {
        setError("Failed to create contract instance");
        setContract(null);
      } else {
        setContract(contractInstance);
        setError(null);
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contract");
      setContract(null);
      setLoading(false);
    }
  }, [address, abi]);

  return { contract, loading, error };
}
