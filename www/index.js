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

var Blacklist = null;
var web3 = null;

console.log("selectedAddress we are using upon loading: " + window.ethereum.selectedAddress);

if (typeof window.ethereum === 'undefined') {
  alert('Wallet provider is NOT Available!!');  // How do we respond?
}

// passes address="0xfffff...." (string, address)
window.ethereum.on('connect', function(address) {
  console.log("connected with " + address);
}); // works when you eth_requestAccounts ... NOT when the pages gets loaded and you're already connected ... returns addr

// passes ..nothing? empty string?
window.ethereum.on('disconnect', function(x) {
  console.log("AN address disconnected. If there's an `x` it's: " + x);
}); // works, returns nothing

// passes account="0xffff...." (string, address)
window.ethereum.on('accountsChanged', function(account) { // my guess, this fires when window.ethereum.selectedAddress changes.
  //
  // I believe this is the ONLY place we need to keep up with changes to the "default" address, a.k.a. "window.ethereum.selectedAddress"
  // MetaMask tries to keep up with the wallet the user thinks they're using. It sets window.ethereum.selectedAddress accordingly and this event gets fired.
  // So for example, this is where we would enable, disable the "connect to ethereum" button and update any badges or displayed addresses.
  // Empty string means we are not connected at all. Any other value is the address of the global wallet that this dapp thinks its using (!!!)
  // Sublty: it looks like the "account" returned when not connected is an empty string, but window.ethereum.selectedAddress gets set to `null`
  console.log("[WE WILL REACT TO] accounts changed TO `" + account + "`");
});

// passes toChain="0x5" (string, chain ID) [see: https://chainid.network/]
window.ethereum.on('chainChanged', function(toChain) {
  // We COULD have separate testbeds for each testnet . The contract address (or even the existence of the contract) will be chain-dependent.
  // Or... we could simply have a mapping:
  //
  //  blacklistContractAddresses = {"0x5": "0xffffff..."}  // mapping of chain ID and contract address.
  //
  // Change the contract value, re-init Blacklist and put up a conspicous banner if we are on a testnet (maybe nothing if mainnet)
  console.log("chain changed TO " + toChain);
});

// passes ...some message
window.ethereum.on('message', function(mail) {
  // Anything that shows up here should be explicitly handled
  console.log("You've Got Mail! " + mail);
});

// I think all of this stuff only wants to get initialized after clicking enable OR detecting an already-present "connection" (metamask says "connected")

function initWeb3() {
  console.log("running initWeb3");
  // and here. what's the smart way to streamline all this stuff?
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

  web3 = new Web3(window.ethereum);  // Web3.givenProvider appears to be an alias for window.ethereum ... is it? if so seems like this just confuses things.
  web3.eth.defaultAccount = window.ethereum.selectedAddress; // it appears this is not set if we haven't clicked enable metamask
  let contractAddress = "0x5e2B9ba689fBB01ADB928044a31e331a8a1C31D4"; // obviously we need a better-than-this
  Blacklist = new web3.eth.Contract(abi, contractAddress);
}
initWeb3();


async function getAccount() {
  window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
    console.log("we succesfully connected to *A* wallet. The zeroith element of: " + accounts);
  });
}

// See issue #2
$("#enableEthereumButton").click(function() {
  // do noop if account already set. or do we need to?
  getAccount();
});

$("#getIsBlacklisted").click(function() {
  let address = $("#isBlacklisted").val();
  transaction = Blacklist.methods.isBlacklisted(address);
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
  transaction = Blacklist.methods.blacklistAddress(address);
  transaction.send({from: window.ethereum.selectedAddress})
    .on('transactionHash', function(hash){
      console.log("transaction hash: " + hash);
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log("blacklisting confirmed!: " + receipt + " (" + confirmationNumber + "x)");
    })
    .on('receipt', function(receipt){
      console.log("receipt: " + receipt);
    })
    .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
      console.log("error/receipt: " + error + "/" + receipt);
    })
    .finally(function() {
      console.log("blacklisting finally clause");
    });
});
