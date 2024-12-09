# Initialize & Managed Lending Pool

## Pool Module Guide - Lending & Borrowing Platform

## 1. Pool Structure

### 1.1 Pool Struct

```rust
struct Pool<phantom CoinType> has key, store {
    token: coin::Coin<CoinType>,        // Token stored in the pool
    borrowed_amount: u64,                // Total tokens borrowed
    deposited_amount: u64,               // Total tokens deposited
    supply_rate: u64,                    // Interest rate for depositors
    borrow_rate: u64,                    // Lending interest rate
    supply_index: u64,                   // Accumulation index for depositors
    borrow_index: u64,                   // Accumulation index for borrowers
    updated_at: u64                      // Last update timestamp
}
```

## 2. Core Functions

### 2.1 Pool Initialization

```rust
public entry fun inititial<CoinType>(
    sender: &signer,
    supply_rate_init: u64,
    borrow_rate_init: u64
)
```

- Only admin has permission to initialize pool
- Set initial interest rates for depositors and borrowers
- Initialize initial indices to 1

### 2.2 Token Deposit

```rust
public entry fun deposit<CoinType>(sender: &signer, amount: u64)
```

- Withdraw token from user wallet
- Deposit into pool
- Update total deposited tokens

```rust
public entry fun deposit<CoinType>(sender: &signer, amount: u64) acquires Pool {
    let coins = coin::withdraw<CoinType>(sender, amount);
    let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
    coin::deposit<CoinType>(signer::address_of(sender), coins);
    pool.deposited_amount = pool.deposited_amount + amount;
}
```

Let's analyze each line of the deposit function:

**1. Function declaration:**

```rust
public entry fun deposit<CoinType>(sender: &signer, amount: u64) acquires Pool
```

- Public function can be called from outside the module
- Parameters include sender and token amount
- acquires Pool: indicates function will access Pool resource

**2. Withdraw tokens from user wallet:**

```rust
let coins = coin::withdraw<CoinType>(sender, amount);
```

- Use withdraw function from coin module to withdraw tokens from user wallet

**3. Get Pool reference:**

```rust
let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
```

- Get mutable reference to Pool stored at admin address

**4. Deposit tokens into Pool:**

```rust
coin::deposit<CoinType>(signer::address_of(sender), coins);
```

- Use deposit function to send tokens to Pool

**5. Update amount:**

```rust
pool.deposited_amount = pool.deposited_amount + amount;
```

- Update total tokens deposited in Pool

### 2.3 Token Withdrawal

```rust
public entry fun withdraw<CoinType>(sender: &signer, amount: u64)
```

- Withdraw tokens from pool
- Transfer to user wallet
- Update to decrease deposited tokens

```rust
public entry fun withdraw<CoinType>(sender: &signer, amount: u64) acquires Pool {
    let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
    let coins = coin::extract<CoinType>(&mut pool.token, amount);
    coin::deposit<CoinType>(signer::address_of(sender), coins);
    pool.deposited_amount = pool.deposited_amount - amount;
}
```

**1. Function declaration:**

```rust
public entry fun withdraw<CoinType>(sender: &signer, amount: u64) acquires Pool
```

- Public function can be called from outside module
- Takes 2 parameters: sender (withdrawer) and amount (withdrawal amount)
- acquires Pool: indicates function will access Pool resource

**2. Get Pool reference:**

```rust
let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
```

- Get mutable reference to Pool stored at admin address

**3. Withdraw tokens from Pool:**

```rust
let coins = coin::extract<CoinType>(&mut pool.token, amount);
```

- Use extract function to take required amount of tokens from Pool

**4. Transfer tokens to user wallet:**

```rust
coin::deposit<CoinType>(signer::address_of(sender), coins);
```

- Use deposit function to transfer tokens to withdrawer's wallet

**5. Update Pool balance:**

```rust
pool.deposited_amount = pool.deposited_amount - amount;
```

- Decrease total tokens deposited in Pool.deposited_amount - amount;

### 2.4 Token Borrowing

```rust
public entry fun borrow<CoinType>(sender: &signer, amount: u64)
```

- Check and register token for borrower if needed
- Withdraw tokens from pool and transfer to borrower
- Update to increase borrowed token amount

```rust
Let's analyze each step of the borrow function:
```

**1. Function declaration:**

```rust
public entry fun borrow<CoinType>(sender: &signer, amount: u64) acquires Pool
```

- Public function can be called from outside the module
- Takes borrower (sender) and desired borrow amount (amount) as parameters
- acquires Pool: indicates function will access Pool resource

**2. Get Pool reference:**

```rust
let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
```

- Get mutable reference to Pool at admin address

**3. Withdraw tokens from Pool:**

```rust
let coins = coin::extract<CoinType>(&mut pool.token, amount);
```

- Use extract function to take required amount of tokens from Pool

**4. Check and register token for borrower:**

```rust
if (!coin::is_account_registered<CoinType>(signer::address_of(sender))) {
    managed_coin::register<CoinType>(sender);
};
```

- Check if borrower's account is registered for the token
- If not, register the token for them

**5. Transfer tokens to borrower:**

```rust
coin::deposit<CoinType>(signer::address_of(sender), coins);
```

- Transfer withdrawn tokens to borrower's wallet

**6. Update Pool balance:**

```rust
pool.borrowed_amount = pool.borrowed_amount + amount;
```

### 2.5 Token Repayment

```rust
public entry fun repay<CoinType>(account: &signer, amount: u64)
```

- Withdraw tokens from user wallet
- Return to pool
- Update to decrease debt amount

```rust
Let's analyze each line of code in the repay function:
```

**1. Function declaration:**

```rust
public entry fun repay<CoinType>(account: &signer, amount: u64) acquires Pool
```

- Public function can be called from outside module
- Takes 2 parameters: account (repayer) and amount (repayment amount)
- acquires Pool: indicates function will access Pool resource

**2. Get Pool reference:**

```rust
let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
```

- Get mutable reference to Pool stored at admin address

**3. Withdraw tokens from user wallet:**

```rust
let coins = coin::withdraw<CoinType>(account, amount);
```

- Withdraw required tokens from repayer's wallet

**4. Deposit tokens to Pool:**

```rust
coin::merge<CoinType>(&mut pool.token, coins);
```

- Merge withdrawn tokens into Pool

**5. Update Pool balance:**

```rust
pool.deposited_amount = pool.deposited_amount + amount;
```

## FullCode

```rust
module movement::pool {
    use movement::utils;
    use movement::errors;

    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::managed_coin;

    use std::signer;

    struct Pool<phantom CoinType> has key, store {
        token: coin::Coin<CoinType>,
        borrowed_amount: u64,
        deposited_amount: u64,
        supply_rate: u64,
        borrow_rate: u64,
        supply_index: u64,
        borrow_index: u64,
        updated_at: u64
    }

    public entry fun inititial<CoinType>(
        sender: &signer,
        supply_rate_init: u64,
        borrow_rate_init: u64
    ) {
        assert!(utils::is_admin(sender), errors::get_e_not_admin());
        move_to(sender, Pool<CoinType>{
            token: coin::zero<CoinType>(),
            borrowed_amount: 0,
            deposited_amount: 0,
            supply_rate: supply_rate_init,
            borrow_rate: borrow_rate_init,
            supply_index: 1,
            borrow_index: 1,
            updated_at: timestamp::now_microseconds()
        });
    }

    public entry fun deposit<CoinType>(sender: &signer, amount: u64) acquires Pool {
        let coins = coin::withdraw<CoinType>(sender, amount);
        let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
        coin::deposit<CoinType>(signer::address_of(sender), coins);
        pool.deposited_amount = pool.deposited_amount + amount;
    }

    public entry fun withdraw<CoinType>(sender: &signer, amount: u64) acquires Pool {
        let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
        let coins = coin::extract<CoinType>(&mut pool.token, amount);
        coin::deposit<CoinType>(signer::address_of(sender), coins);
        pool.deposited_amount = pool.deposited_amount - amount;
    }

    public entry fun borrow<CoinType>(sender: &signer, amount: u64) acquires Pool {
        let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
        let coins = coin::extract<CoinType>(&mut pool.token, amount);
        if (!coin::is_account_registered<CoinType>(signer::address_of(sender))) {
            managed_coin::register<CoinType>(sender);
        };
        coin::deposit<CoinType>(signer::address_of(sender), coins);
        pool.borrowed_amount = pool.borrowed_amount + amount;
    }

    public entry fun repay<CoinType>(account: &signer, amount: u64) acquires Pool {
        let pool = borrow_global_mut<Pool<CoinType>>(utils::admin_address());
        let coins = coin::withdraw<CoinType>(account, amount);
        coin::merge<CoinType>(&mut pool.token, coins);
        pool.deposited_amount = pool.deposited_amount + amount;
    }
}
```
