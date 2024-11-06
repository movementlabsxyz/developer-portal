# Royalty & Property Map

## Summary

- Royalties for NFT collections are defined using numerator and denominator values
- NFT properties are stored in a PropertyMap as key-value pairs
- Various functions are available for managing and querying PropertyMap data
- Specific functions exist for reading different data types from PropertyMap
- PropertyMap can be modified using add, update, and remove functions

## Royalty

In the previous topic, we used `aptos_token::create_collection` to initialize a collection, which includes two parameters called `royalty`.

```rust
let collection_object = aptos_token::create_collection_object(
    admin,                                     // Creator
    utf8(COLLECTION_DESCRIPTION),              // Description
    1000,                                      // Max Supply
    utf8(COLLECTION_NAME),                     // Collection Name
    utf8(COLLECTION_URI),                      // Collection Uri
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
    100,                                       // royalty_denominator
);
```

`royalty_numerator` and `royalty_denominator` define the royalty percentage for the NFT collection. Specifically:

1. `royalty_numerator`: The royalty amount.
2. `royalty_denominator`: The total transaction amount.

The royalty percentage is calculated by dividing `royalty_numerator` by `royalty_denominator`.

In this example:

```rust
royalty_numerator = 0
royalty_denominator = 100
```

This results in a royalty percentage of 0/100 = 0%, meaning no royalties are applied to this collection. To set a royalty percentage—for example, 2.5%—you could use:

```rust
royalty_numerator = 25
royalty_denominator = 1000
```

This creates a ratio of 25/1000 = 2.5%.

Using two separate values (instead of a simple decimal) allows for precise representation of fractions without encountering issues with decimal precision in computers.

## Property

In the `mint_nft` function, we have three empty parameters:

```rust
let create_token_object = aptos_token::mint_token_object(
    user,
    movement_collection.collection_name,
    utf8(b"Token Movement Description"),
    utf8(b"Token Movement Name"),
    utf8(b"Token URI"),
    vector[],
    vector[],
    vector[]
);
```

Typically, an NFT contains additional metadata such as parameters, attributes, or any other desired information.

Each NFT has a PropertyMap to store these properties, which are saved as key-value pairs:

```rust
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
/// A Map for typed key to value mapping, the contract using it
/// should keep track of what keys are what types, and parse them accordingly.
struct PropertyMap has drop, key {
    inner: SimpleMap<String, PropertyValue>,
}

/// A typed value for the `PropertyMap` to ensure that typing is always consistent
struct PropertyValue has drop, store {
    type: u8,
    value: vector<u8>,
}
```

Based on this, we can create data pairs:

```rust
let create_token_object = aptos_token::mint_token_object(
    user,
    movement_collection.collection_name,
    utf8(b"Token Movement Description"),
    utf8(b"Token Movement Name"),
    utf8(b"Token URI"),
    vector[utf8(b"keys")],
    vector[utf8(b"types")],
    vector[b"value"]
);
```

## Additional Functions

### Key Functions for PropertyMap Management

| **Function** | **Description** | **Parameters** | **Return** |
| --- | --- | --- | --- |
| init | Initializes PropertyMap | ref: &ConstructorRef, container: PropertyMap | None |
| extend | Adds PropertyMap to object | ref: &ExtendRef, container: PropertyMap | None |
| burn | Removes entire property map | ref: MutatorRef | None |
| prepare_input | Prepares property container | keys: vector<String>, types: vector<String>, values: vector<vector<u8>> | PropertyMap |
| generate_mutator_ref | Creates MutatorRef | ref: &ConstructorRef | MutatorRef |

### PropertyMap Query Functions

| **Function** | **Description** | **Parameters** | **Return** |
| --- | --- | --- | --- |
| contains_key | Checks for key | object: &Object<T>, key: &String | bool |
| length | Counts entries | object: &Object<T> | u64 |
| read | Retrieves BCS-encoded property | object: &Object<T>, key: &String | (String, vector<u8>) |

### Type-Specific Read Functions

| **Function** | **Description** | **Parameters** | **Return** |
| --- | --- | --- | --- |
| read_bool | Retrieves boolean | object: &Object<T>, key: &String | bool |
| read_u8/u16/u32/u64/u128/u256 | Retrieves unsigned integer | object: &Object<T>, key: &String | respective uint |
| read_address | Retrieves address | object: &Object<T>, key: &String | address |
| read_bytes | Retrieves byte vector | object: &Object<T>, key: &String | vector<u8> |
| read_string | Retrieves string | object: &Object<T>, key: &String | String |

### PropertyMap Modification Functions

| **Function** | **Description** | **Parameters** | **Return** |
| --- | --- | --- | --- |
| add | Adds BCS-encoded property | ref: &MutatorRef, key: String, type: String, value: vector<u8> | None |
| add_typed | Adds non-BCS-encoded property | ref: &MutatorRef, key: String, value: T | None |
| update | Updates BCS-encoded property | ref: &MutatorRef, key: &String, type: String, value: vector<u8> | None |
| update_typed | Updates non-BCS-encoded property | ref: &MutatorRef, key: &String, value: T | None |
| remove | Deletes property | ref: &MutatorRef, key: &String | None |