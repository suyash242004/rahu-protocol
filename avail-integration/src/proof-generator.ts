/**
 * Data Availability Proof Generator
 * Generates proofs that data is available on Avail
 */

import { AvailClient } from "./avail-client";
import { ethers } from "ethers";
import * as crypto from "crypto";

export interface DAProof {
  blockNumber: number;
  blockHash: string;
  dataHash: string;
  merkleRoot: string;
  merkleProof: string[];
  timestamp: number;
}

export class ProofGenerator {
  private availClient: AvailClient;

  constructor() {
    this.availClient = new AvailClient();
  }

  /**
   * Generate DA proof for a block
   */
  async generateProof(blockHash: string): Promise<DAProof | null> {
    try {
      console.log("🔐 Generating DA proof...");
      console.log(`   Block hash: ${blockHash}`);

      await this.availClient.connect();

      // Verify data is available
      const isAvailable = await this.availClient.verifyDataAvailability(
        blockHash
      );

      if (!isAvailable) {
        console.log("   ⚠️  Data not yet finalized");
        return null;
      }

      // Get data from block
      const data = await this.availClient.getData(blockHash);

      if (!data) {
        console.log("   ❌ No data found in block");
        return null;
      }

      // Generate proof
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(data));
      const merkleProof = this.generateMerkleProof(data);

      const proof: DAProof = {
        blockNumber: 0, // Would get from block header
        blockHash,
        dataHash,
        merkleRoot: merkleProof.root,
        merkleProof: merkleProof.proof,
        timestamp: Date.now(),
      };

      console.log("✅ Proof generated");
      console.log(`   Data hash: ${proof.dataHash}`);
      console.log(`   Merkle root: ${proof.merkleRoot}`);

      await this.availClient.disconnect();

      return proof;
    } catch (error) {
      console.error("❌ Failed to generate proof:", error);
      return null;
    }
  }

  /**
   * Generate Merkle proof (simplified)
   */
  private generateMerkleProof(data: string): { root: string; proof: string[] } {
    // Simplified Merkle tree for demo
    // In production: use proper Merkle tree library

    const leaves = this.chunkData(data, 32);
    const hashes = leaves.map((leaf) =>
      ethers.keccak256(ethers.toUtf8Bytes(leaf))
    );

    let currentLevel = hashes;
    const proof: string[] = [];

    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combined = ethers.concat([
            currentLevel[i],
            currentLevel[i + 1],
          ]);
          nextLevel.push(ethers.keccak256(combined));
          proof.push(currentLevel[i + 1]);
        } else {
          nextLevel.push(currentLevel[i]);
        }
      }

      currentLevel = nextLevel;
    }

    return {
      root: currentLevel[0] || ethers.ZeroHash,
      proof,
    };
  }

  /**
   * Chunk data into pieces
   */
  private chunkData(data: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Verify DA proof
   */
  verifyProof(proof: DAProof, data: string): boolean {
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(data));
    return dataHash === proof.dataHash;
  }
}

// Example usage
if (require.main === module) {
  (async () => {
    const generator = new ProofGenerator();

    const blockHash = process.argv[2];

    if (!blockHash) {
      console.log("Usage: ts-node proof-generator.ts <blockHash>");
      process.exit(1);
    }

    const proof = await generator.generateProof(blockHash);

    if (proof) {
      console.log("\n📋 Proof Details:");
      console.log(JSON.stringify(proof, null, 2));
    }
  })();
}
