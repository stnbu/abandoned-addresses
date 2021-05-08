// The idea has the advantage of being super simple! Create a contract that cointains blacklisted addresses.

// UNTESTED UNCOMPILED pseudocode ...

pragma solidity ^0.8.0;

contract Blacklist {

    private mapping(address => bool) blacklist;

    // We have no owner, nor anything to construct.
    // We get by on our own reputation alone.

    public function isBlacklisted(address _address) (bool) {
	return blacklist[_address];
    }

    public function blacklistAddress(address _address) {
	require(msg.sender == _address);
	blacklist[msg.sender] = true;
    }
}
