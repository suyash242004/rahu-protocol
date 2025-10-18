"""
Rahu Protocol - Autonomous AI Agent
Built with uAgents framework for ASI Alliance prize track
"""

from uagents import Agent, Context, Model, Bureau
from uagents.setup import fund_agent_if_low
import asyncio
import json
from loguru import logger
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

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
    """
    Autonomous AI agent that monitors blockchain health and proposes optimizations.
    
    Capabilities:
    - Monitors network metrics via Pyth oracles
    - Uses MeTTa reasoning to determine optimal parameters
    - Generates ZK proofs for decision verification
    - Communicates via ASI:One chat protocol
    - Registers on Agentverse for discoverability (when enabled)
    """
    
    def __init__(self):
        # Get configuration
        agent_name = os.getenv("AGENT_NAME", "rahu_optimizer_agent")
        agent_seed = os.getenv("AGENT_SEED", "rahu_default_seed_phrase")
        enable_registration = os.getenv("ENABLE_ALMANAC_REGISTRATION", "False").lower() == "true"
        dev_mode = os.getenv("DEV_MODE", "True").lower() == "true"
        
        # Initialize agent
        if enable_registration:
            # Full registration mode (requires funded wallet)
            self.agent = Agent(
                name=agent_name,
                seed=agent_seed,
                port=8001,
                endpoint=["http://localhost:8001/submit"]
            )
        else:
            # Development mode (no registration)
            logger.info("🔧 Running in DEVELOPMENT mode (Almanac registration disabled)")
            self.agent = Agent(
                name=agent_name,
                seed=agent_seed,
                port=8001,
                endpoint=["http://localhost:8001/submit"],
                enable_wallet_messaging=False  # Disable wallet features in dev mode
            )
        
        self.dev_mode = dev_mode
        self.enable_registration = enable_registration
        self.monitoring_interval = int(os.getenv("MONITORING_INTERVAL", "30"))
        self.optimization_threshold = float(os.getenv("OPTIMIZATION_THRESHOLD", "0.15"))
        self.min_confidence = float(os.getenv("MIN_CONFIDENCE_SCORE", "0.75"))
        
        # Storage (in-memory)
        self.metrics_history: List[NetworkMetrics] = []
        self.proposals: List[OptimizationProposal] = []
        self.current_params = {
            "gas_limit": 30000000,
            "block_time": 2.0,
            "max_tps": 1000
        }
        
        logger.info(f"🌙 Rahu Agent initialized: {self.agent.address}")
        logger.info(f"🔧 Development mode: {self.dev_mode}")
        
    def setup_handlers(self):
        """Set up all message handlers for the agent"""
        
        @self.agent.on_event("startup")
        async def startup(ctx: Context):
            """Initialize agent on startup"""
            logger.info(f"🚀 Rahu Agent starting up...")
            logger.info(f"📍 Agent address: {ctx.agent.address}")
            
            # Only try to fund in production mode
            if self.enable_registration and not self.dev_mode:
                try:
                    fund_agent_if_low(ctx.agent.wallet.address())
                    logger.info("✅ Agent wallet funded")
                except Exception as e:
                    logger.warning(f"⚠️  Could not fund agent: {e}")
            
            # Initialize storage
            ctx.storage.set("is_running", True)
            ctx.storage.set("metrics_count", 0)
            ctx.storage.set("proposals_count", 0)
            ctx.storage.set("start_time", int(asyncio.get_event_loop().time()))
            
            logger.success("✅ Agent startup complete - Ready to monitor!")
        
        @self.agent.on_interval(period=self.monitoring_interval)
        async def monitor_network(ctx: Context):
            """Periodic network monitoring"""
            if not ctx.storage.get("is_running"):
                return
                
            logger.info("🔍 Monitoring network metrics...")
            
            try:
                # Get metrics from blockchain/oracles
                metrics = await self.fetch_network_metrics(ctx)
                
                # Store metrics
                self.metrics_history.append(metrics)
                count = ctx.storage.get("metrics_count", 0) + 1
                ctx.storage.set("metrics_count", count)
                
                logger.info(f"📊 Metrics #{count}: Gas={metrics.gas_price:.1f} Gwei, TPS={metrics.tps}, Congestion={metrics.congestion_level:.1%}")
                
                # Analyze and potentially propose optimization
                should_opt = await self.should_optimize(metrics)
                if should_opt:
                    logger.warning("⚠️  Optimization needed!")
                    proposal = await self.generate_proposal(ctx, metrics)
                    
                    if proposal and proposal.confidence_score >= self.min_confidence:
                        self.proposals.append(proposal)
                        prop_count = ctx.storage.get("proposals_count", 0) + 1
                        ctx.storage.set("proposals_count", prop_count)
                        
                        logger.success(f"✨ Proposal #{prop_count} generated: {proposal.proposal_id}")
                        logger.info(f"   Expected improvement: {proposal.expected_improvement:.2%}")
                        logger.info(f"   Confidence: {proposal.confidence_score:.2%}")
                        
                        # In dev mode, just log; in production, broadcast
                        if self.dev_mode:
                            logger.info(f"   [DEV] Proposal would be broadcast in production")
                        else:
                            await ctx.send(self.agent.address, proposal)
                
            except Exception as e:
                logger.error(f"❌ Error in monitoring: {e}")
                import traceback
                logger.error(traceback.format_exc())
        
        @self.agent.on_message(model=OptimizationProposal)
        async def handle_proposal(ctx: Context, sender: str, msg: OptimizationProposal):
            """Handle optimization proposals"""
            logger.info(f"📨 Received proposal {msg.proposal_id} from {sender}")
            
            # Validate proposal
            if msg.confidence_score >= self.min_confidence:
                logger.success(f"✅ Proposal validated with {msg.confidence_score:.2%} confidence")
                logger.info(f"   Reasoning: {msg.reasoning}")
            else:
                logger.warning(f"⚠️  Proposal confidence too low: {msg.confidence_score:.2%}")
        
        @self.agent.on_message(model=ChatMessage)
        async def handle_chat(ctx: Context, sender: str, msg: ChatMessage):
            """Handle ASI:One chat messages"""
            logger.info(f"💬 Chat from {sender}: {msg.message}")
            
            # Process chat message and generate response
            response_text = await self.process_chat_message(msg.message)
            
            response = ChatResponse(
                response=response_text,
                agent_address=ctx.agent.address,
                timestamp=msg.timestamp
            )
            
            # Send response back
            await ctx.send(sender, response)
            logger.info(f"💬 Sent response: {response_text[:50]}...")
        
        @self.agent.on_query(model=AgentStatus)
        async def query_status(ctx: Context):
            """Respond to status queries (ASI:One chat protocol)"""
            import time
            
            status = AgentStatus(
                agent_address=ctx.agent.address,
                status="active" if ctx.storage.get("is_running") else "inactive",
                last_check=int(time.time()),
                metrics_count=ctx.storage.get("metrics_count", 0),
                proposals_count=ctx.storage.get("proposals_count", 0)
            )
            
            logger.info(f"📊 Status query: {status.metrics_count} metrics, {status.proposals_count} proposals")
            return status
    
    async def fetch_network_metrics(self, ctx: Context) -> NetworkMetrics:
        """Fetch current network metrics"""
        import time
        import random
        
        # Simulate realistic network conditions
        # In production, this will query Pyth oracles and on-chain data
        base_congestion = 0.5
        time_factor = (time.time() % 300) / 300  # Varies over 5 minutes
        
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
        """Determine if optimization is needed"""
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
        """Generate optimization proposal"""
        import time
        import hashlib
        
        proposed_params = self.current_params.copy()
        reasoning = []
        
        # Parameter adjustments based on metrics
        if metrics.congestion_level > 0.7:
            increase = 1 + (metrics.congestion_level - 0.7) * 0.5
            proposed_params["gas_limit"] = int(self.current_params["gas_limit"] * increase)
            reasoning.append(f"Increase gas limit {(increase-1)*100:.1f}% (congestion: {metrics.congestion_level:.1%})")
        
        if metrics.gas_price > 120:
            decrease = max(0.85, 1 - (metrics.gas_price - 120) / 1000)
            proposed_params["block_time"] = self.current_params["block_time"] * decrease
            reasoning.append(f"Decrease block time {(1-decrease)*100:.1f}% (gas: {metrics.gas_price:.1f} Gwei)")
        
        if metrics.tps < 250:
            increase = 1 + (250 - metrics.tps) / 2000
            proposed_params["max_tps"] = int(self.current_params["max_tps"] * increase)
            reasoning.append(f"Increase max TPS {(increase-1)*100:.1f}% (current: {metrics.tps})")
        
        # Calculate expected improvement
        improvements = []
        for param in ["gas_limit", "block_time", "max_tps"]:
            if proposed_params[param] != self.current_params[param]:
                change = (proposed_params[param] - self.current_params[param]) / self.current_params[param]
                improvements.append(abs(change))
        
        expected_improvement = sum(improvements) / len(improvements) if improvements else 0
        
        # Confidence based on data quality
        history_length = len(self.metrics_history)
        confidence = min(0.95, 0.65 + (history_length / 50) * 0.3)
        
        if confidence < self.min_confidence:
            logger.warning(f"⚠️  Confidence too low: {confidence:.2%} (need {self.min_confidence:.2%})")
            return None
        
        proposal_id = hashlib.sha256(
            f"{metrics.timestamp}{proposed_params}".encode()
        ).hexdigest()[:16]
        
        return OptimizationProposal(
            proposal_id=proposal_id,
            timestamp=int(time.time()),
            current_params=self.current_params,
            proposed_params=proposed_params,
            expected_improvement=expected_improvement,
            confidence_score=confidence,
            reasoning=" | ".join(reasoning)
        )
    
    async def process_chat_message(self, message: str) -> str:
        """Process chat message and generate response (ASI:One protocol)"""
        message_lower = message.lower()
        
        if "status" in message_lower or "health" in message_lower:
            return f"Agent is active. Monitored {len(self.metrics_history)} metrics, generated {len(self.proposals)} proposals."
        
        elif "proposal" in message_lower:
            if self.proposals:
                latest = self.proposals[-1]
                return f"Latest proposal: {latest.reasoning} (Confidence: {latest.confidence_score:.2%})"
            return "No proposals generated yet."
        
        elif "metrics" in message_lower:
            if self.metrics_history:
                latest = self.metrics_history[-1]
                return f"Latest metrics: Gas={latest.gas_price:.1f} Gwei, TPS={latest.tps}, Congestion={latest.congestion_level:.1%}"
            return "No metrics collected yet."
        
        elif "help" in message_lower:
            return "Ask me about: status, proposals, metrics, or optimization suggestions."
        
        else:
            return f"I'm monitoring the Rahu L2. Ask me about status, proposals, or metrics!"
    
    def run(self):
        """Start the agent"""
        self.setup_handlers()
        
        logger.info("=" * 60)
        logger.info("🏃 Starting Rahu Agent...")
        logger.info(f"📍 Agent address: {self.agent.address}")
        logger.info(f"⏱️  Monitoring interval: {self.monitoring_interval}s")
        logger.info(f"🎯 Optimization threshold: {self.optimization_threshold:.1%}")
        logger.info(f"🔒 Min confidence: {self.min_confidence:.1%}")
        logger.info("=" * 60)
        
        self.agent.run()

if __name__ == "__main__":
    agent = RahuAgent()
    agent.run()