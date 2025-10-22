const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🌙 Deploying Rahu Protocol Contracts...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  console.log(
    "💰 Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH\n"
  );

  // Deploy ZKVerifier
  console.log("1️⃣  Deploying ZKVerifier...");
  const ZKVerifier = await ethers.getContractFactory("ZKVerifier");
  const zkVerifier = await ZKVerifier.deploy();
  await zkVerifier.waitForDeployment();
  const zkVerifierAddress = await zkVerifier.getAddress();
  console.log("✅ ZKVerifier deployed:", zkVerifierAddress, "\n");

  // Deploy RahuL2 (upgradeable)
  console.log("2️⃣  Deploying RahuL2 (UUPS Proxy)...");
  const RahuL2 = await ethers.getContractFactory("RahuL2");
  const rahuL2 = await upgrades.deployProxy(
    RahuL2,
    [
      30000000, // initialGasLimit
      2, // initialBlockTime (2 seconds)
      1000, // initialMaxTPS
    ],
    {
      kind: "uups",
      initializer: "initialize",
    }
  );
  await rahuL2.waitForDeployment();
  const rahuL2Address = await rahuL2.getAddress();
  console.log("✅ RahuL2 Proxy deployed:", rahuL2Address, "\n");

  // Deploy AIGovernance
  console.log("3️⃣  Deploying AIGovernance...");
  const AIGovernance = await ethers.getContractFactory("AIGovernance");
  const aiGovernance = await AIGovernance.deploy(
    rahuL2Address,
    zkVerifierAddress
  );
  await aiGovernance.waitForDeployment();
  const aiGovernanceAddress = await aiGovernance.getAddress();
  console.log("✅ AIGovernance deployed:", aiGovernanceAddress, "\n");

  // Deploy PythOracle (using Sepolia Pyth address)
  console.log("4️⃣  Deploying PythOracle...");
  const pythSepoliaAddress =
    process.env.PYTH_SEPOLIA_ADDRESS ||
    "0xDd24F84d36BF92C65F92307595335bdFab5Bbd21";

  // Pyth price feed IDs (Sepolia)
  const ethUsdFeedId =
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"; // ETH/USD
  const gasFeedId = ethUsdFeedId; // Using ETH price as proxy for gas

  const PythOracle = await ethers.getContractFactory("PythOracle");
  const pythOracle = await PythOracle.deploy(
    pythSepoliaAddress,
    gasFeedId,
    ethUsdFeedId
  );
  await pythOracle.waitForDeployment();
  const pythOracleAddress = await pythOracle.getAddress();
  console.log("✅ PythOracle deployed:", pythOracleAddress, "\n");

  // Deploy AvailBridge
  console.log("5️⃣  Deploying AvailBridge...");
  const AvailBridge = await ethers.getContractFactory("AvailBridge");
  const availBridge = await AvailBridge.deploy(0); // App ID 0 for now
  await availBridge.waitForDeployment();
  const availBridgeAddress = await availBridge.getAddress();
  console.log("✅ AvailBridge deployed:", availBridgeAddress, "\n");

  // Configure contracts
  console.log("6️⃣  Configuring contracts...");

  // Set AI Governance on RahuL2
  const tx1 = await rahuL2.setAIGovernance(aiGovernanceAddress);
  await tx1.wait();
  console.log("   ✓ Set AI Governance on RahuL2");

  // Set ZK Verifier on RahuL2
  const tx2 = await rahuL2.setZKVerifier(zkVerifierAddress);
  await tx2.wait();
  console.log("   ✓ Set ZK Verifier on RahuL2");

  // Set Pyth Oracle on RahuL2
  const tx3 = await rahuL2.setPythOracle(pythOracleAddress);
  await tx3.wait();
  console.log("   ✓ Set Pyth Oracle on RahuL2");

  // Set Avail Bridge on RahuL2
  const tx4 = await rahuL2.setAvailBridge(availBridgeAddress);
  await tx4.wait();
  console.log("   ✓ Set Avail Bridge on RahuL2");

  // Authorize deployer as AI agent
  const tx5 = await aiGovernance.authorizeAgent(deployer.address);
  await tx5.wait();
  console.log("   ✓ Authorized deployer as AI agent\n");

  // Summary
  console.log("=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!\n");
  console.log("📋 Contract Addresses:");
  console.log("   RahuL2 (Proxy):", rahuL2Address);
  console.log("   AIGovernance:", aiGovernanceAddress);
  console.log("   ZKVerifier:", zkVerifierAddress);
  console.log("   PythOracle:", pythOracleAddress);
  console.log("   AvailBridge:", availBridgeAddress);
  console.log("=".repeat(60));

  // Save addresses to file
  const fs = require("fs");
  const addresses = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    rahuL2: rahuL2Address,
    aiGovernance: aiGovernanceAddress,
    zkVerifier: zkVerifierAddress,
    pythOracle: pythOracleAddress,
    availBridge: availBridgeAddress,
    deployer: deployer.address,
  };

  fs.writeFileSync("deployments.json", JSON.stringify(addresses, null, 2));
  console.log("\n✅ Addresses saved to deployments.json");

  // Verification commands
  console.log("\n📝 To verify contracts on Etherscan:");
  console.log(`npx hardhat verify --network sepolia ${zkVerifierAddress}`);
  console.log(
    `npx hardhat verify --network sepolia ${aiGovernanceAddress} ${rahuL2Address} ${zkVerifierAddress}`
  );
  console.log(
    `npx hardhat verify --network sepolia ${pythOracleAddress} ${pythSepoliaAddress} ${gasFeedId} ${ethUsdFeedId}`
  );
  console.log(`npx hardhat verify --network sepolia ${availBridgeAddress} 0`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
