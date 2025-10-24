import { Activity, Zap, Shield, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { useContract } from "../hooks/useContract";
import { RAHU_L2_ABI, AI_GOVERNANCE_ABI } from "../utils/web3";

export default function Dashboard() {
  const rahuL2Address = import.meta.env.VITE_RAHU_L2_ADDRESS;
  const aiGovAddress = import.meta.env.VITE_AI_GOVERNANCE_ADDRESS;

  const { contract: rahuL2, loading: rahuL2Loading, error: rahuL2Error } = useContract(rahuL2Address, RAHU_L2_ABI);
  const { contract: aiGov, loading: aiGovLoading, error: aiGovError } = useContract(aiGovAddress, AI_GOVERNANCE_ABI);

  const [stats, setStats] = useState({
    tps: 0,
    gasPrice: 0,
    optimizations: 0,
    dataPosted: "0 MB",
  });

  useEffect(() => {
    // Only fetch stats if contracts are loaded and no errors
    if (!rahuL2Loading && !aiGovLoading && !rahuL2Error && !aiGovError) {
      fetchStats();
      const interval = setInterval(fetchStats, 15000); // Every 15 seconds
      return () => clearInterval(interval);
    }
  }, [rahuL2, aiGov, rahuL2Loading, aiGovLoading, rahuL2Error, aiGovError]);

  const fetchStats = async () => {
    try {
      let tps = 847; // Default fallback
      let gasPrice = 35 + Math.random() * 50;
      let optimizations = 0;

      // Try to fetch from contracts only if they exist and are connected
      if (rahuL2 && !rahuL2Error) {
        try {
          const params = await rahuL2.getParams();
          tps = Number(params.maxTPS) || 847;
        } catch (err) {
          console.warn("Could not fetch TPS from contract:", err);
        }
      }

      if (aiGov && !aiGovError) {
        try {
          const count = await aiGov.proposalCount();
          optimizations = Number(count) || 0;
        } catch (err) {
          console.warn("Could not fetch proposals from contract:", err);
        }
      }

      setStats({
        tps,
        gasPrice: Math.round(gasPrice),
        optimizations,
        dataPosted: "1.2 GB",
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback to simulated data
      setStats({
        tps: 847,
        gasPrice: 45,
        optimizations: 0,
        dataPosted: "1.2 GB",
      });
    }
  };

  const statItems = [
    {
      label: "Network TPS",
      value: stats.tps.toString(),
      change: "+12.3%",
      icon: Activity,
      color: "text-blue-400",
    },
    {
      label: "Gas Price",
      value: `${stats.gasPrice} Gwei`,
      change: "-8.2%",
      icon: Zap,
      color: "text-yellow-400",
    },
    {
      label: "Optimizations",
      value: stats.optimizations.toString(),
      change: stats.optimizations > 0 ? `+${stats.optimizations}` : "—",
      icon: Shield,
      color: "text-green-400",
    },
    {
      label: "Data Posted",
      value: stats.dataPosted,
      change: "+245 MB",
      icon: Database,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-white mb-6">Network Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-start justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-green-400">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Connection Status */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                rahuL2 && !rahuL2Error ? "bg-green-500 animate-pulse" : "bg-yellow-500"
              }`}
            />
            <span className="text-gray-400">
              {rahuL2 && !rahuL2Error ? "Connected to Sepolia" : "Using simulated data"}
            </span>
          </div>
          {rahuL2Address && rahuL2Address !== "0x1234567890123456789012345678901234567890" && (
            <a
              href={`https://sepolia.etherscan.io/address/${rahuL2Address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition text-xs"
            >
              View on Etherscan →
            </a>
          )}
        </div>
        {(rahuL2Error || aiGovError) && (
          <div className="mt-2 text-xs text-yellow-400">
            Contract connection issues - using simulated data
          </div>
        )}
      </div>
    </div>
  );
}
