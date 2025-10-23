import { useState } from "react";
import AgentStatus from "../components/AgentStatus";

export default function AgentPage() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Agent Monitor
          </h1>
          <p className="text-gray-400">
            Real-time autonomous agent status and performance
          </p>
        </div>
      </div>

      <AgentStatus onConnectionChange={setIsConnected} />

      {/* Additional Agent Info */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">About the Agent</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            The Rahu AI Agent is an autonomous system built with the{" "}
            <span className="text-purple-400 font-semibold">
              ASI Alliance uAgents framework
            </span>
            . It continuously monitors blockchain performance and proposes
            optimizations using symbolic reasoning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">
                🧠 MeTTa Reasoning
              </h3>
              <p className="text-sm text-gray-400">
                Symbolic reasoning engine for explainable AI decisions
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">🔄 Autonomous</h3>
              <p className="text-sm text-gray-400">
                Operates 24/7 without human intervention
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">✅ Verified</h3>
              <p className="text-sm text-gray-400">
                All decisions validated with zero-knowledge proofs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
