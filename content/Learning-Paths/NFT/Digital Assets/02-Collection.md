# Collection

## Digital Assets Demystified: Revolutionary Approach to NFTs

The Aptos framework provides a new approach to Digital Assets, revolutionizing the creation and management of collections and Non-Fungible Tokens.

By leveraging the power of Objects that we've explored in the previous section (Here), we can create objects containing distinct components of an NFT collection. This change compared to traditional models enhances the system's flexibility and allows for more adaptable control of components.

The object-oriented framework in Aptos brings several advantages:

- High flexibility: Developers can easily customize NFTs for specific use cases.
- Improved discoverability: The unique address of each object simplifies asset tracking and interaction.
- Scalability: The system efficiently handles complex NFT structures.

For those unfamiliar with Aptos' object model, our detailed Object modules provide an excellent introduction to this groundbreaking approach in blockchain technology.

`Collection` - A set of NFTs with a name and a bit of context for the group.

```rust
#[resource_group_member(#[group = 0x1::object::ObjectGroup])]
struct Collection has key {
    creator: address,
    description: String,
    name: String,
    uri: String,
		mutation_events: event::EventHandle<collection::MutationEvent>
}
```

To create a Collection with the Aptos framework, we have several different methods. Here are some predefined functions to initialize a collection through `aptos_token_objects`.

To use this library, you need to `import` it into the `Move.toml` file.

```toml
[dependencies.AptosTokenObjects]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-token-objects"
```

- Complete `Move.toml` file contents.

```toml
[package]
name = "developer_portal"
version = "1.0.0"
authors = ["Movement Foundation"]
license = "MIT"

[addresses]
movement = "0x1"

[dev-addresses]

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

[dependencies.AptosTokenObjects]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-token-objects"

[dev-dependencies]
```

## Why Objects Are Useful

In reality, a user (account) can own one or multiple different collections. Using Objects to store Collections separately will help manage them more effectively and efficiently.

Furthermore, after creating Tokens, we know that these tokens may not necessarily belong to the collection owner but can be owned by anyone. With the use of objects, transferring, buying, selling, and managing these tokens will be easier and more flexible than ever before.

![image.png](Collection%2011918675b2d7808eb874eec585da0c43/image.png)

### Initializing an object through the collection library

```rust
module movement::nft_factory {
    use aptos_token_objects::collection;
    use std::string::utf8;
    use std::option;

    fun init_module(creator: &signer, max_supply: u64) {
        let royalty = option::none();
        collection::create_fixed_collection(
            creator,
            utf8(b"My Collection Description"),
            max_supply,
            utf8(b"My Collection"),
            royalty,
            utf8(b"https://mycollection.com"),
        );
    }
}
```

After initializing the module, we'll attempt to create a collection by `publish`ing this module through the CLI:

```rust
aptos move publish
```

After completing this process, check the transaction details on the explorer:

![image.png](Collection%2011918675b2d7808eb874eec585da0c43/image%201.png)

Through the `create_fixed_collection` function, we've initialized an `object` owned by the creator who initiated and possesses the object. We've also generated an `addr` of `0xa71c541d8f6022e60423d84a6cd5c0c76f898586933204f3521ab5f8f89bae86`. This address represents both the object's location and the `address owner` of the Collection.

![image.png](Collection%2011918675b2d7808eb874eec585da0c43/image%202.png)

The second resource initialized is a Collection that we defined in the Function.