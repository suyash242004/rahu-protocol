import { Activity, Zap, Shield, Database } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      label: "Network TPS",
      value: "847",
      change: "+12.3%",
      icon: Activity,
      color: "text-blue-400",
    },
    {
      label: "Gas Price",
      value: "45 Gwei",
      change: "-8.2%",
      icon: Zap,
      color: "text-yellow-400",
    },
    {
      label: "Optimizations",
      value: "23",
      change: "+5",
      icon: Shield,
      color: "text-green-400",
    },
    {
      label: "Data Posted",
      value: "1.2 GB",
      change: "+245 MB",
      icon: Database,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-white mb-6">Network Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
    </div>
  );
}
