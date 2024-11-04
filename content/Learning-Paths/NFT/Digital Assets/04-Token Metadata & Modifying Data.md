# Token Metadata & Modifying Data

## Summary

- Token Metadata creation and modification for NFTs on Aptos blockchain
- Use of `create_named_token` function to initialize TokenObjects
- Creation of custom NFT using `Object Group Member` with user-defined fields
- Process of initializing and transferring tokens to object's signer
- Implementation of `mint_nft` function for token creation
- Storage and usage of `mutator_ref` for updating token metadata
- Example of updating token description using `update_token_description` function

## Overview

In the previous lesson, we successfully initialized a collection and token, but here you can see that we use `create_named_token` to initialize a TokenObjects, and the fields here are predefined and we can only pass in the Token Name.

So in order to customize an NFT according to our wishes, we need to initialize another Resource and store it in the token Object that was initialized from the `create_named_token` function

## Create a Token Metadata

Here, we'll create a custom NFT using an `Object Group Member` with fields that you can define according to your needs.

```rust
struct MovementPepeMeme has key {
    name: String,
    uri: String,
    description: String,
}
```

Here's an example of an NFT meme token with three simple fields. In practice, you can customize it according to your needs.

Next, we'll initialize a token:

```rust
let movement_meme = MovementPepeMeme {
    name: token_name,
    uri,
    description
};
```

The `name`, `uri`, and `description` are parameters passed from outside.

Since `create_named_object` returns a ConstructorRef, we need to create a `signer` from the object to store this NFT, transfer it to the signer, or use it for future transfers:

```rust
let token_signer = object::generate_signer(&constructor_ref);
```

Then we simply transfer it to the object's `signer`, similar to what we learned in the objects topic.

```rust
let token_signer = object::generate_signer(&constructor_ref);

let movement_meme = MovementPepeMeme {
    name: token_name,
    uri,
    description
};
move_to(&token_signer, movement_meme);
```

After completing the code, your implementation should look like this:

```rust
module movement::nft_factory {
    use aptos_token_objects::collection;
    use aptos_token_objects::token::{Self, Token};
    use aptos_framework::object;
    use std::string::{utf8, String};
    use std::option;
    use std::signer;

    const COLLECTION_DESCRIPTION: vector<u8> = b"Movement Non-Fungible Tokens Collection";
    const COLLECTION_NAME: vector<u8> = b"Movement NFT Collection";
    const COLLECTION_URI: vector<u8> = b"https://movementlabs.xyz";
    const MAX_SUPPLY: u64 = 10_000;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct MovementPepeMeme has key {
        name: String,
        uri: String,
        description: String,
    }

    fun init_module(creator: &signer) {
        let royalty = option::none();
        collection::create_fixed_collection(
            creator,
            utf8(COLLECTION_DESCRIPTION),
            MAX_SUPPLY,
            utf8(COLLECTION_NAME),
            royalty,
            utf8(COLLECTION_URI),
        );
    }

    public entry fun mint_nft(creator: &signer, token_name: String, uri: String, description: String) {
        let constructor_ref = token::create_named_token(
            creator,
            utf8(COLLECTION_NAME),
            utf8(COLLECTION_DESCRIPTION),
            token_name,
            option::none(),
            utf8(COLLECTION_URI)
        );
        let token_object = object::object_from_constructor_ref<Token>(&constructor_ref);
        let token_signer = object::generate_signer(&constructor_ref);

        let movement_meme = MovementPepeMeme {
            name: token_name,
            uri,
            description
        };
        move_to(&token_signer, movement_meme);

        object::transfer(creator, token_object, signer::address_of(creator));
    }
}
```

Next, we'll initialize the NFT through publishing the package and then call the `mint_nft` function via the CLI as follows:

```rust
movement run --function-id '0x8e4ad880c961f094f149993b3f83ac9eace3dd7ab8cedca7d0a4266b8de6aff7::nft_factory::mint_nft' --args string:Hello string:link string:desc --profile default
```

After the successful execution, we can verify the results on the explorer. We'll find a new Resource added:

![image.png](Token%20Metadata%20&%20Modifying%20Data%2011918675b2d78023a17ac2fba02de1d1/image.png)

## Modify Token Metadata

We've successfully created an NFT with custom metadata. Now, how can we modify or update this metadata?

This process is similar to working with Objects, as NFTs are essentially objects we've studied in previous topics.

To modify metadata, we need to create a `mutator_ref` from the Token's `constructor` and store it somewhere. In this example, we'll store it directly on the Resource:

```rust
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct MovementPepeMeme has key {
    name: String,
    uri: String,
    description: String,
    mutator_ref: token::MutatorRef
}
```

Next, initialize the `mutator_ref` and store it in the resource:

```rust
public entry fun mint_nft(creator: &signer, token_name: String, uri: String, description: String) {
    let constructor_ref = token::create_named_token(
        creator,
        utf8(COLLECTION_NAME),
        utf8(COLLECTION_DESCRIPTION),
        token_name,
        option::none(),
        utf8(COLLECTION_URI)
    );
    let token_object = object::object_from_constructor_ref<Token>(&constructor_ref);
    let token_signer = object::generate_signer(&constructor_ref);
    let mutator_ref = token::generate_mutator_ref(&constructor_ref);

    let movement_meme = MovementPepeMeme {
        name: token_name,
        uri,
        description,
        mutator_ref
    };
    move_to(&token_signer, movement_meme);

    object::transfer(creator, token_object, signer::address_of(creator));
}
```

Then we can use the mutator_ref to update the Token and Metadata:

```rust
public entry fun update_token_description(creator: &signer, collection: String, name: String, description: String) acquires MovementPepeMeme {
    let (meme_obj, meme) = get_meme(
        &signer::address_of(creator),
        &collection,
        &name,
    );

    let creator_addr = token::creator(meme_obj);
    assert!(creator_addr == signer::address_of(creator), ENOT_CREATOR);
    token::set_description(&meme.mutator_ref, description);
}

inline fun get_meme(creator: &address, collection: &String, name: &String): (Object<MovementPepeMeme>, &MovementPepeMeme) {
    let token_address = token::create_token_address(
        creator,
        collection,
        name,
    );
    (object::address_to_object<MovementPepeMeme>(token_address), borrow_global<MovementPepeMeme>(token_address))
}
```

### Full Code

```rust
module movement::nft_factory {
    use aptos_token_objects::collection;
    use aptos_token_objects::token::{Self, Token};
    use aptos_framework::object::{Self, Object};
    use std::string::{utf8, String};
    use std::option;
    use std::signer;

    const COLLECTION_DESCRIPTION: vector<u8> = b"Movement Non-Fungible Tokens Collection";
    const COLLECTION_NAME: vector<u8> = b"Movement NFT Collection";
    const COLLECTION_URI: vector<u8> = b"https://movementlabs.xyz";
    const MAX_SUPPLY: u64 = 10_000;
    const ENOT_CREATOR: u64 = 0;

    struct MovementPepeMeme has key {
        name: String,
        uri: String,
        description: String,
        mutator_ref: token::MutatorRef
    }

    public entry fun create_collection(creator: &signer) {
        let royalty = option::none();
        collection::create_fixed_collection(
            creator,
            utf8(COLLECTION_DESCRIPTION),
            MAX_SUPPLY,
            utf8(COLLECTION_NAME),
            royalty,
            utf8(COLLECTION_URI),
        );
    }

    public entry fun mint_nft(creator: &signer, token_name: String, uri: String, description: String) {
        let constructor_ref = token::create_named_token(
            creator,
            utf8(COLLECTION_NAME),
            utf8(COLLECTION_DESCRIPTION),
            token_name,
            option::none(),
            utf8(COLLECTION_URI)
        );
        let token_object = object::object_from_constructor_ref<Token>(&constructor_ref);
        let token_signer = object::generate_signer(&constructor_ref);
        let mutator_ref = token::generate_mutator_ref(&constructor_ref);

        move_to(&token_signer, MovementPepeMeme {
            name: token_name,
            uri,
            description,
            mutator_ref
        });

        object::transfer(creator, token_object, signer::address_of(creator));
    }

    public entry fun update_meme_description(creator: &signer, collection: String, name: String, description: String) acquires MovementPepeMeme {
        let (meme_obj, meme) = get_meme(
            &signer::address_of(creator),
            &collection,
            &name,
        );

        let creator_addr = token::creator(meme_obj);
        assert!(creator_addr == signer::address_of(creator), ENOT_CREATOR);
        token::set_description(&meme.mutator_ref, description);
    }

    inline fun get_meme(creator: &address, collection: &String, name: &String): (Object<MovementPepeMeme>, &MovementPepeMeme) {
        let token_address = token::create_token_address(
            creator,
            collection,
            name,
        );
        (object::address_to_object<MovementPepeMeme>(token_address), borrow_global<MovementPepeMeme>(token_address))
    }
}

```