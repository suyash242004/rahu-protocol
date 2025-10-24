#!/usr/bin/env python3
"""
Start the Rahu Agent with HTTP API
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.rahu_agent import RahuAgent

def main():
    """Start the Rahu Protocol agent"""
    print("=" * 60)
    print("🌙 RAHU PROTOCOL - Autonomous AI Agent")
    print("=" * 60)
    print("")
    print("Starting agent with ASI Alliance integration...")
    print("HTTP API will be available at: http://localhost:8001")
    print("")
    print("API Endpoints:")
    print("  GET  /health           - Agent health check")
    print("  GET  /status           - Agent status and metrics")
    print("  POST /chat             - Chat with agent")
    print("  GET  /proposals/latest - Get latest proposal")
    print("")
    
    try:
        agent = RahuAgent()
        agent.run()
    except KeyboardInterrupt:
        print("\n👋 Agent stopped by user")
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()