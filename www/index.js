const ethereumButton = document.querySelector('#enableEthereumButton');

ethereumButton.addEventListener('click', () => {
  getAccount();
});

async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
}

let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
