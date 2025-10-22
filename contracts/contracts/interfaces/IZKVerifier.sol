// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IZKVerifier {
    function verifyProof(
        bytes calldata proof,
        bytes32 proofHash,
        bytes calldata publicInputs
    ) external returns (bool);
}