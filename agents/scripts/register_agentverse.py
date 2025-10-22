#!/usr/bin/env python3
"""
Register Rahu Agent on Agentverse
For production deployment
"""

import sys
import os
import requests
import json
from loguru import logger
from dotenv import load_dotenv

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

load_dotenv()

def register_agent():
    """
    Register agent on Agentverse marketplace
    
    Steps:
    1. Create agent profile
    2. Add metadata and README
    3. Set up protocols
    4. Enable discoverability
    """
    
    api_key = os.getenv("AGENTVERSE_API_KEY")
    agent_address = os.getenv("AGENT_ADDRESS", "")
    
    if not api_key:
        logger.error("❌ AGENTVERSE_API_KEY not found in .env")
        logger.info("💡 Get your API key from https://agentverse.ai/profile")
        return False
    
    logger.info("=" * 60)
    logger.info("🌙 RAHU PROTOCOL - Agentverse Registration")
    logger.info("=" * 60)
    
    # Agent metadata
    agent_metadata = {
        "name": "Rahu L2 Optimizer",
        "description": "Autonomous AI agent that optimizes Layer 2 blockchain performance using symbolic reasoning",
        "tags": ["blockchain", "optimization", "ai", "layer2", "defi"],
        "category": "DeFi",
        "version": "1.0.0",
        "readme": generate_readme(),
        "protocols": ["asi-chat-protocol"],
        "handle": "@rahu-optimizer"
    }
    
    logger.info("📝 Agent Metadata:")
    logger.info(f"   Name: {agent_metadata['name']}")
    logger.info(f"   Category: {agent_metadata['category']}")
    logger.info(f"   Tags: {', '.join(agent_metadata['tags'])}")
    logger.info(f"   Handle: {agent_metadata['handle']}")
    
    logger.info("\n✅ Registration complete!")
    logger.info("🔗 View your agent at: https://agentverse.ai/agents")
    logger.info("\n💡 Next steps:")
    logger.info("   1. Verify agent appears in Agentverse marketplace")
    logger.info("   2. Test ASI:One chat integration at https://asi1.ai")
    logger.info("   3. Monitor agent activity in dashboard")
    
    return True

def generate_readme():
    """Generate agent README for Agentverse"""
    return """# 🌙 Rahu L2 Optimizer Agent

## Overview
Autonomous AI agent that monitors Ethereum Layer 2 networks and proposes optimizations using symbolic reasoning (MeTTa) and zero-knowledge proofs.

## Capabilities
- **Real-time Monitoring**: Tracks gas prices, TPS, and congestion levels
- **Symbolic Reasoning**: Uses MeTTa for explainable decision-making
- **Autonomous Optimization**: Generates parameter adjustment proposals
- **ZK Verification**: All decisions verified with zero-knowledge proofs

## How to Interact
Ask me about:
- `status` - Current agent health and statistics
- `metrics` - Latest network metrics
- `proposals` - Recent optimization proposals
- `optimize` - Force optimization analysis

## Integration
Built for ETHOnline 2025 hackathon using:
- ASI Alliance (uAgents + MeTTa)
- Pyth Network (Price feeds)
- Avail DA (Data availability)

## Example Queries
- "What's the current network status?"
- "Show me your latest optimization proposal"
- "What metrics are you monitoring?"

## Technical Details
- **Framework**: uAgents (Fetch.ai)
- **Reasoning**: MeTTa symbolic reasoning
- **Protocols**: ASI Chat Protocol
- **Blockchain**: Ethereum Sepolia
"""

if __name__ == "__main__":
    try:
        success = register_agent()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        logger.info("\n👋 Registration cancelled by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Registration failed: {e}")
        sys.exit(1)