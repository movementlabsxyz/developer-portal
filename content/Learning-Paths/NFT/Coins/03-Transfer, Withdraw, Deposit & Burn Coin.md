# Transfer, Withdraw, Deposit & Burn Coin

## Summary

- Outlines processes for managing MOVEMENT cryptocurrency, including coin registration, deposit, transfer, and withdrawal.
- Explains the necessity of registering coins before depositing to create a storage account in the wallet.
- Describes the initialization of coin distribution across Community, Dev Team, and Foundation pools.
- Provides code examples for transferring coins, including direct transfer and withdraw-deposit methods.
- Demonstrates how to extract coins from resource pools like Foundation, Dev, and Community.
- Highlights the importance of improving user experience by minimizing manual coin registration.
- Shows how to use aptos_account for seamless coin transfers without requiring recipient registration.

## Deposit Coin

In our previous article, we successfully created and deposited coins into a wallet. However, in practice, this would cause an error due to a missing crucial step: the user's wallet needs to `register` the coin before it can be deposited. The `coin::register` function essentially creates an account in the wallet to store that specific `coin` type.

The reason for this is complex, as it's related to the infrastructure and various factors that enable Movement to achieve high transaction speeds. We'll explore this topic in depth in a future article.

```rust
coin::register<MOVEMENT>(signer);
```

We'll update this function so that the signer's wallet creates an account to hold coins.

In this example, I'll initialize a project to distribute `coin` to users through various pools. Each pool will have distinct conditions. This is why I create the `Bank` resource.

```rust
/// 15%
const DEV_TEAM: u64 = 15000000;
/// 70%
const COMMUNITY: u64 = 70000000;
/// 15%
const FOUNDATION: u64 = 15000000;

/// bank for community
struct CommunityBank has key, store { value: Coin<MOVEMENT> }

/// bank for dev team
struct DevTeamBank has key, store { value: Coin<MOVEMENT> }

/// bank for foundation
struct FoundationBank has key, store { value: Coin<MOVEMENT> }
```

When initializing the module, we'll create the total supply and mint that token amount for the pools.

```rust
fun init_module(signer: &signer) {
    assert_admin_signer(signer);
    let (burn_cap, freeze_cap, mint_cap) = coin::initialize<MOVEMENT>(signer, string::utf8(b"Movement Coin"), string::utf8(b"MOVEMENT"), DECIMALS, true);
    coin::destroy_freeze_cap(freeze_cap);
    coin::register<MOVEMENT>(signer);

    let mint_coins = coin::mint<MOVEMENT>(MAX_SUPPLY_AMOUNT * DECIMAL_TOTAL, &mint_cap);
    move_to(signer, CommunityBank { value: coin::extract(&mut mint_coins, COMMUNITY * DECIMAL_TOTAL) });
    move_to(signer, DevTeamBank { value: coin::extract(&mut mint_coins, DEV_TEAM * DECIMAL_TOTAL) });
    move_to(signer, FoundationBank { value: mint_coins });
    move_to(signer, CapStore { mint_cap, burn_cap });
}
```

## Transfer

We can help users who own coins to easily transfer them through this function:

```rust
public fun take_and_transfer(sender: &signer, receiver: address, amount: u64) {
    coin::transfer<MOVEMENT>(sender, receiver, amount);
}
```

Additionally, we can use another method to transfer through two functions: `withdraw` and `deposit`:

```rust
public fun take_and_give(sender: &signer, receiver: address, amount: u64) {
    let coins = coin::withdraw<MOVEMENT>(sender, amount);
    coin::deposit(receiver, coins);
}
```

## Extract

In our example, we use a Resource to store coins through pools like `Foundation`, `Dev`, and `Community`. We can use a function called `extract` to create and withdraw tokens:

```rust
public entry fun withdraw_community(account: &signer, to: address, amount: u64) acquires CommunityBank {
    let bank = borrow_global_mut<CommunityBank>(@movement);
    coin::deposit<MOVEMENT>(to, coin::extract<MOVEMENT>(&mut bank.value, amount));
}
```

## Register Coin

While the above functions work fine when publishing packages or modules, users need to register the initialized coin to create an account that can store it. In this case, we need to use register for MOVEMENT tokens.

```rust
/// register MOVEMENT to sender
public entry fun register(account: &signer) { coin::register<MOVEMENT>(account); }
```

If you want to transfer coins to someone, you'd have to ask them to call the `register` function to create an account for storing that `coin`. This creates a poor user experience. Therefore, we should only use register in specific cases, such as creating a whitelist for airdrops. In most cases, you'll create the account and send it to the recipient, eliminating the need for them to `register`. We can achieve this using `aptos_account`:

```rust
/// withdraw community bank using coin::deposit
public entry fun withdraw_community(_account: &signer, to: address, amount: u64) acquires CommunityBank{
    let bank = borrow_global_mut<CommunityBank>(@movement);
    coin::deposit<MOVEMENT>(to, coin::extract<MOVEMENT>(&mut bank.value, amount));
}

/// withdraw dev team bank using aptos_account
use aptos_framework::aptos_account;
    
public entry fun withdraw_team(account: &signer, to: address, amount: u64) acquires DevTeamBank {
    assert_admin_signer(account);
    let bank = borrow_global_mut<DevTeamBank>(@movement);
    aptos_account::deposit_coins<MOVEMENT>(to, coin::extract<MOVEMENT>(&mut bank.value, amount));
}
```

After the transfer, users can easily check their account balance through the CLI:

```bash
aptos account list
```

Here's an example of the result:

```json
{
  "0x1::coin::CoinStore<0x5a8152b1e723f6089e00dfe599dd42e86c008ba76e5336887822499870d30a27::movement_token::MOVEMENT>": {
    "coin": {
      "value": "100000000" // 1 MOVEMENT 
    },
    "deposit_events": {
      "counter": "1",
      "guid": {
        "id": {
          "addr": "0xf3f78e054d564cc0b89f0405cffca6f4d84a248e60d4ac55eae82cee725386e0",
          "creation_num": "4"
        }
      }
    },
    "frozen": false,
    "withdraw_events": {
      "counter": "0",
      "guid": {
        "id": {
          "addr": "0xf3f78e054d564cc0b89f0405cffca6f4d84a248e60d4ac55eae82cee725386e0",
          "creation_num": "5"
        }
      }
    }
  }
}
```

## Full Code

```json
module movement::movement_token {
    use std::string;
    use std::signer;
    use aptos_framework::coin::{Self, BurnCapability, MintCapability, Coin};
    use aptos_framework::aptos_account;

    /// coin DECIMALS
    const DECIMALS: u8 = 8;
    /// pow(10,8) = 10**8
    const DECIMAL_TOTAL: u64 = 100000000;
    /// 100 million
    const MAX_SUPPLY_AMOUNT: u64 = 100000000;
    /// 15%
    const DEV_TEAM: u64 = 15000000;
    /// 70%
    const COMMUNITY: u64 = 70000000;
    /// 15%
    const FOUNDATION: u64 = 15000000;

    /// Error codes
    const ENotAdmin: u64 = 1;

    /// MOVEMENT Coin
    struct MOVEMENT has key, store, drop{}

    /// store Capability for mint and  burn
    struct CapStore has key {
        mint_cap: MintCapability<MOVEMENT>,
        burn_cap: BurnCapability<MOVEMENT>,
    }

    /// bank for community
    struct CommunityBank has key, store { value: Coin<MOVEMENT> }

    /// bank for dev team
    struct DevTeamBank has key, store { value: Coin<MOVEMENT> }

    /// bank for foundation
    struct FoundationBank has key, store { value: Coin<MOVEMENT> }

    /// It must be initialized first
    fun init_module(signer: &signer) {
        assert_admin_signer(signer);
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<MOVEMENT>(signer, string::utf8(b"Movement Coin"), string::utf8(b"MOVEMENT"), DECIMALS, true);
        coin::destroy_freeze_cap(freeze_cap);
        coin::register<MOVEMENT>(signer);

        let mint_coins = coin::mint<MOVEMENT>(MAX_SUPPLY_AMOUNT * DECIMAL_TOTAL, &mint_cap);
        move_to(signer, CommunityBank { value: coin::extract(&mut mint_coins, COMMUNITY * DECIMAL_TOTAL) });
        move_to(signer, DevTeamBank { value: coin::extract(&mut mint_coins, DEV_TEAM * DECIMAL_TOTAL) });
        move_to(signer, FoundationBank { value: mint_coins });
        move_to(signer, CapStore { mint_cap, burn_cap });
    }

    /// Burn MOVEMENT
    public fun burn(token: coin::Coin<MOVEMENT>) acquires CapStore {
        coin::burn<MOVEMENT>(token, &borrow_global<CapStore>(@movement).burn_cap)
    }

    /// withdraw community bank
    public entry fun withdraw_community(_account: &signer, to: address, amount: u64) acquires CommunityBank{
        let bank = borrow_global_mut<CommunityBank>(@movement);
        coin::deposit<MOVEMENT>(to, coin::extract<MOVEMENT>(&mut bank.value, amount));
    }

    /// withdraw dev team bank using aptos_account
    public entry fun withdraw_team(account: &signer, to: address, amount: u64) acquires DevTeamBank {
        assert_admin_signer(account);
        let bank = borrow_global_mut<DevTeamBank>(@movement);
        aptos_account::deposit_coins<MOVEMENT>(to, coin::extract<MOVEMENT>(&mut bank.value, amount));
    }

    /// withdraw foundation bank
    public entry fun withdraw_foundation(account: &signer, to: address, amount: u64) acquires FoundationBank {
        assert_admin_signer(account);
        let bank = borrow_global_mut<FoundationBank>(@movement);
        coin::deposit<MOVEMENT>(to, coin::extract<MOVEMENT>(&mut bank.value, amount));
    }

    /// deposit to bank
    public entry fun deposit_community(account: &signer, amount: u64) acquires CommunityBank {
        coin::merge<MOVEMENT>(&mut borrow_global_mut<CommunityBank>(@movement).value, coin::withdraw<MOVEMENT>(account, amount));
    }

    public entry fun deposit_team(account: &signer, amount: u64) acquires DevTeamBank {
        coin::merge<MOVEMENT>(&mut borrow_global_mut<DevTeamBank>(@movement).value, coin::withdraw<MOVEMENT>(account, amount));
    }

    public entry fun deposit_foundation(account: &signer, amount: u64) acquires FoundationBank {
        coin::merge<MOVEMENT>(&mut borrow_global_mut<FoundationBank>(@movement).value, coin::withdraw<MOVEMENT>(account, amount));
    }

    /// register MOVEMENT to sender
    public entry fun register(account: &signer) { coin::register<MOVEMENT>(account); }

    /// helper must admin
    fun assert_admin_signer(sign: &signer) {
        assert!(signer::address_of(sign) == @movement, ENotAdmin);
    }
}
```