# Conditionals & Loops

## Summary

- Conditionals in Move use `if-else` statements with boolean conditions and required curly braces.
- Multiple conditions can be chained using `else if`.
- Move supports three types of loops: `while`, `for`, and infinite (`loop`).
- While loops execute code as long as a condition is true.
- For loops iterate over a range of values.
- Infinite loops use the `loop` keyword and continue until explicitly broken.

# Conditionals in Move

Conditionals are fundamental control structures in programming that allow you to execute different code based on certain conditions. In move, the most common conditional structure is the if-else statement.

## Basic Syntax

The basic syntax of an if-else statement in Move is as follows:

```rust
if (condition) {
    // code to execute if condition is true
} else {
    // code to execute if condition is false
}
```

## Key Points

- The condition must be a boolean expression.
- Curly braces {} are required, even if the block contains only one line of code.
- The else block is optional.

## Multiple Conditions

You can chain multiple conditions using else if:

```rust
if (condition1) {
    // code for condition1
} else if (condition2) {
    // code for condition2
} else {
    // code if no condition is true
}
```

# Loops

Loops are essential control structures in programming that allow you to repeat a block of code multiple times. In Move, there are three main types of loops: while loops, for loops, and loop (infinite loop).

## While Loops

While loops execute a block of code as long as a specified condition is true.

```rust
while (condition) {
    // code to be executed
}
```

## For Loops

For loops are used to iterate over a range of values.

```rust
for (i in 1..n) {
    // code to be executed
}
```

## Infinite Loops

The 'loop' keyword creates an infinite loop that continues until explicitly broken.

```rust
loop {
    // code to be executed
    if (condition) {
        break;
    }
}
```

## Example: Sum of First N Natural Numbers

The code below demonstrates how to calculate the sum of the first N natural numbers using different types of loops in Move:

```rust
module movement::loops {
    use std::vector;

    // Sum of first N natural numbers using while loop
    fun sum_using_while(n: u64): u64 {
        let sum = 0;
        let i = 1;
        while (i <= n) {
            sum = sum + i;
            i = i + 1;
        };
        sum
    }

    // Sum of first N natural numbers using for loop
    fun sum_using_for(n: u64): u64 {
        let sum = 0;
        for (i in 1..(n+1)) {
            sum = sum + i;
        };
        sum
    }

    // Sum of first N natural numbers using infinite loop
    fun sum_using_loop(n: u64): u64 {
        let sum = 0;
        let i = 1;
        loop {
            if (i > n) break;
            sum = sum + i;
            i = i + 1;
        };
        sum
    }

    // Sum of first N natural numbers using vector and fold
    fun sum_using_vector(n: u64): u64 {
        let numbers = vector::empty<u64>();
        let i = 1;
        while (i <= n) {
            vector::push_back(&mut numbers, i);
            i = i + 1;
        };
        vector::fold(numbers, 0, |acc, num| acc + num)
    }

    #[test_only]
    use std::debug;

    #[test]
    fun test_sum_functions() {
        let n = 10;
        let expected_sum = 55; // Sum of 1 to 10

        assert!(sum_using_while(n) == expected_sum, 0);
        assert!(sum_using_for(n) == expected_sum, 1);
        assert!(sum_using_loop(n) == expected_sum, 2);
        assert!(sum_using_vector(n) == expected_sum, 3);

        debug::print(&sum_using_while(n));
        debug::print(&sum_using_for(n));
        debug::print(&sum_using_loop(n));
        debug::print(&sum_using_vector(n));
    }
}
```

> Running test:
> 

```rust
movement move test -f test_sum_functions
```

> Result:
> 

```rust
Running Move unit tests
[debug] 55
[debug] 55
[debug] 55
[debug] 55
[ PASS    ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::loops::test_sum_functions
Test result: OK. Total tests: 1; passed: 1; failed: 0
{
  "Result": "Success"
}
```