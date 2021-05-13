//var WALLET = window.ethereum.selectedAddress;
var Blacklist = null;
var web3 = null;

console.log("for WALLET we are using " + window.ethereum.selectedAddress);

if (typeof window.ethereum !== 'undefined') {
  // pass
} else {
  console.log('Wallet is NOT Available');  // How do we respond?
}

// window.ethereum.selectedAddress   // is this THE one? the indicator of "connected"?


// Web3.givenProvider  // If this property is null you should connect to a remote/local node.

// me be web3.eth.accounts.getAccounts() ...?

/*
web3.eth.accounts.signTransaction({
    to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
    value: '1000000000',
    gas: 2000000
}, '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
.then(console.log);


web3.eth.ens.resolver('ethereum.eth').then(function (contract) {
    console.log(contract);
});


ethereum.on('accountsChanged', function (accounts) {
  // Time to reload your interface with accounts[0]!
});

window.ethereum.on('connect', func)
window.ethereum.on('disconnect', func)
window.ethereum.on('accountsChanged', handler: (accounts: Array<string>) => void);
window.ethereum.on('chainChanged', handler: (chainId: string) => void);
window.ethereum.on('message', handler: (message: ProviderMessage) => void); // MM warnings etc.
*/

window.ethereum.on('connect', function(address) {
  console.log("connected with " + address);
}); // works when you eth_requestAccounts ... NOT when the pages gets loaded and you're already connected ... returns addr

window.ethereum.on('disconnect', function(x) {
  console.log("AN address disconnected. If there's an `x` it's: " + x);
}); // works, returns nothing

window.ethereum.on('accountsChanged', function(account) { // my guess, this fires when window.ethereum.selectedAddress changes.
  // I believe this is the ONLY place we need to keep up with the "WALLET" global and respond to wallet changes.
  console.log("[WE WILL REACT TO] accounts changed TO `" + account + "`");
});

window.ethereum.on('chainChanged', function(toChain) {
  console.log("chain changed TO " + toChain);
});  // works! returns 0x5 (chain ID)

window.ethereum.on('message', function(mail) {
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

  //WALLET = window.ethereum.selectedAddress;
  web3 = new Web3(window.ethereum);  // Web3.givenProvider appears to be an alias for window.ethereum ... is it? if so seems like this just confuses things.
  web3.eth.defaultAccount = window.ethereum.selectedAddress; // it appears this is not set if we haven't clicked enable metamask
  let contractAddress = "0x5e2B9ba689fBB01ADB928044a31e331a8a1C31D4"; // obviously we need a better-than-this
  Blacklist = new web3.eth.Contract(abi, contractAddress);
}
initWeb3();


async function getAccount() {
  window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
    console.log("we succesfully connected to *A* wallet. The zeroith element of: " + accounts);
    initWeb3();
    //WALLET = accounts[0];
    //account = accounts[0];
    // $('#displayWalletAddrWidget').innerHTML = account;
  });
}

// See issue #2
$("#enableEthereumButton").click(function() {
  // do noop if account already set. or do we need to?
  getAccount();
});

$("#getIsBlacklisted").click(function() {
  // initWeb3();
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
