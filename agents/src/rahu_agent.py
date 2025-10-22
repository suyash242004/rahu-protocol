"""
Rahu Protocol - Autonomous AI Agent
Built with uAgents framework for ASI Alliance prize track
"""

from uagents import Agent, Context, Model
import asyncio
from loguru import logger
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
from src.metta_reasoning import get_reasoning_engine

load_dotenv()

# Define message models
class NetworkMetrics(Model):
    """Network metrics data structure"""
    timestamp: int
    gas_price: float
    tps: int
    block_time: float
    congestion_level: float
    active_users: int

class OptimizationProposal(Model):
    """AI-generated optimization proposal"""
    proposal_id: str
    timestamp: int
    current_params: Dict[str, float]
    proposed_params: Dict[str, float]
    expected_improvement: float
    confidence_score: float
    reasoning: str
    zk_proof_hash: Optional[str] = None

class AgentStatus(Model):
    """Agent health status"""
    agent_address: str
    status: str
    last_check: int
    metrics_count: int
    proposals_count: int

class ChatMessage(Model):
    """Chat message for ASI:One protocol"""
    message: str
    sender: str
    timestamp: int

class ChatResponse(Model):
    """Chat response from agent"""
    response: str
    agent_address: str
    timestamp: int

class RahuAgent:
    
    def __init__(self):
        agent_name = os.getenv("AGENT_NAME", "rahu_optimizer_agent")
        agent_seed = os.getenv("AGENT_SEED", "rahu_default_seed_phrase")
        
        # Always use mailbox for now
        self.agent = Agent(
            name=agent_name,
            seed=agent_seed,
            port=8001,
            endpoint=["http://localhost:8001/submit"],
            mailbox=True  # Use mailbox instead of direct registration
        )
        
        self.monitoring_interval = int(os.getenv("MONITORING_INTERVAL", "30"))
        self.optimization_threshold = float(os.getenv("OPTIMIZATION_THRESHOLD", "0.15"))
        self.min_confidence = float(os.getenv("MIN_CONFIDENCE_SCORE", "0.75"))
        
        # Storage
        self.metrics_history: List[NetworkMetrics] = []
        self.proposals: List[OptimizationProposal] = []
        self.current_params = {
            "gas_limit": 30000000,
            "block_time": 2.0,
            "max_tps": 1000
        }
        
        logger.info(f"🌙 Rahu Agent initialized: {self.agent.address}")
        
    def setup_handlers(self):
        
        @self.agent.on_event("startup")
        async def startup(ctx: Context):
            logger.info(f"🚀 Rahu Agent starting up...")
            logger.info(f"📍 Agent address: {ctx.agent.address}")
            
            # Initialize storage
            ctx.storage.set("is_running", True)
            ctx.storage.set("metrics_count", 0)
            ctx.storage.set("proposals_count", 0)
            ctx.storage.set("start_time", 0)
            
            logger.success("✅ Agent startup complete - Ready to monitor!")
        
        @self.agent.on_interval(period=self.monitoring_interval)
        async def monitor_network(ctx: Context):
            if not ctx.storage.get("is_running"):
                return
                
            logger.info("🔍 Monitoring network metrics...")
            
            try:
                # Get metrics
                metrics = await self.fetch_network_metrics(ctx)
                
                # Store metrics
                self.metrics_history.append(metrics)
                count = (ctx.storage.get("metrics_count") or 0) + 1
                ctx.storage.set("metrics_count", count)
                
                logger.info(f"📊 Metrics #{count}: Gas={metrics.gas_price:.1f} Gwei, TPS={metrics.tps}, Congestion={metrics.congestion_level:.1%}")
                
                # Check if optimization needed
                should_opt = await self.should_optimize(metrics)
                if should_opt:
                    logger.warning("⚠️  Optimization needed!")
                    proposal = await self.generate_proposal(ctx, metrics)
                    
                    if proposal and proposal.confidence_score >= self.min_confidence:
                        self.proposals.append(proposal)
                        prop_count = (ctx.storage.get("proposals_count") or 0) + 1
                        ctx.storage.set("proposals_count", prop_count)
                        
                        logger.success(f"✨ Proposal #{prop_count} generated: {proposal.proposal_id}")
                        logger.info(f"   Expected improvement: {proposal.expected_improvement:.2%}")
                        logger.info(f"   Confidence: {proposal.confidence_score:.2%}")
                        logger.info(f"   Reasoning: {proposal.reasoning}")
                
            except Exception as e:
                logger.error(f"❌ Error in monitoring: {e}")
        
        @self.agent.on_message(model=OptimizationProposal)
        async def handle_proposal(ctx: Context, sender: str, msg: OptimizationProposal):
            logger.info(f"📨 Received proposal {msg.proposal_id} from {sender}")
            
            if msg.confidence_score >= self.min_confidence:
                logger.success(f"✅ Proposal validated with {msg.confidence_score:.2%} confidence")
            else:
                logger.warning(f"⚠️  Proposal confidence too low: {msg.confidence_score:.2%}")
        
        @self.agent.on_message(model=ChatMessage)
        async def handle_chat(ctx: Context, sender: str, msg: ChatMessage):
            logger.info(f"💬 Chat from {sender}: {msg.message}")
            
            response_text = await self.process_chat_message(msg.message)
            
            response = ChatResponse(
                response=response_text,
                agent_address=ctx.agent.address,
                timestamp=msg.timestamp
            )
            
            await ctx.send(sender, response)
            logger.info(f"💬 Sent response: {response_text[:50]}...")
    
    async def fetch_network_metrics(self, ctx: Context) -> NetworkMetrics:
        import time
        import random
        
        base_congestion = 0.5
        time_factor = (time.time() % 300) / 300
        
        metrics = NetworkMetrics(
            timestamp=int(time.time()),
            gas_price=random.uniform(30, 180),
            tps=random.randint(100, 900),
            block_time=random.uniform(1.8, 2.5),
            congestion_level=base_congestion + (time_factor * 0.4),
            active_users=random.randint(5000, 75000)
        )
        
        ctx.storage.set("last_check_timestamp", metrics.timestamp)
        return metrics
    
    async def should_optimize(self, metrics: NetworkMetrics) -> bool:
        triggers = []
        
        if metrics.congestion_level > 0.7:
            triggers.append(f"High congestion: {metrics.congestion_level:.1%}")
        
        if metrics.gas_price > 120:
            triggers.append(f"High gas: {metrics.gas_price:.1f} Gwei")
        
        if metrics.tps < 250:
            triggers.append(f"Low TPS: {metrics.tps}")
        
        if triggers:
            for trigger in triggers:
                logger.warning(f"   🔔 {trigger}")
            return True
        
        return False
    
async def generate_proposal(self, ctx: Context, metrics: NetworkMetrics) -> Optional[OptimizationProposal]:
    """Generate optimization proposal using MeTTa reasoning"""
    import time
    import hashlib
    
    # Use MeTTa reasoning engine
    reasoning_engine = get_reasoning_engine()
    
    metrics_dict = {
        'congestion_level': metrics.congestion_level,
        'gas_price': metrics.gas_price,
        'tps': metrics.tps,
        'block_time': metrics.block_time
    }
    
    history_length = len(self.metrics_history)
    
    # Get MeTTa reasoning
    try:
        proposed_params, reasoning_text, confidence = reasoning_engine.reason_about_optimization(
            metrics_dict,
            self.current_params,
            history_length
        )
        
        if confidence < self.min_confidence:
            logger.warning(f"⚠️  MeTTa confidence too low: {confidence:.2%} (need {self.min_confidence:.2%})")
            return None
        
        # Calculate expected improvement
        improvements = []
        for param in ["gas_limit", "block_time", "max_tps"]:
            if proposed_params[param] != self.current_params[param]:
                change = (proposed_params[param] - self.current_params[param]) / self.current_params[param]
                improvements.append(abs(change))
        
        expected_improvement = sum(improvements) / len(improvements) if improvements else 0
        
        proposal_id = hashlib.sha256(
            f"{metrics.timestamp}{proposed_params}".encode()
        ).hexdigest()[:16]
        
        logger.success(f"🧠 MeTTa reasoning complete: {confidence:.2%} confidence")
        
        return OptimizationProposal(
            proposal_id=proposal_id,
            timestamp=int(time.time()),
            current_params=self.current_params,
            proposed_params=proposed_params,
            expected_improvement=expected_improvement,
            confidence_score=confidence,
            reasoning=reasoning_text
        )
        
    except Exception as e:
        logger.error(f"❌ MeTTa reasoning failed: {e}")
        return None
    
    async def process_chat_message(self, message: str) -> str:
        message_lower = message.lower()
        
        if "status" in message_lower or "health" in message_lower:
            return f"Active. Monitored {len(self.metrics_history)} metrics, {len(self.proposals)} proposals."
        elif "proposal" in message_lower:
            if self.proposals:
                latest = self.proposals[-1]
                return f"Latest: {latest.reasoning} (Confidence: {latest.confidence_score:.2%})"
            return "No proposals yet."
        elif "metrics" in message_lower:
            if self.metrics_history:
                latest = self.metrics_history[-1]
                return f"Gas={latest.gas_price:.1f} Gwei, TPS={latest.tps}, Congestion={latest.congestion_level:.1%}"
            return "No metrics yet."
        else:
            return "Ask about: status, proposals, or metrics"
    
    def run(self):
        self.setup_handlers()
        
        logger.info("=" * 60)
        logger.info("🏃 Starting Rahu Agent...")
        logger.info(f"📍 Agent address: {self.agent.address}")
        logger.info(f"⏱️  Monitoring interval: {self.monitoring_interval}s")
        logger.info("=" * 60)
        
        self.agent.run()

if __name__ == "__main__":
    agent = RahuAgent()
    agent.run()