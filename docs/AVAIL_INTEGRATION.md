# 🌐 Avail DA Integration - Rahu Protocol

## Overview

Rahu Protocol uses **Avail** as its Data Availability layer to ensure L2 transaction data is permanently accessible and verifiable.

## Why Avail?

Traditional Layer 2s face the "data availability problem":

- Where is transaction data stored?
- How do we prove data is available?
- What if the sequencer goes offline?

**Avail solves this** with:

- Modular DA layer separate from execution
- Data availability sampling for scalability
- Cryptographic proofs of data availability

## Architecture

```
┌──────────────┐
│   Rahu L2    │
│  (Execution) │
└──────┬───────┘
       │ Block Data
       ▼
┌──────────────┐     ┌─────────────┐
│AvailBridge  │────►│ Avail Turing│
│ (Sepolia)    │     │  Testnet    │
└──────┬───────┘     └─────────────┘
       │ Commitment
       ▼
┌──────────────┐
│  Ethereum    │
│  (Security)  │
└──────────────┘
```

## Implementation

### 1. **AvailBridge Contract** (Ethereum Sepolia)

**Address**: `0xbE305c0166cE744ceac245Cc492C296196d36df1`

**Contract**: `contracts/contracts/AvailBridge.sol`

```solidity
contract AvailBridge is Ownable {
    struct DataCommitment {
        bytes32 dataHash;
        bytes32 availTxHash;
        uint256 blockNumber;
        uint256 timestamp;
        bool verified;
    }

    mapping(uint256 => DataCommitment) public commitments;

    function postData(
        uint256 blockNumber,
        bytes32 dataHash,
        bytes32 availTxHash
    ) external onlyOwner {
        commitments[blockNumber] = DataCommitment({
            dataHash: dataHash,
            availTxHash: availTxHash,
            blockNumber: blockNumber,
            timestamp: block.timestamp,
            verified: false
        });
        emit DataPosted(blockNumber, dataHash, availTxHash);
    }
}
```

### 2. **Avail Client** (TypeScript)

**Implementation**: `avail-integration/src/avail-client.ts`

```typescript
import { ApiPromise, WsProvider } from "@polkadot/api";

export class AvailClient {
  private api: ApiPromise;

  async connect() {
    const provider = new WsProvider("wss://turing-rpc.avail.so/ws");
    this.api = await ApiPromise.create({ provider });
  }

  async submitData(data: string): Promise<DataSubmission> {
    const extrinsic = this.api.tx.dataAvailability.submitData(data);
    const result = await extrinsic.signAndSend(this.keyring);

    return {
      blockNumber: result.blockNumber,
      extrinsicHash: result.txHash,
      dataHash: keccak256(data),
    };
  }
}
```

### 3. **Data Poster Service**

**Implementation**: `avail-integration/src/data-poster.ts`

**Flow:**

1. Fetch latest L2 block from RahuL2 contract
2. Serialize block data (state root, transactions, timestamp)
3. Submit to Avail Turing testnet
4. Receive Avail tx hash and block number
5. Post commitment to AvailBridge contract on Ethereum

```typescript
async postLatestBlock() {
    // 1. Get L2 block
    const block = await this.fetchL2Block()

    // 2. Submit to Avail
    const submission = await this.availClient.submitData(
        JSON.stringify(block)
    )

    // 3. Post commitment to Ethereum
    await this.availBridge.postData(
        block.blockNumber,
        submission.dataHash,
        submission.availTxHash
    )
}
```

## Data Flow

### Step 1: L2 Block Creation

```
User Transaction → RahuL2 → Block Created
```

### Step 2: Data Posting

```
Block Data → Avail Client → Turing Testnet
```

### Step 3: Commitment Storage

```
Avail TX Hash → AvailBridge → Ethereum
```

### Step 4: Verification

```
Anyone → Query Avail → Verify Data Available
```

## Avail Turing Testnet

**Network**: Turing Testnet (Current)
**RPC**: `wss://turing-rpc.avail.so/ws`
**Explorer**: https://turing.avail.so

**Note**: Goldberg and Kate testnets have been decommissioned.

## Key Features

### 1. **Data Availability Proofs**

- Cryptographic proof that data can be retrieved
- Kate commitments for efficient sampling
- Light clients can verify without downloading full data

### 2. **Modular Architecture**

- DA layer separated from execution
- Enables horizontal scaling
- Multiple L2s can share same DA layer

### 3. **Ethereum Settlement**

- Commitments posted to Ethereum for security
- Inherits Ethereum's security guarantees
- Bridge enables cross-chain verification

## Frontend Integration

**Component**: `frontend/src/components/AvailStatus.tsx`

**Features:**

- Real-time submission tracking
- Block verification status
- Link to Avail explorer
- Stats: Total blocks, data posted, avg time

**Contract Integration:**

```typescript
const { contract: availBridge } = useContract(
  process.env.VITE_AVAIL_BRIDGE_ADDRESS,
  AVAIL_BRIDGE_ABI
);

const latestBlock = await availBridge.latestBlock();
const commitment = await availBridge.getCommitment(blockNumber);
```

## Testing

### Run Avail Client

```bash
cd avail-integration
npm install
npm run start
```

### Post Test Data

```bash
npm run post-data
```

### Verify on Explorer

Visit: https://explorer.avail.so

## Deployed Contracts

- **AvailBridge (Sepolia)**: `0xbE305c0166cE744ceac245Cc492C296196d36df1`
- **View on Etherscan**: https://sepolia.etherscan.io/address/0xbE305c0166cE744ceac245Cc492C296196d36df1

## Challenges & Solutions

### Challenge 1: Testnet Changes

**Problem**: Goldberg testnet was decommissioned
**Solution**: Updated to Turing testnet, updated all RPC endpoints

### Challenge 2: Cross-Chain Communication

**Problem**: Need to link Avail TX to Ethereum commitment
**Solution**: Store Avail tx hash in AvailBridge contract

### Challenge 3: Data Size Limits

**Problem**: Large blocks might exceed Avail limits
**Solution**: Implement data compression and chunking

## Future Enhancements

1. **Validity Proofs**: Add ZK proofs of correct DA posting
2. **Light Client**: Implement Avail light client for verification
3. **Multi-Chain**: Post to multiple DA layers for redundancy
4. **Optimistic Verification**: Reduce latency with optimistic assumptions

## Benefits for Rahu Protocol

✅ **Scalability**: Can handle high TPS without congestion
✅ **Security**: Data always available for fraud proofs
✅ **Decentralization**: No single point of failure
✅ **Cost-Effective**: Cheaper than storing everything on Ethereum

## Links

- **Avail Docs**: https://docs.availproject.org
- **Explorer**: https://explorer.avail.so
- **Turing Testnet**: https://turing.avail.so
- **Avail Academy**: https://avail.academy/testnet-explorer

---

**Built for ETHOnline 2025 🚀**
