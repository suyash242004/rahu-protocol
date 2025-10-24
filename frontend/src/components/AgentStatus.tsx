import { useState, useEffect } from "react";
import { Bot, Activity, TrendingUp, Clock } from "lucide-react";
import axios from "axios";

interface AgentStatusProps {
  onConnectionChange: (connected: boolean) => void;
}

interface AgentData {
  is_active: boolean;
  metrics_count: number;
  proposals_count: number;
  last_check: number;
  confidence: number;
}

export default function AgentStatus({ onConnectionChange }: AgentStatusProps) {
  const [status, setStatus] = useState<AgentData>({
    is_active: false,
    metrics_count: 0,
    proposals_count: 0,
    last_check: 0,
    confidence: 0,
  });
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestReasoning, setLatestReasoning] = useState<string>("");

  const agentApiUrl =
    import.meta.env.VITE_AGENT_API_URL || "http://localhost:8001";

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      // Try to fetch real agent status
      const response = await axios.get(`${agentApiUrl}/status`, {
        timeout: 5000,
      });

      const data = response.data;
      setStatus({
        is_active: data.status === "active",
        metrics_count: data.metrics_count || 0,
        proposals_count: data.proposals_count || 0,
        last_check: data.last_check || Date.now(),
        confidence: calculateConfidence(data.metrics_count || 0),
      });

      onConnectionChange(true);
      setError(null);
      setLoading(false);

      // Fetch latest proposal for reasoning
      if (data.proposals_count > 0) {
        fetchLatestProposal();
      }
    } catch (err) {
      // Fallback to simulated data if agent not running
      console.warn("Agent API not available, using simulated data");

      setStatus((prev) => ({
        is_active: true,
        metrics_count: prev.metrics_count + 1,
        proposals_count: prev.proposals_count + (Math.random() > 0.85 ? 1 : 0),
        last_check: Date.now(),
        confidence: Math.min(95, 65 + prev.metrics_count * 0.5),
      }));

      setLatestReasoning(
        "Network congestion detected at 72%. Proposing gas limit increase by 15% to improve throughput."
      );
      onConnectionChange(false);
      setError("Agent offline - showing simulated data");
      setLoading(false);
    }
  };

  const fetchLatestProposal = async () => {
    try {
      const response = await axios.get(`${agentApiUrl}/proposals/latest`);
      if (response.data && response.data.reasoning) {
        setLatestReasoning(response.data.reasoning);
      }
    } catch (err) {
      console.warn("Could not fetch latest proposal");
    }
  };

  const calculateConfidence = (metricsCount: number): number => {
    return Math.min(95, 65 + (metricsCount / 50) * 30);
  };

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
              status.is_active ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-300">
            {status.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-sm text-yellow-300">⚠️ {error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Metrics Collected</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {status.metrics_count}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Proposals</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {status.proposals_count}
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
            Last check: {new Date(status.last_check).toLocaleTimeString()}
          </span>
        </div>

        {/* Latest Reasoning */}
        {latestReasoning && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <p className="text-sm text-purple-200">
              🧠 <span className="font-semibold">Latest Reasoning:</span>{" "}
              {latestReasoning}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
