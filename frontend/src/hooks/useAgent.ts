import { useState, useEffect } from "react";
import { getAgentStatus, AgentStatus } from "../utils/api";

export function useAgent() {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getAgentStatus();
        setStatus(data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch agent status"
        );
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Every 30s

    return () => clearInterval(interval);
  }, []);

  return { status, loading, error };
}
