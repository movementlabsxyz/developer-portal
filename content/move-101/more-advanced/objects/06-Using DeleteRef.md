# Using DeleteRef

## Summary

- Object deletion in Aptos Move is implemented using the `DeleteRef` concept.
- A `DeleteRef` must be created during object initialization for objects that can be deleted.
- The module demonstrates creating objects with customizable properties (transferrable, controllable, deletable).
- `ExtendRef`, `TransferRef`, and `DeleteRef` are used to manage object behavior.
- Object deletion respects ownership, allowing only the owner to delete an object.
- This approach provides fine-grained control over object lifecycle and permissions in Aptos Move smart contracts.

## Overview

Object deletion is a crucial feature in data management, serving two primary purposes: decluttering your workspace and reclaiming storage resources. To facilitate this process, we introduce the concept of a `DeleteRef`.

A `DeleteRef` is a specialized reference that must be established during the object's creation phase. This preemptive approach ensures that only objects intended for potential deletion are equipped with this capability. It's important to note that not all objects are eligible for deletion, and attempting to create a `DeleteRef` for such non-deletable objects will result in an error.

## Defining Structs

Next, let's define our structs:

```rust
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct MovementObject has key {
    value: u64,
}

#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct ControllerObject has key {
    extend_ref: ExtendRef,
    transfer_ref: TransferRef,
    delete_ref: DeleteRef,
}

```

- `MovementObject` is our main object that holds a value.
- `ControllerObject` holds the references that control the object's behavior.

## Initializing the Module

The `init_module` function sets up our initial object:

```rust
fun init_module(owner: &signer) {
    let state_object_constructor_ref = object::create_named_object(owner, MOVEMENT_OBJECT_NAME);
    let state_object_signer = object::generate_signer(&state_object_constructor_ref);

    move_to(&state_object_signer, MovementObject {
        value: 10
    });

    let extend_ref = object::generate_extend_ref(&state_object_constructor_ref);
    let transfer_ref = object::generate_transfer_ref(&state_object_constructor_ref);
    let delete_ref = object::generate_delete_ref(&state_object_constructor_ref);

    move_to(&state_object_signer, ControllerObject {
        extend_ref,
        transfer_ref,
        delete_ref,
    });
}
```

This function creates a named object, moves a `MovementObject` to it, and then creates and stores the control references in a `ControllerObject`.

This function allows you to:

- Create objects that may or may not be transferrable.
- Make objects controllable (by storing the control references).
- Optionally allow objects to be deletable.

Similar to TransferRef and ExtendRef, when you use DeleteRef, you'll retrieve it from within the ControllerObject to execute the deletion.

```rust
public entry fun delete(
    caller: &signer,
    object: Object<ControllerObject>,
) acquires ControllerObject {
    // Only let caller delete
    let caller_address = signer::address_of(caller);
    assert!(object::is_owner(object, caller_address), E_NOT_OWNER);

    let object_address = object::object_address(object);

    // Retrieve the delete ref, it is consumed so it must be extracted
    // from the resource
    let ControllerObject {
        extend_ref: _,
        transfer_ref: _,
        delete_ref,
    } = move_from<ControllerObject>(object_address);

    // Delete the object forever!
    object::delete(delete_ref);
}
```

This function:

- Checks if the caller is the owner of the object.
- Retrieves and consumes the `ControllerObject`.
- Uses the `DeleteRef` to delete the object.

## Conclusion

This module demonstrates advanced object control in Aptos Move:

- We can create objects with customizable properties (transferrable, controllable, deletable).
- We use `ExtendRef`, `TransferRef`, and `DeleteRef` to manage object behavior.
- We implement a deletion mechanism that respects object ownership.

By using these techniques, you can create more flexible and secure smart contracts in Aptos Move, giving you fine-grained control over object lifecycle and permissions.

## Full Code

```ruby
module movement::object_module_entry {
    use aptos_framework::object::{Self, Object, ExtendRef, TransferRef, DeleteRef};
    use std::signer::address_of;
    use std::debug::print;

    const MOVEMENT_OBJECT_NAME: vector<u8> = b"MovementObjectName";
    const E_NOT_OWNER: u64 = 0;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct MovementObject has key {
        value: u64
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct NewObject has key {
        new_value: u64
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct ControllerObject has key {
        extend_ref: ExtendRef,
        transfer_ref: TransferRef,
        delete_ref: DeleteRef
    }

    fun init_module(owner: &signer) {
        let state_object_constructor_ref = &object::create_named_object(owner, MOVEMENT_OBJECT_NAME);
        let state_object_signer = &object::generate_signer(state_object_constructor_ref);
        move_to(state_object_signer, MovementObject {
            value: 10
        });

        let extend_ref = object::generate_extend_ref(state_object_constructor_ref);
        let transfer_ref = object::generate_transfer_ref(state_object_constructor_ref);
        let delete_ref = object::generate_delete_ref(state_object_constructor_ref);
        move_to(state_object_signer, ControllerObject {
            extend_ref,
            transfer_ref,
            delete_ref
        });
    }

    fun freeze_object(my_object: Object<MovementObject>) acquires ControllerObject {
        let transfer_ref = &borrow_global_mut<ControllerObject>(object::object_address(&my_object)).transfer_ref;
        object::disable_ungated_transfer(transfer_ref);
    }

    fun unfreeze_object(my_object: Object<MovementObject>) acquires ControllerObject {
        let transfer_ref = &borrow_global_mut<ControllerObject>(object::object_address(&my_object)).transfer_ref;
        object::enable_ungated_transfer(transfer_ref);
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

    public fun add_new_object(owner: &signer, obj: Object<MovementObject>) acquires ControllerObject {
        let addr = address_of(owner);
        assert!(object::is_owner(obj, addr), 1);

        let object_address = object::object_address(&obj);
        let extend_ref = &borrow_global<ControllerObject>(object_address).extend_ref;
        let object_signer = object::generate_signer_for_extending(extend_ref);
        move_to(&object_signer, NewObject { new_value: 50 });
    }

    public fun transfer_new_object(owner: &signer, new_owner: address) acquires ControllerObject {
        let transfer_ref = &borrow_global_mut<ControllerObject>(get_object_address(address_of(owner))).transfer_ref;
        let object_signer = object::generate_linear_transfer_ref(transfer_ref);
        object::transfer_with_ref(object_signer, new_owner);
    }

    public entry fun delete(
        caller: &signer,
        object: Object<ControllerObject>,
    ) acquires ControllerObject {
        // Only let caller delete
        let caller_address = address_of(caller);
        assert!(object::is_owner(object, caller_address), E_NOT_OWNER);

        let object_address = object::object_address(&object);

        // Retrieve the delete ref, it is consumed so it must be extracted
        // from the resource
        let ControllerObject {
            extend_ref: _,
            transfer_ref: _,
            delete_ref,
        } = move_from<ControllerObject>(object_address);

        // Delete the object forever!
        object::delete(delete_ref);
    }
}
```