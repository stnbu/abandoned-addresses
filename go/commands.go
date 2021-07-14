// Functions for use as cobra subcommands.

package main

import (
	"fmt"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/stnbu/abandoned-addresses/go/contract"

	"github.com/spf13/cobra"
)

const (
	CONTRACT_ADDRESS = "0x915AB0674D678E42E97eC3187d8DE5953b95C1DD"
)

func printIsAbandoned(cmd *cobra.Command, args []string) {
	conn, err := ethclient.Dial("http://127.0.0.1:8545")
	if err != nil {
		fmt.Errorf("Failed to connect to the Ethereum client: %v\n", err)
	}
	abandonedAddresses, err := contract.NewAbandonedAddressesCaller(
		common.HexToAddress(CONTRACT_ADDRESS), conn)
	if err != nil {
		fmt.Errorf("Failed to instantiate contract: %v", err)
	}

	testAddress := common.HexToAddress(args[0])

	isAbandoned, err := abandonedAddresses.IsAbandoned(&bind.CallOpts{}, testAddress)
	if err != nil {
		fmt.Errorf("Failed to check if address abandoned: %v", err)
	}
	if isAbandoned {
		fmt.Printf("Address %s IS abandoned\n", testAddress)
	} else {
		fmt.Printf("Address %s IS NOT abandoned\n", testAddress)
	}
}
