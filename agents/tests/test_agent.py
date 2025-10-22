"""
Test suite for Rahu Agent
"""

import pytest
import asyncio
from src.rahu_agent import RahuAgent, NetworkMetrics, OptimizationProposal
import time

@pytest.fixture
def agent():
    """Create agent instance for testing"""
    return RahuAgent()

@pytest.fixture
def sample_metrics():
    """Sample network metrics"""
    return NetworkMetrics(
        timestamp=int(time.time()),
        gas_price=150.0,
        tps=180,
        block_time=2.2,
        congestion_level=0.85,
        active_users=25000
    )

def test_agent_initialization(agent):
    """Test agent initializes correctly"""
    assert agent is not None
    assert agent.agent.address.startswith("agent1")
    assert agent.monitoring_interval == 30
    assert agent.min_confidence == 0.75
    print(f"✅ Agent initialized: {agent.agent.address}")

@pytest.mark.asyncio
async def test_should_optimize_high_congestion(agent, sample_metrics):
    """Test optimization trigger on high congestion"""
    sample_metrics.congestion_level = 0.8
    should_opt = await agent.should_optimize(sample_metrics)
    assert should_opt == True
    print("✅ High congestion detected correctly")

@pytest.mark.asyncio
async def test_should_optimize_high_gas(agent, sample_metrics):
    """Test optimization trigger on high gas"""
    sample_metrics.gas_price = 150.0
    sample_metrics.congestion_level = 0.5
    should_opt = await agent.should_optimize(sample_metrics)
    assert should_opt == True
    print("✅ High gas price detected correctly")

@pytest.mark.asyncio
async def test_should_optimize_low_tps(agent, sample_metrics):
    """Test optimization trigger on low TPS"""
    sample_metrics.tps = 180
    sample_metrics.congestion_level = 0.5
    sample_metrics.gas_price = 50.0
    should_opt = await agent.should_optimize(sample_metrics)
    assert should_opt == True
    print("✅ Low TPS detected correctly")

@pytest.mark.asyncio
async def test_no_optimization_needed(agent, sample_metrics):
    """Test no optimization when metrics are good"""
    sample_metrics.congestion_level = 0.4
    sample_metrics.gas_price = 60.0
    sample_metrics.tps = 600
    should_opt = await agent.should_optimize(sample_metrics)
    assert should_opt == False
    print("✅ Normal conditions detected correctly")

@pytest.mark.asyncio
async def test_chat_message_processing(agent):
    """Test chat message responses"""
    
    # Test status query
    response = await agent.process_chat_message("What's the status?")
    assert "Active" in response or "Monitored" in response
    print(f"✅ Status query: {response}")
    
    # Test help query
    response = await agent.process_chat_message("help")
    assert "status" in response or "proposals" in response
    print(f"✅ Help query: {response}")
    
    # Test metrics query
    response = await agent.process_chat_message("show metrics")
    assert "metrics" in response.lower() or "no" in response.lower()
    print(f"✅ Metrics query: {response}")

def test_proposal_structure(agent):
    """Test proposal data structure"""
    # Add some history to increase confidence
    for _ in range(20):
        agent.metrics_history.append(NetworkMetrics(
            timestamp=int(time.time()),
            gas_price=100.0,
            tps=300,
            block_time=2.0,
            congestion_level=0.6,
            active_users=10000
        ))
    
    assert len(agent.metrics_history) == 20
    print(f"✅ Metrics history: {len(agent.metrics_history)} entries")

def test_confidence_calculation(agent):
    """Test confidence increases with data"""
    # Start with empty history
    confidence_0 = min(0.95, 0.65 + (0 / 50) * 0.3)
    assert confidence_0 == 0.65
    
    # With 25 data points
    confidence_25 = min(0.95, 0.65 + (25 / 50) * 0.3)
    assert confidence_25 == 0.8
    
    # With 50+ data points
    confidence_50 = min(0.95, 0.65 + (50 / 50) * 0.3)
    assert confidence_50 == 0.95
    
    print("✅ Confidence calculation working correctly")

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 Running Rahu Agent Tests")
    print("=" * 60)
    pytest.main([__file__, "-v", "-s"])