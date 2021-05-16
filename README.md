PoC: https://dapps.unintuitive.org/blacklist/

# The Idea...

Blacklisting is an incredibly simple idea. It's just the idea of an "array", which is an idea going back a while, overloaded with a concept. "All of these are on the blacklist."

Likewise blacklisting on Ethereum should be that simple. And naturally there won't be one authoritative blacklist, nor should there. There's just a market of blacklists. The popular ones rise to the top. The same thing applies to widespread "ad filtering" software on browsers. They come with a compiled-in default only because that is the one that won the most confidence long ago. You're free to choose whatever you like. This doesn't try to be anything more complicated than a list of addresses, with a UI.

* Only the key owner can blacklist their own key. This is not about reporting bad behavior, this is about declaring that you do not claim ownership of that key anymore. Maybe you lost the wallet? Maybe you shared the seed phrase with someone and you no longer trust that someone. You can assert: "This is not my key anymore. It's not _me_, I don't know who it is now."
* What applications do with this is totally up for grabs, but the obvious thing would be, say, contract Q refuses to accept any address blacklisted by contract R.
* There is no going back, you cannot un-blacklist yourself.
* There is no central anything. This is just a proposition.
* If we do have a dashboard it should go through the blockchain and find all blacklist contracts (by "interface") and make queries about them. Who has the most addresses? Who has the most recent update? Who is receiving the greatest rate-of-update? Which contracts are listed as "blacklisted" by other contracts?

# The Web UI

For the PoC...

* Without some kind of fundamental change, it will never be possible to "search" or "glob search" or anything like that on the keys. So there's no call for any "listing" of keys. It wouldn't make sense.
* Super simple: A button that says "Connect with Metamask" (or its modern equivalent), "Blacklist my Address", and "Check if Blacklisted"
   * The latter two have an address field next to them (`An Ethereum address is a 42 characters hexadecimal address derived from the last 20 bytes of the public key controlling the account with 0x appended in front. e.g., 0x71C7656EC7ab88b098defB751B7401B5f6d8976F`)
   * The "Check if Blacklisted" has a "response" associated with it. If "yes", display one thing, if "no" display a different thing (e.g. "This key is NOT blacklisted" vs "this key IS blacklisted")

# The Contract

* As simple as possible.
* Has `blacklistAddress(<address>)` and `isBlacklisted(<address>)` the former will immediately revert if `msg.sender != address`, the latter just consults a `mapping(address => bool)` and returns the corresponding "is blacklisted?" value (True/False).
* There is no cost of any kind except for gas.
* Like an ERC, I imagine there would just be a method spec, but I think it would ruin things if it were much more complicated. I-deas, yall? One could blacklist a blacklist by adding it to another blacklist, so that's already built in.
* We _could_ allow a forward-to address to be included instead of the bool. That's a pretty big can of worms, but that's worth thinking on. What this can be is a network of address you can 'walk', even just within this contract, there are circuits tracing a path from one key to another, `[k0:k1, k2:k2]` is another way of saying `k0 -> k1 -> k2`. And since the addition of the `k1` record was signed by `k0`, by induction you know you have a linked list of keys and therefore "cryptographic provenance" 🎩 👑 
   * This is a much much bigger can of worms
   * A pretty neat can of worms though

# Deploying, Running, and Testing

You will need a local ethereum client or some kind of HTTP-RPC at `http://127.0.0.1:8545` (if configured per instructions). Geth is not hard. Inquire within.

## Testing

> ...

## Deployment

"Deploying" this dApp is easy, just serve the contents of `./www` with a web server. But you need a deployed contract to interact with. We use [brownie](https://github.com/eth-brownie/brownie) as a simple infrastructure tool.

Installing brownie will inevitably involve fiddling, but basically:

```bash
python3 -m venv ~/venv3
source ~/venv3/bin/activate
pip3 install eth-brownie
```

Once installed, there should be only two prerequisites to deploying (currently just to Rinkeby).

1. Link the `network-config.yaml` file to your `~/.brownie/` directory.
1. create a `./.env` file with the contents `export PRIVATE_KEY="..."`

Having done that, you _should_ be able to

```bash
brownie run --network=rinkeby ./scripts/deploy.py
```

And in ten seconds, give or take, you should have

1. A successful deployment of `Blacklist.sol`
1. a new file at `./www/deployments/default.js` with the ABI and contract address.

You should now be good to go. File an issue if something doesn't work.

> :bulb: The `foo` in `--network=foo` refers to the values at `live.networks.id` and `development.id` in the file `~/.brownie/network-config.yaml` that's it! Nothing else! That is, the ID values found in the union of those two config paths. (wonder how dupes are handled...)

# Going further...

The idea of having an address mapping to another address instead of a bool could be a productive idea. But a few things...

* If we replaced bool with `address`, how would we indicate "end of the line"? We can't use the zero address (or could we), so instead you call another contract (this one) and call its methot to say: "No more forwarding addresses! I'm going off-grid!" If that idea is to exist and we want simplity of design (?) then that seems like a better idea than arbitrarally declaring the zero address to be end-of-the-line...(?)
   * What if say you want an address for everyone in your family and you have a son? Well, you might want to "terminate" the chain of address forwardings with a call to another contract, with another interface. This time, say one that forks and has a "self" address and a "child" address (for your child). This contract could spawn a contract for each that implements `AddressForwarding` (hypothetical given name.)
* What do we do about loops?
* This is all graph theory stuff, probably.

Maybe the best idea would be to have a set of concepts that describe the fundamental ways addresses can relate to one-another. The address space can be overloaded with all kinds of meaningful relationships.
* These two are friends.
* This one owes a debt to that one according to this third.
* This one is in a very specific state of "trust" with that one
   * e.g. I am trusting that this address will never send ether to that address. If it does, I have the right to call this other contract that will economically punish sender. How is this meaningful whithout tying identities to addresses ....? It is not, I believe.
