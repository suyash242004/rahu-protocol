/**
 * L2 Block Data Poster to Avail
 * Continuously posts L2 block data to Avail DA layer
 */

import { AvailClient, DataSubmission } from "./avail-client";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

interface L2Block {
  blockNumber: number;
  stateRoot: string;
  dataHash: string;
  timestamp: number;
  transactions: string[];
}

export class DataPoster {
  private availClient: AvailClient;
  private ethProvider: ethers.JsonRpcProvider;
  private availBridge: ethers.Contract;
  private postingInterval: number;
  private isRunning: boolean = false;

  constructor() {
    this.availClient = new AvailClient();

    this.ethProvider = new ethers.JsonRpcProvider(
      process.env.ETHEREUM_RPC_URL || "http://localhost:8545"
    );

    this.postingInterval = parseInt(process.env.POSTING_INTERVAL || "60000");

    // Load bridge contract
    const bridgeAddress = process.env.AVAIL_BRIDGE_ADDRESS;
    const bridgeABI = [
      "function postData(uint256 blockNumber, bytes32 dataHash, bytes32 availTxHash) external",
      "function getCommitment(uint256 blockNumber) external view returns (bytes32, bytes32, uint256, bool)",
    ];

    this.availBridge = new ethers.Contract(
      bridgeAddress || ethers.ZeroAddress,
      bridgeABI,
      this.ethProvider
    );
  }

  /**
   * Start posting service
   */
  async start(): Promise<void> {
    console.log("🚀 Starting Data Poster Service...\n");

    try {
      await this.availClient.connect();
      this.isRunning = true;

      console.log("✅ Data Poster Service started");
      console.log(`   Posting interval: ${this.postingInterval}ms\n`);

      // Start posting loop
      while (this.isRunning) {
        try {
          await this.postLatestBlock();
          await this.sleep(this.postingInterval);
        } catch (error) {
          console.error("❌ Error posting block:", error);
          await this.sleep(5000); // Wait 5s on error
        }
      }
    } catch (error) {
      console.error("❌ Failed to start service:", error);
      throw error;
    }
  }

  /**
   * Post latest L2 block to Avail
   */
  private async postLatestBlock(): Promise<void> {
    console.log("📦 Fetching latest L2 block...");

    // In production: fetch from RahuL2 contract
    // For demo: generate mock data
    const block = this.generateMockBlock();

    console.log(`   Block #${block.blockNumber}`);
    console.log(`   Transactions: ${block.transactions.length}`);

    // Serialize block data
    const blockData = JSON.stringify(block);
    const dataSize = new Blob([blockData]).size;

    console.log(`   Data size: ${dataSize} bytes`);

    // Submit to Avail
    const submission = await this.availClient.submitData(blockData);

    console.log("✅ Posted to Avail");
    console.log(`   Avail block: ${submission.blockNumber}`);
    console.log(`   Extrinsic: ${submission.extrinsicHash}`);

    // Post commitment to Ethereum bridge
    if (process.env.PRIVATE_KEY && submission.blockHash) {
      await this.postCommitmentToEthereum(block, submission);
    }

    // Save submission record
    this.saveSubmission(block.blockNumber, submission);

    console.log("");
  }

  /**
   * Post commitment to Ethereum bridge contract
   */
  private async postCommitmentToEthereum(
    block: L2Block,
    submission: DataSubmission
  ): Promise<void> {
    try {
      const wallet = new ethers.Wallet(
        process.env.PRIVATE_KEY!,
        this.ethProvider
      );

      const bridgeWithSigner = this.availBridge.connect(wallet);

      const tx = await bridgeWithSigner.postData(
        block.blockNumber,
        block.dataHash,
        submission.extrinsicHash || ethers.ZeroHash
      );

      console.log(`   📝 Posted commitment to Ethereum: ${tx.hash}`);
      await tx.wait();
    } catch (error) {
      console.error("   ⚠️  Failed to post commitment to Ethereum:", error);
    }
  }

  /**
   * Generate mock L2 block for demo
   */
  private generateMockBlock(): L2Block {
    const blockNumber = Date.now();
    const transactions = Array.from(
      { length: Math.floor(Math.random() * 10) + 1 },
      (_, i) => `0x${Math.random().toString(16).slice(2)}`
    );

    const stateRoot = ethers.keccak256(
      ethers.toUtf8Bytes(`state_${blockNumber}`)
    );

    const dataHash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify(transactions))
    );

    return {
      blockNumber,
      stateRoot,
      dataHash,
      timestamp: Date.now(),
      transactions,
    };
  }

  /**
   * Save submission record
   */
  private saveSubmission(
    blockNumber: number,
    submission: DataSubmission
  ): void {
    const record = {
      blockNumber,
      ...submission,
      timestamp: new Date().toISOString(),
    };

    const filename = "submissions.jsonl";
    fs.appendFileSync(filename, JSON.stringify(record) + "\n");
  }

  /**
   * Stop posting service
   */
  async stop(): Promise<void> {
    console.log("\n🛑 Stopping Data Poster Service...");
    this.isRunning = false;
    await this.availClient.disconnect();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Run if executed directly
if (require.main === module) {
  const poster = new DataPoster();

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    await poster.stop();
    process.exit(0);
  });

  poster.start().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
