#!/usr/bin/python3

import os

from brownie import Blacklist, accounts, config
from dotenv import load_dotenv
load_dotenv()

# version "omg it actually works"
def main():
    dev = accounts.add(config["wallets"]["from_key"])
    Blacklist.deploy({"from": dev}, publish_source=False)
