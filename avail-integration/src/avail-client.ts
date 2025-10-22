/**
 * Avail DA Client for Rahu Protocol
 * Handles connection to Avail network and data posting
 */

import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { u8aToHex } from "@polkadot/util";
import * as dotenv from "dotenv";

dotenv.config();

export interface AvailConfig {
  rpcUrl: string;
  appId: number;
  seed: string;
}

export interface DataSubmission {
  data: string;
  appId: number;
  extrinsicHash?: string;
  blockHash?: string;
  blockNumber?: number;
}

export class AvailClient {
  private api: ApiPromise | null = null;
  private keyring: KeyringPair | null = null;
  private config: AvailConfig;
  private isConnected: boolean = false;

  constructor(config?: Partial<AvailConfig>) {
    this.config = {
      rpcUrl:
        config?.rpcUrl ||
        process.env.AVAIL_RPC_URL ||
        "wss://goldberg.avail.tools/ws",
      appId: config?.appId || parseInt(process.env.AVAIL_APP_ID || "0"),
      seed: config?.seed || process.env.AVAIL_SEED || "//Alice",
    };
  }

  /**
   * Connect to Avail network
   */
  async connect(): Promise<void> {
    try {
      console.log("🔌 Connecting to Avail network...");
      console.log(`   RPC: ${this.config.rpcUrl}`);

      const provider = new WsProvider(this.config.rpcUrl);
      this.api = await ApiPromise.create({ provider });

      await this.api.isReady;

      // Initialize keyring
      const keyring = new Keyring({ type: "sr25519" });
      this.keyring = keyring.addFromUri(this.config.seed);

      this.isConnected = true;

      console.log("✅ Connected to Avail network");
      console.log(`   Chain: ${await this.api.rpc.system.chain()}`);
      console.log(`   Account: ${this.keyring.address}`);
    } catch (error) {
      console.error("❌ Failed to connect to Avail:", error);
      throw error;
    }
  }

  /**
   * Submit data to Avail DA layer
   */
  async submitData(data: string | Uint8Array): Promise<DataSubmission> {
    if (!this.isConnected || !this.api || !this.keyring) {
      throw new Error("Not connected to Avail network");
    }

    try {
      console.log("📤 Submitting data to Avail...");

      // Convert data to hex if string
      const dataHex = typeof data === "string" ? data : u8aToHex(data);

      console.log(`   Data size: ${dataHex.length} bytes`);
      console.log(`   App ID: ${this.config.appId}`);

      // Create extrinsic
      const extrinsic = this.api.tx.dataAvailability.submitData(dataHex);

      // Sign and send
      const result = await new Promise<DataSubmission>((resolve, reject) => {
        extrinsic
          .signAndSend(this.keyring!, ({ status, txHash, events }) => {
            console.log(`   Transaction status: ${status.type}`);

            if (status.isInBlock) {
              console.log(
                `   ✅ Included in block: ${status.asInBlock.toHex()}`
              );

              // Extract block number
              this.api!.rpc.chain.getHeader(status.asInBlock).then((header) => {
                const submission: DataSubmission = {
                  data: dataHex,
                  appId: this.config.appId,
                  extrinsicHash: txHash.toHex(),
                  blockHash: status.asInBlock.toHex(),
                  blockNumber: header.number.toNumber(),
                };

                console.log(`   Block number: ${submission.blockNumber}`);
                console.log(`   Extrinsic hash: ${submission.extrinsicHash}`);

                resolve(submission);
              });
            } else if (status.isFinalized) {
              console.log(
                `   🔒 Finalized in block: ${status.asFinalized.toHex()}`
              );
            }
          })
          .catch(reject);
      });

      return result;
    } catch (error) {
      console.error("❌ Failed to submit data:", error);
      throw error;
    }
  }

  /**
   * Get data from Avail by block hash
   */
  async getData(blockHash: string): Promise<string | null> {
    if (!this.isConnected || !this.api) {
      throw new Error("Not connected to Avail network");
    }

    try {
      const block = await this.api.rpc.chain.getBlock(blockHash);

      // Find data availability extrinsics
      for (const ext of block.block.extrinsics) {
        if (
          ext.method.section === "dataAvailability" &&
          ext.method.method === "submitData"
        ) {
          const data = ext.method.args[0].toString();
          return data;
        }
      }

      return null;
    } catch (error) {
      console.error("❌ Failed to get data:", error);
      throw error;
    }
  }

  /**
   * Verify data availability
   */
  async verifyDataAvailability(blockHash: string): Promise<boolean> {
    if (!this.isConnected || !this.api) {
      throw new Error("Not connected to Avail network");
    }

    try {
      const block = await this.api.rpc.chain.getBlock(blockHash);

      // Check if block exists and is finalized
      const finalizedHash = await this.api.rpc.chain.getFinalizedHead();
      const finalizedBlock = await this.api.rpc.chain.getBlock(finalizedHash);

      const isFinalized =
        block.block.header.number.toNumber() <=
        finalizedBlock.block.header.number.toNumber();

      console.log(
        `   Data availability: ${isFinalized ? "✅ Verified" : "⏳ Pending"}`
      );

      return isFinalized;
    } catch (error) {
      console.error("❌ Failed to verify data availability:", error);
      return false;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<string> {
    if (!this.isConnected || !this.api || !this.keyring) {
      throw new Error("Not connected to Avail network");
    }

    const { data: balance } = await this.api.query.system.account(
      this.keyring.address
    );
    return balance.free.toString();
  }

  /**
   * Disconnect from Avail network
   */
  async disconnect(): Promise<void> {
    if (this.api) {
      await this.api.disconnect();
      this.isConnected = false;
      console.log("👋 Disconnected from Avail network");
    }
  }
}

// Example usage
if (require.main === module) {
  (async () => {
    const client = new AvailClient();

    try {
      await client.connect();

      // Get balance
      const balance = await client.getBalance();
      console.log(`💰 Balance: ${balance}`);

      // Submit test data
      const testData = JSON.stringify({
        blockNumber: 12345,
        stateRoot: "0x1234...",
        timestamp: Date.now(),
      });

      const submission = await client.submitData(testData);
      console.log("\n✅ Data submitted successfully!");
      console.log(submission);

      // Verify data availability
      if (submission.blockHash) {
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10s
        const isAvailable = await client.verifyDataAvailability(
          submission.blockHash
        );
        console.log(`\n📊 Data available: ${isAvailable}`);
      }

      await client.disconnect();
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  })();
}
