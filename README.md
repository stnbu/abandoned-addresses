PoC: https://dapps.unintuitive.org/blacklist/

# The Idea...

> :warning: I hereby assert that I know this might be a stupid idea or obviated by something else.

Blacklisting is an incredibly simple idea. It's just the idea of an "array", which is an idea going back a while, overloaded with a concept. "All of these are on the blacklist."

Likewise blacklisting on Ethereum should be that simple. And naturally there won't be one authoritative blacklist, nor should there. There's just a market of blacklists. The popular ones rise to the top. The same thing applies to widespread "ad filtering" software on browsers. They come with a compiled-in default only because that is the one that won the most confidence long ago. You're free to choose whatever you like. This doesn't try to be anything more complicated than a list of addresses, with a UI.

* Only the key owner can blacklist their own key. This is not about reporting bad behavior, this is about declaring that you do not claim ownership of that key anymore. Maybe you lost the wallet? Maybe you shared the seed phrase with someone and you no longer trust that someone. You can assert: "This is not my key anymore. It's not _me_, I don't know who it is now."
* What applications do with this is totally up for grabs, but the obvious thing would be, say, contract Q refuses to accept any address blacklisted by contract R.
* There is no going back, you cannot un-blacklist yourself.
* There is no central anything. This is just a proposition.
* If we do have a dashboard it should go through the blockchain and find all blackilst contracts (by "interface") and make queries about them. Who has the most addresses? Who has the most recent update? Who is recieving the greatest rate-of-update? Which contracts are listed as "blacklisted" by other contracts?

# The Web UI

For the PoC...

* Without some kind of fundamental change, it will never be possible to "search" or "glob search" or anything like that on the keys. So there's no call for any "listing" of keys. It wouldn't make sense.
* Super simple: A button that says "Connect with MetaMask" (or its modern equivalent), "Blacklist my Address", and "Check if Blacklisted"
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

# About brownie

We expect there to be a `.env` file in your project root with the following line:

> export PRIVATE_KEY="526fbabbd78b1dcc5-nom-nom-nom-a0aec16aa91448db33e9a0c9ff0129d749"

In other words your 32 byte, 64 character hexidecimal private key (which of course you would not use if it were from mainnet! say it...!) corresponding to a real account with a positive balance on the `rinkeby` test network. Ask for help? File an issue?

```
~/.brownie$ ls -l network-config.yaml
lrwxrwxrwx 1 larry larry 36 May 15 15:12 network-config.yaml -> [SOME_PATH]/blacklist/network-config.yaml
```

That is, link the `network-config.yaml` in this repo to `~/.brownie/network-config.yaml` on your system (until "we" understand how to keep that bit in the repo correctly.)

`geth` needs to be running and syncing with `rinkeby` and listening on the standard port on loopback.

I think that's it...? _You_ need to figure out how to install `eth-brownie`. That's all you, bro.