import { useState, useEffect } from "react";
import { Shield, CheckCircle, AlertCircle, Info } from "lucide-react";

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
}

export default function ZKProofViewer() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  useEffect(() => {
    // Mock proposals
    const mockProposals: Proposal[] = [
      {
        id: 1,
        proposer: "0x1234...5678",
        gasLimit: { current: 30000000, proposed: 35000000 },
        blockTime: { current: 2, proposed: 1.8 },
        maxTPS: { current: 1000, proposed: 1150 },
        proofHash: "0xabcd...ef12",
        verified: true,
        executed: true,
        timestamp: Date.now() - 3600000,
      },
      {
        id: 2,
        proposer: "0x2345...6789",
        gasLimit: { current: 35000000, proposed: 38000000 },
        blockTime: { current: 1.8, proposed: 1.7 },
        maxTPS: { current: 1150, proposed: 1250 },
        proofHash: "0xbcde...fg23",
        verified: true,
        executed: false,
        timestamp: Date.now() - 1800000,
      },
      {
        id: 3,
        proposer: "0x3456...7890",
        gasLimit: { current: 38000000, proposed: 42000000 },
        blockTime: { current: 1.7, proposed: 1.6 },
        maxTPS: { current: 1250, proposed: 1400 },
        proofHash: "0xcdef...gh34",
        verified: false,
        executed: false,
        timestamp: Date.now() - 300000,
      },
    ];
    setProposals(mockProposals);
    setSelectedProposal(mockProposals[0]);
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const calculateChange = (current: number, proposed: number) => {
    return (((proposed - current) / current) * 100).toFixed(1);
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">ZK Proof Verifier</h2>
          <p className="text-sm text-gray-400">Decision Verification</p>
        </div>
      </div>

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
              <span>By {proposal.proposer}</span>
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
            <button className="mt-4 w-full btn-primary">
              Execute Proposal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
