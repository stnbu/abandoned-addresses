// This is the test, "Do we have Metamask or not?"
if (typeof window.ethereum === 'undefined') {
    alert("Using this site requires that you have a EIP1193-capable environment. " +
	  "The easy fix: " +
	  "Installing and setting up Metamask takes about 2 minutes. " +
	  "Sorry. Install Metamask and reload this page for the full " +
	  "expirience. See: https://metamask.io/");
} else {
    // if this is "null" we are definitely not connected in any sense.
    console.log("selectedAddress we are using upon loading: " + window.ethereum.selectedAddress);
}

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

window.ethereum.on('accountsChanged', function(account) {
    // Note that switching addresses in this context always means switching from a connected address
    // to another connected address. The `account` value will never be a non-connected address.
    console.log("Provider switched to account " + account);
    console.log("However... " +
		"This may not necessarily be the account that shows in the " +
		"Metamask UI! If someone as two addresses, both connected to " +
		"this site, and they 'disconnect' the _active_ Metamask address, " +
		"then the switched-to address above is _not_ the active Metamask " +
		"address [i.e. the one the user sees the identicon for in the " +
		"Metamask UI]");
    console.log("Note that `window.ethereum.selectedAddress` now has value " + window.ethereum.selectedAddress);
});

window.ethereum.on('chainChanged', function(toChain) {
    console.log("Chain changed to " + toChain);
    if (toChain === "0x4") {
	console.log("Switched to Rinkeby");
    } else {
	alert("Sorry. Only the Rinkeby test network is supported. " +
	      "Feel free to file an issue on the abandoned-addresses " +
	      "Github, or email me at mb@unintuitive.org and I will " +
	      "happily send you plenty of rETH ");
    }
});

window.ethereum.on('message', function(content) {
    console.log("Helloo. When does this fire?! Get ride of this _lore_ if we never figure out what/what/if `message` events do/are for/actually work");
});

async function getAccount() {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	console.log("we succesfully connected to *A* wallet. the data we got was `" + JSON.stringify(accounts) + "`");
    });
}

$("#enableEthereumButton").click(function() {
    getAccount();
});
