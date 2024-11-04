# Token Standard & Mint your NFT

## Create a Non-Function Token

After creating a collection, which is a set of NFTs, the next step we need to take is undoubtedly to create the NFTs belonging to the Collection that we initiated in the previous topic.

Similar to Collections, NFTs are also objects stored separately, and actions performed on NFTs will not affect the Collection.

```rust
let token_constructor_ref = token::create_named_token(
   creator,
   string::utf8(COLLECTION_NAME),
   string::utf8(COLLECTION_DESCRIPTION),
   token_name,
   option::none(),
   string::utf8(TOKEN_URI),
);
```

There are multiple ways to initialize an NFT with different types, but in this tutorial, we'll simplify the process by using the `create_named_token` function to create an NFT through the Collection name.

Since we'll reuse `Collection Name`, `Collection Description`, and other data in this function, we'll convert these pieces of information into `constant` values for reusability:

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

    public entry fun mint_nft(creator: &signer, token_name: String) {
        let constructor_ref = token::create_named_token(
            creator,
            utf8(COLLECTION_NAME),
            utf8(COLLECTION_DESCRIPTION),
            token_name,
            option::none(),
            utf8(COLLECTION_URI)
        );
        let token_object = object::object_from_constructor_ref<Token>(&constructor_ref);

        object::transfer(creator, token_object, signer::address_of(creator));
    }
}
```

Similar to the previous topic, we will publish the package. After publishing, we already have the Object Collection in the account. Now, let's try to create an NFT using the `mint_nft` function. 

```rust
movement move run --function-id 'default::nft_factory::mint_nft' --args string:Hello
```

After successful execution, let's examine our account on the Movement explorer:

In addition to Core Objects and Collection Objects, we'll find several new objects, including `TokenIdentifiers`, `Token`, and another Object we should pay attention to: `ConcurrentSupply`.

### ConcurrentSupply

![image.png](Token%20Standard%20&%20Mint%20your%20NFT%2011918675b2d780f7bdf6f11c2a6e279f/image.png)

This provides information about the total supply of the collection and the number of tokens currently circulating in the market.

### TokenIdentifiers

![image.png](Token%20Standard%20&%20Mint%20your%20NFT%2011918675b2d780f7bdf6f11c2a6e279f/image%201.png)

This will contain the name of the NFT that we initialized through the CLI.

### Token

![image.png](Token%20Standard%20&%20Mint%20your%20NFT%2011918675b2d780f7bdf6f11c2a6e279f/image%202.png)

This is the Object Token containing the information of the `Token`