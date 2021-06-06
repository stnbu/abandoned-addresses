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
    document.getElementById("identicon").appendChild(getIdenticon(address));
    updateBalance(address);
}
