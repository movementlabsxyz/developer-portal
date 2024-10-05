# Generics Type & Phantom Type

## Generics in Move: Enhancing Code Flexibility and Reusability

Move's generics feature empowers developers to craft versatile code that adapts to various data types, eliminating the need for type-specific implementations. This powerful concept, akin to generics in languages like Rust or Java, enables the creation of flexible, widely applicable code structures.

### Key Benefits of Generics

- Promotes code reusability across different data types
- Significantly reduces code duplication
- Enhances overall code maintainability and readability
- Facilitates the development of robust, type-safe abstractions

### Implementing Generics in Move

In Move, we typically refer to this concept as "generics" rather than type parameters and arguments. Here's how to leverage this feature:

- Declaring Generic Types
    - Use angle brackets <T> to define type parameters in function and struct signatures
    - Example: struct Container<T> { item: T }
- Creating Generic Functions
    - Place type parameters after the function name and before value parameters
    - Example: public fun identity<T>(x: T): T { x }
    - Utilize the type parameter T in parameter types, return types, and within the function body

By mastering generics, Move developers can create more efficient, flexible, and maintainable code, elevating the quality of their blockchain applications.

### Generics Function

Example: In the code snippet below is a simple example to show the information of a token created from the MoveToken struct.

```rust
module movement::generic_type {
    use std::string::{String, utf8};
    use std::debug::print;
    use std::signer;

    struct MoveToken has drop {
        symbol: String,
        name: String,
        decimal: u8,
        total_supply: u128
    }

    fun show_token(token: MoveToken) {
        print(&token);
    }

    #[test]
    fun test_show_all() {
        let token = MoveToken {
            symbol: utf8(b"MOVE"),
            name: utf8(b"Movement"),
            decimal: 8,
            total_supply: 1_000_000_000
        };
        show_token(token);
    }
}
```

Let's imagine a scenario where your application accepts more than one Token for payment in its functions. In this case, the code would be modified as follows.

```rust
module movement::generic_type {
    use std::string::{String, utf8};
    use std::debug::print;
    use std::signer;

    struct MoveToken has drop {
        symbol: String,
        name: String,
        decimal: u8,
        total_supply: u128
    }

    struct MovementToken has drop {
        symbol: String,
        name: String,
        decimal: u8,
        total_supply: u128
    }

    fun show_token(token: MoveToken) {
        print(&token);
    }

    fun show_movement_token(token: MovementToken) {
        print(&token);
    }

    #[test]
    fun test_show_all() {
        let token = MoveToken {
            symbol: utf8(b"MOVE"),
            name: utf8(b"Movement"),
            decimal: 8,
            total_supply: 1_000_000_000
        };
        show_token(token);

        let movetoken = MovementToken {
            symbol: utf8(b"MOVEMOVE"),
            name: utf8(b"Movement Tokens"),
            decimal: 8,
            total_supply: 1_000_000_000
        };
        show_movement_token(movetoken);
    }
}
```

So if you have about 20 different tokens for payment, your code will be very long, so we will use generic types to upgrade this code as shown below:

```rust
module movement::generic_type {
    use std::string::{String, utf8};
    use std::debug::print;
    use std::signer;

    struct MoveToken has drop {
        symbol: String,
        name: String,
        decimal: u8,
        total_supply: u128
    }
    
		//a generic identity function that takes a value of any type and returns that value unchanged
    fun show_token<T: drop>(token: T) {
        print(&token);
    }

    #[test]
    fun test_show_all() {
        let token = MoveToken {
            symbol: utf8(b"MOVE"),
            name: utf8(b"Movement"),
            decimal: 8,
            total_supply: 1_000_000_000
        };

        let movetoken = MoveToken {
            symbol: utf8(b"MOVEMENT"),
            name: utf8(b"Movement Tokens"),
            decimal: 8,
            total_supply: 1_000_000_000
        };

        show_token(token);
        show_token(movetoken);
    }
}
```

### Generics Structs

Type parameters for structures (structs) are placed after the struct name and can be used to name the types of the fields.

```rust
struct Foo<T> has copy, drop { x: T }
 
struct Bar<T1, T2> has copy, drop {
    x: T1,
    y: vector<T2>,
}
```