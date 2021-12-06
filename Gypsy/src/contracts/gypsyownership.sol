// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./gypsyrent.sol";
import "./erc721.sol";

contract GypsyOwnership is GypsyRent, ERC721 {
  
  mapping (uint => address) propertyApprovals;

  function balanceOf(address _owner) external view override returns (uint256) {
    return ownerPropertyCount[_owner];
  }

  function ownerOf(uint256 _propertyId) external view override returns (address) {
    return propertyToOwner[_propertyId];
  }

  function _transfer(address _from, address _to, uint256 _propertyId) private {
    ownerPropertyCount[_to]++;
    ownerPropertyCount[_from]--;
    propertyToOwner[_propertyId] = _to;
    emit Transfer(_from, _to, _propertyId);
  }

  function transferFrom(address _from, address _to, uint256 _propertyId) external override {
    require (propertyToOwner[_propertyId] == msg.sender || propertyApprovals[_propertyId] == msg.sender);
    _transfer(_from, _to, _propertyId);
  }

  function approve(address _approved, uint256 _propertyId) external payable override onlyOwnerOf(_propertyId) {
    propertyApprovals[_propertyId] = _approved;
    emit Approval(msg.sender, _approved, _propertyId);
  }

}