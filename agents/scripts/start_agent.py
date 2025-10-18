#!/usr/bin/env python3
"""
Start the Rahu Agent
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.rahu_agent import RahuAgent
from loguru import logger

def main():
    """Start the Rahu Protocol agent"""
    logger.info("=" * 60)
    logger.info("🌙 RAHU PROTOCOL - Autonomous AI Agent")
    logger.info("=" * 60)
    logger.info("")
    logger.info("Starting agent with ASI Alliance integration...")
    logger.info("")
    
    try:
        agent = RahuAgent()
        agent.run()
    except KeyboardInterrupt:
        logger.info("\n👋 Agent stopped by user")
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()