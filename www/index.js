// SPDX-License-Identifier: UNLICENSED
/*
  Interact with the reference Blacklist contract on Rinkeby

  URL: https://dapps.unintuitive.org/blacklist/

  1. Switch to "Rinkeby" in MetaMask, and click on [Enable Ethereum].
  1. Open browser's javascript console.
  1. Interact and watch the logs.

  Contributors.

  mb@unintuitive.org
  adam_AT_THE_D0MA1N_CALLED_americanretailusa.com 

  [Ugly notes moved to the bottom]
*/

var CONTRACT_ADDRESS = "0x44b2A4Ae5ce1A1004F32620a48f18D3bDa8Cbd4a";

console.log("selectedAddress we are using upon loading: " + window.ethereum.selectedAddress);
// if window.ethereum.selectedAddress has a non-null value at this point, we could disable the [Enable Ethereum]
// button here -- $("#enableEthereumButton")
// FIXME: I thought this always agreed with MM's "connected" indicator. I've seen once where MM was "connected" but this
// was null !
// UPDATE: if metamask extension disabled, the above throws an "undefined" error, as expected.

if (typeof window.ethereum === 'undefined') {
  alert('Wallet provider is NOT Available!!');  // How do we respond?
}

function logEvent(eventName, content, _error) {
  let message = "[event fired: '" + eventName + "'] " + "content=" + JSON.stringify(content);
  if (_error) {
    message = message + ", error=" + JSON.stringify(_error);
  }
  console.log(message);
}

var web3 = new Web3(window.ethereum);  // FYI, Web3.givenProvider appears to be an alias for window.ethereum

// passes passes connectionInfo which may or may not have a chainId memeber.
window.ethereum.on('connect', function(connectInfo) {
  logEvent('connect', connectInfo);
  //
  // This event appears to be about "connected to network foobar for the first time" and that's it. When you load the page
  // for the first time, if MM is enabled, even if you are "not connected", this will fire with the chain that MM is pointing
  // to.
  //
  // WEIRD! -- if we are not "connected" in the MM sense, this event still fires. "we are connected to network foo", even
  // though MM says "not connected". This 'connect' seems to be ONLY about chains connecting for the first time. Not when
  // chains switch. If I "connect" in the wallet sense, this does not fire!
  // this fires when you eth_requestAccounts ... NOT when the pages gets loaded and you're already connected
  // Update, ok, now I see {"chainId":"0x1"} ... I guess the passed arg is context-dependant. Watch this space.
  // You might expect switching to a network would fire this. Nope. Look to 'chainChanged' for that.
  //
  if (typeof connectInfo.chainId && connectInfo.chainId === "0x4") {
    // code that responds to "we are now on rinkeby"
  } else if (typeof connectInfo.chainId && connectInfo.chainId !== "0x4") {
    // code that responds to "we are now on some chain but it's not rinkeby"
  } else {
    debugger;
    // this message did not have a `chainId` (is this an error?)
  }
});

// passes ..nothing? empty string?
window.ethereum.on('disconnect', function(content) {
  // I do not recall seeing this fire. Update here.
  logEvent('disconnect', content);
});

// passes account="0xffff...." (string, address)
window.ethereum.on('accountsChanged', function(account) {
  logEvent('accountsChanged', account);
  // It looks like this fires if you press "Enable Ethereum" and end up having to "Confirm".
  // If you click it and get no confirm, this will not fire, but
  //
  //   window.ethereum.request({ method: 'eth_requestAccounts' })
  //
  // will return the address(es) regardless.
  //
  // An empty array means we are not connected at all.
  //
  // Sublty: it looks like the "accounts" returned when not connected is an empty array, but
  // window.ethereum.selectedAddress gets set to `null`
  //
  // If and only if `accounts === []` should we enable $("#enableEthereumButton")
  // If account has a non-empty value $("#enableEthereumButton") should be DISABLED here
  // (...I think)
});

// passes toChain="0x5" (A STRING!!!!!!)
// [see: https://chainid.network/]
window.ethereum.on('chainChanged', function(toChain) {
  logEvent('chainChanged', toChain);
  // NOTE: this DOES fire even when the user is not "connected"
  // We COULD have separate testbeds for each testnet . The contract address (or even the existence of the contract)
  // will be chain-dependent.
  //
  // Or... we could simply have a mapping:
  //
  //  blacklistContractAddresses = {"0x5": "0xffffff..."}  // mapping of chain ID and contract address.
  //
  // Change the contract value, re-init BLACKLIST and put up a conspicous banner if we are on a testnet
  // (maybe nothing if mainnet)
  //
  // Also, using the same info (contract address) we could have a link to the correct etherscan page for the contract.
  // Note that when you e.g. load the page 'connect' with chainId is fired. When you witch chains, this is fired. They
  // are different events.
  if (toChain === "0x4") {
    // code that responds to "we switched from chain X to Y, where Y=0x4
  } else if (toChain !== "0x4") {
    // code that responds to "we switched from chain X to Y, where Y!=0x4
  } else {
    // Handle this! I don't recall seeing anything land here.
    alert("handle me!");
  }
});

// passes ...some message
window.ethereum.on('message', function(content) {
  logEvent('message', content);
  // Anything that shows up here should be explicitly handled
});

function getBlacklistContract() {
  // what's the smart way to streamline all this stuff?
  var abi = [
    {
      "inputs": [
	{
	  "internalType": "address",
	  "name": "_address",
	  "type": "address"
	}
      ],
      "name": "blacklistAddress",
      "outputs": [
	{
	  "internalType": "bool",
	  "name": "",
	  "type": "bool"
	}
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
	{
	  "indexed": true,
	  "internalType": "address",
	  "name": "_address",
	  "type": "address"
	}
      ],
      "name": "Blacklisted",
      "type": "event"
    },
    {
      "inputs": [
	{
	  "internalType": "address",
	  "name": "_address",
	  "type": "address"
	}
      ],
      "name": "isBlacklisted",
      "outputs": [
	{
	  "internalType": "bool",
	  "name": "",
	  "type": "bool"
	}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  return new web3.eth.Contract(abi, CONTRACT_ADDRESS);
}
// If we're going to be using globals, they should appear at the top of the file.
var BLACKLIST = getBlacklistContract();

async function getAccount() {
  window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
    console.log("we succesfully connected to *A* wallet. the data we got was `" + JSON.stringify(accounts) + "`");
  });
}

$("#enableEthereumButton").click(function() {
  getAccount();
});

$("#getIsBlacklisted").click(function() {
  let address = $("#isBlacklisted").val();
  transaction = BLACKLIST.methods.isBlacklisted(address);
  transaction.call({from: window.ethereum.selectedAddress}, function (error, isBlacklisted) {
    if (!error) {
      if (isBlacklisted) {
        console.log(address + " IS blacklisted");
      } else {
        console.log(address + " IS NOT blacklisted");
      }
    } else {
      console.log("error while checking blacklisted status: " + error);
    }
  });
});

$("#blacklistAddress").click(function() {
  let address = $("#blacklistedAddress").val();
  transaction = BLACKLIST.methods.blacklistAddress(address);
  transaction.send({from: window.ethereum.selectedAddress})
    .on('transactionHash', function(hash){
      logEvent('transactionHash', hash);
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      // NOTE: we abuse error= field for confirmation number
      logEvent('confirmation', receipt, "(conf_num=" + confirmationNumber + "[not_an_error])");
      // We have the confirmation number here. If someone blacklists an address, we could have a widget
      // that shows a confirmation count
    })
    .on('receipt', function(receipt){
      logEvent('receipt', reciept);
    })
    .on('error', function(error, receipt) {
      // If the transaction was rejected by the network with a receipt,
      // the second parameter will be the receipt.
      logEvent('error', receipt, error);
    })
    .finally(function() {
      // always runs (for each event?)
    });
});

/*
  Outstanding weird bug...

  When I switch wallets in MM, and then do a "blacklistAddress", I get a weird error deep in the guts that I cannot diagnose.
  If I do a subsequent blacklistAddress with the now-switched-to wallet, is ok.
  UPDATE: Maybe not... need to examine [object] passed to listeners

  Stuff to be investigated/implemented...

  Web3.givenProvider  // <-- what is this, do we care?
  web3.eth.accounts.getAccounts()  // <-- do we care?
  //// To sign a transaction
  web3.eth.accounts.signTransaction({
  to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
  value: '1000000000',
  gas: 2000000
  }, '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
  .then(console.log);
  //// To resolve a *.eth name
  web3.eth.ens.resolver('ethereum.eth').then(function (contract) {
  console.log(contract);
  });
*/
