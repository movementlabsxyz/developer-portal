# Unit Test

Unit testing in Move introduces powerful annotations to enhance the testing process:

- `#[test]`: Designates a function as a test case
- `#[test_only]`: Marks code for exclusive use in testing environments
- `#[expected_failure]`: Indicates a test that is anticipated to fail

These annotations revolutionize Move's testing capabilities:

- The `#[test]` annotation transforms functions into comprehensive test suites
- `#[test_only]` allows for the creation of modules, functions, or structures dedicated solely to testing purposes, enhancing code organization
- With `#[expected_failure]`, developers can proactively identify and manage tests that are designed to fail, improving overall test coverage and reliability

```rust
module movement::unit_testing {
    use std::debug::print;
    use std::signer;

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

    fun show_address(address: signer) {
        print(&signer::address_of(&address))
    }

    #[test_only]
    fun new_n(): u64 {
        return 5
    }

    // This test function checks if const_error() correctly aborts with the expected error code
    // when given the value 5. It uses #[expected_failure] to indicate that we expect this test to fail.
    #[test]
    #[expected_failure(abort_code = 1)]
    fun test_const_error() {
        let new_n = new_n();
        const_error(new_n);
    }

    // This test function verifies that is_even() correctly identifies odd numbers
    // and aborts with the expected error code. We use #[expected_failure] here as well.
    #[test]
    #[expected_failure(abort_code = 2)]
    fun test_is_even_failed() {
        is_even(5);
    }

    // This test function checks if is_even() correctly handles even numbers without aborting.
    #[test]
    fun test_is_even_success() {
        is_even(4);
    }
		
    // This test function demonstrates how to use a custom signer in tests.
    // It checks if show_address() correctly prints the signer's address.
    #[test(myaccount = @0x1)]
    fun test_show_address(myaccount: signer) {
        show_address(myaccount);
    }
}
```

There are multiple ways to run unit tests using the CLI. By utilizing the `--filter` option, you can flexibly test with `module_name`, `function_name`, or `all`.

```rust
movement move test // Running all test function in source
movement move test --filter unit_testing // Running all test function in the module
movement move test --filter test_show_address // Running specific test function
```

```bash
Running Move unit tests
[ PASS ]  constants_error_handling_module::test_const_error
[ PASS ]  constants_error_handling_module::test_is_even_failed
[ PASS ]  constants_error_handling_module::test_is_even_success
[debug]   @0x1
[ PASS ]  constants_error_handling_module::test_show_address

Test result: OK. Total tests: 4; passed: 4; failed: 0

{
  "Result": "Success"
}
```