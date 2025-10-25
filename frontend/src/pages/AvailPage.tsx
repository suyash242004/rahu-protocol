import AvailStatus from "../components/AvailStatus";
import { ExternalLink } from "lucide-react";

export default function AvailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Avail Data Availability
        </h1>
        <p className="text-gray-400">L2 block data posted to Avail DA layer</p>
      </div>

      <AvailStatus />

      {/* Avail Info */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">About Avail DA</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            <span className="text-green-400 font-semibold">Avail</span> is a
            modular blockchain focused on data availability. Rahu Protocol uses
            Avail to ensure L2 transaction data is always accessible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">📦 Data Posting</h3>
              <p className="text-sm text-gray-400">
                Every L2 block is automatically posted to Avail for permanent
                storage
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">✓ Verification</h3>
              <p className="text-sm text-gray-400">
                Data availability proofs ensure information can be retrieved
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">⚡ Scalability</h3>
              <p className="text-sm text-gray-400">
                Separating DA from execution enables higher throughput
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">🔗 Bridge</h3>
              <p className="text-sm text-gray-400">
                Commitments posted to Ethereum for additional security
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Turing Testnet Info */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">
          Turing Testnet Info
        </h2>
        <div className="space-y-4 text-gray-300">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📡</div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">
                  Current Testnet
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Rahu Protocol uses the{" "}
                  <span className="font-semibold text-green-400">
                    Turing testnet
                  </span>
                  , the currently supported Avail testnet. Previous testnets
                  (Goldberg & Kate) have been decommissioned.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://explorer.avail.so"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-2 rounded-lg transition flex items-center space-x-1"
                  >
                    <span>Main Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://docs.availproject.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg transition flex items-center space-x-1"
                  >
                    <span>Official Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://avail.academy/testnet-explorer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-2 rounded-lg transition flex items-center space-x-1"
                  >
                    <span>Avail Academy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">🔌 RPC Endpoint</h3>
              <code className="text-xs text-green-400 break-all">
                wss://turing-rpc.avail.so/ws
              </code>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">🌐 Network</h3>
              <p className="text-sm text-gray-300">Turing Testnet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
