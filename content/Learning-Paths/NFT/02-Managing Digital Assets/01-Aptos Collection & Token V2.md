# Aptos Collection & Token V2

## Summary

- Aptos Collection & Token V2 provides enhanced customization and standardization for NFTs on the Aptos blockchain.
- The `aptos_token_objects::aptos_token` module offers a standardized approach for creating collections and tokens.
- Aptos Collections are created with two resources: `Collection` and `AptosCollection`, allowing for various customizable attributes.
- Aptos Tokens automatically generate ability options for mutator, burn, and transfer operations, simplifying the token creation process.
- The `AptosToken` object provides built-in functionality for burning, transferring, and mutating tokens without manual setup.
- This approach offers greater flexibility and ease of use compared to manual initialization with `aptos_token_objects::token`.

## Overview

With the use of `use aptos_token_objects::token` to initialize tokens, or using `use aptos_token_objects::collection` and `collection::create_fixed_collection` to initialize collections, these are Tokens that you can customize according to your preferences. However, with `aptos_framework`, they also provide you with another standard to standardize `aptos_tokens` (token v2), making synchronization in common cases easier through `aptos_token_objects::aptos_token`

When initializing with `collection::create_fixed_collection`, we will create an object called Collection, but when you initialize an Aptos Collection through the function `aptos_tokens::create_collection`, you will receive 2 resources including:

```rust
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct Collection has key {
   creator: address,
   description: String,
   name: String,
   uri: String,
}

#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct AptosCollection has key {
    mutator_ref: Option<collection::MutatorRef>,
    royalty_mutator_ref: Option<royalty::MutatorRef>,
    mutable_description: bool,
    mutable_uri: bool,
    mutable_token_description: bool,
    mutable_token_name: bool,
    mutable_token_properties: bool,
    mutable_token_uri: bool,
    tokens_burnable_by_creator: bool,
    tokens_freezable_by_creator: bool,
}
```

For example, when using the `aptos_token::create_collection` function:

```rust
module movement::nft_aptos_collection {
    use aptos_token_objects::aptos_token;
    use std::string;

    const COLLECTION_NAME: vector<u8> = b"Movement NFT";
    const COLLECTION_DESCRIPTION: vector<u8> = b"Movement NFT Descriprtion";

    fun init_module(caller: &signer) {
        aptos_token::create_collection(
            caller,                                    // Creator
            string::utf8(b"Move Spiders are awesome"), // Collection Description
            1000,                                      // Max Supply
            string::utf8(b"Move Spiders"),             // Collection Name
            string::utf8(b"https://movementlabs.xyz"), // Collection URI
            true,                                      // mutable_description
            true,                                      // mutable_royalty
            true,                                      // mutable_uri
            true,                                      // mutable_token_description
            true,                                      // mutable_token_name
            true,                                      // mutable_token_properties
            true,                                      // mutable_token_uri
            true,                                      // tokens_burnable_by_creator
            true,                                      // tokens_freezable_by_creator
            0,                                         // royalty_numerator
            100,                                       // royatly_denominator
        );
    }
}
```

Here you can see that with `aptos_collection`, you can easily customize various `ability` settings. These include options to modify internal fields of the `token`, such as `description`, `royalty`, `uri`, and more.

## Aptos Tokens

Similar to Aptos Collection, aptos_token also provides a Mint function based on the `AptosCollection` you've previously created. This function is akin to create_token in `aptos_token_objects::token`, but with a key difference: it automatically generates various `ability` options for `mutator`, `burn`, or `transfer` operations. This eliminates the need for manual setup as we did before.

When using `aptos_token::mint`, we not only create a `Token` object but also an additional object called `AptosToken`:

```rust
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct Token has key {
   collection: Object<Collection>,
   description: String,
   name: String,
   uri: String,
}

#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct AptosToken has key {
    burn_ref: Option<token::BurnRef>,
    transfer_ref: Option<object::TransferRef>,
    mutator_ref: Option<token::MutatorRef>,
    property_mutator_ref: property_map::MutatorRef,
}
```

With AptosToken already initialized and using the `ability` options you need without manual initialization as when using `aptos_token_objects::token`

```rust
fun create_movement_token(caller: &signer) {
    aptos_token::mint(
        caller,                                        // creator
        string::utf8(COLLECTION_NAME),                 // collection name
        string::utf8(b"Movement Token description"),   // token description
        string::utf8(b"Movement Token"),               // token name
        string::utf8(b"https://movementlabs.xyz"),     // token uri
        vector[],                                      // property_keys
        vector[],                                      // property_types
        vector[],                                      // property_values
    )
}
```