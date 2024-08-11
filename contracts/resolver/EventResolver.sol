// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

import {SchemaResolver} from './SchemaResolver.sol';

import {IEAS, Attestation} from '../IEAS.sol';

contract Ownable {
  address public owner;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only the owner can call this function');
    _; // Continue with the function if the modifier check passes
  }
}

/// @title EventResolver
contract EventResolver is SchemaResolver, Ownable {
  // if maxTicketCount is 0, means unlimited tickets
  uint32 public initialMaxTicketCount;
  uint32 public ticketsSold = 0;
  uint256 public validFrom;
  uint256 public validTo;
  uint256 public ticketPrice;

  constructor(
    IEAS eas,
    uint32 _initialMaxTicketCount,
    uint256 _ticketPrice,
    uint256 _validFrom,
    uint256 _validTo
  ) SchemaResolver(eas) {
    initialMaxTicketCount = _initialMaxTicketCount;
    ticketPrice = _ticketPrice;
    validFrom = _validFrom;
    validTo = _validTo;
  }

  function isPayable() public pure override returns (bool) {
    return true;
  }

  function onAttest(
    Attestation calldata /*attestation*/,
    uint256 value
  ) internal override returns (bool) {
    // Check time limits (if specified)
    require(
      (validFrom == 0 || block.timestamp >= validFrom) &&
        (validTo == 0 || block.timestamp <= validTo),
      'Ticket sale is not available at this time'
    );

    // Check and limit the number of tickets
    require(
      initialMaxTicketCount == 0 || ticketsSold < initialMaxTicketCount,
      'No more tickets available'
    );

    // Check ticket price
    require(value >= ticketPrice, 'Send with the correct ticket price');

    // Transfer the value to the owner
    if (value > 0) {
      payable(owner).transfer(value);
    }

    ticketsSold++;
    return true;
  }

  function addTickets(uint32 moreTickets) public onlyOwner {
    initialMaxTicketCount += moreTickets;
  }

  function setValidFrom(uint256 _validFrom) public onlyOwner {
    validFrom = _validFrom;
  }

  function setValidTo(uint256 _validTo) public onlyOwner {
    validTo = _validTo;
  }

  function setTicketPric(uint256 _ticketPrice) public onlyOwner {
    ticketPrice = _ticketPrice;
  }

  function onRevoke(
    Attestation calldata /*attestation*/,
    uint256 /*value*/
  ) internal pure override returns (bool) {
    return true;
  }
}
