# 🌙 Rahu Protocol

> Self-improving ZK-Native Layer 2 on Ethereum with autonomous AI agents that optimize blockchain performance in real-time.

**Built for ETHOnline 2025 Hackathon**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow)](https://hardhat.org/)
[![ASI Alliance](https://img.shields.io/badge/Powered%20by-ASI%20Alliance-blue)](https://fetch.ai/)

## 🎯 Overview

Rahu Protocol is the first self-improving Layer 2 that uses autonomous AI agents to monitor network health, detect issues, and propose optimizations—all verified with zero-knowledge proofs before execution.

### The Problem

Current Layer 2 solutions require manual governance for parameter changes and optimizations, leading to:

- Slow responses to network congestion
- Inefficient resource allocation
- Human bottlenecks in decision-making
- Delayed adaptation to changing conditions

### The Solution

Rahu Protocol introduces:

- **🤖 Autonomous AI Agents**: Monitor blockchain health 24/7 using ASI Alliance tech
- **🧠 MeTTa Reasoning**: Symbolic reasoning for optimal parameter decisions
- **🔐 ZK-Verified Upgrades**: All AI decisions proven correct before execution
- **📊 Real-Time Oracle Data**: Pyth Network integration for live network metrics
- **💾 Scalable Data Layer**: Avail DA for efficient block data storage

## 🏆 Partner Integrations

### ASI Alliance ($10,000 Prize Track)

- ✅ uAgents framework for autonomous agents
- ✅ Agentverse deployment and discovery
- ✅ MeTTa knowledge graphs for reasoning
- ✅ ASI:One chat protocol for human-agent interaction

### Avail ($10,000 Prize Track)

- ✅ Data Availability layer for L2 blocks
- ✅ Data availability proofs
- ✅ Rollup coordination

### Pyth Network ($5,000 Prize Track)

- ✅ Real-time gas price feeds
- ✅ Network metrics monitoring
- ✅ On-chain oracle integration

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │◄─── User Interface
│   Dashboard     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Rahu Agent     │◄────┤  MeTTa Engine   │
│  (uAgents)      │     │  (Reasoning)    │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Pyth Oracle    │────►│  Smart Contracts│
│  (Real-time)    │     │  (Ethereum)     │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Avail DA      │
                        │   (Storage)     │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Python >= 3.9
- Git
- MetaMask or similar wallet

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/rahu-protocol
cd rahu-protocol
```

2. Install all dependencies:

```bash
npm run setup
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your keys
```

4. Install Python agent dependencies:

```bash
npm run setup:agent
```

### Running Locally

1. Start local Hardhat network:

```bash
npm run dev:contracts
```

2. Deploy contracts:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

3. Start the Rahu Agent:

```bash
cd agents
python scripts/start_agent.py
```

4. Launch frontend:

```bash
npm run dev:frontend
```

Visit `http://localhost:5173` to see the dashboard.

## 📚 Documentation

- [ASI Alliance Integration](docs/ASI_INTEGRATION.md)
- [Avail Integration](docs/AVAIL_INTEGRATION.md)
- [Pyth Integration](docs/PYTH_INTEGRATION.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [AI Tool Attribution](docs/AI_ATTRIBUTION.md)

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run specific test suites:

```bash
npm run test:contracts  # Smart contract tests
npm run test:agent      # Agent tests
```

## 🎥 Demo

[Watch our demo video](https://youtube.com/your-demo-video)

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity, Hardhat
- **ZK Proofs**: Circom
- **AI Agent**: Python, uAgents SDK
- **Reasoning**: MeTTa (SingularityNET)
- **Oracles**: Pyth Network
- **Data Availability**: Avail
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Blockchain**: Ethereum Sepolia Testnet

## 📊 Project Status

- [x] Project setup
- [ ] AI agent development
- [ ] Smart contract deployment
- [ ] Avail integration
- [ ] Pyth integration
- [ ] Frontend dashboard
- [ ] End-to-end testing
- [ ] Documentation
- [ ] Demo video

## 🤝 Contributing

This is a hackathon project for ETHOnline 2025. Contributions are welcome!

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- ASI Alliance for autonomous agent infrastructure
- Avail for data availability solutions
- Pyth Network for real-time oracle data
- ETHGlobal for hosting ETHOnline 2025

## 📧 Contact

- Twitter: [@yourusername](https://twitter.com/yourusername)
- Discord: yourusername#1234

---

Built with ❤️ for ETHOnline 2025
