/*

<script type="module">
    import { ethers } from "https://cdn.ethers.io/lib/ethers-5.0.esm.min.js";
</script>
// ------------------------------------------------------
const provider = new ethers.providers.Web3Provider(window.ethereum)
//const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const signer = provider.getSigner()
// ------------------------------------------------------
provider.getBlockNumber() // { Promise: 12261282 }
// ------------------------------------------------------
balance = await provider.getBalance("ethers.eth") // { BigNumber: "2337132817842795605" }
ethers.utils.formatEther(balance) // '2.337132817842795605'
ethers.utils.parseEther("1.0") // { BigNumber: "1000000000000000000" }
// ------------------------------------------------------
const tx = signer.sendTransaction({  // Send 1 ether to an ens name.
    to: "ricmoo.firefly.eth",
    value: ethers.utils.parseEther("1.0")
});
// ------------------------------------------------------
const daiAbi = [  // for tokens (this is the Human-Readable ABI format) [mike: wat?!]
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];
const daiContract = new ethers.Contract("dai.tokens.ethers.eth", daiAbi, provider);
// ------------------------------------------------------
daiContract.name() // { Promise: 'Dai Stablecoin' }
daiContract.symbol() // { Promise: 'DAI' }
balance = await daiContract.balanceOf("ricmoo.firefly.eth") // { BigNumber: "1076788008374328791075" }
ethers.utils.formatUnits(balance, 18) // '1076.788008374328791075'
// ------------------------------------------------------
const daiWithSigner = contract.connect(signer); // The DAI Contract is currently connected to the Provider, which is read-only. You need to connect to a Signer.
const dai = ethers.utils.parseUnits("1.0", 18);
tx = daiWithSigner.transfer("ricmoo.firefly.eth", dai); // Send 1 DAI to "ricmoo.firefly.eth"
// ------------------------------------------------------

// Receive an event when ANY transfer occurs
daiContract.on("Transfer", (from, to, amount, event) => {
    console.log(`${ from } sent ${ formatEther(amount) } to ${ to}`);
    // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
});
filter = daiContract.filters.Transfer(null, "0x8ba1f109551bD432803012645Ac136ddd64DBA72")
daiContract.on(filter, (from, to, amount, event) => { // Receive an event when that filter occurs
    console.log(`I got ${ formatEther(amount) } from ${ from }.`); // The to will always be "address"
});
/////// also see https://docs.ethers.io/v5/getting-started/#getting-started--history
// ------------------------------------------------------
signature = await signer.signMessage("Hello World"); // To sign a simple string, which are used for logging into a service, such as CryptoKitties, pass the string in.
messageBytes = ethers.utils.arrayify("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"); // A common case is also signing a hash, which is 32 bytes. It is important to note, that to sign binary data it MUST be an Array (or TypedArray)
signature = await signer.signMessage(messageBytes) // To sign a hash, you most often want to sign the bytes
// ------------------------------------------------------
{ // Etheres docs say: The best practice when a network change occurs is to simply refresh the page.
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            window.location.reload();
        }
    });
}
// ------------------------------------------------------
// ------------------------------------------------------
*/
