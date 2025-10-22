// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IRahuL2.sol";
import "./interfaces/IZKVerifier.sol";

/**
 * @title AIGovernance
 * @notice Executes AI-proposed optimizations after ZK verification
 * @dev Bridge between off-chain AI agent and on-chain L2 parameters
 */
contract AIGovernance is Ownable, ReentrancyGuard {
    
    struct Proposal {
        uint256 id;
        address proposer;
        uint256 currentGasLimit;
        uint256 proposedGasLimit;
        uint256 currentBlockTime;
        uint256 proposedBlockTime;
        uint256 currentMaxTPS;
        uint256 proposedMaxTPS;
        bytes32 zkProofHash;
        bool verified;
        bool executed;
        uint256 timestamp;
        string reasoning;
    }

    /// @notice RahuL2 contract
    IRahuL2 public rahuL2;

    /// @notice ZK Verifier contract
    IZKVerifier public zkVerifier;

    /// @notice Authorized AI agent addresses
    mapping(address => bool) public authorizedAgents;

    /// @notice All proposals
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    /// @notice Minimum time between parameter updates (anti-spam)
    uint256 public constant MIN_UPDATE_INTERVAL = 1 hours;

    /// @notice Events
    event ProposalSubmitted(
        uint256 indexed proposalId,
        address indexed proposer,
        bytes32 zkProofHash
    );
    
    event ProposalVerified(uint256 indexed proposalId);
    
    event ProposalExecuted(
        uint256 indexed proposalId,
        uint256 newGasLimit,
        uint256 newBlockTime,
        uint256 newMaxTPS
    );
    
    event AgentAuthorized(address indexed agent);
    event AgentRevoked(address indexed agent);

    constructor(address _rahuL2, address _zkVerifier) Ownable(msg.sender) {
        require(_rahuL2 != address(0), "Invalid L2 address");
        require(_zkVerifier != address(0), "Invalid verifier address");
        
        rahuL2 = IRahuL2(_rahuL2);
        zkVerifier = IZKVerifier(_zkVerifier);
    }

    /**
     * @notice Submit optimization proposal with ZK proof
     * @param proposedGasLimit New gas limit
     * @param proposedBlockTime New block time
     * @param proposedMaxTPS New max TPS
     * @param zkProofHash Hash of the ZK proof
     * @param reasoning Human-readable reasoning
     */
    function submitProposal(
        uint256 proposedGasLimit,
        uint256 proposedBlockTime,
        uint256 proposedMaxTPS,
        bytes32 zkProofHash,
        string calldata reasoning
    ) external nonReentrant returns (uint256) {
        require(authorizedAgents[msg.sender], "Not authorized agent");
        require(zkProofHash != bytes32(0), "Invalid proof hash");
        require(proposedGasLimit > 0, "Invalid gas limit");
        require(proposedBlockTime > 0, "Invalid block time");
        require(proposedMaxTPS > 0, "Invalid max TPS");

        // Get current params
        (
            uint256 currentGasLimit,
            uint256 currentBlockTime,
            uint256 currentMaxTPS,
            uint256 lastUpdate
        ) = rahuL2.getParams();

        // Check minimum interval
        require(
            block.timestamp >= lastUpdate + MIN_UPDATE_INTERVAL,
            "Too soon to update"
        );

        proposalCount++;

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            currentGasLimit: currentGasLimit,
            proposedGasLimit: proposedGasLimit,
            currentBlockTime: currentBlockTime,
            proposedBlockTime: proposedBlockTime,
            currentMaxTPS: currentMaxTPS,
            proposedMaxTPS: proposedMaxTPS,
            zkProofHash: zkProofHash,
            verified: false,
            executed: false,
            timestamp: block.timestamp,
            reasoning: reasoning
        });

        emit ProposalSubmitted(proposalCount, msg.sender, zkProofHash);

        return proposalCount;
    }

    /**
     * @notice Verify proposal using ZK proof
     * @param proposalId Proposal ID
     * @param proof ZK proof data
     */
    function verifyProposal(
        uint256 proposalId,
        bytes calldata proof
    ) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id == proposalId, "Proposal not found");
        require(!proposal.verified, "Already verified");
        require(!proposal.executed, "Already executed");

        // Verify ZK proof
        bool isValid = zkVerifier.verifyProof(
            proof,
            proposal.zkProofHash,
            abi.encodePacked(
                proposal.currentGasLimit,
                proposal.proposedGasLimit,
                proposal.currentBlockTime,
                proposal.proposedBlockTime,
                proposal.currentMaxTPS,
                proposal.proposedMaxTPS
            )
        );

        require(isValid, "Invalid ZK proof");

        proposal.verified = true;
        emit ProposalVerified(proposalId);
    }

    /**
     * @notice Execute verified proposal
     * @param proposalId Proposal ID
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id == proposalId, "Proposal not found");
        require(proposal.verified, "Not verified");
        require(!proposal.executed, "Already executed");

        // Execute parameter update on RahuL2
        rahuL2.updateParams(
            proposal.proposedGasLimit,
            proposal.proposedBlockTime,
            proposal.proposedMaxTPS
        );

        proposal.executed = true;

        emit ProposalExecuted(
            proposalId,
            proposal.proposedGasLimit,
            proposal.proposedBlockTime,
            proposal.proposedMaxTPS
        );
    }

    /**
     * @notice Get proposal details
     * @param proposalId Proposal ID
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        uint256 proposedGasLimit,
        uint256 proposedBlockTime,
        uint256 proposedMaxTPS,
        bool verified,
        bool executed,
        string memory reasoning
    ) {
        Proposal memory p = proposals[proposalId];
        return (
            p.proposer,
            p.proposedGasLimit,
            p.proposedBlockTime,
            p.proposedMaxTPS,
            p.verified,
            p.executed,
            p.reasoning
        );
    }

    /**
     * @notice Authorize AI agent
     * @param agent Agent address
     */
    function authorizeAgent(address agent) external onlyOwner {
        require(agent != address(0), "Invalid address");
        authorizedAgents[agent] = true;
        emit AgentAuthorized(agent);
    }

    /**
     * @notice Revoke AI agent authorization
     * @param agent Agent address
     */
    function revokeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = false;
        emit AgentRevoked(agent);
    }
}