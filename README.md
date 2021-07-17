The PoC is here: https://dapps.unintuitive.org/abandoned-addresses/

# The Idea...

Imagine finding yourself in one of the following situations:

* You find evidence that someone has handled the paper on which you've recorded your address' seed phrase. Say there's a smudge from someone else's finger. There isn't a lot of money in this wallet, _but_ you did use this address to identify yourself on some apps and to prove your identity in other ways.
* You drop your hardware wallet at a resort while on vacation and later are able to retrieve it from the lost-and-found. The attendant gives you a knowing smile...
* You and your cousin have a shared seed phrase. You both wrote it down together and decided to 'share' this address, as you have complete trust in her. Then you find out from someone else that she's being sued by someone for a large amount of money and is likely to lose.
* Your great-grandmother has left you her Ethereum wallet in the form of a seed phrase that has been sitting in a filing cabinet for years. You check and all the money is still there, but you have no idea if anyone has had access to the seed phrase.

In the case of using your address for identification, in the above situations you may find yourself wondering if someone is now able to impersonate you.

In the case of the wallet being used to store value, even if the value is still there, maybe the new, unknown "co-owners" of this wallet have decided to take their chances, bide their time and see if the balance goes _up_ any before completely draining your wallet!

You should have the option of somehow declaring

> This is no longer my address. From this point forward, I do not take responsibility for what happens with this address, I am explicitly abandoning it!

Importantly, you cannot do this for addresses you no longer have access to [the private key]. How do you make the above declaration for a address you don't control? You cannot. Similarly, you cannot do it for someone else's address. We are only talking about **addresses that you currently control**.

You could take out an ad in the paper. You could do a lot of things, but you want to do something useful and helpful.

That is the idea behind this contract. There should be an agreed-upon, standard way of abandoning your Ethereum address. Naturally, there won't be one authoritative list of abandoned addresses, nor should there. There should be a market of solutions. The popular ones rise to the top. The same thing applies to widespread "ad filtering" software on browsers. They come with a compiled-in default only because that is the one that won the most confidence long ago. You're free to choose whatever you like. This doesn't try to be anything more complicated than a list of addresses, with a UI.

* Only the address owner can abandon their own address. This is not about reporting bad behavior, this is about declaring that you do not claim ownership of that address anymore. Maybe you lost the wallet? Maybe you shared the seed phrase with someone and you no longer trust that someone. You can assert: "This is not my address anymore. It's not _me_, I don't know who it is now."
* What applications do with this is totally up for grabs, but the obvious thing would be, say, contract `Q` refuses to accept any address abandoned by contract `R`.
* There is no going back, you cannot un-abandon your address!
* There is no central anything. This is just _an idea_ that is useful only in as much as it gains adoption.
* With this contract, you do not have the option of adding "and this is my new address". You only can **abandon** an address, permanently.
* You probably want to do some things with this address right beforehand (but ideally, _atomically_, along with the abandonment). This implementation does none of these things, but under consideration and open to ideas:
   * Automatically create another wallet
   * Move 100% of value out, and into another address
   * Update references in other contracts


# The Web UI

A live demo is hosted [here](https://dapps.unintuitive.org/abandoned-addresses/).

You must have a "web3 capable" browser environment. This most often means installing the [Metamask browser extension](https://metamask.io/). Once installed, with a wallet set up, and with the `Rinkeby` network selected, you should be able to reload the page and immedately get prompted by Metamask to connect.

Once connected, you should see your addresses "blockie" identicon and ENS name (if applicable). You can then do a couple of things:

* Switch to the "Search" tab, entiter a valid Ethereum address, with [checksum case](https://coincodex.com/article/2078/ethereum-address-checksum-explained/), and click the "Check" button. The same information above is printed for the given address, included abandoned status.
* Abandon your _own_ address by going back to the "My Address" tab and clicking "Abandon Address" to add your address to the set of abandoned addresses for this contract (note: you are on the Rinkeby test network, there's no risk of any kind here to existing mainnet wallets). 

# The Contract

* As simple as possible.
* Has `abandonAddress(<address>)` and `isAbandoned(<address>)` the former MUST immediately revert if `msg.sender != address`, the latter just consults a `mapping(address => bool)` and returns the corresponding "is abandoned?" value (True/False).
* Each successful call to `abandonAddress(foo)` MUST cause an `AddressAbandoned(foo)` event to be emitted.
* There is no cost of any kind except for gas.
* Like an ERC, I imagine there would just be a method spec (above). It might ruin things if it were much more complicated. One could abandon an `AbandonedAddresses` contract instance with an entry in another `AbandonedAddresses` instance, so that ability is already built in.
* We _could_ allow a forward-to address to be included instead of the bool. This simple change adds a large amount of complexity. What this can be is a network of address you can 'walk', even just within one contract instance, there are circuits tracing a path from one address to another, `[k0:k1, k2:k2]` is another way of saying `k0 -> k1 -> k2`. And since the addition of the `k1` record was signed by `k0`, by induction you know you have a linked list of addresses and therefore "cryptographic provenance". `AbandonedAddresses` does not do this. It is only for _abandoning_ addresses, but the idea is discussed some more below.

# Deploying, Running, and Testing

You will need a local Ethereum client or some kind of HTTP-RPC at `http://127.0.0.1:8545` (if configured per instructions). Geth is not hard. Inquire within.

We use [brownie](https://github.com/eth-brownie/brownie) as a simple infrastructure tool.

Installing brownie will inevitably involve fiddling, but basically:

```bash
python3 -m venv ~/venv3
source ~/venv3/bin/activate
pip3 install eth-brownie
```

Once installed, there should be only two prerequisites to testing (either locally, with `ganache-cli` or against Rinkeby) or deploying (currently just to Rinkeby).

1. Link the `network-config.yaml` file to your `~/.brownie/` directory.
1. create a `./.env` file with the contents `export PRIVATE_KEY="..."` (only required for Rinkeby.)

## Testing

To test against a local, ephemeral `ganache-cli` provider, just run:

```bash
brownie test
```

To test against Rinkeby:

```bash
brownie test --network=rinkeby
```

## Deployment

"Deploying" this dApp is easy, just serve the contents of `./www` with a web server. But you need a deployed contract to interact with. You should be able to run:

```bash
brownie run --network=rinkeby ./scripts/deploy.py
```

And in ten seconds, give or take, you should have:

1. A successful deployment of `AbandonedAddresses`
1. a new file at `./www/deployments/default.js` with the ABI and contract address.

You should now be good to go. File an issue if something doesn't work.

> :bulb: The `foo` in `--network=foo` refers to the values at `live.networks.id` and `development.id` in the file `~/.brownie/network-config.yaml` that's it! Nothing else! That is, the ID values found in the union of those two config paths. (wonder how dupes are handled...)

# Going further...

The idea of having an address mapping to another address instead of a bool could be a productive idea. But a few things...

* If we replaced bool with `address`, how would we indicate "end of the line"? We can't use the zero address (or could we), so instead you call another contract (this one) and call its method to say: "No more forwarding addresses! I'm going off-grid!" If that idea is to exist and we want simplicity of design (?) then that seems like a better idea than arbitrarily declaring the zero address to be end-of-the-line...(?)
   * What if say you want an address for everyone in your family and you have a child? Well, you might want to "terminate" the chain of address forwardings with a call to another contract, with another interface. This time, say one that forks and has a "self" address and a "child" address (for your child). This contract could spawn a contract for each that implements `ForwardedAddresses` (proposed name.)
* What do we do about loops?
* This is all graph theory stuff, probably.

Maybe the best idea would be to have a set of concepts that describe the fundamental ways addresses can relate to one-another. The address space can be overloaded with all kinds of meaningful relationships.
* These two are friends.
* This one owes a debt to that one according to this third.
* This one is in a very specific state of "trust" with that one
   * e.g. I am trusting that this address will never send ether to that address. If it does, I have the right to call this other contract that will economically punish sender. How is this meaningful without tying identities to addresses ....? It is not, I believe.
* If we do say, "terminate" the chain of addresses with another contract, can we, should we, somehow indicate so?
   * For example, let's say within one `ForwardedAddresses` contract instance, I forward `Q->R->S`, and then decide I want to "jump" to another contract (maybe one that terminates or one that forwards or...). How do we indicate, "Address `S` is "jumping" to contact at address `X` that also implements `ForwardedAddresses` (or `AbandonedAddresses`)?

# Stuff with nowhere else to go

* https://eips.ethereum.org/EIPS/eip-634
