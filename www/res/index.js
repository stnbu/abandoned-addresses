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

// globals
var provider;
var signerContract;
var providerContract;
var curTab = 0; // 0 = My Address, 1 = Search
var tabContainer = document.getElementsByClassName("horizontal-tab-container")[0];
var tabs = document.getElementsByClassName("control-option");
var searchTabBlock = document.getElementsByClassName("search-tab-block")[0];

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
    let address = window.ethereum.selectedAddress;
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    signerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    console.log("Successfully created global signing contract.");
    providerContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    console.log("Successfully created global provider contract.");
    let identicon = getIdenticon(address);
    console.log(`Updating identicon for ${JSON.stringify(address)}.`);
    $("#identicon").html(identicon);
    console.log(`Updating displayed current address for ${JSON.stringify(address)}.`);
    $("#currentAddress").text(address);
    console.log(`Updating balance for ${JSON.stringify(address)}.`);
    updateBalance(address);
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

$("#checkAddress").click(function() {
    assertRinkeby();
    let address = $("#addressSearch").val();
    // Note that a `Error: call revert exception` here _can_ mean that you are on the wrong network.
    providerContract.isAbandoned(address).then(
        isAbandoned => {
            let icon = getIdenticon(address);
            document.getElementById("identiconSearch").innerHTML = "";
            document.getElementById("identiconSearch").appendChild(icon);
            if(isAbandoned) {
                console.log(address + " IS abandoned");
                searchTabBlock.classList.remove("hidden");
                searchTabBlock.classList.remove("error");
            } else {
                console.log(address + " IS NOT abandoned");
                searchTabBlock.classList.add("hidden");
                searchTabBlock.classList.add("error");
            }
        },
        err => {
            alert(`Failed to check abandonment status: ${JSON.stringify(err)}`);
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
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
function updateBalance(address) {
    provider.getBalance(address).then(
        balance => {
            // FIXME: BigNumber.div does not work! We should use it.
            let etherBalance = (balance / ethers.constants.WeiPerEther).toFixed(3);
            $("#currentAddressBalance").html(etherBalance);
        },
        err => {
            throw err;
        }
    );
}

//     web3.eth.getBalance(address, function(err, result) {
//      if (err) {
//          alert(err);
//      } else {
//          let ether_balance = web3.utils.fromWei(result, "ether")
//          let balance = (Math.round(ether_balance * 100) / 100).toFixed(3);
//          document.getElementById("currentAddressBalance").innerHTML = balance;
//      }
//     });
// }

function checkAddress() {
    let address = $("#addressSearch").val();
    transaction = ABANDONED_ADDRESSES.methods.isAbandoned(address);
    transaction.call({from: window.ethereum.selectedAddress}, function (error, isAbandoned) {
        if (!error) {
        } else {
            alert("error while checking abandoned status: " + error);
        }
    });
}
//$("#checkAddress").click(checkAddress);

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
$(".tab-switcher").click(switchTab);

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
}
