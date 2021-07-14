if (typeof window.ethereum === 'undefined') {
    alert("Using this site requires that you have a EIP1193-capable environment. " +
	  "The easy fix: " +
	  "Installing and setting up Metamask takes about 2 minutes. " +
	  "Sorry. Install Metamask and reload this page for the full " +
	  "expirience. See: https://metamask.io/");
}

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

console.log("selectedAddress we are using upon loading: " + window.ethereum.selectedAddress);
function logEvent(eventName, content, _error) {
  let message = "[event fired: '" + eventName + "'] " + "content=" + JSON.stringify(content);
  if (_error) {
    message = message + ", error=" + JSON.stringify(_error);
  }
  console.log(message);
}

window.ethereum.on('accountsChanged', function(account) {
    console.log("Provider switched to account " + account);
});

window.ethereum.on('chainChanged', function(toChain) {
    logEvent('chainChanged', toChain);
  if (toChain === "0x4") {
      console.log("Switched to Rinkeby");
  } else {
      alert("Sorry. Only the Rinkeby test network is supported. " +
	    "Feel free to file an issue on the abandoned-addresses " +
	    "Github, or email me at mb@unintuitive.org and I will " +
	    "happily send you plenty of rETH ");
  }
});
