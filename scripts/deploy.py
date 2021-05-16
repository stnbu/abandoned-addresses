#!/usr/bin/python3

import os
import json

from brownie import Blacklist, accounts, config
from dotenv import load_dotenv
load_dotenv()

# version "omg it actually works"
def main():
    dev = accounts.add(config["wallets"]["from_key"])
    contract = Blacklist.deploy({"from": dev}, publish_source=False)
    with open('./www/deployments/default.js', 'w') as f:
        f.write((
            'var CONTRACT_ADDRESS = "{0}";\n'
            'var ABI = {1};\n'
        ).format(contract.address, json.dumps(contract.abi)))
