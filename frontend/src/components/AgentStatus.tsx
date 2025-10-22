import { useState, useEffect } from "react";
import { Bot, Activity, TrendingUp, Clock } from "lucide-react";

interface AgentStatusProps {
  onConnectionChange: (connected: boolean) => void;
}

export default function AgentStatus({ onConnectionChange }: AgentStatusProps) {
  const [status, setStatus] = useState({
    isActive: false,
    metricsCount: 0,
    proposalsCount: 0,
    lastCheck: 0,
    confidence: 0,
  });

  useEffect(() => {
    // Simulate agent status updates
    const interval = setInterval(() => {
      setStatus((prev) => ({
        isActive: true,
        metricsCount: prev.metricsCount + 1,
        proposalsCount: prev.proposalsCount + (Math.random() > 0.7 ? 1 : 0),
        lastCheck: Date.now(),
        confidence: Math.min(95, 65 + prev.metricsCount * 0.5),
      }));
      onConnectionChange(true);
    }, 30000); // Every 30 seconds

    // Initial load
    setStatus({
      isActive: true,
      metricsCount: 15,
      proposalsCount: 3,
      lastCheck: Date.now(),
      confidence: 78.5,
    });
    onConnectionChange(true);

    return () => clearInterval(interval);
  }, [onConnectionChange]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Bot className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Agent Status</h2>
            <p className="text-sm text-gray-400">Autonomous Optimizer</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status.isActive ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-300">
            {status.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Metrics Collected</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {status.metricsCount}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Proposals</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {status.proposalsCount}
            </p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Decision Confidence</span>
            <span className="text-white font-medium">
              {status.confidence.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${status.confidence}%` }}
            />
          </div>
        </div>

        {/* Last Check */}
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            Last check: {new Date(status.lastCheck).toLocaleTimeString()}
          </span>
        </div>

        {/* Latest Reasoning */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <p className="text-sm text-purple-200">
            🧠 <span className="font-semibold">Latest Reasoning:</span> Network
            congestion detected at 72%. Proposing gas limit increase by 15% to
            improve throughput.
          </p>
        </div>
      </div>
    </div>
  );
}
