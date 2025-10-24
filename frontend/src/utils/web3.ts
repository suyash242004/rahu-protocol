import { ethers } from "ethers";

// Contract ABIs
export const RAHU_L2_ABI = [
  "function getParams() view returns (uint256 gasLimit, uint256 blockTime, uint256 maxTPS, uint256 lastUpdate)",
  "function latestBlockNumber() view returns (uint256)",
  "function proposalCount() view returns (uint256)",
  "function submitBlock(bytes32 stateRoot, bytes32 dataHash) external",
  "event ParamsUpdated(uint256 newGasLimit, uint256 newBlockTime, uint256 newMaxTPS, address proposer)",
  "event BlockSubmitted(uint256 indexed blockNumber, bytes32 stateRoot, bytes32 dataHash, uint256 timestamp)",
];

export const AI_GOVERNANCE_ABI = [
  "function proposalCount() view returns (uint256)",
  "function getProposal(uint256 proposalId) view returns (address proposer, uint256 proposedGasLimit, uint256 proposedBlockTime, uint256 proposedMaxTPS, bool verified, bool executed, string memory reasoning)",
  "function submitProposal(uint256 proposedGasLimit, uint256 proposedBlockTime, uint256 proposedMaxTPS, bytes32 zkProofHash, string calldata reasoning) external returns (uint256)",
  "function verifyProposal(uint256 proposalId, bytes calldata proof) external",
  "function executeProposal(uint256 proposalId) external",
  "event ProposalSubmitted(uint256 indexed proposalId, address indexed proposer, bytes32 zkProofHash)",
  "event ProposalVerified(uint256 indexed proposalId)",
  "event ProposalExecuted(uint256 indexed proposalId, uint256 newGasLimit, uint256 newBlockTime, uint256 newMaxTPS)",
];

export const PYTH_ORACLE_ABI = [
  "function getLatestMetrics() view returns (uint256 gasPrice, uint256 ethPrice, uint256 timestamp, uint256 confidence)",
  "function getCurrentGasPrice() view returns (uint256)",
  "function getEthPrice() view returns (int64 price, uint64 conf, int32 expo)",
  "function updateMetrics(bytes[] calldata priceUpdateData) external payable",
];

export const ZK_VERIFIER_ABI = [
  "function verifyProof(bytes calldata proof, bytes32 proofHash, bytes calldata publicInputs) external returns (bool)",
  "function isProofVerified(bytes32 proofHash) view returns (bool)",
  "event ProofVerified(bytes32 indexed proofHash, bytes32 publicInputHash)",
];

export const AVAIL_BRIDGE_ABI = [
  "function latestBlock() view returns (uint256)",
  "function getCommitment(uint256 blockNumber) view returns (bytes32 dataHash, bytes32 availTxHash, uint256 timestamp, bool verified)",
  "function postData(uint256 blockNumber, bytes32 dataHash, bytes32 availTxHash) external",
  "function verifyData(uint256 blockNumber) external",
  "function isDataAvailable(uint256 blockNumber) view returns (bool)",
  "event DataPosted(uint256 indexed blockNumber, bytes32 dataHash, bytes32 availTxHash)",
  "event DataVerified(uint256 indexed blockNumber)",
];

// Get provider
export const getProvider = () => {
  const rpcUrl =
    import.meta.env.VITE_ETHEREUM_RPC_URL || "http://localhost:8545";
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Get contract instance
export const getContract = (address: string, abi: any[]) => {
  if (!address || address === "0x" || !ethers.isAddress(address)) {
    console.warn("Invalid contract address:", address);
    return null;
  }

  const provider = getProvider();
  return new ethers.Contract(address, abi, provider);
};

// Format address for display
export const formatAddress = (address: string, chars = 4): string => {
  if (!address || address === "0x") return "0x0000...0000";
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

// Format bytes32 to hex string
export const formatBytes32 = (bytes: string): string => {
  if (!bytes) return "0x0000...0000";
  if (bytes.length <= 10) return bytes;
  return `${bytes.slice(0, 6)}...${bytes.slice(-4)}`;
};

// Check if on correct network
export const isCorrectNetwork = (chainId: number): boolean => {
  const expectedChainId = parseInt(import.meta.env.VITE_CHAIN_ID || "11155111");
  return chainId === expectedChainId;
};

// Get network name
export const getNetworkName = (chainId: number): string => {
  const networks: { [key: number]: string } = {
    1: "Ethereum Mainnet",
    11155111: "Sepolia Testnet",
    31337: "Hardhat Local",
  };
  return networks[chainId] || "Unknown Network";
};
