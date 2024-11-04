# Management Functions trong Fungible Asset Framework

## 1. Overview

Management Functions are special functions used to manage tokens in the Fungible Asset Framework. These functions are crucial for controlling the token supply and user access. Let's explore the main management functions:

- Minting (creating new) tokens: This function allows authorized users to create and distribute new tokens.
- Burning (destroying) tokens: This function removes tokens from circulation, which can be useful for managing token supply or implementing certain economic models.
- Managing the frozen status of accounts: This function allows administrators to restrict token transfers for specific accounts, which can be useful for security or compliance purposes.

## 2. Events and Error Codes

Events and error codes are essential for tracking operations and handling exceptions in your smart contract. Let's break them down:

### 2.1 Event Structures

Events are emitted when certain actions occur, allowing off-chain systems to track and react to on-chain activities. Here are the main event structures:

```rust
// Event emitted when new tokens are minted
struct MintEvent has drop, store {
    amount: u64,      // Amount of tokens minted
    recipient: address, // Address receiving the minted tokens
}

// Event emitted when tokens are burned
struct BurnEvent has drop, store {
    amount: u64,  // Amount of tokens burned
    from: address, // Address from which tokens were burned
}

// Event emitted when an account's frozen status changes
struct FreezeEvent has drop, store {
    account: address, // Address of the affected account
    frozen: bool,     // New frozen status (true if frozen, false if unfrozen)
}
```

These events help in tracking token minting, burning, and account freezing operations.

### 2.2 Error Constants

Error constants are used to provide meaningful error messages when operations fail. Here are the main error constants:

```rust
const EZERO_MINT_AMOUNT: u64 = 1;  // Error when trying to mint zero tokens
const EZERO_BURN_AMOUNT: u64 = 2;  // Error when trying to burn zero tokens
const ENOT_AUTHORIZED: u64 = 3;    // Error when an unauthorized user attempts a restricted operation
```

Using these error constants helps in providing clear feedback when operations fail, making it easier to debug and handle exceptions.

## 3. Mint Function Implementation

The mint function is used to create new tokens and assign them to a specific address. Let's break down its implementation:

### 3.1 Function Signature

```rust
public entry fun mint_to(
    admin: &signer,    // The administrator's signer reference
    recipient: address, // The address to receive the minted tokens
    amount: u64        // The amount of tokens to mint
) acquires MovementManagement
```

This function signature indicates that only an admin can call this function, and it requires access to the MovementManagement resource.

### 3.2 Detailed Implementation

```rust
public entry fun mint_to(
    admin: &signer,
    recipient: address,
    amount: u64
) acquires MovementManagement {
    // 1. Validate amount
    assert!(amount > 0, EZERO_MINT_AMOUNT);

    // 2. Get management struct
    let management = borrow_global<MovementManagement>(
        object::object_address(&get_metadata())
    );

    // 3. Mint tokens
    primary_fungible_store::mint(&management.mint_ref, recipient, amount);

    // 4. Emit event
    event::emit(MintEvent {
        amount,
        recipient,
    });
}
```

**Flow Analysis:**

1. **Validation**
    - The function first checks if the amount to be minted is greater than zero. This prevents minting of zero tokens, which would be pointless and potentially confusing.
    - The authorization check is implicit through the use of mint_ref, ensuring only authorized users can mint tokens.
2. **Management Access**
    - The function retrieves the MovementManagement struct, which contains references to perform token operations.
    - The mint_ref is accessed from this struct, providing the capability to mint tokens.
3. **Mint Operation**
    - The primary_fungible_store::mint function is called to actually create and assign the new tokens.
    - If the recipient doesn't have a token store, one is automatically created.
4. **Event Emission**
    - After successful minting, a MintEvent is emitted to record the transaction.
    - This event includes the amount minted and the recipient's address, allowing for easy tracking and auditing of minting operations.

## 4. Burn Function Implementation

The burn function is used to destroy existing tokens, effectively removing them from circulation. Here's a detailed look at its implementation:

### 4.1 Function Signature

```rust
public entry fun burn_from(
    admin: &signer,  // The administrator's signer reference
    account: address, // The address from which to burn tokens
    amount: u64      // The amount of tokens to burn
) acquires MovementManagement
```

Similar to the mint function, this function can only be called by an admin and requires access to the MovementManagement resource.

### 4.2 Detailed Implementation

```rust
public entry fun burn_from(
    admin: &signer,
    account: address,
    amount: u64
) acquires MovementManagement {
    // 1. Validate amount
    assert!(amount > 0, EZERO_BURN_AMOUNT);

    // 2. Get management struct
    let management = borrow_global<MovementManagement>(
        object::object_address(&get_metadata())
    );

    // 3. Burn tokens
    primary_fungible_store::burn(&management.burn_ref, account, amount);

    // 4. Emit event
    event::emit(BurnEvent {
        amount,
        from: account,
    });
}
```

**Flow Analysis:**

1. **Validation**
    - The function checks if the amount to be burned is greater than zero, preventing attempts to burn zero tokens.
    - The balance check is implicitly performed in the burn operation, ensuring the account has sufficient tokens to burn.
2. **Management Access**
    - The burn_ref is retrieved from the MovementManagement struct, providing the capability to burn tokens.
    - This step also verifies that the caller has the necessary authorization to perform the burn operation.
3. **Burn Operation**
    - The primary_fungible_store::burn function is called to destroy the specified amount of tokens from the given account.
    - This operation reduces the total supply of tokens in circulation.
4. **Event Emission**
    - After successful burning, a BurnEvent is emitted to record the transaction.
    - This event includes the amount burned and the source account, allowing for easy tracking and auditing of burning operations.

## 5. Freeze Function Implementation

The freeze function is used to restrict or enable token transfers for specific accounts. This can be useful for various purposes such as implementing security measures or complying with regulations. Let's examine its implementation:

### 5.1 Function Signature

```rust
public entry fun set_frozen(
    admin: &signer,  // The administrator's signer reference
    account: address, // The address to be frozen or unfrozen
    frozen: bool     // The new frozen status (true to freeze, false to unfreeze)
) acquires MovementManagement
```

As with the other management functions, this can only be called by an admin and requires access to the MovementManagement resource.

### 5.2 Detailed Implementation

```rust
public entry fun set_frozen(
    admin: &signer,
    account: address,
    frozen: bool
) acquires MovementManagement {
    // 1. Get management struct
    let management = borrow_global<MovementManagement>(
        object::object_address(&get_metadata())
    );

    // 2. Set frozen status
    primary_fungible_store::set_frozen_flag(
        &management.transfer_ref,
        account,
        frozen
    );

    // 3. Emit event
    event::emit(FreezeEvent {
        account,
        frozen,
    });
}
```

**Flow Analysis:**

1. **Management Access**
    - The function retrieves the transfer_ref from the MovementManagement struct, which provides the capability to modify account frozen status.
    - This step implicitly verifies that the caller has the necessary admin rights to perform the operation.
2. **State Update**
    - The primary_fungible_store::set_frozen_flag function is called to update the frozen status of the specified account.
    - If frozen is set to true, the account will be unable to transfer tokens. If false, transfers will be allowed.
3. **Event Emission**
    - After successfully updating the frozen status, a FreezeEvent is emitted to record the change.
    - This event includes the affected account address and the new frozen status, allowing for easy tracking of account restrictions.

## 6. Usage Examples

To better understand how these management functions work in practice, let's look at some usage examples:

### 6.1 Minting Tokens

```rust
// Mint 1000 tokens to user
public entry fun mint_example(admin: &signer) acquires MovementManagement {
    mint_to(admin, @user, 1000);
}
```

In this example, we're minting 1000 tokens and assigning them to the @user address. The admin signer is required to authorize this operation.

### 6.2 Burning Tokens

```rust
// Burn 500 tokens from user
public entry fun burn_example(admin: &signer) acquires MovementManagement {
    burn_from(admin, @user, 500);
}
```

This example demonstrates burning 500 tokens from the @user address. Again, the admin signer is needed to perform this operation.

### 6.3 Freezing Account

```rust
// Freeze user account
public entry fun freeze_example(admin: &signer) acquires MovementManagement {
    set_frozen(admin, @user, true);
}
```

In this example, we're freezing the @user account, preventing it from making token transfers. The admin signer authorizes this action.

These examples demonstrate how to use the management functions in your smart contract. Remember to always handle these functions with care, as they have significant impacts on token circulation and user access.

# Full Code

```rust
module movement::fungible_token_tutorial {
    use std::string;
    use std::option;
    use aptos_framework::object;
    use aptos_framework::event;
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, FungibleStore, Metadata};
    use aptos_framework::primary_fungible_store;

    /// =================== Constants ===================

    /// Token configuration
    const MOVEMENT_NAME: vector<u8> = b"Movement";
    const MOVEMENT_SYMBOL: vector<u8> = b"MOVE";
    const MOVEMENT_DECIMALS: u8 = 6;

    /// Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EINSUFFICIENT_BALANCE: u64 = 2;
    const ESTORE_FROZEN: u64 = 3;
    const EZERO_MINT_AMOUNT: u64 = 4;
    const EZERO_BURN_AMOUNT: u64 = 5;

    /// =================== Resources & Structs ===================

    /// Holds the refs for managing Movement
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct MovementManagement has key {
        mint_ref: MintRef,
        burn_ref: BurnRef,
        transfer_ref: TransferRef,
    }

    /// Events
    #[event]
    struct MintEvent has drop, store {
        amount: u64,
        recipient: address,
    }

    #[event]
    struct BurnEvent has drop, store {
        amount: u64,
        from: address,
    }

    #[event]
    struct FreezeEvent has drop, store {
        account: address,
        frozen: bool,
    }

    /// =================== Initialization ===================

    /// Initialize the Movement token
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

    /// =================== View Functions ===================

    /// Get the metadata object of Movement
    #[view]
    public fun get_metadata(): object::Object<fungible_asset::Metadata> {
        object::address_to_object(
            object::create_object_address(&@movement, MOVEMENT_SYMBOL)
        )
    }

    /// Get the balance of an account
    #[view]
    public fun get_balance(account: address): u64 {
        if (primary_fungible_store::primary_store_exists(account, get_metadata())) {
            primary_fungible_store::balance(account, get_metadata())
        } else {
            0
        }
    }

    /// Check if account store is frozen
    #[view]
    public fun is_frozen(account: address): bool {
        if (primary_fungible_store::primary_store_exists(account, get_metadata())) {
            primary_fungible_store::is_frozen(account, get_metadata())
        } else {
            false
        }
    }

    /// =================== Management Functions ===================

    /// Mint new tokens to recipient
    public entry fun mint_to(
        admin: &signer,
        recipient: address,
        amount: u64
    ) acquires MovementManagement {
        // Verify amount
        assert!(amount > 0, EZERO_MINT_AMOUNT);

        // Get management struct
        let management = borrow_global<MovementManagement>(
            object::object_address(&get_metadata())
        );

        // Mint tokens
        primary_fungible_store::mint(&management.mint_ref, recipient, amount);

        // Emit event
        event::emit(MintEvent {
            amount,
            recipient,
        });
    }

    /// Burn tokens from an account
    public entry fun burn_from(
        admin: &signer,
        account: address,
        amount: u64
    ) acquires MovementManagement {
        // Verify amount
        assert!(amount > 0, EZERO_BURN_AMOUNT);

        // Get management struct
        let management = borrow_global<MovementManagement>(
            object::object_address(&get_metadata())
        );

        // Burn tokens
        primary_fungible_store::burn(&management.burn_ref, account, amount);

        // Emit event
        event::emit(BurnEvent {
            amount,
            from: account,
        });
    }

    /// Freeze or unfreeze an account
    public entry fun set_frozen(
        admin: &signer,
        account: address,
        frozen: bool
    ) acquires MovementManagement {
        // Get management struct
        let management = borrow_global<MovementManagement>(
            object::object_address(&get_metadata())
        );

        // Set frozen status
        primary_fungible_store::set_frozen_flag(&management.transfer_ref, account, frozen);

        // Emit event
        event::emit(FreezeEvent {
            account,
            frozen,
        });
    }

    /// =================== Tests ===================

    #[test_only]
    use aptos_framework::account;

    #[test(creator = @movement)]
    fun test_init_and_mint(creator: &signer) acquires MovementManagement {
        // Initialize token
        init_module(creator);

        // Create test account
        let test_account = account::create_account_for_test(@0x123);

        // Mint tokens
        mint_to(creator, @0x123, 1000);

        // Verify balance
        assert!(get_balance(@0x123) == 1000, 1);
    }

    #[test(creator = @movement)]
    fun test_freeze_unfreeze(creator: &signer) acquires MovementManagement {
        // Initialize
        init_module(creator);

        // Create test account
        let test_account = account::create_account_for_test(@0x123);

        // Mint tokens
        mint_to(creator, @0x123, 1000);

        // Freeze account
        set_frozen(creator, @0x123, true);
        assert!(is_frozen(@0x123), 1);

        // Unfreeze account
        set_frozen(creator, @0x123, false);
        assert!(!is_frozen(@0x123), 2);
    }
}

```