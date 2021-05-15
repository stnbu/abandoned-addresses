# Network config

This isn't great, but what we will do for now is have the deployment infra maintain files in this directory.

To deploy, in the root directory of this repository, run

```bash
brownie run ./scripts/deploy.py
```

This will write out a file named `./www/deployments/default.js`, which is sourced by the dapp to know which contract address and ABI to use.
