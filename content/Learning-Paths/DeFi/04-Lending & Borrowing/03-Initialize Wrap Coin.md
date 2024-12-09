# Initialize Wrap Coin

## What is Wrap Coin?

### Overview
A wrapped coin is a cryptocurrency token issued on a blockchain that is backed one-to-one by another cryptocurrency. The most common examples are WETH (Wrapped ETH) and WBTC (Wrapped Bitcoin).

## How it Works

- **Wrapping process:** Users send their original cryptocurrency to a specialized smart contract (custodian), which then issues an equivalent amount of wrapped tokens.
- **1:1 ratio:** One WETH equals one ETH, one WBTC equals one BTC. This ratio remains constant.
- **Unwrap:** Users can exchange their wrapped tokens back to receive the original coins at any time.

## Role in Lending & Borrowing

Wrapped coins serve an essential function in decentralized lending platforms (DeFi lending platforms):

- **Compatibility:** Wrapped tokens enable coins from one blockchain to be used on another blockchain. For example: WBTC allows Bitcoin usage on Ethereum DeFi.
- **Flexible collateral:** Users can use wrapped tokens as collateral to borrow other tokens.
- **Yield farming:** Wrapped tokens can be used in farming strategies to generate additional profits.

## Risks to Consider

- Risks from smart contracts managing wrapped tokens
- Dependence on custodians holding the original assets
- Gas fees for wrapping/unwrapping tokens

Wrapped coins are a vital tool in the DeFi ecosystem, especially in lending and borrowing, enhancing flexibility and efficiency for decentralized financial transactions.

## Overview

Module `movement::all_tokens` is an important part of the lending platform, responsible for managing and initializing tokens used in the lending system. This module allows:

- Initialization of new tokens (like WBTC, WETH)
- Management of token minting
- Setting up limits and control permissions

## Module Structure

### Structs

### Token Types

```rust
struct WBTC has key, store {}
struct WETH has key, store {}
```

- Represents the types of wrapped tokens (WBTC, WETH)
- Has `key` and `store` abilities for storage and transfer capabilities

### Capability Struct

```rust
struct Cap<phantom CoinType> has key {
    mint_cap: coin::MintCapability<CoinType>,
    freeze_cap: coin::FreezeCapability<CoinType>,
    burn_cap: coin::BurnCapability<CoinType>,
}
```

- Manages capabilities for each token type
- Generic type allows use with different token types
- Includes mint, freeze, and burn token capabilities

## Functions

### Initialize Function

```rust
public entry fun intialize<CoinType>(
    sender: &signer,
    name: string::String,
    symbol: string::String,
    decimals: u8,
    monitor_supply: bool
)
```

**Purpose:**

- Initialize a new token type in the system
- Only admin has permission to execute
- Create and store token capabilities

**Implementation steps:**

1. Verify caller is admin
2. Register token for caller
3. Initialize token with basic parameters
4. Store capabilities in storage

### Mint Function

```rust
public fun mint<CoinType>(
    sender: &signer,
    amount: u64
)
```

**Purpose:**

- Create (mint) a quantity of tokens for an address
- Ensure mint limits and register tokens for recipient

**Implementation steps:**

1. Check mint amount doesn't exceed MAX_PER_MINT
2. Get mint capability from admin address
3. Mint new tokens
4. Check and register token for recipient if needed
5. Transfer minted tokens to recipient's account

## Role in Lending Platform

- **Token Management:** Serves as the foundation for creating and managing tokens used in the platform
- **Security:** Ensures only admin can initialize tokens and manage capabilities
- **Supply Control:** Limits the amount of tokens minted each time to ensure safety
- **Automation:** Automatically registers tokens for users when necessary

## Usage Example

```rust
// Initialize WBTC token
intialize<WBTC>(
    admin_signer,
    string::utf8(b"Wrapped Bitcoin"),
    string::utf8(b"WBTC"),
    8,
    true
);

// Mint WBTC for an address
mint<WBTC>(user_signer, 50_000);
```

## Full Code

```rust
module movement::all_tokens {
    use aptos_framework::coin;
    use aptos_framework::managed_coin;
    use std::signer;

    use std::string;

    use movement::errors;
    use movement::utils;

    // Constants
    const MAX_PER_MINT: u64 = 100_000;

    struct WBTC has key, store {}
    struct WETH has key, store {}

    struct Cap<phantom CoinType> has key {
        mint_cap: coin::MintCapability<CoinType>,
        freeze_cap: coin::FreezeCapability<CoinType>,
        burn_cap: coin::BurnCapability<CoinType>,
    }

    public entry fun intialize<CoinType>(
        sender: &signer,
        name: string::String,
        symbol: string::String,
        decimals: u8,
        monitor_supply: bool
    ) {
        assert!(utils::is_admin(sender), errors::get_e_not_admin());
        managed_coin::register<CoinType>(sender);

        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<CoinType>(
            sender,
            name,
            symbol,
            decimals,
            monitor_supply
        );

        move_to(sender, Cap<CoinType>{
            mint_cap,
            freeze_cap,
            burn_cap
        });
    }

    public fun mint<CoinType>(
        sender: &signer,
        amount: u64
    ) acquires Cap {
        assert!(amount < MAX_PER_MINT, errors::get_e_mint_beyond());

        let cap = borrow_global<Cap<CoinType>>(utils::admin_address());
        let minted_coins = coin::mint<CoinType>(amount, &cap.mint_cap);
        if (!coin::is_account_registered<CoinType>(signer::address_of(sender))) {
            managed_coin::register<CoinType>(sender);
        };
        coin::deposit<CoinType>(signer::address_of(sender), minted_coins);
    }
}
```
