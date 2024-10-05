# Object Ownership & Transfer Object

## Summary

- Implements object ownership in a Rust module for creating and managing movement objects
- Sets owner address during object creation
- Implements ownership checks for functions like `set_value`
- Demonstrates how to retrieve the owner's address of an object
- Implements a `transfer_obj` function to change object ownership
- Includes test functions to verify object creation, value setting, and ownership transfer

## Implementing Object Ownership

Now that we understand the concept of object ownership, let's apply it to our movement creation function. This will allow us to assign specific owners to each movement object we create.

### Step 1: Update the `set_value` function

First, let's modify the `set_value` function to include an owner parameter:

```rust
public fun set_value(owner: address, value: u64): Object<MovementObject> {
    // ... existing code ...
}
```

### Step 2: Set the owner address

Next, we'll update the object creation to use the provided is_owner address:

```rust
object::is_owner(owner, signer::address_of(owner)
```

### Step 3: Implement ownership checks

Now that we have assigned an owner, we can implement functions that only the owner can call. For example, a function to train the movement object:

```rust
public fun set_value(owner: address, new_value: u64) acquires MovementObject {
    assert!(object::is_owner(owner, signer::address_of(owner)), 1); // Only the owner can transfer it
    let object_data = borrow_global_mut<MovementObject>(get_object_address(owner));
    object_data.value = new_value;
}
```

Alternatively, you can easily check the owner of an object using the function: `object::owner(movement_object)` 

```rust
#[view]
public fun get_owner_object(obj: Object<MovementObject>): address {
    object::owner(obj)
}
```

We'll add another test to demonstrate how to retrieve the address of the object we've created.

```rust
#[test(account = @0x1)]
fun test_get_owner_object_address(account: &signer)  {
    test_init_module(account);
    let addr = address_of(account);
    let value = get_object(addr);
    let get_owner = get_owner_object(value);
    print(&get_owner);
}
```

Result:

```rust
[debug] @0x52152ca68792cb72eb58f6497c1c8fbe69f5fc5d938edf2e74ed8da6ae816622
```

### Step 4: Transfer Object

To transfer an object, we need the following information: `object::transfer(current_owner_address, movement_object, new_owner_address)`

```rust
public fun transfer_obj(owner: &signer, new_owner: address) {
    let owner_addr = address_of(owner); // get current owner address
    let obj = get_object(owner_addr); // get Object<MovementObject>
    assert!(object::is_owner<MovementObject>(obj, owner_addr), 1); // Only the owner can transfer/modify it
    object::transfer(owner, obj, new_owner); // Transfer
}

#[test(account = @0x1, new_owner = @0x2)]
fun test_transfer_object(account: &signer, new_owner: address)  {
    test_init_module(account);
    transfer_obj(account, new_owner);
}
```

By implementing these steps, we've successfully integrated object ownership into our movement creation and training functions. This allows for more secure and personalized interactions with the movement objects in our module.

## Full Code

```rust
module movement::object_module_entry {
    use aptos_framework::object::{Self, Object};
    use std::signer::address_of;
    use std::debug::print;

    const MOVEMENT_OBJECT_NAME: vector<u8> = b"MovementObjectName";

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct MovementObject has key {
        value: u64
    }

    fun init_module(owner: &signer) {
        let state_object_constructor_ref = &object::create_named_object(owner, MOVEMENT_OBJECT_NAME);
        let state_object_signer = &object::generate_signer(state_object_constructor_ref);
        move_to(state_object_signer, MovementObject {
            value: 10
        });
    }

    #[test_only]
    fun test_init_module(onwer: &signer) {
        init_module(onwer);
    }

    #[view]
    public fun get_object_address(owner: address): address {
        object::create_object_address(&owner, MOVEMENT_OBJECT_NAME)
    }

    #[view]
    public fun get_object(owner: address): Object<MovementObject> {
        object::address_to_object(get_object_address(owner))
    }

    public fun get_value(owner: address): u64 acquires MovementObject {
        borrow_global<MovementObject>(get_object_address(owner)).value
    }

    #[view]
    public fun get_owner_object(obj: Object<MovementObject>): address {
        object::owner(obj)
    }

    public fun set_value(owner: address, new_value: u64) acquires MovementObject {
        let obj = get_object(owner);
        assert!(object::is_owner<MovementObject>(obj, owner), 1); // Only the owner can transfer/modify it
        let object_data = borrow_global_mut<MovementObject>(get_object_address(owner));
        object_data.value = new_value;
    }

    public fun transfer_obj(owner: &signer, new_owner: address) {
        let owner_addr = address_of(owner);
        let obj = get_object(owner_addr);
        assert!(object::is_owner<MovementObject>(obj, owner_addr), 1); // Only the owner can transfer/modify it
        object::transfer(owner, obj, new_owner);
    }

    #[test(account = @0x1, new_owner = @0x2)]
    fun test_transfer_object(account: &signer, new_owner: address)  {
        test_init_module(account);
        transfer_obj(account, new_owner);
    }

    #[test(account = @0x1)]
    fun test_get_owner_object_address(account: &signer)  {
        test_init_module(account);
        let addr = address_of(account);
        let obj = get_object(addr);
        let get_owner = get_owner_object(obj);
        print(&get_owner);
    }

    #[test(account = @0x1)]
    fun test_get_object_address(account: &signer) {
        test_init_module(account);
        let addr = address_of(account);
        let value = get_object_address(addr);
        print(&value);
    }

    #[test(account = @0x1)]
    fun test_get_object(account: &signer) acquires MovementObject {
        test_init_module(account);
        let addr = address_of(account);
        let value = get_value(addr);
        assert!(value == 10, 0);
    }

    #[test(account = @0x1)]
    fun test_set_object(account: &signer) acquires MovementObject {
        test_init_module(account);
        let addr = address_of(account);
        set_value(addr, 20);
        let value = get_value(addr);
        assert!(value == 20, 1);
    }
}
```