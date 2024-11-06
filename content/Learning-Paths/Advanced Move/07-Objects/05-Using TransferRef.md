# Using TransferRef

**Summary**

- TransferRef provides an alternative method for object transfer without the owner's signer.
- Objects can be frozen or unfrozen using `disable_ungated_transfer` and `enable_ungated_transfer`.
- LinearTransferRef allows for controlled, one-time transfers of objects.
- `TransferRef` is a capability that gives you fine-grained control over object transfers. It allows you to:
    - Enable or disable transfers
    - Implement controlled transfers
    - Transfer objects without the owner's signer

## Transferring Objects Without the Owner's Signer

While ExtendRef allows for transfer functions without the owner's signer, TransferRef offers an alternative method for object transfer.

```ruby
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct ControllerObject has key {
    extend_ref: ExtendRef,
    transfer_ref: TransferRef,
}

fun init_module(owner: &signer) {
    let state_object_constructor_ref = &object::create_named_object(owner, MOVEMENT_OBJECT_NAME);
    let state_object_signer = &object::generate_signer(state_object_constructor_ref);
    move_to(state_object_signer, MovementObject {
        value: 10
    });

    let extend_ref = object::generate_extend_ref(state_object_constructor_ref);
    let transfer_ref = object::generate_transfer_ref(state_object_constructor_ref);
    move_to(state_object_signer, ControllerObject {
        extend_ref,
        transfer_ref
    });
}
```

We can then use `transfer_with_ref` to execute the object transfer:

```ruby
public fun transfer_new_object(owner: &signer, new_owner: address) acquires ControllerObject {
    let transfer_ref = &borrow_global_mut<ControllerObject>(get_object_address(address_of(owner))).transfer_ref;
    let object_signer = object::generate_linear_transfer_ref(transfer_ref);
    object::transfer_with_ref(object_signer, new_owner);
}
```

### **Freezing and Unfreezing Objects**

A key feature of TransferRef in real-world projects is managing object transferability. We can freeze or unfreeze specific objects, which is particularly useful for protecting an object or using it for a specific purpose.

```rust
fun freeze_object(my_object: Object<MovementObject>) acquires ControllerObject {
    let transfer_ref = &borrow_global_mut<ControllerObject>(object::object_address(&my_object)).transfer_ref;
    object::disable_ungated_transfer(transfer_ref);
}

fun unfreeze_object(my_object: Object<MovementObject>) acquires ControllerObject {
    let transfer_ref = &borrow_global_mut<ControllerObject>(object::object_address(&my_object)).transfer_ref;
    object::enable_ungated_transfer(transfer_ref);
}
```

Let's break down the process of using TransferRef for object transfer:

1. **Create a TransferRef:** In the `init_module` function, generate a TransferRef using `object::generate_transfer_ref(state_object_constructor_ref)`.
2. **Store the TransferRef:** Store this TransferRef in the ControllerObject struct, then move it to the object's address.
3. **Implement the transfer function:** In the `transfer_new_object` function:
- a. Retrieve the TransferRef from the ControllerObject.
- b. Generate a linear transfer ref using `object::generate_linear_transfer_ref(transfer_ref)`.
- c. Use `object::transfer_with_ref` to transfer the object to the new owner.
1. **Freezing an object:** To disable transfers, use the `freeze_object` function:
- a. Retrieve the TransferRef from the ControllerObject.
- b. Call `object::disable_ungated_transfer(transfer_ref)` to freeze the object.
1. **Unfreezing an object:** To re-enable transfers, use the `unfreeze_object` function:
- a. Retrieve the TransferRef from the ControllerObject.
- b. Call `object::enable_ungated_transfer(transfer_ref)` to unfreeze the object.

By following these steps, you can effectively manage object transfers and control their transferability using TransferRef.

## Implementing Controlled Transfers

For more precise control over transfers, you can use LinearTransferRef:

`linear_transfer_ref: Option&lt;LinearTransferRef&gt;` implements a controlled transfer mechanism for objects in Aptos Move. Here's a breakdown:

- `LinearTransferRef`:
    - A special type of transfer reference in Aptos Move.
    - Allows for a single, one-time transfer of an object.
    - Once used, the `LinearTransferRef` is consumed and cannot be reused.
- `Option<LinearTransferRef>`:
    - `Option` is a Move type that allows a value to either exist or not.
    - Using `Option` represents the state of the `LinearTransferRef`: either present (Some) or absent (None).

```rust
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct ObjectController has key {
    transfer_ref: TransferRef,
    linear_transfer_ref: Option<LinearTransferRef>,
}

fun allow_single_transfer(object: Object<ObjectController>) acquires ObjectController {
    let object_address = object::object_address(&object);
    let controller = borrow_global_mut<ObjectController>(object_address);

    let linear_transfer_ref = object::generate_linear_transfer_ref(&controller.transfer_ref);
    option::fill(&mut controller.linear_transfer_ref, linear_transfer_ref);
}

fun transfer(owner: &signer, object: Object<ObjectController>, new_owner: address) acquires ObjectController {
    let object_address = object::object_address(&object);
    let controller = borrow_global_mut<ObjectController>(object_address);

    let linear_transfer_ref = option::extract(&mut controller.linear_transfer_ref);
    object::transfer_with_ref(linear_transfer_ref, new_owner);
}
```

Purpose of use:

1. Transfer Control:
    - Using `Option&lt;LinearTransferRef&gt;` controls when transfers are allowed.
    - When `linear_transfer_ref` is `None`, no transfer can occur.
    - When it's `Some(LinearTransferRef)`, a single transfer can be executed.
2. One-time Transfer:
    - Each `LinearTransferRef` can only be used once.
    - After use, it's consumed, and `linear_transfer_ref` returns to the `None` state.
3. Security and Control:
    - This mechanism enables implementation of complex transfer policies.
    - For example, allowing transfers only under specific conditions or within a certain timeframe.

## Conclusion

TransferRef is a powerful tool in Aptos Move that provides fine-grained control over object transfers. By leveraging TransferRef, you can implement sophisticated transfer logic, enhance security, and create more flexible smart contracts.

Always consider the security implications when implementing transfer logic, and thoroughly test your code before deployment.