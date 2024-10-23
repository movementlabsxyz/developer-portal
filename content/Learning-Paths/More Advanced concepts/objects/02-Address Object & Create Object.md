# Address Object & Create Object

## Summary

- Objects are a key feature in the `aptos_framework`, enhancing code flexibility and adaptability.
- They address limitations of structs such as lack of stable identity, limited extensibility, and data overload.
- Objects maintain stable references, allow potential future extensions, and improve data organization.
- Creation involves using functions like `object::create_object`, which generates a unique address for storing resources.
- The process includes getting the owner's address, creating the object, generating an object signer, and moving the object to its address.
- Different types of objects (normal, named, sticky) can be created with varying properties of deletability and address determinism.

## What is Object?

Objects are one of the most exciting features of the aptos_framework. They make your code extremely flexible and help developers be more adaptable in designing and developing products. Objects are also used in many of Aptos' standard code implementations, such as Digital Assets, Coins, and Fungible Tokens.

In this lesson, we will explore what objects are and how they work.

## Limitations of Structs

Reflecting on our previous lessons about structs, we can see that while using structs and a resource-centric approach has made Move very flexible, there are still several limitations:

1. Lack of Stable Identity: Structs can move freely between resources, making them difficult to track consistently.
2. Limited Extensibility: Once defined, structs cannot be easily extended with new fields, even in upgradable modules.
3. Data Overload: Storing numerous resources in accounts can lead to clutter, making it challenging to locate relevant data for specific decentralized applications (dApps).

**Using objects in this way allows us to:**

1. Maintain a stable reference to our data via the object's address.
2. Potentially extend the object's functionality in future upgrades.
3. Keep related data grouped together, improving organization.

## Create a Object

```rust
module movement::object_module_entry {
    use aptos_framework::object;
    use std::debug::print;
    use std::signer;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct ExampleObject has key {
        value: u64
    }

    public entry fun example_object(user: &signer, value: u64) {
        let owner_address = signer::address_of(user);
        print(&owner_address);

        let example_object_constructor_ref = &object::create_object(owner_address);
        print(example_object_constructor_ref);

        let object_signer = &object::generate_signer(example_object_constructor_ref);
        print(object_signer);

        move_to(object_signer, ExampleObject { value });

        let address_object = object::address_from_constructor_ref(example_object_constructor_ref);
        print(&address_object);
    }

    #[test(account = @0x1)]
    fun test_example_object(account: &signer) {
        example_object(account, 10);
    }
}
```

Certainly! I'll provide a step-by-step description of the `example_object` function from the code you've selected. This function demonstrates how to create and use objects in the Aptos framework:

1. Function Signature:

```rust
public entry fun example_object(user: &signer, value: u64)
```

This function takes two parameters: a reference to a signer (the user) and a u64 value.

1. Get the owner's address:

```rust
let owner_address = signer::address_of(user);
```

This step retrieves the address of the signer and prints it.

1. Create an object:

```rust
let example_object_constructor_ref = &object::create_object(owner_address);
```

Here, a new object is created using the`create_object`function from the`object`module. The constructor reference is stored. This function returns a randomly generated and unique object address. This address will be used to store resources instead of storing them directly in the user's address. This approach reduces the storage burden on user accounts, making it more optimized and flexible.

1. Generate an object signer:

```rust
let object_signer = &object::generate_signer(example_object_constructor_ref);
```

This step generates a signer for the object using the constructor reference.

1. Move the ExampleObject to the object's address:

```rust
move_to(object_signer, ExampleObject { value });
```

This moves an instance of `ExampleObject` with the given value to the address of the object signer.

1. Get the object's address:

```rust
let address_object = object::address_from_constructor_ref(example_object_constructor_ref);
```

Finally, the function retrieves the address of the created object using the constructor reference and prints it.

```rust
[debug] @0x1 // Address Signer
[debug] 0x1::object::ConstructorRef { // Create address object
  self: @0xe46a3c36283330c97668b5d4693766b8626420a5701c18eb64026075c3ec8a0a,
  can_delete: true
}
[debug] signer(@0xe46a3c36283330c97668b5d4693766b8626420a5701c18eb64026075c3ec8a0a) // signer
[debug] @0xe46a3c36283330c97668b5d4693766b8626420a5701c18eb64026075c3ec8a0a
```

1. Additionally, instead of retrieving the object's address, you can also directly obtain the object through this function:

```rust
let object_info = object::object_from_constructor_ref<ExampleObject>(example_object_constructor_ref);
```

Finally, the test results will return additional inner objects of that struct:

```rust
[debug] 0x1::object::Object<0x6f409ba3234fa3b9a8baf7d442709ef51f39284f35dd7c06360fa0b55a0cd690::object_module_entry::ExampleObject> {
  inner: @0xe46a3c36283330c97668b5d4693766b8626420a5701c18eb64026075c3ec8a0a
}
```

In addition to the `object::create_object` function, we have other functions to create objects:

- `object::create_object`: A **normal Object |** This type is `deletable` and has a `random address`
- `object::create_named_object` : A **named Object |** This type is **`not** deletable` and has a `deterministic address`
- `object::create_sticky_object` : A **sticky Object |** This type is also **`not** deletable` and has a `random address`