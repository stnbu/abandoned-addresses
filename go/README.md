
To generate contract/contract.go I ...

1. Installed abigen (go-ethereum/cmd)
1. copied the ../www/deployments/default.js file and edited out everything _except_ the ABI JSON (`[...]`)
1. Ran the command `abigen --abi /tmp/abandoned_addresses.abi --pkg=contract --out=contract/contract.go`
