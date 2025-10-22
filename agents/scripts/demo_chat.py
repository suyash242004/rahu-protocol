#!/usr/bin/env python3
"""
Demo script to test ASI:One chat protocol locally
"""

import sys
import os
import asyncio
from loguru import logger

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.rahu_agent import ChatMessage, ChatResponse
import time

async def demo_chat_interaction():
    """
    Demonstrate ASI:One chat protocol
    """
    logger.info("=" * 60)
    logger.info("💬 ASI:One Chat Protocol Demo")
    logger.info("=" * 60)
    
    # Simulate chat messages
    test_messages = [
        "What's your current status?",
        "Show me the latest metrics",
        "Do you have any optimization proposals?",
        "Help me understand what you do",
        "Tell me about your capabilities"
    ]
    
    from src.rahu_agent import RahuAgent
    agent = RahuAgent()
    
    logger.info(f"\n📍 Agent Address: {agent.agent.address}\n")
    
    for i, message in enumerate(test_messages, 1):
        logger.info(f"\n{'='*60}")
        logger.info(f"💬 Message #{i}: {message}")
        logger.info(f"{'='*60}")
        
        # Process message
        response = await agent.process_chat_message(message)
        
        logger.success(f"🤖 Response: {response}")
        
        await asyncio.sleep(1)
    
    logger.info("\n" + "=" * 60)
    logger.info("✅ Chat Demo Complete!")
    logger.info("=" * 60)
    
    logger.info("\n💡 Next Steps:")
    logger.info("   1. Deploy agent to Agentverse")
    logger.info("   2. Test in ASI:One chat at https://asi1.ai")
    logger.info("   3. Use handle @rahu-optimizer to find the agent")

if __name__ == "__main__":
    asyncio.run(demo_chat_interaction())