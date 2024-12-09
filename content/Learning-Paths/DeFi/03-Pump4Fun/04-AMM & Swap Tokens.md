## AMM & Swap Tokens

### Summary

- AMM (Automated Market Maker) and Constant Product Formula are used to create swap pairs
- Swap mechanism allows users to exchange MOVE for tokens and vice versa
- Key functions include swap_move_to_token, swap_token_to_move, and get_output_amount
- View functions provide previews of swap outcomes and pool information
- A 0.3% fee is applied to all swap transactions
- Pool reserves are dynamically updated after each swap to maintain balance
- The contract ensures efficient and transparent execution of swap transactions

## Overview

In this section, we have thoroughly examined the Swap mechanism. We use AMM (Automated Market Maker) or Constant Product Formula to create a swap pair, with prices dependent on the quantity of tokens in the pool.

```rust
// Swap APT for tokens
public entry fun swap_move_to_token(
    sender: &signer,
    pool: Object<Metadata>,
    move_amount: u64
) acquires LiquidityPool {
    assert!(move_amount > 0, ERR_ZERO_AMOUNT);

    let pool_addr = object::object_address(&pool);
    let lp = borrow_global_mut<LiquidityPool>(pool_addr);

    // Calculate output tokens
    let token_out = get_output_amount(
        move_amount,
        lp.move_reserve,
        lp.token_reserve
    );

    assert!(token_out > 0, INSUFFICIENT_LIQUIDITY);

    // Transfer APT to pool
    let apt_coins = coin::withdraw<AptosCoin>(sender, move_amount);
    coin::deposit(pool_addr, apt_coins);

    let pool_signer = account::create_signer_with_capability(&lp.signer_cap);

    // Transfer tokens to user
    primary_fungible_store::transfer(
        &pool_signer,
        lp.token_address,
        signer::address_of(sender),
        token_out
    );

    // Update reserves
    lp.move_reserve = lp.move_reserve + move_amount;
    lp.token_reserve = lp.token_reserve - token_out;
}

// Swap tokens for APT
public entry fun swap_token_to_move(
    sender: &signer,
    pool: Object<Metadata>,
    token_amount: u64
) acquires LiquidityPool {
    assert!(token_amount > 0, ERR_ZERO_AMOUNT);

    let pool_addr = object::object_address(&pool);
    let lp = borrow_global_mut<LiquidityPool>(pool_addr);

    // Calculate APT output
    let apt_out = get_output_amount(
        token_amount,
        lp.token_reserve,
        lp.move_reserve
    );

    assert!(apt_out > 0, INSUFFICIENT_LIQUIDITY);

    // Transfer tokens to pool
    primary_fungible_store::transfer(
        sender,
        lp.token_address,
        pool_addr,
        token_amount
    );

    let pool_signer = account::create_signer_with_capability(&lp.signer_cap);

    // Transfer APT to user
    coin::transfer<AptosCoin>(&pool_signer, signer::address_of(sender), apt_out);

    // Update reserves
    lp.token_reserve = lp.token_reserve + token_amount;
    lp.move_reserve = lp.move_reserve - apt_out;
}

// Calculate output amount based on AMM formula
fun get_output_amount(
    input_amount: u64,
    input_reserve: u64,
    output_reserve: u64
): u64 {
    let input_amount_with_fee = (input_amount as u128) * 997; // 0.3% fee
    let numerator = input_amount_with_fee * (output_reserve as u128);
    let denominator = (input_reserve as u128) * 1000 + input_amount_with_fee;
    ((numerator / denominator) as u64)
}

// View Functions

/// Returns the amount of tokens you would receive for the given APT amount
#[view]
public fun get_token_output_amount(
    move_amount: u64,
    pool: Object<Metadata>
): u64 acquires LiquidityPool {
    let pool_addr = object::object_address(&pool);
    let lp = borrow_global<LiquidityPool>(pool_addr);
    get_output_amount(move_amount, lp.move_reserve, lp.token_reserve)
}

/// Returns the amount of APT you would receive for the given token amount
#[view]
public fun get_apt_output_amount(
    token_amount: u64,
    pool: Object<Metadata>
): u64 acquires LiquidityPool {
    let pool_addr = object::object_address(&pool);
    let lp = borrow_global<LiquidityPool>(pool_addr);
    get_output_amount(token_amount, lp.token_reserve, lp.move_reserve)
}

/// Returns the current pool reserves (token_reserve, move_reserve)
#[view]
public fun get_pool_info(pool: Object<Metadata>): (u64, u64) acquires LiquidityPool {
    let pool_addr = object::object_address(&pool);
    let lp = borrow_global<LiquidityPool>(pool_addr);
    (lp.token_reserve, lp.move_reserve)
}
```

Based on the code above, we can describe the main functions related to token swapping as follows:

- **swap_move_to_token**: Allows users to exchange MOVE for tokens. This function takes the sender's address, pool object, and the amount of MOVE to swap.
- **swap_token_to_move**: The reverse of the above function, allowing users to exchange tokens for MOVE. It takes similar parameters, but instead of MOVE amount, it takes the amount of tokens to swap.
- **get_output_amount**: An internal function that calculates the output token amount based on the AMM (Automated Market Maker) formula, accounting for a 0.3% fee.
- **get_token_output_amount**: A view function that allows users to preview the amount of tokens they would receive when swapping a specific amount of MOVE.
- **get_apt_output_amount**: Similar to the above, this view function allows users to preview the amount of MOVE they would receive when swapping a specific amount of tokens.
- **get_pool_info**: A view function that returns information about the pool's reserves, including the current amounts of tokens and MOVE in the pool.

These functions are not directly related to creating new tokens. Instead, they focus on managing and executing swap transactions between MOVE and an existing token in a liquidity pool. To create a new token, you would need different functions related to token creation and management.

### 1. swap_move_to_token

Purpose: Allows users to exchange APT MOVE for tokens in the pool.

- Input: Sender's address, pool object, and the amount of MOVE to swap.
- Checks if the MOVE amount is greater than 0 and calculates the output token amount.
- Transfers MOVE from the user to the pool.
- Transfers tokens from the pool to the user.
- Updates the pool's reserves.

### 2. swap_token_to_move

Purpose: Allows users to exchange tokens for MOVE from the pool.

- Input: Sender's address, pool object, and the amount of tokens to swap.
- Checks if the token amount is greater than 0 and calculates the output MOVE amount.
- Transfers tokens from the user to the pool.
- Transfers MOVE from the pool to the user.
- Updates the pool's reserves.

### 3. get_output_amount

Purpose: Calculates the output token amount based on the AMM formula.

- Uses the Constant Product Formula with a 0.3% fee.
- Ensures accurate calculation to maintain balance in the pool.

### 4. get_token_output_amount (View Function)

Purpose: Allows users to preview the amount of tokens they would receive when swapping MOVE.

- Helps users estimate the swap result before executing the transaction.

### 5. get_apt_output_amount (View Function)

Purpose: Allows users to preview the amount of MOVE they would receive when swapping tokens.

- Similar to the above, helps users estimate the reverse swap result.

### 6. get_pool_info (View Function)

Purpose: Provides information about the current state of the pool.

- Returns the current amounts of tokens and MOVE in the pool.
- Helps users and other applications monitor and analyze the pool's state.

All these functions work together to create a complete DEX contract, allowing users to execute swap transactions and query pool information efficiently and transparently.

## FullCode

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
    const INITIAL_TOKEN_PER_MOVE: u64 = 5_000_000_000_000;
    const MOVE_DECIMALS: u8 = 8;
    const MOVE_MULTIPLIER: u64 = 100_000_000; // 10^8 for MOVE decimals

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
        move_amount: u64  // Amount of MOVE in octas (10^8)
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
        let user_token_amount = (move_amount as u128) * (INITIAL_TOKEN_PER_MOVE as u128) / (MOVE_MULTIPLIER as u128);
        assert!((user_token_amount * 2) <= (MAX_SUPPLY as u128), ERR_MAX_SUPPLY_EXCEEDED);

        // Mint tokens to user
        mint_tokens(sender, fa_obj, (user_token_amount as u64));

        // Create and initialize Liquidity Pool with same amount
        initialize_liquidity_pool(
            sender,
            fa_obj,
            move_amount,  // MOVE from user
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

        // Register MOVE coin store for pool
        if (!coin::is_account_registered<AptosCoin>(signer::address_of(&pool_signer))) {
            coin::register<AptosCoin>(&pool_signer);
        };

        // Mint tokens to pool
        mint_tokens(&pool_signer, token, token_amount);

        // Transfer MOVE to pool
        let move_coins = coin::withdraw<AptosCoin>(sender, move_amount);
        coin::deposit(signer::address_of(&pool_signer), move_coins);

        // Initialize LP
        move_to(&pool_signer, LiquidityPool {
            token_reserve: token_amount,
            move_reserve: move_amount,
            token_address: token,
            owner: signer::address_of(sender),
            signer_cap,
        });
    }

    // Swap MOVE for tokens
    public entry fun swap_move_to_token(
        sender: &signer,
        pool: Object<Metadata>,
        move_amount: u64
    ) acquires LiquidityPool {
        assert!(move_amount > 0, ERR_ZERO_AMOUNT);

        let pool_addr = object::object_address(&pool);
        let lp = borrow_global_mut<LiquidityPool>(pool_addr);

        // Calculate output tokens
        let token_out = get_output_amount(
            move_amount,
            lp.move_reserve,
            lp.token_reserve
        );

        assert!(token_out > 0, INSUFFICIENT_LIQUIDITY);

        // Transfer MOVE to pool
        let move_coins = coin::withdraw<AptosCoin>(sender, move_amount);
        coin::deposit(pool_addr, move_coins);

        let pool_signer = account::create_signer_with_capability(&lp.signer_cap);

        // Transfer tokens to user
        primary_fungible_store::transfer(
            &pool_signer,
            lp.token_address,
            signer::address_of(sender),
            token_out
        );

        // Update reserves
        lp.move_reserve = lp.move_reserve + move_amount;
        lp.token_reserve = lp.token_reserve - token_out;
    }

    // Swap tokens for MOVE
    public entry fun swap_token_to_move(
        sender: &signer,
        pool: Object<Metadata>,
        token_amount: u64
    ) acquires LiquidityPool {
        assert!(token_amount > 0, ERR_ZERO_AMOUNT);

        let pool_addr = object::object_address(&pool);
        let lp = borrow_global_mut<LiquidityPool>(pool_addr);

        // Calculate MOVE output
        let move_out = get_output_amount(
            token_amount,
            lp.token_reserve,
            lp.move_reserve
        );

        assert!(move_out > 0, INSUFFICIENT_LIQUIDITY);

        // Transfer tokens to pool
        primary_fungible_store::transfer(
            sender,
            lp.token_address,
            pool_addr,
            token_amount
        );

        let pool_signer = account::create_signer_with_capability(&lp.signer_cap);

        // Transfer MOVE to user
        coin::transfer<AptosCoin>(&pool_signer, signer::address_of(sender), move_out);

        // Update reserves
        lp.token_reserve = lp.token_reserve + token_amount;
        lp.move_reserve = lp.move_reserve - move_out;
    }

    // Calculate output amount based on AMM formula
    fun get_output_amount(
        input_amount: u64,
        input_reserve: u64,
        output_reserve: u64
    ): u64 {
        let input_amount_with_fee = (input_amount as u128) * 997; // 0.3% fee
        let numerator = input_amount_with_fee * (output_reserve as u128);
        let denominator = (input_reserve as u128) * 1000 + input_amount_with_fee;
        ((numerator / denominator) as u64)
    }

    // View Functions

    /// Returns the amount of tokens you would receive for the given MOVE amount
    #[view]
    public fun get_token_output_amount(
        move_amount: u64,
        pool: Object<Metadata>
    ): u64 acquires LiquidityPool {
        let pool_addr = object::object_address(&pool);
        let lp = borrow_global<LiquidityPool>(pool_addr);
        get_output_amount(move_amount, lp.move_reserve, lp.token_reserve)
    }

    /// Returns the amount of MOVE you would receive for the given token amount
    #[view]
    public fun get_move_output_amount(
        token_amount: u64,
        pool: Object<Metadata>
    ): u64 acquires LiquidityPool {
        let pool_addr = object::object_address(&pool);
        let lp = borrow_global<LiquidityPool>(pool_addr);
        get_output_amount(token_amount, lp.token_reserve, lp.move_reserve)
    }

    /// Returns the current pool reserves (token_reserve, move_reserve)
    #[view]
    public fun get_pool_info(pool: Object<Metadata>): (u64, u64) acquires LiquidityPool {
        let pool_addr = object::object_address(&pool);
        let lp = borrow_global<LiquidityPool>(pool_addr);
        (lp.token_reserve, lp.move_reserve)
    }
}
```
