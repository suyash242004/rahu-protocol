const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("AIGovernance Contract", function () {
  let rahuL2, aiGovernance, zkVerifier;
  let owner, agent, user;

  beforeEach(async function () {
    [owner, agent, user] = await ethers.getSigners();

    const ZKVerifier = await ethers.getContractFactory("ZKVerifier");
    zkVerifier = await ZKVerifier.deploy();

    const RahuL2 = await ethers.getContractFactory("RahuL2");
    rahuL2 = await upgrades.deployProxy(RahuL2, [30000000, 2, 1000], {
      kind: "uups",
    });

    const AIGovernance = await ethers.getContractFactory("AIGovernance");
    aiGovernance = await AIGovernance.deploy(
      await rahuL2.getAddress(),
      await zkVerifier.getAddress()
    );

    await rahuL2.setAIGovernance(await aiGovernance.getAddress());
    await aiGovernance.authorizeAgent(agent.address);

    // Fast forward time to allow first proposal
    await time.increase(3600);
  });

  describe("Proposal Submission", function () {
    it("Should submit proposal successfully", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("proof"));

      await expect(
        aiGovernance
          .connect(agent)
          .submitProposal(35000000, 2, 1200, proofHash, "Increase capacity")
      ).to.emit(aiGovernance, "ProposalSubmitted");

      expect(await aiGovernance.proposalCount()).to.equal(1);
    });

    it("Should reject proposals from unauthorized agents", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("proof"));

      await expect(
        aiGovernance
          .connect(user)
          .submitProposal(35000000, 2, 1200, proofHash, "test")
      ).to.be.revertedWith("Not authorized agent");
    });

    it("Should enforce minimum update interval", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("proof"));

      await aiGovernance
        .connect(agent)
        .submitProposal(35000000, 2, 1200, proofHash, "test");

      // Try immediate second proposal
      await expect(
        aiGovernance
          .connect(agent)
          .submitProposal(36000000, 2, 1200, proofHash, "test")
      ).to.be.revertedWith("Too soon to update");

      // Fast forward and try again
      await time.increase(3601);

      await expect(
        aiGovernance
          .connect(agent)
          .submitProposal(36000000, 2, 1200, proofHash, "test2")
      ).to.emit(aiGovernance, "ProposalSubmitted");
    });
  });

  describe("Proposal Verification", function () {
    it("Should verify proposal with valid proof", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("proof"));
      const proof = ethers.toUtf8Bytes(
        "valid_proof_data_here_with_enough_length_to_pass"
      );

      await aiGovernance
        .connect(agent)
        .submitProposal(35000000, 2, 1200, proofHash, "test");

      await expect(aiGovernance.verifyProposal(1, proof)).to.emit(
        aiGovernance,
        "ProposalVerified"
      );
    });
  });

  describe("Agent Management", function () {
    it("Should authorize new agent", async function () {
      await expect(aiGovernance.authorizeAgent(user.address))
        .to.emit(aiGovernance, "AgentAuthorized")
        .withArgs(user.address);

      expect(await aiGovernance.authorizedAgents(user.address)).to.be.true;
    });

    it("Should revoke agent authorization", async function () {
      await aiGovernance.revokeAgent(agent.address);
      expect(await aiGovernance.authorizedAgents(agent.address)).to.be.false;
    });
  });
});
