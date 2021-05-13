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

// FIXME, ALERT: I thought this always agreed with MM's "connected" indicator. I've seen once where MM was "connected" but this was null !
console.log("selectedAddress we are using upon loading: " + window.ethereum.selectedAddress);
// if window.ethereum.selectedAddress has a non-null value at this point, we could disable the [enable ethereum] button here -- $("#enableEthereumButton")

if (typeof window.ethereum === 'undefined') {
  alert('Wallet provider is NOT Available!!');  // How do we respond?
}

var web3 = new Web3(window.ethereum);  // FYI, Web3.givenProvider appears to be an alias for window.ethereum

// passes address="0xfffff...." (string, address)
window.ethereum.on('connect', function(address) {
  // this fires when you eth_requestAccounts ... NOT when the pages gets loaded and you're already connected
  console.log("connected with " + address);
});

// passes ..nothing? empty string?
window.ethereum.on('disconnect', function(x) {
  console.log("AN address disconnected. If there's an `x` it's: " + x);
});

// passes account="0xffff...." (string, address)
window.ethereum.on('accountsChanged', function(account) { // my guess, this fires when window.ethereum.selectedAddress changes.
  //
  // I believe this is the ONLY place we need to keep up with changes to the "default" address, a.k.a. "window.ethereum.selectedAddress"
  // MetaMask tries to keep up with the wallet the user thinks they're using. It sets window.ethereum.selectedAddress accordingly and this event gets fired.
  // So for example, this is where we would enable, disable the "connect to ethereum" button and update any badges or displayed addresses.
  // Empty string means we are not connected at all. Any other value is the address of the global wallet that this dapp thinks its using (!!!)
  // Sublty: it looks like the "account" returned when not connected is an empty string, but window.ethereum.selectedAddress gets set to `null`
  //
  // If and only if `account === ""` should we enable $("#enableEthereumButton")
  // If account has a non-empty value $("#enableEthereumButton") should be enabled here
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
  //
  // Also, using the same info (contract address) we could have a link to the correct etherscan page for the contract.
  console.log("chain changed TO " + toChain);
});

// passes ...some message
window.ethereum.on('message', function(mail) {
  // Anything that shows up here should be explicitly handled
  // I'm tempted to say that anything that shows up in the blacklistAddress handlers will show up here too, but maybe not.
  // It would be nice to know if we have to use those handlers or if the messages here have the same info...
  console.log("You've Got Mail! " + mail);
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

  let contractAddress = "0x5e2B9ba689fBB01ADB928044a31e331a8a1C31D4";
  return new web3.eth.Contract(abi, contractAddress);
}
// If we're going to be using globals, they should appear at the top of the file.
var Blacklist = getBlacklistContract();

async function getAccount() {
  window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
    console.log("we succesfully connected to *A* wallet. accounts==" + accounts);
  });
}

$("#enableEthereumButton").click(function() {
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
      // We have the confirmation number here. If someone blacklists an address, we could have a widget that shows a confirmation count.
      console.log("blacklisting confirmed!: " + receipt + " (" + confirmationNumber + ")");
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
