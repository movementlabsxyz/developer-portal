# Create a Fungible Assets

### Overview

In this article, we will use the knowledge we've learned about Coins and Fungible Assets to create a function that allows people to easily create an FA, and the admin (platform owner) will receive an amount of $MOVE as fees. In this example, we will use 0.1 MOVE as the fee for creating a token on MOVE.

## Admin Configuration

We will need an admin to control or receive fees when users create tokens, and to manage functions that only the admin can execute. Here, we will initialize a resource that contains information about the Fee and admin address.

```rust
struct AppConfig has key {
    fees: u64,
    admin: address
}

fun init_module(sender: &signer) {
    let admin_addr = signer::address_of(sender);

    move_to(sender, AppConfig {
        fees: 10_000_000, // 1 APT = 100_000_000 octas
        admin: admin_addr,
    });
}
```

The `init_module` function is a module initialization function, called when the module is deployed. It has the following characteristics:

- Parameter: Takes a parameter `sender` of type `&signer`, representing the module deployer.
- Function: Initializes and stores an `AppConfig` structure in the deployer's storage.
- Specifically:
    - Gets the address of the deployer using `signer::address_of(sender)`.
    - Creates an instance of `AppConfig` with:
        - Fees set to 10,000,000 octas (equivalent to 0.1 APT).
        - Admin address set to the deployer's address.
    - Uses `move_to` to store `AppConfig` in the deployer's storage.

This function sets up the initial configuration for the application, including the fee amount and admin address, which will be used to manage token creation and fee collection as described in the overview.

## Create Token & Buy

### Create Token

Next, we will initialize a Function to help users easily create a token.

```rust
/// Creates a new token and buys an initial amount for the sender.
///
/// @param sender: The signer creating the token and making the initial purchase.
/// @param name: The name of the token.
/// @param symbol: The symbol or ticker of the token.
/// @param icon_uri: The URI for the token's icon.
/// @param project_url: The URL of the project associated with the token.
/// @param amount: The initial amount of tokens to mint and buy.
///
/// This function creates a new fungible asset (token) with the given parameters,
/// mints the specified amount, and transfers it to the sender. It also handles
/// the fee payment to the admin as configured in the AppConfig resource.
///
/// Acquires: AppConfig - to access the fee information and admin address.
public entry fun create_token_and_buy(
    sender: &signer,
    name: string::String,
    symbol: string::String,
    icon_uri: string::String,
    project_url: string::String,
    amount: u64
) acquires AppConfig {
    // Implementation details go here
}
```

The `create_token_and_buy` function is a public function that allows users to create and buy a new token.

- **Purpose:** Create a new token and buy an initial amount for the sender.
- **Parameters:**
    - `sender`: The signer creating the token and executing the initial purchase transaction.
    - `name`: The name of the token.
    - `symbol`: The symbol or code of the token.
    - `icon_uri`: The URI for the token's icon.
    - `project_url`: The URL of the project related to the token.
    - `amount`: The initial amount of tokens to create and buy.
- **Main functions:**
    - Create a new fungible asset with the provided parameters.
    - Mint the specified amount of tokens.
    - Transfer the created tokens to the sender.
    - Handle the fee payment to the admin according to the configuration in the AppConfig resource.
- **Important features:**
    - Uses the keyword `acquires AppConfig` to access information about fees and admin address.
    - Is an `entry` function, allowing it to be called directly from outside the module.

This function provides a simple and direct way for users to create their own tokens on the platform, while ensuring that appropriate fees are collected and transferred to the system admin.

### Initializing a Fungible Asset Store

```rust
let constructor_ref = object::create_named_object(sender, *string::bytes(&name));
let object_signer = object::generate_signer(&constructor_ref);

primary_fungible_store::create_primary_store_enabled_fungible_asset(
    &constructor_ref,
    option::some(1_000_000_000), // Total supply
    name,                        // Token Name
    symbol,                      // Token Symbol
    8,                           // Decimals
    icon_uri,                    // Icon URI (ex: https://icon.jpg)
    project_url                  // Project URL
);
```

This code snippet describes a part of the function to initialize a Fungible Asset on the Move platform. This is an important part of the process of creating a new token. Let's analyze each step:

1. Create a named object:
`let constructor_ref = object::create_named_object(sender, *string::bytes(&name));`
This line creates a new object with a name based on the provided 'name' parameter.
2. Create a signer for the object:
`let object_signer = object::generate_signer(&constructor_ref);`
Creates a 'signer' for the new object, allowing operations to be performed on behalf of this object.
3. Create Fungible Asset:
`primary_fungible_store::create_primary_store_enabled_fungible_asset(...)`
This is the main step to create the token. This function takes the following parameters:
- Constructor reference
- Total supply: 1,000,000,000 (can be adjusted)
- Token name
- Token symbol
- Decimals: 8
- Icon URI
- Project URL

This code creates a new Fungible Asset with the specified attributes, allowing users to create their own tokens with specific parameters. It also sets up the primary store for the token, enabling efficient storage and management of the token.

### Mint & Deposit Tokens

```rust
let fa = fungible_asset::mint(&controller.mint_ref, amount);
primary_fungible_store::deposit(signer::address_of(account), fa);
```

Based on the selected code snippet, I can describe the functionality as follows:

This code snippet performs two important steps in the process of creating and distributing tokens:

1. Create (mint) tokens:
`let fa = fungible_asset::mint(&controller.mint_ref, amount);`
This function creates a new amount of tokens (fungible asset) based on the specified amount. It uses the mint reference (mint_ref) from the controller to perform the token creation.
2. Deposit tokens into the account:
`primary_fungible_store::deposit(signer::address_of(account), fa);`
This function deposits the newly created tokens (fa) into the user's account. The account address is obtained from the account object using `signer::address_of(account)`.

The purpose of this function is to allow users to create a new amount of tokens and immediately deposit them into their account. This helps users to initialize and own tokens easily and quickly.

This function is an important part of the token creation process, allowing users not only to define the token's attributes (as seen in previous sections with parameters like name, symbol, icon_uri, project_url) but also to create and own a specific amount of tokens right from the start.

### Fungible Asset Controller

In the article about Object and Fungible Asset, we learned about FA Abilities such as MintRef, BurnRef, TransferRef. So we will also use them to apply to this Function to initialize a resource object containing these Abilities for the FA we just created.

```rust
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct FAController has key {
    dev_address: address,
    mint_ref: MintRef,
    burn_ref: BurnRef,
    transfer_ref: TransferRef,
}

// Setup token controller
move_to(&object_signer, FAController {
    dev_address: sender_addr,
    mint_ref: fungible_asset::generate_mint_ref(&constructor_ref),
    burn_ref: fungible_asset::generate_burn_ref(&constructor_ref),
    transfer_ref: fungible_asset::generate_transfer_ref(&constructor_ref),
});
```

### Admin Fee

Another issue is that when initializing a token, the platform admin needs to receive a corresponding fee. For this, we can use AptosCoin to use the Native coin of the Platform, which in this case will be $MOVE on the Movement Network.

```rust
let app_config = borrow_global<AppConfig>(@movement);

let coins = coin::withdraw<AptosCoin>(sender, app_config.fees);
coin::deposit<AptosCoin>(app_config.admin, coins);
```

This function performs the following steps:

- Access the application configuration (AppConfig) from the Movement address to get information about fees and admin address
- Withdraw an amount of coins (AptosCoin) from the sender's account based on the configured fee
- Deposit the withdrawn coins into the admin's account

Note that this function uses AptosCoin, but in the context of the Movement Network, this will correspond to $MOVE, which is the native coin of the platform.

## Full Code

```rust
module movement::pump_for_fun {
    use std::string;
    use std::option;
    use std::signer;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::fungible_asset::{Self, Metadata, MintRef, TransferRef, BurnRef};
    use aptos_framework::primary_fungible_store;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    const DECIMAIL :u8 = 8;
    const MAX_SUPPLY: u128 = 1_000_000_000;
    const FEE: u64 = 10_000_000;

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

    fun init_module(sender: &signer) {
        let admin_addr = signer::address_of(sender);

        move_to(sender, AppConfig {
            fees: FEE, // 0.1 APT = 100_000_000 octas
            admin: admin_addr,
        });
    }

    public entry fun create_token_and_buy(
        sender: &signer,
        name: string::String,
        symbol: string::String,
        icon_uri: string::String,
        project_url: string::String,
        amount: u64
    ) acquires AppConfig, FAController {
        let app_config = borrow_global<AppConfig>(@movement);

        let admin_addr = app_config.admin;
        let sender_addr = signer::address_of(sender);

        let constructor_ref = object::create_named_object(sender, *string::bytes(&name));
        let object_signer = object::generate_signer(&constructor_ref);

        let coins = coin::withdraw<AptosCoin>(sender, app_config.fees);
        coin::deposit<AptosCoin>(admin_addr, coins);

        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            &constructor_ref,
            option::some(1_000_000_000),
            name,
            symbol,
            DECIMAIL,
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

        mint_tokens(sender, fa_obj, amount);
    }

    /// Mint tokens to an account
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

}
```
