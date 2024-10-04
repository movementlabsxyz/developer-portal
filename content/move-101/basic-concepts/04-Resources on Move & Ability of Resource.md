# Resources on Move & Ability of Resource

## Movement modules

In Move, code is structured into modules, which are then deployed on the Movement blockchain. These modules serve as the building blocks of smart contracts, allowing users to interact with them by executing their functions through transactions. Modules are bundled together into packages, and when developers deploy their code, they upload an entire package to the blockchain at once. This package can contain one or multiple modules. To keep things straightforward in this course, we'll focus on working with a package that consists of just one module.

```rust
module 0xAddress::module_name {

}
```

Every Move module is uniquely identified by combining its deployment address and module name. The complete identifier is structured as `<address>::<module_name>`. Typically, the module name follows `snake_case` convention. For demonstration purposes, we use 0xcafe as the address in our examples. However, it's important to note that when you deploy a module to the blockchain, you'll need to use an address for which you possess the private key. We'll explore this concept in more detail that later.

## Resources & Struct Abilities

In Move, Resources are represented as structs if they have key attributes. All data is stored in global storage. For now, take a look at the simple example below:

```rust
module 0xAddress::module_name {
    // All structures that are saved to global storage must include the key attribute
    struct ResourceName has key {
        data: u64,
        store_abilitiy: ResourceAbilities
    }

    // Value can be stored in global storage or other resouces
    struct ResourceAbilities has key, store, copy, drop {
        data: u64
    }
}
```

- `key`: Value can be used as a key for global storage operations.
- `copy`: Value can be copied (or duplicated by value).
- `drop`: Value can be deleted when the scope ends.
- `store`: Value can be stored in global storage or other resources

## Initializing and Transferring Resources

Now that we have defined a Resource, we will define it as an NFT to demonstrate what you have done. When initializing a Resource, you cannot initialize default values right from the start; instead, you will do this through a function.

```rust
module 0xAddress::module_name {
    use std::signer;

    // All structures that are saved to global storage must include the key attribute
    struct ResourceName has key {
        data: u64,
    }

    fun create_resource(owner: &signer, new_data: u64) {
        move_to(owner, ResourceName{
            data: new_data
        });
    }
}
```

All resources in Move need an address for storage; this address can be a user address or an object address (which will be discussed later). The init_module function initializes a new resource and then transfers it to the signer (this is a special data type in Move that will be explained in more detail later). Essentially, it moves this resource to a specific address for ownership and storage.

## Start Code

### Step 1: Initialize move file

Create a move file in the sources folder, and use the code above.

```rust
module movement::movement_module {
    use std::signer;

    struct ResourceName has key {
        data: u64
    }

    public entry fun create_resource(owner: &signer, new_data: u64) {
        move_to(owner, ResourceName{
            data: new_data
        });
    }
}
```

### Step 2: Configuration Move.toml

Edit the Move.toml file as shown below

```yaml
[package] # Includes packages metadata such as name version
name = "hello_blockchain" # Name of project
version = "1.0.0"
authors = []
# Optional
license = ""

[addresses]
movement = "0x{YOUR_ACCOUNT_ADDRESS}"
# movement = "0xefa4efe7f14204d86966070b5cc388498116bf6ef86485a54c3b5dae7502e0f5"

[dev-addresses]

[dependencies.AptosFramework]
git = "<https://github.com/aptos-labs/aptos-core.git>"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

[dev-dependencies]

```

> Use `YOUR_ACCOUNT_ADDRESS` as the account to store modules, specifically the MovementModule in the example above
> 

### Step 3: Build the Contract

```bash
movement move build
```

```json
{
  "Result": [
    "efa4efe7f14204d86966070b5cc388498116bf6ef86485a54c3b5dae7502e0f5::movement_module"
  ]
}

```

### Step 4: Publish & Create a Rosource

After completing the contract build and initializing the modules, you can use the CLI to call the functions in the module as shown below with the structure `address::module_name::function_name`

```bash
aptos move publish
```

```bash
aptos move run --function-id 'default::movement_module::create_resource' --args u64:50
```