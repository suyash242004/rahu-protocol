// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "./interfaces/IRahuL2.sol";

/**
 * @title RahuL2
 * @notice Main Layer 2 contract for Rahu Protocol
 * @dev Self-improving L2 with AI-driven parameter optimization
 */
contract RahuL2 is 
    IRahuL2,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable 
{
    /// @notice Current L2 parameters
    struct L2Params {
        uint256 gasLimit;
        uint256 blockTime; // in seconds
        uint256 maxTPS;
        uint256 lastUpdate;
    }

    /// @notice Block data structure
    struct BlockData {
        uint256 blockNumber;
        bytes32 stateRoot;
        bytes32 dataHash;
        uint256 timestamp;
        bool finalized;
    }

    /// @notice Current L2 parameters
    L2Params public params;

    /// @notice AI Governance contract address
    address public aiGovernance;

    /// @notice ZK Verifier contract address
    address public zkVerifier;

    /// @notice Pyth Oracle contract address
    address public pythOracle;

    /// @notice Avail bridge contract address
    address public availBridge;

    /// @notice Block submissions
    mapping(uint256 => BlockData) public blocks;
    uint256 public latestBlockNumber;

    /// @notice Optimization proposals count
    uint256 public proposalCount;

    /// @notice Events
    event BlockSubmitted(
        uint256 indexed blockNumber,
        bytes32 stateRoot,
        bytes32 dataHash,
        uint256 timestamp
    );
    
    event BlockFinalized(uint256 indexed blockNumber);
    
    event ParamsUpdated(
        uint256 newGasLimit,
        uint256 newBlockTime,
        uint256 newMaxTPS,
        address proposer
    );
    
    event GovernanceUpdated(address newGovernance);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initialize the contract
     * @param _initialGasLimit Initial gas limit
     * @param _initialBlockTime Initial block time in seconds
     * @param _initialMaxTPS Initial max transactions per second
     */
    function initialize(
        uint256 _initialGasLimit,
        uint256 _initialBlockTime,
        uint256 _initialMaxTPS
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        params = L2Params({
            gasLimit: _initialGasLimit,
            blockTime: _initialBlockTime,
            maxTPS: _initialMaxTPS,
            lastUpdate: block.timestamp
        });

        latestBlockNumber = 0;
        proposalCount = 0;
    }

    /**
     * @notice Submit a new L2 block
     * @param stateRoot State root of the block
     * @param dataHash Hash of the block data
     */
    function submitBlock(
        bytes32 stateRoot,
        bytes32 dataHash
    ) external onlyOwner nonReentrant {
        require(stateRoot != bytes32(0), "Invalid state root");
        require(dataHash != bytes32(0), "Invalid data hash");

        latestBlockNumber++;

        blocks[latestBlockNumber] = BlockData({
            blockNumber: latestBlockNumber,
            stateRoot: stateRoot,
            dataHash: dataHash,
            timestamp: block.timestamp,
            finalized: false
        });

        emit BlockSubmitted(latestBlockNumber, stateRoot, dataHash, block.timestamp);
    }

    /**
     * @notice Finalize a block after verification
     * @param blockNumber Block number to finalize
     */
    function finalizeBlock(uint256 blockNumber) external {
        require(msg.sender == zkVerifier, "Only verifier");
        require(blocks[blockNumber].blockNumber == blockNumber, "Block not found");
        require(!blocks[blockNumber].finalized, "Already finalized");

        blocks[blockNumber].finalized = true;
        emit BlockFinalized(blockNumber);
    }

    /**
     * @notice Update L2 parameters (called by AI Governance)
     * @param newGasLimit New gas limit
     * @param newBlockTime New block time
     * @param newMaxTPS New max TPS
     */
    function updateParams(
        uint256 newGasLimit,
        uint256 newBlockTime,
        uint256 newMaxTPS
    ) external override {
        require(msg.sender == aiGovernance, "Only AI governance");
        require(newGasLimit > 0, "Invalid gas limit");
        require(newBlockTime > 0, "Invalid block time");
        require(newMaxTPS > 0, "Invalid max TPS");

        // Apply safety bounds (max 2x change)
        require(
            newGasLimit <= params.gasLimit * 2 &&
            newGasLimit >= params.gasLimit / 2,
            "Gas limit change too large"
        );

        params.gasLimit = newGasLimit;
        params.blockTime = newBlockTime;
        params.maxTPS = newMaxTPS;
        params.lastUpdate = block.timestamp;

        proposalCount++;

        emit ParamsUpdated(newGasLimit, newBlockTime, newMaxTPS, msg.sender);
    }

    /**
     * @notice Get current parameters
     */
    function getParams() external view override returns (
        uint256 gasLimit,
        uint256 blockTime,
        uint256 maxTPS,
        uint256 lastUpdate
    ) {
        return (
            params.gasLimit,
            params.blockTime,
            params.maxTPS,
            params.lastUpdate
        );
    }

    /**
     * @notice Get block data
     * @param blockNumber Block number
     */
    function getBlock(uint256 blockNumber) external view returns (
        bytes32 stateRoot,
        bytes32 dataHash,
        uint256 timestamp,
        bool finalized
    ) {
        BlockData memory b = blocks[blockNumber];
        return (b.stateRoot, b.dataHash, b.timestamp, b.finalized);
    }

    /**
     * @notice Set AI Governance contract
     * @param _aiGovernance New AI governance address
     */
    function setAIGovernance(address _aiGovernance) external onlyOwner {
        require(_aiGovernance != address(0), "Invalid address");
        aiGovernance = _aiGovernance;
        emit GovernanceUpdated(_aiGovernance);
    }

    /**
     * @notice Set ZK Verifier contract
     * @param _zkVerifier New verifier address
     */
    function setZKVerifier(address _zkVerifier) external onlyOwner {
        require(_zkVerifier != address(0), "Invalid address");
        zkVerifier = _zkVerifier;
    }

    /**
     * @notice Set Pyth Oracle contract
     * @param _pythOracle New oracle address
     */
    function setPythOracle(address _pythOracle) external onlyOwner {
        require(_pythOracle != address(0), "Invalid address");
        pythOracle = _pythOracle;
    }

    /**
     * @notice Set Avail Bridge contract
     * @param _availBridge New bridge address
     */
    function setAvailBridge(address _availBridge) external onlyOwner {
        require(_availBridge != address(0), "Invalid address");
        availBridge = _availBridge;
    }

    /**
     * @notice Required by UUPSUpgradeable
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}