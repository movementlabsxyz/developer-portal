# Primary Fungible Store Framework Functions

## Executive Summary

The Primary Fungible Store Framework provides a comprehensive set of functions for managing fungible assets with primary stores. Key aspects include:

- Store creation and management for fungible assets
- Query functions for accessing store information
- Basic operations for asset transfers and balance management
- Advanced operations for complex asset handling
- Reference-based operations for enhanced control and security
- Internal functions for optimized framework support

This framework emphasizes deterministic store creation, strong security measures, and flexible asset management, making it suitable for various applications ranging from simple currency-like tokens to complex asset management systems.

## Store Creation and Management

**Overview:**
These functions handle the creation and management of primary stores for fungible assets. They are used when:

- Setting up new fungible assets with primary store support
- Creating and managing user primary stores
- Checking store existence and status
- Managing store references

These functions form the foundation for managing primary fungible asset stores.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `create_primary_store_enabled_fungible_asset` | constructor_ref: &ConstructorRef, maximum_supply: Option<u128>, name: String, symbol: String, decimals: u8, icon_uri: String, project_uri: String | Creates a fungible asset with primary store support for automatic store creation during transfers. | void |
| `create_primary_store` | owner_addr: address, metadata: Object<T> | Creates a primary store object for holding fungible assets for the given address. | Object<FungibleStore> |
| `ensure_primary_store_exists` | owner: address, metadata: Object<T> | Ensures primary store exists for owner, creates if not. | Object<FungibleStore> |
| `may_be_unburn` | owner: &signer, store: Object<FungibleStore> | Unburns a store if it's burned. | void |

## Query Functions

**Overview:**
These functions provide read-only access to store information. They are essential for:

- Checking store existence and location
- Querying balances and states
- Getting store addresses
- Verifying store conditions

These functions are commonly used in frontend integrations and for validation.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `primary_store_address` | owner: address, metadata: Object<T> | Gets address of primary store for account. | address |
| `primary_store` | owner: address, metadata: Object<T> | Gets primary store object for account. | Object<FungibleStore> |
| `primary_store_exists` | account: address, metadata: Object<T> | Checks if primary store exists. | bool |
| `balance` | account: address, metadata: Object<T> | Gets balance of account's primary store. | u64 |
| `is_balance_at_least` | account: address, metadata: Object<T>, amount: u64 | Checks if store has sufficient balance. | bool |
| `is_frozen` | account: address, metadata: Object<T> | Checks if store is frozen. | bool |

## Basic Operations

**Overview:**
These functions provide core functionality for managing assets. Used for:

- Basic transfer operations
- Asset withdrawals and deposits
- Standard asset movements
- Balance management

Essential functions for day-to-day asset operations.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `withdraw` | owner: &signer, metadata: Object<T>, amount: u64 | Withdraws from owner's primary store. | FungibleAsset |
| `deposit` | owner: address, fa: FungibleAsset | Deposits to owner's primary store. | void |
| `force_deposit` | owner: address, fa: FungibleAsset | Forces deposit to owner's store (friend function). | void |
| `transfer` | sender: &signer, metadata: Object<T>, recipient: address, amount: u64 | Transfers between primary stores. | void |

## Advanced Operations

**Overview:**
These functions provide enhanced control over assets. Used when:

- Implementing complex transfer logic
- Managing asset supply
- Handling special transfers
- Implementing security features

These functions are typically used in more sophisticated applications.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `mint` | mint_ref: &MintRef, owner: address, amount: u64 | Mints to owner's primary store. | void |
| `burn` | burn_ref: &BurnRef, owner: address, amount: u64 | Burns from owner's primary store. | void |
| `set_frozen_flag` | transfer_ref: &TransferRef, owner: address, frozen: bool | Sets frozen status of store. | void |
| `transfer_assert_minimum_deposit` | sender: &signer, metadata: Object<T>, recipient: address, amount: u64, expected: u64 | Transfers with minimum deposit assertion. | void |

## Reference-Based Operations

**Overview:**
These functions use references for enhanced control. Used for:

- Privileged operations
- Reference-based transfers
- Secure asset movements
- Special permissions handling

These functions provide additional security and control mechanisms.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `withdraw_with_ref` | transfer_ref: &TransferRef, owner: address, amount: u64 | Withdraws ignoring frozen flag. | FungibleAsset |
| `deposit_with_ref` | transfer_ref: &TransferRef, owner: address, fa: FungibleAsset | Deposits ignoring frozen flag. | void |
| `transfer_with_ref` | transfer_ref: &TransferRef, from: address, to: address, amount: u64 | Transfers between stores ignoring frozen flags. | void |

## Internal/Inline Functions

**Overview:**
These functions provide internal support for the framework. Used for:

- Internal store operations
- Optimized lookups
- Internal validations
- Performance optimizations

These functions support the framework's internal operations.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `primary_store_address_inlined` | owner: address, metadata: Object<T> | Gets store address (inline version). | address |
| `primary_store_inlined` | owner: address, metadata: Object<T> | Gets store object (inline version). | Object<FungibleStore> |
| `primary_store_exists_inlined` | account: address, metadata: Object<T> | Checks store existence (inline version). | bool |

### Primary Use Cases:

1. Currency-like tokens requiring easy store management
2. Assets needing automatic store creation
3. Systems requiring deterministic store addresses
4. Applications needing unified asset management
5. Platforms requiring secure asset transfers