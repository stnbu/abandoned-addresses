const ethereumButton = document.querySelector('#enableEthereumButton');

ethereumButton.addEventListener('click', () => {
  // do noop if account already set.
  getAccount();
});

async function getAccount() {
  debugger;
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  debugger;
  const account = accounts[0];
}

var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// function wat() {
//   var contractAddress = "0x0";
//   var abi = {};
//   var Contract = require('web3-eth-contract');
//   // set provider for all later instances to use
//   Contract.setProvider('ws://localhost:8546');
//   var contract = new Contract(abi, address);
//   contract.methods.somFunc().send({from: xx}).on('receipt', function(){
//     console.log(xx);
//   });
// }

// abi, address);
//   contract.methods.somFunc().send({from: xx}).on('receipt', function(){
//     console.log(xx);
//   });
// }

// if (typeof web3 !== 'undefined') {
//   web3 = new Web3(web3.currentProvider);
// } else {
//   web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// }

var contractAddress = "0xf0493F94059741F962749e520875e0a71c7A3674";
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
		"outputs": [],
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

web3.eth.defaultAccount = web3.eth.accounts[0];
var Blacklist = new web3.eth.Contract(abi, contractAddress);
//var BlacklistContract = web3.eth.contract(abi, contractAddress);
//var Blacklist = BlacklistContract.at(contractAddress);
Blacklist.methods.isBlacklisted(function(error, result) {
  if (!error) {
    // update html element
    console.log(result);
  } else
    console.log(error);
});
$("#blacklistAddress").click(function() {
  Blacklist.methods.blacklistAddress($("#blacklistedAddress").val());
});
