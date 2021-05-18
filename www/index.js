// SPDX-License-Identifier: UNLICENSED
/*
  Interact with the reference AbandonedAddresses contract.

  URL: https://dapps.unintuitive.org/abandoned-addresses/

  1. Switch to "Rinkeby" in MetaMask, and click on [Enable Ethereum].
  1. Open browser's javascript console.
  1. Interact and watch the logs.

  Contributors.

  * Mike Burr <mb@unintuitive.org>
  * Adam Soper <adam@americanretailusa.com>
*/

if (typeof window.ethereum === 'undefined') {
  alert('Wallet provider is NOT Available!!');  // How do we respond?
}

// Notice the return value of isConnected() is not assigned. This may be useful for other things, but
// I noticed that after calling "isConnected", "window.ethereum.selectedAddress" gets set. In other words
// It looks like "window.ethereum.selectedAddress" getting assined an address is a side-effect of isConnected()
// Otherwise, window.ethereum.selectedAddress is null, even when metamask says "connected". If metamask is
// NOT connected, then window.ethereum.selectedAddress does not get set :-/
//window.ethereum.isConnected()
// Damnit! No. This does not seem to have that effect. On loading, the value of window.ethereum.selectedAddress
// is still a big mystery!

// If window.ethereum.selectedAddress has a non-null value at this point, we could disable the [Enable Ethereum]
// button here -- $("#enableEthereumButton")
console.log("selectedAddress we are using upon loading: " + window.ethereum.selectedAddress);

function logEvent(eventName, content, _error) {
  let message = "[event fired: '" + eventName + "'] " + "content=" + JSON.stringify(content);
  if (_error) {
    message = message + ", error=" + JSON.stringify(_error);
  }
  console.log(message);
}

var web3 = new Web3(window.ethereum);  // FYI, Web3.givenProvider appears to be an alias for window.ethereum

// Start window.etherem events...

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
  //  abandonedAddressesContractMapping = {"0x5": "0xffffff..."}  // mapping of chain ID and contract address.
  //
  // Change the contract value, re-init ABANDONED_ADDRESSES and put up a conspicous banner if we are on a testnet
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

// If we're going to be using globals, they should appear at the top of the file.
var ABANDONED_ADDRESSES = new web3.eth.Contract(ABI, CONTRACT_ADDRESS); // set by ./deployments/default.js

// We have only one EVM (contract) event to worry about: "AddressAbandoned"
ABANDONED_ADDRESSES.events.AddressAbandoned({fromBlock: "earliest"}, function(incoming) {
  // Turns out `incoming` is `null` ...wtf?
  // Also, this can either take a looong time, or possibly never comes sometimes. Strange!
  logEvent('abandoned_evm_event', incoming);
});

async function getAccount() {
  window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    signer.signMessage('Some data').then((x) => {
      debugger;
    });
    console.log("we succesfully connected to *A* wallet. the data we got was `" + JSON.stringify(accounts) + "`");
    debugger;
  });
}

$("#enableEthereumButton").click(function() {
  getAccount();
});

$("#getIsAbandoned").click(function() {
  let address = $("#isAbandoned").val();
  transaction = ABANDONED_ADDRESSES.methods.isAbandoned(address);
  transaction.call({from: window.ethereum.selectedAddress}, function (error, isAbandoned) {
    if (!error) {
      if (isAbandoned) {
        console.log(address + " IS abandoned");
      } else {
        console.log(address + " IS NOT abandoned");
      }
    } else {
      console.log("error while checking abandoned status: " + error);
    }
  });
});

$("#abandonAddress").click(function() {
  let address = $("#abandonedAddress").val();
  transaction = ABANDONED_ADDRESSES.methods.abandonAddress(address);
  transaction.send({from: window.ethereum.selectedAddress})
    .on('transactionHash', function(hash){
      logEvent('transactionHash', hash);
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      // NOTE: we abuse error= field for confirmation number
      logEvent('confirmation', receipt, "(conf_num=" + confirmationNumber + "[not_an_error])");
      // We have the confirmation number here. If someone abandons an address, we could have a widget
      // that shows a confirmation count
    })
    .on('receipt', function(receipt){
      logEvent('receipt', receipt);
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
