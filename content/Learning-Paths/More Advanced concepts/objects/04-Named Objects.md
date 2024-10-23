# Named Objects

## Summary

- Named objects in Move allow for easy retrieval and manipulation of object data
- The module demonstrates creation, retrieval, and modification of a Object
- Named objects use a fixed address, making them more convenient than default or sticky objects
- The module includes test functions to verify correct behavior of main functions
- Global storage methods like `borrow_global` and `borrow_global_mut` are used to access object data

## Named Object

In the previous section, we learned about three types of Objects, among which named objects will likely be the type we use most often because we can initialize an object address that is fixed and can be easily retrieved through the Object Name Address. As for default objects and sticky objects, both create a random address. This makes it difficult to use them for querying or listing information, but they also have their uses in certain cases.

In this section, we will use named objects to easily obtain the address for storing an object.

```rust
module movement::object_module_entry {
    use aptos_framework::object;
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

    #[test(account = @0x1)]
    fun test_get_object_address(account: &signer) {
        test_init_module(account);
        let owner = address_of(account);
        let addr = get_object_address(owner);
        print(&addr);
    }
}
```

```rust
[debug] @0x52152ca68792cb72eb58f6497c1c8fbe69f5fc5d938edf2e74ed8da6ae816622 // Object Address
```

By using named objects, we can easily access the object and perform changes or view data.

### Modify & Retrieve Object Value

To modify and retrieve data from objects, we still use global storage methods like `borrow_global` and `borrow_global_mut`.

```rust
public fun get_value(owner: address): u64 acquires MovementObject {
    borrow_global<MovementObject>(get_object_address(owner)).value
}

public fun set_value(owner: address, new_value: u64) acquires MovementObject {
    let spider_dna = borrow_global_mut<MovementObject>(get_object_address(owner));
    spider_dna.value = new_value;
}
```

## Full Code

```rust
module movement::object_module_entry {
    use aptos_framework::object;
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

    public fun get_value(owner: address): u64 acquires MovementObject {
        borrow_global<MovementObject>(get_object_address(owner)).value
    }

    public fun set_value(owner: address, new_value: u64) acquires MovementObject {
        let spider_dna = borrow_global_mut<MovementObject>(get_object_address(owner));
        spider_dna.value = new_value;
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

## Function Descriptions

### 1. init_module(owner: &signer)

This function initializes the module by creating a named object and setting its initial value.

- Creates a named object using `object::create_named_object`
- Generates a signer for the object using `object::generate_signer`
- Moves a `MovementObject` with an initial value of 10 to the object's address

### 2. get_object_address(owner: address): address

This function retrieves the address of the named object for a given owner.

- Uses `object::create_object_address` to calculate the object's address
- Returns the calculated address

### 3. get_value(owner: address): u64

This function retrieves the current value stored in the MovementObject for a given owner.

- Calls `get_object_address` to get the object's address
- Uses `borrow_global` to access the MovementObject at the calculated address
- Returns the `value` field from the MovementObject

### 4. set_value(owner: address, new_value: u64)

This function updates the value stored in the MovementObject for a given owner.

- Calls `get_object_address` to get the object's address
- Uses `borrow_global_mut` to get a mutable reference to the MovementObject
- Updates the `value` field with the new value

### Test Functions

The module includes several test functions to verify the correct behavior of the main functions:

- `test_init_module`: Initializes the module for testing
- `test_get_object_address`: Tests the `get_object_address` function
- `test_get_object`: Tests the `get_value` function
- `test_set_object`: Tests the `set_value` function