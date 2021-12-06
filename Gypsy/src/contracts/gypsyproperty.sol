// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./ownable.sol";

contract GypsyProperty is Ownable {

  event NewProperty(uint propertyId, string propertyAddress, uint rentPrice, uint price);

  struct Property {
    string propertyAddress;
    address owner;
    address renter;
    uint256 rentPrice;
    uint256 rentDueTime;
    uint256 price;
    bool forSale;
    bool forRent;
  }

  Property[] public properties;

  mapping (uint => address) public propertyToOwner;
  mapping (address => uint) public ownerPropertyCount;

  function createProperty(string memory _propertyAddress, uint256 _rentPrice, uint256 _price) public onlyOwner {
    properties.push(Property(_propertyAddress, msg.sender, address(0), _rentPrice, 0, _price, false, false));
    uint id = properties.length - 1;
    propertyToOwner[id] = msg.sender;
    ownerPropertyCount[msg.sender]++;
    emit NewProperty(id, _propertyAddress, _rentPrice, _price);
  }

}
