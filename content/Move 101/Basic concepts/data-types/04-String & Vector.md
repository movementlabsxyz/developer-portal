# String & Vector

## Summary

- Move's primary collection type is `vector`<T>, a homogeneous, expandable/shrinkable collection of T values.
- Vectors can be initialized with any data type, including primitive types, custom types, and nested vectors.
- Key vector operations include adding elements, accessing by index, and removing elements.
- Vector behavior depends on the capabilities of its element type T, especially for destruction and copying.
- Move provides various built-in functions for vector manipulation, such as `push_back`, `pop_back`, and `borrow`.
- Strings in Move are represented as `vector<u8>`, with utility functions for conversion and manipulation.

This document covers the fundamentals of working with vectors and strings in Move, including creation, manipulation, and common operations.

## Vector Overview

- `vector<T>` is the only collection type provided by Move. A `vector<T>` is a homogeneous collection of T values that can be expanded or shrunk by adding/removing values from its "end".
- A `vector<T>` can be initialized with any data type as T. For example, `vector<u8>`, `vector<address>`, `vector<0x42::MovementModule::ResourceType>`, and `vector<vector<u8>>`

```rust
let byte_string_example: vector<u8> = b"Hello world"; //Byte strings are quoted string literals prefixed by a b
let hex_string_example: vector<u8> = x"48656c6c6f20776f726c64"; //Hex strings are quoted string literals prefixed by a x
```

### Add value into vector

The following code demonstrates how to add a value to the end of a vector in Move:

- The function `add_last_vec` takes a `u64` number as input and returns a `vector<u64>`.
- It creates an empty vector using `vector::empty<u64>()`.
- The `vector::push_back` function is used to add the input number to the end of the vector.
- The `test_add_last_vec` function demonstrates how to use this function and print the resulting vector.

This example showcases basic vector operations in Move, including creation, adding elements, and returning a vector from a function.

```rust
module movement::vector_type {
    use std::vector;
    use std::debug::print;

    fun add_last_vec(number: u64): vector<u64> {
        let list = vector::empty<u64>();

        vector::push_back(&mut list, number);
        return list
    }

    #[test]
    fun test_add_last_vec() {
        let vec = add_last_vec(500);
        print(&vec);
    }
}
```

```rust
vector::push_back(&mut list, number);
```

Here's a breakdown of the arguments:

1. `&mut list`:
    - This is the first argument to `push_back`.
    - The `&mut` indicates a mutable reference to `list`.
    - Mutable references allow the function to modify the original vector.
    - Using `&mut` is necessary because adding an element changes the vector's contents.
2. `number`:
    - This is the second argument to `push_back`.
    - It's the value being added to the end of the vector. The type depends on the vector created earlier.
    - In this case, it's the `u64` value passed into the `add_last_vec` function.

> Running test:
> 

```rust
movement move test -f vector_type
```

> Result:
> 

```rust
Running Move unit tests
[debug] [ 500 ]
[ PASS ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::vector_type::test_add_last_vec
Test result: OK. Total tests: 1; passed: 1; failed: 0
{
  "Result": "Success"
}
```

### Get Value in vector by index

The following code demonstrates how to retrieve a value from a vector by its index in Move:

- The function `get_value_by_index_vec` takes a `u64` index as input and returns a `u64` value.
- It creates a vector and populates it with three values: 10, 20, and 30.
- The `vector::borrow` function is used to access the element at the specified index. The `*` operator dereferences the borrowed value.
- The `test_get_value_by_index_vec` function demonstrates how to use this function to retrieve and print a value from the vector.

This example illustrates how to access elements in a vector by their index, which is a fundamental operation when working with vectors in Move.

```rust
module movement::vector_type {
    use std::vector;
    use std::debug::print;

    fun get_value_by_index_vec(index: u64): u64 {
        let list = vector::empty<u64>();

        vector::push_back(&mut list, 10);
        vector::push_back(&mut list, 20);
        vector::push_back(&mut list, 30);
        return *vector::borrow(&list, index)
    }

    #[test]
    fun test_get_value_by_index_vec() {
        let value = get_value_by_index_vec(1);
        print(&value);
    }
}
```

> Running test:
> 

```rust
movement move test -f test_get_value_by_index_vec
```

> Result:
> 

```rust
Running Move unit tests
[debug] 20
[ PASS ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::vector_type::test_get_value_by_index_vec
Test result: OK. Total tests: 1; passed: 1; failed: 0
{
  "Result": "Success"
}
```

### Take last value from vector

The following code demonstrates how to remove and return the last value from a vector in Move:

- The function `take_last_value_in_vec` creates a vector with three elements: 10, 20, and 30.
- It uses `vector::pop_back` to remove and return the last element (30) from the vector.
- The function returns a tuple containing the modified vector and the removed value.
- The `test_take_last_value_in_vec` function shows how to use this function and print both the resulting vector and the removed value.

This example illustrates how to manipulate vectors by removing elements, which is a common operation when working with dynamic collections in Move.

```rust
module movement::vector_type {
    use std::vector;
    use std::debug::print;
    
    fun take_last_value_in_vec(): (vector<u64>, u64) {
        let list = vector::empty<u64>();

        vector::push_back(&mut list, 10);
        vector::push_back(&mut list, 20);
        vector::push_back(&mut list, 30);
        let take_value: u64 = vector::pop_back(&mut list);
        return (list, take_value)
    }

    #[test]
    fun test_take_last_value_in_vec() {
        let (list, take_value) = take_last_value_in_vec();
        print(&list);
        print(&take_value);
    }
}
```

> Running test:
> 

```rust
movement move test -f test_take_last_value_in_vec
```

> Result:
> 

```rust
Running Move unit tests
[debug] [ 10, 20 ]
[debug] 30
[ PASS    ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::vector_type::test_take_last_value_in_vec
Test result: OK. Total tests: 1; passed: 1; failed: 0
{
  "Result": "Success"
}
```

### Destroying and Copying Vectors

- Some behaviors of `vector<T>` depend on the capabilities of the element type `T`. For instance, vectors containing elements that can't be dropped can't be implicitly discarded like `v` in the example above. Instead, they must be explicitly destroyed using `vector::destroy_empty`.

Note: `vector::destroy_empty` will trigger a runtime error if the vector is empty (contains zero elements).

```rust
fun destroy_any_vector<T>(vec: vector<T>) {
    vector::destroy_empty(vec) // deleting this line will cause a compiler error
}
```

- Example:

```rust
module movement::vector_type {
    use std::vector;
    use std::debug::print;

    struct DropVector has drop {
        data: u64
    }

    fun add_last_vec(number: u64): vector<DropVector> {
        let list = vector::empty<DropVector>();

        vector::push_back(&mut list, DropVector { data: number });
        return list
    }

    #[test]
    fun test_add_vector() {
        let vec = add_last_vec(10);
        print(&vec);
    }

    #[test]
    #[expected_failure]
    fun test_failed_drop_vector() {
        let vec = add_last_vec(10);
        vector::destroy_empty(vec);
    }

    #[test]
    fun test_success_drop_vector() {
        let vec = add_last_vec(10);
        vector::pop_back(&mut vec);
        vector::destroy_empty(vec);
    }
}
```

> Running test:
> 

```rust
movement move test -f vector_type
```

> Result:
> 

```rust
Running Move unit tests
[debug] [
  0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::vector_type::DropVector {
    data: 10
  }
]
[ PASS ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::vector_type::test_add_vector
[ PASS ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::vector_type::test_failed_drop_vector
[ PASS ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::vector_type::test_success_drop_vectorTest result: OK. Total tests: 3; passed: 3; failed: 0
{
  "Result": "Success"
}
```

### Copy a vector

Similarly, vectors cannot be copied (using `copy`) unless the element type has the `copy` capability. In other words, a `vector<T>` is copyable only if `T` has the.

```rust
module movement::vector_type {
    use std::vector;
    use std::debug::print;

    struct DropVector has drop, copy {
        data: u64
    }

    fun add_last_vec(number: u64): vector<DropVector> {
        let list = vector::empty<DropVector>();

        vector::push_back(&mut list, DropVector { data: number });
        return list
    }
    
    #[test]
    fun test_success_drop_vector() {
        let vec = add_last_vec(10);
        vector::pop_back(&mut vec);
        vector::destroy_empty(vec);
    }

    #[test]
    fun test_clone_vector() {
        let vec = add_last_vec(10);
        let vec_copy = copy vec;
    }
}
```

> Running test:
> 

```rust
movement move test -f vector_type
```

> Result:
> 

```rust
Running Move unit tests
[ PASS    ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::vector_type::test_clone_vector
[ PASS    ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::vector_type::test_success_drop_vectorTest result: OK. Total tests: 2; passed: 2; failed: 0
{
  "Result": "Success"
}
```

<aside>
🚨

Copying large `vectors` can be **expensive**, so the compiler requires explicit copies to make it easy to see where they occur.

</aside>

## Additional Vector Functions

| **Function** | **Parameters** | **Description** | **Return Value** |
| --- | --- | --- | --- |
| `empty<T>` | None | Creates an empty vector that can store values of type `T` | `vector<T>` |
| `singleton<T>` | `t: T` | Creates a vector of size 1 containing `t` | `vector<T>` |
| `push_back<T>` | `v: &mut vector<T>, t: T` | Adds `t` to the end of `v` | None |
| `pop_back<T>` | `v: &mut vector<T>` | Removes and returns the last element in `v` | `T` |
| `borrow<T>` | `v: &vector<T>, i: u64` | Returns an immutable reference to the `T` at index `i` | `&T` |
| `borrow_mut<T>` | `v: &mut vector<T>, i: u64` | Returns a mutable reference to the `T` at index `i` | `&mut T` |
| `destroy_empty<T>` | `v: vector<T>` | Deletes `v` | None |
| `append<T>` | `v1: &mut vector<T>, v2: vector<T>` | Adds the elements in `v2` to the end of `v1` | None |
| `contains<T>` | `v: &vector<T>, e: &T` | Returns true if `e` is in the vector `v`, otherwise false | `bool` |
| `swap<T>` | `v: &mut vector<T>, i: u64, j: u64` | Swaps the elements at the `i`th and `j`th indices in the vector `v` | None |
| `reverse<T>` | `v: &mut vector<T>` | Reverses the order of the elements in the vector `v` in place | None |
| `index_of<T>` | `v: &vector<T>, e: &T` | Returns `(true, i)` if `e` is in the vector `v` at index `i`, otherwise `(false, 0)` | `(bool, u64)` |
| `remove<T>` | `v: &mut vector<T>, i: u64` | Removes the `i`th element of the vector `v`, shifting all subsequent elements | `T` |
| `swap_remove<T>` | `v: &mut vector<T>, i: u64` | Swaps the `i`th element with the last element and then pops the element | `T` |

## Overview String

In Move, String is not a native data type. Data in the Move VM is stored as bytes, so when using a string, the essence of the string will be a vector<u8>, a sequence of characters encoded as bytes arranged adjacently to create a string

```rust
module movement::string_type {
    use std::string::{String, utf8};
    use std::signer;
    use std::debug::print;

    fun vec_string() {
        let vec_string: vector<u8> = b"Hello by vector u8";
        let by_string: String = utf8(b"Hello by String");
        let by_vec: String = utf8(vec_string);
        print(&vec_string);
        print(&by_string);
        print(&by_vec);
    }

    #[test]
    fun test_vec_string() {
        vec_string()
    }
}
```

> Running test:
> 

```rust
movement move test -f test_vec_string
```

> Result:
> 

```rust
Running Move unit tests
[debug] 0x48656c6c6f20627920766563746f72207538
[debug] "Hello by String"
[debug] "Hello by vector u8"
[ PASS    ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::string_type::test_vec_string
Test result: OK. Total tests: 1; passed: 1; failed: 0
{
  "Result": "Success"
}
```

## Conclusion

Vectors and strings are fundamental data structures in Move that provide powerful capabilities for handling collections and text data. Here are the key takeaways:

- Vectors (`vector<T>`) offer a flexible, homogeneous collection type that can be used with any data type in Move.
- Vector operations like adding, removing, and accessing elements are efficient and well-supported by built-in functions.
- The behavior of vectors depends on the capabilities of their element type, particularly for operations like destruction and copying.
- Strings in Move are represented as `vector<u8>`, leveraging the vector structure for character sequences.
- Move provides utility functions for string manipulation, including conversion between vector<u8> and String types.

Understanding these concepts is crucial for effective programming in Move, as they form the basis for many complex data structures and algorithms. Proper use of vectors and strings can lead to more efficient and maintainable code in Move-based smart contracts and applications.