# Smart Vector

## Summary

- Smart Vector is an advanced data structure in the Aptos Framework designed to optimize data management in large-scale applications.
- It combines the strengths of vectors, simple maps, and traditional tables while mitigating their weaknesses.
- Smart Vector uses a bucket system to efficiently store and access large amounts of data, potentially reducing gas fees and improving performance.
- The structure automatically divides elements into multiple buckets, optimizing both reading and writing processes.
- Smart Vector offers a solution to performance bottlenecks often encountered when scaling applications with conventional data structures.
- Implementation involves creating a SmartVector, adding elements, and storing it within a custom struct in the account's storage.

## Overview

As you progress beyond the foundational P0 course, you'll encounter more complex data management challenges. While vectors and simple maps serve well for small-scale projects, they often fall short when handling larger datasets. To effectively scale your applications, it's crucial to adopt more advanced data structures.

One common pitfall in software development is underestimating the performance impact of data growth. As your application expands, operations that were once swift on vectors and simple maps can become significant bottlenecks, leading to increased processing time and resource consumption.

Conventional tables present an alternative strategy, offering pinpoint access to specific data elements. While this granular control can be beneficial, it's essential to weigh the storage costs associated with expanding these tables.

This is where smart tables and smart vector, a cutting-edge feature of the Aptos Framework, come into play. These sophisticated data structures are engineered to harness the strengths of vectors, simple maps, and traditional tables while mitigating their weaknesses. By leveraging smart tables & smart vector, developers can streamline data management, potentially reducing gas fees and boosting overall system performance.

## Create a Smart Vector

```ruby
module movement::smart_vector_module {
    use aptos_std::smart_vector::{Self, SmartVector};

    struct MovementObject has key {
        value: SmartVector<u64>
    }

    fun init_module(caller: &signer) {
        let smartvec = smart_vector::new<u64>();
        smart_vector::push_back(&mut smartvec, 1);
        smart_vector::push_back(&mut smartvec, 2);
        smart_vector::push_back(&mut smartvec, 3);
        move_to(caller, MovementObject {
            value: smartvec
        });
    }
}
```

1. Module Declaration:

```ruby
module movement::smart_vector_module {
    // Module contents
}
```

This declares a new module named "smart_vector_module" within the "movement" package.

1. Importing the Smart Vector:

```ruby
use aptos_std::smart_vector::{Self, SmartVector};
```

This line imports the SmartVector type and its associated functions from the Aptos standard library.

1. Defining a Custom Struct:

```ruby
struct MovementObject has key {
    value: SmartVector<u64>;
}
```

This defines a new struct called MovementObject with a SmartVector of unsigned 64-bit integers (u64) as its value.

1. Initializing the Module:

```ruby
fun init_module(caller: &signer) {
    // Function body
}
```

This function is called when the module is first published. It takes a reference to the signer (account) publishing the module.

1. Creating a New Smart Vector:

```ruby
let smartvec = smart_vector::new<u64>();
```

This creates a new SmartVector that will hold u64 values.

1. Adding Elements to the Smart Vector:

```ruby
smart_vector::push_back(&mut smartvec, 1);
smart_vector::push_back(&mut smartvec, 2);
smart_vector::push_back(&mut smartvec, 3);
```

These lines add the values 1, 2, and 3 to the end of the SmartVector.

1. Creating and Storing the MovementObject:

```ruby
move_to(caller, MovementObject {
    value: smartvec
});
```

This creates a new MovementObject with the SmartVector we just populated, and stores it in the account's storage.

## Running Test

```ruby
module movement::smart_vector_module {
    use aptos_std::smart_vector::{Self, SmartVector};
    use std::debug::print;
    use std::signer::address_of;

    struct MovementObject has key {
        value: SmartVector<u64>
    }

    fun init_module(caller: &signer) {
        let smartvec = smart_vector::new<u64>();
        smart_vector::push_back(&mut smartvec, 1);
        smart_vector::push_back(&mut smartvec, 2);
        smart_vector::push_back(&mut smartvec, 3);
        move_to(caller, MovementObject {
            value: smartvec
        });
    }

    #[test_only]
    fun test_init_module(caller: &signer) {
        init_module(caller);
    }

    #[view]
    public fun get_length(addr: address): u64 acquires MovementObject {
        let vec = &borrow_global<MovementObject>(addr).value;
        smart_vector::length(vec)
    }

    #[test(caller = @0x1)]
    fun test_get_length(caller: &signer) acquires MovementObject {
        test_init_module(caller);
        let len = get_length(address_of(caller));
        print(&len);
    }
}
```

> Running test:
> 

```rust
movement move test -f test_get_length
```

> Result:
> 

```bash
Running Move unit tests
[debug] 3
[ PASS ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::smart_vector_module::test_get_length
Test result: OK. Total tests: 1; passed: 1; failed: 0
{
  "Result": "Success"
}
```

## How Smart Vector works

If you deploy modules and create a smart vector object, you can check the account data and you'll see an object like this:

```json
{
  "0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::smart_vector_module::MovementObject": {
    "value": {
      "big_vec": {
        "vec": []
      },
      "bucket_size": {
        "vec": []
      },
      "inline_capacity": {
        "vec": []
      },
      "inline_vec": [
        "1",
        "2",
        "3"
      ]
    }
  }
}
```

Here, the smart vector stores data in `bucket`s, allowing it to hold a large number of elements while optimizing gas costs for users. Each `bucket` is a standard vector that stores the elements of the smart vector.

```rust
module movement::smart_vector_module {
    use aptos_std::smart_vector::{Self, SmartVector};
    use std::debug::print;
    use std::signer::address_of;

    struct MovementObject has key {
        value: SmartVector<u64>
    }

    fun init_module(caller: &signer) {
        let smartvec = smart_vector::new<u64>();
        let i = 0;
        while (i <= 1000) {
            smart_vector::push_back(&mut smartvec, i);
            i = i + 1;
        };
        move_to(caller, MovementObject {
            value: smartvec
        });
    }

    #[test_only]
    fun test_init_module(caller: &signer) {
        init_module(caller);
    }

    #[view]
    public fun get_length(addr: address): u64 acquires MovementObject {
        let vec = &borrow_global<MovementObject>(addr).value;
        smart_vector::length(vec)
    }

    #[test(caller = @0x1)]
    fun test_get_length(caller: &signer) acquires MovementObject {
        test_init_module(caller);
        let len = get_length(address_of(caller));
        print(&len);
    }
}
```

In the example above, I input 1000 elements using a `while loop`. When checking the result with the command `movement account list`, you'll see the following output:

```json
{
  "0x696e90758094efbf0e2e9dc7fb9fbbde6c60d479bed1b1984cf62575fc864d96::smart_vector_module::MovementObject": {
    "value": {
      "big_vec": {
        "vec": [
          {
            "bucket_size": "128",
            "buckets": {
              "inner": {
                "handle": "0xfb918a6dc3e0db1a6bef0ebdf53554f0fc759c01018c5012071fe2c4a86e8b80"
              },
              "length": "8"
            },
            "end_index": "983"
          }
        ]
      },
      "bucket_size": {
        "vec": []
      },
      "inline_capacity": {
        "vec": []
      },
      "inline_vec": [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17"
      ]
    }
  }
},
```

Here, the smart vector automatically divides elements into multiple buckets. For example, when you access elements from 0-100, it only accesses the bucket containing those specific elements. This approach optimizes both the reading and writing processes of the smart vector.

## Additional Smart Vector Functions

| Function | Parameters | Description | Return Value |
| --- | --- | --- | --- |
| `new` | None | Creates an empty SmartVector | `SmartVector<T>` |
| `empty` | None | Creates an empty SmartVector (deprecated) | `SmartVector<T>` |
| `empty_with_config` | `inline_capacity: u64`, `bucket_size: u64` | Creates an empty SmartVector with custom configuration | `SmartVector<T>` |
| `singleton` | `element: T` | Creates a SmartVector with a single element | `SmartVector<T>` |
| `destroy_empty` | `self: SmartVector<T>` | Destroys an empty SmartVector | None |
| `destroy` | `self: SmartVector<T>` | Destroys a SmartVector | None |
| `clear` | `self: &mut SmartVector<T>` | Clears all elements from a SmartVector | None |
| `borrow` | `self: &SmartVector<T>`, `i: u64` | Borrows the i-th element | `&T` |
| `borrow_mut` | `self: &mut SmartVector<T>`, `i: u64` | Mutably borrows the i-th element | `&mut T` |
| `append` | `self: &mut SmartVector<T>`, `other: SmartVector<T>` | Moves all elements from other to self | None |
| `add_all` | `self: &mut SmartVector<T>`, `vals: vector<T>` | Adds multiple values to the vector | None |
| `to_vector` | `self: &SmartVector<T>` | Converts SmartVector to a native vector | `vector<T>` |
| `push_back` | `self: &mut SmartVector<T>`, `val: T` | Adds an element to the end | None |
| `pop_back` | `self: &mut SmartVector<T>` | Removes and returns the last element | `T` |
| `remove` | `self: &mut SmartVector<T>`, `i: u64` | Removes and returns the i-th element | `T` |
| `swap_remove` | `self: &mut SmartVector<T>`, `i: u64` | Swaps the i-th element with the last and removes it | `T` |
| `swap` | `self: &mut SmartVector<T>`, `i: u64`, `j: u64` | Swaps the i-th and j-th elements | None |
| `reverse` | `self: &mut SmartVector<T>` | Reverses the order of elements | None |
| `index_of` | `self: &SmartVector<T>`, `val: &T` | Finds the index of an element | `(bool, u64)` |
| `contains` | `self: &SmartVector<T>`, `val: &T` | Checks if an element exists | `bool` |
| `length` | `self: &SmartVector<T>` | Returns the number of elements | `u64` |
| `is_empty` | `self: &SmartVector<T>` | Checks if the vector is empty | `bool` |
| `for_each` | `self: SmartVector<T>`, `f: \|T\|` | Applies a function to each element, consuming the vector | None |
| `for_each_reverse` | `self: SmartVector<T>`, `f: \|T\|` | Applies a function to each element in reverse order, consuming the vector | None |
| `for_each_ref` | `self: &SmartVector<T>`, `f: \|&T\|` | Applies a function to a reference of each element | None |
| `for_each_mut` | `self: &mut SmartVector<T>`, `f: \|&mut T\|` | Applies a function to a mutable reference of each element | None |
| `enumerate_ref` | `self: &SmartVector<T>`, `f: \|(u64, &T)\|` | Applies a function to each element with its index | None |
| `enumerate_mut` | `self: &mut SmartVector<T>`, `f: \|(u64, &mut T)\|` | Applies a function to each mutable element with its index | None |
| `fold` | `self: SmartVector<T>`, `init: Accumulator`, `f: \|(Accumulator, T)\|Accumulator` | Folds the vector into an accumulated value | `Accumulator` |
| `foldr` | `self: SmartVector<T>`, `init: Accumulator`, `f: \|(T, Accumulator)\|Accumulator` | Folds the vector in reverse order into an accumulated value | `Accumulator` |
| `map_ref` | `self: &SmartVector<T1>`, `f: \|&T1\|T2` | Maps a function over references of the elements | `SmartVector<T2>` |
| `map` | `self: SmartVector<T1>`, `f: \|T1\|T2` | Maps a function over the elements | `SmartVector<T2>` |
| `filter` | `self: SmartVector<T>`, `p: \|&T\|bool` | Filters elements based on a predicate | `SmartVector<T>` |
| `zip` | `self: SmartVector<T1>`, `v2: SmartVector<T2>`, `f: \|(T1, T2)\|` | Zips two SmartVectors and applies a function to each pair | None |
| `zip_reverse` | `self: SmartVector<T1>`, `v2: SmartVector<T2>`, `f: \|(T1, T2)\|` | Zips two SmartVectors in reverse and applies a function to each pair | None |
| `zip_ref` | `self: &SmartVector<T1>`, `v2: &SmartVector<T2>`, `f: \|(&T1, &T2)\|` | Zips references of two SmartVectors and applies a function to each pair | None |
| `zip_mut` | `self: &mut SmartVector<T1>`, `v2: &mut SmartVector<T2>`, `f: \|(&mut T1, &mut T2)\|` | Zips mutable references of two SmartVectors and applies a function to each pair | None |
| `zip_map` | `self: SmartVector<T1>`, `v2: SmartVector<T2>`, `f: \|(T1, T2)\|NewT` | Zips two SmartVectors and maps a function over the pairs | `SmartVector<NewT>` |
| `zip_map_ref` | `self: &SmartVector<T1>`, `v2: &SmartVector<T2>`, `f: \|(&T1, &T2)\|NewT` | Zips references of two SmartVectors and maps a function over the pairs | `SmartVector<NewT>` |