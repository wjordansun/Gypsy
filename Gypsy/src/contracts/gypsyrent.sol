// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./gypsysale.sol";

contract GypsyRent is GypsySale {
  
  event PropertyRented();

  modifier forRent(uint _propertyId) {
    require(properties[_propertyId].forRent == true, "Not for Sale");
    _;
  }

  modifier isRenter(uint _propertyId) {
    require(properties[_propertyId].renter == msg.sender, "Not renter");
    _;
  }

  function openRent(uint _propertyId) external onlyOwnerOf(_propertyId) {
    properties[_propertyId].forSale = false;
    properties[_propertyId].forRent = true;
  }

  function closeRent(uint _propertyId) external onlyOwnerOf(_propertyId) {
    properties[_propertyId].forRent = false;
  }

  function rentProperty(uint _propertyId) external forRent(_propertyId) {
    properties[_propertyId].renter = msg.sender;
    properties[_propertyId].forRent = false;
    emit PropertyRented();
  }

  function payRent(uint _propertyId) external payable isRenter(_propertyId) {
    require(msg.value == _toWei(properties[_propertyId].rentPrice), "Incorrect rent price inputted");
    //rent paid, do something
  }

}