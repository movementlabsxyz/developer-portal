# Map (Simple Map)

## Overview

`0x1::simple_map`

This module provides a solution for map features. Maps will have the following characteristics:

- Keys point to Values: Each key is associated with a value.
- Each key must be unique: No two keys are duplicated.
- A Key can be found within O(Log N) time
- Data is stored in order sorted by Key: Elements in maps are arranged based on the key.
- Adding and removing elements takes O(N) time: The time to add or remove an element is proportional to the number of elements in the map.

## Example:

The code below demonstrates the usage of a SimpleMap in the Move programming language:

1. It defines a module called `SimpleMapType` within the `movement` module.
2. The module imports necessary dependencies: `SimpleMap` from the `simple_map` module, `print` from the `debug` module, and `signer` from the standard library.
3. A function `map_in_move` is defined that takes a signer reference as an argument and returns a `SimpleMap` with address keys and u64 values.
4. Inside `map_in_move`, a new SimpleMap is created using `simple_map::create()`.
5. An element is added to the map using `simple_map::add()`, where the key is the signer's address and the value is 10.
6. The function returns the created map.
7. A test function `test_map_in_move` is defined using the `#[test]` attribute. It calls `map_in_move` and prints the resulting map.

This example showcases how to create, populate, and use a SimpleMap in Move, demonstrating its basic operations and integration with other Move concepts like signers and testing.

```rust
module movement::simple_map_module {
    use std::simple_map::{SimpleMap, Self};
    use std::debug::print;
    use std::signer;

    fun map_in_move(sign: &signer): SimpleMap<address, u64> {
        let mp: SimpleMap<address, u64> = simple_map::create();

        simple_map::add(&mut mp, signer::address_of(sign), 10);
        return mp
    }

    #[test(account = @0x1)]
    fun test_map_in_move(account: &signer) {
        let map = map_in_move(account);
        print(&map);
    }
}
```

> Running test:
> 

```rust
movement move test -f test_map_in_move
```

> Result:
> 

```rust
Running Move unit tests
[debug] 0x1::simple_map::SimpleMap<address, u64> {
  data: [
    0x1::simple_map::Element<address, u64> {
      key: @0x1,
      value: 10
    }
  ]
}
[ PASS    ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::simple_map_module::test_map_in_move
Test result: OK. Total tests: 1; passed: 1; failed: 0
{
  "Result": "Success"
}
```

## Additional SimpleMap Functions

| **Function** | **Description** | **Return Value** |
| --- | --- | --- |
| `length` | Gets the number of elements | `u64` |
| `new` | Creates an empty SimpleMap | `SimpleMap<K, V>` |
| `new_from` | Creates from key-value vectors | `SimpleMap<K, V>` |
| `create` | Deprecated alias for`new` | `SimpleMap<K, V>` |
| `borrow` | Borrows a value by key | `&V` |
| `borrow_mut` | Mutably borrows a value by key | `&mut V` |
| `contains_key` | Checks for key existence | `bool` |
| `destroy_empty` | Destroys an empty map | None |
| `add` | Adds a key-value pair | None |
| `add_all` | Adds multiple key-value pairs | None |
| `upsert` | Inserts or updates a pair | None |
| `keys` | Gets all keys | `vector<K>` |
| `values` | Gets all values | `vector<V>` |
| `to_vec_pair` | Converts to key-value vectors | `(vector<K, V>)` |
| `destroy` | Destroys map with lambdas | None |
| `remove` | Removes and returns a pair | `(K, V)` |
| `find` | Finds key index (internal) | `Option<u64>` |