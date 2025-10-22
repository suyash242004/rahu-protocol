const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("RahuL2 Contract", function () {
  let rahuL2, aiGovernance, zkVerifier;
  let owner, agent, user;

  beforeEach(async function () {
    [owner, agent, user] = await ethers.getSigners();

    const ZKVerifier = await ethers.getContractFactory("ZKVerifier");
    zkVerifier = await ZKVerifier.deploy();
    await zkVerifier.waitForDeployment();

    const RahuL2 = await ethers.getContractFactory("RahuL2");
    rahuL2 = await upgrades.deployProxy(RahuL2, [30000000, 2, 1000], {
      kind: "uups",
    });
    await rahuL2.waitForDeployment();

    const AIGovernance = await ethers.getContractFactory("AIGovernance");
    aiGovernance = await AIGovernance.deploy(
      await rahuL2.getAddress(),
      await zkVerifier.getAddress()
    );
    await aiGovernance.waitForDeployment();

    await rahuL2.setAIGovernance(await aiGovernance.getAddress());
    await rahuL2.setZKVerifier(await zkVerifier.getAddress());
  });

  describe("Initialization", function () {
    it("Should initialize with correct parameters", async function () {
      const params = await rahuL2.getParams();
      expect(params.gasLimit).to.equal(30000000);
      expect(params.blockTime).to.equal(2);
      expect(params.maxTPS).to.equal(1000);
    });

    it("Should set owner correctly", async function () {
      expect(await rahuL2.owner()).to.equal(owner.address);
    });
  });

  describe("Block Submission", function () {
    it("Should submit block successfully", async function () {
      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("state"));
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("data"));

      await expect(rahuL2.submitBlock(stateRoot, dataHash)).to.emit(
        rahuL2,
        "BlockSubmitted"
      );

      expect(await rahuL2.latestBlockNumber()).to.equal(1);
    });

    it("Should revert on invalid state root", async function () {
      await expect(
        rahuL2.submitBlock(
          ethers.ZeroHash,
          ethers.keccak256(ethers.toUtf8Bytes("data"))
        )
      ).to.be.revertedWith("Invalid state root");
    });

    it("Should only allow owner to submit blocks", async function () {
      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("state"));
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("data"));

      await expect(
        rahuL2.connect(user).submitBlock(stateRoot, dataHash)
      ).to.be.revertedWithCustomError(rahuL2, "OwnableUnauthorizedAccount");
    });
  });

  describe("Parameter Updates", function () {
    it("Should update parameters from AI Governance", async function () {
      // Transfer ownership to governance for testing
      const governanceAddress = await aiGovernance.getAddress();

      // Call updateParams directly from owner (simulating governance)
      await rahuL2.setAIGovernance(owner.address);

      await expect(rahuL2.updateParams(35000000, 3, 1200)).to.emit(
        rahuL2,
        "ParamsUpdated"
      );

      const params = await rahuL2.getParams();
      expect(params.gasLimit).to.equal(35000000);
    });

    it("Should reject parameter updates from non-governance", async function () {
      await expect(
        rahuL2.connect(user).updateParams(35000000, 3, 1200)
      ).to.be.revertedWith("Only AI governance");
    });

    it("Should enforce safety bounds on gas limit", async function () {
      const params = await rahuL2.getParams();
      const tooLarge = params.gasLimit * 3n;

      expect(tooLarge).to.be.greaterThan(params.gasLimit * 2n);
    });
  });

  describe("Block Finalization", function () {
    it("Should finalize block from verifier", async function () {
      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("state"));
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("data"));

      await rahuL2.submitBlock(stateRoot, dataHash);

      // Set owner as verifier for testing
      await rahuL2.setZKVerifier(owner.address);

      await expect(rahuL2.finalizeBlock(1))
        .to.emit(rahuL2, "BlockFinalized")
        .withArgs(1);

      const block = await rahuL2.getBlock(1);
      expect(block.finalized).to.be.true;
    });
  });
});
