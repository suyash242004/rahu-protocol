import PythFeeds from "../components/PythFeeds";

export default function OraclePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Pyth Network Oracle
        </h1>
        <p className="text-gray-400">
          Real-time price feeds and network metrics
        </p>
      </div>

      <PythFeeds />

      {/* Oracle Info */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">
          About Pyth Network
        </h2>
        <div className="space-y-4 text-gray-300">
          <p>
            <span className="text-orange-400 font-semibold">Pyth Network</span>{" "}
            provides high-fidelity, high-frequency market data to smart
            contracts. Rahu Protocol uses Pyth oracles to monitor:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Real-time gas prices across the network</li>
            <li>ETH/USD price feed for economic calculations</li>
            <li>Network congestion indicators</li>
            <li>Transaction throughput metrics</li>
          </ul>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mt-4">
            <p className="text-sm">
              💡 <span className="font-semibold">Integration:</span> The AI
              agent queries Pyth oracles every 30 seconds to make informed
              optimization decisions based on current market conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
