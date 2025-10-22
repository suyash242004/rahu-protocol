import { ethers } from "ethers";

// Contract ABIs (simplified)
export const RAHU_L2_ABI = [
  "function getParams() view returns (uint256 gasLimit, uint256 blockTime, uint256 maxTPS, uint256 lastUpdate)",
  "function latestBlockNumber() view returns (uint256)",
  "function proposalCount() view returns (uint256)",
  "event ParamsUpdated(uint256 newGasLimit, uint256 newBlockTime, uint256 newMaxTPS, address proposer)",
];

export const AI_GOVERNANCE_ABI = [
  "function proposalCount() view returns (uint256)",
  "function getProposal(uint256 proposalId) view returns (address proposer, uint256 proposedGasLimit, uint256 proposedBlockTime, uint256 proposedMaxTPS, bool verified, bool executed, string memory reasoning)",
];

export const PYTH_ORACLE_ABI = [
  "function getLatestMetrics() view returns (uint256 gasPrice, uint256 ethPrice, uint256 timestamp, uint256 confidence)",
  "function getCurrentGasPrice() view returns (uint256)",
];

export const AVAIL_BRIDGE_ABI = [
  "function latestBlock() view returns (uint256)",
  "function getCommitment(uint256 blockNumber) view returns (bytes32 dataHash, bytes32 availTxHash, uint256 timestamp, bool verified)",
];

// Get provider
export const getProvider = () => {
  const rpcUrl =
    import.meta.env.VITE_ETHEREUM_RPC_URL || "http://localhost:8545";
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Get contract instance
export const getContract = (address: string, abi: any[]) => {
  const provider = getProvider();
  return new ethers.Contract(address, abi, provider);
};

// Format address for display
export const formatAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

// Format timestamp
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};
