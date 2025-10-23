import ZKProofViewer from "../components/ZKProofViewer";

export default function ProofsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Zero-Knowledge Proofs
        </h1>
        <p className="text-gray-400">Verify AI optimization decisions</p>
      </div>

      <ZKProofViewer />

      {/* ZK Info */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">
          How ZK Verification Works
        </h2>
        <div className="space-y-4 text-gray-300">
          <p>
            Every optimization proposal from the AI agent is verified using{" "}
            <span className="text-indigo-400 font-semibold">
              zero-knowledge proofs
            </span>
            before execution. This ensures trustless, verifiable autonomous
            governance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <div className="text-3xl mb-2">🔐</div>
              <h3 className="text-white font-semibold mb-1">Privacy</h3>
              <p className="text-sm text-gray-400">
                Agent reasoning remains private
              </p>
            </div>
            <div className="text-center p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="text-white font-semibold mb-1">Trustless</h3>
              <p className="text-sm text-gray-400">
                No need to trust the AI agent
              </p>
            </div>
            <div className="text-center p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-white font-semibold mb-1">Efficient</h3>
              <p className="text-sm text-gray-400">
                Fast on-chain verification
              </p>
            </div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mt-4">
            <h3 className="text-white font-semibold mb-2">
              Verification Process:
            </h3>
            <ol className="list-decimal list-inside space-y-2 ml-2 text-sm">
              <li>AI agent generates optimization proposal</li>
              <li>ZK proof created proving decision correctness</li>
              <li>Proof submitted to on-chain verifier contract</li>
              <li>If valid, proposal is marked as verified</li>
              <li>Verified proposals can be executed trustlessly</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
