import { useState, useEffect } from "react";
import { Database, CheckCircle, Clock, ExternalLink } from "lucide-react";

interface BlockSubmission {
  blockNumber: number;
  dataHash: string;
  availTxHash: string;
  timestamp: number;
  verified: boolean;
}

export default function AvailStatus() {
  const [submissions, setSubmissions] = useState<BlockSubmission[]>([]);
  const [stats, setStats] = useState({
    totalBlocks: 0,
    dataPosted: "0 MB",
    avgTime: "2.3s",
  });

  useEffect(() => {
    // Initialize with mock data
    const mockSubmissions: BlockSubmission[] = [
      {
        blockNumber: 12345,
        dataHash: "0x1234...5678",
        availTxHash: "0xabcd...efgh",
        timestamp: Date.now() - 120000,
        verified: true,
      },
      {
        blockNumber: 12346,
        dataHash: "0x2345...6789",
        availTxHash: "0xbcde...fghi",
        timestamp: Date.now() - 60000,
        verified: true,
      },
      {
        blockNumber: 12347,
        dataHash: "0x3456...7890",
        availTxHash: "0xcdef...ghij",
        timestamp: Date.now() - 30000,
        verified: false,
      },
    ];
    setSubmissions(mockSubmissions);

    setStats({
      totalBlocks: 247,
      dataPosted: "1.2 GB",
      avgTime: "2.3s",
    });

    // Simulate new submissions
    const interval = setInterval(() => {
      const newBlock: BlockSubmission = {
        blockNumber: 12347 + Math.floor(Math.random() * 10),
        dataHash: `0x${Math.random()
          .toString(16)
          .slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        availTxHash: `0x${Math.random()
          .toString(16)
          .slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        timestamp: Date.now(),
        verified: false,
      };

      setSubmissions((prev) => [newBlock, ...prev.slice(0, 4)]);
      setStats((prev) => ({
        ...prev,
        totalBlocks: prev.totalBlocks + 1,
      }));

      // Verify after 10 seconds
      setTimeout(() => {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.blockNumber === newBlock.blockNumber
              ? { ...sub, verified: true }
              : sub
          )
        );
      }, 10000);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Database className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Avail DA Layer</h2>
          <p className="text-sm text-gray-400">Data Availability</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Total Blocks</p>
          <p className="text-xl font-bold text-white">{stats.totalBlocks}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Data Posted</p>
          <p className="text-xl font-bold text-white">{stats.dataPosted}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Avg Time</p>
          <p className="text-xl font-bold text-white">{stats.avgTime}</p>
        </div>
      </div>

      {/* Recent Submissions */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Recent Submissions
        </h3>
        <div className="space-y-2">
          {submissions.map((sub, index) => (
            <div
              key={index}
              className="bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">
                    Block #{sub.blockNumber}
                  </span>
                  {sub.verified ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(sub.timestamp)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <p className="text-gray-400">
                    Data:{" "}
                    <span className="text-gray-300 font-mono">
                      {sub.dataHash}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    Avail:{" "}
                    <span className="text-gray-300 font-mono">
                      {sub.availTxHash}
                    </span>
                  </p>
                </div>
                <a
                  href={`https://goldberg.avail.tools/block/${sub.blockNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-400">Connected to Goldberg Testnet</span>
          </div>
          <a
            href="https://goldberg.avail.tools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition flex items-center space-x-1"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
