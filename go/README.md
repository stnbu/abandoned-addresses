
## To generate contract/contract.go I ...

1. Installed abigen (go-ethereum/cmd)
1. copied the ../www/deployments/default.js file and edited out everything _except_ the ABI JSON (`[...]`)
1. Ran the command `abigen --abi /tmp/abandoned_addresses.abi --pkg=contract --out=contract/contract.go`

## TODO

1. Use `go generate` [to make](https://github.com/ethereum/go-ethereum/blob/c73652da0bb0ca4a4ecf3b88b0efed085be9adc4/contracts/checkpointoracle/oracle.go#L20) the wrappers.
1. Wouldn't it be nice if that were neatly tied into "deploy" and all that? HOW!? There are so many axies:
   * which version/branch/tag of the project ...? how do in-repo versions get "stampped"? when I release v1.2.3, how do I record that in the project somewhere and also commit that and also tag it (like that?)
   * which chainId? the releases of the softwares needn't be tied to what's on the blockchain. We only need to ensure the contract in the repo accurately reflects the deployed contract. But what about ganache-cli testing? Those are "deployments". But those are also transient, so if we had a `contract_addr <-> chainId` mapping, it wouldn't make sense to put it in there...or would it? Say, if the file didn't get checked in? **Or** if we picked a static chainId for ganache/ephemeral chains we could put that in the repo.
   * When the contract code changes, we need to:
      1. Deploy on public nets IFF it is a "public release" (wot doz that mean?)
      1. Build the go wrapper automatically, with "go generate" ... I guess. But that's never checked in, right? So when using your dev environment, how do you trigger "go generate"? ... maybe it's part of the tests. All _testing_ when developing code should be _testing_, written in there or added by you if appropriate (yes sir!!)
      1. Changes to js and (committed) go code should not trigger anything ci/cd-wise
      1. uuugh. maybe this is why separate repos?
