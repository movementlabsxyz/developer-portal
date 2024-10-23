# Integer

## Summary

- Move supports six unsigned integer types: u8, u16, u32, u64, u128, and u256.
- Direct mathematical operations between different integer types are not allowed.
- Type casting is necessary when performing operations with different integer types.
- It's recommended to cast smaller types to larger types to avoid overflow risks.
- The module demonstrates adding a u8 and a u64 by converting u8 to u64.
- A test function verifies the addition operation.
- The code can be tested using the Move test command.

## Overview

Move supports six unsigned integer types: `u8`, `u16`, `u32`, `u64`, `u128`, and `u256`. Values of these types range from 0 to a maximum that depends on the size of the type.

Although math can be done easily among integers of the same type, it's not possible to do math directly between integers of different type

```rust
fun plus_two_types(): u64 {
    let x: u8 = 10;
    let y: u64 = 60;
    // This will error
    x + y // x and y are different types -> failed to compile
}
```

To make this expression correct, you need to use two identical data types; we will convert one of the two data types to match the other.

```rust
fun plus_two_types(): u64 {
    let x: u8 = 10;
    let y: u64 = 60;
    (x as u64) + y
}
```

> One of the things to pay attention to when using type casting, like the code above, is that we should only cast smaller types to larger types, and not the other way around. This helps to limit the risk of overflow.
> 

# Code Start

This code defines a module in Move language that includes a function plus_two_types, which adds a u8 and a u64 after converting the u8 to u64. The module also contains a test function test_plus_two_types that verifies the addition operation.

```rust
module movement::integer_module {
    use std::debug::print;

    fun plus_two_integer(x: u64, y: u64): u64 {
        x + y
    }

    fun plus_two_types(x: u8, y: u64): u64 {
        (x as u64) + y
    }

    fun integer_type() {
        let _a: u8 = 0;
        let _b: u16 = 1;
        let _c: u32 = 2;
        let _d: u64 = 3;
        let _e: u128 = 4;
        let _f: u256 = 5;
    }

    #[test]
    fun test_plus_two_types() {
        let result = plus_two_types(5, 100);
        print(&result);
    }

    #[test]
    fun test_show_interger() {
        integer_type();
    }

    #[test]
    fun test_plus_two_integer() {
        let result = plus_two_integer(5, 100);
        print(&result);
    }
}
```

> Execute test in the terminal
> 

```bash
movement move test --filter integer_module
```

```json
Running Move unit tests
[debug] 105
[ PASS    ] 0xc103109311944d8bae02fccf9273dcb4615be30653e85aec628f04b6ddd00fef::integer_module::test_plus_two_integer
[debug] 105
[ PASS    ] 0xc103109311944d8bae02fccf9273dcb4615be30653e85aec628f04b6ddd00fef::integer_module::test_plus_two_types[ PASS    ] 0xc103109311944d8bae02fccf9273dcb4615be30653e85aec628f04b6ddd00fef::integer_module::test_show_interger
Test result: OK. Total tests: 3; passed: 3; failed: 0
{
  "Result": "Success"
}
```