import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Fuel,
  ExternalLink,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useContract } from "../hooks/useContract";
import { PYTH_ORACLE_ABI } from "../utils/web3";

interface PriceData {
  timestamp: number;
  gasPrice: number;
  ethPrice: number;
}

export default function PythFeeds() {
  const pythAddress = import.meta.env.VITE_PYTH_ORACLE_ADDRESS;
  const { contract: pythContract } = useContract(pythAddress, PYTH_ORACLE_ABI);

  const [data, setData] = useState<PriceData[]>([]);
  const [currentGas, setCurrentGas] = useState(45.2);
  const [currentEth, setCurrentEth] = useState(2847.5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with some data
    const initialData: PriceData[] = Array.from({ length: 20 }, (_, i) => ({
      timestamp: Date.now() - (20 - i) * 30000,
      gasPrice: 40 + Math.random() * 20,
      ethPrice: 2800 + Math.random() * 100,
    }));
    setData(initialData);
    setLoading(false);

    // Try to fetch from contract, fallback to simulation
    if (pythContract) {
      fetchPrices();
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (pythContract) {
        fetchPrices();
      } else {
        updateSimulatedPrices();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pythContract]);

  const fetchPrices = async () => {
    try {
      const metrics = await pythContract?.getLatestMetrics();
      const newGas = Number(metrics.gasPrice);
      const newEth = Number(metrics.ethPrice) / 1e8; // Pyth uses 8 decimals

      setCurrentGas(newGas > 0 ? newGas : currentGas);
      setCurrentEth(newEth > 0 ? newEth : currentEth);

      setData((prev) => [
        ...prev.slice(-19),
        {
          timestamp: Date.now(),
          gasPrice: newGas > 0 ? newGas : currentGas,
          ethPrice: newEth > 0 ? newEth : currentEth,
        },
      ]);
    } catch (error) {
      console.warn("Could not fetch from Pyth contract, using simulation");
      updateSimulatedPrices();
    }
  };

  const updateSimulatedPrices = () => {
    const newGas = currentGas + (Math.random() - 0.5) * 5;
    const newEth = currentEth + (Math.random() - 0.5) * 20;

    setCurrentGas(newGas);
    setCurrentEth(newEth);

    setData((prev) => [
      ...prev.slice(-19),
      {
        timestamp: Date.now(),
        gasPrice: newGas,
        ethPrice: newEth,
      },
    ]);
  };

  const gasChange =
    data.length > 1
      ? ((data[data.length - 1].gasPrice - data[data.length - 2].gasPrice) /
          data[data.length - 2].gasPrice) *
        100
      : 0;

  const ethChange =
    data.length > 1
      ? ((data[data.length - 1].ethPrice - data[data.length - 2].ethPrice) /
          data[data.length - 2].ethPrice) *
        100
      : 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <DollarSign className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Pyth Oracle Feeds</h2>
            <p className="text-sm text-gray-400">Real-time Price Data</p>
          </div>
        </div>
        {pythContract && (
          <a
            href={`https://sepolia.etherscan.io/address/${pythAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 transition flex items-center space-x-1 text-xs"
          >
            <span>Contract</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Status Message */}
      {!pythContract ? (
        <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-sm text-yellow-300">
            ℹ️ Using simulated prices. Connect to see real Pyth data.
          </p>
        </div>
      ) : (
        <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-sm text-green-300">
            ✅ Connected to PythOracle contract.
          </p>
        </div>
      )}

      {/* Current Prices */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Gas Price */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg p-4 border border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Fuel className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-400">Gas Price</span>
            </div>
            <div
              className={`flex items-center space-x-1 text-xs ${
                gasChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {gasChange >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(gasChange).toFixed(2)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {currentGas.toFixed(1)}{" "}
            <span className="text-base text-gray-400">Gwei</span>
          </p>
        </div>

        {/* ETH Price */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">ETH/USD</span>
            </div>
            <div
              className={`flex items-center space-x-1 text-xs ${
                ethChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {ethChange >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(ethChange).toFixed(2)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            ${currentEth.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Gas Price Chart */}
      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Gas Price Trend (30min)
        </h3>
        {loading ? (
          <div className="h-[150px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data}>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(ts) =>
                  new Date(ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                domain={["dataMin - 5", "dataMax + 5"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
                labelFormatter={(ts) => new Date(ts).toLocaleTimeString()}
                formatter={(value: number) => [
                  `${value.toFixed(2)} Gwei`,
                  "Gas Price",
                ]}
              />
              <Line
                type="monotone"
                dataKey="gasPrice"
                stroke="#fb923c"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Oracle Status */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              pythContract ? "bg-green-500 animate-pulse" : "bg-yellow-500"
            }`}
          />
          <span className="text-gray-400">
            {pythContract ? "Oracle Active" : "Simulated Mode"}
          </span>
        </div>
        <span className="text-gray-500">Updated 5s ago</span>
      </div>
    </div>
  );
}
