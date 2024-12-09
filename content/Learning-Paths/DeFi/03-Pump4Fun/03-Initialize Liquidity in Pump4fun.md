## Initialize Liquidity in a Pump4fun

### Summary

This page explains how to initialize liquidity in a Pump4fun system, focusing on creating a liquidity pool for a custom token pair and Move token. Key points include:

- Definition of the LiquidityPool struct with fields for token and Move reserves, token address, owner, and signer capability
- Step-by-step process to initialize a liquidity pool using the initialize_liquidity_pool function
- Creation of a resource account for the pool
- Registration of Move coin storage for the pool
- Minting of custom tokens and transfer of Move tokens to the pool
- Initialization of the LiquidityPool structure with provided data
- The function's role in setting up infrastructure for decentralized exchanges or DeFi protocols

## Overview

After successfully initializing the token, we will now use the token and Move Token that were used to purchase tokens to initialize the Pool for the above Token Pair.

```rust
 struct LiquidityPool has key {
        token_reserve: u64,
        move_reserve: u64,
        token_address: Object<Metadata>,
        owner: address,
        signer_cap: SignerCapability,
    }
```

The LiquidityPool struct includes the following fields:

- token_reserve: The amount of tokens in the pool
- apt_reserve: The amount of Move in the pool
- token_address: The address of the token metadata
- owner: The address of the pool owner
- signer_cap: The ability to sign transactions for the pool

To initialize a liquidity pool using this structure, you need to create an initialization function with corresponding parameters. For example:

```rust
fun initialize_liquidity_pool(
    sender: &signer,
    token: Object<Metadata>,
    move_amount: u64,
    token_amount: u64
) acquires FAController {
    let (pool_signer, signer_cap) = account::create_resource_account(sender, b"Liquidity_Pool");

    // Register APT coin store for pool
    if (!coin::is_account_registered<AptosCoin>(signer::address_of(&pool_signer))) {
        coin::register<AptosCoin>(&pool_signer);
    };

    // Mint tokens to pool
    mint_tokens(&pool_signer, token, token_amount);

    // Transfer APT to pool
    let apt_coins = coin::withdraw<AptosCoin>(sender, move_amount);
    coin::deposit(signer::address_of(&pool_signer), apt_coins);

    // Initialize LP
    move_to(&pool_signer, LiquidityPool {
        token_reserve: token_amount,
        move_reserve: move_amount,
        token_address: token,
        owner: signer::address_of(sender),
        signer_cap,
    });
}
```

I will describe in more detail the `initialize_liquidity_pool` function and its features:

**General purpose:**

This function is designed to initialize a liquidity pool for a custom token pair and Move token. The main purpose is to create a foundation for exchange and provide liquidity in the system.

**Step-by-step details:**

1. Create resource account

```rust
let (pool_signer, signer_cap) = account::create_resource_account(sender, b"Liquidity_Pool");
```

- Use `account::create_resource_account` to create a new resource account for the pool
- Create a pool_signer and signer_cap to manage the pool
1. Register Move coin storage:

```rust
// Register APT coin store for pool
if (!coin::is_account_registered<AptosCoin>(signer::address_of(&pool_signer))) {
    coin::register<AptosCoin>(&pool_signer);
};
```

- Check if the pool has already registered AptosCoin storage
- If not, register AptosCoin storage for the pool

```rust
// Mint tokens to pool
mint_tokens(&pool_signer, token, token_amount);

// Transfer APT to pool
let apt_coins = coin::withdraw<AptosCoin>(sender, move_amount);
coin::deposit(signer::address_of(&pool_signer), apt_coins);
```

1. Mint custom token:
    - Use the `mint_tokens` function to create and add custom tokens to the pool
    - The token amount is determined by the `token_amount` parameter
2. Transfer Move token:
    - Withdraw Move tokens from the sender's account
    - Transfer this amount of Move tokens to the pool's account

```rust
// Initialize LP
move_to(&pool_signer, LiquidityPool {
    token_reserve: token_amount,
    move_reserve: move_amount,
    token_address: token,
    owner: signer::address_of(sender),
    signer_cap,
});
```

Initialize LiquidityPool:

- Create a new LiquidityPool structure
- Store information about the amount of tokens and Move, token address, owner, and signing capability
- Use `move_to` to save this structure to the pool's storage

This function plays a crucial role in setting up the infrastructure for a decentralized exchange (DEX) or a DeFi protocol, allowing users to create initial liquidity for a token-Move pair.

## Initialize Pool

After completing the function to initialize the Pool, we will call it immediately after successfully initializing the token. I want to set the default initial value so that 1 Move can be exchanged for 50,000 Tokens. Subsequently, the price will be calculated based on the pool.

```rust
const INITIAL_TOKEN_PER_APT: u64 = 5_000_000_000_000;
const APT_DECIMALS: u8 = 8;
const APT_MULTIPLIER: u64 = 100_000_000; // 10^8 for APT decimals

const ERR_MAX_SUPPLY_EXCEEDED: u64 = 5;

// Calculate total tokens to be created
let user_token_amount = (move_amount as u128) * (INITIAL_TOKEN_PER_APT as u128) / (APT_MULTIPLIER as u128);
assert!((user_token_amount * 2) <= (MAX_SUPPLY as u128), ERR_MAX_SUPPLY_EXCEEDED);
```

## Create & Buy Token Complete

```rust
module pump4fun::pump_for_fun {
    use std::string;
    use std::option;
    use std::signer;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::fungible_asset::{Self, Metadata, MintRef, TransferRef, BurnRef};
    use aptos_framework::primary_fungible_store;
    use aptos_framework::coin::{Self};
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::account::{Self, SignerCapability};

    const DECIMAL: u8 = 8;
    const MAX_SUPPLY: u64 = 100_000_000_000_000_000;
    const FEE: u64 = 10_000_000; // 0.1 APT
    const INITIAL_TOKEN_PER_APT: u64 = 5_000_000_000_000;
    const APT_DECIMALS: u8 = 8;
    const APT_MULTIPLIER: u64 = 100_000_000; // 10^8 for APT decimals

    // Error codes
    const INSUFFICIENT_LIQUIDITY: u64 = 1;
    const INVALID_AMOUNT: u64 = 2;
    const ERR_NOT_OWNER: u64 = 3;
    const ERR_ZERO_AMOUNT: u64 = 4;
    const ERR_MAX_SUPPLY_EXCEEDED: u64 = 5;

    struct AppConfig has key {
        fees: u64,
        admin: address,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct FAController has key {
        dev_address: address,
        mint_ref: MintRef,
        burn_ref: BurnRef,
        transfer_ref: TransferRef,
    }

    struct LiquidityPool has key {
        token_reserve: u64,
        move_reserve: u64,
        token_address: Object<Metadata>,
        owner: address,
        signer_cap: SignerCapability,
    }

    fun init_module(sender: &signer) {
        let admin_addr = signer::address_of(sender);
        move_to(sender, AppConfig {
            fees: FEE,
            admin: admin_addr,
        });
    }

    public entry fun create_token_and_buy(
        sender: &signer,
        name: string::String,
        symbol: string::String,
        icon_uri: string::String,
        project_url: string::String,
        move_amount: u64  // Amount of APT in octas (10^8)
    ) acquires AppConfig, FAController {
        assert!(move_amount > 0, ERR_ZERO_AMOUNT);

        let app_config = borrow_global<AppConfig>(@pump4fun);
        let admin_addr = app_config.admin;
        let sender_addr = signer::address_of(sender);

        // Collect token creation fee
        let fee_coins = coin::withdraw<AptosCoin>(sender, app_config.fees);
        coin::deposit<AptosCoin>(admin_addr, fee_coins);

        // Create new token
        let constructor_ref = object::create_named_object(sender, *string::bytes(&name));
        let object_signer = object::generate_signer(&constructor_ref);

        // Initialize token
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            &constructor_ref,
            option::some((MAX_SUPPLY as u128)),
            name,
            symbol,
            DECIMAL,
            icon_uri,
            project_url
        );

        let fa_obj = object::object_from_constructor_ref<Metadata>(&constructor_ref);

        // Setup token controller
        move_to(&object_signer, FAController {
            dev_address: sender_addr,
            mint_ref: fungible_asset::generate_mint_ref(&constructor_ref),
            burn_ref: fungible_asset::generate_burn_ref(&constructor_ref),
            transfer_ref: fungible_asset::generate_transfer_ref(&constructor_ref),
        });

        // Calculate total tokens to be created
        let user_token_amount = (move_amount as u128) * (INITIAL_TOKEN_PER_APT as u128) / (APT_MULTIPLIER as u128);
        assert!((user_token_amount * 2) <= (MAX_SUPPLY as u128), ERR_MAX_SUPPLY_EXCEEDED);

        // Mint tokens to user
        mint_tokens(sender, fa_obj, (user_token_amount as u64));

        // Create and initialize Liquidity Pool with same amount
        initialize_liquidity_pool(
            sender,
            fa_obj,
            move_amount,  // APT from user
            (user_token_amount as u64) // Same amount of tokens for pool
        );
    }

    fun mint_tokens(
        account: &signer,
        token: Object<Metadata>,
        amount: u64,
    ) acquires FAController {
        let token_addr = object::object_address(&token);
        let controller = borrow_global<FAController>(token_addr);
        let fa = fungible_asset::mint(&controller.mint_ref, amount);
        primary_fungible_store::deposit(signer::address_of(account), fa);
    }

    fun initialize_liquidity_pool(
        sender: &signer,
        token: Object<Metadata>,
        move_amount: u64,
        token_amount: u64
    ) acquires FAController {
        let (pool_signer, signer_cap) = account::create_resource_account(sender, b"Liquidity_Pool");

        // Register APT coin store for pool
        if (!coin::is_account_registered<AptosCoin>(signer::address_of(&pool_signer))) {
            coin::register<AptosCoin>(&pool_signer);
        };

        // Mint tokens to pool
        mint_tokens(&pool_signer, token, token_amount);

        // Transfer APT to pool
        let apt_coins = coin::withdraw<AptosCoin>(sender, move_amount);
        coin::deposit(signer::address_of(&pool_signer), apt_coins);

        // Initialize LP
        move_to(&pool_signer, LiquidityPool {
            token_reserve: token_amount,
            move_reserve: move_amount,
            token_address: token,
            owner: signer::address_of(sender),
            signer_cap,
        });
    }
}
```
