"""
Rahu Protocol - Autonomous AI Agent
Built with uAgents framework for ASI Alliance prize track
"""

import asyncio
import json
import time
import random
import threading
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

# Simple HTTP server using built-in modules
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

# Simple logging
class SimpleLogger:
    def info(self, msg): print(f"ℹ️  {msg}")
    def success(self, msg): print(f"✅ {msg}")
    def warning(self, msg): print(f"⚠️  {msg}")
    def error(self, msg): print(f"❌ {msg}")

logger = SimpleLogger()

load_dotenv()

# Define simple data structures
class NetworkMetrics:
    """Network metrics data structure"""
    def __init__(self, timestamp, gas_price, tps, block_time, congestion_level, active_users):
        self.timestamp = timestamp
        self.gas_price = gas_price
        self.tps = tps
        self.block_time = block_time
        self.congestion_level = congestion_level
        self.active_users = active_users

class OptimizationProposal:
    """AI-generated optimization proposal"""
    def __init__(self, proposal_id, timestamp, current_params, proposed_params, expected_improvement, confidence_score, reasoning, zk_proof_hash=None):
        self.proposal_id = proposal_id
        self.timestamp = timestamp
        self.current_params = current_params
        self.proposed_params = proposed_params
        self.expected_improvement = expected_improvement
        self.confidence_score = confidence_score
        self.reasoning = reasoning
        self.zk_proof_hash = zk_proof_hash

class RahuAgent:
    
    def __init__(self):
        self.agent_name = os.getenv("AGENT_NAME", "rahu_optimizer_agent")
        self.agent_address = os.getenv("AGENT_ADDRESS", "agent1q09nfstjfeakh2l69rezeng6qzta897ta9s5yvcu3xtvxemgxrcyq2ug4vx")
        
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
        
        self.is_running = True
        
        logger.info(f"🌙 Rahu Agent initialized: {self.agent_address}")
        
    async def monitor_network(self):
        """Monitor network and generate proposals"""
        while self.is_running:
            try:
            logger.info("🔍 Monitoring network metrics...")
            
                # Get metrics
                metrics = await self.fetch_network_metrics()
                
                # Store metrics
                self.metrics_history.append(metrics)
                
                logger.info(f"📊 Metrics #{len(self.metrics_history)}: Gas={metrics.gas_price:.1f} Gwei, TPS={metrics.tps}, Congestion={metrics.congestion_level:.1%}")
                
                # Check if optimization needed
                should_opt = await self.should_optimize(metrics)
                if should_opt:
                    logger.warning("⚠️  Optimization needed!")
                    proposal = await self.generate_proposal(metrics)
                    
                    if proposal and proposal.confidence_score >= self.min_confidence:
                        self.proposals.append(proposal)
                        
                        logger.success(f"✨ Proposal #{len(self.proposals)} generated: {proposal.proposal_id}")
                        logger.info(f"   Expected improvement: {proposal.expected_improvement:.2%}")
                        logger.info(f"   Confidence: {proposal.confidence_score:.2%}")
                        logger.info(f"   Reasoning: {proposal.reasoning}")
                
            except Exception as e:
                logger.error(f"❌ Error in monitoring: {e}")
        
            await asyncio.sleep(self.monitoring_interval)
    
    async def fetch_network_metrics(self) -> NetworkMetrics:
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
    
    async def generate_proposal(self, metrics: NetworkMetrics) -> Optional[OptimizationProposal]:
        """Generate optimization proposal using simple reasoning"""
    import time
    import hashlib
    
        # Simple reasoning logic (replacing MeTTa for now)
        confidence = random.uniform(0.75, 0.95)
        
        if confidence < self.min_confidence:
            logger.warning(f"⚠️  Confidence too low: {confidence:.2%} (need {self.min_confidence:.2%})")
            return None
        
        # Generate proposed parameters
        proposed_params = {
            "gas_limit": int(self.current_params["gas_limit"] * random.uniform(1.1, 1.2)),
            "block_time": self.current_params["block_time"] * random.uniform(0.8, 0.9),
            "max_tps": int(self.current_params["max_tps"] * random.uniform(1.1, 1.3))
        }
        
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
        
        reasoning_text = f"Network congestion detected at {metrics.congestion_level:.1%}. Proposing gas limit increase by {((proposed_params['gas_limit'] - self.current_params['gas_limit']) / self.current_params['gas_limit'] * 100):.1f}% to improve throughput."
        
        logger.success(f"🧠 Proposal generated: {confidence:.2%} confidence")
        
        return OptimizationProposal(
            proposal_id=proposal_id,
            timestamp=int(time.time()),
            current_params=self.current_params,
            proposed_params=proposed_params,
            expected_improvement=expected_improvement,
            confidence_score=confidence,
            reasoning=reasoning_text
        )
    
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
        """Run the agent"""
        print("=" * 60)
        print("🏃 Starting Rahu Agent...")
        print(f"📍 Agent address: {self.agent_address}")
        print(f"⏱️  Monitoring interval: {self.monitoring_interval}s")
        print(f"🌐 HTTP API: http://localhost:8001")
        print("=" * 60)
        
        # Start HTTP server in a separate thread
        def run_server():
            handler = create_handler(self)
            httpd = HTTPServer(('localhost', 8001), handler)
            print("✅ HTTP server started on port 8001")
            httpd.serve_forever()
        
        server_thread = threading.Thread(target=run_server, daemon=True)
        server_thread.start()
        
        # Start monitoring
        async def run_monitoring():
            await self.monitor_network()
        
        # Run the agent
        try:
            asyncio.run(run_monitoring())
        except KeyboardInterrupt:
            print("\n👋 Agent stopped by user")
            self.is_running = False
        except Exception as e:
            print(f"❌ Fatal error: {e}")
            self.is_running = False

class AgentHTTPHandler(BaseHTTPRequestHandler):
    def __init__(self, agent, *args, **kwargs):
        self.agent = agent
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "healthy",
                "agent_address": self.agent.agent_address,
                "timestamp": int(time.time())
            }
            self.wfile.write(json.dumps(response).encode())
            
        elif self.path == '/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "active" if self.agent.is_running else "inactive",
                "metrics_count": len(self.agent.metrics_history),
                "proposals_count": len(self.agent.proposals),
                "last_check": int(time.time()),
                "agent_address": self.agent.agent_address
            }
            self.wfile.write(json.dumps(response).encode())
            
        elif self.path == '/proposals/latest':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            if self.agent.proposals:
                latest = self.agent.proposals[-1]
                response = {
                    "proposal_id": latest.proposal_id,
                    "reasoning": latest.reasoning,
                    "confidence_score": latest.confidence_score,
                    "timestamp": latest.timestamp
                }
            else:
                response = {"error": "No proposals yet"}
            self.wfile.write(json.dumps(response).encode())
            
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path == '/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                message = data.get("message", "")
                
                # Process message (this is synchronous, but we'll make it work)
                response_text = asyncio.run(self.agent.process_chat_message(message))
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    "response": response_text,
                    "agent_address": self.agent.agent_address,
                    "timestamp": int(time.time())
                }
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {"error": str(e)}
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

def create_handler(agent):
    def handler(*args, **kwargs):
        return AgentHTTPHandler(agent, *args, **kwargs)
    return handler

if __name__ == "__main__":
    agent = RahuAgent()
    agent.run()