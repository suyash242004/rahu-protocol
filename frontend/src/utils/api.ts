import axios from "axios";

const AGENT_API_URL =
  import.meta.env.VITE_AGENT_API_URL || "http://localhost:8001";

export interface AgentStatus {
  agent_address: string;
  status: string;
  last_check: number;
  metrics_count: number;
  proposals_count: number;
}

export interface NetworkMetrics {
  timestamp: number;
  gas_price: number;
  tps: number;
  block_time: number;
  congestion_level: number;
  active_users: number;
}

// Get agent status
export const getAgentStatus = async (): Promise<AgentStatus> => {
  try {
    const response = await axios.get(`${AGENT_API_URL}/status`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch agent status:", error);
    throw error;
  }
};

// Get latest metrics
export const getLatestMetrics = async (): Promise<NetworkMetrics> => {
  try {
    const response = await axios.get(`${AGENT_API_URL}/metrics/latest`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    throw error;
  }
};

// Send chat message to agent
export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(`${AGENT_API_URL}/chat`, {
      message,
      sender: "user",
      timestamp: Date.now(),
    });
    return response.data.response;
  } catch (error) {
    console.error("Failed to send chat message:", error);
    throw error;
  }
};
