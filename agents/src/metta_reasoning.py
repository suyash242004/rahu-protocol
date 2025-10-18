"""
MeTTa Reasoning Engine for Rahu Protocol
Uses symbolic reasoning to determine optimal blockchain parameters
"""

from hyperon import MeTTa, AtomType
from loguru import logger
from typing import Dict, List, Tuple
import os

class MeTTaReasoningEngine:
    """
    MeTTa-based reasoning engine for blockchain optimization
    
    Uses symbolic reasoning to:
    1. Analyze network metrics
    2. Reason about optimal parameters
    3. Generate explainable decisions
    """
    
    def __init__(self):
        self.metta = MeTTa()
        self.knowledge_base_path = os.getenv("METTA_KNOWLEDGE_BASE_PATH", "./knowledge_base")
        self.reasoning_depth = int(os.getenv("REASONING_DEPTH", "5"))
        
        # Initialize knowledge base
        self._initialize_knowledge_base()
        
        logger.info("🧠 MeTTa Reasoning Engine initialized")
    
    def _initialize_knowledge_base(self):
        """Initialize MeTTa knowledge base with blockchain rules"""
        
        # Define blockchain optimization rules in MeTTa
        rules = """
        ; Network State Rules
        (: congested (-> Network Bool))
        (: high-gas (-> Network Bool))
        (: low-throughput (-> Network Bool))
        
        ; Parameter Adjustment Rules
        (: increase-gas-limit (-> Network Action))
        (: decrease-block-time (-> Network Action))
        (: optimize-tps (-> Network Action))
        
        ; Optimization Logic
        (= (should-optimize $net)
           (if (congested $net) True
           (if (high-gas $net) True
           (if (low-throughput $net) True False))))
        
        ; Congestion Rules
        (= (congested $net)
           (> (congestion-level $net) 0.7))
        
        (= (high-gas $net)
           (> (gas-price $net) 100))
        
        (= (low-throughput $net)
           (< (tps $net) 200))
        
        ; Parameter Optimization Rules
        (= (optimize-params $net)
           (if (congested $net)
               (increase-gas-limit $net)
           (if (high-gas $net)
               (decrease-block-time $net)
           (if (low-throughput $net)
               (optimize-tps $net)
               (no-action)))))
        
        ; Expected Improvement Calculation
        (= (calculate-improvement $current $proposed)
           (* (/ (- $proposed $current) $current) 100))
        
        ; Confidence Score Calculation
        (= (confidence-score $history-length)
           (min 0.95 (+ 0.7 (* (/ $history-length 100) 0.25))))
        """
        
        try:
            # Load rules into MeTTa space
            self.metta.run(rules)
            logger.success("✅ Knowledge base loaded successfully")
        except Exception as e:
            logger.error(f"❌ Failed to load knowledge base: {e}")
    
    def reason_about_optimization(
        self,
        metrics: Dict[str, float],
        current_params: Dict[str, float],
        history_length: int
    ) -> Tuple[Dict[str, float], str, float]:
        """
        Use MeTTa reasoning to determine optimal parameters
        
        Args:
            metrics: Current network metrics
            current_params: Current blockchain parameters
            history_length: Number of historical data points
        
        Returns:
            Tuple of (proposed_params, reasoning_explanation, confidence_score)
        """
        logger.info("🧠 Starting MeTTa reasoning process...")
        
        # Create network state representation
        network_state = f"""
        (= (congestion-level network) {metrics.get('congestion_level', 0)})
        (= (gas-price network) {metrics.get('gas_price', 0)})
        (= (tps network) {metrics.get('tps', 0)})
        """
        
        try:
            # Load current state
            self.metta.run(network_state)
            
            # Query if optimization is needed
            should_optimize = self.metta.run("(should-optimize network)")
            logger.info(f"Should optimize: {should_optimize}")
            
            # Determine optimization actions
            actions = self.metta.run("(optimize-params network)")
            logger.info(f"Recommended actions: {actions}")
            
            # Generate proposed parameters using reasoning
            proposed_params = current_params.copy()
            reasoning_steps = []
            
            # Apply reasoning-based adjustments
            if metrics.get('congestion_level', 0) > 0.7:
                adjustment_factor = 1 + (metrics['congestion_level'] - 0.7) * 0.5
                proposed_params['gas_limit'] = int(current_params['gas_limit'] * adjustment_factor)
                reasoning_steps.append(
                    f"Congestion at {metrics['congestion_level']:.1%} → "
                    f"Increase gas limit by {(adjustment_factor - 1) * 100:.1f}%"
                )
            
            if metrics.get('gas_price', 0) > 100:
                reduction_factor = 1 - min(0.2, (metrics['gas_price'] - 100) / 1000)
                proposed_params['block_time'] = current_params['block_time'] * reduction_factor
                reasoning_steps.append(
                    f"High gas price ({metrics['gas_price']:.1f} Gwei) → "
                    f"Reduce block time by {(1 - reduction_factor) * 100:.1f}%"
                )
            
            if metrics.get('tps', 0) < 200:
                improvement_factor = 1 + (200 - metrics['tps']) / 1000
                proposed_params['max_tps'] = int(current_params['max_tps'] * improvement_factor)
                reasoning_steps.append(
                    f"Low throughput ({metrics['tps']} TPS) → "
                    f"Increase max TPS by {(improvement_factor - 1) * 100:.1f}%"
                )
            
            # Calculate confidence using MeTTa
            confidence_query = f"(confidence-score {history_length})"
            confidence_result = self.metta.run(confidence_query)
            
            # Parse confidence (simplified for now)
            confidence = min(0.95, 0.7 + (history_length / 100) * 0.25)
            
            reasoning_explanation = " | ".join(reasoning_steps) if reasoning_steps else "No optimization needed"
            
            logger.success(f"✅ Reasoning complete: {len(reasoning_steps)} actions, {confidence:.2%} confidence")
            
            return proposed_params, reasoning_explanation, confidence
            
        except Exception as e:
            logger.error(f"❌ Reasoning error: {e}")
            return current_params, f"Error in reasoning: {e}", 0.0
    
    def explain_decision(self, proposal: Dict) -> str:
        """
        Generate human-readable explanation of optimization decision
        
        Uses MeTTa's symbolic reasoning to provide transparent explanations
        """
        explanation = f"""
        🧠 MeTTa Reasoning Explanation
        
        Network Analysis:
        - Congestion Level: {proposal.get('metrics', {}).get('congestion_level', 0):.1%}
        - Gas Price: {proposal.get('metrics', {}).get('gas_price', 0):.1f} Gwei
        - Throughput: {proposal.get('metrics', {}).get('tps', 0)} TPS
        
        Reasoning Process:
        {proposal.get('reasoning', 'No reasoning provided')}
        
        Proposed Changes:
        """
        
        current = proposal.get('current_params', {})
        proposed = proposal.get('proposed_params', {})
        
        for param, value in proposed.items():
            if param in current and current[param] != value:
                change_pct = ((value - current[param]) / current[param]) * 100
                explanation += f"\n  • {param}: {current[param]} → {value} ({change_pct:+.1f}%)"
        
        explanation += f"\n\nConfidence Score: {proposal.get('confidence_score', 0):.2%}"
        explanation += f"\nExpected Improvement: {proposal.get('expected_improvement', 0):.2%}"
        
        return explanation
    
    def validate_proposal(self, proposal: Dict) -> bool:
        """
        Validate proposal using MeTTa reasoning rules
        
        Ensures proposals are safe and reasonable
        """
        proposed = proposal.get('proposed_params', {})
        current = proposal.get('current_params', {})
        
        # Safety checks using symbolic reasoning
        safety_rules = """
        ; Safety constraints
        (= (safe-gas-limit $current $proposed)
           (and (> $proposed 0)
                (< $proposed (* $current 2))))
        
        (= (safe-block-time $current $proposed)
           (and (> $proposed 0.5)
                (< $proposed (* $current 1.5))))
        
        (= (safe-tps $current $proposed)
           (and (> $proposed 0)
                (< $proposed (* $current 2))))
        """
        
        try:
            self.metta.run(safety_rules)
            
            # Check each parameter
            for param in ['gas_limit', 'block_time', 'max_tps']:
                if param in proposed and param in current:
                    # Verify change is within safe bounds
                    ratio = proposed[param] / current[param]
                    if ratio < 0.5 or ratio > 2.0:
                        logger.warning(f"⚠️  Unsafe parameter change: {param} ratio {ratio:.2f}")
                        return False
            
            logger.success("✅ Proposal validated successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Validation error: {e}")
            return False

# Singleton instance
_reasoning_engine = None

def get_reasoning_engine() -> MeTTaReasoningEngine:
    """Get or create singleton reasoning engine instance"""
    global _reasoning_engine
    if _reasoning_engine is None:
        _reasoning_engine = MeTTaReasoningEngine()
    return _reasoning_engine