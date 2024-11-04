# Initialize Coin

## Summary

- Introduces the concept of Coin in Aptos as an object with a single 'value' field of type u64.
- Demonstrates how to initialize a Movement Coin using the 'initialize' function from the 'aptos_framework'.
- Explains the creation of a resource with `key` and store` abilities for global storage and interaction.
- Covers the process of minting Movement Coins and storing them in a Bank resource.
- Discusses the use of capabilities (MintCapability, BurnCapability, FreezeCapability) and how to store them.
- Provides code examples for initializing, minting, and depositing Movement Coins.
- Includes a full code implementation of the Movement Coin module.

## Initialize Movement Coin

In Aptos, a Coin is an object with a single field called `value` of type u64, typically representing the token amount of a project. We can easily initialize these `coin`s using the `initialize` function from the `aptos_framework`:

```rust
struct MOVEMENT has key, store {}

coin::initialize&lt;MOVEMENT&gt;(
    signer,
    string::utf8(b"Movement Coin"),           // Name
    string::utf8(b"MOVEMENT"),                // Symbol
    8,                                        // Decimals
    true                                      // Monitor Supply
);
```

Here, we create a resource without `fields`, with the `key` ability to store this Resource on Global Storage, and `store` to allow this Resource to be stored within and interact with other resources.

With this initialization, we can define other functions that must use the Generic Type MOVEMENT to interact with that function. For example, paying fees or using services of a Module (Smart Contract) that uses MOVEMENT tokens to pay for DAPP fees. However, we still need native MOVE tokens to pay network fees. The DAPP can also be customized to cover fees for users, meaning users only need MOVEMENT tokens to execute functions on the DAPP—known as sponsored transactions, which we'll explore later.

```rust
let (burn_cap, freeze_cap, mint_cap) = coin::initialize<MOVEMENT>(
    signer,
    string::utf8(b"Movement Coin"),
    string::utf8(b"MOVEMENT"),
    DECIMALS,
    true
);
```

The `coin::initialize` function returns three data points: `MintCapability, BurnCapability, FreezeCapability`. We can `destroy` a capability if unnecessary, typically the `FreezeCapability`, by calling:

```rust
coin::destroy_freeze_cap(freeze_cap);
```

Since these three Resources can't be dropped, you must store them somewhere. In this example, we'll create a resource to store them:

```rust
/// Store Capability for mint and burn
struct CapStore has key {
    mint_cap: MintCapability&lt;MOVEMENT&gt;,
    burn_cap: BurnCapability&lt;MOVEMENT&gt;,
    freeze_cap: FreezeCapability&lt;MOVEMENT&gt;
}
```

Now we can create the `coin` resource:

```rust
module movement::coin_distributed {
    use aptos_framework::coin::{Self, MintCapability, BurnCapability, FreezeCapability};
    use std::string;

    const DECIMALS: u8 = 8;
    /// 100 million

    struct MOVEMENT has key, store {}

    /// Store Capability for mint and burn
    struct CapStore has key {
        mint_cap: MintCapability&lt;MOVEMENT&gt;,
        burn_cap: BurnCapability&lt;MOVEMENT&gt;,
        freeze_cap: FreezeCapability&lt;MOVEMENT&gt;
    }

    fun init(signer: &signer) {
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize&lt;MOVEMENT&gt;(
            signer,
            string::utf8(b"Movement Coin"),
            string::utf8(b"MOVEMENT"),
            DECIMALS,
            true
        );

        move_to(signer, CapStore { mint_cap, burn_cap, freeze_cap });
    }
}
```

## Mint Movement Coin

While initializing with `initialize` creates resources to manage, store, or register the `coin`, we haven't minted any coins yet. We can use the `mint` function to create the desired token amount:

```rust
let mint_coins = coin::mint<MOVEMENT>(MAX_SUPPLY_AMOUNT * DECIMAL_TOTAL, &mint_cap);
```

Here, we'll use three constants:

```rust
const DECIMALS: u8 = 8;
/// 100 million
const MAX_SUPPLY_AMOUNT: u64 = 100000000;
/// pow(10,8) = 10**8
const DECIMAL_TOTAL: u64 = 100000000;
```

After initialization, we need a place to store these `coin`s, similar to how we stored the three capabilities earlier:

```rust
/// Bank
struct Bank has key, store { value: Coin&lt;MOVEMENT&gt; }

let mint_coins = coin::mint&lt;MOVEMENT&gt;(MAX_SUPPLY_AMOUNT * DECIMAL_TOTAL, &mint_cap);
move_to(signer, Bank { value: coin::extract(&mut mint_coins, MAX_SUPPLY_AMOUNT * DECIMAL_TOTAL) });
move_to(signer, Bank { value: mint_coins });
```

Finally, we've created a quantity of Movement `coin` 

## Deposit

Ngoài việc sử dụng `move_to`  để lưu trữ coin của bạn trong một resource, bạn cũng có thể transfer trực tiếp cho bản mình thông qua function `deposit`

```rust
  coin::deposit(signer::address_of(signer), mint_coins);
```

## Full Code

```rust
module movement::coin_distributed {
    use aptos_framework::coin::{Self, MintCapability, BurnCapability, FreezeCapability, Coin};
    use std::string;
    use std::signer;

    const DECIMALS: u8 = 8;
    /// pow(10,8) = 10**8
    const DECIMAL_TOTAL: u64 = 100000000;
    /// 100 million
    const MAX_SUPPLY_AMOUNT: u64 = 100000000;

    struct MOVEMENT has key, store {}

    /// store Capability for mint and  burn
    struct CapStore has key {
        mint_cap: MintCapability<MOVEMENT>,
        burn_cap: BurnCapability<MOVEMENT>,
        freeze_cap: FreezeCapability<MOVEMENT>
    }

    struct Bank has key, store { value: Coin<MOVEMENT> }
    struct FoundationBank has key, store { value: Coin<MOVEMENT> }

    fun init(signer: &signer) {
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<MOVEMENT>(
            signer,
            string::utf8(b"Movement Coin"),
            string::utf8(b"MOVEMENT"),
            DECIMALS,
            true
        );

        let mint_coins = coin::mint<MOVEMENT>(MAX_SUPPLY_AMOUNT * DECIMAL_TOTAL, &mint_cap);
        move_to(signer, CapStore { mint_cap, burn_cap, freeze_cap });
        // move_to(signer, FoundationBank { value: coin::extract(&mut mint_coins, MAX_SUPPLY_AMOUNT * DECIMAL_TOTAL) });
        // move_to(signer, Bank { value: mint_coins });
        coin::deposit(signer::address_of(signer), mint_coins)
    }
}
```

## Additional Function

| Name | Description | Parameters | Return Value |
| --- | --- | --- | --- |
| initialize | Creates a new Coin type | account: &signer, name: String, symbol: String, decimals: u8, monitor_supply: bool | (BurnCapability<CoinType>, FreezeCapability<CoinType>, MintCapability<CoinType>) |
| mint | Mints new Coin with capability | amount: u64, _cap: &MintCapability<CoinType> | Coin<CoinType> |
| balance | Returns the balance of an account | owner: address | u64 |
| transfer | Transfers coins between accounts | from: &signer, to: address, amount: u64 | None |
| burn | Burns a Coin with capability | coin: Coin<CoinType>, _cap: &BurnCapability<CoinType> | None |
| freeze_coin_store | Freezes a CoinStore | account_addr: address, _freeze_cap: &FreezeCapability<CoinType> | None |
| unfreeze_coin_store | Unfreezes a CoinStore | account_addr: address, _freeze_cap: &FreezeCapability<CoinType> | None |
| upgrade_supply | Upgrades total supply to parallelizable implementation | account: &signer | None |
| register | Registers an account to receive a specific Coin type | account: &signer | None |
| withdraw | Withdraws a specified amount of coins | account: &signer, amount: u64 | Coin<CoinType> |
| deposit | Deposits a coin into an account | account_addr: address, coin: Coin<CoinType> | None |
| merge | Merges two coins of the same type | dst_coin: &mut Coin<CoinType>, source_coin: Coin<CoinType> | None |
| destroy_zero | Destroys a zero-value coin | zero_coin: Coin<CoinType> | None |
| extract | Extracts a specified amount from a coin | coin: &mut Coin<CoinType>, amount: u64 | Coin<CoinType> |
| name | Returns the name of the coin | None | String |
| symbol | Returns the symbol of the coin | None | String |
| decimals | Returns the number of decimals of the coin | None | u8 |
| supply | Returns the total supply of the coin | None | Option<u128> |