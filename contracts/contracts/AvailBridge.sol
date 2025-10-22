// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AvailBridge
 * @notice Bridge contract for posting L2 data to Avail DA layer
 * @dev Stores data availability commitments on-chain
 */
contract AvailBridge is Ownable {
    
    struct DataCommitment {
        bytes32 dataHash;
        bytes32 availTxHash;
        uint256 blockNumber;
        uint256 timestamp;
        bool verified;
    }

    /// @notice Data commitments by block number
    mapping(uint256 => DataCommitment) public commitments;

    /// @notice Latest posted block
    uint256 public latestBlock;

    /// @notice Avail app ID
    uint256 public availAppId;

    /// @notice Events
    event DataPosted(
        uint256 indexed blockNumber,
        bytes32 dataHash,
        bytes32 availTxHash
    );

    event DataVerified(uint256 indexed blockNumber);

    constructor(uint256 _availAppId) Ownable(msg.sender) {
        availAppId = _availAppId;
    }

    /**
     * @notice Post L2 block data commitment
     * @param blockNumber L2 block number
     * @param dataHash Hash of the block data
     * @param availTxHash Avail transaction hash
     */
    function postData(
        uint256 blockNumber,
        bytes32 dataHash,
        bytes32 availTxHash
    ) external onlyOwner {
        require(blockNumber > latestBlock, "Block already posted");
        require(dataHash != bytes32(0), "Invalid data hash");
        require(availTxHash != bytes32(0), "Invalid Avail tx hash");

        commitments[blockNumber] = DataCommitment({
            dataHash: dataHash,
            availTxHash: availTxHash,
            blockNumber: blockNumber,
            timestamp: block.timestamp,
            verified: false
        });

        latestBlock = blockNumber;

        emit DataPosted(blockNumber, dataHash, availTxHash);
    }

    /**
     * @notice Verify data availability
     * @param blockNumber Block number to verify
     */
    function verifyData(uint256 blockNumber) external {
        DataCommitment storage commitment = commitments[blockNumber];
        require(commitment.blockNumber == blockNumber, "Commitment not found");
        require(!commitment.verified, "Already verified");

        // In production: verify Avail inclusion proof
        // For hackathon: simple verification
        commitment.verified = true;

        emit DataVerified(blockNumber);
    }

    /**
     * @notice Get data commitment
     * @param blockNumber Block number
     */
    function getCommitment(uint256 blockNumber) external view returns (
        bytes32 dataHash,
        bytes32 availTxHash,
        uint256 timestamp,
        bool verified
    ) {
        DataCommitment memory c = commitments[blockNumber];
        return (c.dataHash, c.availTxHash, c.timestamp, c.verified);
    }

    /**
     * @notice Check if data is available
     * @param blockNumber Block number
     */
    function isDataAvailable(uint256 blockNumber) external view returns (bool) {
        return commitments[blockNumber].verified;
    }

    /**
     * @notice Update Avail app ID
     * @param _availAppId New app ID
     */
    function updateAppId(uint256 _availAppId) external onlyOwner {
        availAppId = _availAppId;
    }
}