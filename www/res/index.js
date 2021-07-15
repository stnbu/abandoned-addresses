/* ethers.js code to interact with the abandoned-addresses contract */

import { createIcon } from "https://cdn.jsdelivr.net/npm/@download/blockies@1.0.3/src/blockies.mjs";

// Mimics how MetaMask generates "identicons"
function getIdenticon(address, useBlockie = true) {
    if (!address) {
	address = "0x0000000000000000000000000000000000000000";
    }
    // Looks like ens has maybe a third type.. https://app.ens.domains/address/0xF553F9f0aFaA8435DA9846265c9F4782DCbC33c6 ?
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
	    handleSelectedAddressChange();
        }).then(
            _ => {},
            err => {
                alert(`While trying to connect your wallet to this site: ${JSON.stringify(err)}`);
            }
        );
    }
}

function handleSelectedAddressChange() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    signerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    console.log("Successfully created global signing contract.");
    providerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    console.log("Successfully created global provider contract.");
    let identicon = getIdenticon(window.ethereum.selectedAddress);
    console.log(`Updating identicon for ${JSON.stringify(window.ethereum.selectedAddress)}.`);
    $("#abandonedIdenticon").html(identicon);
    console.log(`Updating displayed current address for ${JSON.stringify(window.ethereum.selectedAddress)}.`);
    $("#abandonedAddress").text(window.ethereum.selectedAddress);
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
    handleSelectedAddressChange();
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
    // TODO: We need to deploy a version without taking an address as an argument. Isn't it pointless?
    let address = window.ethereum.selectedAddress;
    signerContract.abandonAddress(address).then(
        transactionResponse => {
            // HERE --> Enable "confirming..." UI element.
            console.log(`Successfully sent transaction to abandon ${JSON.stringify(address)}`);
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
///// --------
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

// This makes "blockies" ... SOMEHOW
!function(){function e(e){for(var o=0;o<c.length;o++)c[o]=0;for(var o=0;o<e.length;o++)c[o%4]=(c[o%4]<<5)-c[o%4]+e.charCodeAt(o)}function o(){var e=c[0]^c[0]<<11;return c[0]=c[1],c[1]=c[2],c[2]=c[3],c[3]=c[3]^c[3]>>19^e^e>>8,(c[3]>>>0)/(1<<31>>>0)}function r(){var e=Math.floor(360*o()),r=60*o()+40+"%",t=25*(o()+o()+o()+o())+"%",l="hsl("+e+","+r+","+t+")";return l}function t(e){for(var r=e,t=e,l=Math.ceil(r/2),n=r-l,a=[],c=0;t>c;c++){for(var i=[],f=0;l>f;f++)i[f]=Math.floor(2.3*o());var s=i.slice(0,n);s.reverse(),i=i.concat(s);for(var h=0;h<i.length;h++)a.push(i[h])}return a}function l(o){var t={};return t.seed=o.seed||Math.floor(Math.random()*Math.pow(10,16)).toString(16),e(t.seed),t.size=o.size||8,t.scale=o.scale||4,t.color=o.color||r(),t.bgcolor=o.bgcolor||r(),t.spotcolor=o.spotcolor||r(),t}function n(e,o){var r=t(e.size),l=Math.sqrt(r.length);o.width=o.height=e.size*e.scale;var n=o.getContext("2d");n.fillStyle=e.bgcolor,n.fillRect(0,0,o.width,o.height),n.fillStyle=e.color;for(var a=0;a<r.length;a++)if(r[a]){var c=Math.floor(a/l),i=a%l;n.fillStyle=1==r[a]?e.color:e.spotcolor,n.fillRect(i*e.scale,c*e.scale,e.scale,e.scale)}return o}function a(e){var e=l(e||{}),o=document.createElement("canvas");return n(e,o),o}var c=new Array(4),i={create:a,render:n};"undefined"!=typeof module&&(module.exports=i),"undefined"!=typeof window&&(window.blockies=i)}();

var curTab = 0;// 0 = My Address, 1 = Search
var tabContainer = document.getElementsByClassName("horizontal-tab-container")[0];
var tabs = document.getElementsByClassName("control-option");
var searchTabBlock = document.getElementsByClassName("search-tab-block")[0];

if (typeof window.ethereum === 'undefined') {
    alert('Wallet provider is NOT Available!!');
}

console.log("selectedAddress we are using upon loading: " + window.ethereum.selectedAddress);

function logEvent(eventName, content, _error) {
    let message = "[event fired: '" + eventName + "'] " + "content=" + JSON.stringify(content);
    if (_error) {
	message = message + ", error=" + JSON.stringify(_error);
    }
    console.log(message);
}

var web3 = new Web3(window.ethereum);

window.ethereum.on('connect', function(connectInfo) {
    logEvent('connect', connectInfo);
    if (typeof connectInfo.chainId && connectInfo.chainId === "0x4") {
	// rinkeby
    } else if (typeof connectInfo.chainId && connectInfo.chainId !== "0x4") {
	// not rinkeby
    } else {
	// we should not get here!
    }
});

window.ethereum.on('disconnect', function(content) {
    logEvent('disconnect', content);
});

// passes account="0xffff...." (string, address)
window.ethereum.on('accountsChanged', function(account) {
    logEvent('accountsChanged', account);
});

// passes toChain="0x5" (A STRING!!!!!!)
// [see: https://chainid.network/]
window.ethereum.on('chainChanged', function(toChain) {
    logEvent('chainChanged', toChain);
    if (toChain === "0x4") {
	// switched to rinkeby
    } else if (toChain !== "0x4") {
	// switchhed from rinkeby
    } else {
	// do we get here?
    }
});

// passes ...some message
window.ethereum.on('message', function(content) {
    logEvent('message', content);
});

// If we're going to be using globals, they should appear at the top of the file.
var ABANDONED_ADDRESSES = new web3.eth.Contract(ABI, CONTRACT_ADDRESS); // set by ./deployments/default.js

// We have only one EVM (contract) event to worry about: "AddressAbandoned"
ABANDONED_ADDRESSES.events.AddressAbandoned({fromBlock: "earliest"}, function(incoming) {
    logEvent('abandoned_evm_event', incoming);
});

async function getAccount() {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
	setCurrentAddressElements();
	console.log("we succesfully connected to *A* wallet. the data we got was `" + JSON.stringify(accounts) + "`");
    });
}

// FIXME -- Hack! We still do not do metamask connecting correctly.
// This makes life easier, but makes for a worse UI experience.
getAccount();

$("#enableEthereumButton").click(function() {
    getAccount();
});

function updateBalance(address) {
    web3.eth.getBalance(address, function(err, result) {
	if (err) {
	    alert(err);
	} else {
	    let ether_balance = web3.utils.fromWei(result, "ether")
	    let balance = (Math.round(ether_balance * 100) / 100).toFixed(3);
	    document.getElementById("currentAddressBalance").innerHTML = balance;
	}
    });
}

function checkAddress() {
    let address = $("#addressSearch").val();
    transaction = ABANDONED_ADDRESSES.methods.isAbandoned(address);
    transaction.call({from: window.ethereum.selectedAddress}, function (error, isAbandoned) {
	if (!error) {
	    let icon = getIdenticon(address);
	    document.getElementById("identiconSearch").innerHTML = "";
	    document.getElementById("identiconSearch").appendChild(icon);
	    if(isAbandoned) {
		searchTabBlock.classList.remove("hidden");
		searchTabBlock.classList.remove("error");
	    } else {
		searchTabBlock.classList.add("hidden");
		searchTabBlock.classList.add("error");
	    }
	} else {
	    alert("error while checking abandoned status: " + error);
	}
    });
}

$("#abandonAddress").click(function() {
    transaction = ABANDONED_ADDRESSES.methods.abandonAddress(window.ethereum.selectedAddress);
    transaction.send({from: window.ethereum.selectedAddress})
	.on('transactionHash', function(hash){
	    logEvent('transactionHash', hash);
	})
	.on('confirmation', function(confirmationNumber, receipt) {
	    // NOTE: we abuse error= field for confirmation number
	    logEvent('confirmation', receipt, "(conf_num=" + confirmationNumber + "[not_an_error])");
	})
	.on('receipt', function(receipt){
	    logEvent('receipt', receipt);
	})
	.on('error', function(error, receipt) {
	    logEvent('error', receipt, error);
	})
	.finally(function() {
	    // finally do this always
	});
});

function switchTab(elem) {
    if(curTab === 0) {
        curTab = 1;
        tabContainer.style.marginLeft = "-100%";
        tabs[0].classList.remove("selected");
        tabs[1].classList.add("selected");
    } else {
        curTab = 0;
        tabContainer.style.marginLeft = "0";
        tabs[0].classList.add("selected");
        tabs[1].classList.remove("selected");
    }
}

function getIdenticon(address) {
    return blockies.create({
        seed: address,
        size: 15,
        scale: 3,
        spotcolor: '-1'
    });
}

function getCurrentAddress() {
    let address = "0x" + "0".repeat(40);
    if (typeof window.ethereum.selectedAddress !== "undefined" && window.ethereum.selectedAddress) {
	address = window.ethereum.selectedAddress;
    }
    return address;
}

function setCurrentAddressElements() {
    let address = getCurrentAddress();
    document.getElementById("currentAddress").innerHTML = address;
    document.getElementById("identicon").innerHTML = "";
    document.getElementById("identicon").appendChild(getIdenticon(address));
    updateBalance(address);
}
