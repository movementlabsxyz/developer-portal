# Permission to mint NFTs

## Summary

- Introduces the concept of ExtendRef to allow minting of NFTs by users
- Demonstrates how to initialize ExtendRef and store it in MovementCollection struct
- Shows implementation of a `mint_nft` function that allows anyone to mint NFTs
- Utilizes `ExtendRef` to create and transfer token objects to users
- Provides full code example of the NFT minting module in Rust
- Includes functions for creating collections, minting NFTs, and retrieving collection and token addresses

## Create ExtendRef

In the previous topic, we helped the collection admin create a token. So how do we allow everyone to mint these NFTs? Actually, we've learned this in the `object` section—it's about initializing object abilities, specifically `ExtendRef` in this case.

In this example, we'll initialize ExtendRef and store it in MovementCollection:

```rust
struct MovementCollection has key {
    collection_object: Object<AptosCollection>,
    collection_address: address,
    collection_name: String,
    minting_enabled: bool,
    mint_fee: u64,
    minted_nfts: table::Table<address, vector<address>>,
    extend_ref: ExtendRef
}
```

Next, we'll initialize extend_ref in the `create_movement_collection` function:

```rust
let creator_constructor_ref = &object::create_object(admin_addr);
let extend_ref = object::generate_extend_ref(creator_constructor_ref);
let creator = &object::generate_signer_for_extending(&extend_ref);

let collection_address = object::create_object_address(&admin_addr, COLLECTION_NAME);

move_to(admin, MovementCollection {
    collection_object,
    collection_address,
    collection_name: utf8(COLLECTION_NAME),
    minting_enabled: true,
    mint_fee: 0,
    minted_nfts: table::new(),
    extend_ref
});
```

## Open Minting to Everyone

After initializing `ExtendRef`, we can allow users to use it to create `NFT`s. In this example, we'll allow everyone to mint NFTs:

```rust
public entry fun mint_nft(user: &signer, owner: address) acquires MovementCollection {
    let user_addr = signer::address_of(user);
    let movement_collection = borrow_global_mut<MovementCollection>(owner);

    let creator = &object::generate_signer_for_extending(&movement_collection.extend_ref);

    if (!table::contains(&movement_collection.minted_nfts, user_addr)) {
        table::add(&mut movement_collection.minted_nfts, user_addr, vector::empty<address>());
    };

    let nft_minted = table::borrow_mut(&mut movement_collection.minted_nfts, user_addr);

    let create_token_object = aptos_token::mint_token_object(
        creator,
        movement_collection.collection_name,
        utf8(b"Token Movement Description"),
        utf8(b"Token Movement Name"),
        utf8(b"Token URI"),
        vector[],
        vector[],
        vector[]
    );

    let token_address = object::create_object_address(&user_addr, COLLECTION_NAME);
    vector::push_back(nft_minted, token_address);

    object::transfer(creator, create_token_object, user_addr);
}
```

In the example above, we use data from `MovementCollection` via borrow_global at a specific owner address. This will be a parameter because we can have multiple collections, and users can choose to mint_nft from any Collection.

```rust
let movement_collection = borrow_global_mut<MovementCollection>(owner);
let creator = &object::generate_signer_for_extending(&movement_collection.extend_ref);
```

Finally, we'll initialize the NFT and transfer it to the owner using `extend_ref`:

```rust
let create_token_object = aptos_token::mint_token_object(
    creator,
    movement_collection.collection_name,
    utf8(b"Token Movement Description"),
    utf8(b"Token Movement Name"),
    utf8(b"Token URI"),
    vector[],
    vector[],
    vector[]
);
object::transfer(creator, create_token_object, user_addr);
```

### FullCode

```rust
module movement::nft_aptos_collection {
    use aptos_token_objects::aptos_token::{Self, AptosToken, AptosCollection};
    use aptos_token_objects::token;
    use aptos_token_objects::collection::{Self,Collection};
    use aptos_token_objects::property_map;
    use aptos_framework::object::{Self, Object, ExtendRef, ObjectCore};
    use std::signer;
    use std::table;
    use std::option;
    use std::string::{utf8, String};
    use std::event;
    use std::vector;

    const COLLECTION_NAME: vector<u8> = b"Movement NFT";
    const COLLECTION_DESCRIPTION: vector<u8> = b"Movement NFT Descriprtion";
    const COLLECTION_URI: vector<u8> = b"https://movementlabs.xyz/image.png";

    struct CollectionManager has key {
        extend_ref: ExtendRef
    }

    struct MovementCollection has key {
        collection_object: Object<AptosCollection>,
        collection_address: address,
        collection_name: String,
        minting_enabled: bool,
        mint_fee: u64,
        minted_nfts: table::Table<address, vector<address>>,
        extend_ref: ExtendRef
    }

    #[event]
    struct CreateMovementCollectionEvents has drop, store {
        collection_address: address,
        collection_name: String,
        owner: address
    }

    fun init_module(creator: &signer) {
        let creator_constructor_ref = &object::create_object(@movement);
        let extend_ref = object::generate_extend_ref(creator_constructor_ref);
        move_to(creator, CollectionManager {
            extend_ref
        })
    }

    public entry fun create_movement_collection(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<MovementCollection>(admin_addr), 0);

        let creator_constructor_ref = &object::create_object(admin_addr);
        let extend_ref = object::generate_extend_ref(creator_constructor_ref);
        let creator = &object::generate_signer_for_extending(&extend_ref);

        let collection_object = aptos_token::create_collection_object(
            creator,                                   // Creator
            utf8(COLLECTION_DESCRIPTION),              // Desciprtion
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
            100,                                       // royatly_denominator
        );

        let collection_address = object::create_object_address(&admin_addr, COLLECTION_NAME);
        move_to(admin, MovementCollection {
            collection_object,
            collection_address,
            collection_name: utf8(COLLECTION_NAME),
            minting_enabled: true,
            mint_fee: 0,
            minted_nfts: table::new(),
            extend_ref
        });

        event::emit(CreateMovementCollectionEvents {
            collection_address,
            collection_name: utf8(COLLECTION_NAME),
            owner: admin_addr
        });
    }

    #[view]
    public fun get_collection_object_address(owner: address): address acquires MovementCollection {
        let movement_collection = borrow_global<MovementCollection>(owner);
        object::create_object_address(&owner, COLLECTION_NAME)
    }

    public entry fun mint_nft(user: &signer, owner: address) acquires MovementCollection {
        let user_addr = signer::address_of(user);
        let movement_collection = borrow_global_mut<MovementCollection>(owner);

        let creator = &object::generate_signer_for_extending(&movement_collection.extend_ref);

        if (!table::contains(&movement_collection.minted_nfts, user_addr)) {
            table::add(&mut movement_collection.minted_nfts, user_addr, vector::empty<address>());
        };

        let nft_minted = table::borrow_mut(&mut movement_collection.minted_nfts, user_addr);

        let create_token_object = aptos_token::mint_token_object(
            creator,
            movement_collection.collection_name,
            utf8(b"Token Movement Description"),
            utf8(b"Token Movement Name"),
            utf8(b"Token URI"),
            vector[],
            vector[],
            vector[]
        );

        let token_address = object::create_object_address(&user_addr, COLLECTION_NAME);
        vector::push_back(nft_minted, token_address);

        object::transfer(creator, create_token_object, user_addr);
    }

    #[view]
    public fun get_token_object_address(owner: address): vector<address> acquires MovementCollection {
        let movement_collection = borrow_global<MovementCollection>(owner);
        *table::borrow(&movement_collection.minted_nfts, owner)
    }
}
```