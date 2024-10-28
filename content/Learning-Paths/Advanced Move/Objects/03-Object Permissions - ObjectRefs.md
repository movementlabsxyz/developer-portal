# Object Permissions - ObjectRefs

## Summary

- ObjectRefs are permissions for object management in Move
- Three types: `ExtendRef`, `TransferRef`, and `DeleteRef`
- `ExtendRef` allows signer generation after object creation
- `TransferRef` enables object transfer without owner's signer
- `DeleteRef` is used for object deletion
- ObjectRefs are generated from `ConstructorRef` during object creation
- Practical example demonstrates generating and storing refs
- Understanding ObjectRefs is crucial for effective object management in Move

## Understanding ObjectRefs in Move

In this tutorial, we'll explore ObjectRefs, which are crucial for managing objects in Move. We'll cover three types of ObjectRefs and their uses.

### What are ObjectRefs?

ObjectRefs are permissions or capabilities for object management, generated from ConstructorRef during object creation. They're different from Object<T> references.

### Types of ObjectRefs

- **ExtendRef:** Allows signer generation after object creation.
    - Can be stored for future use
    - Offers more flexibility than ConstructorRef
- **TransferRef:** Enables object transfer without owner's signer.
    - Can transfer object to a different address
    - Can 'freeze' an object, preventing further transfers
- **DeleteRef:** Used for object deletion.
    - Can be stored
    - One-time use capability

### Practical Application

In the next section, we'll walk through a step-by-step example of generating and storing these refs. This hands-on approach will help solidify your understanding of ObjectRefs and their practical uses in Move programming.

```rust
use aptos_framework::object::{Self, Object, ExtendRef, DeleteRef, TransferRef};
```

```rust
const MOVEMENT_OBJECT_NAME: vector<u8> = b"MovementObjectName";

#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct MovementObject has key {
    value: u64,
    extend_ref: ExtendRef,
    transfer_ref: TransferRef,
    delete_ref: DeleteRef
}

fun init_module(owner: &signer) {
    let state_object_constructor_ref = &object::create_named_object(owner, MOVEMENT_OBJECT_NAME);
    let state_object_signer = &object::generate_signer(state_object_constructor_ref);
    move_to(state_object_signer, MovementObject {
        value: 10,
        extend_ref: object::generate_extend_ref(state_object_constructor_ref),
        transfer_ref: object::generate_transfer_ref(state_object_constructor_ref),
        delete_ref: object::generate_delete_ref(state_object_constructor_ref)
    });
}
```