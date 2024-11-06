# Managed Collection

## Summary

- Introduces the concept of managing NFT collections and tokens using Aptos blockchain
- Explains the use of `Object` for storing token and collection data
- Demonstrates creation of custom structures for collection management
- Shows implementation of collection initialization and token minting functions
- Highlights the importance of tracking object addresses for collections and tokens
- Introduces a method to store and retrieve minted NFTs for each user
- Provides code examples for creating collections, minting tokens, and viewing token information

## Create NFT Collection & Manager

When using aptos_token and collection, all data and resources are stored as `Object`. This makes our `token` much more flexible, but at the same time also makes management more complex. In this section, we will use another resource together to manage these tokens and collections effectively.

```rust
struct CreateNFTCollection has key {
    collection_object: Object<collection::Collection>,
    collection_name: String,
    minting_enabled: bool,
    mint_fee: u64
}
```

With this structure, we can store the initialization components and information of the Collection. We can also add details like `admin` or other functions. However, in this example, I'll separate the `admin` resource into a distinct resource to make changing the owner or admin of this collection more flexible.

```rust
struct DataManager has key {
    admin: address,
}
```

Next, we'll complete the initialization of a collection. But first, we need to set the `admin` to determine who has the authority to create collections.

```rust
fun init_module(resource_account: &signer) {
    move_to(resource_account, DataManager {
        admin: @movement
    })
}
```

![image.png](/content-images/Managed%20Collection/image.png)

## Create Movement AptosCollection

Here, we'll use the account itself as the platform admin. Whenever someone initializes a collection, they'll automatically become the admin of that collection.

```rust
public entry fun create_movement_collection(admin: &signer) acquires CollectionManager {
    let admin_addr = signer::address_of(admin);
    // Check if the collection already exists for the admin
    // Abort if the MovementCollection already exists for the admin
    assert!(!exists&lt;MovementCollection&gt;(admin_addr), 0);
    
    // Set the admin address in the CollectionManager
    // Move the MovementCollection resource to the admin's account
    let module_data = borrow_global_mut&lt;CollectionManager&gt;(@movement);
    module_data.admin = admin_addr;
    
    // Create a new collection object with specified parameters
    let collection_object = aptos_token::create_collection_object(
        admin,                                     // Creator
        utf8(COLLECTION_DESCRIPTION),              // Description
        1000,                                      // Max Supply
        utf8(COLLECTION_NAME),                     // Collection Name
        utf8(COLLECTION_URI),                      // Collection URI
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

    move_to(admin, MovementCollection {
        collection_object,
        collection_name: utf8(COLLECTION_NAME),
        minting_enabled: true,
        mint_fee: 0
    });
}
```

![image.png](/content-images/Managed%20Collection/image%201.png)

After initializing the Collection, we'll create tokens within the `collection`. Since we've stored the `collection_name` in the MovementCollection Resource, we can easily access the user's global data to retrieve this information through acquires.

```rust
public entry fun mint_nft(user: &signer) acquires MovementCollection {
    let user_addr = signer::address_of(user);
    let movement_collection = borrow_global&lt;MovementCollection&gt;(@movement);

    aptos_token::mint_token_object(
        user,                                    // Creator
        movement_collection.collection_name,     // Collection Name
        utf8(b"Token Movement Description"),     // Token Description
        utf8(b"Token Movement Name"),            // Token Name
        utf8(b"Token URI"),                      // Token URI: `https://example.com/image.png`
        vector[],                                // Property Keys: vector<String>
        vector[],                                // Property Types: vector<String>
        vector[]                                 // Property Values: vector<u8>
    );
}
```

Here we have a `property` parameter, but we'll discuss it in later lessons. Returning to this section, we notice an issue: we're creating `objects` but we don't know their addresses or locations, similar to what we learned in the object lesson. We should store these object addresses for future use.

```rust
struct MovementCollection has key {
    collection_object: Object<AptosCollection>,
    collection_address: address,
    collection_name: String,
    minting_enabled: bool,
    mint_fee: u64
}
```

We're adding a `collection_address` field to store the object_address of the created collection. We'll store it like this:

```rust
let collection_address = object::create_object_address(&admin_addr, COLLECTION_NAME);
move_to(admin, MovementCollection {
    collection_object,
    collection_address,
    collection_name: utf8(COLLECTION_NAME),
    minting_enabled: true,
    mint_fee: 0
});
```

This allows us to store the collection_address in the resources. We can also create a view function to retrieve this `object` address:

```rust
#[view]
public fun get_collection_object_address(owner: address): address acquires MovementCollection {
    let movement_collection = borrow_global<MovementCollection>(owner);
    object::create_object_address(&owner, COLLECTION_NAME)
}
```

After checking the `object` information, you'll see that it creates four different resources when you call the `create_movement_collection` function:

![Screenshot 2024-10-15 at 15.54.09.png](/content-images/Managed%20Collection/Screenshot_2024-10-15_at_15.54.09.png)

![Screenshot 2024-10-15 at 15.54.14.png](/content-images/Managed%20Collection/Screenshot_2024-10-15_at_15.54.14.png)

![Screenshot 2024-10-15 at 15.54.18.png](/content-images/Managed%20Collection/Screenshot_2024-10-15_at_15.54.18.png)

![Screenshot 2024-10-15 at 15.54.22.png](/content-images/Managed%20Collection/Screenshot_2024-10-15_at_15.54.22.png)

## Create AptosToken

Similarly, when initializing AptosToken:

We'll use `create_object_address` to generate an address for storing the token_object. I'll add another field to `MovementCollection` with the data type `table&lt;address, vector&lt;address&gt;&gt;`. This allows me to track how many tokens a person has minted and which tokens they are.

```rust
struct MovementCollection has key {
    collection_object: Object<AptosCollection>,
    collection_address: address,
    collection_name: String,
    minting_enabled: bool,
    mint_fee: u64,
    minted_nfts: table::Table<address, vector<address>>,
}
```

When initializing the collection, I'll create a new `table`:

```rust
move_to(admin, MovementCollection {
    collection_object,
    collection_address,
    collection_name: utf8(COLLECTION_NAME),
    minting_enabled: true,
    mint_fee: 0,
    minted_nfts: table::new()
});
```

I'll change the `aptos_token::mint` function to `aptos_token::mint_token_object` so it returns an object, which I'll use to create a named_address:

```rust
public entry fun mint_nft(user: &signer) acquires MovementCollection {
    let user_addr = signer::address_of(user);
    let movement_collection = borrow_global_mut<MovementCollection>(@movement);

    if (!table::contains(&movement_collection.minted_nfts, user_addr)) {
        table::add(&mut movement_collection.minted_nfts, user_addr, vector::empty<address>());
    };
    let nft_minted = table::borrow_mut(&mut movement_collection.minted_nfts, user_addr);

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

    let token_address = object::create_object_address(&user_addr, COLLECTION_NAME);
    vector::push_back(nft_minted, token_address);
}

#[view]
public fun get_token_object(owner: address): vector<address> acquires MovementCollection {
    let movement_collection = borrow_global<MovementCollection>(owner);
    *table::borrow(&movement_collection.minted_nfts, owner)
}
```

With this view function, I can easily determine how many `AptosTokens` have been created and which `tokens` they are.

![image.png](/content-images/Managed%20Collection/image%202.png)

## FullCode

```rust
module movement::nft_aptos_collection {
    use aptos_token_objects::aptos_token::{Self, AptosToken, AptosCollection};
    use aptos_token_objects::token;
    use aptos_token_objects::collection::{Self,Collection};
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
        admin: address
    }

    struct MovementCollection has key {
        collection_object: Object<AptosCollection>,
        collection_address: address,
        collection_name: String,
        minting_enabled: bool,
        mint_fee: u64,
        minted_nfts: table::Table<address, vector<address>>,
    }

    #[event]
    struct CreateMovementCollectionEvents has drop, store {
        collection_address: address,
        collection_name: String,
        owner: address
    }

    fun init_module(resource_account: &signer) {
        move_to(resource_account, CollectionManager {
            admin: @movement
        })
    }

    public entry fun create_movement_collection(admin: &signer) acquires CollectionManager {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<MovementCollection>(admin_addr), 0);

        let module_data = borrow_global_mut<CollectionManager>(@movement);
        module_data.admin = admin_addr;

        let collection_object = aptos_token::create_collection_object(
            admin,                                     // Creator
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
            minted_nfts: table::new()
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

    public entry fun mint_nft(user: &signer) acquires MovementCollection {
        let user_addr = signer::address_of(user);
        let movement_collection = borrow_global_mut<MovementCollection>(@movement);

        if (!table::contains(&movement_collection.minted_nfts, user_addr)) {
            table::add(&mut movement_collection.minted_nfts, user_addr, vector::empty<address>());
        };
        let nft_minted = table::borrow_mut(&mut movement_collection.minted_nfts, user_addr);

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

        let token_address = object::create_object_address(&user_addr, COLLECTION_NAME);
        vector::push_back(nft_minted, token_address);
    }

    #[view]
    public fun get_token_object(owner: address): vector<address> acquires MovementCollection {
        let movement_collection = borrow_global<MovementCollection>(owner);
        *table::borrow(&movement_collection.minted_nfts, owner)
    }
}

```