# Smart Tables

## Summary

- Smart Table is a data structure in Move that stores data in multiple buckets for efficient access and gas optimization.
- It operates similarly to Smart Vector, improving speed and cost-efficiency in data management.
- The module demonstrates how to initialize, update, and retrieve data from a SmartTable.
- The code includes test functions to verify the correct operation of SmartTable operations.
- SmartTable uses address as keys and u64 as values in this example, suitable for tracking user points or balances.

## Overview

Similar to `Smart Vector`, which we explored in the previous article, `Smart Table` operates on the same principle. Smart Table's data is divided into multiple `bucket`s for storage. Accessing, writing, and reading data in `Smart Table` occurs independently within each `bucket` containing that data. This organization improves speed and cost-efficiency while optimizing gas usage for users.

## Example

```rust
module movement::smart_table_module {
    use aptos_std::smart_table::{Self, SmartTable};

    struct MovementTableObject has key {
        value: SmartTable<address, u64>
    }

    fun init_module(caller: &signer) {
        let val = smart_table::new<address, u64>();
        smart_table::add(&mut val, address_of(caller), 0);
        move_to(caller, MovementTableObject {
            value: val
        });
    }
}
```

Let's break down the code and explain each function step-by-step:

### 1. Module Declaration

```rust
module movement::smart_table_module {
    // Module contents
}
```

This declares a new module named "smart_table_module" under the "movement" address.

### 2. Importing Required Modules

```rust
use aptos_std::smart_table::{Self, SmartTable};
```

This imports the SmartTable type and its associated functions from the aptos_std library.

### 3. Defining a Custom Struct

```rust
struct MovementTableObject has key {
    value: SmartTable<address, u64>
}
```

This defines a new struct called MovementTableObject that contains a SmartTable. The SmartTable uses address as keys and u64 as values.

### 4. Initialization Function

```rust
fun init_module(caller: &signer) {
    // Function body
}
```

This function is called when the module is published. It takes a reference to the signer (the account publishing the module) as an argument.

### 5. Creating a New SmartTable

```rust
let val = smart_table::new<address, u64>();
```

This creates a new SmartTable that uses address as keys and u64 as values.

### 6. Adding an Initial Entry

```rust
smart_table::add(&mut val, address_of(caller), 0);
```

This adds an initial entry to the SmartTable. The key is the address of the caller, and the value is 0.

### 7. Moving the SmartTable to Storage

```rust
move_to(caller, MovementTableObject {
    value: val
});
```

This creates a new MovementTableObject with the SmartTable we just created and moves it to the storage of the caller's account.

This initialization sets up a SmartTable in the caller's account, ready to be used for storing and managing data efficiently.

## Full Example

```rust
module movement::smart_table_module {
    use aptos_std::smart_table::{Self, SmartTable};
    use std::debug::print;
    use std::signer::address_of;

    struct MovementTableObject has key {
        value: SmartTable<address, u64>
    }

    fun init_module(caller: &signer) {
        let val = smart_table::new<address, u64>();
        smart_table::add(&mut val, address_of(caller), 0);
        move_to(caller, MovementTableObject {
            value: val
        });
    }

    #[test_only]
    fun test_init_module(caller: &signer) {
        init_module(caller);
    }

    #[view]
    fun get_amount_point(addr: address): u64 acquires MovementTableObject {
        let table = &borrow_global<MovementTableObject>(addr).value;
        *smart_table::borrow(table, addr)
    }

    fun plus_point(addr: address, value: u64) acquires MovementTableObject {
        let table = &mut borrow_global_mut<MovementTableObject>(addr).value;
        let point = *smart_table::borrow_mut(table, addr);
        point = point + value;
        smart_table::upsert(table, addr, point);
    }

    #[test(caller = @0x1)]
    fun test_get_amount_point(caller: &signer) acquires MovementTableObject {
        test_init_module(caller);
        let amount = get_amount_point(address_of(caller));
        print(&amount);
    }

    #[test(caller = @0x1)]
    fun test_plus_amount_point(caller: &signer) acquires MovementTableObject {
        test_init_module(caller);
        plus_point(address_of(caller), 10);
        let amount = get_amount_point(address_of(caller));
        print(&amount);
    }
}
```

### 1. init_module(caller: &signer)

This function initializes the module when it's published:

- Create a new SmartTable using `smart_table::new&lt;address, u64&gt;()`
- Add an initial entry to the table with the caller's address as the key and 0 as the value
- Create a new MovementTableObject with the SmartTable and move it to the caller's storage

### 2. test_init_module(caller: &signer)

This is a test-only function that calls init_module:

- It's annotated with `#[test_only]`, meaning it's only used for testing
- It simply calls the init_module function with the provided caller

### 3. get_amount_point(addr: address): u64

This function retrieves the point amount for a given address:

- It's annotated with `#[view]`, indicating it's a read-only function
- Borrow the SmartTable from the MovementTableObject stored at the given address
- Use `smart_table::borrow` to get the value associated with the address
- Return the borrowed value (point amount)

### 4. plus_point(addr: address, value: u64)

This function adds points to a given address:

- Borrow the SmartTable mutably from the MovementTableObject
- Get the current point value for the address using `smart_table::borrow_mut`
- Add the new value to the current point
- Update the SmartTable with the new point value using `smart_table::upsert`

### 5. test_get_amount_point(caller: &signer)

This is a test function for get_amount_point:

- It's annotated with `#[test(caller = @0x1)]`, setting up a test environment
- Call test_init_module to set up the initial state
- Call get_amount_point with the caller's address
- Print the retrieved amount

### 6. test_plus_amount_point(caller: &signer)

This is a test function for plus_point:

- It's also annotated with `#[test(caller = @0x1)]`
- Call test_init_module to set up the initial state
- Call plus_point to add 10 points to the caller's address
- Call get_amount_point to retrieve the updated point amount
- Print the new amount

These functions demonstrate how to initialize, update, and retrieve data from a SmartTable, as well as how to set up tests for these operations.

## Running Test

> Running test:
> 

```rust
movement move test -f smart_table_module
```

> Result:
> 

```bash
Running Move unit tests
[debug] 0
[ PASS    ] 0x696e90758094efbf0e2e9dc7fb9fbbde6c60d479bed1b1984cf62575fc864d96::smart_table_module::test_get_amount_point
[debug] 10
[ PASS    ] 0x696e90758094efbf0e2e9dc7fb9fbbde6c60d479bed1b1984cf62575fc864d96::smart_table_module::test_plus_amount_point
Test result: OK. Total tests: 2; passed: 2; failed: 0
{
  "Result": "Success"
}
```

## Additional SimpleMap Functions



| Function | Parameters | Description | Return Value |
| -------- | --------- | ----------- | ------------ |
| `new` | None | Creates an empty SmartTable with default configurations | `SmartTable<K, V>` |
| `new_with_config` | `num_initial_buckets: u64`  `split_load_threshold: u8`  `target_bucket_size: u64` | Creates an empty SmartTable with customized configurations | `SmartTable<K, V>` |
| `destroy_empty` | `self: SmartTable<K, V>` | Destroys an empty table | None |
| `destroy` | `self: SmartTable<K, V>` | Destroys a table completely when T has drop | None |
| `clear` | `self: &mut SmartTable<K, V>` | Clears a table completely when T has drop | None |
| `add` | `self: &mut SmartTable<K, V>`  `key: K`  `value: V` | Adds a key-value pair to the table | None |
| `add_all` | `self: &mut SmartTable<K, V>`  `keys: vector<K>`  `values: vector<V>` | Adds multiple key-value pairs to the table | None |
| `unzip_entries` | `entries: &vector<Entry<K, V>>` | Unzips entries into separate key and value vectors | `(vector<K>, vector<V>)` |
| `to_simple_map` | `self: &SmartTable<K, V>` | Converts a smart table to a simple_map | `SimpleMap<K, V>` |
| `keys` | `self: &SmartTable<K, V>` | Gets all keys in a smart table | `vector<K>` |
| `keys_paginated` | `self: &SmartTable<K, V>`  `starting_bucket_index: u64`  `num_keys_to_get: u64` | Gets keys from a smart table, paginated | `(vector<K>, Option<u64>)` |
| `split_one_bucket` | `self: &mut SmartTable<K, V>` | Splits one bucket into two | None |
| `bucket_index` | `level: u8`  `num_buckets: u64`  `hash: u64` | Returns the expected bucket index for a hash | `u64` |
| `borrow` | `self: &SmartTable<K, V>`  `key: K` | Borrows an immutable reference to the value associated with the key | `&V` |
| `borrow_with_default` | `self: &SmartTable<K, V>`  `key: K`  `default: &V` | Borrows an immutable reference to the value, or returns the default if key not found | `&V` |
| `borrow_mut` | `self: &mut SmartTable<K, V>`  `key: K` | Borrows a mutable reference to the value associated with the key | `&mut V` |
| `borrow_mut_with_default` | `self: &mut SmartTable<K, V>`  `key: K`  `default: V` | Borrows a mutable reference to the value, or inserts and returns default if key not found | `&mut V` |
| `contains` | `self: &SmartTable<K, V>`  `key: K` | Checks if the table contains a key | `bool` |
| `remove` | `self: &mut SmartTable<K, V>`  `key: K` | Removes and returns the value associated with the key | `V` |
| `upsert` | `self: &mut SmartTable<K, V>`  `key: K`  `value: V` | Inserts a key-value pair or updates an existing one | None |
| `length` | `self: &SmartTable<K, V>` | Returns the number of entries in the table | `u64` |
| `load_factor` | `self: &SmartTable<K, V>` | Returns the load factor of the hashtable | `u64` |
| `update_split_load_threshold` | `self: &mut SmartTable<K, V>`  `split_load_threshold: u8` | Updates the split load threshold | None |
| `update_target_bucket_size` | `self: &mut SmartTable<K, V>`  `target_bucket_size: u64` | Updates the target bucket size | None |
| `for_each_ref` | `self: &SmartTable<K, V>`  `f: \|&K, &V\|` | Applies a function to a reference of each key-value pair | None |
| `for_each_mut` | `self: &mut SmartTable<K, V>`  `f: \|&K, &mut V\|` | Applies a function to a mutable reference of each key-value pair | None |
| `map_ref` | `self: &SmartTable<K, V1>`  `f: \|&V1\|V2` | Maps a function over the values, producing a new SmartTable | `SmartTable<K, V2>` |
| `any` | `self: &SmartTable<K, V>`  `p: \|&K, &V\|bool` | Checks if any key-value pair satisfies the predicate | `bool` |
| `borrow_kv` | `self: &Entry<K, V>` | Borrows references to the key and value of an entry | `(&K, &V)` |
| `borrow_kv_mut` | `self: &mut Entry<K, V>` | Borrows mutable references to the key and value of an entry | `(&mut K, &mut V)` |
| `num_buckets` | `self: &SmartTable<K, V>` | Returns the number of buckets in the table | `u64` |
| `borrow_buckets` | `self: &SmartTable<K, V>` | Borrows a reference to the buckets of the table | `&TableWithLength<u64, vector<Entry<K, V>>>` |
| `borrow_buckets_mut` | `self: &mut SmartTable<K, V>` | Borrows a mutable reference to the buckets of the table | `&mut TableWithLength<u64, vector<Entry<K, V>>>` |