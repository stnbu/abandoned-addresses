/* ethers.js code to interact with the abandoned-addresses contract */

import { createIcon } from "https://cdn.jsdelivr.net/npm/@download/blockies@1.0.3/src/blockies.mjs";

// Mimics how MetaMask generates "identicons"
function getIdenticon(address, useBlockie = true) {
    if (useBlockie) {
        return createIcon({seed: address.toLowerCase()});
    } else {
        throw new Error("Can only do Blockie!");
    }
}

// The only real globals.
var signerContract;
var providerContract;

function chainIdAlert() {
    alert("Sorry. Only the Rinkeby test network is supported. " +
          "Feel free to file an issue on the abandoned-addresses " +
          "Github, or email me at mb@unintuitive.org and I will " +
          "happily send you plenty of rETH ");
    throw new Error("Not on Rinkeby!");
}

function assertRinkeby() {
    if (window.ethereum.chainId !== "0x4") {
        chainIdAlert();
    }
}

// This is the test, "Do we have Metamask or not?"
if (typeof window.ethereum === 'undefined') {
    alert("Using this site requires that you have a EIP1193-capable environment. " +
          "The easy fix: " +
          "Installing and setting up Metamask takes about 2 minutes. " +
          "Sorry. Install Metamask and reload this page for the full " +
          "experience. See: https://metamask.io/");
    throw new Error("No Ethereum support!");
} else {
    if (window.ethereum.chainId !== "0x4") {
        chainIdAlert();
    } else {
        // At this point, hail mary and try to get connected.
        window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
            console.log("Running `eth_requestAccounts` callback on wallet address " + JSON.stringify(accounts));
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            signerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            console.log("Successfully created global signing contract.");
            providerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
            console.log("Successfully created global provider contract.");
        }).then(
            _ => {},
            err => {
                alert(`While trying to connect your wallet to this site: ${JSON.stringify(err)}`);
            }
        );
    }
}

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
                "Metamask UI]. And more confusion: Switching accounts in Metamask " +
                "does not always switch the address here!");
    console.log("Note that `window.ethereum.selectedAddress` now has value " + window.ethereum.selectedAddress);
});

window.ethereum.on('chainChanged', function(toChain) {
    console.log("Chain changed to " + toChain);
    if (toChain === "0x4") {
        console.log("Switched to Rinkeby");
    } else {
        chainIdAlert();
    }
});

$("#getIsAbandoned").click(function() {
    assertRinkeby();
    let address = $("#isAbandoned").val();
    // Note that a `Error: call revert exception` here _can_ mean that you are on the wrong network.
    providerContract.isAbandoned(address).then(
        isAbandoned => {
            if (isAbandoned) {
                console.log(address + " IS abandoned");
            } else {
                console.log(address + " IS NOT abandoned");
            }
        },
        err => {
            console.log("Failed to check abandonment status: " + JSON.stringify(err));
        }
    );
});

$("#abandonAddress").click(function() {
    assertRinkeby();
    let address = $("#abandonedAddress").val();
    let icon = getIdenticon(address);
    signerContract.abandonAddress(address).then(
        transactionResponse => {
            // HERE --> Enable "confirming..." UI element.
            console.log("Successfully sent transaction to abandon `" + address + "`");
            let n = 1;
            transactionResponse.wait(n).then(
                response => {
                    // HERE --> Enable "confirmed!" UI element.
                    console.log(`Received ${n} confirmations for abandonment of address ${address}.\n` +
                                `https://rinkeby.etherscan.io/tx/${response.transactionHash}`);
                },
                err => {
                    alert(`While awaiting ${n} confirmations for abandonment of address ${address}: ${JSON.stringify(err)}`);
                }
            );
        },
        err => {
            alert("Failed to abandon address `" + address + "`: " + JSON.stringify(err));
        }
    );
});
