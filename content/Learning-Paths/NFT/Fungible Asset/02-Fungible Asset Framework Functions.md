# Fungible Asset Framework Functions

## Summary

- Comprehensive framework for managing fungible assets in blockchain systems
- Core functions for token initialization, storage, and basic transactions
- Minting and burning capabilities for supply management
- Asset management functions for splitting, merging, and optimizing tokens
- Store management for lifecycle and state control of token stores
- Reference generation for establishing permissions and authorities
- Metadata management for retrieving and validating token information
- Advanced features for enhanced security, performance, and customization

## Core Functions

**Overview:**
Core functions represent the fundamental building blocks of the framework, essential for establishing and managing fungible assets. These functions are utilized when:

- Initializing a new token type
- Creating token storage facilities (stores)
- Executing basic token transactions between stores
- Managing deposit/withdraw operations

This function group serves as the foundation for all other operations within the framework and represents the most frequently used functionalities.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `add_fungibility` | constructor_ref: `&ConstructorRef`, `maximum_supply: Option<u128>`, `name: String`, `symbol: String`, `decimals: u8`, `icon_uri: String`, `project_uri: String` | Makes an existing object fungible by adding Metadata resource. Sets up maximum supply monitoring. | Object<Metadata> |
| `create_store` | constructor_ref: `&ConstructorRef`, `metadata: Object<T>` | Creates a new store for holding fungible assets with zero initial balance. | Object<FungibleStore> |
| `withdraw` | owner: `&signer`, `store: Object<T>`, `amount: u64` | Withdraws specified amount from store owned by signer. | FungibleAsset |
| `deposit` | store: `Object<T>`, `fa: FungibleAsset` | Deposits fungible asset into specified store. | void |
| `transfer` | sender: `&signer`, `from: Object<T>`, `to: Object<T>`, `amount: u64` | Transfers fungible assets between stores. | void |

## Minting & Burning

**Overview:**
This group of functions handles token creation and destruction, commonly used in scenarios involving:

- Issuing new tokens into circulation
- Managing total token supply
- Implementing tokenomics and emission schedules
- Handling token burning events and supply reduction

These functions typically have restricted access, limited to addresses with token issuance authority (such as token owners).

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `mint` | ref: &MintRef, amount: u64 | Mints new fungible assets. | FungibleAsset |
| `mint_to` | ref: &MintRef, store: Object<T>, amount: u64 | Mints directly to specified store. | void |
| `burn` | ref: &BurnRef, fa: FungibleAsset | Burns fungible assets. | void |
| `burn_from` | ref: &BurnRef, store: Object<T>, amount: u64 | Burns amount from specified store. | void |

## Asset Management

**Overview:**
Asset Management functions facilitate the manipulation and management of fungible assets. These are particularly useful when:

- Splitting tokens into smaller denominations
- Consolidating multiple token fragments
- Managing zero-value tokens
- Optimizing token handling in complex applications

These functions are essential for building sophisticated features like liquidity pools, vaults, or other DeFi mechanisms.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `extract` | fungible_asset: &mut FungibleAsset, amount: u64 | Extracts amount from existing asset. | FungibleAsset |
| `merge` | dst_fungible_asset: &mut FungibleAsset, src_fungible_asset: FungibleAsset | Merges two fungible assets. | void |
| `destroy_zero` | fungible_asset: FungibleAsset | Destroys zero-value asset. | void |
| `zero` | metadata: Object<T> | Creates zero-value asset. | FungibleAsset |

## Store Management

**Overview:**
Store Management functions handle the lifecycle and state of token stores. These functions are essential when:

- Initializing and managing new wallets/stores
- Checking store states and balances
- Managing store freeze states
- Cleaning up and removing unused stores

These functions are crucial for maintaining store lifecycle and ensuring secure token storage.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `remove_store` | delete_ref: &DeleteRef | Removes empty store. | void |
| `store_exists` | store: address | Checks if store exists. | bool |
| `balance` | store: Object<T> | Gets store balance. | u64 |
| `is_frozen` | store: Object<T> | Checks if store is frozen. | bool |

## Reference Generation

**Overview:**
Reference Generation functions create capability references for fungible assets. These are utilized when:

- Establishing mint/burn permissions
- Setting up token transfer authorities
- Implementing complex permission management
- Creating permission-limited smart contracts

These functions are vital for implementing tokenomics and permission management within the system.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `generate_mint_ref` | constructor_ref: &ConstructorRef | Creates mint capability. | MintRef |
| `generate_burn_ref` | constructor_ref: &ConstructorRef | Creates burn capability. | BurnRef |
| `generate_transfer_ref` | constructor_ref: &ConstructorRef | Creates transfer capability. | TransferRef |

## Metadata Management

**Overview:**
Metadata Management functions handle token descriptive information. These functions are essential when:

- Retrieving token information
- Verifying supply limits and current circulation
- Displaying token information in UI/UX
- Validating token properties

These functions are crucial for external system integration and providing user information.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `metadata` | metadata: Object<T> | Gets metadata struct. | Metadata |
| `supply` | metadata: Object<T> | Gets current supply. | Option<u128> |
| `maximum` | metadata: Object<T> | Gets maximum supply. | Option<u128> |
| `name` | metadata: Object<T> | Gets asset name. | String |
| `symbol` | metadata: Object<T> | Gets asset symbol. | String |
| `decimals` | metadata: Object<T> | Gets decimal places. | u8 |

## Advanced Features

**Overview:**
Advanced Features provide enhanced functionality for fungible assets. These are implemented when:

- Requiring specialized security mechanisms
- Optimizing performance with concurrent operations
- Establishing special transfer restrictions
- Upgrading token functionality

These functions are typically employed in complex applications or when specific advanced features are needed.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `set_frozen_flag` | ref: &TransferRef, store: Object<T>, frozen: bool | Sets store frozen status. | void |
| `upgrade_to_concurrent` | ref: &ExtendRef | Upgrades to concurrent supply. | void |
| `upgrade_store_to_concurrent` | owner: &signer, store: Object<T> | Upgrades store to concurrent. | void |
| `set_untransferable` | constructor_ref: &ConstructorRef | Makes asset untransferable. | void |

## Dispatch Functions

**Overview:**
Dispatch Functions enable customization of fungible asset behavior. These are used when:

- Implementing custom transfer logic
- Adding operation hooks
- Creating derived calculations
- Implementing complex business rules

These functions are designed for advanced users who need to customize their token's operational behavior.

| Function Name | Parameters | Description | Return Type |
| --- | --- | --- | --- |
| `register_dispatch_functions` | constructor_ref: &ConstructorRef, withdraw_function: Option<FunctionInfo>, deposit_function: Option<FunctionInfo>, derived_balance_function: Option<FunctionInfo> | Registers dispatch hooks. | void |
| `register_derive_supply_dispatch_function` | constructor_ref: &ConstructorRef, dispatch_function: Option<FunctionInfo> | Registers supply derivation. | void |