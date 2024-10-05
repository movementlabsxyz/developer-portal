# Events

## Summary

<aside>
🏆

**Key Points:**

- Events are crucial functions in smart contracts for capturing and communicating occurrences within modules.
- They enable back-end systems to differentiate activities and execute various tasks like sending notifications or performing off-chain calculations.
- Event structs are defined with 'drop' and 'store' abilities, using the #[event] macro.
- The event::emit function is called after function execution to create an event.
- Events can contain specific information, such as values and executor addresses, visible in transaction details.
- Implementation involves modifying existing functions to include event emission.
</aside>

## Overview

Events are one of the crucial functions in most smart contracts. They help back-end systems capture events that have occurred and are occurring on your modules (smart contracts). You can harness the power of Events to create distinct messages. These messages can contain various information and data from your modules. Your back-end can use these messages to differentiate activities and execute various tasks on your application, such as sending notifications or performing off-chain calculations

**Returning to the example code for local and global storage:**

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

To create an event when executing a function, we need to define structs with the 'drop' and 'store' abilities. Additionally, we use the #[event] macro to inform the compiler that this struct is intended for creating events.

```ruby
#[event]
struct EventChangeValue has drop, store {
    value: u64,
    executor: address
}
```

Then we call `event::emit` after the function has finished executing.

```ruby
public entry fun change_value_from_global_storage(signer: &signer, value: u64) acquires GlobalData {
    let addr = address_of(signer);
    if (!check_global_storage_exists(addr)) {
        abort EResourceNotExist
    };

    let value_reference = &mut borrow_global_mut<GlobalData>(addr).value;
    *value_reference = *value_reference + value;
    event::emit(EventChangeValue {
        value,
        executor: addr
    });
}
```

After execution is complete, you can check the transaction and you will see an event with 2 pieces of information: executor and value

![Screenshot 2024-09-27 at 21.47.27.png](Events%2010718675b2d780a49a94e25bbdddbb7a/Screenshot_2024-09-27_at_21.47.27.png)