# Creating NFTs using Resource Accounts

## Summary

- Resource accounts in Aptos enable programmatic control of assets and actions.
- The process involves setting up a resource account, storing account information, and creating an NFT collection.
- A CollectionConfig struct is used to manage collection details.
- The create_collection function combines all steps to set up the NFT collection.
- A mint function allows for creating and transferring NFTs within the collection.
- This approach allows for autonomous management of NFTs in decentralized applications.

# Option 1: Create a new Resource account

### Step 1: Understanding Resource Accounts

Resource accounts in Aptos are a powerful feature that allows for the creation of accounts that can be programmatically controlled. They're particularly useful for creating decentralized applications (dApps) that need to manage assets or perform actions autonomously.

### Step 2: Setting Up the Resource Account

To create an NFT collection using a resource account, we first need to set up the account and generate a signer. Here's how we do it:

```rust
use aptos_framework::account::{Self, SignerCapability, create_resource_account, create_signer_with_capability};

// Create the resource account
let (resource, resource_cap) = create_resource_account(account, seeds);

// Generate a signer from the resource account
let resource_signer_from_cap = create_signer_with_capability(&resource_cap);
```

In this code:

- `create_resource_account` creates a new resource account and returns the account address and a capability to generate signers for it.
- `create_signer_with_capability` uses the capability to create a signer for the resource account.

### Step 3: Storing the Resource Account Information

Next, we'll store the resource account information in a custom struct:

```rust
struct ResourceInfo has key {
    source: address,
    resource_cap: SignerCapability
}

move_to&lt;ResourceInfo&gt;(&resource_signer_from_cap, ResourceInfo {
    source: account_addr,
    resource_cap: resource_cap
});
```

This step is crucial because it allows us to retrieve the signer capability later when we need to perform actions on behalf of the resource account.

### Step 4: Creating the NFT Collection

Now that we have our resource account set up, we can create the NFT collection:

```rust
collection::create_fixed_collection(
    &resource_signer_from_cap,
    collection_description,
    collection_maximum,
    collection_name,
    option::none(),
    collection_uri,
);
```

This function creates a new collection with a fixed number of tokens. The resource account is the owner of this collection.

### Step 5: Defining the Collection Configuration

To keep track of our collection's details, we'll create a `CollectionConfig` struct:

```rust
struct CollectionConfig has key {
    collection_name: String,
    collection_description: String,
    collection_maximum: u64,
    collection_uri: String,
    token_counter: u64,
    token_base_name: String,
    token_description: String,
}
```

This struct will store all the necessary information about our collection, including details for individual tokens.

### Step 6: Implementing the Collection Creation Function

Now, let's put it all together in a function that creates the collection:

```rust
public entry fun create_collection(
    account: &signer,
    collection_name: String,
    collection_description: String,
    collection_uri: String,
    collection_maximum: u64,
    token_base_name: String,
    token_description: String,
    seeds: vector&lt;u8&gt;
) {
    let (resource, resource_cap) = create_resource_account(account, seeds);
    let resource_signer_from_cap = create_signer_with_capability(&resource_cap);
    let account_addr = signer::address_of(account);

    move_to(&resource_signer_from_cap, ResourceInfo {
        source: account_addr,
        resource_cap: resource_cap
    });

    move_to(&resource_signer_from_cap, CollectionConfig {
        collection_name,
        collection_description,
        collection_maximum,
        collection_uri,
        token_counter: 0,
        token_base_name,
        token_description,
    });

    collection::create_fixed_collection(
        &resource_signer_from_cap,
        collection_description,
        collection_maximum,
        collection_name,
        option::none(),
        collection_uri,
    );
}
```

This function combines all the previous steps to create a resource account, set up the collection configuration, and create the actual NFT collection.

### Step 7: Minting NFTs

Finally, let's implement a function to mint NFTs within our collection:

```rust
public entry fun mint(
    nft_claimer: &signer,
    collection_address: address,
    token_name: String,
    token_uri: String
) acquires ResourceInfo, CollectionConfig {
    let nft_claimer_addr = signer::address_of(nft_claimer);

    let collection_config = borrow_global_mut&lt;CollectionConfig&gt;(collection_address);
    let resource_info = borrow_global_mut&lt;ResourceInfo&gt;(collection_address);
    let resource_signer_from_cap = account::create_signer_with_capability(&resource_info.resource_cap);

    let constructor_ref = token::create_named_token(
        &resource_signer_from_cap,
        collection_config.collection_name,
        collection_config.collection_description,
        token_name,
        option::none(),
        token_uri
    );

    let token_object = object::object_from_constructor_ref&lt;Token&gt;(&constructor_ref);

    object::transfer(&resource_signer_from_cap, token_object, nft_claimer_addr);
}
```

This function does the following:

- Retrieves the collection configuration and resource info.
- Creates a new token within the collection.
- Transfers the newly created token to the claimer's address.

### Fullcode

```rust
module movement::mint_nft_by_resource_account {
    use std::string::{Self, String};
    use aptos_token_objects::collection;
    use aptos_token_objects::token::{Self, Token};
    use aptos_framework::object;
    use std::signer;
    use std::option;

    use aptos_framework::account::{Self, SignerCapability, create_resource_account, create_signer_with_capability};

    struct ResourceInfo has key {
        source: address,
        resource_cap: SignerCapability
    }

    struct CollectionConfig has key {
        collection_name: String,
        collection_description: String,
        collection_maximum: u64,
        collection_uri: String,
        token_counter: u64,
        token_base_name: String,
        token_description: String,
    }

    public entry fun create_collection(
        account: &signer,
        collection_name: String,
        collection_description: String,
        collection_uri: String,
        collection_maximum: u64,
        // Token
        token_base_name: String,
        token_description: String,
        seeds: vector<u8>
    ) {
        let (resource, resource_cap) = create_resource_account(account, seeds);
        let resource_signer_from_cap = create_signer_with_capability(&resource_cap);
        let account_addr = signer::address_of(account);

        // Token
        move_to(&resource_signer_from_cap, ResourceInfo {
            source: account_addr,
            resource_cap: resource_cap
        });

        move_to(&resource_signer_from_cap, CollectionConfig {
            collection_name,
            collection_description,
            collection_maximum: collection_maximum,
            collection_uri,
            token_counter: 1,
            // Token
            token_base_name,
            token_description,
        });

        collection::create_fixed_collection(
            &resource_signer_from_cap,
            collection_description,
            collection_maximum,
            collection_name,
            option::none(),
            collection_uri,
        );
    }

    public entry fun mint(nft_claimer: &signer, collection_address: address, token_name: String, token_uri: String) acquires ResourceInfo, CollectionConfig {
        let nft_claimer_addr = signer::address_of(nft_claimer);

        let collection_config = borrow_global_mut<CollectionConfig>(collection_address);
        let resource_info = borrow_global_mut<ResourceInfo>(collection_address);
        let resource_signer_from_cap = account::create_signer_with_capability(&resource_info.resource_cap);

        let constructor_ref = token::create_named_token(
            &resource_signer_from_cap,
            collection_config.collection_name,
            collection_config.collection_description,
            token_name,
            option::none(),
            token_uri
        );

        let token_object = object::object_from_constructor_ref<Token>(&constructor_ref);

        object::transfer(&resource_signer_from_cap, token_object, nft_claimer_addr);
    }
}
```

# Option 2: Publish/Mint to an Existing Resource Account

```rust
let (resource, resource_cap) = create_resource_account(account, seeds);
let resource_signer_from_cap = create_signer_with_capability(&resource_cap);
```

The function `account::create_resource_account` simply creates a new resource account, which you can use to deploy or store data, NFTs, etc.

However, in some cases, you may need to deploy or publish a module, or mint NFTs in an existing resource of another account. For this, we'll use the `resource_account::retrieve_resource_account_cap` function from the aptos_framework:

```rust
const DEV: address = @dev;

let signer_cap = resource_account::retrieve_resource_account_cap(caller, DEV);
let resource_signer = account::create_signer_with_capability(&signer_cap);
```

Here, DEV is the address of the pre-existing resource account. In this example, let's create a new resource account using the CLI:

```rust
movement account create-resource-account --seed "any-thing"
```

The result will be a resource account created from the CLI caller's account. In this case:

```rust
Transaction submitted: https://explorer.aptoslabs.com/txn/0xbfaad379aedfc64abe3cd95e941851c55892b1d2835749a759755d9b3a0afbfb?network=devnet
{
  "Result": {
    "resource_account": "f63618161394bc3d5554f30ee82ad049d716f9780c1d441e2c5bf76ddd516a31",
    "transaction_hash": "0xbfaad379aedfc64abe3cd95e941851c55892b1d2835749a759755d9b3a0afbfb",
    "gas_used": 511,
    "gas_unit_price": 100,
    "sender": "1b298d10a8ed3b25e6c03aff2e046e1bf5c8e764bce39d9c9b4bcbc9479dcc97",
    "sequence_number": 2,
    "success": true,
    "timestamp_us": 1729570392468682,
    "version": 95355030,
    "vm_status": "Executed successfully"
  }
}
```

- resource address: `f63618161394bc3d5554f30ee82ad049d716f9780c1d441e2c5bf76ddd516a31`
- source address: `0x1b298d10a8ed3b25e6c03aff2e046e1bf5c8e764bce39d9c9b4bcbc9479dcc97`

To publish a module to the resource address, create a profile for it in the `./aptos/config.yaml` file:

```rust
---
profiles:
  default:
    network: Devnet
    private_key: "0x9e8e8a0fb6089a4fefb865c8e159b0fd691083eddf7a263263a1f8a4f27e74e8"
    public_key: "0x93789f387574b4d17d84d9a3e49432d2d2ae2f3ba9eac1b47687c0adeec04eac"
    account: 1b298d10a8ed3b25e6c03aff2e046e1bf5c8e764bce39d9c9b4bcbc9479dcc97
    rest_url: "https://fullnode.devnet.aptoslabs.com"
    faucet_url: "https://faucet.devnet.aptoslabs.com"
  resource:
    network: Devnet
    private_key: "0x9e8e8a0fb6089a4fefb865c8e159b0fd691083eddf7a263263a1f8a4f27e74e8"
    public_key: "0x93789f387574b4d17d84d9a3e49432d2d2ae2f3ba9eac1b47687c0adeec04eac"
    account: f63618161394bc3d5554f30ee82ad049d716f9780c1d441e2c5bf76ddd516a31
    rest_url: "https://fullnode.devnet.aptoslabs.com"
    faucet_url: "https://faucet.devnet.aptoslabs.com"
```

Note that the PrivateKey and PublicKey of these two profiles are identical; only the account differs.

Next, modify the `Move.toml` file, changing the module's address to the resource account address:

```rust
[package]
name = "movement"
version = "1.0.0"
authors = []

[addresses]
source_addr = "0x1b298d10a8ed3b25e6c03aff2e046e1bf5c8e764bce39d9c9b4bcbc9479dcc97" // owner addr
movement = "f63618161394bc3d5554f30ee82ad049d716f9780c1d441e2c5bf76ddd516a31" // resource addr

[dev-addresses]

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

[dependencies.AptosToken]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-token"

[dev-dependencies]
```

You can now run the command to publish the module to the resource account `movement = f63618161394bc3d5554f30ee82ad049d716f9780c1d441e2c5bf76ddd516a31`. If you encounter a GAS error, run this CLI command to fund the `resource profile`:

```rust
movement account fund-with-faucet --account f63618161394bc3d5554f30ee82ad049d716f9780c1d441e2c5bf76ddd516a31 --amount 100000000
```

After funding, you can publish using this CLI command:

```rust
movement move publish --profile resource
```

or using sender account is `resource_address`

```rust
movement move publish --sender-account f63618161394bc3d5554f30ee82ad049d716f9780c1d441e2c5bf76ddd516a31
```

If successful, check the modules of the `resource addr` `f63618161394bc3d5554f30ee82ad049d716f9780c1d441e2c5bf76ddd516a31`. You should see your module, its functions, and other data and resources.

## Fullcode

```rust
module movement::mint_nft_by_resource_account {
    use std::string::{Self, String};
    use aptos_token_objects::collection;
    use aptos_token_objects::token::{Self, Token};
    use aptos_framework::resource_account;
    use aptos_framework::object;
    use std::signer;
    use std::option;

    use aptos_framework::account::{Self, SignerCapability, create_resource_account, create_signer_with_capability};

    struct ResourceInfo has key {
        source: address,
        resource_cap: SignerCapability
    }

    struct CollectionConfig has key {
        collection_name: String,
        collection_description: String,
        collection_maximum: u64,
        collection_uri: String,
        token_counter: u64,
        token_base_name: String,
        token_description: String,
    }

    const SOURCE_ADDR: address = @source_addr;

    public entry fun create_collection(
        account: &signer,
        collection_name: String,
        collection_description: String,
        collection_uri: String,
        collection_maximum: u64,
        // Token
        token_base_name: String,
        token_description: String,
        seeds: vector<u8>
    ) {
        let resource_cap_cap = resource_account::retrieve_resource_account_cap(caller, SOURCE_ADDR);
        let resource_signer = account::create_signer_with_capability(&resource_cap);
        let account_addr = signer::address_of(account);

        // Token
        move_to(&resource_signer_from_cap, ResourceInfo {
            source: account_addr,
            resource_cap: resource_cap
        });

        move_to(&resource_signer_from_cap, CollectionConfig {
            collection_name,
            collection_description,
            collection_maximum: collection_maximum,
            collection_uri,
            token_counter: 1,
            // Token
            token_base_name,
            token_description,
        });

        collection::create_fixed_collection(
            &resource_signer_from_cap,
            collection_description,
            collection_maximum,
            collection_name,
            option::none(),
            collection_uri,
        );
    }

    public entry fun mint(nft_claimer: &signer, collection_address: address, token_name: String, token_uri: String) acquires ResourceInfo, CollectionConfig {
        let nft_claimer_addr = signer::address_of(nft_claimer);

        let collection_config = borrow_global_mut<CollectionConfig>(collection_address);
        let resource_info = borrow_global_mut<ResourceInfo>(collection_address);
        let resource_signer_from_cap = account::create_signer_with_capability(&resource_info.resource_cap);

        let constructor_ref = token::create_named_token(
            &resource_signer_from_cap,
            collection_config.collection_name,
            collection_config.collection_description,
            token_name,
            option::none(),
            token_uri
        );

        let token_object = object::object_from_constructor_ref<Token>(&constructor_ref);

        object::transfer(&resource_signer_from_cap, token_object, nft_claimer_addr);
    }
}
```
