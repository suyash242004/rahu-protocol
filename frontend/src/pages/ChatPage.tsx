import ChatInterface from "../components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          ASI:One Chat Protocol
        </h1>
        <p className="text-gray-400">Interact with the autonomous AI agent</p>
      </div>

      <ChatInterface />

      {/* Chat Info */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Chat Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">📊 Query Status</h3>
            <p className="text-sm">
              Ask about current network metrics, agent health, and system
              performance
            </p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">💡 View Proposals</h3>
            <p className="text-sm">
              Get details on optimization proposals and their reasoning
            </p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">
              🧠 Understand Reasoning
            </h3>
            <p className="text-sm">
              Ask the agent to explain its decision-making process
            </p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">📈 Get Metrics</h3>
            <p className="text-sm">
              Retrieve historical data and performance analytics
            </p>
          </div>
        </div>
        <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg p-4">
          <p className="text-sm">
            💬 <span className="font-semibold">ASI:One Integration:</span> This
            chat interface uses the ASI Alliance's chat protocol, making the
            Rahu agent discoverable and accessible across the entire ASI
            ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
}
