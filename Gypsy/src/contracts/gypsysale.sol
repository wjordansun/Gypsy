// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./gypsyproperty.sol";

contract GypsySale is GypsyProperty {
  
  event PropertySale(address indexed _from, address indexed _to, uint256 indexed _tokenId);

  modifier onlyOwnerOf(uint _propertyId) {
    require(msg.sender == propertyToOwner[_propertyId], "Must own this property");
    _;
  }
  
  modifier forSale(uint _propertyId) {
    require(properties[_propertyId].forSale == true, "Not for Sale");
    _;
  }

  function _toWei(uint value) internal pure returns(uint) {
    return value * 10**18;
  }

  function withdraw() external onlyOwner {
    address _owner = owner();
    payable(_owner).transfer(address(this).balance);
  }

  function openSale(uint _propertyId) external onlyOwnerOf(_propertyId) {
    properties[_propertyId].forRent = false;
    properties[_propertyId].forSale = true;
  }

  function closeSale(uint _propertyId) external onlyOwnerOf(_propertyId) forSale(_propertyId) {
    properties[_propertyId].forSale = false;
  }

  function buyProperty(uint _propertyId) external payable forSale(_propertyId) {
    require(msg.value == _toWei(properties[_propertyId].price), "Incorrect price inputted");
    ownerPropertyCount[propertyToOwner[_propertyId]]--;
    ownerPropertyCount[msg.sender]++;
    propertyToOwner[_propertyId] = msg.sender;
    //properties[_propertyId].forSale = false;
    emit PropertySale(address(this), msg.sender, _propertyId);
  }

}