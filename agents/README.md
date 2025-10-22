# 🤖 Rahu Protocol - AI Agent

Autonomous AI agent built with ASI Alliance technology for ETHOnline 2025.

## Features

- **uAgents Framework**: Autonomous agent infrastructure
- **MeTTa Reasoning**: Symbolic reasoning for blockchain optimization
- **ASI:One Protocol**: Human-agent chat interface
- **Agentverse Integration**: Marketplace discoverability

## Quick Start

### Installation

```bash
cd agents
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:

- `AGENT_SEED`: Unique seed phrase for your agent
- `AGENT_NAME`: Agent identifier
- `MONITORING_INTERVAL`: Seconds between checks (default: 30)

Optional (for production):

- `AGENTVERSE_API_KEY`: For marketplace registration
- `ENABLE_ALMANAC_REGISTRATION`: Set to True for mainnet

### Running the Agent

```bash
# Development mode (local only)
python scripts/start_agent.py

# The agent will:
# - Monitor network metrics every 30 seconds
# - Detect optimization opportunities
# - Generate proposals when confidence threshold met
# - Respond to chat messages
```

### Testing

```bash
# Run all tests
pytest tests/ -v

# Run specific test
pytest tests/test_agent.py::test_agent_initialization -v

# Run with coverage
pytest tests/ --cov=src --cov-report=html
```

### Chat Demo

```bash
# Test ASI:One chat protocol locally
python scripts/demo_chat.py
```

## Agent Capabilities

### Network Monitoring

- Gas price tracking
- Transaction throughput (TPS)
- Block time analysis
- Congestion level detection

### Optimization Logic

- Symbolic reasoning with MeTTa
- Confidence-based decision making
- Parameter adjustment proposals
- Expected improvement calculation

### Chat Protocol (ASI:One)

Ask the agent about:

- `status` - Agent health and statistics
- `metrics` - Current network data
- `proposals` - Optimization suggestions
- `help` - Available commands

## Architecture

```
agents/
├── src/
│   ├── rahu_agent.py          # Main agent class
│   ├── metta_reasoning.py     # MeTTa reasoning engine
│   ├── blockchain_monitor.py  # Network monitoring
│   └── decision_engine.py     # Optimization logic
├── scripts/
│   ├── start_agent.py         # Launch agent
│   ├── register_agentverse.py # Marketplace registration
│   └── demo_chat.py           # Chat protocol demo
└── tests/
    ├── test_agent.py          # Agent tests
    └── test_reasoning.py      # Reasoning tests
```

## Agentverse Deployment

### Prerequisites

1. Get API key from https://agentverse.ai/profile
2. Fund agent wallet (mainnet only)

### Registration

```bash
# Update .env with API key
AGENTVERSE_API_KEY=your_key_here
ENABLE_ALMANAC_REGISTRATION=True

# Register agent
python scripts/register_agentverse.py
```

### After Registration

- View agent at: https://agentverse.ai/agents
- Test in ASI:One: https://asi1.ai
- Search for handle: `@rahu-optimizer`

## Development

### Adding New Features

1. **New Message Types**: Add to `src/rahu_agent.py`
2. **Reasoning Rules**: Update `src/metta_reasoning.py`
3. **Tests**: Add to `tests/test_agent.py`

### Debugging

```bash
# Enable verbose logging
export LOG_LEVEL=DEBUG
python scripts/start_agent.py
```

## Troubleshooting

### "Signature verification failed"

- Normal in dev mode with `ENABLE_ALMANAC_REGISTRATION=False`
- Agent will still function correctly

### "Confidence too low"

- Agent needs more data before making proposals
- Let it run for 5-10 monitoring cycles
- Confidence increases with history length

### Agent not responding

- Check `DEV_MODE=True` in `.env`
- Verify port 8001 is available
- Check logs for errors

## Integration with Rahu Protocol

This agent integrates with:

- **Smart Contracts**: Sends proposals on-chain
- **Pyth Oracles**: Receives real-time price data
- **Avail DA**: Posts optimization proofs
- **Frontend**: Provides status via REST API

## License

MIT
