# AMM and Constant Product Formula: The Foundation of DEX

## 1. Traditional Markets vs AMM

### Traditional Markets

In traditional markets (such as stock exchanges):

- Buyers and sellers place orders
- Orders are matched when prices align
- Participants must wait for a matching counterparty
- An order book system is used

Example of an order book:

```
Buy Orders:     Sell Orders:
$10.00 - 100    $10.20 - 150
$9.90  - 200    $10.30 - 100
$9.80  - 150    $10.40 - 200
```

In this example, buyers are willing to buy at $10.00 or lower, while sellers are asking $10.20 or higher. A trade occurs when these prices meet.

### AMM Approach

In Automated Market Makers (AMM):

- No order book is used
- Buyers and sellers don't need to be matched
- Trades occur against a liquidity pool
- Prices are determined by a mathematical formula
- Instant trades are available at any time

Let's look at a simple AMM example:

```rust
// Simple AMM swap function
fun swap(amount_in: u64, reserve_in: u64, reserve_out: u64): u64 {
    let fee = 3; // 0.3% fee (3 basis points)
    let amount_in_with_fee = amount_in * (1000 - fee) / 1000;
    let numerator = (amount_in_with_fee as u128) * (reserve_out as u128);
    let denominator = (reserve_in as u128) + (amount_in_with_fee as u128);
    ((numerator / denominator) as u64)
}
```

This code demonstrates a basic AMM swap. Users can trade instantly without waiting for a counterparty, and the price is determined by the ratio of tokens in the pool.

## 2. Understanding Liquidity Pools

### 2.1 Basic Concept

Imagine a liquidity pool as two interconnected water tanks:

```
Tank X [1000 X] ←→ Tank Y [1000 Y]
```

- Adding X yields Y
- Adding Y yields X
- The ratio between X and Y determines the price

This code demonstrates how a liquidity pool maintains balance and adjusts prices based on trades.

### 2.2 Simple Example

Initial pool:

```
Pool X: 1000 tokens
Pool Y: 1000 tokens
Price: 1 X = 1 Y
```

After swapping 100 X:

```
Pool X: 1100 tokens
Pool Y: 909.09 tokens (approximately)
Price: 1 X = 0.826 Y
```

Let's calculate this swap step-by-step:

```rust
fun swap_tokens(
    initial_x: u64,
    initial_y: u64,
    swap_amount: u64
): (u64, u64, FixedPoint32) {
    let new_y = (initial_x as u128) * (initial_y as u128) / ((initial_x + swap_amount) as u128);
    let y_out = initial_y - (new_y as u64);
    let new_x = initial_x + swap_amount;
    let new_price = FixedPoint32::create_from_rational(new_y as u64, new_x)

    (y_out, new_y as u64, new_price)
}
```

This code shows how to calculate the exact amounts for a swap and the resulting price change. Understanding these calculations is crucial for grasping how AMMs work.

## 3. Constant Product Formula Deep Dive

### 3.1 The Basic Formula

The core of AMM is the constant product formula:

```
x * y = k
```

Where:

- x and y are the quantities of two tokens in the pool
- k is a constant that remains the same before and after trades

Here's how we can represent this in Move code:

```rust
fun check_constant_product(
    x1: u64,      // initial amount of token X
    y1: u64,      // initial amount of token Y
    x2: u64,      // final amount of token X
    y2: u64       // final amount of token Y
): bool {
    let k1 = (x1 as u128) * (y1 as u128);
    let k2 = (x2 as u128) * (y2 as u128);
    k1 == k2
}
```

This function checks if the product of token amounts remains constant before and after a trade. We use u128 to avoid overflow in multiplication.

### 3.2 Real-world Examples

### Example 1: Small Trade

Let's start with a simple pool:

```
Pool X = 1000 tokens
Pool Y = 1000 tokens
k = 1,000,000
```

Now, let's say a user wants to swap 10 X tokens. We can calculate how many Y tokens they'll receive:

```
(1000 + 10) * (1000 - y) = 1,000,000
1010 * (1000 - y) = 1,000,000
y ≈ 9.9 Y tokens (received)
```

Here's a Move function to calculate this:

```rust
public fun get_amount_out(
    amount_in: u64,
    reserve_in: u64,
    reserve_out: u64
): u64 {
    let amount_in_with_fee = (amount_in as u128) * 9975u128;
    let numerator = amount_in_with_fee * (reserve_out as u128);
    let denominator = (reserve_in as u128) * 10000u128 + amount_in_with_fee;
    ((numerator / denominator) as u64)
}
```

This function calculates how many tokens a user will receive based on the amount they're putting in and the current reserves. We use u128 for intermediate calculations to avoid overflow.

### 3.3 Understanding Price Impact

Price impact occurs because larger trades cause more significant price movements. Here's how we can calculate it:

```rust
public fun quote(amount_x: u64, reserve_x: u64, reserve_y: u64): u64 {
    assert!(amount_x > 0, ERROR_INSUFFICIENT_AMOUNT);
    assert!(reserve_x > 0 && reserve_y > 0, ERROR_INSUFFICIENT_LIQUIDITY);
    (((amount_x as u128) * (reserve_y as u128) / (reserve_x as u128)) as u64)
}
```

This function calculates the percentage change in price caused by a trade. Here's a breakdown:

1. We calculate the initial price (reserve_out / reserve_in).
2. We determine how many tokens the user will receive (amount_out).
3. We calculate the new reserves after the trade.
4. We determine the new price after the trade.
5. Finally, we calculate the percentage difference between the initial and final prices.

Understanding price impact is crucial for traders, as it helps them anticipate how their trades will affect the market and their returns.

## 4. Liquidity Provider Mechanics

### 4.1 Adding Liquidity

When adding liquidity to a pool, it's crucial to maintain the existing ratio of tokens. This ensures the pool's balance and price remain stable. Here's how to calculate the amount of token Y you need to add based on the amount of token X:

```
Amount Y to add = (Amount X to add * Pool Y) / Pool X
```

Let's break this down with a step-by-step example:

```
Initial Pool State:
Pool X: 1000 tokens
Pool Y: 2000 tokens
Current Price: 1 X = 2 Y

Step 1: Decide how much of token X you want to add
Let's say you want to add 100 X tokens.

Step 2: Calculate the required amount of Y tokens
Y needed = (100 * 2000) / 1000 = 200 Y

Step 3: Add liquidity
You'll need to add 100 X tokens and 200 Y tokens to maintain the pool's ratio.
```

This calculation ensures that you're adding liquidity in the correct proportion, preserving the pool's price equilibrium.

### 4.2 LP Token Distribution

Liquidity Provider (LP) tokens represent your share of the pool. They're crucial for tracking ownership and distributing rewards. Let's explore how LP tokens are calculated for both the first provider and subsequent providers.

For the first liquidity provider:

```rust
fun calculate_initial_lp_tokens(
    amount_x: u64,
    amount_y: u64
): u64 {
    let product = (amount_x as u128) * (amount_y as u128);
    let sqrt_product = math::sqrt(product);
    ((sqrt_product - MINIMUM_LIQUIDITY) as u64)
}

// Example usage:
let initial_x = 1000;
let initial_y = 2000;
let initial_lp_tokens = calculate_initial_lp_tokens(initial_x, initial_y);
```

This function calculates the initial LP tokens by taking the square root of the product of the two token amounts. We subtract a small amount (MINIMUM_LIQUIDITY) to prevent the first provider from owning 100% of the pool, which could lead to manipulation.

## 5. Real-world Scenarios

### 5.1 Trading Example

Let's walk through a complete trading scenario to understand how AMMs work in practice:

1. Initial Pool State:

```
Pool X: 10,000 tokens
Pool Y: 20,000 tokens
Initial Price: 1 X = 2 Y

// You can verify this price:
Price of X in terms of Y = Pool Y / Pool X = 20,000 / 10,000 = 2 Y per X
```

1. User wants to swap 1,000 X tokens:

```rust
// Step 1: Calculate Y tokens received before fee
// y = (Pool Y * Amount X) / (Pool X + Amount X)
// y = (20,000 * 1,000) / (10,000 + 1,000) = 1,818.18 Y

// Step 2: Apply the 0.25% fee
// y_after_fee = 1,818.18 * (1 - 0.0025) = 1,813.63 Y

// Let's implement this in code:
public fun get_amount_out(
    amount_in: u64,
    reserve_in: u64,
    reserve_out: u64
): u64 {
    assert!(amount_in > 0, ERROR_INSUFFICIENT_INPUT_AMOUNT);
    assert!(reserve_in > 0 && reserve_out > 0, ERROR_INSUFFICIENT_LIQUIDITY);

    let amount_in_with_fee = (amount_in as u128) * 9975u128;
    let numerator = amount_in_with_fee * (reserve_out as u128);
    let denominator = (reserve_in as u128) * 10000u128 + amount_in_with_fee;
    ((numerator / denominator) as u64)
}
```

1. Final Pool State:

```
Pool X: 11,000 tokens (10,000 + 1,000)
Pool Y: 18,186.37 tokens (20,000 - 1,813.63)
New Price: 1 X = 1.65 Y (18,186.37 / 11,000)

// Verify the constant product:
Before trade: 10,000 * 20,000 = 200,000,000
After trade: 11,000 * 18,186.37 ≈ 200,050,070 (slight increase due to fees)
```

This example demonstrates how a trade affects the pool's balance and price. The price of X in terms of Y decreased because we added X to the pool and removed Y.

### 5.2 Providing Liquidity Example

1. Initial Pool:

```rust
// Pool X: 10,000 tokens
// Pool Y: 20,000 tokens
// LP Total Supply: 14,142 tokens (sqrt(10,000 * 20,000))

// Let's implement this in code:
fun calculate_initial_lp_supply(reserve_x: u64, reserve_y: u64): u64 {
    let product = (reserve_x as u128) * (reserve_y as u128);
    (math::sqrt(product) as u64)
}
```

1. Adding 1,000 X and 2,000 Y:

```rust
// Step 1: Calculate the share of the pool
// share = min((1,000 / 10,000), (2,000 / 20,000)) = 0.1 or 10%

// Step 2: Calculate new LP tokens
// new_lp_tokens = 0.1 * 14,142 = 1,414.2 LP tokens

// Let's implement this in code:
fun calculate_lp_tokens_to_mint(
    amount_x: u64,
    amount_y: u64,
    reserve_x: u64,
    reserve_y: u64,
    total_supply: u64
): u64 {
    let share_x = ((amount_x as u128) * (total_supply as u128)) / (reserve_x as u128);
    let share_y = ((amount_y as u128) * (total_supply as u128)) / (reserve_y as u128);
    min(share_x, share_y) as u64
}
```

This example shows how to calculate the number of LP tokens a liquidity provider receives when adding to an existing pool. The provider receives LP tokens proportional to their share of the pool's liquidity.