# Utils & Errors Handling

## Detailed Guide on Errors and Utils Modules in Movement Platform

## 1. Module movement::errors

This module plays a crucial role in managing and handling errors in the system. Centralizing error management makes the code easier to maintain and debug.

### 1.1 Error Code Definition and Management

Error codes are defined in hexadecimal format, making them easy to categorize and extend:

```rust
// Errors related to token minting
const E_MINT_BEYOND: u64 = 0x00001;     // Minting amount exceeds allowed limit
const E_INVALID_ADDRESS: u64 = 0x00002;  // Invalid wallet address
const E_NOT_ADMIN: u64 = 0x00003;        // User does not have admin privileges
```

### 1.2 Getter Functions and Usage

The module provides getter functions to safely retrieve error codes:

```rust
// Public getter functions for error codes
public fun get_e_not_admin(): u64
public fun get_e_mint_beyond(): u64
public fun get_e_invalid_address(): u64
```

**Purpose and Benefits:**

- Provides a unified interface to access error codes, avoiding hardcoding
- Makes code easier to maintain and upgrade when error codes need to be changed
- Centralizes error management in one place, making tracking and debugging easier
- Ensures consistency in error handling across the codebase

**Usage Guide:**

```rust
// Example 1: Check admin privileges
if (!is_admin(sender)) {
    abort errors::get_e_not_admin()
};

// Example 2: Check mint limit with custom error message
assert!(
    amount <= MAX_MINT_AMOUNT,
    errors::get_e_mint_beyond()
);
```

## 2. Module movement::utils

The utils module provides utilities and helper functions frequently used in the platform. Centralizing utility functions helps maintain DRY (Don't Repeat Yourself) principles and improves maintainability.

### 2.1 Admin Address Management

Function to retrieve and validate admin address:

```rust
// Returns the platform's admin address
public fun admin_address(): address {
    @movement  // Address is hardcoded to ensure security
}
```

- Returns the admin address (@movement) - this address is used for permission management
- Used to verify permissions and access important system capabilities
- Ensures consistency when accessing admin address across the codebase

### 2.2 Admin Verification

Function to check admin privileges:

```rust
// Check if a signer is an admin
public fun is_admin(sender: &signer): bool {
    signer::address_of(sender) == @movement
}
```

- Checks if the caller is an admin through their address
- Compares the sender's address with the defined admin address
- Used before important operations requiring admin privileges

## 3. Platform Integration Guide

### 3.1 Verification and Access Control

Example of using modules in functions requiring admin privileges:

```rust
public fun mint_tokens(sender: &signer, amount: u64) {
    // Check admin privileges
    assert!(utils::is_admin(sender), errors::get_e_not_admin());

    // Check mint limit
    assert!(amount < MAX_PER_MINT, errors::get_e_mint_beyond());

    // Continue with mint logic if conditions are met
    // ...
}
```

### 3.2 Accessing Capabilities

Example of using admin address to access capabilities:

```rust
// Get capability from admin address to perform important operations
let cap = borrow_global<Cap<CoinType>>(utils::admin_address());

// Use capability to perform operation
do_something_with_cap(cap);
```

### 3.3 Best Practices in Error Handling

```rust
public fun transfer_tokens(
    sender: &signer,
    recipient: address,
    amount: u64
) {
    // Check valid address
    assert!(recipient != @0x0, errors::get_e_invalid_address());

    // Check amount
    assert!(amount > 0, errors::get_e_invalid_amount());

    // Perform transfer if all conditions are ok
    // ...
}
```

## 4. Benefits and Best Practices

1. **Code Centralization and Management**
    - Error codes are centrally managed in one place, easy to maintain
    - Easy to add/modify new error codes without affecting existing code
    - Admin logic is centralized in utils, ensuring consistency
    - Reduces code duplication and increases reusability
2. **Enhanced Security**
    - Consistent admin privilege checking across the codebase
    - Clear error codes that can be easily tracked and debugged
    - Capability pattern ensures only admin can perform important operations
    - Validation is performed systematically
3. **Extensibility and Maintainability**
    - Easy to add new error codes as the platform grows
    - Utils can be extended with new utility functions without affecting existing code
    - Easy to update error handling logic when needed
    - Code is highly modular, easy to test and maintain
