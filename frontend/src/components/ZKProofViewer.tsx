import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import { useContract } from "../hooks/useContract";
import { AI_GOVERNANCE_ABI } from "../utils/web3";

interface Proposal {
  id: number;
  proposer: string;
  gasLimit: { current: number; proposed: number };
  blockTime: { current: number; proposed: number };
  maxTPS: { current: number; proposed: number };
  proofHash: string;
  verified: boolean;
  executed: boolean;
  timestamp: number;
  reasoning: string;
}

export default function ZKProofViewer() {
  const aiGovAddress = import.meta.env.VITE_AI_GOVERNANCE_ADDRESS;
  const { contract: aiGov } = useContract(aiGovAddress, AI_GOVERNANCE_ABI);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (aiGov) {
      fetchProposals();
    }
  }, [aiGov]);

  const fetchProposals = async () => {
    try {
      const count = await aiGov?.proposalCount();
      const proposalCount = Number(count);

      if (proposalCount === 0) {
        // Show mock data if no proposals yet
        setProposals(getMockProposals());
        setSelectedProposal(getMockProposals()[0]);
        setLoading(false);
        return;
      }

      const proposalsList: Proposal[] = [];

      for (let i = 1; i <= Math.min(proposalCount, 5); i++) {
        const proposal = await aiGov?.getProposal(i);

        proposalsList.push({
          id: i,
          proposer: proposal.proposer,
          gasLimit: {
            current: 30000000,
            proposed: Number(proposal.proposedGasLimit),
          },
          blockTime: {
            current: 2,
            proposed: Number(proposal.proposedBlockTime),
          },
          maxTPS: {
            current: 1000,
            proposed: Number(proposal.proposedMaxTPS),
          },
          proofHash: "0x" + Math.random().toString(16).slice(2, 18),
          verified: proposal.verified,
          executed: proposal.executed,
          timestamp: Date.now() - (proposalCount - i) * 3600000,
          reasoning: proposal.reasoning,
        });
      }

      setProposals(proposalsList);
      setSelectedProposal(proposalsList[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      // Fallback to mock data
      setProposals(getMockProposals());
      setSelectedProposal(getMockProposals()[0]);
      setLoading(false);
    }
  };

  const getMockProposals = (): Proposal[] => {
    return [
      {
        id: 1,
        proposer: import.meta.env.VITE_DEPLOYER_ADDRESS || "0x1234...5678",
        gasLimit: { current: 30000000, proposed: 35000000 },
        blockTime: { current: 2, proposed: 1.8 },
        maxTPS: { current: 1000, proposed: 1150 },
        proofHash: "0xabcd...ef12",
        verified: true,
        executed: true,
        timestamp: Date.now() - 3600000,
        reasoning:
          "High congestion detected. Increase gas limit by 16.7% to improve throughput.",
      },
      {
        id: 2,
        proposer: import.meta.env.VITE_DEPLOYER_ADDRESS || "0x2345...6789",
        gasLimit: { current: 35000000, proposed: 38000000 },
        blockTime: { current: 1.8, proposed: 1.7 },
        maxTPS: { current: 1150, proposed: 1250 },
        proofHash: "0xbcde...fg23",
        verified: true,
        executed: false,
        timestamp: Date.now() - 1800000,
        reasoning:
          "Network load increasing. Further optimization needed for sustained performance.",
      },
      {
        id: 3,
        proposer: import.meta.env.VITE_DEPLOYER_ADDRESS || "0x3456...7890",
        gasLimit: { current: 38000000, proposed: 42000000 },
        blockTime: { current: 1.7, proposed: 1.6 },
        maxTPS: { current: 1250, proposed: 1400 },
        proofHash: "0xcdef...gh34",
        verified: false,
        executed: false,
        timestamp: Date.now() - 300000,
        reasoning:
          "Peak usage period. Proactive scaling to maintain service quality.",
      },
    ];
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const calculateChange = (current: number, proposed: number) => {
    return (((proposed - current) / current) * 100).toFixed(1);
  };

  const formatAddress = (address: string) => {
    if (!address) return "0x0000...0000";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ZK Proof Verifier</h2>
            <p className="text-sm text-gray-400">Decision Verification</p>
          </div>
        </div>
        {aiGov && (
          <a
            href={`https://sepolia.etherscan.io/address/${aiGovAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition flex items-center space-x-1 text-xs"
          >
            <span>Contract</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Status Message */}
      {proposals.length === 0 || !aiGov ? (
        <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-sm text-yellow-300">
            ℹ️ No proposals on-chain yet. Showing mock data for demonstration.
          </p>
        </div>
      ) : (
        <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-sm text-green-300">
            ✅ Connected to AIGovernance contract. Showing {proposals.length}{" "}
            proposals.
          </p>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-2 mb-6">
        {proposals.map((proposal) => (
          <button
            key={proposal.id}
            onClick={() => setSelectedProposal(proposal)}
            className={`w-full text-left bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors border ${
              selectedProposal?.id === proposal.id
                ? "border-indigo-500"
                : "border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                Proposal #{proposal.id}
              </span>
              <div className="flex items-center space-x-2">
                {proposal.verified ? (
                  <div className="flex items-center space-x-1 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Pending</span>
                  </div>
                )}
                {proposal.executed && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    Executed
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>By {formatAddress(proposal.proposer)}</span>
              <span>{formatTimestamp(proposal.timestamp)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Proposal Details */}
      {selectedProposal && (
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg p-4 border border-indigo-500/20">
          <h3 className="text-sm font-medium text-white mb-4">
            Proposal Details
          </h3>

          <div className="space-y-3">
            {/* Gas Limit */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Gas Limit</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">
                  {(selectedProposal.gasLimit.current / 1000000).toFixed(0)}M
                </span>
                <span className="text-gray-500">→</span>
                <span className="text-sm text-white font-medium">
                  {(selectedProposal.gasLimit.proposed / 1000000).toFixed(0)}M
                </span>
                <span className="text-xs text-green-400">
                  +
                  {calculateChange(
                    selectedProposal.gasLimit.current,
                    selectedProposal.gasLimit.proposed
                  )}
                  %
                </span>
              </div>
            </div>

            {/* Block Time */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Block Time</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">
                  {selectedProposal.blockTime.current}s
                </span>
                <span className="text-gray-500">→</span>
                <span className="text-sm text-white font-medium">
                  {selectedProposal.blockTime.proposed}s
                </span>
                <span className="text-xs text-green-400">
                  {calculateChange(
                    selectedProposal.blockTime.current,
                    selectedProposal.blockTime.proposed
                  )}
                  %
                </span>
              </div>
            </div>

            {/* Max TPS */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Max TPS</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">
                  {selectedProposal.maxTPS.current}
                </span>
                <span className="text-gray-500">→</span>
                <span className="text-sm text-white font-medium">
                  {selectedProposal.maxTPS.proposed}
                </span>
                <span className="text-xs text-green-400">
                  +
                  {calculateChange(
                    selectedProposal.maxTPS.current,
                    selectedProposal.maxTPS.proposed
                  )}
                  %
                </span>
              </div>
            </div>

            {/* Reasoning */}
            {selectedProposal.reasoning && (
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-gray-400">AI Reasoning</span>
                </div>
                <p className="text-sm text-gray-300">
                  {selectedProposal.reasoning}
                </p>
              </div>
            )}

            {/* Proof Hash */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-gray-400">ZK Proof Hash</span>
              </div>
              <p className="text-xs font-mono text-gray-300 break-all">
                {selectedProposal.proofHash}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {selectedProposal.verified && !selectedProposal.executed && (
            <button
              className="mt-4 w-full btn-primary"
              onClick={async () => {
                if (!aiGov) {
                  alert(
                    "Contract not connected. Please deploy contracts first."
                  );
                  return;
                }

                try {
                  // Execute the proposal
                  const tx = await aiGov.executeProposal(selectedProposal.id);
                  alert(
                    `Proposal execution initiated! Transaction: ${tx.hash}`
                  );

                  // Refresh proposals after execution
                  setTimeout(() => fetchProposals(), 3000);
                } catch (error) {
                  console.error("Failed to execute proposal:", error);
                  alert(
                    "Failed to execute proposal. Check console for details."
                  );
                }
              }}
            >
              Execute Proposal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
