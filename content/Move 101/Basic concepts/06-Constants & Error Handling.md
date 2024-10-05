# Constants & Error Handling

## Key Takeaways

- Constants in Move provide immutable values with compile-time evaluation and memory optimization.
- Naming conventions for constants enhance code readability (e.g., uppercase for non-error values, camel case with 'E' prefix for error codes).
- Error handling utilizes `abort` statements and `assert!` macros for precise control.
- Combining constants with error handling creates robust, self-documenting code.
- Advanced techniques include centralizing error codes in dedicated modules for improved organization and reusability.
- Proper use of constants and error handling is crucial for building secure and maintainable Move programs.

# Constants

## Overview

Constants in Move are a powerful way to define immutable values within a `module` or `script`. They are declared using the `const` keyword and offer several advantages:

- Compile-time evaluation: The constant's value must be determinable at compilation, ensuring efficiency.
- Memory optimization: Constants are stored directly in the compiled code, reducing runtime memory usage.
- Value semantics: Each use of a constant creates a new copy, preserving data integrity across different parts of your code.

By leveraging constants, developers can create more readable, maintainable, and performant Move programs.

```rust
const <NAME>: <TYPE> = <EXPRESSION>;
```

## Naming Conventions

Naming conventions for constants in Move are designed to enhance code readability and maintainability. Here are the key rules:

- Initial character: Constants must begin with an uppercase letter (A-Z).
- Subsequent characters: After the first letter, you can use:
    - Uppercase letters (A-Z)
    - Lowercase letters (a-z)
    - Digits (0-9)
    - Underscores (_)

This naming convention helps distinguish constants from other identifiers in your code, making it easier to recognize and use them appropriately throughout your Move programs.

**Key Considerations for Constants in Move:**

- Type Restrictions: Constants are confined to fundamental data types such as `bool`, integer variants (`u8` to `u256`), `address`, and `vector<u8>`.
- Naming Conventions:
    - Error codes: Use upper camel case with an 'E' prefix (e.g., `EInsufficientFunds`)
    - Non-error values: Employ upper snake case (e.g., `MAX_SUPPLY`)
- Scope Limitations: Constants are `module-specific` and cannot be declared as `public` or accessed externally.
- Visibility: The value of a constant is restricted to its defining module or script.

## Examples:

```rust
module movement::config {
    const EOnlyAdmin: u64 = 1;
    const ENotHavePermission: u64 = 2;
    const VECTOR_U8: vector<u8> = b"hello";
}
```

# Error Handling

## Error Handling in Move

Move provides robust mechanisms for error handling, primarily through two key functions:

- **abort**: Immediately terminates execution with a specified error code
    
    ```rust
    abort <error_code>; // error_code must be of type u64
    ```
    
- **assert!**: Evaluates a condition and aborts if it's false
    
    ```rust
    assert!(<boolean_expression>, <error_code>)
    ```
    

These tools allow developers to implement precise error handling, enhancing the reliability and debuggability of Move programs.

## Using in Real-World Projects

In real-world projects, error handling is frequently used. For large projects, we combine it with constants to manage errors more optimally, as shown in the example above:

```rust
module movement::constants_error_handling_module {
    const ENotHavePermission: u64 = 1;
    const ENotEven: u64 = 2;

    fun const_error(n: u64) {
        if (n == 5) {
            abort ENotHavePermission // throwing error as the given constant
        }
    }

    fun is_even(num: u64) {
        assert!(num % 2 == 0, ENotEven); // throwing error as the given constant
    }

    #[test]
    #[expected_failure(abort_code = 1)]
    fun test_const_error() {
        const_error(5);
    }

    #[test]
    #[expected_failure(abort_code = 2)]
    fun test_is_even_failed() {
        is_even(5);
    }

    #[test]
    fun test_is_even_success() {
        is_even(4);
    }
}
```

In the code above, we can see practical examples of error handling in Move using both the `abort` statement and the `assert!` macro, combined with constant error codes. Let's break it down:

### Abort Example

- The `ENotHavePermission` constant is defined with a value of 1, representing a specific error condition.
- In the `const_error` function, there's a conditional check: if the input `n` equals 5, it triggers an abort with the `ENotHavePermission` error code.
- The `abort` statement immediately halts the execution of the function and returns the specified error code (1 in this case).
- A test function `test_const_error` is provided to verify this behavior. It's marked with `#[expected_failure(abort_code = 1)]`, indicating that it's expected to fail with the specific abort code 1.

### Assert Example

- The `ENotEven` constant is defined with a value of 2, representing another error condition.
- In the `is_even` function, the `assert!` macro is used to check if the input number is even.
- If the assertion fails (i.e., the number is odd), it aborts with the `ENotEven` error code.
- Two test functions are provided: `test_is_even_failed` expects failure with abort code 2, while `test_is_even_success` expects successful execution.

This approach to error handling offers several benefits:

- Clear error identification: Using named constants for error codes improves code readability and maintainability.
- Consistent error reporting: By centralizing error codes as constants, you ensure consistency across your module.
- Testability: The `#[expected_failure]` attribute allows you to write tests that specifically check for correct error handling.
- Flexibility: Developers can choose between `abort` for immediate termination or `assert!` for condition-based checks.

By combining constants with both the `abort` mechanism and `assert!` macro, Move developers can create robust, self-documenting error handling systems that are easy to maintain, test, and adapt to various scenarios.

# Error Handling Advanced

Note: Constants are `module-specific` and cannot be declared as `public` or accessed externally.

In real-world projects, the number of error handling cases can be very large. Additionally, an error may occur in multiple different modules. I have used functions to develop and optimize error handling beyond Move's traditional methods. For example:

```rust
module movement::errors {
    const ENotHavePermission: u64 = 1;
    const ENotEven: u64 = 2;

    public fun get_enot_have_permission(): u64 {
        ENotHavePermission
    }

    public fun get_enot_even(): u64 {
        ENotEven
    }
}
```

```rust
module movement::constants_abort_error {
    use movement::errors;

    fun const_error(n: u64) {
        if (n == 5) {
            abort errors::get_enot_have_permission() // throwing error as the given constant
        }
    }

    #[test]
    #[expected_failure(abort_code = 1)]
    fun test_const_error() {
        const_error(5);
    }
}

module movement::constants_assert_error {
    use movement::errors;

    fun is_even(num: u64) {
        assert!(num % 2 == 0, errors::get_enot_even()); // throwing error as the given constant
    }

    #[test]
    #[expected_failure(abort_code = 2)]
    fun test_is_even_failed() {
        is_even(5);
    }

    #[test]
    fun test_is_even_success() {
        is_even(4);
    }
}
```

With this approach, you can separate error handling into a dedicated module, making it easier to manage and resulting in cleaner code, as well as enabling reuse across different modules.

# Conclusion

In this comprehensive overview of constants and error handling in Move, we've explored several key concepts:

- Constants provide immutable values, offering compile-time evaluation, memory optimization, and value semantics.
- Proper naming conventions for constants enhance code readability and maintainability.
- Error handling in Move primarily relies on the `abort` statement and `assert!` macro.
- Combining constants with error handling creates a robust system for managing and reporting errors.
- Advanced error handling techniques, such as centralizing error codes in a dedicated module, can improve code organization and reusability.

By mastering these concepts, developers can create more efficient, readable, and maintainable Move programs. Constants and effective error handling are crucial for building robust smart contracts and decentralized applications on blockchain platforms that support Move.

As the Move ecosystem continues to evolve, these fundamental practices will remain essential for writing high-quality, secure code. Developers should strive to implement these patterns consistently in their projects to ensure reliability and ease of maintenance in the long term.