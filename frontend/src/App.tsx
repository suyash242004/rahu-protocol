import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Home,
  Bot,
  Database,
  Shield,
  MessageCircle,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

// Import pages
import HomePage from "./pages/HomePage";
import AgentPage from "./pages/AgentPage";
import OraclePage from "./pages/OraclePage";
import AvailPage from "./pages/AvailPage";
import ProofsPage from "./pages/ProofsPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/agent" element={<AgentPage />} />
            <Route path="/oracle" element={<OraclePage />} />
            <Route path="/avail" element={<AvailPage />} />
            <Route path="/proofs" element={<ProofsPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [isConnected, setIsConnected] = useState(true);

  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <span className="text-4xl">🌙</span>
            <div>
              <Link to="/">
                <h1 className="text-xl sm:text-2xl font-bold text-white hover:text-purple-400 transition">
                  Rahu Protocol
                </h1>
              </Link>
              <p className="text-xs sm:text-sm text-gray-400">
                Self-Improving Layer 2
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
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
  );
}

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "AI Agent", href: "/agent", icon: Bot },
    { name: "Pyth Oracle", href: "/oracle", icon: TrendingUp },
    { name: "Avail DA", href: "/avail", icon: Database },
    { name: "ZK Proofs", href: "/proofs", icon: Shield },
    { name: "Chat", href: "/chat", icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-[73px] left-0 bottom-0 w-64 bg-black/40 backdrop-blur-sm border-r border-white/10
        transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                ${
                  isActive(item.href)
                    ? "bg-purple-600/20 text-white border border-purple-500/50"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-white/10">
          <p className="text-xs text-gray-400 mb-1">ETHOnline 2025</p>
          <p className="text-sm text-white font-medium">Hackathon Build</p>
        </div>
      </aside>
    </>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 mt-12 lg:ml-64">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 space-y-4 sm:space-y-0">
          <p>Built for ETHOnline 2025 🚀</p>
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
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
  );
}

export default App;
