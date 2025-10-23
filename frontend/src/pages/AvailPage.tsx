import AvailStatus from "../components/AvailStatus";

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
    </div>
  );
}
