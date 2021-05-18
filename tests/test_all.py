#!/usr/bin/env python3
import pytest
from brownie import network, AbandonedAddresses, config, accounts

@pytest.fixture(scope="module")
def get_account():
    if (network.show_active() == "development"):
        return accounts[0]
    if network.show_active() in config["networks"]:
        return accounts.add(config["wallets"]["from_key"])
    else:
        pytest.skip("Invalid network/wallet specified ")

def test_deploy(get_account):
    assert AbandonedAddresses.deploy({"from": get_account})
