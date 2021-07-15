# Abandoned-Addresses WASM

This is a Rust-WASM implementation of the abandoned-addresses web3 API for use in place of etheres.js

## Building

[Raise an issue](https://github.com/stnbu/abandoned-addresses/issues/new/choose)
if these instructions are at all incomplete. They should be comprehensive.

> :warning: If you already have the tools or are "more savvy", you may choose to skip these first commands.
> Note that Rust works hard [so you don't have tooo](https://youtu.be/Oh0OdgjOdDk), so the below commands
> can take many tens of minutes to execute. Or more.

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli
```

Once the above tooling is in place, you can just run

```
cargo build --target wasm32-unknown-unknown
wasm-bindgen --out-dir ../www/res --target web --reference-types --no-typescript --omit-default-module-path target/wasm32-unknown-unknown/debug/abandoned_addresses.wasm
```

Leaving the output from the above where it is, you should now be able to serve `./../www` and go to `/behold-wasm-support.html` in your wasm-capable browser to see if things are working.
