# 🌐 Avail DA Integration

Data Availability layer integration for Rahu Protocol using Avail.

## Features

- **Data Posting**: Submit L2 block data to Avail
- **Proof Generation**: Generate DA proofs
- **Bridge Integration**: Post commitments to Ethereum
- **Continuous Service**: Automated data posting

## Setup

```bash
cd avail-integration
npm install
cp .env.example .env
# Edit .env with your configuration
```

## Usage

### Connect to Avail

```bash
npm run start
```

### Post Data Continuously

```bash
npm run post-data
```

### Generate Proof

```bash
npm run verify-proof <blockHash>
```

## Configuration

- `AVAIL_RPC_URL`: Avail testnet RPC endpoint
- `AVAIL_APP_ID`: Your application ID on Avail
- `AVAIL_SEED`: Account seed phrase
- `POSTING_INTERVAL`: Data posting interval (ms)

## Testnet

Using Avail Goldberg testnet:

- RPC: wss://goldberg.avail.tools/ws
- Explorer: https://goldberg.avail.tools

## Integration

This service:

1. Fetches L2 blocks from RahuL2 contract
2. Posts block data to Avail DA
3. Generates availability proofs
4. Updates Ethereum bridge contract
