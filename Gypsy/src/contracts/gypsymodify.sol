// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./gypsyownership.sol";

contract GypsyModify is GypsyOwnership {
  
  function changePropertyAddress(uint _propertyId, string calldata _newAddress) external onlyOwnerOf(_propertyId) {
    properties[_propertyId].propertyAddress = _newAddress;
  }

  function changePrice(uint _propertyId, uint _newPrice) external onlyOwnerOf(_propertyId) {
    properties[_propertyId].price = _newPrice;
  }

  function changeRentPrice(uint _propertyId, uint _newRentPrice) external onlyOwnerOf(_propertyId) {
    properties[_propertyId].rentPrice = _newRentPrice;
  }

  function getPropertiesByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerPropertyCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < properties.length; i++) {
      if (propertyToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

}