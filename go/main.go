
package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/stnbu/abandoned-addresses/go/contract"

	"math/big"
)

func main() {
	conn, err := ethclient.Dial("http://127.0.0.1:8545")
	if err != nil {
		fmt.Errorf("Failed to connect to the Ethereum client: %v\n", err)
	}

	aa, err := contract.NewAbandonedAddresses(common.HexToAddress("0x915AB0674D678E42E97eC3187d8DE5953b95C1DD"), conn)
	if err != nil {
		fmt.Errorf("Failed to instantiate contract: %v", err)
	}
	fmt.Printf("A new contract! -- %v\n", aa)

	addr := common.HexToAddress("0xafe8d48DeFC7B96912C638C8900CB71dDB1acEC4")

	isab, err := aa.AbandonedAddressesCaller.IsAbandond(addr)
	// isab, err := aa.IsAbandond(addr)
	if err != nil {
		fmt.Errorf("Failed to check if address abandoned: %v", err)
	}
	if isab {
		fmt.Println("IS IS IS abandoned!")
	}
	
	ctx := context.Background()
	block, _ := conn.BlockByNumber(ctx, big.NewInt(123))
	fmt.Printf("block: %v\n", block)

	balance, _ := conn.BalanceAt(ctx, addr, nil)
	fmt.Printf("balance of addr: %v\n", balance)

	// tx := new(types.Transaction)
	// err = conn.SendTransaction(ctx, tx)

	progress, _ := conn.SyncProgress(ctx)
	fmt.Printf("progress: %v", progress)

	//fmt.Println(conn)

	// dotevn:
	//   addr: 0xfB347F5c31c2653206c222793Fb1722A2E5D01Dd
	//   priv: 526fbabbd786b1dcc50693fa6075e8a0aec16aa91448db33e9a0c9ff0129d749


	/*
	// SOME JUNK. REFERNCE...
	   
	// Retrieve the pending nonce for an account
	nonce, err := conn.NonceAt(ctx, addr, nil)
	to := addr // common.HexToAddress("0xABCD")
	amount := big.NewInt(10 * params.GWei)
	gasLimit := uint64(21000)
	gasPrice := big.NewInt(10 * params.GWei)
	data := []byte{}
	// Create a raw unsigned transaction
	tx := types.NewTransaction(nonce, to, amount, gasLimit, gasPrice, data)
	/////


	/////
	// Use secret key hex string to sign a raw transaction
	SK := "526fbabbd786b1dcc50693fa6075e8a0aec16aa91448db33e9a0c9ff0129d749"
	sk := crypto.ToECDSAUnsafe(common.FromHex(SK))// Sign the transaction
	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(nil), sk)
	// You could also create a TransactOpts object
	opts := bind.NewKeyedTransactor(sk)
	// To get the address corresponding to your private key
	addr := crypto.PubkeyToAddress(sk.PublicKey)
	/////
	*/
}
