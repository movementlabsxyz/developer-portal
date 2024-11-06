# Initialize a Fungible Asset

### Summary

- Fungible assets are interchangeable and divisible digital tokens, similar to cryptocurrencies.
- The initialization process involves setting up token configuration, creating metadata, and implementing management structures.
- Essential steps include defining token properties (name, symbol, decimals), creating a metadata object, and generating management references.
- View functions are implemented to retrieve token metadata, check account balances, and verify frozen status.
- Best practices include proper error handling, optimization techniques, and comprehensive testing.
- Common pitfalls to avoid are related to initialization, view function implementation, and testing procedures.

## Overview

Fungible assets are digital tokens that are interchangeable and divisible, such as cryptocurrencies. This guide outlines the process of initializing a fungible asset on a blockchain platform, focusing on:

- Setting up token configuration
- Creating metadata and management structures
- Implementing essential view functions
- Best practices for development and testing

The tutorial provides step-by-step instructions and code examples to help developers create a robust and functional fungible asset system.

## 1. Introduction

This article provides detailed instructions on how to:

- Initialize a Fungible Asset
- Set up management references
- Implement basic view functions

## 2. Token Configuration Structure

```
/// Token configuration constants
const TOKEN_NAME: vector&lt;u8&gt; = b"YourToken";
const TOKEN_SYMBOL: vector&lt;u8&gt; = b"YTK";
const TOKEN_DECIMALS: u8 = 6;
```

**Components:**

- `TOKEN_NAME`: Full name of the token
- `TOKEN_SYMBOL`: Short symbol (3–5 characters)
- `TOKEN_DECIMALS`: Number of decimal points (typically 6–8)

## 3. Token Initialization

### 3.1. Create Metadata Object

```
fun init_module(module_signer: &signer) {
    let constructor_ref = &object::create_named_object(
        module_signer,
        TOKEN_SYMBOL,
    );
```

**Details:**

- `module_signer`: Module signer (typically the deployer)
- `constructor_ref`: Reference for creating related objects
- `create_named_object`: Creates an object with a deterministic address

### 3.2. Initialize Fungible Asset

```
primary_fungible_store::create_primary_store_enabled_fungible_asset(
    constructor_ref,
    option::none(),                 // Maximum supply (none = unlimited)
    string::utf8(TOKEN_NAME),       // Token name
    string::utf8(TOKEN_SYMBOL),     // Token symbol
    TOKEN_DECIMALS,                 // Decimals
    string::utf8(b""),              // Icon URI
    string::utf8(b""),              // Project URI
);
```

**Parameters:**

1. `constructor_ref`: Reference from the previous step
2. `maximum_supply`: Supply limit (option::none() = unlimited)
3. `name`: Token name
4. `symbol`: Token symbol
5. `decimals`: Number of decimals
6. `icon_uri`: Token icon URL
7. `project_uri`: Project URL

### 3.3. Create and Store Management References

```
// Generate refs
let mint_ref = fungible_asset::generate_mint_ref(constructor_ref);
let burn_ref = fungible_asset::generate_burn_ref(constructor_ref);
let transfer_ref = fungible_asset::generate_transfer_ref(constructor_ref);

// Store refs
let metadata_signer = &object::generate_signer(constructor_ref);
move_to(
    metadata_signer,
    TokenManagement {
        mint_ref,
        burn_ref,
        transfer_ref,
    }
);
```

**References:**

1. `mint_ref`: Authority to create new tokens
2. `burn_ref`: Authority to destroy tokens
3. `transfer_ref`: Authority to manage transfers and frozen status

## 4. Implement View Functions

### 4.1. Get Metadata Function

```
#[view]
public fun get_metadata(): object::Object&lt;fungible_asset::Metadata&gt; {
    object::address_to_object(
        object::create_object_address(&@module_addr, TOKEN_SYMBOL)
    )
}
```

**Function:**

- Returns the token's metadata object
- Uses module address and token symbol to calculate the address
- Marked as a view function to optimize gas usage

### 4.2. Get Balance Function

```
#[view]
public fun get_balance(account: address): u64 {
    if (primary_fungible_store::primary_store_exists(account, get_metadata())) {
        primary_fungible_store::balance(account, get_metadata())
    } else {
        0
    }
}
```

**Flow:**

1. Check if the store exists
2. If the store exists, return the balance
3. If not, return 0

### 4.3. Check Frozen Status

```
#[view]
public fun is_frozen(account: address): bool {
    if (primary_fungible_store::primary_store_exists(account, get_metadata())) {
        primary_fungible_store::is_frozen(account, get_metadata())
    } else {
        false
    }
}
```

**Flow:**

1. Check if the store exists
2. If the store exists, return the frozen status
3. If not, return false

## 5. Usage Examples

### Check Token Info

```
// Get token metadata
let metadata = get_metadata();

// Check account balance
let balance = get_balance(@user);

// Check if account is frozen
let is_frozen = is_frozen(@user);
```

## 6. Best Practices

### 6.1. Error Handling

```
const ESTORE_NOT_FOUND: u64 = 1;
const EINVALID_METADATA: u64 = 2;

public fun safe_get_balance(account: address): u64 {
    assert!(primary_fungible_store::primary_store_exists(account, get_metadata()),
        ESTORE_NOT_FOUND
    );
    get_balance(account)
}
```

### 6.2. Optimization

```
// Cache metadata object for frequent use
let cached_metadata = get_metadata();
let balance1 = get_balance(addr1);
let balance2 = get_balance(addr2);
```

### 6.3. Testing

```
#[test]
fun test_view_functions() {
    // Initialize token
    init_module(...)

    // Test balance view
    assert!(get_balance(@user) == 0, 1);

    // Test frozen status
    assert!(!is_frozen(@user), 2);
}
```

## 7. Common Pitfalls and Notes

1. **Initialization**
    - Should only be called once when deploying the module
    - Refs cannot be recreated after initialization
    - URIs can be empty but should be provided in production
2. **View Functions**
    - Always handle cases where the store doesn't exist
    - Consider caching for improved performance
    - Ensure appropriate error handling
3. **Testing**
    - Test all edge cases
    - Verify initialization success
    - Check view function accuracy

# Full Code

```rust
module movement::fungible_token_tutorial {
    use std::string;
    use std::option;
    use aptos_framework::object;
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef};
    use aptos_framework::primary_fungible_store;

    // =================== Constants ===================

    // Token configuration
    const MOVEMENT_NAME: vector<u8> = b"Movement";
    const MOVEMENT_SYMBOL: vector<u8> = b"MOVE";
    const MOVEMENT_DECIMALS: u8 = 6;

    // =================== Resources & Structs ===================

    // Holds the refs for managing Movement
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct MovementManagement has key {
        mint_ref: MintRef,
        burn_ref: BurnRef,
        transfer_ref: TransferRef,
    }

    // =================== Initialization ===================

    // Initialize the Movement token
    fun init_module(module_signer: &signer) {
        // Create metadata object with deterministic address
        let constructor_ref = &object::create_named_object(
            module_signer,
            MOVEMENT_SYMBOL,
        );

        // Create the fungible asset with support for primary stores
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            constructor_ref,
            option::none(), // No maximum supply
            string::utf8(MOVEMENT_NAME),
            string::utf8(MOVEMENT_SYMBOL),
            MOVEMENT_DECIMALS,
            string::utf8(b""), // Empty icon URI
            string::utf8(b""), // Empty project URI
        );

        // Generate management references
        let mint_ref = fungible_asset::generate_mint_ref(constructor_ref);
        let burn_ref = fungible_asset::generate_burn_ref(constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(constructor_ref);

        // Store the management refs in metadata object
        let metadata_signer = &object::generate_signer(constructor_ref);
        move_to(
            metadata_signer,
            MovementManagement {
                mint_ref,
                burn_ref,
                transfer_ref,
            }
        );
    }

    // =================== View Functions ===================

    // Get the metadata object of Movement
    #[view]
    public fun get_metadata(): object::Object<fungible_asset::Metadata> {
        object::address_to_object(
            object::create_object_address(&@movement, MOVEMENT_SYMBOL)
        )
    }

    // Get the balance of an account
    #[view]
    public fun get_balance(account: address): u64 {
        if (primary_fungible_store::primary_store_exists(account, get_metadata())) {
            primary_fungible_store::balance(account, get_metadata())
        } else {
            0
        }
    }

    // Check if account store is frozen
    #[view]
    public fun is_frozen(account: address): bool {
        if (primary_fungible_store::primary_store_exists(account, get_metadata())) {
            primary_fungible_store::is_frozen(account, get_metadata())
        } else {
            false
        }
    }

}
```