# Removing Liquidity

### Key points:

- Allows Liquidity Providers (LPs) to withdraw tokens from the pool
- Involves burning LP tokens to receive proportional amounts of underlying tokens
- Requires careful calculations to ensure fair distribution of assets
- Includes processing of accrued fees before token extraction
- Updates pool reserves and k-value after removal
- Implements safety checks to prevent errors and maintain pool integrity
- Uses a public interface for user interaction and internal functions for core logic
- Crucial for maintaining flexibility and attractiveness of liquidity provision in DEXs

## Introduction

Liquidity removal is a fundamental operation in a DEX that allows Liquidity Providers (LPs) to withdraw their tokens from the pool. When an LP decides to exit their position, they need to burn their LP tokens and receive a proportional amount of both token types from the pool. This process is crucial for maintaining the flexibility and attractiveness of providing liquidity in a DEX.

## 1. Public Interface: The Entry Point

Let's break down the public function that initiates the liquidity removal process:

```rust
/// Remove liquidity from a pool
/// Returns (amount_x_received, amount_y_received)
/// Requirements:
/// - Must have sufficient LP tokens to burn
/// - Must receive minimum amounts of tokens
public fun remove_liquidity<X, Y>(
    sender: &signer,
    liquidity: u64,
): (u64, u64) acquires TokenPairMetadata, TokenPairReserve, PairEventHolder {
    let coins = coin::withdraw<LPToken<X, Y>>(sender, liquidity);
    let (coins_x, coins_y, fee_amount) = remove_liquidity_direct<X, Y>(coins);
    let amount_x = coin::value(&coins_x);
    let amount_y = coin::value(&coins_y);
    check_or_register_coin_store<X>(sender);
    check_or_register_coin_store<Y>(sender);
    let sender_addr = signer::address_of(sender);
    coin::deposit<X>(sender_addr, coins_x);
    coin::deposit<Y>(sender_addr, coins_y);
    // event
    let pair_event_holder = borrow_global_mut<PairEventHolder<X, Y>>(DEFAULT_ADMIN);
    event::emit_event<RemoveLiquidityEvent<X, Y>>(
        &mut pair_event_holder.remove_liquidity,
        RemoveLiquidityEvent<X, Y> {
            user: sender_addr,
            amount_x,
            amount_y,
            liquidity,
            fee_amount: (fee_amount as u64)
        }
    );
    (amount_x, amount_y)
}
```

This function is the main entry point for liquidity removal. Let's examine its components:

### Function Parameters:

- **sender: &signer** - This is a reference to the user's account that's initiating the liquidity removal. It's used for several important operations:
    - Verifying that the user owns the LP tokens they're trying to burn
    - Withdrawing the LP tokens from the user's account
    - Depositing the underlying tokens back into the user's account after the removal process
- **liquidity: u64** - This parameter represents the amount of LP tokens the user wants to burn. It's important to note that:
    - The amount must be greater than 0 to perform a valid operation
    - It cannot exceed the user's current LP token balance
    - This value determines how many underlying tokens the user will receive back

### Return Values:

The function returns a tuple `(u64, u64)`, which represents:

- `amount_x`: The amount of token X the user receives
- `amount_y`: The amount of token Y the user receives

These amounts are calculated proportionally based on the ratio of LP tokens burned to the total supply of LP tokens.

### Key Steps in the Implementation:

1. Withdrawing LP Tokens:

```rust
let coins = coin::withdraw<LPToken<X, Y>>(sender, liquidity);
```

This line withdraws the specified amount of LP tokens from the user's account. It uses generics (`LPToken<X, Y>`) to ensure it's withdrawing the correct LP token for the specific token pair. If the user doesn't have enough LP tokens, this operation will fail automatically.

1. Core Liquidity Removal:

```rust
let (coins_x, coins_y, fee_amount) = remove_liquidity_direct<X, Y>(coins);
```

This function call performs the actual liquidity removal. It takes the LP tokens and returns the underlying tokens (X and Y) along with any accrued fees. This step ensures that the entire operation is atomic, meaning it either completes fully or not at all.

1. Safety Checks:

```rust
check_or_register_coin_store<X>(sender);
check_or_register_coin_store<Y>(sender);
```

These lines perform crucial safety checks:

- They ensure that the user's account is set up to receive both token types
- If the user doesn't have a "coin store" for either token, it's automatically created
- This prevents potential issues where the removal succeeds but the tokens can't be deposited
1. Depositing Tokens and Emitting Events:

The function then deposits the received tokens into the user's account and emits an event to record the liquidity removal operation. This ensures transparency and allows for easy tracking of DEX activities.

## 2. Direct Removal Implementation

```rust
/// Remove liquidity to token types.
fun remove_liquidity_direct<X, Y>(
    liquidity: coin::Coin<LPToken<X, Y>>,
): (coin::Coin<X>, coin::Coin<Y>, u64) acquires TokenPairMetadata, TokenPairReserve {
    burn<X, Y>(liquidity)
}
```

### Purpose:

This function serves as an important abstraction layer in our liquidity removal process. Let's break it down for beginners:

- Separates concerns:
    - Public interface (remove_liquidity): This is what users interact with. It handles user-specific operations like withdrawing LP tokens from their account.
    - Direct function (remove_liquidity_direct): This manages the core logic of liquidity removal. It's an intermediate step that helps organize our code.
    - Burn function: This handles the detailed implementation of actually burning LP tokens and calculating token amounts to return.

## 3. Core Burn Implementation

```rust
/// Burns LP tokens to withdraw liquidity
/// Returns withdrawn tokens proportional to LP tokens burned
/// Requirements:
/// - Must receive minimum amounts of both tokens
fun burn<X, Y>(lp_tokens: coin::Coin<LPToken<X, Y>>): (coin::Coin<X>, coin::Coin<Y>, u64) acquires TokenPairMetadata, TokenPairReserve {
    let metadata = borrow_global_mut<TokenPairMetadata<X, Y>>(DEFAULT_ADMIN);
    let (balance_x, balance_y) = (coin::value(&metadata.balance_x), coin::value(&metadata.balance_y));
    let reserves = borrow_global_mut<TokenPairReserve<X, Y>>(DEFAULT_ADMIN);
    let liquidity = coin::value(&lp_tokens);

    let fee_amount = mint_fee<X, Y>(reserves.reserve_x, reserves.reserve_y, metadata);

    // Need to add fee amount which have not been minted.
    let total_lp_supply = total_lp_supply<X, Y>();
    let amount_x = ((balance_x as u128) * (liquidity as u128) / (total_lp_supply as u128) as u64);
    let amount_y = ((balance_y as u128) * (liquidity as u128) / (total_lp_supply as u128) as u64);
    assert!(amount_x > 0 && amount_y > 0, ERROR_INSUFFICIENT_LIQUIDITY_BURNED);

    coin::burn<LPToken<X, Y>>(lp_tokens, &metadata.burn_cap);

    let w_x = extract_x((amount_x as u64), metadata);
    let w_y = extract_y((amount_y as u64), metadata);

    update(coin::value(&metadata.balance_x), coin::value(&metadata.balance_y), reserves);

    metadata.k_last = (reserves.reserve_x as u128) * (reserves.reserve_y as u128);

    (w_x, w_y, fee_amount)
}
```

### Initial Setup:

Let's break down the initial setup of our liquidity removal function. This part is crucial as it sets the stage for all subsequent operations.

```rust
let metadata = borrow_global_mut<TokenPairMetadata<X, Y>>(DEFAULT_ADMIN);
let (balance_x, balance_y) = (
    coin::value(&metadata.balance_x),
    coin::value(&metadata.balance_y)
);
let reserves = borrow_global_mut<TokenPairReserve<X, Y>>(DEFAULT_ADMIN);
let liquidity = coin::value(&lp_tokens);
```

### Metadata Access:

The first line retrieves the metadata for our token pair. This is a critical step because the metadata contains essential information about our liquidity pool.

- `borrow_global_mut`: This function is used to get a mutable reference to the pool metadata. 'Mutable' means we can change this data if needed.
- The metadata is stored at the `DEFAULT_ADMIN` address. This is a common pattern in Move to have a central storage location for important data.
- The metadata contains crucial information like the current balances of both tokens, the total supply of LP tokens, and other pool-specific data.

### Balance Retrieval:

Next, we retrieve the current balances of both tokens in the pool. This is necessary to calculate how much of each token the user should receive when removing liquidity.

- We use `coin::value` to safely read the balance of each token in the pool.
- This function returns the numerical value of the coin, which we can use in our calculations.
- Getting accurate balances is crucial for maintaining the correct proportions when removing liquidity.

### Fee Processing:

Before we calculate the amounts of tokens to return to the user, we need to process any accrued fees. This is an important step in maintaining the economic model of the DEX.

```
let fee_amount = mint_fee<X, Y>(reserves.reserve_x, reserves.reserve_y, metadata);
```

This line calls a function to calculate and mint the fees. Let's break down how this works:

### Fee Calculation Formula:

```
let root_k = math128::sqrt((reserve_x as u128) * (reserve_y as u128));
let root_k_last = math128::sqrt(metadata.k_last);
if root_k > root_k_last {
    let numerator = total_lp_supply<X, Y>() * (root_k - root_k_last) * 8u128;
    let denominator = root_k_last * 17u128 + root_k * 8u128;
    let liquidity = numerator / denominator;
    fee = liquidity as u64;
};
}
```

This might look complicated, but let's break it down step by step:

### Understanding the Fee Calculation:

1. Calculating root_k:
    - We calculate the square root of the product of current reserves (reserve_x * reserve_y)
    - This represents the current "size" of the pool
2. Retrieving root_k_last:
    - This is the square root of the last recorded k value
    - It represents the pool size from the last operation
3. Comparing root_k and root_k_last:
    - If root_k > root_k_last, it means the pool has grown
    - This growth is what we use to calculate fees
4. Fee calculation:
    - We use a complex formula to ensure fair fee distribution
    - The numerator considers total supply and pool growth
    - The denominator includes factors to balance the fee
    - The result is a fair amount of new LP tokens to mint as fees

This fee calculation ensures that the protocol can sustain itself while providing fair returns to liquidity providers.

### Amount Calculations:

```
let total_lp_supply = total_lp_supply<X, Y>();
let amount_x = ((balance_x as u128) * (liquidity as u128) /
               (total_lp_supply as u128) as u64);
let amount_y = ((balance_y as u128) * (liquidity as u128) /
               (total_lp_supply as u128) as u64);
```

### Understanding the Amount Calculations:

Now that we've processed fees, we need to calculate how many tokens the user will receive when removing liquidity. The formula is straightforward but crucial:

```
amount_token = (current_balance * lp_amount_to_burn) / total_lp_supply
```

Let's break this down:

1. Proportion calculation:
    - We calculate based on the user's share of LP tokens
    - This ensures fairness - you get back proportional to what you put in
    - It automatically includes any fees or gains the pool has accumulated
2. Precision handling:
    - We cast to u128 (a larger integer type) for the calculation
    - This prevents potential overflow errors with large numbers
    - It also maintains accuracy in the division operation

Here's a simple example to illustrate:

```
If:
- Pool has 1000 X, 2000 Y
- Total LP supply is 1000
- User burns 100 LP tokens (10%)
Then:
- amount_x = 1000 * 100 / 1000 = 100 X
- amount_y = 2000 * 100 / 1000 = 200 Y
```

In this example, the user would receive 100 X tokens and 200 Y tokens for their 10% share of the pool.

### Validation and Execution:

```
assert!(amount_x > 0 && amount_y > 0, ERROR_INSUFFICIENT_LIQUIDITY_BURNED);
coin::burn<LPToken<X, Y>>(lp_tokens, &metadata.burn_cap);
```

After calculating the amounts, we perform some crucial steps:

1. Safety Checks:
    - We ensure that both amount_x and amount_y are greater than zero
    - This prevents "dust" withdrawals that could potentially harm the pool
    - If either amount is zero, we throw an error
2. LP Token Burning:
    - We use the burn capability to destroy the LP tokens
    - This reduces the total supply of LP tokens
    - It's an irreversible operation, ensuring the integrity of the pool

### Token Extraction:

```
let w_x = extract_x((amount_x as u64), metadata);
let w_y = extract_y((amount_y as u64), metadata);
```

Now we actually extract the tokens to return to the user:

1. Safety check:
    
    ```
    assert!(coin::value&lt;X&gt;(&metadata.balance_x) > amount,
           ERROR_INSUFFICIENT_AMOUNT);
    ```
    
    - This verifies that the pool has enough tokens to fulfill the withdrawal
    - It prevents potential underflow errors
    - It's a double-check to ensure our previous calculations were correct
2. Actual extraction:
    
    ```
    coin::extract(&mut metadata.balance_x, amount)
    ```
    
    - This removes the calculated amount of tokens from the pool
    - It creates a new Coin object with these tokens
    - This Coin object will be returned to the user

### State Updates:

```
update(coin::value(&metadata.balance_x), coin::value(&metadata.balance_y), reserves);

metadata.k_last = (reserves.reserve_x as u128) * (reserves.reserve_y as u128);
```

Finally, we need to update the state of our pool:

1. Reserve updates:
    - We update the current reserves with the new balances
    - This typically includes recording a timestamp for the update
    - It's crucial for maintaining an accurate state of the pool
2. K value update:
    - We calculate the new k value (product of reserves)
    - This is stored for the next operation
    - It's used in future fee calculations to detect pool growth

By following these steps, we ensure that liquidity removal is handled accurately, fairly, and safely in our DEX. Each step plays a crucial role in maintaining the integrity and efficiency of the system.