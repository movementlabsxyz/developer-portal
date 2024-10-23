# Destroying a resource

<aside>
💡

**Key Takeaways:**

- The `move_from` function removes a resource from an account or address.
- Resources must have the "drop" ability to use `move_from`.
- The "drop" ability prevents unintentional deletion of resources.
- It allows control over whether resources can be deleted or should persist.
- The code demonstrates how to implement and use `move_from` in a Move module.
- The module includes functions for creating, modifying, and removing global storage.
</aside>

Among the provided functions in the previous topics, we haven't yet discussed `move_from`. This function removes a resource from an account or address. It's crucial to note that to use `move_from` for a resource, you must ensure the resource has the "drop" ability. Without this, the compiler will throw an error. This safeguard prevents resources from being unintentionally deleted, either accidentally or in cases where you want resources to remain permanent. It allows you to control whether resources can be deleted or should persist indefinitely.

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