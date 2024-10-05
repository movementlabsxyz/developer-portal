# Using ExtendRef

## Summary

- `ExtendRef` in Aptos Move allows generating a signer for an object after creation
- Key use cases include adding ownership capabilities and enhancing object functionality
- Implementation involves storing, retrieving, and using ExtendRef with `object::generate_signer()`
- Important to use `ExtendRef` judiciously and protect it carefully
- Common pitfalls include exposing ExtendRef publicly and unnecessary usage
- Proper use of `ExtendRef` enables flexible and safe extension of object functionality

## Why ExtendRef?

`ExtendRef` allows us to generate a signer for an object after it has been created. This is crucial because:

- A signer can only be created once using ConstructorRef when the object is initialized.
- After object creation, we lose access to ConstructorRef.

## Use Cases for ExtendRef

- Adding ownership capabilities to objects
- Enhancing object functionality post-creation
- Facilitating digital asset operations

## How to Use ExtendRef

1. Store ExtendRef: When creating an object, store ExtendRef in a field of the object.
2. Retrieve ExtendRef: Write a function to retrieve ExtendRef from the object.
3. Use ExtendRef: Use `object::generate_signer()` to create a signer from ExtendRef.

In this example, we'll create an ExtendRef and store it in a separate resource, which we'll use for future extension purposes.

```rust
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct ControllerObject has key {
    extend_ref: ExtendRef
}

fun init_module(owner: &signer) {
    let state_object_constructor_ref = &object::create_named_object(owner, MOVEMENT_OBJECT_NAME);
    let state_object_signer = &object::generate_signer(state_object_constructor_ref);
    move_to(state_object_signer, MovementObject {
        value: 10
    });

    let extend_ref = object::generate_extend_ref(state_object_constructor_ref);
    move_to(state_object_signer, ControllerObject { extend_ref });
}
```

In the code above, we initialize two resources: MovementObject and ControllerObject. We create a separate object to store these two resources independently. In the future, if I want to add more resources, I'll use the ExtendRef in ControllerObject to do so.

```rust
#[resource_group_member(group = aptos_framework::object::ObjectGroup)]
struct NewObject has key {
    new_value: u64
}
```

I'm creating an additional resource to add to the object address that I created in the `init_module` function, and I'm creating a function to add this resource.

```rust
// This function adds a new object to an existing object using ExtendRef
// Parameters:
//   - owner: The signer who owns the object
//   - obj: The object to which we want to add a new object
// The function does the following:
public fun add_new_object(owner: &signer, obj: Object&lt;MovementObject&gt;) acquires ControllerObject {
    // 1. Verifies that the owner is indeed the owner of the object
    let addr = address_of(owner);
    assert!(object::is_owner(obj, addr), 1);
    
    // 2. Retrieves the ExtendRef from the ControllerObject
    let object_address = object::object_address(&obj);
    let extend_ref = &borrow_global<ControllerObject>(object_address).extend_ref;
    
    // 3. Generates a signer for the object using the ExtendRef
    let object_signer = object::generate_signer_for_extending(extend_ref);
    
    // 4. Creates and moves a new NewObject to the object's address
    move_to(&object_signer, NewObject { new_value: 50 });
}
```

The test case for this scenario will be:

```rust
#[test(account = @0x1)]
fun test_add_new_object(account: &signer) acquires ControllerObject, NewObject {
    test_init_module(account);
    let addr = address_of(account);
    let obj = get_object(addr);

    add_new_object(account, obj);

    let movement_object_address = get_object_address(addr);
    assert!(exists<NewObject>(movement_object_address), 0);

    let new_object_data = borrow_global<NewObject>(movement_object_address);
    assert!(new_object_data.new_value == 50, 1);
}
```

## Important Considerations

- Only use ExtendRef when necessary.
- Protect ExtendRef carefully as it allows creating the object's signer.
- Thoroughly check access to functions using ExtendRef.

## Common Pitfalls to Avoid

- Don't expose ExtendRef publicly without proper safeguards.
- Avoid unnecessary use of ExtendRef when simpler alternatives exist.
- Don't forget to handle potential errors when using ExtendRef.

By leveraging ExtendRef, you can flexibly and safely extend object functionality in Move.

### Full Code

```ruby
module movement::object_module_entry {
    use aptos_framework::object::{Self, Object, ExtendRef, TransferRef, DeleteRef};
    use std::signer::address_of;
    use std::debug::print;

    const MOVEMENT_OBJECT_NAME: vector<u8> = b"MovementObjectName";

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
        extend_ref: ExtendRef
    }

    fun init_module(owner: &signer) {
        let state_object_constructor_ref = &object::create_named_object(owner, MOVEMENT_OBJECT_NAME);
        let state_object_signer = &object::generate_signer(state_object_constructor_ref);
        move_to(state_object_signer, MovementObject {
            value: 10
        });

        let extend_ref = object::generate_extend_ref(state_object_constructor_ref);
        move_to(state_object_signer, ControllerObject { extend_ref });
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

    #[test(account = @0x1)]
    fun test_add_new_object(account: &signer) acquires ControllerObject, NewObject {
        test_init_module(account);
        let addr = address_of(account);
        let obj = get_object(addr);

        add_new_object(account, obj);

        let movement_object_address = get_object_address(addr);
        assert!(exists<NewObject>(movement_object_address), 0);

        let new_object_data = borrow_global<NewObject>(movement_object_address);
        assert!(new_object_data.new_value == 50, 1);
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