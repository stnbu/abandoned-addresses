// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package contract

import (
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// AbandonedAddressesABI is the input ABI used to generate the binding from.
const AbandonedAddressesABI = "[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"_address\",\"type\":\"address\"}],\"name\":\"AddressAbandoned\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_address\",\"type\":\"address\"}],\"name\":\"abandonAddress\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_address\",\"type\":\"address\"}],\"name\":\"isAbandoned\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]"

// AbandonedAddresses is an auto generated Go binding around an Ethereum contract.
type AbandonedAddresses struct {
	AbandonedAddressesCaller     // Read-only binding to the contract
	AbandonedAddressesTransactor // Write-only binding to the contract
	AbandonedAddressesFilterer   // Log filterer for contract events
}

// AbandonedAddressesCaller is an auto generated read-only Go binding around an Ethereum contract.
type AbandonedAddressesCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AbandonedAddressesTransactor is an auto generated write-only Go binding around an Ethereum contract.
type AbandonedAddressesTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AbandonedAddressesFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type AbandonedAddressesFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AbandonedAddressesSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type AbandonedAddressesSession struct {
	Contract     *AbandonedAddresses // Generic contract binding to set the session for
	CallOpts     bind.CallOpts       // Call options to use throughout this session
	TransactOpts bind.TransactOpts   // Transaction auth options to use throughout this session
}

// AbandonedAddressesCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type AbandonedAddressesCallerSession struct {
	Contract *AbandonedAddressesCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts             // Call options to use throughout this session
}

// AbandonedAddressesTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type AbandonedAddressesTransactorSession struct {
	Contract     *AbandonedAddressesTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts             // Transaction auth options to use throughout this session
}

// AbandonedAddressesRaw is an auto generated low-level Go binding around an Ethereum contract.
type AbandonedAddressesRaw struct {
	Contract *AbandonedAddresses // Generic contract binding to access the raw methods on
}

// AbandonedAddressesCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type AbandonedAddressesCallerRaw struct {
	Contract *AbandonedAddressesCaller // Generic read-only contract binding to access the raw methods on
}

// AbandonedAddressesTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type AbandonedAddressesTransactorRaw struct {
	Contract *AbandonedAddressesTransactor // Generic write-only contract binding to access the raw methods on
}

// NewAbandonedAddresses creates a new instance of AbandonedAddresses, bound to a specific deployed contract.
func NewAbandonedAddresses(address common.Address, backend bind.ContractBackend) (*AbandonedAddresses, error) {
	contract, err := bindAbandonedAddresses(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &AbandonedAddresses{AbandonedAddressesCaller: AbandonedAddressesCaller{contract: contract}, AbandonedAddressesTransactor: AbandonedAddressesTransactor{contract: contract}, AbandonedAddressesFilterer: AbandonedAddressesFilterer{contract: contract}}, nil
}

// NewAbandonedAddressesCaller creates a new read-only instance of AbandonedAddresses, bound to a specific deployed contract.
func NewAbandonedAddressesCaller(address common.Address, caller bind.ContractCaller) (*AbandonedAddressesCaller, error) {
	contract, err := bindAbandonedAddresses(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &AbandonedAddressesCaller{contract: contract}, nil
}

// NewAbandonedAddressesTransactor creates a new write-only instance of AbandonedAddresses, bound to a specific deployed contract.
func NewAbandonedAddressesTransactor(address common.Address, transactor bind.ContractTransactor) (*AbandonedAddressesTransactor, error) {
	contract, err := bindAbandonedAddresses(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &AbandonedAddressesTransactor{contract: contract}, nil
}

// NewAbandonedAddressesFilterer creates a new log filterer instance of AbandonedAddresses, bound to a specific deployed contract.
func NewAbandonedAddressesFilterer(address common.Address, filterer bind.ContractFilterer) (*AbandonedAddressesFilterer, error) {
	contract, err := bindAbandonedAddresses(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &AbandonedAddressesFilterer{contract: contract}, nil
}

// bindAbandonedAddresses binds a generic wrapper to an already deployed contract.
func bindAbandonedAddresses(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(AbandonedAddressesABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AbandonedAddresses *AbandonedAddressesRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AbandonedAddresses.Contract.AbandonedAddressesCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AbandonedAddresses *AbandonedAddressesRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AbandonedAddresses.Contract.AbandonedAddressesTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AbandonedAddresses *AbandonedAddressesRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AbandonedAddresses.Contract.AbandonedAddressesTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AbandonedAddresses *AbandonedAddressesCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AbandonedAddresses.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AbandonedAddresses *AbandonedAddressesTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AbandonedAddresses.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AbandonedAddresses *AbandonedAddressesTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AbandonedAddresses.Contract.contract.Transact(opts, method, params...)
}

// IsAbandoned is a free data retrieval call binding the contract method 0x6390b898.
//
// Solidity: function isAbandoned(address _address) view returns(bool)
func (_AbandonedAddresses *AbandonedAddressesCaller) IsAbandoned(opts *bind.CallOpts, _address common.Address) (bool, error) {
	var out []interface{}
	err := _AbandonedAddresses.contract.Call(opts, &out, "isAbandoned", _address)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsAbandoned is a free data retrieval call binding the contract method 0x6390b898.
//
// Solidity: function isAbandoned(address _address) view returns(bool)
func (_AbandonedAddresses *AbandonedAddressesSession) IsAbandoned(_address common.Address) (bool, error) {
	return _AbandonedAddresses.Contract.IsAbandoned(&_AbandonedAddresses.CallOpts, _address)
}

// IsAbandoned is a free data retrieval call binding the contract method 0x6390b898.
//
// Solidity: function isAbandoned(address _address) view returns(bool)
func (_AbandonedAddresses *AbandonedAddressesCallerSession) IsAbandoned(_address common.Address) (bool, error) {
	return _AbandonedAddresses.Contract.IsAbandoned(&_AbandonedAddresses.CallOpts, _address)
}

// AbandonAddress is a paid mutator transaction binding the contract method 0xf3380cce.
//
// Solidity: function abandonAddress(address _address) returns(bool)
func (_AbandonedAddresses *AbandonedAddressesTransactor) AbandonAddress(opts *bind.TransactOpts, _address common.Address) (*types.Transaction, error) {
	return _AbandonedAddresses.contract.Transact(opts, "abandonAddress", _address)
}

// AbandonAddress is a paid mutator transaction binding the contract method 0xf3380cce.
//
// Solidity: function abandonAddress(address _address) returns(bool)
func (_AbandonedAddresses *AbandonedAddressesSession) AbandonAddress(_address common.Address) (*types.Transaction, error) {
	return _AbandonedAddresses.Contract.AbandonAddress(&_AbandonedAddresses.TransactOpts, _address)
}

// AbandonAddress is a paid mutator transaction binding the contract method 0xf3380cce.
//
// Solidity: function abandonAddress(address _address) returns(bool)
func (_AbandonedAddresses *AbandonedAddressesTransactorSession) AbandonAddress(_address common.Address) (*types.Transaction, error) {
	return _AbandonedAddresses.Contract.AbandonAddress(&_AbandonedAddresses.TransactOpts, _address)
}

// AbandonedAddressesAddressAbandonedIterator is returned from FilterAddressAbandoned and is used to iterate over the raw logs and unpacked data for AddressAbandoned events raised by the AbandonedAddresses contract.
type AbandonedAddressesAddressAbandonedIterator struct {
	Event *AbandonedAddressesAddressAbandoned // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AbandonedAddressesAddressAbandonedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AbandonedAddressesAddressAbandoned)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AbandonedAddressesAddressAbandoned)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AbandonedAddressesAddressAbandonedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AbandonedAddressesAddressAbandonedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AbandonedAddressesAddressAbandoned represents a AddressAbandoned event raised by the AbandonedAddresses contract.
type AbandonedAddressesAddressAbandoned struct {
	Address common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterAddressAbandoned is a free log retrieval operation binding the contract event 0x90bfda231c7b998fb355e3e13f56b2bb67f3539640e639460ffdae027ee31876.
//
// Solidity: event AddressAbandoned(address indexed _address)
func (_AbandonedAddresses *AbandonedAddressesFilterer) FilterAddressAbandoned(opts *bind.FilterOpts, _address []common.Address) (*AbandonedAddressesAddressAbandonedIterator, error) {

	var _addressRule []interface{}
	for _, _addressItem := range _address {
		_addressRule = append(_addressRule, _addressItem)
	}

	logs, sub, err := _AbandonedAddresses.contract.FilterLogs(opts, "AddressAbandoned", _addressRule)
	if err != nil {
		return nil, err
	}
	return &AbandonedAddressesAddressAbandonedIterator{contract: _AbandonedAddresses.contract, event: "AddressAbandoned", logs: logs, sub: sub}, nil
}

// WatchAddressAbandoned is a free log subscription operation binding the contract event 0x90bfda231c7b998fb355e3e13f56b2bb67f3539640e639460ffdae027ee31876.
//
// Solidity: event AddressAbandoned(address indexed _address)
func (_AbandonedAddresses *AbandonedAddressesFilterer) WatchAddressAbandoned(opts *bind.WatchOpts, sink chan<- *AbandonedAddressesAddressAbandoned, _address []common.Address) (event.Subscription, error) {

	var _addressRule []interface{}
	for _, _addressItem := range _address {
		_addressRule = append(_addressRule, _addressItem)
	}

	logs, sub, err := _AbandonedAddresses.contract.WatchLogs(opts, "AddressAbandoned", _addressRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AbandonedAddressesAddressAbandoned)
				if err := _AbandonedAddresses.contract.UnpackLog(event, "AddressAbandoned", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAddressAbandoned is a log parse operation binding the contract event 0x90bfda231c7b998fb355e3e13f56b2bb67f3539640e639460ffdae027ee31876.
//
// Solidity: event AddressAbandoned(address indexed _address)
func (_AbandonedAddresses *AbandonedAddressesFilterer) ParseAddressAbandoned(log types.Log) (*AbandonedAddressesAddressAbandoned, error) {
	event := new(AbandonedAddressesAddressAbandoned)
	if err := _AbandonedAddresses.contract.UnpackLog(event, "AddressAbandoned", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
