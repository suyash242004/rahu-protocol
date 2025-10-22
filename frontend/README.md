# 🎨 Rahu Protocol Frontend

Real-time dashboard for monitoring the Rahu Protocol L2 and AI agent.

## Features

- **Live Agent Status**: Monitor autonomous AI agent activity
- **Pyth Oracle Feeds**: Real-time gas prices and ETH/USD data
- **Avail DA Status**: Track data availability submissions
- **ZK Proof Viewer**: Verify AI optimization proposals
- **ASI:One Chat**: Interactive chat with the AI agent

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (data visualization)
- Ethers.js (blockchain interaction)

## Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your contract addresses
```

## Development

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## Environment Variables

```bash
VITE_RAHU_L2_ADDRESS=0x...           # RahuL2 contract
VITE_AI_GOVERNANCE_ADDRESS=0x...     # AIGovernance contract
VITE_PYTH_ORACLE_ADDRESS=0x...       # PythOracle contract
VITE_ETHEREUM_RPC_URL=https://...    # RPC endpoint
VITE_AGENT_ADDRESS=agent1q...        # AI agent address
```

## Components

### Dashboard.tsx

Overview stats: TPS, gas price, optimizations, data posted

### AgentStatus.tsx

AI agent health, metrics collected, proposal count, confidence score

### PythFeeds.tsx

Real-time price feeds from Pyth Network with live charts

### AvailStatus.tsx

Data availability layer status and recent submissions

### ZKProofViewer.tsx

Zero-knowledge proof verification for AI decisions

### ChatInterface.tsx

ASI:One protocol chat with the AI agent

## Integration

Frontend connects to:

- Smart contracts (via ethers.js)
- AI agent (REST API on port 8001)
- Pyth oracles (on-chain)
- Avail explorer (external links)

## Deployment

```bash
npm run build
# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - IPFS
# - GitHub Pages
```

## License

MIT
