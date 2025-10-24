import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "agent";
  content: string;
  timestamp: number;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "agent",
      content:
        "Hello! I'm the Rahu AI Agent. Ask me about network status, proposals, or metrics!",
      timestamp: Date.now() - 60000,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // NEW: Agent connection status
  const [agentConnected, setAgentConnected] = useState(false);
  const agentApiUrl =
    import.meta.env.VITE_AGENT_API_URL || "http://localhost:8001";

  // NEW: Check agent connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${agentApiUrl}/health`, {
          signal: AbortSignal.timeout(2000),
        });
        setAgentConnected(response.ok);
      } catch {
        setAgentConnected(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [agentApiUrl]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Try real agent first, fallback to simulation
    try {
      if (agentConnected) {
        const response = await fetch(`${agentApiUrl}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.content,
            sender: "user",
            timestamp: userMessage.timestamp,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json();
          const agentMessage: Message = {
            id: messages.length + 2,
            sender: "agent",
            content:
              data.response || data.message || "I received your message!",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, agentMessage]);
          setIsTyping(false);
          return;
        }
      }
    } catch (error) {
      console.warn("Agent not responding, using simulated response");
    }

    // Fallback: Simulate agent response
    setTimeout(() => {
      const responses = [
        "Current network status: 847 TPS, 45 Gwei gas price. All systems operating normally.",
        "I've collected 15 metrics so far. Latest shows congestion at 72%, triggering optimization proposal.",
        "My latest proposal: Increase gas limit by 15% to improve throughput. Confidence: 78.5%",
        "Data has been posted to Avail DA layer. 247 blocks verified so far.",
        "ZK proof verification complete. Proposal #2 is ready for execution.",
      ];

      const agentMessage: Message = {
        id: messages.length + 2,
        sender: "agent",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "What's the current status?",
    "Show latest metrics",
    "Any optimization proposals?",
    "Explain your reasoning",
  ];

  return (
    <div className="card">
      {/* UPDATED: Header with connection status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <MessageCircle className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              ASI:One Chat Protocol
            </h2>
            <p className="text-sm text-gray-400">Talk to the AI Agent</p>
          </div>
        </div>
        {/* NEW: Connection indicator */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              agentConnected ? "bg-green-500 animate-pulse" : "bg-yellow-500"
            }`}
          />
          <span className="text-xs text-gray-400">
            {agentConnected ? "Agent Online" : "Simulated"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white/5 rounded-lg p-4 mb-4 h-80 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex space-x-2 max-w-[80%] ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user"
                      ? "bg-blue-500/20"
                      : "bg-purple-500/20"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple-400" />
                  )}
                </div>
                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-500/20 border border-blue-500/30"
                        : "bg-purple-500/20 border border-purple-500/30"
                    }`}
                  >
                    <p className="text-sm text-white">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-400" />
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => setInput(question)}
            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask the AI agent anything..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
