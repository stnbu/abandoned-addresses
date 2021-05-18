// SPDX-License-Identifier: UNLICENSED
//
// AbandonedAddresses -- maintain knowledge of addresses that have been abandoned by their owners.
// PoC/WiP ... and only lightly tested. Have fun, look around, contributions enthusiastically welcomed!
//
//    Development Home: https://github.com/stnbu/abandoned-addresses
//

pragma solidity ^0.8.0;

contract AbandonedAddresses {

    // No constructor currently needed or included

    // Private because we are implementing an interface here and this isn't part of it.
    mapping(address => bool) private abandoned;
    // MUST be emitted with every call to `abandonAddress` that successfully abandons an address.
    event AddressAbandoned(address indexed _address);

    // External, for now. Do we want these to be "public"?
    function isAbandoned(address _address) external view returns (bool) {
        return abandoned[_address];
    }

    function abandonAddress(address _address) external returns (bool) {
        require(msg.sender == _address, "Cannot abandon addresses you do not own!");
        abandoned[msg.sender] = true;
        emit AddressAbandoned(msg.sender);
        return abandoned[msg.sender];
    }
}
