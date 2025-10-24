/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAHU_L2_ADDRESS: string;
  readonly VITE_AI_GOVERNANCE_ADDRESS: string;
  readonly VITE_PYTH_ORACLE_ADDRESS: string;
  readonly VITE_ZK_VERIFIER_ADDRESS: string;
  readonly VITE_AVAIL_BRIDGE_ADDRESS: string;
  readonly VITE_ETHEREUM_RPC_URL: string;
  readonly VITE_AGENT_ADDRESS: string;
  readonly VITE_AGENT_API_URL: string;
  readonly VITE_DEPLOYER_ADDRESS: string;
  readonly VITE_AVAIL_EXPLORER: string;
  readonly VITE_CHAIN_ID: string;
  readonly VITE_NETWORK_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
