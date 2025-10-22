// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IRahuL2 {
    function updateParams(
        uint256 newGasLimit,
        uint256 newBlockTime,
        uint256 newMaxTPS
    ) external;

    function getParams() external view returns (
        uint256 gasLimit,
        uint256 blockTime,
        uint256 maxTPS,
        uint256 lastUpdate
    );
}