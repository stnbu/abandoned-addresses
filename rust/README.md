**Verbatim what `index.html` says...**

```html
    <h2>Abandoned-Addresses WASM</h2>
    <p>This is a Rust-WASM implementation of the abandoned-addresses web3 API for use in place of etheres.js</p>
    <p>This page will likely go away and is only useful for the first stages of bootstrapping.</p>
    <hr />
    <p>This crate has experimental support for <code>externref</code>. It appears to work in the latest Firefox but may not work in you browser.</p>
    <p>If you see "Hello abandoned-addresses!" printed below, your browser supports WASM.</p>
    <p>If not, you might look at the browser's JavaScript console for errors. Not supporting <code>externref</code> is not a big deal. If you would like to work on this project, you only need install the latest Firefox browser to load and run the resulting WASM.</p>
    <hr />
```

**To build:**

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

```
cargo build --target wasm32-unknown-unknown
wasm-bindgen --out-dir ../www/res --target web --reference-types --no-typescript --omit-default-module-path target/wasm32-unknown-unknown/debug/abandoned_addresses.wasm
```

...leaving the output where it is, you should now be able to serve `./../www` and go to `/behold-wasm-support.html` to see if things are working.
