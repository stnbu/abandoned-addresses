// Interact with AbandonedAddresses using go-ethereum/ethclient

package main

import (
	"github.com/spf13/cobra"
)

func main() {

	var cmdPrint = &cobra.Command{
		Use:   "is-abandoned [string to print]",
		Short: "Print anything to the screen",
		Long:  `is-abandoned BLAH!`,
		Args:  cobra.MinimumNArgs(1),
		Run:   printIsAbandoned,
	}

	var rootCmd = &cobra.Command{Use: "app"}

	rootCmd.AddCommand(cmdPrint)
	rootCmd.Execute()
}
