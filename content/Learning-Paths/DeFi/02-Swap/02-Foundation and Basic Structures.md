# Foundation and Basic Structures

### Key Points:

- This guide covers building a Decentralized Exchange (DEX) using Move on the Movement blockchain
- Core data structures include LPToken, TokenPairMetadata, TokenPairReserve, and SwapInfo
- Constants and error codes are defined for consistency and error handling
- Module initialization sets up basic DEX infrastructure
- Event structures track important DEX operations
- The tutorial covers fundamental components and will progress to implementing core functionalities

## Introduction

Welcome to our comprehensive guide on building a Decentralized Exchange (DEX) using Move, the programming language for the Movement blockchain. In this tutorial, we'll break down the fundamental components of a DEX, making it accessible for beginners while providing in-depth explanations for more advanced concepts.

## Core Data Structures

Let's start by exploring the essential data structures that form the backbone of our DEX. We'll explain each structure in detail, providing examples and use cases to help you understand their roles in the system.

### 1. LPToken Structure

```
struct LPToken<phantom X, phantom Y> has key {}
```

This structure represents Liquidity Provider (LP) tokens, which are given to users who provide liquidity to the exchange. Let's break it down:

- `struct LPToken`: Defines a new type called LPToken.
- `&lt;phantom X, phantom Y&gt;`: These are generic type parameters representing the two tokens in a trading pair. The `phantom` keyword means these types are used only for type checking, not for data storage.
- `has key`: This ability allows the struct to be stored as a top-level item in global storage.

Example usage:

```
// Creating an LPToken for a BTC-ETH pair
let btc_eth_lp_token: LPToken<BTC, ETH>;
```

### 2. TokenPairMetadata Structure

```
struct TokenPairMetadata<phantom X, phantom Y> has key {
    creator: address,
    fee_amount: coin::Coin<LPToken<X, Y>>,
    k_last: u128,
    balance_x: coin::Coin<X>,
    balance_y: coin::Coin<Y>,
    mint_cap: coin::MintCapability<LPToken<X, Y>>,
    burn_cap: coin::BurnCapability<LPToken<X, Y>>,
    freeze_cap: coin::FreezeCapability<LPToken<X, Y>>
}
```

This structure stores crucial information about each trading pair. Let's examine each field:

- `creator`: The address of the account that created this trading pair.
- `fee_amount`: Accumulated trading fees in the form of LP tokens.
- `k_last`: The last recorded product of reserves, used for fee calculations in constant product AMMs.
- `balance_x` and `balance_y`: Current balances of both tokens in the pair.
- `mint_cap`, `burn_cap`, `freeze_cap`: Capabilities for managing LP tokens.

Example usage:

```
let btc_eth_metadata = TokenPairMetadata<BTC, ETH> {
    creator: @0x1,
    fee_amount: coin::zero(),
    k_last: 1000000, // Initial k value
    balance_x: coin::zero<BTC>(),
    balance_y: coin::zero<ETH>(),
    mint_cap: // ... obtain mint capability
    burn_cap: // ... obtain burn capability
    freeze_cap: // ... obtain freeze capability
};
```

### 3. TokenPairReserve Structure

```
struct TokenPairReserve<phantom X, phantom Y> has key {
    reserve_x: u64,
    reserve_y: u64,
    block_timestamp_last: u64
}
```

This structure keeps track of the current state of liquidity reserves for a trading pair:

- `reserve_x` and `reserve_y`: Current reserves for both tokens in the pair.
- `block_timestamp_last`: Timestamp of the last update to the reserves.

### 4. SwapInfo Structure

```
struct SwapInfo has key {
    signer_cap: account::SignerCapability,
    fee_to: address,
    admin: address,
    pair_created: event::EventHandle<PairCreatedEvent>
}
```

This structure stores global configuration for the DEX:

- `signer_cap`: Capability to sign transactions on behalf of the DEX.
- `fee_to`: Address where trading fees are sent.
- `admin`: Address of the DEX administrator.
- `pair_created`: Event handle for tracking new trading pair creations.

## Constants and Error Codes

Constants and error codes are crucial for maintaining consistency and proper error handling in your DEX. Let's break them down:

```
const ZERO_ACCOUNT: address = @0x0;
const DEFAULT_ADMIN: address = @movement;
const MINIMUM_LIQUIDITY: u128 = 1000;
const MAX_COIN_NAME_LENGTH: u64 = 32;
```

These constants define important values used throughout the DEX:

- `ZERO_ACCOUNT`: Represents an empty or null address.
- `DEFAULT_ADMIN`: The default administrator address for the DEX.
- `MINIMUM_LIQUIDITY`: The smallest amount of liquidity required to create a new pool.
- `MAX_COIN_NAME_LENGTH`: Maximum allowed length for coin names.

Error codes:

```
const ERROR_ONLY_ADMIN: u64 = 0x0001;
const ERROR_ALREADY_INITIALIZED: u64 = 0x001;
// ... (other error codes)
```

These error codes help identify specific issues that may occur during DEX operations:

- `ERROR_ONLY_ADMIN`: Thrown when a non-admin tries to perform an admin-only action.
- `ERROR_ALREADY_INITIALIZED`: Thrown when trying to initialize an already initialized component.

## Module Initialization

The initialization function sets up the basic DEX infrastructure:

```
fun init_module(sender: &signer) {
    let signer_cap = resource_account::retrieve_resource_account_cap(sender, DEFAULT_ADMIN);
    let resource_signer = account::create_signer_with_capability(&signer_cap);
    move_to(&resource_signer, SwapInfo {
        signer_cap,
        fee_to: ZERO_ACCOUNT,
        admin: DEFAULT_ADMIN,
        pair_created: account::new_event_handle<PairCreatedEvent>(&resource_signer),
    });
}
```

Let's break down this initialization process:

1. Retrieve the resource account capability using the sender and DEFAULT_ADMIN address.
2. Create a resource signer using the obtained capability.
3. Initialize the SwapInfo structure with default values.
4. Store the SwapInfo in the global storage using the resource signer.

## Event Structures

Events are crucial for tracking important operations in your DEX. Let's examine the event structures:

```
struct PairCreatedEvent has drop, store {
    user: address,
    token_x: string::String,
    token_y: string::String
}

struct PairEventHolder<phantom X, phantom Y> has key {
    add_liquidity: event::EventHandle<AddLiquidityEvent<X, Y>>,
    remove_liquidity: event::EventHandle<RemoveLiquidityEvent<X, Y>>,
    swap: event::EventHandle<SwapEvent<X, Y>>
}
```

These structures enable event tracking for various DEX operations:

- `PairCreatedEvent`: Emitted when a new trading pair is created.
- `PairEventHolder`: Holds event handles for liquidity operations and swaps.

## Next Steps

Now that we've covered the fundamental structures and initialization of our DEX, in the next part of this tutorial, we'll delve into implementing core functionalities:

- Creating and managing trading pairs
- Implementing liquidity provision and removal
- Developing the token swap mechanism
- Calculating and distributing fees

Stay tuned for Part 2, where we'll build upon these foundations to create a fully functional DEX!