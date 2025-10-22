import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AgentStatus from "./components/AgentStatus";
import PythFeeds from "./components/PythFeeds";
import AvailStatus from "./components/AvailStatus";
import ZKProofViewer from "./components/ZKProofViewer";
import ChatInterface from "./components/ChatInterface";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">🌙</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Rahu Protocol</h1>
                <p className="text-sm text-gray-400">Self-Improving Layer 2</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-300">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Dashboard Overview */}
          <Dashboard />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <AgentStatus onConnectionChange={setIsConnected} />
              <PythFeeds />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <AvailStatus />
              <ZKProofViewer />
            </div>
          </div>

          {/* Full Width Chat */}
          <ChatInterface />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <p>Built for ETHOnline 2025 🚀</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition">
                GitHub
              </a>
              <a href="#" className="hover:text-white transition">
                Docs
              </a>
              <a href="#" className="hover:text-white transition">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
