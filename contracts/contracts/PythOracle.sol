// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PythOracle
 * @notice Integration with Pyth Network for real-time price feeds
 * @dev Used by AI agent to monitor gas prices and network metrics
 */
contract PythOracle is Ownable {
    
    /// @notice Pyth contract address
    IPyth public pyth;

    /// @notice Price feed IDs
    bytes32 public gasPriceFeedId;
    bytes32 public ethPriceFeedId;

    /// @notice Latest metrics
    struct NetworkMetrics {
        uint256 gasPrice;      // in gwei
        uint256 ethPrice;      // in USD (8 decimals)
        uint256 timestamp;
        uint256 confidence;
    }

    NetworkMetrics public latestMetrics;

    /// @notice Events
    event MetricsUpdated(
        uint256 gasPrice,
        uint256 ethPrice,
        uint256 timestamp
    );

    event PriceFeedUpdated(bytes32 feedId, string feedType);

    constructor(
        address _pyth,
        bytes32 _gasPriceFeedId,
        bytes32 _ethPriceFeedId
    ) Ownable(msg.sender) {
        require(_pyth != address(0), "Invalid Pyth address");
        pyth = IPyth(_pyth);
        gasPriceFeedId = _gasPriceFeedId;
        ethPriceFeedId = _ethPriceFeedId;
    }

    /**
     * @notice Update network metrics from Pyth feeds
     * @param priceUpdateData Pyth price update data
     */
    function updateMetrics(
        bytes[] calldata priceUpdateData
    ) external payable {
        // Get update fee
        uint256 fee = pyth.getUpdateFee(priceUpdateData);
        require(msg.value >= fee, "Insufficient fee");

        // Update Pyth prices
        pyth.updatePriceFeeds{value: fee}(priceUpdateData);

        // Get ETH price
        PythStructs.Price memory ethPrice = pyth.getPrice(ethPriceFeedId);
        
        // Get gas price (if available, else use tx.gasprice)
        uint256 currentGasPrice = tx.gasprice / 1 gwei;
        
        // Store metrics
        latestMetrics = NetworkMetrics({
            gasPrice: currentGasPrice,
            ethPrice: uint256(uint64(ethPrice.price)),
            timestamp: block.timestamp,
            confidence: uint256(uint64(ethPrice.conf))
        });

        emit MetricsUpdated(
            currentGasPrice,
            uint256(uint64(ethPrice.price)),
            block.timestamp
        );
    }

    /**
     * @notice Get latest metrics
     */
    function getLatestMetrics() external view returns (
        uint256 gasPrice,
        uint256 ethPrice,
        uint256 timestamp,
        uint256 confidence
    ) {
        return (
            latestMetrics.gasPrice,
            latestMetrics.ethPrice,
            latestMetrics.timestamp,
            latestMetrics.confidence
        );
    }

    /**
     * @notice Get current gas price in gwei
     */
    function getCurrentGasPrice() external view returns (uint256) {
        return tx.gasprice / 1 gwei;
    }

    /**
     * @notice Get ETH price from Pyth
     */
    function getEthPrice() external view returns (int64 price, uint64 conf, int32 expo) {
        PythStructs.Price memory priceData = pyth.getPrice(ethPriceFeedId);
        return (priceData.price, priceData.conf, priceData.expo);
    }

    /**
     * @notice Update price feed IDs
     */
    function updatePriceFeed(bytes32 feedId, string calldata feedType) external onlyOwner {
        if (keccak256(bytes(feedType)) == keccak256(bytes("gas"))) {
            gasPriceFeedId = feedId;
        } else if (keccak256(bytes(feedType)) == keccak256(bytes("eth"))) {
            ethPriceFeedId = feedId;
        }
        emit PriceFeedUpdated(feedId, feedType);
    }

    /**
     * @notice Withdraw excess fees
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}