# Local Storage & Global Storage Operations

<aside>
💡

## Summary

- Move is a Resource-Oriented Programming language focusing on resources rather than accounts
- Local storage uses the `let` keyword for variables with limited scope and lifespan
- Global storage provides persistent data storage on the blockchain using a tree-like structure
- Global storage operations include `move_to`, `move_from`, `borrow_global`, `borrow_global_mut`, and `exists`
- Resources in global storage require the `key` ability and must be owned by an address
- The `drop` ability allows resources to be removed from global storage
- Move programs can read from and write to global storage, but cannot access external resources
</aside>

## Overview

Move is a Resource-Oriented Programming (`ROP`) language, where the entire system centers around resources instead of accounts as in many traditional blockchains, also known as `Resource-Centric`.

In the topic below, we will explore how Global Storage and Local Storage work in Move, and how you can create data stored in these two storage types.

## Local Storage ( Local Variable )

In Move, local variables operate within a specific scope and have a limited lifespan. They are declared using the `let` keyword and possess unique characteristics:

- Scope: Variables are confined to the block where they are defined
- Shadowing: New declarations can overshadow existing variables with the same name
- Mutability: Values can be modified directly or through mutable references
- Flexibility: They can hold various data types, from simple integers to complex structures

```bash
module movement::local_storage {
    fun local_variables(){
        let b: u8;
        let c = false;
        let d = b"hello world";
        let e: u64 = 10_000;
    }
}
```

All the variables mentioned above are created within the `local_variables` function. As a result, they only exist within the function's scope. When this function ends, all variables within it will be `dropped`.

Additionally, we can create resources and structs as local storage through a struct ability in `move` called "drop". This ability allows the struct or resource to be dropped after the function ends, aligning with the characteristics of local variables you've read about above.

For example:

```rust
module movement::local_global_storage {
    use std::debug::print;
    use std::signer;

    struct LocalData has drop {
        value: u64
    }

    public entry fun new_local(value: u64) {
        let data = LocalData {
            value: value
        };
        let local_var = b"Local Storage Data";
        print(&data);
        print(&local_var);
    }

    #[test]
    fun test_new_local() {
        new_local(10);
    }
}
```

In the `new_local` function, you can see that after the `LocalData` resource is created, it's not owned by anyone and isn't transferred anywhere. This means that when the new_local function ends, `LocalData` will be dropped. For the Move compiler to allow this, `LocalData` must have the `drop` ability and must not have the `key` ability.

### Global Storage

**Global storage in Move:**

- Enables persistent data storage on the blockchain
- Maintains long-term data accessibility across transactions and contracts
- Uses a tree-like structure for efficient organization and retrieval
- Key-value pairing system for precise data management

**Move programs interact with global storage by:**

1. Reading existing data
2. Writing new or updated information

**Limitations:**

- Cannot access external resources (e.g., filesystems, networks)
- Ensures data manipulations occur within the blockchain's controlled environment
- Maintains security and consistency across the system

```rust
struct GlobalStorage {
  resources: Map<(address, ResourceType), ResourceValue>
  modules: Map<(address, ModuleName), ModuleBytecode>
}
```

Let's examine the example below for a clearer understanding:

```rust
module movement::local_global_storage {
    use std::debug::print;

    struct GlobalData has key {
        value: u64
    }

    public entry fun new_global(signer: &signer, value: u64) {
        let data = GlobalData {
            value: value
        } ;
        move_to(signer, data);
    }

    #[test(account = @0x1)]
    fun test_new_global(account: &signer) {
        new_global(account, 10);
    }
}
```

In the code above, after initializing `GlobalData` and storing it in a variable called data, if you stop here, the compiler will throw an error when you build. This is because `GlobalData` contains the `key` ability. Consequently, this data needs to be stored in global storage. However, to store it in global storage, you must assign this Resource an owner in the form of a Map. In this case, we'll store it under the signer who called this function. The result of the function will create a resource and transfer it to the address of the caller.

Here's the `GlobalStorage` data after you initialize it using the `new_global` function:

```json
{
  "0x40264b8d01986e70c79999a189e4c4043aad3ec970d00a095cf29b2916eda04d::local_global_storage::GlobalData": {
    "value": "10"
  }
}
```

For global data, you can only access it through these native functions provided by Move:

| Operation | Description | Aborts? |
| --- | --- | --- |
| `move_to<T>(&signer,T)` | Publish `T` under `signer.address` | If `signer.address` already holds a `T` |
| `move_from<T>(address): T` | Remove `T` from `address` and return it | If `address` does not hold a `T` |
| `borrow_global_mut<T>(address): &mut T` | Return a mutable reference to the `T` stored under `address` | If `address` does not hold a `T` |
| `borrow_global<T>(address): &T` | Return an immutable reference to the `T` stored under `address` | If `address` does not hold a `T` |
| `exists<T>(address): bool` | Return `true` if a `T` is stored under `address` | Never |

### Example Code:

```ruby
module movement::local_global_storage {
    use std::debug::print;
    use std::signer::address_of;

    struct GlobalData has key {
        value: u64
    }

    const EResourceNotExist: u64 = 33;

    public entry fun new_global(signer: &signer, value: u64) {
        let data = GlobalData {
            value: value
        } ;
        move_to(signer, data);
    }

    public entry fun change_value_from_global_storage(signer: &signer, value: u64) acquires GlobalData {
        let addr = address_of(signer);
        if (!check_global_storage_exists(addr)) {
            abort EResourceNotExist
        };

        let value_reference = &mut borrow_global_mut<GlobalData>(addr).value;
        *value_reference = *value_reference + value;
    }

    public fun check_global_storage_exists(addr: address): bool {
        exists<GlobalData>(addr)
    }

    #[view]
    public fun get_value_from_global_storage(addr: address): u64 acquires GlobalData {
        if (!check_global_storage_exists(addr)) {
            abort EResourceNotExist
        };
        let value_reference = borrow_global<GlobalData>(addr);
        value_reference.value
    }

    #[test(account = @0x1)]
    fun test_new_global(account: &signer) {
        new_global(account, 10);
    }
}
```

### Delete Resource

The `move_from` function is a crucial part of resource management in Move. It allows for the removal of a resource from an account or address. However, there's an important caveat: the resource must have the "drop" ability to be used with `move_from`. This requirement serves as a safety mechanism, preventing accidental or unauthorized deletion of resources.

Key points to understand:

- Resources without the "drop" ability cannot be removed, ensuring their permanence.
- This feature gives developers fine-grained control over resource lifecycle management.
- It's particularly useful for creating persistent resources that should remain intact throughout a contract's lifetime.

By implementing this safeguard, Move enhances the security and predictability of smart contracts, allowing developers to design more robust and controlled resource management systems.

1. Drop Ability

```rust
struct GlobalData has key, drop {
    value: u64
}
```

1. move_from

```ruby
public entry fun remove_resource_from_global_storage(account: &signer) acquires GlobalData {
    let rev = move_from<GlobalData>(address_of(account));
}
```

### Full Code

```ruby
module movement::local_global_storage {
    use std::debug::print;
    use std::signer::address_of;

    struct GlobalData has key, drop {
        value: u64
    }

    const EResourceNotExist: u64 = 33;
    const ENotEqual: u64 = 10;

    public entry fun new_global(signer: &signer, value: u64) {
        let data = GlobalData {
            value: value
        } ;
        move_to(signer, data);
    }

    public entry fun change_value_from_global_storage(signer: &signer, value: u64) acquires GlobalData {
        let addr = address_of(signer);
        if (!check_global_storage_exists(addr)) {
            abort EResourceNotExist
        };

        let value_reference = &mut borrow_global_mut<GlobalData>(addr).value;
        *value_reference = *value_reference + value;
    }

    public fun check_global_storage_exists(addr: address): bool {
        exists<GlobalData>(addr)
    }

    #[view]
    public fun get_value_from_global_storage(addr: address): u64 acquires GlobalData {
        if (!check_global_storage_exists(addr)) {
            abort EResourceNotExist
        };
        let value_reference = borrow_global<GlobalData>(addr);
        print(&value_reference.value);
        value_reference.value
    }

    public entry fun remove_resource_from_global_storage(account: &signer) acquires GlobalData {
        let rev = move_from<GlobalData>(address_of(account));
    }

    #[test(account = @0x1)]
    fun test_new_global(account: &signer) {
        new_global(account, 10);
    }

    #[test(account = @0x1)]
    fun test_change_value_global(account: &signer) acquires GlobalData {
        new_global(account, 10);
        change_value_from_global_storage(account, 10); // value should be equal 20
        let value = get_value_from_global_storage(address_of(account));
        assert!(value == 20, ENotEqual);
        // remove resource
        remove_resource_from_global_storage(account);
        assert!(!check_global_storage_exists(address_of(account)), EResourceNotExist);
    }
}
```

> Running test:
> 

```rust
movement move test -f local_global_storage
```

> Result:
> 

```rust
Running Move unit tests
[debug] 20
[ PASS    ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::local_global_storage::test_change_value_global
[ PASS    ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::local_global_storage::test_new_globalTest result: OK. Total tests: 2; passed: 2; failed: 0
{
  "Result": "Success"
}
```

## Understanding the 'acquires' Keyword in Move

The 'acquires' keyword in Move is an important concept related to global storage operations. Here's what you need to know about it:

### Purpose of 'acquires'

The 'acquires' keyword is used to declare that a function may access (or "acquire") a specific resource from global storage. It's a way of explicitly stating which global resources a function intends to use.

### How it Works

1. Declaration: When you define a function that needs to access a global resource, you add 'acquires' followed by the resource type after the function signature.
2. Compiler Check: The Move compiler uses this information to ensure that the function only accesses the declared resources, preventing unintended access to other global resources.
3. Safety: It helps in preventing race conditions and ensures safe concurrent execution of transactions.

### Example Usage

```rust
public fun read_global_data(addr: address): u64 acquires GlobalData {
    borrow_global<GlobalData>(addr).value
}
```

In this example, the function declares that it will acquire the 'GlobalData' resource from global storage.

### Important Notes

- Multiple Resources: A function can acquire multiple resources by listing them after 'acquires', separated by commas.
- Nested Calls: If a function calls another function that acquires a resource, the calling function must also declare that it acquires that resource.
- Compiler Enforcement: The Move compiler will throw an error if a function tries to access a global resource without declaring it with 'acquires'.

By using 'acquires', Move provides a clear and safe way to manage access to global storage, enhancing the security and predictability of smart contracts.