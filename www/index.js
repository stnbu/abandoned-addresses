
// const ethereumButton = document.querySelector('#enableEthereumButton');

var account;
var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545"); // do we really care to do the `||` thing? not worth putting in the code imho.
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
debugger;
async function getAccount() {
  account = await ethereum.request({ method: 'eth_requestAccounts' })[0];
}

$("#blacklistAddress").click(function() {
  // do noop if account already set. or do we need to?
  getAccount();
});

Blacklist.methods.isBlacklisted(function(error, result) {
  if (!error) {
    // update html element
    console.log(result);
  } else
    console.log(error);
});

$("#blacklistAddress").click(function() {
  let address = $("#blacklistedAddress").val();
  console.log("entering");
  Blacklist.methods.blacklistAddress(address).send({from: account})
    .on('transactionHash', function(hash){
      console.log("hash");
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log("conf");
    })
    .on('receipt', function(receipt){
      console.log("recp");
    })
    .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
      console.log("err");
    });
});
