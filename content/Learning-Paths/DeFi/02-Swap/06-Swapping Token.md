# Swapping Token

### Key Points:

This document provides a comprehensive explanation of token swapping in decentralized exchanges, focusing on the implementation of the swap_exact_x_to_y function. Key points covered include:

- The public interface and parameters of the swap function
- Step-by-step breakdown of the swap implementation
- Detailed explanation of the AMM (Automated Market Maker) formula
- Core swap logic including liquidity checks and token handling
- K value protection and price impact considerations
- Final verification to ensure the constant product formula is maintained

This guide is essential for developers looking to understand or implement token swapping mechanisms in DeFi applications.

## Introduction

Swapping is a fundamental feature of decentralized exchanges (DEXs), allowing users to trade one token for another. In this tutorial, we'll dive deep into the implementation of a common swap type: swap_exact_x_to_y. This function enables users to exchange a specific amount of token X for token Y, with the output amount determined by an Automated Market Maker (AMM) formula.

## 1. Public Interface: swap_exact_x_to_y

```
public fun swap_exact_x_to_y<X, Y>(
    sender: &signer,
    amount_in: u64,
    to: address
): u64 acquires TokenPairReserve, TokenPairMetadata
```

Let's break down this function signature to understand what each part means:

### Function Name and Generics

- **swap_exact_x_to_y**: This name clearly indicates the function's purpose - swapping an exact amount of token X for token Y.
- **<X, Y>**: These are generic type parameters. They allow the function to work with any two token types, making it flexible and reusable.

### Parameter Analysis:

1. **sender: &signer**
    - This is a reference to the signer object, representing the user initiating the swap.
    - The signer is crucial for several reasons:
        - It allows the function to withdraw tokens from the user's account.
        - It's used to verify that the user has the necessary permissions.
        - It enables the function to register coin stores if they don't exist yet.
2. **amount_in: u64**
    - This parameter specifies the exact amount of token X the user wants to swap.
    - It must be greater than 0 to perform a valid swap.
    - This amount is used in calculations to determine how much of token Y the user will receive.
    - The size of amount_in affects the price impact of the swap on the liquidity pool.
3. **to: address**
    - This is the address that will receive the output token Y.
    - Interestingly, this can be different from the sender's address.
    - This flexibility allows for direct transfers to other addresses.
    - It's particularly useful when interacting with more complex smart contracts or routers.

### Return Value

The function returns a u64, which represents the amount of token Y that was output from the swap. This allows the caller to know exactly how many tokens were received.

### Acquire Clause

The **acquires TokenPairReserve, TokenPairMetadata** clause indicates that this function will access global storage to read or modify these resources. This is important for managing the liquidity pool and swap calculations.

### Implementation Details:

Now, let's walk through the implementation step-by-step:

### Step 1: Withdraw Tokens

```
let coins = coin::withdraw<X>(sender, amount_in);
```

This line does several important things:

- It calls the withdraw function from the coin module, specifying token X as the type.
- It takes tokens directly from the sender's account.
- The exact amount_in is withdrawn.
- If the sender doesn't have enough balance, this operation will fail.
- The result is a new Coin object containing the withdrawn tokens.

### Step 2: Execute Swap

```
let (coins_x_out, coins_y_out) = swap_exact_x_to_y_direct<X, Y>(coins);
```

This line is where the actual swap logic happens:

- It calls an internal function swap_exact_x_to_y_direct.
- The coins object (containing token X) is passed to this function.
- The function returns two Coin objects: coins_x_out and coins_y_out.
- coins_x_out will typically be empty (zero value) in this case.
- coins_y_out contains the tokens that resulted from the swap.

### Step 3: Prepare Deposit

```
let amount_out = coin::value(&coins_y_out);
check_or_register_coin_store<Y>(sender);
```

These lines prepare for the final transfer:

- The value of coins_y_out is extracted. This is how many tokens of Y were swapped for.
- The check_or_register_coin_store function ensures that the recipient can receive token Y.
- If the recipient doesn't have a coin store for token Y, one is automatically created.

### Step 4: Complete Transfer

```
coin::destroy_zero(coins_x_out);
coin::deposit(to, coins_y_out);
```

The final steps of the swap:

- coins_x_out is destroyed. This should be empty, as all X tokens were swapped.
- The resulting Y tokens (coins_y_out) are deposited to the specified 'to' address.
- The function implicitly returns amount_out, telling the caller how many Y tokens were received.

## 2. Direct Swap Implementation

Now, let's dive deeper into the core of our swap function: `swap_exact_x_to_y_direct`. This function is where the magic happens - it's responsible for executing the actual token swap.

```
public fun swap_exact_x_to_y_direct<X, Y>(
    coins_in: coin::Coin<X>
): (coin::Coin<X>, coin::Coin<Y>) acquires TokenPairReserve, TokenPairMetadata
```

Let's break down this function signature:

- It's a public function, meaning it can be called from outside the [module.It](http://module.It) uses generic typesand, allowing it to work with any pair of [tokens.It](http://tokens.It) takes a Coin as input (the tokens we're swapping).It returns two Coin objects: Coin(any leftover input) and Coin(the swapped tokens).
- The 'acquires' keyword indicates it will access global storage for TokenPairReserve and TokenPairMetadata.

### Core Logic:

Now, let's walk through the function step-by-step:

### Step 1: Get Input Amount

```
let amount_in = coin::value<X>(&coins_in);
```

This line retrieves the exact amount of tokens X that the user is swapping. It's crucial because:

- It tells us how many tokens we're working with.
- We need this value for our swap calculations later.
- It's a read-only operation, so it doesn't modify the coins_in object.

### Step 2: Deposit to Pool

```
deposit_x<X, Y>(coins_in);
```

This step is where we actually add the input tokens to the liquidity pool:

- The deposit_x function (not shown here) handles the mechanics of adding tokens to the pool.
- After this step, the pool's balance of token X has increased by amount_in.
- This is a critical step because it's where the user's tokens are actually transferred to the pool.

### Step 3: Get Reserves

```
let (rin, rout, _) = token_reserves<X, Y>();
```

Here, we're fetching the current state of the liquidity pool:

- rin represents the reserve of the input token (X in this case).
- rout represents the reserve of the output token (Y in this case).
- The underscore (_) suggests there's a third value returned that we're not using here.
- These reserve values are crucial for calculating the swap output.

### Step 4: Calculate Output

```
let amount_out = swap_utils::get_amount_out(amount_in, rin, rout);
```

This is where we determine how many Y tokens the user will receive:

- We use a utility function get_amount_out to perform the calculation.
- It takes into account the input amount and the current reserves of both tokens.
- The calculation ensures that the pool maintains its balance according to the AMM formula.

### AMM Formula Details:

Let's take a closer look at the get_amount_out function:

```
// In swap_utils
public fun get_amount_out(
    amount_in: u64,
    reserve_in: u64,
    reserve_out: u64,
): u64 {
    assert!(amount_in > 0, ERROR_INSUFFICIENT_INPUT_AMOUNT);
    assert!(reserve_in > 0 && reserve_out > 0, ERROR_INSUFFICIENT_LIQUIDITY);

    let amount_in_with_fee = (amount_in as u128) * 997u128;
    let numerator = amount_in_with_fee * (reserve_out as u128);
    let denominator = (reserve_in as u128) * 1000u128 + amount_in_with_fee;
    ((numerator / denominator) as u64)
}
```

This function is the heart of our AMM. Let's break it down:

- First, we have two assert statements:
    - They ensure that we have a valid input amount and that there's sufficient liquidity in the pool.
    - If these conditions aren't met, the function will abort with an error.
- Next, we calculate the input amount with the fee applied:
    - We multiply the input by 997, which is equivalent to applying a 0.3% fee (3/1000).
    - This fee goes to the liquidity providers as an incentive.
- The core of the calculation is based on the constant product formula:
    - This formula ensures that the product of the two token reserves remains constant before and after the swap.
    - It's designed to provide a fair price and maintain pool stability.
- Finally, we return the calculated output amount:
    - We cast the result back to u64, which may involve some rounding.
    - This is the amount of Y tokens the user will receive.

Let's look at a concrete example to better understand this calculation:

```
Given:
- amount_in = 100
- reserve_in = 1000
- reserve_out = 2000

Calculation:
1. amount_in_with_fee = 100 * 997 = 99,700
2. numerator = 99,700 * 2000 = 199,400,000
3. denominator = 1000 * 1000 + 99,700 = 1,099,700
4. amount_out = 199,400,000 / 1,099,700 ≈ 181
```

In this example, if a user wants to swap 100 of token X, they would receive approximately 181 of token Y.

### Execute Swap:

After calculating the output amount, we execute the actual swap:

```
let (coins_x_out, coins_y_out) = swap<X, Y>(0, amount_out);
```

This line calls an internal swap function:

- We pass 0 for the X output because we're swapping all of X for Y.
- We pass our calculated amount_out for the Y output.
- The function returns two Coin objects, representing the results of the swap.

Finally, we have a safety check:

```
assert!(coin::value<X>(&coins_x_out) == 0, ERROR_INSUFFICIENT_OUTPUT_AMOUNT);
```

This assertion ensures that:

- We've swapped all of the input X tokens.
- There are no leftover X tokens from the swap.
- If this condition isn't met, it indicates an error in our calculations or swap execution.

## 3. Core Swap Implementation

Now, let's dive deep into the core swap implementation. This is where the actual token exchange happens, and it's crucial to understand each step for anyone new to DeFi development.

```
fun swap&lt;X, Y&gt;(
    amount_x_out: u64,
    amount_y_out: u64
): (coin::Coin&lt;X&gt;, coin::Coin&lt;Y&gt;) acquires TokenPairReserve, TokenPairMetadata
```

This function is the heart of our swap mechanism. Let's break it down:

- It's generic over two types, X and Y, representing our token pair.
- It takes two parameters: amount_x_out and amount_y_out, which are the amounts of tokens X and Y to be swapped out.
- It returns two Coin objects, representing the swapped tokens.
- The 'acquires' keyword indicates it will access global storage for TokenPairReserve and TokenPairMetadata.

### Initial Validation

```
assert!(amount_x_out > 0 || amount_y_out > 0, ERROR_INSUFFICIENT_OUTPUT_AMOUNT);
```

This line is our first safety check:

- It ensures that we're actually swapping something. At least one of the output amounts must be greater than zero.
- If both outputs are zero, it would mean we're not swapping anything, which doesn't make sense in a swap operation.
- The assert! macro will cause the transaction to revert if this condition isn't met, protecting against empty or invalid swaps.

```
let reserves = borrow_global_mut<<TokenPairReserve<X, Y>>(DEFAULT_ADMIN);
assert!(
    amount_x_out < reserves.reserve_x &&
    amount_y_out < reserves.reserve_y,
    ERROR_INSUFFICIENT_LIQUIDITY
);
```

This block performs a crucial liquidity check:

- We first borrow the global TokenPairReserve resource, which holds the current reserves of both tokens.
- Then, we check if the requested output amounts are less than the available reserves for each token.
- This prevents a swap from draining the entire liquidity pool, which could destabilize the market.
- If there's not enough liquidity, the transaction will revert with an `ERROR_INSUFFICIENT_LIQUIDITY` error.

### Token Handling

```
let metadata = borrow_global_mut<TokenPairMetadata<X, Y>>(DEFAULT_ADMIN);

let coins_x_out = coin::zero<X>();
let coins_y_out = coin::zero<Y>();
if (amount_x_out > 0) coin::merge(&mut coins_x_out, extract_x(amount_x_out, metadata));
if (amount_y_out > 0) coin::merge(&mut coins_y_out, extract_y(amount_y_out, metadata));
```

This section handles the actual token extraction:

- We start by borrowing the TokenPairMetadata, which contains additional information about the token pair.
- We initialize two empty Coin objects, one for each token type.
- Then, we check if we need to extract any of token X or Y (remember, one of them might be zero in a single-sided swap).
- If we need to extract tokens, we use the extract_x or extract_y functions (not shown here) to take tokens from the pool.
- The extracted tokens are then merged into our initially empty Coin objects.

### K Value Protection

```
let (balance_x, balance_y) = token_balances<X, Y>();

let amount_x_in = if (balance_x > reserves.reserve_x - amount_x_out) {
    balance_x - (reserves.reserve_x - amount_x_out)
} else { 0 };
let amount_y_in = if (balance_y > reserves.reserve_y - amount_y_out) {
    balance_y - (reserves.reserve_y - amount_y_out)
} else { 0 };
```

This part is crucial for maintaining the constant product formula (x * y = k):

- We first get the current balances of both tokens in the pool.
- Then, we calculate the actual amounts of tokens that were input into the swap.
- This calculation accounts for the possibility of a bidirectional swap, where both tokens might be both input and output.
- If the current balance is higher than what it should be after output (reserves minus output), we know some tokens were input.
- This step is essential for accurately updating the pool state after the swap.

### Price Impact Check

```
let prec = (PRECISION as u128);
let balance_x_adjusted = (balance_x as u128) * prec - (amount_x_in as u128) * 25u128;
let balance_y_adjusted = (balance_y as u128) * prec - (amount_y_in as u128) * 25u128;
let reserve_x_adjusted = (reserves.reserve_x as u128) * prec;
let reserve_y_adjusted = (reserves.reserve_y as u128) * prec;
```

This section prepares for the final K value check:

- We use a precision factor (PRECISION) to avoid dealing with fractional numbers.
- We calculate adjusted balances by subtracting a portion of the input amounts. This accounts for the swap fee (0.25% in this case, as 25/10000 = 0.0025).
- We also adjust the reserves using the same precision factor.
- These adjustments allow us to perform accurate comparisons in the next step.

### Final Verification

```
let compare_result = if (balance_x_adjusted > 0 && reserve_x_adjusted > 0 &&
    MAX_U128 / balance_x_adjusted > balance_y_adjusted &&
    MAX_U128 / reserve_x_adjusted > reserve_y_adjusted) {
    balance_x_adjusted * balance_y_adjusted >= reserve_x_adjusted * reserve_y_adjusted
} else {
    let p: u256 = (balance_x_adjusted as u256) * (balance_y_adjusted as u256);
    let k: u256 = (reserve_x_adjusted as u256) * (reserve_y_adjusted as u256);
    p >= k
};
assert!(compare_result, ERROR_K);
```

This final check ensures that the constant product formula is maintained:

- We first check if we can safely multiply the adjusted balances without overflow.
- If it's safe, we directly compare the product of adjusted balances with the product of adjusted reserves.
- If there's a risk of overflow, we use larger u256 integers to perform the comparison.
- The key here is that the new product (p) should be greater than or equal to the old product (k).
- If this condition isn't met, it means the swap would adversely affect the pool's balance, and the transaction is reverted.

Next, we'll explore the implementation of other swap types: swap_x_to_exact_y, swap_exact_y_to_x, and swap_y_to_exact_x.