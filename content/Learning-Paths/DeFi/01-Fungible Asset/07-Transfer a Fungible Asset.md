# Transfer a Fungible Asset

## 1. Overview of Transfer Functions in Fungible Asset Systems

### 1.1. Purpose and Importance of User Functions

User Functions play a crucial role in fungible asset systems, providing essential capabilities for end users to interact with their tokens. These functions are designed with user-friendliness and security in mind, enabling individuals to:

- Perform token transfers: Move assets between accounts safely and efficiently
- Manage their tokens: Check balances, view transaction history, and handle asset-related tasks
- Interact with the token system: Engage in various token-related activities within the ecosystem

By offering these functionalities, User Functions empower users to have full control over their digital assets while maintaining the integrity and security of the overall system.

### 1.2. Types of Transfer Functions

Transfer functions are a critical component of User Functions, allowing for the movement of tokens between accounts. There are two primary types of transfer functions, each serving different purposes and use cases:

1. **Regular Transfer**
    - Definition: A standard token transfer initiated by the token owner
    - Key characteristics:
        - Sender must be the rightful owner of the tokens
        - Respects the frozen status of accounts (cannot transfer from or to frozen accounts)
        - Requires sufficient balance in the sender's account
    - Use cases:
        - Peer-to-peer transactions
        - Payments for goods or services
        - Moving tokens between personal accounts
2. **Force Transfer**
    - Definition: A mandatory token transfer executed by an administrator
    - Key characteristics:
        - Admin-only privilege, restricted to authorized system administrators
        - Bypasses frozen status, allowing transfers involving frozen accounts
        - Can be executed without the token owner's consent
    - Use cases:
        - Regulatory compliance and legal orders
        - Error correction and dispute resolution
        - System maintenance and upgrades
    - Important considerations:
        - Should be used sparingly and only when absolutely necessary
        - Requires robust governance and oversight to prevent misuse
        - May have implications for user trust and system decentralization

## 2. Events and Error Handling

In Move programming, events and error handling are crucial for creating robust and user-friendly smart contracts. Let's dive into these concepts with some practical examples.

### 2.1. Event Structure

Events in Move are used to emit important information about state changes. Here's an example of a TransferEvent structure:

```
// This event is emitted when a transfer occurs
struct TransferEvent has drop, store {
    amount: u64,   // The amount of tokens transferred
    from: address, // The address sending the tokens
    to: address,   // The address receiving the tokens
}

// Usage example:
event::emit(TransferEvent {
    amount: 100,
    from: @0x1234,
    to: @0x5678,
});
```

In this example, we define a TransferEvent that captures the essential information of a token transfer. The 'drop' and 'store' abilities allow this struct to be discarded and stored in global storage, respectively.

### 2.2. Error Constants

Error constants help in providing clear and consistent error messages. Here's an expanded set of error constants:

```
// Error constants for better error handling
const EINSUFFICIENT_BALANCE: u64 = 1;
const EZERO_AMOUNT: u64 = 2;
const EFROZEN_ACCOUNT: u64 = 3;
const EINVALID_RECIPIENT: u64 = 4;
const EUNAUTHORIZED: u64 = 5;

// Usage example:
assert!(balance >= amount, EINSUFFICIENT_BALANCE);
```

These constants make your code more readable and maintainable. When an error occurs, you can easily identify the issue based on the error code.

## 3. Regular Transfer Implementation

Now, let's implement a regular transfer function with detailed explanations and error handling.

### 3.1. Function Signature

```
public entry fun transfer(
    from: &signer,  // The account initiating the transfer
    to: address,    // The recipient's address
    amount: u64     // The amount to transfer
)
```

This function signature defines a public entry function that can be called directly from outside the module.

### 3.2. Detailed Implementation

```
public entry fun transfer(
    from: &signer,
    to: address,
    amount: u64
) {
    // 1. Amount validation
    assert!(amount > 0, EZERO_AMOUNT);

    // 2. Check if the recipient address is valid
    assert!(to != @0x0, EINVALID_RECIPIENT);

    // 3. Get the sender's address
    let sender = signer::address_of(from);

    // 4. Check if the sender has sufficient balance
    assert!(balance::get(sender) >= amount, EINSUFFICIENT_BALANCE);

    // 5. Check if either account is frozen
    assert!(!is_account_frozen(sender) && !is_account_frozen(to), EFROZEN_ACCOUNT);

    // 6. Perform transfer
    primary_fungible_store::transfer(
        from,
        get_metadata(),
        to,
        amount
    );

    // 7. Emit transfer event
    event::emit(TransferEvent {
        amount,
        from: sender,
        to,
    });
}
```

This implementation includes several important steps:

1. We validate that the amount is not zero.
2. We ensure the recipient address is valid.
3. We get the sender's address from the signer.
4. We check if the sender has sufficient balance.
5. We verify that neither account is frozen.
6. We perform the actual transfer using the primary_fungible_store module.
7. Finally, we emit a TransferEvent to log the transfer.

Each step includes error handling to ensure the transfer meets all requirements before execution.

### 3.3. Flow Analysis

Let's break down the transfer function to understand its flow and key components. This analysis will help newcomers grasp the intricacies of implementing a secure token transfer system.

### 3.3.1. Validation Steps

Before executing the transfer, we perform several crucial checks:

```rust
// Amount validation
assert!(amount > 0, EZERO_AMOUNT);

// Sender's balance check
let sender_balance = balance::get(sender);
assert!(sender_balance >= amount, EINSUFFICIENT_BALANCE);

// Frozen status check
assert!(!is_account_frozen(sender) && !is_account_frozen(to), EFROZEN_ACCOUNT);

// Recipient address validation
assert!(to != @0x0, EINVALID_RECIPIENT);
```

Let's examine each validation step:

1. Amount Validation: We ensure the transfer amount is greater than zero to prevent meaningless transactions.
2. Balance Check: We verify that the sender has sufficient funds for the transfer.
3. Frozen Status: We check if either the sender's or recipient's account is frozen, preventing transfers involving frozen accounts.
4. Recipient Validation: We confirm that the recipient's address is valid and not the zero address.

These checks help maintain the integrity and security of the transfer process.

### 3.3.2. Transfer Process

Once all validations pass, we proceed with the actual transfer:

```rust
// Transfer using primary store
primary_fungible_store::transfer(from, get_metadata(), to, amount);
```

This function call encapsulates several important steps:

1. Store Creation: If the recipient doesn't have a store for this token, one is automatically created.
2. Withdrawal: The specified amount is withdrawn from the sender's account.
3. Deposit: The withdrawn amount is deposited into the recipient's account.
4. Error Handling: Any issues during these steps (e.g., insufficient balance) are automatically handled.

After the transfer, we emit an event to log the transaction:

```rust
// Emit transfer event
event::emit(TransferEvent {
    amount,
    from: sender,
    to,
});
```

This event emission is crucial for maintaining a transparent record of all transfers, which can be used for auditing or providing transaction history to users.

### 3.3.3. Error Handling

Throughout the process, we use assert! statements for error handling. When an assertion fails, it aborts the transaction with a specific error code. For example:

```rust
assert!(amount > 0, EZERO_AMOUNT);
```

If amount is zero or negative, the transaction will abort with the EZERO_AMOUNT error. This approach ensures that invalid operations are caught early and prevented from executing.

## 4. Force Transfer Implementation

Force transfer is a powerful feature that allows authorized administrators to move tokens between accounts without the sender's consent. This functionality is crucial for certain scenarios but should be used with caution.

### 4.1. Function Signature

Let's break down the function signature for force transfer:

```rust
public entry fun force_transfer(
    admin: &signer,
    from: address,
    to: address,
    amount: u64
) acquires MovementManagement
```

Here's what each parameter means:

- admin: &signer - The administrator initiating the force transfer
- from: address - The address from which tokens will be taken
- to: address - The address receiving the tokens
- amount: u64 - The number of tokens to transfer

The 'acquires MovementManagement' clause indicates that this function will access the MovementManagement resource.

### 4.2. Detailed Implementation

Now, let's examine the implementation step-by-step:

```rust
public entry fun force_transfer(
    admin: &signer,
    from: address,
    to: address,
    amount: u64
) acquires MovementManagement {
    // 1. Verify admin rights
    assert!(is_admin(signer::address_of(admin)), EUNAUTHORIZED);

    // 2. Amount validation
    assert!(amount > 0, EZERO_AMOUNT);

    // 3. Get management struct
    let management = borrow_global&lt;MovementManagement&gt;(
        object::object_address(&get_metadata())
    );

    // 4. Check if either account is frozen (optional for force transfer)
    if (!is_force_transfer_allowed_when_frozen()) {
        assert!(!is_account_frozen(from) && !is_account_frozen(to), EFROZEN_ACCOUNT);
    }

    // 5. Perform force transfer
    primary_fungible_store::transfer_with_ref(
        &management.transfer_ref,
        from,
        to,
        amount
    );

    // 6. Emit event
    event::emit(TransferEvent {
        amount,
        from,
        to,
    });

    // 7. Log force transfer for auditing
    log_force_transfer(admin, from, to, amount);
}
```

Let's break down each step:

1. Verify admin rights: We first check if the signer is an authorized admin.
2. Amount validation: Ensure the transfer amount is greater than zero.
3. Get management struct: Retrieve the MovementManagement resource, which contains necessary references for the transfer.
4. Frozen account check: Optionally check if accounts are frozen, based on system configuration.
5. Perform force transfer: Use the transfer_with_ref function to move tokens without the sender's signature.
6. Emit event: Log the transfer event for transparency.
7. Audit logging: Record the force transfer details for future auditing.

This implementation ensures that only authorized admins can perform force transfers, maintains proper event logging, and includes optional checks for frozen accounts. The use of transfer_with_ref allows bypassing normal transfer restrictions.

### Regular Transfer Example

```rust
public entry fun transfer(
    from: &signer,
    to: address,
    amount: u64
) {
    // Verify amount
    assert!(amount > 0, EINSUFFICIENT_BALANCE);

    // Perform transfer
    primary_fungible_store::transfer(from, get_metadata(), to, amount);
}
```

### Force Transfer Example

```rust
/// Force transfer (admin only)
public entry fun force_transfer(
    admin: &signer,
    from: address,
    to: address,
    amount: u64
) acquires MovementManagement {
    // Get management struct
    let management = borrow_global<MovementManagement>(
        object::object_address(&get_metadata())
    );

    // Perform force transfer
    primary_fungible_store::transfer_with_ref(
        &management.transfer_ref,
        from,
        to,
        amount
    );

    // Emit event
    event::emit(TransferEvent {
        amount,
        from,
        to,
    });
}
```

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
    struct TransferEvent has drop, store {
        amount: u64,
        from: address,
        to: address,
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

    /// =================== User Functions ===================

    /// Transfer tokens from sender to recipient
    public entry fun transfer(
        from: &signer,
        to: address,
        amount: u64
    ) {
        // Verify amount
        assert!(amount > 0, EINSUFFICIENT_BALANCE);

        // Perform transfer
        primary_fungible_store::transfer(from, get_metadata(), to, amount);
    }

    /// Force transfer (admin only)
    public entry fun force_transfer(
        admin: &signer,
        from: address,
        to: address,
        amount: u64
    ) acquires MovementManagement {
        // Get management struct
        let management = borrow_global<MovementManagement>(
            object::object_address(&get_metadata())
        );

        // Perform force transfer
        primary_fungible_store::transfer_with_ref(
            &management.transfer_ref,
            from,
            to,
            amount
        );

        // Emit event
        event::emit(TransferEvent {
            amount,
            from,
            to,
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