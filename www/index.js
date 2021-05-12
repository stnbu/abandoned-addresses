
var account;
var web3 = new Web3(Web3.givenProvider);
web3.eth.defaultAccount = web3.eth.accounts[0];
var contractAddress = "0x5e2B9ba689fBB01ADB928044a31e331a8a1C31D4"; // obviously we need a better-than-this
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

var Blacklist = new web3.eth.Contract(abi, contractAddress);

async function getAccount() {
  ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
    account = accounts[0];
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
  transaction.call({from: account}, function (error, isBlacklisted) {
    if (!error) {
      if (isBlacklisted) {
        alert(address + " IS blacklisted");
      } else {
        alert(address + " IS NOT blacklisted");
      }
    } else {
      alert("error while checking blacklisted status: " + error);
    }
  });
});

$("#blacklistAddress").click(function() {
  let address = $("#blacklistedAddress").val();
  transaction = Blacklist.methods.blacklistAddress(address);
  transaction.send({from: account})
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
      alert("error/receipt: " + error + "/" + receipt);
    })
    .finally(function() {
      console.log("blacklisting finally clause");
    });
});
