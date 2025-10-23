import Dashboard from "../components/Dashboard";
import { Activity, Zap, Shield, Database, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="card bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome to Rahu Protocol
            </h1>
            <p className="text-gray-300 text-lg mb-4">
              Self-improving Layer 2 with autonomous AI optimization
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/agent"
                className="btn-primary flex items-center space-x-2"
              >
                <span>View AI Agent</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/chat"
                className="btn-secondary flex items-center space-x-2"
              >
                <span>Start Chat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="text-6xl md:text-8xl">🌙</div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <Dashboard />

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickLinkCard
          title="AI Agent Status"
          description="Monitor autonomous optimization agent"
          icon={Activity}
          color="purple"
          link="/agent"
        />
        <QuickLinkCard
          title="Pyth Oracle Feeds"
          description="Real-time network metrics"
          icon={Zap}
          color="orange"
          link="/oracle"
        />
        <QuickLinkCard
          title="Avail DA Layer"
          description="Data availability status"
          icon={Database}
          color="green"
          link="/avail"
        />
        <QuickLinkCard
          title="ZK Proof Verifier"
          description="Verify AI decisions"
          icon={Shield}
          color="indigo"
          link="/proofs"
        />
      </div>

      {/* Features Overview */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureStep
            number="1"
            title="Monitor"
            description="AI agent monitors network metrics via Pyth oracles"
          />
          <FeatureStep
            number="2"
            title="Reason"
            description="MeTTa reasoning engine analyzes and proposes optimizations"
          />
          <FeatureStep
            number="3"
            title="Verify"
            description="Zero-knowledge proofs validate AI decisions"
          />
          <FeatureStep
            number="4"
            title="Execute"
            description="Verified proposals automatically update L2 parameters"
          />
        </div>
      </div>
    </div>
  );
}

function QuickLinkCard({
  title,
  description,
  icon: Icon,
  color,
  link,
}: {
  title: string;
  description: string;
  icon: any;
  color: string;
  link: string;
}) {
  const colorClasses = {
    purple:
      "from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400",
    orange:
      "from-orange-500/10 to-orange-500/5 border-orange-500/20 text-orange-400",
    green:
      "from-green-500/10 to-green-500/5 border-green-500/20 text-green-400",
    indigo:
      "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-400",
  };

  return (
    <Link
      to={link}
      className={`bg-gradient-to-br ${
        colorClasses[color as keyof typeof colorClasses]
      } border rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer`}
    >
      <Icon className="w-8 h-8 mb-4" />
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
}

function FeatureStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50">
        <span className="text-xl font-bold text-purple-400">{number}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
